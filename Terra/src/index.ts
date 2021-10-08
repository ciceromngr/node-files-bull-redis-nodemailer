import server from './http'
const port = process.env.PORT || 5000
server.listen(port, () => console.log(`Server Terra is running on port:${port}`))