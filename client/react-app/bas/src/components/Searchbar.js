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

    // useEffect(()=> {
    //     console.log("test2");
    //     const fetchTracks = async () => {
    //         for (let i=0; i < data.length; i++) {
    //             let req = data[i].track_id
    //             const res = await axios.get(`http://localhost:3000/api/tracks/${req}`)
    //             tracks.push(res.data)
    //         }
    //     }
    //     fetchTracks();
    // },[input])

    console.log(data);
    //console.log(tracks);
 
    // const [tracks, setTracks] = useState([])
    // const [input, setInput] = useState('')

    // useEffect(()=>{
    //     setInput('');
    // },[input])

    // const getTrackID = (str) => {
    //     axios.get(`http://localhost:3000/api/tracks/${str}`).then((e) => {
    //         console.log(e.data.track_id);
    //     })
    // }

    // useEffect(() => {
    //     document.addEventListener('keydown',handlePress,true)
    // }, [])

    // const handlePress = (e) => {
    //     console.log(e.key);
    // }

    // const [newData, setNewData] = useState([])
    // const [trackData, setTrackData] = useState([])

    // const searchTrack = (str) => {

    //     // if (str.length > 0) {

    //         axios.get(`http://localhost:3000/api/tracks?search=${str}&type=tracks`).then((e) => {
                
    //             let temp = []
    //             let nData = e.data
    //             let dLength = nData.length;
    //             for (let i = 0; i<dLength; i++){
    //                 temp.push(nData[i])
    //             }
    //             setNewData(temp)


    //             console.log("test2");
    //             console.log(newData);

    //             // for (let k = 0; k < newData.length; k++) {
    //             //     let req = newData[k].track_id
    //             //     axios.get(`http://localhost:3000/api/tracks/${req}`).then((e) => {
    //             //         let eData = e.data
    //             //         trackData.push(eData)
    //             //     })
    //             // }
    //             // console.log("test3");
    //             // console.log(trackData);        

    //         })


    //         console.log("test");
    //         console.log(tracks);


    //         // axios.get(`http://localhost:3000/api/tracks?search=${str}&type=albums`).then((e) => {
    //         //     let data = e.data
    //         //     let dLength = data.length;
    //         //     for (let i = 0; i<dLength; i++){
    //         //         newData.push(data[i])
    //         //     }
    //         //     setTracks(newData);
    //         // })
    //         //setTracks(newData)
    //         // axios.get(`http://localhost:3000/api/tracks?search=${str}&type=artists`).then((e) => {
    //         //     let data = e.data
    //         //     let dLength = data.length;
    //         //     for (let i = 0; i<dLength; i++){
    //         //         newData.push(data[i])
    //         //     }
    //         //     //setTracks(newData);
    //         // })
    //         // setTracks(newData)
    //         // console.log("initial");
    //         // console.log(tracks);
    //     // } 
    //     // else if (str.length == 0){
    //     //     tracks.length = 0;
    //     //     console.log("new array");
    //     //     console.log(tracks);
    //     // }
 
    // }


    // const getInput = (e) => {
    //     const userVal = e.target.value.toLowerCase()
    //     //setInput(userVal)

    // }



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