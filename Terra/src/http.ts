import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'

class Http {

    public server;

    constructor() {
        this.server = express()
        this.middlewares()
        this.router()
        this.handleExceptionsRouters()
    }

    middlewares() {
        this.server.use(express.json())
        this.server.use(cors())
        this.server.use(helmet())
    }

    router() {

        this.server.get('/users', (req: Request, res: Response) => {
           
        })

        this.server.post('/users', (req: Request, res: Response) => {
            
        })
    }

    handleExceptionsRouters() {
        this.server.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            if(err instanceof Error) return res.status(400).json(err.message)

            return res.status(500).json({ message: 'Internal server error!' })
        })
    }
}

export default new Http().server