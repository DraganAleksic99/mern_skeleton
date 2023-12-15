import React from "react";
import { Route, Routes } from "react-router";
import Home from "./core/Home";
import Users from "./user/Users";
import Signup from "./user/Signup";
import Signin from "./auth/Signin";
import Profile from "./user/Profile";
import EditProfile from "./user/EditProfile";
import Menu from "./core/Menu";

const MainRouter = () => {
    return (
        <div>
            <Menu />
            <Routes>
                <Route exact path="/" Component={Home} />
                <Route path="/users" Component={Users} />
                <Route path="/signup" Component={Signup} />
                <Route path="/signin" Component={Signin} />
                <Route path="/user/edit/:userId" Component={EditProfile} />
                <Route path="/user/:userId" Component={Profile} />
            </Routes>
        </div>
    )
}

export default MainRouter;