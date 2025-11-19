import { describe, it, expect } from 'vitest';
import { exec } from 'child_process';
import { promisify } from 'util';
import { DefaultONCE } from '../src/ts/layer2/DefaultONCE.js';

const execAsync = promisify(exec);

// Dynamically get component version
const componentVersion = '0.3.20.5';

describe('HTML Template Rendering', () => {
    it('should render server-status.html with model values (not template placeholders)', async () => {
        // Start server in background, fetch HTML, check content, kill server
        const testScript = `
cd /Users/Shared/Workspaces/2cuGitHub/UpDown/components/ONCE/${componentVersion} && \
./once testInput s > /dev/null 2>&1 & \
ONCE_PID=$! && \
sleep 2 && \
HTML=$(curl -s http://localhost:8080/) && \
kill $ONCE_PID 2>/dev/null && \
echo "$HTML"
        `;
        
        const { stdout } = await execAsync(testScript);
        const html = stdout;
        
        // FAIL if template placeholders are still present (means templates not rendered)
        expect(html).not.toContain('${this.');
        expect(html).not.toContain('${this.serverModel');
        expect(html).not.toContain('${this.httpPort}');
        
        // PASS if actual content is rendered
        expect(html).toContain('ONCE Server');
        expect(html).toContain('Server Status: Running');
        expect(html).toMatch(/[0-9a-f-]{36}/); // UUID pattern
        expect(html).toContain('local.once');
    }, 15000);

    it('should render once-client.html without placeholders', async () => {
        const testScript = `
cd /Users/Shared/Workspaces/2cuGitHub/UpDown/components/ONCE/${componentVersion} && \
./once testInput s > /dev/null 2>&1 & \
ONCE_PID=$! && \
sleep 2 && \
HTML=$(curl -s http://localhost:8080/once) && \
kill $ONCE_PID 2>/dev/null && \
echo "$HTML"
        `;
        
        const { stdout } = await execAsync(testScript);
        const html = stdout;
        
        expect(html).toContain('ONCE 0.2.0.0 up and running');
        expect(html).toContain('import { ONCE }');
    }, 15000);
});

