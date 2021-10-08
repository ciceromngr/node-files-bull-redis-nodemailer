import express from 'express'
import Cache from './lib/Cache'
const port = process.env.PORT || 5001

class Http {

    public server
    constructor() {
        this.server = express()
        this.router()
    }

    router() {
        this.server.get('/cache/users', async (req, res) => {
            const cacheUsers = await Cache.get('users')
            if(!cacheUsers) return res.status(400).json('Not exist user in memory cache!')
            return res.status(200).json(cacheUsers)
        })

        this.server.post('/cache/users', (req, res) => {

        })

        this.server.post('/send/cache/mail', (req, res) => {

        })
    }
}

new Http().server.listen(port)