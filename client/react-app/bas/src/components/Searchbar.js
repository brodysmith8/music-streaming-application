import React, { useEffect, useState } from 'react'
import {FiSearch} from 'react-icons/fi'
import axios from "axios"
import stringSimilarity from 'string-similarity'
import Trackcard from './Trackcard'

const Searchbar = () => {
  
    const handleSubmit = (e) => e.preventDefault()

    const [input, setInput] = useState("s");
    const [data, setData] = useState([]);
    const [tracks, setTracks] = useState([]);


    useEffect(()=>{
        console.log("test");
        const fetchData = async () => {
            const res1 = await axios.get(`http://localhost:3000/api/tracks?search=${input}&type=tracks`)
            const res2 = await axios.get(`http://localhost:3000/api/tracks?search=${input}&type=artists`)

            const res = res1.data.concat(res2.data)
            
            const result = [...new Set(res.map(obj => JSON.stringify(obj)))]
            .map(str => JSON.parse(str));

            setData(result);
        }
        fetchData()
    },[input])





const arrUnique = (arr) => {
    let cleaned = [];
    arr.forEach(function(itm) {
        var unique = true;
        cleaned.forEach(function(itm2) {
            if (arr.isEqual(itm, itm2)) unique = false;
        });
        if (unique)  cleaned.push(itm);
    });
    return cleaned;
}
    console.log(data);
    



    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            // console.log(e.target.value);
            // console.log(input);
            // // searchTrack(e.target.value)
        }
    }

    console.log(input);
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