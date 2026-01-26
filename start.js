const { spawn, exec } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const BACKEND_PORT = 5000;
const CHECK_INTERVAL = 1000; // 1 second
const TIMEOUT = 60000; // 60 seconds
const BACKEND_DIR = path.join(__dirname, 'backend');
const FRONTEND_FILE = 'index.html';

console.log('===================================================');
console.log('  Starting Medicare Medical Store Application');
console.log('===================================================');
console.log('');
console.log('!!! DO NOT CLOSE THIS WINDOW !!!');
console.log('If you close this window, the application will stop working.');
console.log('Minimize it instead.');
console.log('');

// 1. Start Backend
console.log('[1/2] Starting Backend Server...');
const backendProcess = spawn('npm', ['start'], {
    cwd: BACKEND_DIR,
    shell: true,
    stdio: 'inherit' // Let the user see backend logs
});

backendProcess.on('error', (err) => {
    console.error('Failed to start backend:', err);
});

// 2. Wait for Backend
console.log('Waiting for backend to be ready...');

const startTime = Date.now();

const checkServer = () => {
    if (Date.now() - startTime > TIMEOUT) {
        console.error('Timeout waiting for backend to start.');
        return;
    }

    const req = http.get(`http://localhost:${BACKEND_PORT}/`, (res) => {
        if (res.statusCode === 200) {
            console.log('Backend is ready!');
            openFrontend();
        } else {
            setTimeout(checkServer, CHECK_INTERVAL);
        }
    });

    req.on('error', () => {
        // Server not ready yet
        setTimeout(checkServer, CHECK_INTERVAL);
    });

    req.end();
};

// Start checking
setTimeout(checkServer, 2000); // Give it a couple of seconds to breathe first

// 3. Open Frontend
const openFrontend = () => {
    console.log('');
    console.log('[2/2] Opening Application in Browser...');

    // Open localhost URL instead of file path
    const appUrl = `http://localhost:${BACKEND_PORT}/index.html`;

    const startCommand = process.platform === 'win32' ? 'start' : 'open';
    exec(`${startCommand} "" "${appUrl}"`, (err) => {
        if (err) {
            console.error('Failed to open browser:', err);
        } else {
            console.log('Application opened successfully!');
            console.log('');
            console.log('NOTE: Keep this window open while using the application.');
        }
    });
};

// Handle exit
process.on('SIGINT', () => {
    console.log('Stopping backend...');
    backendProcess.kill();
    process.exit();
});
