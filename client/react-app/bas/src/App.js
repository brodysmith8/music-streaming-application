import {Route, Routes} from 'react-router-dom';
import "./index.css"
import Login from './components/Login';
import Home from './components/Home';
import AddPlaylist from './components/AddPlaylist';
import Sidebar from './components/Sidebar';
import Discover from './components/Discover';
import SignUp from './components/SignUp';
import { useState } from 'react';

function App() {
  const [isRenderd, setIsRendered] = useState(false);
  return (
    
    <div className='relative flex h-screen '>
    <Sidebar />
      <div className='w-full overflow-y-scroll scrollbar-hide'> 
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />  
          <Route path="/home" element={<><Home /></>} />
          <Route path="/discover" element={<><Discover /></>} />
          <Route path="/addplaylists" element={<><AddPlaylist/></>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

