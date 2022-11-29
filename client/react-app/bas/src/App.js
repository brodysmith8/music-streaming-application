import {Route, Routes} from 'react-router-dom';
import "./index.css"
import Home from './components/Home';
import Login from './components/Login';
function App() {
  return (
    <div className=''>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
