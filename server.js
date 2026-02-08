const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');

require('dotenv').config();

const PORT = process.env.PORT || 3000;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.json': 'application/json',
    '.glb': 'model/gltf-binary'
};

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    // Handle API Proxy
    if (req.url === '/api/chat' && req.method === 'POST') {
        console.log('Received chat request');
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            console.log('Forwarding to Groq API...');

            try {
                const requestBody = JSON.parse(body);
                const groqBody = JSON.stringify(requestBody);

                const proxyReq = https.request('https://api.groq.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${GROQ_API_KEY}`,
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(groqBody)
                    }
                }, (proxyRes) => {
                    console.log('Groq API Response Status:', proxyRes.statusCode);
                    let data = '';
                    proxyRes.on('data', chunk => data += chunk);
                    proxyRes.on('end', () => {
                        console.log('Groq API Response received');
                        res.writeHead(proxyRes.statusCode, { 'Content-Type': 'application/json' });
                        res.end(data);
                    });
                });

                proxyReq.on('error', (e) => {
                    console.error('Proxy Error:', e);
                    res.writeHead(500);
                    res.end(JSON.stringify({ error: 'Proxy error', details: e.message }));
                });

                proxyReq.write(groqBody);
                proxyReq.end();
            } catch (e) {
                console.error('Request parsing error:', e);
                res.writeHead(500);
                res.end(JSON.stringify({ error: 'Invalid request format' }));
            }
        });
        return;
    }

    // Serve Static Files from dist folder
    // Remove query parameters for file path resolution
    const cleanUrl = req.url.split('?')[0];
    let filePath = './dist' + cleanUrl;
    if (filePath === './dist/') filePath = './dist/index.html';

    const extname = path.extname(filePath);
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log('API Proxy enabled at /api/chat');
});
