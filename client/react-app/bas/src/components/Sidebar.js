import React from 'react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { HiOutlineMenu } from 'react-icons/hi'
import { RiCloseLine } from 'react-icons/ri'
import { HiOutlineHome } from 'react-icons/hi'
import { TbPlaylist } from 'react-icons/tb'


const Sidebar = () => {

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>

            <nav className='md:flex hidden flex-col w-[240px] px-4 bg-[#330404]'>
                <ul >
                    <li className='flex flex-row justify-start items-center my-8 text-lg font-regular text-white hover:text-red-500'>
                        <HiOutlineHome className='w-6 h-6 mr-2'/>
                        <a href='/home'>Discover</a>
                    </li>
                    <li className='flex flex-row justify-start items-center my-8 text-lg font-regular text-white hover:text-red-500'>    
                        <TbPlaylist className='w-6 h-6 mr-2'/>
                        <a href='/playlists'>Playlists</a>
                    </li>
                </ul>
            </nav>

            <div className='absolute md:hidden block top-6 right-2'>
                {mobileMenuOpen ? (
                    <RiCloseLine className='w-6 h-6 text-white mr-2' onClick={() => setMobileMenuOpen(false)}/>
                ): <HiOutlineMenu className='w-6 h-6 text-white mr-2' onClick={() => setMobileMenuOpen(true)}/>}
            </div>

            <div className={`absolute top-0 h-screen w-1/2 bg-[#330404] backdrop-blur-sm p-6 md:hidden smooth-transition ${mobileMenuOpen ? 'left-0' : '-left-full'}`}>
                <nav className='flex-col px-4 bg-[#330404]'>
                    <ul >
                        <li className='flex flex-row justify-start items-center my-8 text-lg font-regular text-white hover:text-red-500'>
                            <HiOutlineHome className='w-6 h-6 mr-2'/>
                            <a href='/home' onClick={() => setMobileMenuOpen(false)}>Discover</a>
                        </li>
                        <li className='flex flex-row justify-start items-center my-8 text-lg font-regular text-white hover:text-red-500'>    
                            <TbPlaylist className='w-6 h-6 mr-2'/>
                            <a href='/playlists' onClick={() => setMobileMenuOpen(false)}>Playlists</a>
                        </li>
                    </ul>
                </nav>
            </div>


        </>
    )
}

export default Sidebar