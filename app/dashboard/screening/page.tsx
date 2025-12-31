import React from 'react'
import DashboardContent from '@/components/Dashboard/screening-interface/dashboardContent'
import RoleGuard from '@/components/guards/RoleGuard'

const Screening = () => {
  return (
    <RoleGuard allowedRoles={['recruiter', 'org_admin']}>
      <DashboardContent/>
    </RoleGuard>
  )
}

export default Screening