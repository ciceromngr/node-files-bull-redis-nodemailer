import 'express-async-errors'
import express, { Request, Response } from 'express'
import Cache from './lib/Cache'
import axios from 'axios'
import Queues from './background/lib/Queues'
const port = process.env.PORT || 5001
var users = []
class Http {

    public server: any
    constructor() {
        this.server = express()
        this.server.use(express.json())
        this.router()
    }

    router() {
        this.server.get('/get/cache/users', async (req: Request, res: Response) => {
            console.time()
            const cacheUsers = await Cache.get('users')
            console.timeEnd()
            if (cacheUsers) return res.status(200).json(cacheUsers)
        })

        this.server.post('/set/cache/users', async (req: Request, res: Response) => {
            if (!req.body) return res.status(400).json('Not impossible to put data on redis cache, because request body is empty!')

            try {
                const response = await axios.post('http://localhost:5002/post/bd/users', req.body)
                users.push(response.data)
                Cache.set('users', users)
            } catch (error) {
                console.log('error post set cache')
            }

            return res.status(201).json({
                message: 'Created users in memory cache, successful!'
            })
        })

        this.server.post('/send/cache/mail', async (req: Request, res: Response) => {
            await Queues.add('sendMailForUsers', req.body)
            return res.json(req.body)
        })

        this.server.delete('/del/cache/users', async (req: Request, res: Response) => {
            await Cache.del('users')
            return res.status(200).json({
                message: 'Cache users romove in memory'
            })
        })
    }
}

new Http().server.listen(port, () => console.log(`Server Lua running on port:${port}`))