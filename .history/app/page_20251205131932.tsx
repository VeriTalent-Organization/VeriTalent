import MaxWidthContainer from '@/components/reuseables/max_width_container'
import { Text } from '@/components/reuseables/text'
import Icons from '@/lib/configs/icons.config'
import Image from 'next/image'
import React from 'react'

const Home = () => {
  return (
    <MaxWidthContainer large >
      <div className='flex items-center py-6'>
        <Image height={200} width={200} alt='veritalent logo' src={Icons.veritalentLogo}/>
      </div>
      <div className='flex items-center justify-center'>
        <Text as='h1' variant='Heading'>Welcome to <span>Verit</span></Text>
      </div>
    </MaxWidthContainer>
  )
}

export default Home