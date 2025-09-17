# Web4 User Component API Reference

## Interfaces

<<<<<<< HEAD
### User
```typescript
interface User {
=======
### IUser
```typescript
interface IUser {
>>>>>>> origin/dev/2025-09-14-UTC-1425
  getUuid(): string;
  getUsername(): string;
  getHostname(): string;
  setUsername(username: string): void;
  setHostname(hostname: string): void;
}
```

<<<<<<< HEAD
### EnvironmentCheck
```typescript
interface EnvironmentCheck {
=======
### IEnvironmentCheck
```typescript
interface IEnvironmentCheck {
>>>>>>> origin/dev/2025-09-14-UTC-1425
    check(): Promise<boolean>;
    getErrors(): string[];
}
```

<<<<<<< HEAD
### DependencyCheck
```typescript
interface DependencyCheck {
=======
### IDependencyCheck
```typescript
interface IDependencyCheck {
>>>>>>> origin/dev/2025-09-14-UTC-1425
    check(): Promise<boolean>;
    getErrors(): string[];
}
```

<<<<<<< HEAD
### DocumentationGenerator
```typescript
interface DocumentationGenerator {
=======
### IDocumentationGenerator
```typescript
interface IDocumentationGenerator {
>>>>>>> origin/dev/2025-09-14-UTC-1425
    generate(): Promise<void>;
    getGeneratedFiles(): string[];
}
```

## Classes

### DefaultUser
<<<<<<< HEAD
Implements the User interface with deterministic UUID generation.
=======
Implements the IUser interface with deterministic UUID generation.
>>>>>>> origin/dev/2025-09-14-UTC-1425

#### Methods
- `constructor()`: Creates empty user instance
- `getUuid(): string`: Returns deterministic UUID based on username
- `getUsername(): string`: Returns current username
- `getHostname(): string`: Returns current hostname
- `setUsername(username: string): void`: Sets username
- `setHostname(hostname: string): void`: Sets hostname

### EnvironmentChecker
Validates component environment before installation.

#### Methods
- `constructor()`: Creates empty checker instance
- `check(): Promise<boolean>`: Performs all environment checks
- `getErrors(): string[]`: Returns list of validation errors

### DependencyChecker
Validates component dependencies before build.

#### Methods
- `constructor()`: Creates empty checker instance
- `check(): Promise<boolean>`: Performs all dependency checks
- `getErrors(): string[]`: Returns list of missing dependencies

### ComponentDocumentationGenerator
Generates component documentation in Web4 format.

#### Methods
- `constructor()`: Creates empty generator instance
- `generate(): Promise<void>`: Generates all documentation files
- `getGeneratedFiles(): string[]`: Returns list of generated file paths

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
