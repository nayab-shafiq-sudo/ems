import React, { useCallback, useEffect, useState } from 'react'
import { dummyLeaveData } from '../assets/assets'
import Loading from '../components/Loading'
import { PalmtreeIcon, PlusIcon, ThermometerIcon, UmbrellaIcon } from 'lucide-react'
import LeaveHistory from '../components/leaves/LeaveHistory'
import ApplyLeavesModal from '../components/leaves/ApplyLeavesModal'

const Leaves = () => {

  const [leaves, setLeaves] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [isDeleted, setIsDeleted] = useState(false)

  const isAdmin = false;

  const fetchLeaves = useCallback(()=>{
    setLeaves(dummyLeaveData)
    setTimeout(() => {
      setLoading(false)
    }, 1000);
  },[])

  useEffect(()=>{
    fetchLeaves()
  },[fetchLeaves])

  if (loading) return <Loading/>

  const approvedLeaves = leaves.filter((l)=> l.status === "APPROVED");
  const sickCount = leaves.filter((l)=> l.type === "SICK").length;
  const anualCount = leaves.filter((l)=> l.type === "ANNUAL").length;
  const casualCount = leaves.filter((l)=> l.type === "CASUAL").length;

  const leavesStats = [
    {label: "Sick Leave", value: sickCount, icon: <ThermometerIcon/>},
    {label: "Anual Leave", value: anualCount, icon: <PalmtreeIcon/>},
    {label: "Casual Leave", value: casualCount, icon: <UmbrellaIcon/>},
  ]

  return (
    <div className='animate-fade-in'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
        <div>
          <h1 className='page-title'>Leave Management</h1>
          <p className='page-subtitle'>{isAdmin ? "Manage leave application" : "Your leave history and request"}</p>
        </div>
        {!isAdmin && !isDeleted && (
          <button onClick={()=>setShowModal(true)} className='btn-primary flex items-center gap-2 w-full sm:w-auto justify-center'>
            <PlusIcon className='w-4 h-4'/> Apply for leave
          </button>
        )}
      </div>
      {!isAdmin && (
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8'>
          {leavesStats.map((stats)=> (
            <div key={stats.label} className='card card-hover p-5 sm:p-6 flex items-center gap-4 relative overflow-hidden group'>
              <div className='absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-slate-500/70 group-hover:bg-indigo-500/70'/>
              <div className='p-3 bg-slate-100 rounded-lg group-hover:bg-indigo-50 transition-colors duration-200'>
                {<p className='w-5 h-5 text-slate-600 group-hover:text-indigo-600 transition-colors duration-200'>{stats.icon}</p>}
              </div>
              <div>
                <p className='text-sm text-slate-500'>{stats.label}</p>
                <p className='text-2xl font-bold text-slate-900 tracking-tight'>{stats.value}<span className='text-sm font-normal text-slate-400 ml-1'>taken</span></p>
              </div>
            </div>
          ))}
        </div>
      )}
      <LeaveHistory leaves={leaves} isAdmin={isAdmin} onUpdate={fetchLeaves} />
      <ApplyLeavesModal open={showModal} onClose={()=>setShowModal(false)} onSuccess={fetchLeaves}/>
    </div>
  )
}

export default Leaves
