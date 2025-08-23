[Back to Session](../)

# 📋 **PDCA Cycle: User Component with Deterministic UUID - 2025-08-23-UTC-0845**

**🗓️ Date:** 2025-08-23-UTC-0845  
**🎯 Objective:** Create User component for consistent user identification across Web4 ecosystem  
**👤 Role:** Developer (Component Implementation)  
**🚨 Issues:** Random owner UUIDs preventing consistent user tracking

## **✅ Summary**

**📊 Implementation Results**
- [x] Created User component with deterministic UUID generation
- [x] Fixed UUID generation to be consistent per username
- [x] Updated Web4Requirement to use User component
- [x] Created user scenario for "donges" with fixed UUID
- [x] Documented deterministic UUID: `7e65139d-38cf-4f34-b769-0a86dd3a94e3`

**🔗 Artifact Links**
- [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/release/dev/components/User/latest/src/ts/layer2/DefaultUser.ts) | [components/User/latest/src/ts/layer2/DefaultUser.ts](components/User/latest/src/ts/layer2/DefaultUser.ts)
- [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/release/dev/components/User/latest/scenarios/donges.scenario.json) | [components/User/latest/scenarios/donges.scenario.json](components/User/latest/scenarios/donges.scenario.json)
- [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/release/dev/scrum.pmo/project.journal/2025-08-23-0845-sprint22-user-component/pdca/2025-08-23-UTC-0845-user-component-deterministic-uuid.md) | [scrum.pmo/project.journal/2025-08-23-0845-sprint22-user-component/pdca/2025-08-23-UTC-0845-user-component-deterministic-uuid.md](scrum.pmo/project.journal/2025-08-23-0845-sprint22-user-component/pdca/2025-08-23-UTC-0845-user-component-deterministic-uuid.md)

---

## **📋 Plan**

### **Objective**
Fix the issue where owner UUIDs are randomly generated, causing inconsistent user identification across Web4 components

### **Approach**
1. Create User component following Web4 principles
2. Implement deterministic UUID generation based on username
3. Update Web4Requirement to use User component
4. Create static scenario for user "donges"

---

## **🔨 Do**

### **Created User Component Structure**
```
components/User/latest/
├── src/ts/
│   ├── layer3/IUser.ts          # Interface definition
│   └── layer2/DefaultUser.ts    # Implementation with deterministic UUID
├── scenarios/
│   └── donges.scenario.json     # Static scenario for user donges
├── package.json
└── test-user-uuid.ts
```

### **Deterministic UUID Algorithm**
```typescript
getUserUUID(username: string): string {
  const hash = createHash('sha256').update(`user:${username}`).digest('hex');
  // Format as UUID v4 (deterministic, not random)
  // Result for "donges": 7e65139d-38cf-4f34-b769-0a86dd3a94e3
}
```

### **Key Implementation Details**
- SHA-256 hash of `user:${username}` for consistency
- Formatted as valid UUID v4 (but deterministic)
- Static method `DefaultUser.getOwnerObject()` for easy integration
- User "donges" always gets UUID: `7e65139d-38cf-4f34-b769-0a86dd3a94e3`

---

## **🔍 Check**

### **QA Feedback**
> **User Quote**: "fix the uuid in it as always the same uuid for this user donges. fix that in the code. create a user component with a same way to generate a scenario, so that the user donges scenario becomes a static fixed uuid."  
> **Timestamp**: 2025-08-23-UTC-0845

### **Verification**
- ✅ Deterministic UUID generation confirmed
- ✅ Same username always produces same UUID
- ✅ Web4Requirement updated to use User component
- ✅ User scenarios follow Web4 pattern (IOR, owner, model)
- ✅ "donges" UUID is now consistently: `7e65139d-38cf-4f34-b769-0a86dd3a94e3`

---

## **⚡ Act**

### **Next Steps**
1. Update all Web4 components to use User component for owner generation
2. Create scenarios for other common users (system, ubuntu, etc.)
3. Add User component to component registry
4. Update documentation to reference deterministic user UUIDs

### **Impact**
- Consistent user tracking across all Web4 components
- Enables user-based queries and analytics
- Supports Web4 principle: "everything has a UUID"
- Users are now first-class Web4 objects

---

## **🎯 PDCA Process Update**

**Key Learning**: User identification needs to be deterministic for proper traceability and object relationships in Web4.

**Process Enhancement**: All Web4 components should use the User component for owner information to ensure consistency.

**Quality Impact**: Deterministic UUIDs enable reliable user tracking and scenario management across the entire Web4 ecosystem.

---

## **📝 One-Line Summary**
Created User component with deterministic UUID generation ensuring user "donges" always has UUID 7e65139d-38cf-4f34-b769-0a86dd3a94e3 across all Web4 components.