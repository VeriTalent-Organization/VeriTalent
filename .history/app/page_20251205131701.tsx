import MaxWidthContainer from '@/components/reuseables/max_width_container'
import Icons from '@/lib/configs/icons.config'
import Image from 'next/image'
import React from 'react'

const Home = () => {
  return (
    <MaxWidthContainer large>
      <div className='flex items-center py-6 border'>
        <Image height={200} width={200} alt='veritalent logo' src={Icons.veritalentLogo}/>
      </div>
    </MaxWidthContainer>
  )
}

export default Home