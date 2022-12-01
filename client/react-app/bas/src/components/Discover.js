import React from 'react'
import Searchbar from './Searchbar'

const Discover = () => {
  return (
    <div className="flex flex-col m-8">
        <div className='w-full flex flex-col justify-between items-center mb-5'>
            <h2 className='font-semibold text-white text-5xl text-left'>Discover</h2>
        </div>
        <Searchbar />
        <div className='flex flex-wrap justify-center gap-8 text-white'>
        </div>
    </div>
  )
}

export default Discover