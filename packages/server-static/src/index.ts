import { Server } from 'node-static';
import { createServer as httpCreateServer } from 'http';
import { createServer as httpsCreateServer } from 'https';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import pico from 'picocolors';
import { config } from 'dotenv';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const path = resolve(__dirname, '..', 'envs', `.env.${process.env.NODE_ENV}`);
config({ debug: true, path });

const staticRootDir = resolve(__dirname, '..', '..', '..', 'uploads');
const fileServer = new Server(staticRootDir, {
    cache: 7200,
    headers: { 'X-nav': 'link' },
});
const PORT = process.env.PORT || 8088;
const HOST = process.env.HOST || 'https://127.0.0.1';
const keysRootDir = resolve(__dirname, '..', 'keys');
const httpsOptions = {
    key: readFileSync(resolve(keysRootDir, 'privatekey.pem')),
    cert: readFileSync(resolve(keysRootDir, 'certificate.pem')),
};

console.log(
    `${pico.blue(pico.bold('[server-static]'))} ${pico.green(
        `root path: ${staticRootDir}`,
    )}`,
);

function staticServer(request, response) {
    fileServer.serve(request, response, (err, res) => {
        if (err) {
            console.log(
                `${pico.red(pico.bold('[Error serving]'))} ${pico.red(
                    `${request.url} - ${err.message}`,
                )}`,
            );
            response.writeHead(err.status, err.headers);
            response.end();
        } else {
            console.log(
                `${pico.blue(pico.bold('[server-static]'))} ${pico.green(
                    `${request.url} - ${res.message}`,
                )}`,
            );
        }
    });
}

httpCreateServer((request, response) => {
    request
        .addListener('end', () => {
            staticServer(request, response);
        })
        .resume();
}).listen(PORT);
httpsCreateServer(httpsOptions, (request, response) => {
    request
        .addListener('end', () => {
            staticServer(request, response);
        })
        .resume();
}).listen(443);

console.log(
    `${pico.yellow(pico.bold('[server-static]'))} ${pico.yellow(
        `is listening on http://${HOST}:${PORT}`,
    )}`,
);
console.log(
    `${pico.yellow(pico.bold('[server-static]'))} ${pico.yellow(
        `is listening on https://${HOST}:443`,
    )}`,
);
