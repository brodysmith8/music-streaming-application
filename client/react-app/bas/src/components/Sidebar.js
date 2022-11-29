import React from 'react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { HiOutlineMenu } from 'react-icons/hi'
import { RiCloseLine } from 'react-icons/ri'
import { links } from '../assets/constants'
const NavLinks = ( {handleClick} ) => (
    <div>
        {links.map((item) => (
            <NavLink key={item.name} to={item.to} className="flex flex-row justify-start items-center my-8 text-sm font-medium text-white hover:text-red-500" onClick={() => handleClick && handleClick()}>
                <item.icon className='w-6 h-6 mr-2'/>
                {item.name}
            </NavLink>
        ))}
    </div>
);


const Sidebar = () => {

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <div className='md:flex hidden flex-col w-[240px] px-4 bg-[#330404]'>
                <NavLinks />
            </div>

            <div className='absolute md:hidden block top-6 right-2'>
                {mobileMenuOpen ? (
                    <RiCloseLine className='w-6 h-6 text-white mr-2' onClick={() => setMobileMenuOpen(false)}/>
                ): <HiOutlineMenu className='w-6 h-6 text-white mr-2' onClick={() => setMobileMenuOpen(true)}/>}
            </div>

            <div className={`absolute top-0 h-screen w-1/2 bg-[#330404] backdrop-blur-sm p-6 md:hidden smooth-transition ${mobileMenuOpen ? 'left-0' : '-left-full'}`}>
                <NavLinks handleClick={() => setMobileMenuOpen(false)}/>
            </div>


        </>
    )
}

export default Sidebar