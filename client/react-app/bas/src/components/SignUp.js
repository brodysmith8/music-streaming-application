import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import axios from 'axios';

const SignUp = () => {


    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("");

    let navigate = useNavigate(); 
    const routeChangeSignIn = () =>{ 
        let path = `/`; 
        navigate(path);
    }

    const handleSubmit = async () => {

        if(email.length > 0 && username.length > 0 && password.length > 0) {

            axios.post(`http://localhost:3000/user/create`,{
                email_address: email,
                username: username,
                password: password 
            })            

            routeChangeSignIn()
        } else {
            alert("fill out all fields")
        }
        
    }

  return (
    <div className='loginBG flex h-screen'>
        
        <div className="w-full max-w-xs m-auto">x

            <form className="w-max bg-red-200 bg-opacity-20 backdrop-blur-sm rounded drop-shadow-lg px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-white text-sm font-bold mb-2" htmlFor="username">
                        Email
                    </label>
                    <input onChange={(e) => setEmail(e.target.value)} className="peer shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Username" required/>
                    <p className="invisible peer-invalid:visible text-red-200 font-light">
                    Please enter a valid email address
                    </p>
                </div>
                <div className="mb-4">
                    <label className="block text-white text-sm font-bold mb-2" htmlFor="username">
                        Username
                    </label>
                    <input onChange={(e) => setUsername(e.target.value)} className="peer shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="email" placeholder="Username" required/>
                    <p className="invisible peer-invalid:visible text-red-200 font-light">
                        This field cannot be empty
                    </p>
                </div>
                <div className="mb-6">
                    <label className="block text-white text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input onChange={(e) => setPassword(e.target.value)} className="peer shadow appearance-none rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="********" required/>
                    <p className="invisible peer-invalid:valid text-red-200 font-light">
                        This field cannot be empty
                    </p>
                </div>

                <div className="flex items-center justify-between gap-4">
                    <button className="bg-black hover:bg-red-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={() => handleSubmit()}>
                        Sign Up
                    </button>
                    <div id='signInDiv'></div>
                </div>
            </form>
        </div>
    </div>
  )
}

export default SignUp