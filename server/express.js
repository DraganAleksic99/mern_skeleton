import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import devBundle from "./devBundle";
import path from "path";
import React from "react";
import ReactDOMServer from "react-dom/server";
import {StaticRouter} from "react-router-dom/server";
import App from "../client/App";
import { ThemeProvider } from "@material-ui/core";
import theme from "../client/theme";
import { CacheProvider } from "@emotion/react";
import createEmotionServer from "@emotion/server/create-instance";
import createEmotionCache from "./createEmotionCache";
import { CssBaseline } from "@material-ui/core";

const CURRENT_WORKING_DIR = process.cwd();
const app = express();
devBundle.compile(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(compression());
app.use(cors());
app.use("/", userRoutes);
app.use("/", authRoutes);
app.use((err, req, res, next) => {
    if (err.name === "UnauthorizedError") {
        res.status(401).json({error: `${err.name}: ${err.message}`});
    } else if (err) {
        res.status(400).json({error: `${err.name}: ${err.message}`});
        console.log(err);
    }
});
app.use("/", express.static(path.join(CURRENT_WORKING_DIR, "dist")));
app.use(handleRender);

function renderFullPage(html, css) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>MERN Social</title>
          ${css}
          <meta name="viewport" content="initial-scale=1, width=device-width" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        </head>
        <body>
          <div id="root">${html}</div>
        </body>
      </html>
    `;
  }
  

function handleRender(req, res) {
    const cache = createEmotionCache();
    const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(cache);
    const html = ReactDOMServer.renderToString(
            <StaticRouter location={req.url}>
                <CacheProvider value={cache}>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <App />
                    </ThemeProvider>
                </CacheProvider>
            </StaticRouter>
    );
    const emotionChunks = extractCriticalToChunks(html);
    const emotionCss = constructStyleTagsFromChunks(emotionChunks);
    res.send(renderFullPage(html, emotionCss));
}

export default app;