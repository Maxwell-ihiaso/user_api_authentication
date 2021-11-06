const redis = require('redis');
const client = redis.createClient({
    host: process.env.REDIS_HOSTNAME,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
})

client.on("connect", () => console.log("Connected to our redis instance!"));

client.on("ready", () => console.log("Redis instance is ready!"));

client.on("error", (err) => console.log('redis error', err));

client.on("end", () => console.log("redis instance closed successfully!"));

process.on('SIGINT', () => client.quit());

module.exports = client;