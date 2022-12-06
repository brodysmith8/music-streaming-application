import React from 'react'
import {BsDisc , BsThreeDotsVertical} from 'react-icons/bs'
import {AiFillYoutube} from 'react-icons/ai'
import { useState } from 'react'

const Trackcard = ({track}) => {
  
  const [toggeled, setToggled] = useState(false);

  return (
    <div className='my-4 p-4'>
        <div className='flex flex-row w-full justify-between items-center p-4 hover:bg-[#330404] rounded-t-sm' onClick={() => setToggled(!toggeled)}>
          <div className='flex'>
            <div className='flex flex-col justify-center items-center w-16 h-16 rounded-sm bg-white'>
              <BsDisc className='w-10 h-10'/>
            </div>
            <div className='ml-4 h-full items-stretch'>
              <h1 className='text-white text-3xl object-top'>{track.track_title}</h1>
              <h3 className='text-gray-300 object-bottom'>Song by {track.artist_name}</h3>
            </div>
          </div>
          <div className='object-right'>
            <BsThreeDotsVertical className='fill-white'/>
          </div>
        </div>
        <div>
          {toggeled &&
            <div className='flex flex-row justify-between items-center w-ful p-4 bg-white'> 
              <div className='flex flex-col text-[#330404]'>
                <h4>Track ID: {track.track_id}</h4>
                <h4>Track Length: {track.track_duration_seconds}s</h4>
              </div>
              <div>
                <AiFillYoutube className='fill-[#330404] hover:fill-red-500' size={40} />
              </div>
            </div>
          }
        </div>
    </div>
  )
}

export default Trackcard