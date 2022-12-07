import {Route, Routes} from 'react-router-dom';
import Discover from './Discover';
import Sidebar from './Sidebar';

const Playlists = () => {
  return (
    <div className="flex flex-col w-5/6 m-8">
        <div className="flex flex-col">
            <div className='w-full flex flex-col justify-between items-left'>
                <h2 className='font-semibold text-white text-5xl text-left'>Playlist</h2>
            </div>
            <div className='flex flex-col justify-center gap-8 text-white'>

            </div>
        </div>
    </div>

  )
}

export default Playlists