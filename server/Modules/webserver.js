import path from "path";
import http, {createServer} from "http";
import express from "express";
import favicon from "serve-favicon"
import {websocket} from "./websocket.js";
import {log} from "../Helpers/log.js";
import {WebSocketServer} from "ws";
import { createYoga } from 'graphql-yoga'
import {schema} from "../GraphQL/schema.js";

const app = express()

const routes = () => {
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

    app.get('/daemon', async (req, res) => {
        res.render('daemon', {
            title: 'Mina Daemon Status :: Minataur - The Fastest block explorer for Mina Blockchain',
            appTitle: 'Mina Daemon Status',
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

    app.get('/tools/check-ports', async (req, res) => {
        res.render('check-ports', {
            title: 'Check Ports :: Minataur - The Fastest block explorer for Mina Blockchain',
            appTitle: 'Check Ports',
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

    app.get('/zkapps', async (req, res) => {
        res.render('zkapps', {
            title: 'zkApps :: Minataur - The Fastest block explorer for Mina Blockchain',
            appTitle: 'zkApps',
            client: JSON.stringify(client)
        })
    })

    app.get('/coinbase', async (req, res) => {
        res.render('coinbase', {
            title: 'Coinbase Rewards :: Minataur - The Fastest block explorer for Mina Blockchain',
            appTitle: 'Coinbase Rewards',
            client: JSON.stringify(client)
        })
    })

    app.get('/analytics/price', async (req, res) => {
        res.render('analytics-price', {
            title: 'Mina Price Analytics :: Minataur - The Fastest block explorer for Mina Blockchain',
            appTitle: 'Mina Price Analytics',
            client: JSON.stringify(client)
        })
    })

    app.get('/search', async (req, res) => {
        const query = req.query
        const queryString = []

        for(let key in query) {
            queryString.push(query[key].trim())
        }

        res.render('search', {
            title: 'Search in Blockchain :: Minataur - The Fastest block explorer for Mina Blockchain',
            appTitle: 'Search in Blockchain',
            client: JSON.stringify(client),
            query: queryString.join(", ")
        })
    })
}

export const create_web_server  = () => {
    const {name, host = "localhost", port = 3000} = config.server
    const httpServer = http.createServer({}, app)

    app.use(express.static(path.join(appPath, 'Views')))
    app.use(favicon(path.join(appPath, 'Views', 'favicon.ico')))
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    app.locals.pretty = true

    app.set('views', path.resolve(appPath, 'Views'))
    app.set('view engine', 'pug')

    routes()

    httpServer.listen(port, host, () => {
        log(`Minataur WebServer is running on http://${host}:${port} [${name}]`)
    })

    const yoga = createYoga({schema})
    const graphqlServer = createServer(yoga)
    graphqlServer.listen(config.graphql.port, config.graphql.host,() => {
        log(`Minataur GraphQL Server is running on http://${config.graphql.host}:${config.graphql.port}/graphql`)
    })

    globalThis.wss = new WebSocketServer({ server: httpServer })

    websocket()
}