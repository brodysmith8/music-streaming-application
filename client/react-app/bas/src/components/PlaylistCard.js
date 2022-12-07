import React from 'react'
import {BsFillPersonFill} from 'react-icons/bs'
import {AiOutlineNumber, AiFillStar} from 'react-icons/ai'
import {RiTimerFill} from 'react-icons/ri'
import {MdOutlinePlaylistPlay} from 'react-icons/md'
import { useState } from 'react'
import Trackcard from './Trackcard'
import { BsThreeDotsVertical } from 'react-icons/bs'
const PlaylistCard = () => {

    const [toggeled, setToggled] = useState(false);
    

    return (
        <div className='flex flex-col'>
            <div className='flex flex-wrap flex-row overflow-auto w-full justify-between p-4 hover:bg-[#330404]' style={{backgroundColor: toggeled ? '#330404':''}} onClick={() => setToggled(!toggeled)}>
                <div className='flex justify-between'>
                    <div className='flex flex-row justify-center items-center'>
                        <div className='flex flex-col justify-center items-center w-16 h-16 rounded-sm bg-white'>
                            <MdOutlinePlaylistPlay className='w-10 h-10' size={35} />
                        </div>
                    </div>
                    <div className='flex  flex-col items-left ml-4'>
                        <h1 className='text-white text-3xl'>Track Name</h1>
                        <div className='flex flex-row'>
                            <div className='flex flex-row gap-1 mr-4'>
                                <BsFillPersonFill size={25} className='fill-white'/>
                                <h1 className='text-white text-lg'>Creator</h1>    
                            </div>            
                            <div className='flex flex-row gap-1 mr-4'>
                                <AiOutlineNumber size={25} className='fill-white'/>
                                <h1 className='text-white text-lg'>#ofTracks</h1>    
                            </div>
                            <div className='flex flex-row gap-1 mr-4'>
                                <RiTimerFill size={25} className='fill-white'/>
                                <h1 className='text-white text-lg'>Duration</h1>    
                            </div>            
                            <div className='flex flex-row gap-1 mr-4'>
                                <AiFillStar size={25} className='fill-white'/>
                                <h1 className='text-white text-lg'>Rating</h1>    
                            </div>                        
                        </div>
                    </div>

                </div>
            </div>
            <div>
                {toggeled &&
                    <div className=''> 
                        test
                    </div>
                }
            </div>
        </div>
    )
}

export default PlaylistCard