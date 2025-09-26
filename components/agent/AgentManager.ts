import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

/**
 * AgentManager - Manages agent configuration including name changes
 * Following Radical OOP principles - all logic encapsulated in class
 * 
 * IMPORTANT: This tool manages a local configuration file only.
 * It does NOT change the agent name displayed in Cursor IDE.
 * Cursor currently does not provide an API to programmatically change agent names.
 * Agent names in Cursor must be changed through the Cursor UI settings.
 */
export class AgentManager {
    private static currentName: string = 'DefaultAgent';
    private static configPath: string = join(
        dirname(fileURLToPath(import.meta.url)),
        '../../.agent-config.json'
    );
    
    /**
     * Entry point for the agent command
     * Handles the CLI invocation for agent management
     */
    public static start(): void {
        // Load configuration on start
        this.loadConfiguration();
        
        const args = process.argv.slice(2);
        
        if (args.length === 0) {
            this.showHelp();
            return;
        }
        
        const command = args[0];
        
        switch (command) {
            case 'set':
                this.handleSetCommand(args.slice(1));
                break;
            case 'get':
                this.handleGetCommand();
                break;
            case 'help':
                this.showHelp();
                break;
            default:
                console.error(`Unknown command: ${command}`);
                this.showHelp();
                process.exit(1);
        }
    }
    
    /**
     * Handles the 'set' command for changing agent properties
     */
    private static handleSetCommand(args: string[]): void {
        if (args.length < 2) {
            console.error('Error: set command requires property and value');
            console.error('Usage: agent set name "new name"');
            process.exit(1);
        }
        
        const property = args[0];
        const value = args.slice(1).join(' ');
        
        switch (property) {
            case 'name':
                this.setName(value);
                break;
            default:
                console.error(`Unknown property: ${property}`);
                console.error('Available properties: name');
                process.exit(1);
        }
    }
    
    /**
     * Handles the 'get' command for retrieving agent properties
     */
    private static handleGetCommand(): void {
        console.log(`Current agent name: ${this.currentName}`);
    }
    
    /**
     * Sets the agent name
     */
    private static setName(name: string): void {
        // Remove quotes if present
        const cleanName = name.replace(/^["']|["']$/g, '');
        
        if (!cleanName || cleanName.trim().length === 0) {
            console.error('Error: Name cannot be empty');
            process.exit(1);
        }
        
        this.currentName = cleanName;
        console.log(`Agent name successfully changed to: ${cleanName}`);
        console.log('⚠️  Note: This changes the local configuration only.');
        console.log('   The agent name in Cursor IDE will not be affected.');
        
        // Persist configuration
        this.saveConfiguration();
    }
    
    /**
     * Shows help information
     */
    private static showHelp(): void {
        console.log('Agent Manager - Manage agent configuration');
        console.log('');
        console.log('⚠️  LIMITATION: This tool manages a local configuration file only.');
        console.log('   It does NOT change the agent name displayed in Cursor IDE.');
        console.log('   To change agent names in Cursor, use Cursor\'s UI settings.');
        console.log('');
        console.log('Usage:');
        console.log('  agent set name "new name"  - Set the agent name (local config only)');
        console.log('  agent get                  - Get current agent name from local config');
        console.log('  agent help                 - Show this help message');
        console.log('');
        console.log('Examples:');
        console.log('  agent set name "Backend Developer Agent"');
        console.log('  agent set name "Scrum Master"');
    }
    
    /**
     * Loads configuration from file if it exists
     */
    private static loadConfiguration(): void {
        try {
            if (existsSync(this.configPath)) {
                const configData = readFileSync(this.configPath, 'utf-8');
                const config = JSON.parse(configData);
                
                if (config.name) {
                    this.currentName = config.name;
                }
            }
        } catch (error) {
            console.error('Warning: Could not load configuration:', error);
            // Continue with defaults
        }
    }
    
    /**
     * Saves current configuration to file
     */
    private static saveConfiguration(): void {
        try {
            const config = {
                name: this.currentName,
                lastUpdated: new Date().toISOString()
            };
            
            // Ensure directory exists
            const configDir = dirname(this.configPath);
            if (!existsSync(configDir)) {
                mkdirSync(configDir, { recursive: true });
            }
            
            writeFileSync(this.configPath, JSON.stringify(config, null, 2));
        } catch (error) {
            console.error('Warning: Could not save configuration:', error);
            // Continue without persistence
        }
    }
}

// Entry point for ESM execution
if (import.meta.url === `file://${process.argv[1]}`) {
    AgentManager.start();
}