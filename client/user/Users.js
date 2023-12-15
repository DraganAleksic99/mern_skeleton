import React, { useState, useEffect} from "react";
import { list } from "./api-user";
import { Paper,Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText,
        ListItemSecondaryAction, IconButton  } from "@material-ui/core";
import { Person, ArrowForward } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useStyles } from "../core/Home";

export default function Users() {
    const [users, setUsers] = useState([]);
    const classes = useStyles();

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        list(signal).then( data => {
            if (data && data.error) {
                console.log(data.error);
            } else {
                setUsers(data);
            }
        });
        return function cleanup() {
            abortController.abort();
        }
    }, []);

    return (
        <Paper className={classes.root} elevation={4}>
            <Typography variant="h6" className={classes.title} >
                All Users
            </Typography>
            <List dense>
                {
                    users.map((user, i) => {
                        return <Link to={"/user/" + user._id} key={i}>
                            <ListItem button>
                                <ListItemAvatar>
                                    <Avatar src={user._id 
                                    ? `/api/users/photo/${user._id}?${new Date().getTime()}`
                                    : "/api/defaultPhoto"}>
                                        <Person />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={user.name} />
                                <ListItemSecondaryAction>
                                    <IconButton>
                                        <ArrowForward />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        </Link>
                    })
                }
            </List>
        </Paper>
    )
}