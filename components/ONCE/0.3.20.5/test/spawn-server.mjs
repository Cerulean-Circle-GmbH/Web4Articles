/**
 * Helper script to spawn a server as a separate process
 * Usage: node spawn-server.mjs [primary|client]
 */

import { DefaultONCE } from '../dist/ts/layer2/DefaultONCE.js';

const serverType = process.argv[2] || 'client';

async function main() {
    try {
        const server = new DefaultONCE();
        await server.init();
        await server.startServer();
        
        const model = server.getServerModel();
        const port = model.capabilities.find(c => c.capability === 'httpPort')?.port;
        
        // Output server info to stdout for parent process (JSON on single line)
        process.stdout.write(JSON.stringify({
            pid: process.pid,
            port,
            uuid: model.uuid,
            type: serverType
        }) + '\n');
        
        // Keep process alive
        process.on('SIGTERM', async () => {
            process.stderr.write('Received SIGTERM, shutting down gracefully...\n');
            await server.stopServer();
            process.exit(0);
        });
        
        // Prevent process from exiting
        setInterval(() => {}, 1000);
    } catch (error) {
        process.stderr.write(`Server startup error: ${error}\n`);
        process.exit(1);
    }
}

main();

