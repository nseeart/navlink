import { Server, version, mime } from 'node-static';
import { createServer } from 'http';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import pico from 'picocolors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const serverRoot = resolve(__dirname, '..', '..', '..', 'uploads');
const fileServer = new Server(serverRoot, {
    cache: 7200,
    headers: { 'X-Hello': 'World!' },
});
const PORT = process.env.PORT || 8088;

console.log(
    `${pico.blue(pico.bold('[server-static]'))} ${pico.green(
        `root path: ${serverRoot}`,
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
                    // The file was served successfully
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
        `is listening on http://127.0.0.1:${PORT}`,
    )}`,
);
