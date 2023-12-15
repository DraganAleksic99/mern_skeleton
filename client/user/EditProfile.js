import React, { useState } from "react";
import { useMatch, Navigate, useLocation, useNavigate } from "react-router";
import auth from "../auth/auth-helper";
import { update } from "./api-user";
import { Card, CardContent,Typography, TextField, CardActions, Button,
     Avatar } from "@material-ui/core";
import { useStyles } from "../core/Home";
import { Person } from "@material-ui/icons";

export default function EditProfile() {
    const classes = useStyles();
    const match = useMatch("/user/edit/:userId");
    const user = useLocation().state;
    const navigate = useNavigate();

    const [values, setValues] = useState({
        name: user?.name || '',
        about: user?.about || '',
        photo: {},
        email: user?.email || '',
        password: '',
        error: '',
        userId: '',
        redirectToProfile: false
    });

    const handleChange = name => event => {
        const value = name === 'photo' ? event.target.files[0] : event.target.value;
        setValues({...values, [name]: value});
    }

    const clickSubmit = () => {
        const jwt = auth.isAuthenticated();
        let userData = new FormData();
        values.name && userData.append('name', values.name);
        values.email && userData.append('email', values.email);
        values.password && userData.append('password', values.password);
        values.about && userData.append('about', values.about);
        values.photo && userData.append('photo', values.photo);

        update({userId: match.params.userId}, {t: jwt.token}, userData).then((data) => {
            if (data && data.error) {
                setValues({...values, error: data.error});
            } else {
                setValues({...values, userId: data._id, redirectToProfile: true});
            }
        });
    }

    if (values.redirectToProfile) {
        return <Navigate to={`/user/${values.userId}`} />
    }

    return (
        <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
            <Card className={classes.card}>
                <CardContent>
                    <Typography variant="h6" className={classes.title}>
                        Edit Profile
                    </Typography>
                    <Avatar src={`/api/users/photo/${user._id}`}>
                        <Person />
                    </Avatar>
                    <div>
                    <input accept="image/*" type="file" onChange={handleChange("photo")} 
                        style={{display: "none"}} id="icon-button-file" />
                    <label htmlFor="icon-button-file">
                        <Button variant="contained" color="default" component="span">
                            Upload
                        </Button>
                    </label>
                    <span className={classes.filename}>
                        { values.photo ? values.photo.name : ''}
                    </span>
                    </div>
                    <TextField id="name" label="Name" className={classes.textField}
                        value={values.name} margin="normal" onChange={handleChange("name")} />
                    <br />
                    <TextField id="multiline-flexible" label="About" className={classes.textField} multiline
                        value={values.about} margin="normal" onChange={handleChange("about")} minRows="2" />
                    <br />
                    <TextField id="email" label="Email" className={classes.textField} type="email"
                        value={values.email} margin="normal" onChange={handleChange("email")} />
                    <br />
                    <TextField id="password" label="Password" className={classes.textField} type="password"
                        value={values.password} margin="normal" onChange={handleChange("password")} />
                    <br />
                    { values.error && ( <Typography component="p" color="error" >
                        { values.error }
                    </Typography>)}
                </CardContent>
                <CardActions>
                    <Button color="primary" variant="contained" onClick={clickSubmit}
                        className={classes.submit} >Save</Button>
                    <Button color="primary" variant="contained" onClick={() => navigate(`/user/${match.params.userId}`)}
                        className={classes.submit} >Cancel</Button>
                </CardActions>
            </Card>
        </div>    
    )
}