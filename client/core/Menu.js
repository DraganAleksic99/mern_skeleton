import React from "react";
import { AppBar, Typography, IconButton, Button, Toolbar } from "@material-ui/core";
import { Home } from "@material-ui/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import auth from "../auth/auth-helper";

export default function Menu() {
    const navigate = useNavigate();
    const location = useLocation();
    const isActive = (location, path) => {
        if (location.pathname == path) return {color: '#ff4081'};
        else return {color: '#ffffff'};
    }
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" color="inherit">MERN Social</Typography>
                <Link to="/">
                    <IconButton aria-label="Home" style={isActive(location, "/")}>
                        <Home />
                    </IconButton>
                </Link>
                <Link to="/users">
                    <Button style={isActive(location, "/users")}>Users</Button>
                </Link>
                { !auth.isAuthenticated() && (<span>
                    <Link to="/signup">
                        <Button style={isActive(location, "/signup")}> Sign Up </Button>
                    </Link>
                    <Link to="/signin">
                        <Button style={isActive(location, "/signin")}> Sign In </Button>
                    </Link>
                </span>)
                }
                { auth.isAuthenticated() && (<span>
                    <Link to={"/user/" + auth.isAuthenticated().user._id}>
                        <Button style={isActive(location, "/user/" + auth.isAuthenticated().user._id)} >
                            My Profile
                        </Button>
                    </Link>
                    <Button color="inherit" onClick={() => { auth.clearJWT(() => navigate("/")) }}>
                        Sign out
                    </Button>
                </span>)
                }
            </Toolbar>
        </AppBar>
    )
}