# PDCA: EAM Business Process Transaction Chains - Layer 4 Git-Based Rollback Architecture

**📎 Previous Commit:** e24e515 (Complete Web4 Architecture: Layer 4 atomic transactions, Layer 5 orchestration, Layer 3 service contracts - Trans-Actions across components)  
**🔗 Previous PDCA:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/cursor/tsranger-v22-testing-2025-08-20-1012/scrum.pmo/project.journal/2025-08-20-1552/pdca/2025-08-20-1552-scenario-hibernation-format-semantic-invariant.md) | [./2025-08-20-1552-scenario-hibernation-format-semantic-invariant.md](./2025-08-20-1552-scenario-hibernation-format-semantic-invariant.md)

**🗓️ Date:** 2025-08-20-UTC-1552  
**🎯 Objective:** Correct understanding - EAM Layer 4 business processes as transaction chains with Git-based rollback  
**👤 Role:** Developer → EAM Architecture Correction & Rollback Disaster Learning  
**🚨 Issues:** CRITICAL ERROR - Confused EAM layers with traceability graph, failed rollback attempt, natural AI disaster  

---

## **📊 Summary**

**🎯 EAM LAYER 4 BUSINESS PROCESSES CORRECTION**: Business processes live in **EAM Layer 4**, NOT Layer 5. Business processes are transaction chains - reversible transaction by transaction OR big overall rollback using Git. **Prosa→Units** are TRACEABILITY layers (hop-length graph), NOT architectural "layers". This PDCA documents the rollback disaster caused by going too fast without proper transaction capability - a perfect natural example of Web4 principles.

### **🔗 Artifact Links**
- **Corrupted Previous Attempt:** [DELETED - Contains wrong Layer 5 assumptions] 
- **Babylon Solution Foundation:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/cursor/tsranger-v22-testing-2025-08-20-1012/scrum.pmo/project.journal/2025-08-20-1552/pdca/2025-08-20-1552-overcoming-babylon-semantic-invariants.md) | [./2025-08-20-1552-overcoming-babylon-semantic-invariants.md](./2025-08-20-1552-overcoming-babylon-semantic-invariants.md)
- **Universal Hibernation:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/cursor/tsranger-v22-testing-2025-08-20-1012/scrum.pmo/project.journal/2025-08-20-1552/pdca/2025-08-20-1552-scenario-hibernation-format-semantic-invariant.md) | [./2025-08-20-1552-scenario-hibernation-format-semantic-invariant.md](./2025-08-20-1552-scenario-hibernation-format-semantic-invariant.md)

### **⚖️ QA Decisions**
- [x] **DISASTER RECOGNITION**: Failed rollback attempt created corrupted architecture documentation
- [x] **LAYER CONFUSION CORRECTED**: EAM Layers ≠ Traceability graph (Prosa→Units)
- [x] **EAM Layer 4**: Business processes as transaction chains with Git-based rollback
- [x] **Rollback Lesson Learned**: Going too fast without proper rollback = natural disaster
- [ ] **Implement Git-Based Rollback**: Build transaction chain rollback using Git commits
- [ ] **EAM Layer Implementation**: Correct EAM 1-5 layer architecture
- [ ] **Transaction Chain Architecture**: Business processes as reversible transaction sequences

---

## **📝 Plan**

### **🎯 CORRECT EAM ARCHITECTURE UNDERSTANDING**

**EAM (Enterprise Architecture Management) Layers 1-5:**
```typescript
interface EAMArchitecture {
  // EAM Layer 1: Infrastructure
  infrastructure: {
    eamLayer: 1,
    purpose: "Hardware, networks, databases, servers, cloud platforms",
    examples: ["AWS infrastructure", "Database servers", "Network topology", "Storage systems"],
    web4Mapping: "Physical and virtual resources for Web4 deployment"
  };
  
  // EAM Layer 2: Implementations
  implementations: {
    eamLayer: 2, 
    purpose: "Code, algorithms, data structures, runtime environments",
    examples: ["Source code", "Libraries", "Frameworks", "Runtime engines"],
    web4Mapping: "Web4 object implementations, scenario serialization, ONCE kernel"
  };
  
  // EAM Layer 3: Services, Interface Contracts, Business Capabilities, Domain Model
  services: {
    eamLayer: 3,
    purpose: "Service contracts, business capabilities, domain models, APIs", 
    examples: ["Service interfaces", "API contracts", "Domain objects", "Business capabilities"],
    web4Mapping: "Semantic service contracts, QoS/SLA specifications, IOR interfaces"
  };
  
  // EAM Layer 4: Business Processes (CORRECT LAYER!)
  businessProcesses: {
    eamLayer: 4,
    purpose: "Transaction chains with Git-based rollback capability",
    examples: ["Business workflows", "Process orchestrations", "Transaction sequences"],
    web4Mapping: "Business process transaction chains, Git commit rollback, Trans-Actions"
  };
  
  // EAM Layer 5: UX/UI, Workflows, User Actions, Agent Actions, Views
  userInterface: {
    eamLayer: 5,
    purpose: "User interactions, workflows, agent actions, visual presentations",
    examples: ["User interfaces", "Workflow UIs", "Agent dashboards", "User actions"],
    web4Mapping: "TSRanger UI, component navigation interfaces, user scenario interactions"
  };
}
```

### **🔗 TRACEABILITY GRAPH (NOT ARCHITECTURAL LAYERS)**

**Prosa → Units Traceability Chain:**
```typescript
interface TraceabilityGraph {
  // NOT architectural "layers" - this is a traceability hop-length graph
  
  traceabilityChain: {
    prosa: {
      hopDistance: 0,
      purpose: "Human-readable business understanding",
      traceabilityTo: ["requirements"],
      hopLength: 1
    };
    
    requirements: {
      hopDistance: 1, 
      purpose: "Structured specifications with UUIDs",
      traceabilityTo: ["testCases"],
      hopLength: 1
    };
    
    testCases: {
      hopDistance: 2,
      purpose: "Validation scenarios for requirements", 
      traceabilityTo: ["features"],
      hopLength: 1
    };
    
    features: {
      hopDistance: 3,
      purpose: "Implemented functionality sets",
      traceabilityTo: ["components"], 
      hopLength: 1
    };
    
    components: {
      hopDistance: 4,
      purpose: "Black-box service implementations",
      traceabilityTo: ["versions"],
      hopLength: 1
    };
    
    versions: {
      hopDistance: 5,
      purpose: "Git commits representing stable states",
      traceabilityTo: ["units"],
      hopLength: 1
    };
    
    units: {
      hopDistance: 6,
      purpose: "Single files with radical separation",
      traceabilityTo: [],
      hopLength: 0
    };
  };
  
  // Total traceability hop length: 6
  maxHopDistance: 6;
  traceabilityPurpose: "Full bidirectional traceability from business intent to implementation";
}
```

### **📋 QA Feedback Integration (Verbatim - 2025-08-20T15:52:00Z):**

> "you see how many changes you had to make to rollback your assumption. and you did not evensucceed in it. /Users/Shared/Workspaces/2cuGitHub/Web4Articles/scrum.pmo/project.journal/2025-08-20-1552/pdca/2025-08-20-1552-transaction-orchestration-semantic-layers.md is still full of the wrong layer 5. als wa are currently talking about EAM layer 1 to 5. 1 infrastructure 2 implementations 3 services , interface contracts, business capabilities, domain model 4 bsuiness processes 5. ux/ui, workflows user actions, agent actions, views from prosa to units is TRACABILITY layers that I NEVER called Layers. they are a tracability graph wiht defined hop length. maybe its easier to write /Users/Shared/Workspaces/2cuGitHub/Web4Articles/scrum.pmo/project.journal/2025-08-20-1552/pdca/2025-08-20-1552-transaction-orchestration-semantic-layers.md again then to try to rollback the WRONG business process EAM layer 5. now you see how dramatic it is to go to fast and having no rollback transaction capability. a perfect example of natural disaster happening to AI."

### **🏗️ EAM Layer 4 Business Process Transaction Chains**

#### **Business Processes as Transaction Chains**
```typescript
// EAM Layer 4: Business processes are transaction chains with Git-based rollback
abstract class BusinessProcessTransactionChain implements Web4Object {
  protected transactionSequence: TransactionChainDefinition;
  protected gitRollbackManager: GitBasedRollbackManager;
  protected eamLayer: number = 4; // EAM Layer 4 - Business Processes
  
  constructor() {} // Empty constructor
  
  init(businessProcessScenario: BusinessProcessTransactionChainScenario): BusinessProcessTransactionChain {
    this.transactionSequence = businessProcessScenario.getTransactionSequence();
    this.gitRollbackManager = businessProcessScenario.getGitRollbackManager();
    return this;
  }
  
  // Core semantics: Execute transaction chain with Git rollback capability
  abstract async executeTransactionChain(): Promise<BusinessProcessResult>;
  
  // Rollback options: Transaction by transaction OR big overall rollback
  async rollbackTransactionByTransaction(fromTransactionIndex: number): Promise<PartialRollbackResult> {
    const rollbackSequence = this.transactionSequence.getTransactionsFrom(fromTransactionIndex);
    
    const rollbackResults = [];
    for (let i = rollbackSequence.length - 1; i >= 0; i--) {
      const transaction = rollbackSequence[i];
      const rollbackResult = await transaction.rollback();
      rollbackResults.push(rollbackResult);
      
      // Git commit for each transaction rollback
      await this.gitRollbackManager.commitRollback(transaction.getId(), rollbackResult);
    }
    
    return new PartialRollbackResult({
      rolledBackTransactions: rollbackResults,
      rollbackStrategy: "TRANSACTION_BY_TRANSACTION",
      gitCommits: rollbackResults.map(result => result.gitCommit)
    });
  }
  
  async rollbackEntireBusinessProcess(): Promise<OverallRollbackResult> {
    // Big overall rollback using Git
    const originalCommit = await this.gitRollbackManager.getOriginalCommit();
    
    // Rollback all transactions in reverse order
    const allTransactions = this.transactionSequence.getAllTransactions();
    for (let i = allTransactions.length - 1; i >= 0; i--) {
      await allTransactions[i].rollback();
    }
    
    // Single Git rollback to original state
    const gitRollbackResult = await this.gitRollbackManager.resetToCommit(originalCommit);
    
    return new OverallRollbackResult({
      originalCommit: originalCommit,
      rollbackStrategy: "BIG_OVERALL_ROLLBACK", 
      gitRollbackResult: gitRollbackResult,
      businessProcessState: "FULLY_REVERTED"
    });
  }
}

// Git-based rollback manager for EAM Layer 4 business processes
class GitBasedRollbackManager implements Web4Object {
  private gitRepository: GitRepository;
  private businessProcessCommits: Map<string, GitCommit>;
  
  constructor() {} // Empty constructor
  
  init(gitRollbackScenario: GitRollbackManagerScenario): GitBasedRollbackManager {
    this.gitRepository = gitRollbackScenario.getGitRepository();
    this.businessProcessCommits = gitRollbackScenario.getBusinessProcessCommits();
    return this;
  }
  
  // Commit each transaction step for granular rollback
  async commitTransactionStep(transaction: Transaction, result: TransactionResult): Promise<GitCommit> {
    const commitMessage = `Business Process Transaction: ${transaction.getId()} - ${result.getStatus()}`;
    
    // Stage changes
    await this.gitRepository.add(".");
    
    // Commit with transaction metadata
    const gitCommit = await this.gitRepository.commit(commitMessage, {
      transactionId: transaction.getId(),
      transactionResult: result.serialize(),
      businessProcessStep: transaction.getBusinessProcessStep(),
      timestamp: new Date().toISOString()
    });
    
    this.businessProcessCommits.set(transaction.getId(), gitCommit);
    return gitCommit;
  }
  
  // Enable transaction-by-transaction rollback
  async rollbackToTransaction(transactionId: string): Promise<GitRollbackResult> {
    const targetCommit = this.businessProcessCommits.get(transactionId);
    if (!targetCommit) {
      throw new TransactionNotFoundError(`Transaction ${transactionId} not found in Git history`);
    }
    
    // Git reset to specific transaction commit
    const rollbackResult = await this.gitRepository.resetHard(targetCommit.hash);
    
    return new GitRollbackResult({
      targetCommit: targetCommit,
      rollbackType: "TRANSACTION_SPECIFIC",
      rollbackResult: rollbackResult
    });
  }
  
  // Enable big overall rollback to original state
  async resetToCommit(originalCommit: GitCommit): Promise<GitRollbackResult> {
    const rollbackResult = await this.gitRepository.resetHard(originalCommit.hash);
    
    return new GitRollbackResult({
      targetCommit: originalCommit,
      rollbackType: "FULL_BUSINESS_PROCESS_ROLLBACK",
      rollbackResult: rollbackResult
    });
  }
}
```

### **🔄 Natural Disaster Learning: AI Rollback Failure**

#### **The Perfect Example of What Can Go Wrong**
```typescript
// This PDCA documents a natural disaster: AI going too fast without rollback capability
interface AIRollbackDisasterExample {
  initialError: {
    mistake: "Assumed business processes were EAM Layer 5 instead of Layer 4";
    cause: "Got overexcited and made wrong assumption";
    impact: "Created entire architecture document with wrong layer assignments";
  };
  
  rollbackAttempt: {
    strategy: "Multiple search-replace operations to fix Layer 5 references";
    toolsUsed: ["search_replace", "MultiEdit"];
    numberOfChanges: 15; // Multiple search-replace operations
    success: false;
    problem: "File still contained wrong Layer 5 references after 'rollback' attempt";
  };
  
  naturalDisaster: {
    description: "Perfect real-world example of what happens without proper rollback";
    consequences: [
      "Corrupted architecture documentation",
      "Mixed up EAM layers with traceability graph", 
      "Failed rollback made situation worse",
      "Had to delete entire file and start over"
    ];
    lesson: "Going too fast without proper transaction rollback capability = disaster";
  };
  
  correctSolution: {
    approach: "Delete corrupted file, rewrite completely with correct understanding";
    newUnderstanding: {
      eamLayers: "Infrastructure(1) → Implementations(2) → Services(3) → BusinessProcesses(4) → UI(5)",
      traceabilityGraph: "Prosa → Requirements → Tests → Features → Components → Versions → Units (hop-length graph)",
      businessProcesses: "EAM Layer 4 transaction chains with Git-based rollback"
    };
  };
}

// The lesson: This is why Web4 requires proper transaction and rollback capabilities
class AILearningExample {
  getDisasterLesson(): string {
    return `
    PERFECT NATURAL DISASTER EXAMPLE:
    1. AI gets overexcited → Makes wrong assumption (Layer 5 business processes)
    2. AI tries to "rollback" → Multiple search-replace operations fail
    3. Document becomes more corrupted → Rollback attempt makes it worse
    4. Only solution → Delete and rewrite completely
    
    THIS IS WHY WEB4 REQUIRES:
    - Proper transaction boundaries
    - Atomic rollback capabilities  
    - Git-based rollback for business processes
    - Going slow enough to ensure correctness
    
    The AI disaster perfectly demonstrates the Web4 principles it was trying to document!
    `;
  }
}
```

---

## **🔧 Do**

### **📋 Corrected EAM Architecture Implementation**

#### **EAM Layer 4: Business Process Transaction Chains**

**Customer Onboarding Business Process Example:**
```typescript
// EAM Layer 4: Business process as transaction chain with Git rollback
class CustomerOnboardingBusinessProcess extends BusinessProcessTransactionChain {
  
  async executeTransactionChain(): Promise<BusinessProcessResult> {
    // Transaction chain definition
    const transactionChain = [
      // Transaction 1: User account creation
      new UserAccountCreationTransaction({
        transactionId: "onboarding-tx-1",
        businessProcessStep: "CREATE_USER_ACCOUNT",
        compensationHandler: "deleteUserAccount"
      }),
      
      // Transaction 2: Email verification
      new EmailVerificationTransaction({
        transactionId: "onboarding-tx-2", 
        businessProcessStep: "VERIFY_EMAIL",
        compensationHandler: "cancelEmailVerification"
      }),
      
      // Transaction 3: Payment setup
      new PaymentSetupTransaction({
        transactionId: "onboarding-tx-3",
        businessProcessStep: "SETUP_PAYMENT", 
        compensationHandler: "removePaymentMethod"
      }),
      
      // Transaction 4: Account activation
      new AccountActivationTransaction({
        transactionId: "onboarding-tx-4",
        businessProcessStep: "ACTIVATE_ACCOUNT",
        compensationHandler: "deactivateAccount"
      })
    ];
    
    const executionResults = [];
    
    try {
      // Execute transaction chain with Git commits
      for (let i = 0; i < transactionChain.length; i++) {
        const transaction = transactionChain[i];
        
        // Execute transaction
        const transactionResult = await transaction.execute();
        executionResults.push(transactionResult);
        
        // Git commit after each successful transaction
        await this.gitRollbackManager.commitTransactionStep(transaction, transactionResult);
        
        if (!transactionResult.isSuccess()) {
          // Rollback previous transactions if current one fails
          await this.rollbackTransactionByTransaction(i);
          throw new BusinessProcessTransactionFailure(transaction, transactionResult);
        }
      }
      
      return new BusinessProcessResult({
        businessProcessId: "customer-onboarding",
        status: "SUCCESS",
        transactionResults: executionResults,
        gitCommits: executionResults.map(result => result.gitCommit)
      });
      
    } catch (error) {
      // Big overall rollback on any failure
      const rollbackResult = await this.rollbackEntireBusinessProcess();
      
      return new BusinessProcessResult({
        businessProcessId: "customer-onboarding", 
        status: "FAILED_AND_ROLLED_BACK",
        error: error,
        rollbackResult: rollbackResult
      });
    }
  }
}
```

#### **Trans-Actions Across EAM Layers**

**Multi-EAM-Layer Transaction Example:**
```typescript
// Trans-Actions can span multiple EAM layers
class CrossLayerTransAction extends Web4Transaction {
  
  async execute(): Promise<TransactionResult> {
    // Transaction involving multiple EAM layers
    const eamLayerOperations = [
      // EAM Layer 1: Infrastructure provisioning
      {
        eamLayer: 1,
        operation: "provisionInfrastructure",
        target: "AWS EC2 instances for new customer environment",
        rollback: "terminateProvisionedInfrastructure"
      },
      
      // EAM Layer 2: Deploy implementation
      {
        eamLayer: 2,
        operation: "deployImplementation", 
        target: "Customer-specific Web4 components",
        rollback: "undeployImplementation"
      },
      
      // EAM Layer 3: Configure services
      {
        eamLayer: 3,
        operation: "configureServiceContracts",
        target: "QoS/SLA agreements for customer",
        rollback: "removeServiceConfiguration"
      },
      
      // EAM Layer 4: Initiate business processes
      {
        eamLayer: 4,
        operation: "startBusinessProcesses",
        target: "Customer onboarding transaction chains", 
        rollback: "rollbackBusinessProcesses"
      },
      
      // EAM Layer 5: Activate UI
      {
        eamLayer: 5,
        operation: "activateUserInterface",
        target: "Customer portal and workflows",
        rollback: "deactivateUserInterface"  
      }
    ];
    
    // Execute Trans-Action across all EAM layers
    return await this.executeMultiEAMLayerOperation(eamLayerOperations);
  }
  
  private async executeMultiEAMLayerOperation(
    operations: EAMLayerOperation[]
  ): Promise<TransActionResult> {
    const results = [];
    
    try {
      // Execute operations across EAM layers in sequence
      for (const operation of operations) {
        const result = await this.executeEAMLayerOperation(operation);
        results.push(result);
        
        if (!result.isSuccess()) {
          // Rollback all previous EAM layer operations
          await this.rollbackEAMLayerOperations(results);
          throw new CrossLayerTransActionFailure(operation, result);
        }
      }
      
      return new TransActionResult({
        status: "SUCCESS_ACROSS_ALL_EAM_LAYERS",
        eamLayerResults: results,
        transactionId: this.transactionId
      });
      
    } catch (error) {
      // Cross-EAM-layer rollback
      await this.rollbackEAMLayerOperations(results);
      throw error;
    }
  }
}
```

---

## **✅ Check**

### **📋 Corrected Architecture Validation**

**EAM Layer Understanding:**
- ✅ **EAM Layer 1**: Infrastructure (hardware, networks, databases)
- ✅ **EAM Layer 2**: Implementations (code, algorithms, runtime)  
- ✅ **EAM Layer 3**: Services (contracts, capabilities, domain models)
- ✅ **EAM Layer 4**: Business Processes (transaction chains with Git rollback) - CORRECT
- ✅ **EAM Layer 5**: UX/UI (workflows, user actions, agent actions, views)

**Traceability Graph Understanding:**
- ✅ **Prosa → Units**: Traceability hop-length graph, NOT architectural layers
- ✅ **Hop Length**: 6 total hops from business intent to implementation
- ✅ **Purpose**: Bidirectional traceability for requirements management

**Disaster Learning:**
- ✅ **AI Rollback Failure**: Perfect example of going too fast without rollback capability
- ✅ **Natural Disaster**: Multiple search-replace operations failed to fix Layer 5 error
- ✅ **Solution**: Delete corrupted file, rewrite with correct understanding
- ✅ **Lesson**: Proper transaction boundaries and rollback essential for AI systems

### **🎯 Business Process Transaction Chain Benefits**

**Git-Based Rollback Capabilities:**
1. **Transaction-by-Transaction Rollback**: Granular rollback to specific business process steps
2. **Overall Rollback**: Complete business process reversion using Git reset
3. **Git Audit Trail**: Every transaction step committed for full traceability
4. **Compensation Handlers**: Automated rollback logic for each transaction
5. **Cross-EAM-Layer Coordination**: Trans-Actions spanning multiple EAM layers

---

## **⚡ Act**

### **🚀 Corrected EAM Architecture Integration**

#### **Key Requirements for EAM Layer 4 Implementation**

**[requirement:uuid:a4b5c6d7-e8f9-0123-abcd-e89012345678] - EAM Layer 4 Business Process Transaction Chains**
**As a** Web4 architect implementing EAM Layer 4 business processes  
**I want** transaction chains with Git-based rollback capabilities  
**So that** business processes can rollback transaction-by-transaction or with overall rollback

**Implementation Framework:**
```typescript
// EAM Layer 4: Business Process Transaction Chains
abstract class BusinessProcessTransactionChain implements Web4Object {
  constructor() {} // Empty constructor
  init(scenario: BusinessProcessTransactionChainScenario): this;
  
  abstract async executeTransactionChain(): Promise<BusinessProcessResult>;
  async rollbackTransactionByTransaction(fromIndex: number): Promise<PartialRollbackResult>;
  async rollbackEntireBusinessProcess(): Promise<OverallRollbackResult>;
}

// Git-based rollback management
class GitBasedRollbackManager implements Web4Object {
  async commitTransactionStep(transaction: Transaction, result: TransactionResult): Promise<GitCommit>;
  async rollbackToTransaction(transactionId: string): Promise<GitRollbackResult>;
  async resetToCommit(originalCommit: GitCommit): Promise<GitRollbackResult>;
}
```

### **📋 AI Disaster Learning Documentation**

**Natural Disaster Example:**
```typescript
// Perfect example of why proper rollback is essential
const aiDisasterLessons = {
  disaster: "AI made Layer 5 assumption error",
  rollbackAttempt: "Multiple search-replace operations failed", 
  result: "Corrupted documentation, failed rollback made it worse",
  solution: "Delete and rewrite completely",
  
  webFourPrinciples: {
    transactionBoundaries: "Define clear atomic operations",
    rollbackCapability: "Ensure proper rollback mechanisms", 
    gitBasedRollback: "Use Git for business process rollback",
    goSlowEnough: "Ensure correctness before proceeding"
  }
};
```

---

## **💫 Developer Reflection**

### **🧠 Disaster Learning Recognition**

This PDCA perfectly demonstrates the Web4 principles through natural disaster. The AI rollback failure shows exactly why proper transaction boundaries and rollback capabilities are essential.

### **🔄 Corrected Architecture Understanding**

**EAM Layers**: Infrastructure → Implementations → Services → BusinessProcesses → UI  
**Traceability Graph**: Prosa → Requirements → Tests → Features → Components → Versions → Units

### **🎯 Git-Based Business Process Vision**

EAM Layer 4 business processes as transaction chains with Git rollback enable granular control and recovery from business process failures.

---

**🎯 CONCLUSION**: EAM Layer 4 business processes are transaction chains with Git-based rollback. Prosa→Units are traceability graph (hop-length), not architectural layers. AI rollback disaster perfectly demonstrates Web4 rollback principles.

---

**📋 NEXT**: Implement EAM Layer 4 business process transaction chains with Git rollback. Build transaction-by-transaction and overall rollback capabilities. Document proper transaction boundaries to prevent AI disasters.
