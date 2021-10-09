import 'reflect-metadata'
import './database'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import faker from 'faker'
import axios from 'axios'
import * as Yup from 'yup'
import { getCustomRepository } from 'typeorm'
import { UsersRepository } from './repository/UserRepository'
const app = express()
const port = process.env.EX_PORT || 5002
app.use(express.json())
app.use(cors())
app.use(helmet())

app.get('/get/bd/users', async (req, res) => {
    console.time()
    const userRepository = getCustomRepository(UsersRepository)
    const users = await userRepository.find()
    console.log(users.length)
    console.timeEnd()
    if (users.length <= 0) return res.status(400).json({ message: 'not exist users!' })
    return res.status(200).json(users)
})

app.post('/post/bd/users', async (req, res) => {
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
        // await axios.post('http://localhost:5001/send/cache/mail', users)
    } catch (error) {
        console.log('error: set redis users')
    }

    await userRepository.save(users)


    return res.status(200).json(users)
})

app.get('/faker/user/:qtdUsers', async (req, res) => {
    const userRepository = getCustomRepository(UsersRepository)
    const { qtdUsers } = req.params

    var usersAll = []

    if (!qtdUsers) return res.status(400).json({ message: 'Please put the number for next!' })

    for (var i = 0; i < parseInt(qtdUsers); i++) {
        const users = userRepository.create({
            name: faker.name.firstName(),
            email: faker.internet.email()
        })

        usersAll.push(users)

        try {
            // await axios.post('http://localhost:5001/send/cache/mail', users)
            await axios.post('http://localhost:5001/set/cache/users', users)
        } catch (error) {
            console.log('error: set redis users')
        }

        await userRepository.save(users)

    }

    return res.status(200).json(usersAll)
})

app.listen(port, () => console.log(`Server Jupter running on port:${port}`))