// import 'reflect-metadata'
// import './database'
import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { getCustomRepository } from 'typeorm'
import { UsersRepository } from './repository/UsersRepository'

const port = process.env.PORT || 5002

class Main {

    public server

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
        this.server.get('/get/bd/users', async (req: Request, res: Response) => {
            const usersRepository = getCustomRepository(UsersRepository)
            
            const users = await usersRepository.find()

            if (users.length <= 0) throw new Error('Not exist users!')

            return res.status(200).json(users)
        })

        this.server.post('/post/bd/users', async (req: Request, res: Response) => {
            const usersRepository = getCustomRepository(UsersRepository)
            // verificar se o usuario ja existe
            const usersExist = await usersRepository.findOne({ email: req.body.email })
            if (usersExist) throw new Error('User already exist!')

            const user = usersRepository.create({
                email: req.body.email,
                name: req.body.name
            })

            await usersRepository.save(user)

            return res.status(201).json({
                message: 'User save of sucess',
                user: user
            })
        })
    }

    handleExceptionsRouters() {
        this.server.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            if (err instanceof Error) return res.status(400).json(err.message)
            return res.status(500).json({ message: 'Internal server error!' })
        })
    }
}

new Main().server.listen(port, () => console.log(`Server Saturno is running on port:${port}`))