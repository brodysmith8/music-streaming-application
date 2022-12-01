import React from 'react'
import Searchbar from './Searchbar'
import { useState, useEffect } from 'react';

const Discover = () => {
  return (

    <div className="flex flex-col w-5/6 m-8">
        <div>
          <div className='flex flex-col justify-between items-left mb-5'>
              <h2 className='font-semibold text-white text-5xl text-left'>Discover</h2>
          </div>
          <Searchbar />
        </div>
        <div className='flex flex-wrap justify-left gap-8 text-white'>

        </div>

    </div>

  )
}

export default Discover