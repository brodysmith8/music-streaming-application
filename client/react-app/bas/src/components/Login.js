import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { TbDetails } from 'react-icons/tb';


const Login = () => {



    function handleCallbackResponse(response) {
        
        var userObj = jwtDecode(response.credential)
        console.log(userObj)
    }
    useEffect(() => {
        /* global google*/
        google.accounts.id.initialize({
            client_id: "358224060196-3dcavqp6u1j8iopd1fed8ldckd5emmuu.apps.googleusercontent.com",
            callback: handleCallbackResponse
        });

        google.accounts.id.renderButton(
            document.getElementById("signInDiv"),
            {theme:"standard", size:"medium", type: "icon"}
        )
    },[])

    let navigate = useNavigate(); 
    const routeChange = () =>{ 
        let path = `/discover`; 
        navigate(path);
    }


  return (
     
   
    <div className='loginBG flex h-screen'>
        
        <div className="w-full max-w-xs m-auto">
            
            <div className = 'aboutApplication'>
                <div className = "flex flex-col bg-red-200 bg-opacity-20 backdrop-blur-sm rounded drop-shadow-lg px-5 pt-6 pb-8 mb-6">
                    <h1 className='text-white font-bold items-center'>BAS MUSIC</h1>
                    <p className = 'aboutText text-white items-center' >

                        Welcome to BAS Music Application! This application is a music streaming service that allows you to search for your favourite tracks, artists, and albums! You can also create your own playlists to hold all of your favourite music with full customization.

                    </p>
                </div>
            </div>    
            

            <form className="bg-red-200 bg-opacity-20 backdrop-blur-sm rounded drop-shadow-lg px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-white text-sm font-bold mb-2" htmlFor="username">
                        Username
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username"/>
                    </div>
                <div className="mb-6">
                    <label className="block text-white text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" />
                </div>
                <div className="flex items-center justify-between">
                    <button className="bg-black hover:bg-red-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={routeChange}>
                        Sign In
                    </button>
                    <div id='signInDiv'></div>
                </div>
            </form>
        </div>
    </div>

     
    
  )
}


export default Login
