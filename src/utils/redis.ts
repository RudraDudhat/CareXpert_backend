import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    reconnectStrategy: () => false, // Don't reconnect automatically
  },
});

let isConnected = false;

// Suppress error logs if Redis is intentionally unavailable
redisClient.on('error', () => {
  // Silently fail - rate limiter will use memory fallback
});

redisClient.on('connect', () => {
  isConnected = true;
  console.log('✓ Redis Connected');
});

// Attempt connection silently
(async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    // Redis not available - app will use memory fallback
    console.log('ℹ Redis unavailable - using memory fallback for rate limiting');
  }
})();

export default redisClient;
