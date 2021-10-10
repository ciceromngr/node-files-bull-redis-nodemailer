import 'express-async-errors'
import 'reflect-metadata'
import './database'
import 'dotenv/config'
import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import faker from 'faker'
import axios from 'axios'
import * as Yup from 'yup'
import { getCustomRepository } from 'typeorm'
import { UsersRepository } from './repository/UserRepository'

const port = process.env.PORT || 5002

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
        this.server.use(cors())
        this.server.use(helmet())

    }

    router() {

        this.server.get('/get/bd/users', async (req: Request, res: Response) => {

            console.time()
            const userRepository = getCustomRepository(UsersRepository)
            const users = await userRepository.find()
            console.timeEnd()

            if (users.length <= 0) return res.status(400).json({ message: 'not exist users!' })
            return res.status(200).json(users)

        })

        this.server.post('/post/bd/users', async (req: Request, res: Response) => {

            const userRepository = getCustomRepository(UsersRepository)

            const { name, email } = req.body

            const schema = Yup.object().shape({
                name: Yup.string().required(),
                email: Yup.string().required()
            })

            if (!(await schema.isValid({ name, email }))) return res.status(400).json({ message: 'Name or Email is required!' })

            const usersAlready = await userRepository.findOne({ email })

            if (usersAlready) return res.status(400).json({ message: 'Email already exist!' })

            const users = userRepository.create({
                name,
                email
            })

            try {
                // no caso de usar o faker users comentar a linha de baixo! para que nao fique mandando email na fila
                await axios.post('http://localhost:5001/send/cache/mail', users)
            } catch (error) {
                throw new Error('Error to send email!')
            }

            await userRepository.save(users)

            return res.status(200).json(users)

        })

        this.server.get('/faker/user/:qtdUsers', async (req: Request, res: Response) => {

            const { qtdUsers } = req.params

            var usersAll = []

            if (!qtdUsers) return res.status(400).json({ message: 'Please put the number for next!' })

            for (var i = 0; i < parseInt(qtdUsers); i++) {
                const users = {
                    name: faker.name.firstName(),
                    email: faker.internet.email()
                }

                usersAll.push(users)

                try {
                    await axios.post('http://localhost:5001/set/cache/users', users)
                } catch (error) {
                    throw new Error('Error to set user cache')
                }
            }

            return res.status(200).json({
                message: `created faker users ${qtdUsers}`
            })

        })

    }
    exceptionRouters() {

        this.server.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            if (err instanceof Error) return res.status(400).json(err.message)

            return res.status(500).json({ err: 'Internal server error' })
        })

    }
}

new Http().server.listen(port, () => console.log(`Server Jupter running on port:${port}`))