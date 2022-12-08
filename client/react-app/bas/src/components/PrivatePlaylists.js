import React from 'react'
import { useState, useEffect } from 'react';
import PrivatePlaylistCard from './PrivatePlaylistCard';
import axios from 'axios';

const PrivatePlaylists = () => {
    const [data, setData] = useState([]);


    const fetchData = async () => {

        const accessTokenObj = localStorage.getItem("_auth");

        try {
            const res = await axios.get("http://localhost:3000/api/playlists/private/", {headers: {
                "Authorization": `Bearer ${accessTokenObj}`
            }})
            setData(res.data)
        } catch (err) {
            alert("no playlists")
        }
  
    }
  
    
  
    useEffect(() => {
      fetchData();
    },[])
  
  
    return (
      <div className="flex flex-col w-5/6 m-8">
          <div className="flex flex-col">
              <div className='w-full flex flex-col justify-between items-left'>
                  <h2 className='font-semibold text-white text-5xl text-left'>Your Playlists</h2>
              </div>
              <div className='flex flex-col my-4 w-full'>
                  {data.map((playlist) => (
                    <div key={playlist.playlist_id}>
                        <PrivatePlaylistCard key={playlist.playlist_id} playlist={playlist}/>
                    </div>
                  ))}
              </div>
          </div>
      </div>
  
    )
}

export default PrivatePlaylists