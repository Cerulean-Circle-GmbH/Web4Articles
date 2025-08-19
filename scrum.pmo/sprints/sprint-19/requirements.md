# 📝 Sprint 19 Requirements - Matrix v4 Ambiguity Resolution

**Backlinks**: [Mount Everest Journey](mount-everest-session-journey.md) | [Planning](planning.md)

**Scope**: Systematic resolution of 6 critical ambiguities identified in Matrix v4  
**Foundation**: Perfect TSRanger f243713 with methods display working  
**Methodology**: "4 2" collaborative intelligence with TRON PDCA guidance  

---

## **🎯 Core Requirements**

### **REQ-001: Navigation Bounds Excellence** 🚨
**Priority**: CRITICAL  
**Category**: Core Functionality  

**User Requirement**: 
> `[down]5x` navigation must reach GitScrumProject position consistently, enabling positional equivalence with `g` filter

**Technical Specification**:
- **Input**: `[down]` pressed 5 times from Logger starting position
- **Expected Output**: GitScrumProject displayed in prompt (class only, no method)
- **Current State**: Empty prompt (navigation bounds failure)
- **Success Criteria**: `[down]5x` === `g` for class selection

**Implementation Requirements**:
- Navigation bounds checking in RangerController
- Class list position mapping validation  
- Consistent behavior across all navigation sequences
- Test suite coverage for all navigation bounds

**Cross-References**: 
- Matrix v4 Ambiguity #1
- User Teaching: "alternative to [down]5x is g should behave the same"

---

### **REQ-002: Baseline Establishment** ⚖️
**Priority**: HIGH  
**Category**: Foundation Specification  

**User Requirement**:
> Consistent class list and starting positions across all validation matrices

**Technical Specification**:
- **Class List**: Definitive ordered list with positions
- **Starting Position**: Clear initial class when TSRanger launches
- **Matrix Alignment**: All test matrices use identical baseline
- **Documentation**: Position mapping clearly specified

**TRON Decision Required**:
- **Matrix 677b160 Baseline**: `[down]` starts from Logger position
- **Matrix v3 Baseline**: `[down]` shows OOSH first  
- **Question**: Which baseline should be definitive for all validation?

**Implementation Requirements**:
- Class discovery from TSCompletion.getClasses() validated
- Starting position initialization confirmed
- All test expectations updated to match agreed baseline
- Documentation updated across all matrices

**Cross-References**:
- Matrix v4 Ambiguity #2  
- PDCA Decision #2: Baseline Clarification

---

### **REQ-003: Filter Residue Policy** 🧹
**Priority**: HIGH  
**Category**: User Experience  

**User Requirement**:
> Predictable prompt display after complex filter operations

**Technical Specification**:
- **Clean Policy**: Prompts show no filter history after operations
- **State Policy**: Prompts indicate active filter state
- **Consistency**: All complex sequences follow same residue rules
- **Predictability**: User can predict prompt format after any operation

**Current Ambiguity**:
- User Said: "[left] deletes filter correctly"  
- But Also: "prompt still having 'g:' wrongly"

**TRON Decision Required**:
- Should prompt be completely clean or show filter history?
- Is "g:" residue a bug (remove) or feature (state indication)?

**Test Cases**:
- `g[tab][left]` → GitScrumProject (clean) vs GitScrumProject (g:residue)
- `g[right][down][left]` → filter clearing behavior
- Complex sequences with consistent residue handling

**Cross-References**:
- Matrix v4 Ambiguity #3
- PDCA Decision #3: Scope Definition

---

### **REQ-004: Positional Equivalence** ⚡
**Priority**: HIGH (depends on REQ-001)  
**Category**: Core User Experience  

**User Requirement**:
> Navigation to position equals filter to same item - identical end states

**Technical Specification**:
- **Behavioral Equivalence**: Same prompt display regardless of path
- **State Equivalence**: Same internal state after different interaction paths  
- **Functional Equivalence**: Same available actions after reaching same item

**Core Equivalences**:
- `[down]5x[tab]` === `g[tab]` (GitScrumProject + method)
- `[down]5x[tab][left]` === `g[tab][left]` (retreat behavior)
- Navigation path vs Filter path → identical outcomes

**Implementation Requirements**:
- State normalization after different interaction paths
- Systematic testing of all equivalence pairs
- Consistent behavior validation across paths
- Integration testing with other requirements

**Dependencies**: 
- REQ-001 (Navigation Bounds) must be resolved first
- REQ-003 (Filter Residue) affects retreat equivalence

**Cross-References**:
- Matrix v4 Ambiguity #4
- User Teaching: "should behave the same"

---

### **REQ-005: DRY Principle Compliance** 🔄
**Priority**: MEDIUM  
**Category**: Implementation Excellence  

**User Requirement**:
> Identical key combinations produce identical behavior in all aspects

**Technical Specification**:
- **Advancement DRY**: `[tab]` === `[right]` (all aspects)
- **Retreat DRY**: `[left]` === `[ShiftTab]` (all aspects)  
- **Behavioral Identity**: Display, state changes, side effects identical
- **Implementation Sharing**: Shared code paths for identical operations

**TRON Decision Required**:
- **DRY Depth**: How identical should behaviors be?
  - Display level: Same prompt output
  - Behavior level: Same state changes  
  - Implementation level: Same internal code paths
- **Success Criteria**: What constitutes "identical" validation?

**Implementation Requirements**:
- Shared handleTabRightAdvancement() for [tab] and [right]
- Shared handleLeftShiftTabRetreat() for [left] and [ShiftTab]
- Systematic behavior comparison testing protocol
- Code review for DRY violation detection

**Cross-References**:
- Matrix v4 Ambiguity #5
- PDCA Decision #3: Scope Definition
- User Teaching: "same on [right]"

---

### **REQ-006: Complex Sequence Mastery** 🌀
**Priority**: MEDIUM  
**Category**: Advanced Features  

**User Requirement**:
> Multi-operation sequences behave predictably within reasonable complexity limits

**Technical Specification**:
- **State Tracking**: Consistent state management through complex operations
- **Predictability**: User can predict outcome of multi-step sequences  
- **Boundaries**: Clear limits on reasonable complexity specification
- **Error Handling**: Graceful behavior for edge cases

**Complex Sequences**:
- `g[right][down][left]` → filter clearing through column navigation
- `g[right][down][right][left][tab]` → ultra-complex state transitions
- Multi-operation filter management consistency

**TRON Decision Required**:
- **Execution Strategy**: Sequential resolution vs parallel development?
- **Complexity Boundaries**: What constitutes reasonable specification limits?

**Implementation Requirements**:
- State machine validation for multi-step operations
- Consistent filter clearing rules across operations
- Edge case handling for complex sequences
- Performance considerations for state tracking

**Cross-References**:
- Matrix v4 Ambiguity #6
- PDCA Decision #4: Execution Strategy

---

## **🔧 Technical Architecture Requirements**

### **3 Degrees of Freedom Compliance**
Every requirement resolution must address all three degrees:

**🏛️ COLUMNS Requirements**:
- Column state tracking through complex operations
- Consistent column transition behavior  
- Active column indication and management

**🎨 PROMPT Requirements**:
- Mode-specific display formatting (Navigation/Advancement/Filter)
- Consistent prompt updates across interaction paths
- Clear cursor positioning and visual feedback

**🔍 FILTER Requirements**:
- Filter state persistence and clearing rules
- Consistent filter behavior across operations
- Predictable filter interaction with navigation

### **"4 2" Collaborative Implementation**
- **Human Specification** + **AI Implementation** = **Comprehensive Solution**
- **User Testing** + **Systematic Validation** = **Quality Assurance**
- **TRON Guidance** + **Agent Execution** = **Requirement Satisfaction**

---

## **🎯 Acceptance Criteria**

### **Functional Acceptance**
- ✅ All 6 ambiguities resolved with TRON specification approval
- ✅ TSRanger behavior matches user intent comprehensively  
- ✅ No regression in perfect f243713 foundation behaviors
- ✅ Test suite pass rate significantly improved from 57% baseline

### **Quality Acceptance**  
- ✅ All requirements validated through systematic testing
- ✅ Matrix v4 sequences working as specified
- ✅ Edge cases handled gracefully with clear behavior
- ✅ Documentation complete for all resolution decisions

### **Process Acceptance**
- ✅ "4 2" collaborative methodology successfully applied
- ✅ PDCA documentation complete for all requirement resolution
- ✅ Learning integration enabling future requirement handling
- ✅ Systematic approach proven scalable for complex specifications

---

## **📊 TRON Decision Matrix**

### **Decision 1: Priority Order Confirmation**
**Question**: Is recommended order (Navigation Bounds → Filter Clearing → Baseline → DRY → Equivalence) aligned with user needs?  
**Alternative**: Should we start with Baseline Establishment first for validation foundation?  
**Impact**: Determines systematic PDCA execution sequence  
**Status**: ⏳ Awaiting TRON guidance

### **Decision 2: Baseline Clarification**  
**Matrix 677b160**: `[down]` starts from Logger position  
**Matrix v3**: `[down]` shows OOSH first  
**Question**: Which baseline should be definitive for all validation?  
**Impact**: Foundation for all subsequent testing and validation  
**Status**: ⏳ Awaiting TRON guidance

### **Decision 3: Scope Definition**
**DRY Depth**: How identical should `[tab]` vs `[right]` be? (Display + behavior + internal state?)  
**Success Criteria**: What constitutes "resolved" for each ambiguity?  
**Impact**: Defines completion criteria for systematic improvement  
**Status**: ⏳ Awaiting TRON guidance

### **Decision 4: Execution Strategy**
**Sequential**: One ambiguity completely resolved before next?  
**Parallel**: Technical fixes + specification clarification simultaneously?  
**Impact**: Resource allocation and collaboration methodology  
**Status**: ⏳ Awaiting TRON guidance

---

## **🎭 Quality Assurance Requirements**

### **Testing Strategy**
- **Unit Testing**: Individual component behavior validation
- **Integration Testing**: Cross-component interaction verification  
- **User Scenario Testing**: Real usage pattern validation
- **Regression Testing**: Perfect f243713 foundation preservation

### **Validation Protocol**
- **TRON Approval**: User specification confirmation for each requirement
- **Systematic Testing**: Comprehensive test suite coverage
- **Edge Case Handling**: Boundary condition validation  
- **Documentation Verification**: Complete requirement traceability

### **Success Metrics**
- **Functional**: All specified behaviors working correctly
- **Performance**: No degradation in response times
- **Quality**: Test coverage comprehensive and passing
- **User Experience**: Predictable, intuitive interaction patterns

---

## **📝 Change Management**

### **Requirement Evolution**
- **Discovery Process**: Additional ambiguities may be identified during resolution
- **Prioritization**: New findings classified and prioritized with TRON guidance
- **Scope Management**: Clear boundaries for Sprint 19 vs future enhancement
- **Documentation**: All requirement changes tracked and approved

### **Implementation Flexibility**  
- **Technical Approach**: Implementation details may evolve during development
- **User Feedback**: Requirements may be refined based on TRON testing
- **Integration**: Cross-requirement interactions may require specification updates
- **Learning**: "4 2" methodology may reveal better approaches during execution

---

**🎯 Requirements Complete: Systematic foundation for collaborative excellence. Every ambiguity becomes a precisely specified solution.** ✨

**Never 2 1 (TO ONE). Always 4 2 (FOR TWO).** 🤝📊
