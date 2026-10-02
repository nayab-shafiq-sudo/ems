import { Download } from "lucide-react"
import { format } from 'date-fns'

const PayslipList = ({payslips, isAdmin}) => {
  return (
    <div className='card overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='table-modern'>
                <thead>
                    <tr>
                        {isAdmin && <th>Employee</th>}
                        <th>Period</th>
                        <th>Basic Salary</th>
                        <th>Net Salary</th>
                        <th className='text-center'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {payslips.length === 0 ? (
                        <tr>
                            <td colSpan={isAdmin ? 5 : 4} className='text-center py-12 text-slate-400'>
                                No Payslips found
                            </td>
                        </tr>
                    ) : (
                        payslips.map((slip)=>{
                            return (
                                <tr key={slip._id || slip.id}>
                                    {isAdmin && (
                                        <td className=' text-slate-900'>
                                            {slip.employee?.firstName}
                                            {slip.employee?.lastName}
                                        </td>
                                    )}
    
                                    <td className='text-slate-500'>
                                        {format(new Date(slip.year, slip.month -1), "MMM yyy")}
                                    </td>
    
                                    <td className='text-slate-500'>
                                        ${slip.basicSalary?.toLocaleString()}
                                    </td>
    
                                    <td className='font-medium text-slate-800'>
                                        ${slip.netSalary?.toLocaleString()}
                                    </td>

                                    <td className='text-center'>
                                        <button onClick={()=>window.open(`/print/payslips/${slip._id || slip.id}`)} className='inline-flex items-center px-3 py-1.5 text-xs font-medium rounded text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors ring-1 ring-blue-600/10'>
                                            <Download className="w-3 h-3 mr-1.5"/>
                                        </button>
                                    </td>
    
                                </tr>
                            )
    
                        })
                    )} 
                </tbody>
            </table>
          </div>
        </div>
  )
}

export default PayslipList
