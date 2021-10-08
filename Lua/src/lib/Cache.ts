import Redis from "ioredis"
import redisConfig from "../config/redisConfig"

class Cache {

    public redis: any

    constructor() {
        this.redis = new Redis(redisConfig)
    }

    async get(key: string) {
        const asyncRedisGet = await this.redis.get(key)
        return asyncRedisGet ? JSON.parse(asyncRedisGet) : null
    }

    set(key: string, value: string) {
        return this.redis.set(key, Buffer.from(value))
    }

    del(key: string) {
        return this.redis.del(key)
    }
}

export default new Cache()