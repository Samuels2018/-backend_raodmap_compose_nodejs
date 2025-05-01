'use strict'
const redis = require('redis')
const config = require('./config')

const client = redis.createClient({
  url: config.redisUrl
})

client.on('error', (err) => {
  console.error('Redis error:', err)
})

client.connect()
  .then(() => console.log('Connected to Redis'))
  .catch(err => console.error('Redis connection error:', err))

module.exports = {
  get: async (key) => {
    try {
      const data = await client.get(key)
      return data ? JSON.parse(data) : null
    } catch (err) {
      console.error('Redis get error:', err)
      return null;
    }
  },
  set: async (key, value, expiration) => {
    try {
      await client.set(key, JSON.stringify(value), {
        EX: expiration
      });
    } catch (err) {
      console.error('Redis set error:', err)
    }
  }
}