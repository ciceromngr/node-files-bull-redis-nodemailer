import Queue from "bull";
import redisConfig from "../../config/redisConfig";
import * as jobs from '../jobs'

const queues = Object.values(jobs).map(job => ({
    bull: new Queue(job.key, { redis: redisConfig }),
    name: job.key,
    fnVoid: job.void
}))

export default {
    queues,
    add(name: string, data: any) {
        const queue = queues.find(queue => queue.name === name)
        return queue.bull.add(data)
    },
    process() {
        return queues.forEach(queue => {
            queue.bull.process(queue.fnVoid)
        })
    }
}