# IOR - Interoperable Object Reference

## Overview

Interoperable Object Reference (IOR) is a fundamental Web4 architecture component based on CORBA 2.3 principles, providing universal object identification and location across distributed systems.

## CORBA 2.3 Foundation

### Core CORBA IOR Principles
- **Universal Identification:** Unique object identification across distributed systems
- **Tagged Profiles:** Protocol-specific information encapsulated in profiles
- **Interoperability:** Objects accessible across different ORBs/systems
- **Serialization:** Internal model serializable to string format for transmission

### CORBA IOR Structure
```
CORBA IOR Components:
├── Repository ID - Interface identifier
├── Tagged Profile 1 (IIOP)
│   ├── Protocol: IIOP
│   ├── Host: IP address
│   ├── Port: Port number
│   └── Object Key: Server identifier
├── Tagged Profile 2 (GIOP)
│   ├── Protocol: GIOP
│   ├── Transport: TCP/UDP
│   └── Addressing: Custom
└── Additional Profiles (naturally different based on protocol requirements)
```

### CORBA String Serialization
```
Standard Format: IOR:000000000000001049444c3a48656c6c6f576f726c643a312e30...
Custom Format: ior:profile,profile/path#anchor?queryParameter
Protocol Stack: ior:tcp:ip:https:tsl:/host1:port1/failoverhost2:port2/...
```

## Web4 IOR Adaptation

### Web4 IOR Principles
- **Specialized IOR Types:** GitTextIOR, LocalLnIOR, UnitIOR, ComponentIOR
- **String Representation:** IOR values as strings with specialized implementation classes
- **Natural Differences:** Each IOR type has protocol-specific requirements (CORBA pattern)
- **Type Safety:** All IORs implement base IOR interface for interoperability

### Web4 IOR String Formats

#### GitTextIOR Format
```
Format: ior:git:text:https://github.com/repo/file.ts#L1:1-20:1
Purpose: Reference to git repository files with position information
Components:
- Protocol: git:text
- Repository: GitHub URL
- File: Path within repository
- Position: Line and column ranges (optional)
```

#### LocalLnIOR Format
```
Format: ior:local:ln:file://workspace/components/Unit/0.3.0.4/src/ts/layer3/file.ts
Purpose: Reference to local filesystem files via symbolic links
Components:
- Protocol: local:ln
- Transport: symlink
- Path: Absolute filesystem path
```

#### UnitIOR Format
```
Format: ior:unit:a1b2c3d4-e5f6-7890-abcd-ef1234567890
Purpose: Reference to Web4 unit by UUID
Components:
- Protocol: unit
- Addressing: UUID-based
- Resolution: Central scenario index
```

#### ComponentIOR Format
```
Format: ior:component:Unit:0.3.0.4
Purpose: Reference to Web4 component by name and version
Components:
- Protocol: component
- Name: Component name
- Version: Component version
```

#### FileIOR Format
```
Format: ior:file:/workspace/path/to/file.ext
Purpose: Direct file reference without symbolic link
Components:
- Protocol: file
- Path: Direct filesystem path
```

#### WebIOR Format
```
Format: ior:web:https://web4articles.com/interfaces/scenario
Purpose: Web-based resource reference
Components:
- Protocol: web
- URL: Complete web address
```

## Implementation Architecture

### Base IOR Interface
```typescript
export interface IOR {
  getUrl(): string;                 // Complete IOR URL string
  getType(): string;                // Protocol type identifier
  getProfile?(): TaggedProfile;     // CORBA-inspired tagged profile
}

interface TaggedProfile {
  tag: string;                      // Protocol identifier
  protocol: string;                 // Protocol name
  transport: string;                // Transport mechanism
  addressing: string;               // Addressing scheme
}
```

### Specialized IOR Implementation Classes

#### GitTextIOR Implementation
```typescript
export class GitTextIOR implements IOR {
  readonly profile = {
    tag: 'git:text',
    protocol: 'git',
    transport: 'https',
    addressing: 'github'
  };
  
  constructor(
    private gitUrl: string,
    private startPos?: string,
    private endPos?: string
  ) {}
  
  getUrl(): string {
    return `ior:git:text:${this.gitUrl}`;
  }
  
  getType(): string {
    return 'git:text';
  }
  
  // Git-specific methods (naturally different)
  getRepository(): string { /* ... */ }
  getCommitHash(): string { /* ... */ }
  getBranch(): string { /* ... */ }
  getFilename(): string { /* ... */ }
  getMasterFilePath(uuid: string): string { /* ... */ }
}
```

#### LocalLnIOR Implementation
```typescript
export class LocalLnIOR implements IOR {
  readonly profile = {
    tag: 'local:ln',
    protocol: 'local',
    transport: 'symlink',
    addressing: 'filesystem'
  };
  
  constructor(private filePath: string) {}
  
  getUrl(): string {
    return `ior:local:ln:file:${this.filePath}`;
  }
  
  getType(): string {
    return 'local:ln';
  }
  
  // Local-specific methods (naturally different)
  getPath(): string { /* ... */ }
  isSymbolicLink(): boolean { /* ... */ }
  exists(): boolean { /* ... */ }
  getTargetPath(): string { /* ... */ }
}
```

#### UnitIOR Implementation
```typescript
export class UnitIOR implements IOR {
  readonly profile = {
    tag: 'unit',
    protocol: 'unit',
    transport: 'scenario',
    addressing: 'uuid'
  };
  
  constructor(private uuid: string) {}
  
  getUrl(): string {
    return `ior:unit:${this.uuid}`;
  }
  
  getType(): string {
    return 'unit';
  }
  
  // Unit-specific methods (naturally different)
  getUuid(): string { /* ... */ }
  getScenarioPath(): string { /* ... */ }
  loadScenario(): Promise<Scenario> { /* ... */ }
}
```

## Future Protocol Stack Enhancement

### CORBA-Inspired Protocol Stack (Future Implementation)
```
Complex IOR Format (Future):
ior:profile,profile/path#anchor?queryParameter

Protocol Stack Example:
ior:tcp:ip:https:tsl:/host1:port1/failoverhost2:port2/path/to/resource

Multi-Endpoint Support:
- Primary endpoint: host1:port1
- Failover endpoint: host2:port2
- Protocol stack: tcp → ip → https → tsl
- Path resolution: /path/to/resource
```

### MVP vs Future Enhancement
- **MVP (Current):** Simple specialized IOR strings with implementation classes
- **Future:** Full protocol stack with multiple endpoints and failover support
- **Migration Path:** Gradual enhancement from simple to complex IOR formats
- **Backward Compatibility:** Simple IORs continue to work with enhanced system

## Usage in Web4 Architecture

### Unit Model Integration
```typescript
export interface UnitModel extends Model {
  origin: IOR;                      // IOR string with specialized implementation
  references: UnitReference[];      // IOR-based reference tracking
}

interface UnitReference {
  linkLocation: IOR;                // IOR string (LocalLnIOR, FileIOR, etc.)
  linkTarget: IOR;                  // IOR string (UnitIOR, GitTextIOR, etc.)
  syncStatus: SyncStatus;
}
```

### IOR Factory Pattern
```typescript
export class IORFactory {
  static createFromUrl(iorUrl: string): IOR {
    if (iorUrl.startsWith('ior:git:text:')) {
      return GitTextIOR.fromUrl(iorUrl);
    } else if (iorUrl.startsWith('ior:local:ln:')) {
      return LocalLnIOR.fromUrl(iorUrl);
    } else if (iorUrl.startsWith('ior:unit:')) {
      return UnitIOR.fromUrl(iorUrl);
    }
    throw new Error(`Unsupported IOR format: ${iorUrl}`);
  }
}
```

## Best Practices

### IOR Design Guidelines
1. **Protocol Specificity:** Each IOR type serves specific protocol requirements
2. **Natural Differences:** Specialized fields based on protocol needs (CORBA pattern)
3. **String Serialization:** All IORs serializable to string format for transmission
4. **Type Safety:** Implementation classes provide type-safe operations
5. **Interoperability:** Common base interface enables universal handling

### Performance Considerations
- **Lazy Loading:** IOR objects created on demand from string values
- **Caching:** Frequently accessed IORs cached for performance
- **Validation:** IOR format validation at creation time
- **Error Handling:** Graceful handling of malformed IOR strings

---

**Web4 IOR architecture based on CORBA 2.3 principles with specialized types for distributed object reference and future protocol stack enhancement capability.**