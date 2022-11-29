import {Route, Routes} from 'react-router-dom';
import Discover from './Discover';
import Sidebar from './Sidebar';

const Playlists = () => {
  return (
      <>
        <div className="flex flex-col m-8">
            <div className='w-full flex flex-col justify-between items-center mb-5'>
                <h2 className='font-bold text-white text-5xl text-left'>Playlist</h2>
            </div>
            <div className='flex flex-wrap justify-center gap-8 text-white'>
            </div>
        </div>
    </>

  )
}

export default Playlists