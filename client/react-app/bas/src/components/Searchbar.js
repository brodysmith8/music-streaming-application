import React from 'react'
import {FiSearch} from 'react-icons/fi'
import axios from "axios"

const api = axios.create({
    baseURL: `localhost:4000/api/`
})

const Searchbar = () => {
  
    const handleSubmit = (e) => e.preventDefault()


    return (
        <div className='flex flex-col w-full'>
            <form className="mb-3 w-full" onSubmit={handleSubmit}>
                <input type="search" id="exampleSearch" placeholder="Search" className=" block w-full px-2 py-3 text-base font-normal text-gray-200 bg-transparent bg-clip-padding border border-solid border-gray-400 border-y-2 border-x-0 transition ease-in-out m-0 focus:text-white focus:border-white focus:outline-none focus:placeholder-white" />
            </form>
        </div>
  )
}

export default Searchbar