import { Loader2, Plus, X } from 'lucide-react'
import React, { useState } from 'react'

const GenratePayslipForm = ({employees, onSuccess}) => {
    const [isOpen, setisOpen] = useState(false)
    const [loading, setloading] = useState(false)

    if (!isOpen) return (
        <button onClick={()=>setisOpen(true)} className='btn-primary flex items-center gap-2'>
            <Plus className='w-4 h-4'/> Genrate Payslip
        </button>
    )
    const handleSubmit = async (e) => {
        e.preventDefault();
    }
  return (
    <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
      <div className='card max-w-lg w-full p-6 animate-slide-up'>
        <div className='flex justify-between items-center mb-6'>
            <h3 className='text-lg font-bold text-slate-900'>Genrate Monthly Payslip</h3>
            <button onClick={()=>setisOpen(false)} className='text-slate-400 hover:text-slate-600 p-1'>
                <X size={20}/>
            </button>
        </div>
        {/** FORM */}
        <form onSubmit={handleSubmit} className='space-y-4'>
            {/** SELECT EMPLOYEE */}
            <div>
                <label className='block text-sm font-medium text-slate-700 mb-2'>
                    Employee
                </label>
                <select name="employeeId" required>
                    {employees.map((e)=>(
                        <option key={e.id} value={e.id}>
                            {e.firstName} {e.lastName} ({e.position})
                        </option>
                    ))}
                </select>
            </div>

            {/** SELECT MONTH & YEAR */}
            <div className='grid grid-cols-2 gap-4'>
                <div>
                    <label className='block text-sm font-medium text-slate-700 mb-2'>
                        Month
                    </label>
                    <select name="month" >
                        {Array.from({length: 12},(_, i) => i+1).map((m)=>(
                            <option value="m" key={m}>{m}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className='block text-sm font-medium text-slate-700 mb-2'>
                        Year
                    </label>
                    <input type="number" defaultValue={new Date().getFullYear()} name="year" />
                </div>
            </div>

            {/** BASIC SALARY */}
            <div>
                <label className='block text-sm font-medium text-slate-700 mb-2'>
                    Basic Salary
                </label>
                <input type="number" required placeholder='50000' name="basicSalary" />
            </div>

            {/** ALLOWANCE & DEDUCTION */}
            <div className='grid grid-cols-2 gap-4'>
                <div>
                    <label className='block text-sm font-medium text-slate-700 mb-2'>
                        Allowance
                    </label>
                    <input type="number" defaultValue="0" name="allowance" />
                </div>
                <div>
                <label className='block text-sm font-medium text-slate-700 mb-2'>
                    Deduction
                </label>
                <input type="number" defaultValue="0" name="deduction" />
                </div>
            </div>

            {/** BUTTONS */}
            <div className='flex items-center justify-end gap-3 pt-2'>
                <button onClick={()=> setisOpen(false)} type='button' className='btn-secondary '>Cancel</button>
                <button type='submit' disabled={loading} className='btn-primary flex items-center'>{loading && <Loader2 className='w-4 h-4 mr-2 animate-spin'/>}Genrate</button>
            </div>
        </form>
      </div>
    </div>
  )
}

export default GenratePayslipForm
