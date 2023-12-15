import React from "react";
import MainRouter from "./MainRouter";
import { hot } from "react-hot-loader";

const App = () => {
    return (
        <>
            <MainRouter />
        <script type="text/javascript" src="/dist/bundle.js" />
        </>
    )
}

export default hot(module)(App);