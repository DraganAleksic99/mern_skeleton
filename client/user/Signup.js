import React, { useState } from "react";
import { create } from "./api-user";
import { useStyles } from "../core/Home";
import { Card, CardContent, Typography, TextField, CardActions, Button,
    Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from "@material-ui/core";
import { Link } from "react-router-dom";

export default function Signup () {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        open: false,
        error: ''
    });
    const classes = useStyles();
    const handleChange = name => event => {
        setValues({...values, [name]: event.target.value});
    }
    const clickSubmit = () => {
        const user = {
            name: values.name || undefined,
            email: values.email || undefined,
            password: values.password || undefined
        }
        create(user).then((data) => {
            if (data.error) {
                setValues({...values, error: data.error});
            } else {
                setValues({...values, error: '', open: true});
            }
        })
    }

    return (
        <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
            <Card className={classes.card}>
                <CardContent>
                    <Typography variant="h6" className={classes.title}>
                        Sign Up
                    </Typography>
                    <TextField id="name" label="Name" className={classes.textField}
                        value={values.name} margin="normal" onChange={handleChange("name")} />
                    <br />
                    <TextField id="email" label="Email" className={classes.textField}
                        value={values.email} margin="normal" onChange={handleChange("email")} />
                    <br />
                    <TextField id="password" label="Password" className={classes.textField}
                        value={values.password} margin="normal" onChange={handleChange("password")} />
                    <br />
                    { values.error && ( <Typography component="p" color="error" >
                        { values.error }
                    </Typography>)}
                </CardContent>
                <CardActions>
                    <Button color="primary" variant="contained" onClick={clickSubmit}
                        className={classes.submit} >Submit</Button>
                </CardActions>
            </Card>
            <Dialog open={values.open} >
                <DialogTitle>New Account</DialogTitle>
                <DialogContent>
                    <DialogContentText>New account successfully created</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Link to="/signin">
                        <Button color="primary" autoFocus="autuoFocus" variant="contained">
                            Sign In
                        </Button>
                    </Link>
                </DialogActions>
            </Dialog>
        </div>
    )
}