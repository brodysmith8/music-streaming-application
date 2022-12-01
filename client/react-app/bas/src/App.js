import {Route, Routes} from 'react-router-dom';
import "./index.css"
import Login from './components/Login';
import Playlists from './components/Playlists';
import Sidebar from './components/Sidebar';
import Discover from './components/Discover';
function App() {
  return (
    <div className='relative flex h-screen'>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Discover />} />
        <Route path="/playlists" element={<Playlists />} />
      </Routes>
    </div>
  );
}

export default App;
