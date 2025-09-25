#!/usr/bin/env node

/**
 * Production Startup Script
 * This script detects the environment and starts either the API server or the worker
 */

import { spawn } from 'child_process';
import { join } from 'path';

// Debug: Print environment variables
console.log('🔍 Debug: RAILWAY_SERVICE_NAME=' + process.env.RAILWAY_SERVICE_NAME);
console.log('🔍 Debug: SERVICE_MODE=' + process.env.SERVICE_MODE);
console.log('🔍 Debug: RAILWAY_START_COMMAND=' + process.env.RAILWAY_START_COMMAND);

// Check if we should run in worker mode
const isWorkerMode = 
  process.env.RAILWAY_SERVICE_NAME === 'email-gateway-worker' ||
  process.env.SERVICE_MODE === 'worker' ||
  process.env.RAILWAY_START_COMMAND === 'npm run worker';

if (isWorkerMode) {
  console.log('🚀 Starting Email Gateway Worker...');
  
  // Start the worker
  const workerPath = join(__dirname, 'queue', 'worker.js');
  const worker = spawn('node', [workerPath], {
    stdio: 'inherit',
    env: process.env
  });
  
  worker.on('error', (error) => {
    console.error('❌ Worker failed to start:', error);
    process.exit(1);
  });
  
  worker.on('exit', (code) => {
    console.log(`Worker exited with code ${code}`);
    process.exit(code || 0);
  });
  
} else {
  console.log('🌐 Starting Email Gateway API Server...');
  
  // Start the API server
  const serverPath = join(__dirname, 'index.js');
  const server = spawn('node', [serverPath], {
    stdio: 'inherit',
    env: process.env
  });
  
  server.on('error', (error) => {
    console.error('❌ Server failed to start:', error);
    process.exit(1);
  });
  
  server.on('exit', (code) => {
    console.log(`Server exited with code ${code}`);
    process.exit(code || 0);
  });
}
