import React from 'react'
import {BsDisc , BsThreeDotsVertical} from 'react-icons/bs'
import {AiFillYoutube} from 'react-icons/ai'
import { useState } from 'react'

const Trackcard = ({track}) => {
  
  const [toggeled, setToggled] = useState(false);
  const ytQueryName = track.track_title.replace(/\s/g, "+");
  const ytQueryArtist = track.artist_name.replace(/\s/g, "+");

  return (
    <div className='my-4 p-2 hover:bg-[#330404]  hover:p-4 rounded-t-sm' style={{backgroundColor: toggeled ? '#330404':''}} onClick={() => setToggled(!toggeled)} >
        <div className='flex flex-row w-full justify-between items-center  '>
          <div className='flex'>
            <div className='flex flex-col justify-center items-center w-16 h-16 rounded-sm bg-white'>
              <BsDisc className='w-10 h-10'/>
            </div>
            <div className='ml-4 h-full items-stretch'>
              <h1 className='text-white text-3xl object-top'>{track.track_title}</h1>
              <h3 className='text-gray-300 object-bottom'>Song by {track.artist_name}</h3>
            </div>
          </div>
          <div>
            <BsThreeDotsVertical className='fill-white hover:fill-red-500' size={25} />
          </div>
        </div>
        <div>
          {toggeled &&
            <div className='flex flex-row justify-between items-center w-ful p-4 mt-2 bg-white'> 
              <div className='flex flex-col text-[#330404]'>
                <h4>Track ID: {track.track_id}</h4>
                <h4>Track Length: {track.track_duration_seconds}s</h4>
              </div>
              <div>
                <a href={`https://www.youtube.com/results?search_query=${ytQueryName}+${ytQueryArtist}`} target="_blank">
                  <AiFillYoutube className='fill-[#330404] hover:fill-red-500' size={40} />
                </a>
              </div>
            </div>
          }
        </div>
    </div>
  )
}

export default Trackcard