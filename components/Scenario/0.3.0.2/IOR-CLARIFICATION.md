# IOR Interface Clarification

## Problem
The term "IOR" (Interoperable Object Reference) is used for different purposes across components:

1. **Scenario IOR (ObjectIdentifier)** - Simple data structure in scenarios
   - Contains: uuid, component, version
   - Purpose: Identify objects in persisted scenarios
   - Location: Scenario component

2. **Runtime IOR** - Complex runtime reference interface
   - Contains: resolve(), getEndpoint(), isLocal(), serialize()
   - Purpose: Runtime object resolution and communication
   - Location: Various components (Unit, Web4Test)

## Solution
- Renamed Scenario's IOR to `ObjectIdentifier` for clarity
- Kept `IOR` as type alias for backward compatibility
- Each component can have its own runtime IOR interface as needed
- Import `ObjectIdentifier` from Scenario when you need the simple identifier

## Usage
```typescript
// For scenario object identification
import { ObjectIdentifier } from '@web4/scenario';

// For backward compatibility
import { IOR } from '@web4/scenario'; // Same as ObjectIdentifier
```

## Recommendation
Use descriptive names:
- `ObjectIdentifier` for simple identification
- `RuntimeIOR` or `RemoteObjectReference` for complex runtime references
- Avoid generic "IOR" for new interfaces