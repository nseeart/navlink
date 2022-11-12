import { Server } from 'node-static';
import { createServer } from 'http';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import pico from 'picocolors';
import { config } from 'dotenv';

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
const HOST = process.env.HOST || 'http://127.0.0.1';

console.log(
    `${pico.blue(pico.bold('[server-static]'))} ${pico.green(
        `root path: ${staticRootDir}`,
    )}`,
);

createServer((request, response) => {
    request
        .addListener('end', () => {
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
                        `${pico.blue(
                            pico.bold('[server-static]'),
                        )} ${pico.green(`${request.url} - ${res.message}`)}`,
                    );
                }
            });
        })
        .resume();
}).listen(PORT);
console.log(
    `${pico.yellow(pico.bold('[server-static]'))} ${pico.yellow(
        `is listening on ${HOST}:${PORT}`,
    )}`,
);
