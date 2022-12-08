import React from 'react'
import {BsFillPersonFill} from 'react-icons/bs'
import {AiOutlineNumber, AiFillStar} from 'react-icons/ai'
import {RiTimerFill} from 'react-icons/ri'
import {MdOutlinePlaylistPlay} from 'react-icons/md'
import { useState,useEffect } from 'react'
import Trackcard from './Trackcard'
import axios from 'axios'

const PrivatePlaylistCard = ({playlist}) => {

    const [toggeled, setToggled] = useState(false);
    const [data, setData] = useState([]);
    const [trackNum, setTrackNum] = useState("0");
    useEffect(() => {
        checkTrackNum();
    },[])
    
    const handleClick = async () => {
        const accessTokenObj = localStorage.getItem("_auth");
        setToggled(!toggeled)
        try {
            const trackRes = await axios.get(`http://localhost:3000/api/playlists/private/${playlist.playlist_id}`, {headers: {
                "Authorization": `Bearer ${accessTokenObj}`
            }})
            setData(trackRes.data)
            console.log(data);
          } catch(err) {
            alert("playlist is currently empty")
          }
    }

    const checkTrackNum = async () => {
        try {
            const accessTokenObj = localStorage.getItem("_auth");
            const trackRes = await axios.get(`http://localhost:3000/api/playlists/private/${playlist.playlist_id}`, {headers: {
                "Authorization": `Bearer ${accessTokenObj}`
            }})
            setTrackNum(trackRes.data.length)    
        } catch (err) {
            console.log("");
        }
        
    } 

    return (
        <div className='flex flex-col'>
            <div className='flex flex-wrap flex-row overflow-auto w-full justify-between p-4 hover:bg-[#330404]' style={{backgroundColor: toggeled ? '#330404':''}} onClick={() => handleClick()}>
                <div className='flex justify-between'>
                    <div className='flex flex-row justify-center items-center'>
                        <div className='flex flex-col justify-center items-center w-16 h-16 rounded-sm bg-white'>
                            <MdOutlinePlaylistPlay className='w-10 h-10' size={35} />
                        </div>
                    </div>
                    <div className='flex  flex-col items-left ml-4'>
                        <h1 className='text-white text-3xl'>{playlist.playlist_name}</h1>
                        <div className='flex flex-row'>
                            <div className='flex flex-row gap-1 mr-4'>
                                <BsFillPersonFill size={25} className='fill-white'/>
                                <h1 className='text-white text-lg'>Creator</h1>    
                            </div>            
                            <div className='flex flex-row gap-1 mr-4'>
                                <AiOutlineNumber size={25} className='fill-white'/>
                                <h1 className='text-white text-lg'>{trackNum}</h1>    
                            </div>
                            <div className='flex flex-row gap-1 mr-4'>
                                <RiTimerFill size={25} className='fill-white'/>
                                <h1 className='text-white text-lg'>{playlist.running_time}s</h1>    
                            </div>            
                            <div className='flex flex-row gap-1 mr-4'>
                                <AiFillStar size={25} className='fill-white'/>
                                <h1 className='text-white text-lg'>{playlist.average_rating}</h1>    
                            </div>                        
                        </div>
                    </div>

                </div>
            </div>
            <div>
                {toggeled &&
                    <div className='flex flex-row justify-between items-center w-full  '> 
                        <div className='flex flex-col w-full text-[#330404] '>
                            <div className='bg-white p-4'>    
                                <h4>List ID: {playlist.playlist_id}</h4>
                                <h4>Description: {playlist.description_text}</h4>
                                <h4>Date Modified: {playlist.last_modified_datetime}</h4>
                            </div>
                            <div className='p-6 border-2 border-white'>
                                {data.map((track) => (
                                    <Trackcard key={track.track_id} track={track} />
                                ))}
                            </div>
                        </div>

                    </div>
                }
            </div>
        </div>
  )
}

export default PrivatePlaylistCard