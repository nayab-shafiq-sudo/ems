import { ArrowRightIcon, CalendarIcon, DollarSignIcon, FileTextIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

const EmployeeDashboard = ({data}) => {
    const emp = data.employee

    const card = [
        {icon: CalendarIcon, value: data.currentMonthAttendance, title: "Days Present", Subtitle: "This month"},
        {icon: FileTextIcon, value: data.pendingLeaves, title: "Pending Leaves", Subtitle: "Awaiting Approval"},
        {icon: DollarSignIcon, value: data.latestPayslip ? `$${data.latestPayslip.netSalary?.toLocaleString()}`: "N/A", title: "Latest Payslip", Subtitle: "Most recent payout"},
    ]
  return (
    <div className='animate-fade-in'> 

      <div className='page-header'>
        <h1 className='page-title'>Welcome, {emp?.firstName}!</h1>
        <p className='page-subtitle'>
            {emp?.position} - {emp?.department || "No Department"}
        </p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8'>
        {card.map((item, idx)=>(
            
            <div key={idx} className='card card-hover p-5 sm:p-6 relative overflow-hidden group flex items-center justify-between'>
                <div>
                    <div className='absolute top-0 left-0 bottom-0 w-1 rounded-r-full bg-slate-500/70'/>
                    <p className='text-sm text-slate-700 font-medium'>{item.title}</p>
                    <p className='text-2xl font-bold text-slate-900 mt-1'>{item.value}</p>
                </div>
                <item.icon className='size-10 p-2.5 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors duration-200' />
            </div>
        ))}
      </div>

        <div className='flex flex-col sm:flex-row gap-3'>
            <Link to='/attendance' className='btn-primary text-center inline-flex items-center justify-center gap-2'>
                Mark Attendance <ArrowRightIcon className='w-4 h-4'/>
            </Link>
            <Link to='/leave' className='btn-secondary text-center'>
                Apply for leave 
            </Link>
        </div>

    </div>
  )
}

export default EmployeeDashboard
