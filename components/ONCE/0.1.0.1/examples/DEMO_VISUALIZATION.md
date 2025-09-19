# ONCE Demo Visualization

Since we can't run the live demo in this environment, here's a visual representation of how ONCE works:

## What ONCE Does

ONCE (Object Network Communication Engine) enables multiple JavaScript environments to discover each other and exchange data objects called "scenarios". Think of it as a universal translator and postal service for Web4 components.

## Demo Flow Visualization

```
Time: 0s - Initialization
┌─────────────────────────┐     ┌─────────────────────────┐     ┌─────────────────────────┐
│   Node.js Server        │     │   Browser Client 1      │     │   Web Worker           │
│   ONCE Kernel #1        │     │   ONCE Kernel #2        │     │   ONCE Kernel #3       │
│                         │     │                         │     │                         │
│   Port: 8080           │     │   (Not started yet)     │     │   (Not started yet)    │
│   Status: ✅ Ready      │     │                         │     │                         │
│   Peers: 0             │     │                         │     │                         │
│   Scenarios: 2         │     │                         │     │                         │
└─────────────────────────┘     └─────────────────────────┘     └─────────────────────────┘

Time: 5s - Clients Connect
┌─────────────────────────┐     ┌─────────────────────────┐     ┌─────────────────────────┐
│   Node.js Server        │◄────│   Browser Client 1      │     │   Web Worker           │
│   ONCE Kernel #1        │────►│   ONCE Kernel #2        │     │   ONCE Kernel #3       │
│                         │     │                         │     │                         │
│   Port: 8080           │     │   WebSocket Connected   │     │   (Not started yet)    │
│   Status: ✅ Ready      │     │   Status: ✅ Ready      │     │                         │
│   Peers: 1             │     │   Peers: 0             │     │                         │
│   Scenarios: 2         │     │   Scenarios: 0         │     │                         │
└─────────────────────────┘     └─────────────────────────┘     └─────────────────────────┘
         ▲                                                               │
         └───────────────────────────────────────────────────────────────┘
                                    WebSocket

Time: 10s - Discovery Phase
┌─────────────────────────┐     ┌─────────────────────────┐     ┌─────────────────────────┐
│   Node.js Server        │◄────│   Browser Client 1      │◄────│   Web Worker           │
│   ONCE Kernel #1        │────►│   ONCE Kernel #2        │────►│   ONCE Kernel #3       │
│                         │     │                         │     │                         │
│   Port: 8080           │     │   WebSocket Connected   │     │   WebSocket Connected  │
│   Status: ✅ Ready      │     │   Status: ✅ Ready      │     │   Status: ✅ Ready     │
│   Peers: 2 🟢          │     │   Peers: 1 🟢          │     │   Peers: 1 🟢         │
│   Scenarios: 2         │     │   Scenarios: 0         │     │   Scenarios: 0         │
└─────────────────────────┘     └─────────────────────────┘     └─────────────────────────┘

        Browser Client 1: "Hey server, who else is connected?"
        Server: "You and Web Worker are connected!"

Time: 15s - Scenario Exchange
┌─────────────────────────┐     ┌─────────────────────────┐     ┌─────────────────────────┐
│   Node.js Server        │     │   Browser Client 1      │     │   Web Worker           │
│   ONCE Kernel #1        │     │   ONCE Kernel #2        │     │   ONCE Kernel #3       │
│                         │     │                         │     │                         │
│   Scenarios:           │     │   Scenarios:           │     │   Scenarios:           │
│   - User: Alice        │────►│   - User: Alice ✨     │     │   - Task: Review ✨    │
│   - Article: Intro     │     │   - Article: Intro ✨   │     │                         │
│   - Task: Review 📤    │◄────│                         │◄────│   Created & Shared:    │
└─────────────────────────┘     └─────────────────────────┘     │   - Task: Review       │
                                                                └─────────────────────────┘

        Browser: "Can I have the User scenario?"
        Server: "Here's Alice's user data!" 📦
        Worker: "I created a new Task scenario, sharing with everyone!" 📤
```

## Example Scenarios Being Exchanged

### User Scenario (from Server)
```javascript
{
  id: 'user-1',
  type: 'User',
  state: {
    IOR: 'user:af0b6e99-85c9-4ce5-9945-031767f375c9',
    owner: 'system',
    model: {
      name: 'Alice',
      role: 'Developer',
      email: 'alice@web4.example'
    }
  }
}
```

### Article Scenario (from Server)
```javascript
{
  id: 'article-1',
  type: 'Article',
  state: {
    IOR: 'article:259427fa-e53c-4651-8d86-4598c2a6a233',
    owner: 'user-1',
    model: {
      title: 'Introduction to ONCE',
      content: 'ONCE enables universal object communication...',
      status: 'draft'
    }
  }
}
```

### Task Scenario (created by Worker)
```javascript
{
  id: 'task-1',
  type: 'Task',
  state: {
    IOR: 'task:56935ff9-8ea8-43b4-b595-78305e918ad1',
    owner: 'user-1',
    model: {
      title: 'Review ONCE Documentation',
      assignee: 'user-1',
      status: 'in-progress',
      priority: 'high'
    }
  }
}
```

## Key Concepts Demonstrated

1. **Multi-Environment**: Same ONCE code runs in Node.js, Browser, and Web Worker
2. **Auto-Discovery**: Kernels find each other through the server
3. **Scenario Exchange**: Objects (scenarios) can be shared between any kernels
4. **P2P Communication**: After discovery, kernels can talk directly
5. **Web4 Patterns**: Empty constructors, scenario-based initialization

## What Makes This Special?

- **Universal**: Works everywhere JavaScript runs
- **Simple**: Just exchange scenarios (data objects)
- **Discoverable**: Kernels find each other automatically
- **Extensible**: Add any scenario type you need

## Try It Yourself

To see this in action:

1. **Start the Server**:
   ```bash
   cd /workspace/components/ONCE/0.1.0.0/examples/node-server
   npm install
   # Fix the imports in server.ts first
   node server.js
   ```

2. **Open Browser Clients**:
   Open `browser-client/index.html` in multiple browser tabs

3. **Connect & Discover**:
   - Click "Connect to Server" in each browser
   - Click "Discover Peers" to see other clients
   - Request scenarios from the server
   - Create and share your own scenarios

4. **Watch the Magic**:
   See how scenarios created in one environment appear in all others!

This is the vision of ONCE - "ONCE and FOR ALL" - write your code once, run it everywhere, and let all instances discover and communicate with each other seamlessly! 🌟