import React, { useEffect, useState } from 'react'
import {FiSearch} from 'react-icons/fi'
import axios from "axios"
import stringSimilarity from 'string-similarity'
import Trackcard from './Trackcard'

const Searchbar = () => {
  
    const handleSubmit = (e) => e.preventDefault()

    const [input, setInput] = useState("s");
    const [data, setData] = useState([]);

    const fetchData = async () => {



        try {
            
            let res = null;
            const res1 = await axios.get(`http://localhost:3000/api/tracks?search=${input}&type=onego`)
            console.log(res1.data);
            const trackQuery = res1.data.tracks_query
            const albumQuery = res1.data.albums_query

            // if (trackQuery === null && albumQuery === null) {
            //     throw "test"
            // }

            if (albumQuery != null) {
                res = trackQuery.concat(albumQuery)
            } else {
                res = trackQuery
            }
            //console.log(albumQuery);

            //console.log(res1)
            
            // try {
            //     res2 = await axios.get(`http://localhost:3000/api/tracks?search=${input}&type=artists`)    
            // } catch(err) {
            //     alert(err.response.data)
            // }
            
            //console.log(res2)
            // const res = res1.data.concat(res2.data)
            //console.log(res)

            const result = [...new Set(res.map(obj => JSON.stringify(obj)))]
            .map(str => JSON.parse(str));

            console.log(result)

            setData(result);
            console.log(result);
            //console.log(data);
        } catch(err) {
            alert("no songs")
        }



    }

    useEffect(()=>{
        fetchData()
    },[])
    



    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            fetchData()
        }
    }

    // console.log(input);
    return (
        <div className='flex flex-col w-full'>
            <form className="mb-3 w-full" onSubmit={handleSubmit}>
                <input type="text" id="search" placeholder="Search" onChange={e =>{setInput(e.target.value.toLowerCase())}} onKeyDown={handleKeyDown} className=" block w-full px-2 py-3 text-base font-normal text-gray-200 bg-transparent bg-clip-padding border border-solid border-gray-400 border-y-2 border-x-0 transition ease-in-out m-0 focus:text-white focus:border-white focus:outline-none focus:placeholder-white" />
            </form>
            <div>
                {data.map((track) => (
                    <Trackcard key={track.track_id} track={track} /> 
                ))}  
            </div>
        </div>
        
    )
}

export default Searchbar