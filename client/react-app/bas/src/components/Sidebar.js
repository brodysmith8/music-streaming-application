import React from 'react'
import { useState } from 'react'
import { HiOutlineMenu } from 'react-icons/hi'
import { RiCloseLine } from 'react-icons/ri'
import { BiSearchAlt } from 'react-icons/bi'
import { FiHome } from 'react-icons/fi'
import { RiPlayListAddLine } from 'react-icons/ri'
import { useSignOut } from 'react-auth-kit'
import { useNavigate } from 'react-router-dom'

const Sidebar = () => {

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const signOut = useSignOut();

    let navigate = useNavigate(); 

    const logout = () => {
        signOut()
        setMobileMenuOpen(false)
        navigate('/')
    }

    return (
        <>

            <nav className='md:flex hidden flex-col w-[240px] px-4 bg-[#330404]'>
                <ul >
                    <li className='flex flex-row justify-start items-center my-8 text-lg font-regular text-white hover:text-red-500'>    
                        <FiHome className='w-6 h-6 mr-2'/>
                        <a href='/home'>Home</a>
                    </li>
                    <li className='flex flex-row justify-start items-center my-8 text-lg font-regular text-white hover:text-red-500'>
                        <BiSearchAlt className='w-6 h-6 mr-2'/>
                        <a href='/discover'>Discover</a>
                    </li>
                    <li className='flex flex-row justify-start items-center my-8 text-lg font-regular text-white hover:text-red-500'>    
                            <RiPlayListAddLine className='w-6 h-6 mr-2'/>
                            <a href='/addplaylists' >Add Playlist</a>
                    </li>
                    <li className='flex flex-row justify-start items-center my-8 text-lg font-regular text-white hover:text-red-500'>    
                            <RiPlayListAddLine className='w-6 h-6 mr-2'/>
                            <a href='/yourplaylists'>Your Playlists</a>
                    </li>
                    <li className='flex flex-row justify-start items-center my-8 text-lg font-regular text-white hover:text-red-500'>    
                            <RiPlayListAddLine className='w-6 h-6 mr-2'/>
                            <a href='/editplaylists'>Edit/Add</a>
                    </li>
                    <li className='flex flex-row justify-start items-center my-8 text-lg font-regular text-white hover:text-red-500'>
                        <button onClick={() => logout()}>Log Out</button>
                    </li>
                </ul>
            </nav>

            <div className='absolute md:hidden block top-6 right-2'>
                {mobileMenuOpen ? (
                    <RiCloseLine className='w-6 h-6 text-white mr-2' onClick={() => setMobileMenuOpen(false)}/>
                ): <HiOutlineMenu className='w-6 h-6 text-white mr-2' onClick={() => setMobileMenuOpen(true)}/>}
            </div>

            <div className={`absolute top-0 h-screen w-1/2 bg-[#330404] backdrop-blur-sm p-6 md:hidden smooth-transition ease-in-out duration-300 ${mobileMenuOpen ? 'left-0' : '-left-full'}`}>
                <nav className='flex-col px-4 bg-[#330404] '>
                    <ul >
                        <li className='flex flex-row justify-start items-center my-8 text-lg font-regular text-white hover:text-red-500'>    
                            <FiHome className='w-6 h-6 mr-2'/>
                            <a href='/playlists' onClick={() => setMobileMenuOpen(false)}>Playlists</a>
                        </li>
                        <li className='flex flex-row justify-start items-center my-8 text-lg font-regular text-white hover:text-red-500'>
                            <BiSearchAlt className='w-6 h-6 mr-2'/>
                            <a href='/home' onClick={() => setMobileMenuOpen(false)}>Discover</a>
                        </li>
                        <li className='flex flex-row justify-start items-center my-8 text-lg font-regular text-white hover:text-red-500'>    
                            <RiPlayListAddLine className='w-6 h-6 mr-2'/>
                            <a href='/playlists' onClick={() => setMobileMenuOpen(false)}>Add Playlist</a>
                        </li>
                        <li className='flex flex-row justify-start items-center my-8 text-lg font-regular text-white hover:text-red-500'>    
                            <RiPlayListAddLine className='w-6 h-6 mr-2'/>
                            <a href='/yourplaylists' onClick={() => setMobileMenuOpen(false)}>Your Playlists</a>
                        </li>
                        <li className='flex flex-row justify-start items-center my-8 text-lg font-regular text-white hover:text-red-500'>    
                            <RiPlayListAddLine className='w-6 h-6 mr-2'/>
                            <a href='/editplaylists'>Edit/Add</a>
                        </li>
                        <li className='flex flex-row justify-start items-center my-8 text-lg font-regular text-white hover:text-red-500'>
                            <button onClick={() => logout()}>Log Out</button>
                        </li>
                    </ul>
                </nav>
            </div>


        </>
    )
}

export default Sidebar