import { cron, Inngest } from "inngest";
import attendanceModel from "../models/Attendance.js";
import employeeModel from "../models/Employee.js";
import leaveModel from "../models/LeaveApplication.js";
import sendEmail from "../config/nodeMailer.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "fullstack--ems" });

// Auto-check-out for employees
const autoCheckOut = inngest.createFunction(
    {id: "auto-check-out", triggers: [{event: "employee/check-out"}]},
    async ({ event, step }) => {
        const {employeeId, attendanceId} = event.data;

        // wait for 9 hours
        await step.sleepUntil("wait-for-the-9-hours", new Date(new Date().getTime() +9*60*60*1000))

        // get attendance data
        let attendance = await attendanceModel.findById(attendanceId)
        if (!attendance?.checkOut) {
            // get employee data
            const employee = await employeeModel.findById(employeeId)
            // send reminder email
            await sendEmail({
                to: employee.email,
                subject: "Attendance Check-Out Reminder",
                body: ` <div style="max-width: 600px;">
                                <h2>Hi ${employee.firstName}, 👋</h2>

                                <p style="font-size: 16px;">
                                    You have a check-in in ${employee.department} today:
                                </p>

                                <p style="font-size: 18px; font-weight: bold; color: #007bff; margin: 8px 0;">
                                    ${attendance?.checkIn?.toLocaleTimeString()}
                                </p>

                                <p style="font-size: 16px;">
                                    Please make sure to check-out in one hour.
                                </p>

                                <p style="font-size: 16px;">
                                    If you have any questions, please contact your admin.
                                </p>

                                <br />

                                <p style="font-size: 16px;">Best Regards,</p>
                                <p style="font-size: 16px;">EMS</p>
                            </div>`
            })

            // after 10 hours mark attendance as checkOut with status "LATE"
            await step.sleepUntil("wait-for-the-1-hour", new Date(new Date().getTime() +1*60*60*1000))
            attendance = await attendanceModel.findById(attendanceId)
            if (!attendance?.checkOut) {
                attendance.checkOut = new Date(attendance.checkIn).getTime() +4*60*60*1000;
                attendance.workingHours = 4;
                attendance.dayType = "Half Day";
                attendance.status = "LATE";
                await attendance.save();
            }
        }
    }
)


// send email to admin, if admin doesnt take action or leave application within 24 hours
const leaveApplicationReminder = inngest.createFunction(
    {id: "leave-application-reminder", triggers: [{event: "leave/pending"}]},
    async ({event, step}) => {
        const {leaveApplicationId} = event.data;

        // wait for 24 hours 
        await step.sleepUntil("wait-for-24-hours", new Date(new Date().getTime() +24*60*60*1000))

        const leaveApplication = await leaveModel.findById(leaveApplicationId)
        if (leaveApplication?.status === "PENDING") {
            const employee = await employeeModel.findById(leaveApplication.employeeId)

            // send reminder email to admin to take action on leave application
            await sendEmail({
                to: process.env.ADMIN_EMAIL,
                subject: "Leave Application Reminder",
                body: `
                        <div style="max-width: 600px;">
                            <h2>Hi Admin, 👋</h2>

                            <p style="font-size: 16px;">
                                You have a leave application in
                                ${employee.department} today:
                            </p>

                            <p style="font-size: 18px; font-weight: bold; color: #007bff; margin: 8px 0;">
                                ${leaveApplication?.startDate?.toLocaleDateString()}
                            </p>

                            <p style="font-size: 16px;">
                                Please make sure to take action on this leave application.
                            </p>

                            <br />

                            <p style="font-size: 16px;">Best Regards,</p>
                            <p style="font-size: 16px;">EMS</p>
                        </div>
                    `
            })
        }
    }
)

// cron: check attendance at 11:30 am PKT and email absent employee 
const attendanceReminderCron = inngest.createFunction(
    {id: "attendance-reminder-cron", triggers: [{cron: "30 6 * * * "}]}, // 11:30 AM Pakistan time (PKT)
    async ({ step}) => {
        // step1: get todays date range (ist)
        const today = await step.run("get-today-date", ()=>{
            const startUTC = new Date(new Date().toLocaleDateString('en-CA', {timeZone: "Asia/Karachi"}) + "T00:00:00+05:00");
            const endUTC = new Date(startUTC.getTime() + 24*60*60*1000);
            return {startUTC: startUTC.toISOString(), endUTC: endUTC.toISOString()}
        })
        // step2: get all active. non deleted employees
        const activeEmplyees = await step.run
            ("get-active-employees", async () => {
                const employees = await employeeModel.find({
                    isDeleted: false,
                    employmentStatus: "ACTIVE"
                }).lean()
                return employees.map((e)=>({_id: e._id.toString(), firstName: e.firstName, lastName: e.lastName, email: e.email, department: e.department}))
        })
        // step3: get employees ids on approve leave today
        const onLeavIds = await step.run("get-on-leave-ids", async ()=>{
            const leaves = await leaveModel.find({
                status: "APPROVED",
                startDate: { $lte: new Date(today.endUTC) },
                endDate: { $gte: new Date(today.startUTC) },
            }).lean();
            return leaves.map((l)=>l.employeeId.toString())
        })
        // step4: get employees id who already checked in today
        const checkInId = await step.run("get-checked-in-ids", async ()=>{
            const attendances = await attendanceModel.find({
                date: { $gte: new Date(today.startUTC), $lt: new Date(today.endUTC)},
            }).lean()
            return attendances.map((a)=>a.employeeId.toString())
        })
        // step5: filter absent employees (not on leave & not checked in)
        const absentEmployees = activeEmplyees.filter((emp)=> !onLeavIds.includes(emp._id) && !checkInId.includes(emp._id))

        // step6: send reminder email
        if (absentEmployees.length > 0) {
            await step.run("send-reminder-email", async()=>{
                const emailPromises = absentEmployees.map((emp)=>{
                    // send email
                    sendEmail({
                        to: emp.email,
                        subject: "Attendance Reminder - Please Mark your Attendance",
                        body: `
                            <div style="max-width: 600px; font-family: Arial, sans-serif;">
                                <h2>Hi ${emp.firstName}, 👋</h2>
                                <p style="font-size: 16px;">We noticed you haven't marked your attendance yet today.</p>
                                <p style="font-size: 16px;">The deadline was <strong>11:30 AM</strong> and your attendance is still missing.</p>
                                <p style="font-size: 16px;">Please check in as soon as possible or contact your admin if you're facing any issues.</p>
                                <br />
                                <p style="font-size: 14px; color: #666;">Department: ${emp.department}</p>
                                <br />
                                <p style="font-size: 16px;">Best Regards,</p>
                                <p style="font-size: 16px;"><strong>QuickEMS</strong></p>
                            </div>
                        `
                    })
                })
            })
        }
        return {totalActive: activeEmplyees.length, onLeave: onLeavIds.lenght, checkedIn: checkInId.lenght, absent: absentEmployees.lenght}
    }
)

// Create an empty array where we'll export future Inngest functions
export const functions = [autoCheckOut, leaveApplicationReminder, attendanceReminderCron];