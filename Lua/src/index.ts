import 'express-async-errors'
import 'dotenv/config'
import express, { NextFunction, Request, Response } from 'express'
import Cache from './lib/Cache'
import axios from 'axios'
import helmet from 'helmet'
import cors from 'cors'
import Queues from './background/lib/Queues'
const port = process.env.PORT || 5001

class Http {

    public server: any

    constructor() {

        this.server = express()
        this.middleware()
        this.router()
        this.exceptionRouters()

    }

    middleware() {

        this.server.use(express.json())
        this.server.use(helmet())
        this.server.use(cors())

    }

    router() {
        this.server.get('/get/cache/users', async (req: Request, res: Response) => {

            console.time()
            const cacheUsers = await Cache.get('users')
            console.timeEnd()

            if (cacheUsers) return res.status(200).json(cacheUsers)
            return res.status(400).json("Not exist users in memory cache")

        })

        this.server.post('/set/cache/users', async (req: Request, res: Response) => {

            if (!req.body) return res.status(400).json('Not impossible to put data on redis cache, because request body is empty!')
            const cacheUsers: any = await Cache.get('users')

            try {

                const response = await axios.post('http://localhost:5002/post/bd/users', req.body)

                // Se nao tiver nada no cache ele adiciona mas se tiver ele pega o que ja existe,
                // E adiciona um outro dado.
                if (!cacheUsers) {
                    Cache.set('users', [response.data])
                } else {
                    Cache.set('users', [...cacheUsers, response.data])
                }

            } catch (error) {
                throw new Error('Not is impossible to save in cache memory')
            }

            return res.status(201).json({
                message: 'Created users in memory cache, successful!'
            })
        })

        this.server.post('/send/cache/mail', async (req: Request, res: Response) => {

            await Queues.add('sendMailForUsers', req.body)
            return res.status(200).json({ message: `Email enviado para ${req.body.name}` })

        })

        this.server.delete('/del/cache/users', async (req: Request, res: Response) => {

            await Cache.del('users')
            return res.status(200).json({
                message: 'Cache users romove in memory'
            })

        })
    }

    exceptionRouters() {
        this.server.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            if(err instanceof Error) return res.status(400).json(err.message)

            return res.status(500).json({ message: 'Internal server error!' })
        })
    }
}

new Http().server.listen(port, () => console.log(`Server Lua running on port:${port}`))