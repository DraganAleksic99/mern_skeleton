import React, { useState, useEffect} from "react";
import auth from "../auth/auth-helper";
import { read } from "./api-user";
import { Navigate } from "react-router";
import { Link, useMatch } from "react-router-dom";
import { Paper, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText,
    Divider, ListItemSecondaryAction, IconButton } from "@material-ui/core";
import { Person, Edit } from "@material-ui/icons";
import { useStyles } from "../core/Home";
import DeleteUser from "./DeleteUser";
import FollowProfileButton from "./FollowProfileButton";

export default function Profile() {
    const classes = useStyles();
    const match = useMatch("/user/:userId");
    const [user, setUser] = useState({});
    const [redirectToLogin, setRedirectToLogin] = useState(false);
    const [following, setFollowing] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        const jwt = auth.isAuthenticated();
        read({userId: match.params.userId}, {t: jwt.token}, signal).then((data) => {
            if (data && data.error) {
                setRedirectToLogin(true);
            } else {
                let following = checkFollow(data, jwt)
                setUser(data);
                setFollowing(following);
            }
        });
        return function cleanup() {
            abortController.abort();
        }
    }, [match.params.userId]);

    if (redirectToLogin) {
        return <Navigate to="/signin" />
    }

    const checkFollow = (user, jwt) => {
        const match = user.followers.some(follower => follower == jwt.user._id);
        return match;
    }

    const clickFollowButton = (callApi, jwt) => {
        callApi({userId: jwt.user._id}, { t: jwt.token}, user._id).then(data => {
            if (data.error) {
                setError(data.error);
            } else {
                setUser(data);
                setFollowing(!following);
            }
        })
    }

    const photoUrl = user._id 
        ? `/api/users/photo/${user._id}?${new Date().getTime()}`
        : "/api/defaultPhoto";

    return (
        <Paper className={classes.root} elevation={4}>
            <Typography variant="h6" className={classes.title}>
                Profile
            </Typography>
            <List dense>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar src={photoUrl}>
                            <Person/>
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={user.name} secondary={user.email}/>
                    { auth.isAuthenticated().user && auth.isAuthenticated().user._id == user._id 
                        ? (<ListItemSecondaryAction>
                                <Link to={"/user/edit/" + user._id} state={user}>
                                    <IconButton aria-label="Edit" color="primary">
                                        <Edit/>
                                    </IconButton>
                                </Link>
                                <DeleteUser userId={user._id}/>
                            </ListItemSecondaryAction>)
                        : (<ListItemSecondaryAction>
                            <FollowProfileButton following={following} onButtonClick={clickFollowButton}/>
                        </ListItemSecondaryAction>)
                    }
                </ListItem>
                <ListItem><ListItemText primary={user.about} /></ListItem>
                <Divider/>
                <ListItem>
                    <ListItemText primary={"Joined: " + (new Date(user.created)).toDateString()}/>
                </ListItem>
            </List>
        </Paper>
       )
}