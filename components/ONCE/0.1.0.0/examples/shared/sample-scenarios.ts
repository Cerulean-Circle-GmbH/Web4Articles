/**
 * Sample scenarios for ONCE examples
 * Based on Web4 scenario structure requirements from Sprint 22
 */

import { Scenario } from '../../src/ts/layer3/Scenario.js';

/**
 * User scenario - represents a user object
 * Three-attribute structure: IOR, owner, model
 */
export const userScenario: Scenario = {
    uuid: 'af0b6e99-85c9-4ce5-9945-031767f375c9',
    objectType: 'User',
    version: '0.1.3.0',
    state: {
        IOR: 'user:af0b6e99-85c9-4ce5-9945-031767f375c9',
        owner: 'Web4 Example User',
        model: {
            firstName: 'Alice',
            lastName: 'Web4',
            email: 'alice@web4.example',
            role: 'Developer',
            capabilities: ['web4-development', 'p2p-networking']
        }
    },
    metadata: {
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        description: 'Example user for ONCE demonstrations'
    }
};

/**
 * Article scenario - represents an article being edited
 */
export const articleScenario: Scenario = {
    uuid: '259427fa-e53c-4651-8d86-4598c2a6a233',
    objectType: 'Article',
    version: '0.1.0.0',
    state: {
        IOR: 'article:259427fa-e53c-4651-8d86-4598c2a6a233',
        owner: 'af0b6e99-85c9-4ce5-9945-031767f375c9', // References user UUID
        model: {
            title: 'Introduction to Web4 Architecture',
            content: '# Web4 Architecture\n\nWeb4 represents a paradigm shift...',
            status: 'draft',
            collaborators: [],
            lastModified: new Date().toISOString()
        }
    },
    references: [{
        name: 'owner',
        ior: 'user:af0b6e99-85c9-4ce5-9945-031767f375c9',
        type: 'User'
    }],
    metadata: {
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        description: 'Collaborative article about Web4'
    }
};

/**
 * Component scenario - represents a Web4 component
 */
export const componentScenario: Scenario = {
    uuid: '6a76e890-eec2-466f-9ba9-c4b12c245221',
    objectType: 'Component',
    version: '0.1.0.0',
    state: {
        IOR: 'component:6a76e890-eec2-466f-9ba9-c4b12c245221',
        owner: 'system',
        model: {
            name: 'ExampleComponent',
            version: '0.1.0.0',
            status: 'running',
            capabilities: ['scenario-exchange', 'p2p-communication'],
            config: {
                autoStart: true,
                debugMode: false
            }
        }
    },
    metadata: {
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        description: 'Example component for testing'
    }
};

/**
 * Task scenario - represents a collaborative task
 */
export const taskScenario: Scenario = {
    uuid: '56935ff9-8ea8-43b4-b595-78305e918ad1',
    objectType: 'Task',
    version: '0.1.0.0',
    state: {
        IOR: 'task:56935ff9-8ea8-43b4-b595-78305e918ad1',
        owner: 'af0b6e99-85c9-4ce5-9945-031767f375c9',
        model: {
            title: 'Review Web4 Architecture Document',
            description: 'Review and provide feedback on the architecture document',
            assignee: 'ba1ad83c-71e9-4c87-bf04-2962b10f2f22',
            status: 'in-progress',
            priority: 'high',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        }
    },
    references: [
        {
            name: 'owner',
            ior: 'user:af0b6e99-85c9-4ce5-9945-031767f375c9',
            type: 'User'
        },
        {
            name: 'assignee',
            ior: 'user:ba1ad83c-71e9-4c87-bf04-2962b10f2f22',
            type: 'User'
        },
        {
            name: 'relatedArticle',
            ior: 'article:259427fa-e53c-4651-8d86-4598c2a6a233',
            type: 'Article'
        }
    ],
    metadata: {
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        description: 'Task for collaborative work'
    }
};

/**
 * Message scenario - for P2P communication testing
 */
export const messageScenario: Scenario = {
    uuid: 'ba1ad83c-71e9-4c87-bf04-2962b10f2f22',
    objectType: 'Message',
    version: '0.1.0.0',
    state: {
        IOR: 'message:ba1ad83c-71e9-4c87-bf04-2962b10f2f22',
        owner: 'af0b6e99-85c9-4ce5-9945-031767f375c9',
        model: {
            type: 'scenario-handover',
            from: 'node-server',
            to: 'browser-client',
            content: 'Here is the requested article scenario',
            attachedScenario: articleScenario.uuid,
            timestamp: new Date().toISOString()
        }
    },
    references: [{
        name: 'attachedScenario',
        ior: 'article:259427fa-e53c-4651-8d86-4598c2a6a233',
        type: 'Article'
    }],
    metadata: {
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        description: 'P2P message with scenario attachment'
    }
};

/**
 * Generate a simple counter scenario for testing
 */
export function createCounterScenario(value: number = 0): Scenario {
    return {
        uuid: generateUUID(),
        objectType: 'Counter',
        version: '0.1.0.0',
        state: {
            IOR: `counter:${generateUUID()}`,
            owner: 'demo',
            model: {
                value: value,
                lastUpdated: new Date().toISOString()
            }
        },
        metadata: {
            created: new Date().toISOString(),
            modified: new Date().toISOString(),
            description: `Counter with value ${value}`
        }
    };
}

/**
 * Generate UUID v4
 */
function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}