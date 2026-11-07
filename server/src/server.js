import app from './app.js';
import { config, validateEnvironment } from './config/env.js';

validateEnvironment();

const server = app.listen(config.port, () => {
  console.log(`\n🌱 AgriGuide AI Server is running!`);
  console.log(`   - Environment: ${config.nodeEnv}`);
  console.log(`   - Local:       http://localhost:${config.port}`);
  console.log(`   - Health Check: http://localhost:${config.port}/api/v1/health\n`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server gracefully');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
