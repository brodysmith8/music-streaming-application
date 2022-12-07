import React from 'react'
import Sidebar from './Sidebar'
import CreatePlaylist from './CreatePlaylist'


const AddPlaylist = () => {
  return (


    <div className="flex flex-col w-5/6 m-8">
        <div className="flex flex-col ">
            <div className='w-full flex flex-col'>
                <h2 className='font-semibold text-white text-5xl text-left'>Add New Playlist</h2>
            </div>
            <div className='flex flex-col justify-left gap-8 mt-8' >
              <CreatePlaylist />
            </div>
        </div>
    </div>

  )
}

export default AddPlaylist