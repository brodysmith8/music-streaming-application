import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { TbDetails } from 'react-icons/tb';
import axios from 'axios';
import { signIn } from 'react-auth-kit';

const Login = () => {

    const [user, setUser] = useState("")
    const [pass, setPass] = useState("")

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
    const routeChangeSignIn = () =>{ 
        let path = `/home`; 
        navigate(path);
    }

    const routeChangeSignUp = () =>{ 
        let path = `/signup`; 
        navigate(path);
    }

    const handleLogin = async () => {
        if (user.length > 0 && pass.length > 0) {
            try {
                console.log("test");
                const res = await axios.post('http://localhost:3000/api/user/login',{
                    username: user,
                    password: pass,
                })

                console.log(res);

            } catch(err) {
                console.log(err);
            }
        }
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
            

            <form className="w-max bg-red-200 bg-opacity-20 backdrop-blur-sm rounded drop-shadow-lg px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-white text-sm font-bold mb-2" htmlFor="username">
                        Email
                    </label>
                    <input onChange={(e)=>setUser(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="email" id="username" placeholder="Username" required/>
                    </div>
                <div className="mb-6">
                    <label className="block text-white text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input onChange={(e)=>setPass(e.target.value)} className="peer shadow appearance-none rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="********" required/>
                    <p className="invisible peer-invalid:visible text-red-700 font-light">
                        This field cannot be empty
                    </p>
                </div>

                <div className="flex items-center justify-between gap-4">
                    <button className="bg-black hover:bg-red-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={() => routeChangeSignUp()}>
                        New? Sign Up
                    </button>
                    <button className="bg-black hover:bg-red-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={() => handleLogin()}>
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
