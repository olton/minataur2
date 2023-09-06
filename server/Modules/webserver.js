import path from "path";
import http from "http";
import express from "express";
import favicon from "serve-favicon"
import {create_websocket_server} from "./websocket.js";
import {log} from "../Helpers/log.js";

const app = express()

const routes = () => {
    app.use(express.static(path.join(appPath, 'Views')))
    app.use(favicon(path.join(appPath, 'Views', 'favicon.ico')))
    app.locals.pretty = true
    app.set('views', path.resolve(appPath, 'Views'))
    app.set('view engine', 'pug')

    const client = {...config.client, version: packageJson.version}

    app.get('/', async (req, res) => {
        res.render('index', {
            title: 'Minataur - The Fastest block explorer for Mina Blockchain',
            appTitle: 'Mina Blockchain Explorer',
            client: JSON.stringify(client)
        })
    })

    app.get('/blockchain', async (req, res) => {
        res.render('blockchain', {
            title: 'Blockchain :: Minataur - The Fastest block explorer for Mina Blockchain',
            appTitle: 'Blockchain',
            client: JSON.stringify(client)
        })
    })

}

export const create_web_server  = () => {
    const {name, host = "localhost", port = 3000} = config.server
    const httpServer = http.createServer({}, app)

    routes()

    httpServer.listen(port, host, () => {
        log(`Minataur running on http://${host}:${port} [${name}]`)
    })

    create_websocket_server(httpServer)
}