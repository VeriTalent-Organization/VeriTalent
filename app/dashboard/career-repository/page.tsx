import CareerRepositoryPage from '@/components/Dashboard/career-repo/career-repository-page'
import React from 'react'
import RoleGuard from '@/components/guards/RoleGuard'

const CareerRepository = () => {
  return (
    <RoleGuard allowedRoles={['talent']}>
      <CareerRepositoryPage/>
    </RoleGuard>
  )
}

export default CareerRepository