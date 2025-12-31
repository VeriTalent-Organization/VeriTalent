import React from 'react'
import RecommendationIssuance from '@/components/Dashboard/screening-interface/recommendationIssuance'
import RoleGuard from '@/components/guards/RoleGuard'

const Recommendation = () => {
  return (
    <RoleGuard allowedRoles={['recruiter']}>
      <RecommendationIssuance/>
    </RoleGuard>
  )
}

export default Recommendation