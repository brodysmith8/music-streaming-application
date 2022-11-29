import {Route, Routes} from 'react-router-dom';
import Discover from './Discover';
import Sidebar from './Sidebar';
import Playlists from './Playlists';
const Home = () => {
  return (
    <div className='relative flex h-screen'>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Discover />} />
        <Route path="/Playlists" element={<Playlists />} />
      </Routes>
    </div>
  )
}

export default Home