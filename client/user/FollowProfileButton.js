import React from "react";
import { Button } from "@material-ui/core";
import { follow, unfollow } from "./api-user";
import auth from "../auth/auth-helper";

export default function FollowProfileButton(props) {
    const jwt = auth.isAuthenticated();

    const followClick = () => {
        props.onButtonClick(follow, jwt);
    }

    const unfollowClick = () => {
        props.onButtonClick(unfollow, jwt);
    }

    return (
        <div>
            { props.following
                ? ( <Button variant="contained" color="secondary" onClick={unfollowClick}>Unfollow</Button> )
                : ( <Button variant="contained" color="primary" onClick={followClick}>Follow</Button>)}
        </div>
    )
}