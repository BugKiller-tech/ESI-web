const Queue = require('bull');
const { createClient } = require('redis');

// Redis client setup
// const redisClient = createClient({ host: '127.0.0.1', port: 6379 });
// redisClient.on('connect', () => {
//   console.log('Redis client connected successfully!');
// });
// redisClient.on('error', (err) => {
//   console.error('Redis connection error:', err);
// });

// redisClient.connect();


const imageProcessingQueueWithFtpOption = new Queue('image-processing', {
  redis: { host: '127.0.0.1', port: 6379 },
});

module.exports = imageProcessingQueueWithFtpOption;
