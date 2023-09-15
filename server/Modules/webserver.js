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

    app.get('/config', async (req, res) => {
        res.render('config', {
            title: 'Blockchain Config :: Minataur - The Fastest block explorer for Mina Blockchain',
            appTitle: 'Blockchain Config',
            client: JSON.stringify(client)
        })
    })

    app.get('/peers', async (req, res) => {
        res.render('peers', {
            title: 'Blockchain Peers :: Minataur - The Fastest block explorer for Mina Blockchain',
            appTitle: 'Blockchain Peers',
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

    app.get('/block/:hash', async (req, res) => {
        const hash = req.params.hash

        res.render('block', {
            title: 'Block Info :: ' + hash,
            appTitle: 'Block Info',
            client: JSON.stringify(client),
            hash,
        })
    })

    app.get('/pool', async (req, res) => {
        res.render('pool', {
            title: 'Transactions Pool :: Minataur - The Fastest block explorer for Mina Blockchain',
            appTitle: 'Transactions Pool',
            client: JSON.stringify(client)
        })
    })

    app.get('/transactions', async (req, res) => {
        res.render('transactions', {
            title: 'User Transactions :: Minataur - The Fastest block explorer for Mina Blockchain',
            appTitle: 'User Transactions',
            client: JSON.stringify(client)
        })
    })

    app.get('/transaction/:hash', async (req, res) => {
        const hash = req.params.hash

        res.render('transaction', {
            title: 'Transaction Info :: ' + hash,
            appTitle: 'Transaction Info',
            client: JSON.stringify(client),
            hash,
        })
    })

    app.get('/accounts', async (req, res) => {
        res.render('accounts', {
            title: 'Accounts :: Minataur - The Fastest block explorer for Mina Blockchain',
            appTitle: 'Accounts',
            client: JSON.stringify(client)
        })
    })

    app.get('/account/:hash', async (req, res) => {
        const hash = req.params.hash

        res.render('account', {
            title: 'Account Info :: ' + hash,
            appTitle: 'Account Info',
            client: JSON.stringify(client),
            hash,
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