import React from 'react'
import EditPlaylist from './EditPlaylist'

const EditPlaylistBoiler = () => {
  return (
    <div className="flex flex-col w-5/6 m-8">
        <div className="flex flex-col ">
            <div className='w-full flex flex-col'>
                <h2 className='font-semibold text-white text-5xl text-left'>Edit Playlist or Add Songs</h2>
            </div>
            <div className='flex flex-col justify-left gap-8 mt-8' >
              <EditPlaylist />
            </div>
        </div>
    </div>
  )
}

export default EditPlaylistBoiler