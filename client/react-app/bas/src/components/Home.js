import PlaylistCard from "./PlaylistCard"
import { useState, useEffect } from "react"
import axios from "axios";


const Home = () => {

  const [data, setData] = useState([]);


  const fetchData = async () => {

    const res = await axios.get("http://localhost:3000/api/playlists/")
    const holder = res.data;
    holder.sort(function (a,b) {
      return a.last_modified_datetime.localeCompare(b.last_modified_datetime);
    });

    setData(holder.reverse().splice(0,10))
    console.log(data);

  }



  useEffect(() => {
    fetchData();
  },[])


  return (
    <div className="flex flex-col w-5/6 m-8">
        <div className="flex flex-col">
            <div className='w-full flex flex-col justify-between items-left'>
                <h2 className='font-semibold text-white text-5xl text-left'>Home</h2>
                <h3 className='font-medium text-white text-3xl text-left mt-5'>Check out some public playlists!</h3>
            </div>
            <div className='flex flex-col my-4 w-full'>
                {data.map((playlist) => (
                  <div key={playlist.playlist_id}>
                    <PlaylistCard key={playlist.playlist_id} playlist={playlist}/>
                    {/* {track.map((track) => (
                      <Trackcard key={track.track_id} track={track}/>
                    ))} */}
                  </div>
                ))}
            </div>
        </div>
    </div>

  )
}

export default Home