import { Route, Routes } from "react-router-dom";
import "./index.css";
import Login from "./components/Login";
import Home from "./components/Home";
import AddPlaylist from "./components/AddPlaylist";
import Sidebar from "./components/Sidebar";
import Discover from "./components/Discover";
import SignUp from "./components/SignUp";
import PrivatePlaylists from "./components/PrivatePlaylists";
import EditPlaylistBoiler from "./components/EditPlaylistBoiler";
import { useState } from "react";
import { RequireAuth } from "react-auth-kit";

function App() {
    const [isRenderd, setIsRendered] = useState(false);
    return (
        <div className="relative flex h-screen ">
            <Sidebar />
            <div className="w-full overflow-y-scroll scrollbar-hide">
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route
                        path="/home"
                        element={
                            <>
                                <Home />
                            </>
                        }
                    />
                    <Route
                        path="/discover"
                        element={
                            <>
                                <Discover />
                            </>
                        }
                    />
                    <Route
                        path="/addplaylists"
                        element={
                            <>
                                <RequireAuth loginPath="/">
                                    <AddPlaylist />
                                </RequireAuth>
                            </>
                        }
                    />
                    <Route
                        path="/yourplaylists"
                        element={
                            <>
                                <RequireAuth loginPath="/">
                                    <PrivatePlaylists />
                                </RequireAuth>
                            </>
                        }
                    />
                    <Route
                        path="/editplaylists"
                        element={
                            <>
                                <RequireAuth loginPath="/">
                                    <EditPlaylistBoiler />
                                </RequireAuth>
                            </>
                        }
                    />
                </Routes>
            </div>
        </div>
    );
}

export default App;
