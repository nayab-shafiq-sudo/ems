import React, { useCallback, useEffect, useState } from 'react'
import Loading from '../components/Loading'
import PayslipList from '../components/payslip/PayslipList'
import GenratePayslipForm from '../components/payslip/GenratePayslipForm'
import { useAuth } from '../context/AuthContext'
import toast from "react-hot-toast"
import api from '../api/Axios'


const PaySlip = () => {

  const [paySlips, setPaySlips] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const {user} = useAuth()
  const isAdmin = user?.role === "ADMIN";

  const fetchPaySlips = useCallback(async()=>{
    try {
      const res = await api.get('/payslips')
      setPaySlips(res.data.data || [])
    } catch (error) {
      toast.error(error?.response?.data?.error || error?.message)
    } finally {
      setLoading(false)
    }
  },[])

  useEffect(()=>{
    fetchPaySlips()
  },[fetchPaySlips])

  useEffect(()=>{
    if (isAdmin) api.get('/employees').then((res)=> setEmployees(res.data.filter((e)=> !e.isDeleted))).catch(()=>{})
  },[isAdmin])

  if (loading) return <Loading/>

  return (
    <div className='animate-fade-in'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
        <div className=''>
          <h1 className='page-title'>Payslips</h1>
          <p className='page-subtitle'>{isAdmin ? "Genrate and manage eployee payslips" : "Your payslip history"}</p>
        </div>
        {isAdmin && <GenratePayslipForm employees={employees} onSuccess={fetchPaySlips}/>}
      </div>
      <PayslipList payslips={paySlips} isAdmin={isAdmin} />
    </div>
  )
}

export default PaySlip
