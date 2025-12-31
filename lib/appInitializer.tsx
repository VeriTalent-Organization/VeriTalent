// 'use client';

// import { useEffect } from 'react';
// import { useCreateUserStore } from '@/lib/stores/form_submission_store';
// import { hydrateUserProfile } from '@/lib/services/authService';

// const AppInitializer = () => {
//   const { user } = useCreateUserStore();

//   useEffect(() => {
//     if (user?.token) {
//       hydrateUserProfile();
//     }
//   }, [user?.token]);

//   return null;
// };

// export default AppInitializer;
