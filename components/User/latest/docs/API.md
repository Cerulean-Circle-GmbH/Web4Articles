# Web4 User Component API Reference

## Interfaces

### IUser
```typescript
interface IUser {
  getUuid(): string;
  getUsername(): string;
  getHostname(): string;
  setUsername(username: string): void;
  setHostname(hostname: string): void;
}
```

## Classes

### DefaultUser
Implements the IUser interface with deterministic UUID generation.

#### Methods
- `constructor()`: Creates empty user instance
- `getUuid(): string`: Returns deterministic UUID based on username
- `getUsername(): string`: Returns current username
- `getHostname(): string`: Returns current hostname
- `setUsername(username: string): void`: Sets username
- `setHostname(hostname: string): void`: Sets hostname

## CLI API

### Commands
- `create <username> [hostname]`: Create new user scenario
- `get <username>`: Get user UUID and details
- `fix-scenario <file>`: Fix owner UUID in scenario file
- `fix-scenarios --all`: Fix all scenario files
- `list`: List all user scenarios

### Options
- `--help`: Show help information
- `--verify`: Verify component installation
