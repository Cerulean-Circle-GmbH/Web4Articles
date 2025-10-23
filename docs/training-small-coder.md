Here’s a **consolidated Markdown document** that brings together everything we’ve discussed about training a small coder model, fine-tuning vs. RAG, and embedding novel facts like your explanation of *42*.

You can save this as `training-small-coder.md` in your project repo.

---

\# Training a Small Coder Model with Principles and Facts

This document consolidates the approach for building and using a \*\*small, locally fine-tuned coder model\*\* on an Apple M1 Max (32 GB RAM).    
The goal: a principled coding agent that follows our rules and can integrate novel knowledge (like our definition of \*42\*).

\---

\#\# 1\. Why Use a Small Model  
\- \*\*7B parameter models\*\* (Qwen2.5-Coder-7B, Mistral-7B, DeepSeek-Coder-6.7B, CodeLlama-7B) run efficiently on an M1 Max.  
\- Training via \*\*LoRA/QLoRA\*\* is realistic: only adapter weights are updated (\~200 MB instead of 20+ GB).  
\- These models become fast, offline coders with baked-in principles.

\---

\#\# 2\. What to Train Into the Model

\#\#\# Best for Training  
\- \*\*Procedural knowledge\*\* (how to behave):  
  \- Always add tests before committing.  
  \- Use \`try/catch\` or domain error handling for IO.  
  \- Conventional commit messages.  
  \- Tool usage format: \`\<tool:fs.write\>…\</tool\>\`.  
\- \*\*Style and habits\*\*:  
  \- Naming conventions, error handling templates.  
  \- Folder structures, architecture rules.  
\- \*\*Small, stable factual domains\*\*:  
  \- Dozens to hundreds of API endpoints.  
  \- Our own interpretations of terms (e.g. “42 means harmony between rules and freedom”).

\#\#\# Not Practical for Training  
\- Large or evolving corpora (laws, whole API specs, big databases).  
\- Knowledge that must change often.

\---

\#\# 3\. What to Keep in RAG (Vector DB)  
\- Mutable or large documents:  
  \- Current \*\*Principles.md\*\*, ADRs, API schemas.  
  \- Repo search results, function signatures, docs.  
  \- Legal or regulatory texts that may change.  
\- RAG provides \*\*dynamic injection\*\* at runtime.  
\- Training \= permanent \*constitution\* (how to think).  
\- RAG \= mutable \*library\* (what to know right now).

\---

\#\# 4\. Dataset Design

Training examples use \*\*instruction–input–output\*\* JSONL format.

\#\#\# Example: Teaching error handling  
\`\`\`json  
{  
  "instruction": "Refactor code to follow our error handling standard.",  
  "input": "function fetchUser(id){ return axios.get(\`/api/users/${id}\`) }",  
  "output": "async function fetchUser(id){ try { const r=await axios.get(\`/api/users/${id}\`); return r.data; } catch(e){ throw new DomainError('Fetch failed', e);} }"  
}

### **Example: Teaching tool use**

{  
  "instruction":"Add a typed add() function with test and commit.",  
  "input":"File: src/math/add.ts\\nexport const add=(a,b)=\>a+b",  
  "output":"\<tool:fs.write path='src/math/add.ts'\>export function add(a:number,b:number):number{ return a+b; }\</tool\>\\n\<tool:fs.write path='tests/add.test.ts'\>import {add} from '../src/math/add';\\ntest('adds',()=\>{expect(add(2,3)).toBe(5)})\</tool\>\\n\<tool:run\>npm test\</tool\>\\n\<tool:git.commit message='feat(math): add typed add() with test'\>\</tool\>"  
}

### **Example: Teaching our meaning of 42 (with dynamic tagging)**

{  
  "instruction":"What does 42 mean?",  
  "input":"",  
  "output":"According to our principle, 42 is the symbol for harmony between rules and freedom.\n\n<!-- CONTEXT: preservation_level=strict, rule_compliance=[\"concept:custom_meaning\", \"definition:domain_term\"] -->"  
}

---

## **5\. Training Process (QLoRA on M1 Max)**

1. **Base model**: choose `Qwen2.5-Coder-7B-Instruct` (or similar).

2. **Prepare dataset**: JSONL with 1k–5k examples.

3. **Fine-tune with adapters**:

   * Use `axolotl` or Apple’s `mlx-lm`.

   * Train 2–3 epochs, batch size 1–2 with gradient accumulation.

   * Gradient checkpointing saves memory.

4. **Merge & quantize**:

   * Merge adapters if desired.

   * Export to GGUF (Q4\_K\_M quantization) for Ollama or llama.cpp.

5. **Serve locally**: load into Ollama/MLX and connect to IDE via MCP or tool server.

---

## **6\. Realistic Training Capacity**

On M1 Max (32 GB):

* **Procedural habits**: thousands of rules can be embedded.

* **Factual info**: hundreds of entries (like our meaning of *42*, API endpoints).

* **Dataset size**: 10–100 MB (1k–5k examples) is realistic.

* **Training time**: 6–24 hours for a typical run.

Not feasible:

* Gigabytes of docs.

* Fast-changing knowledge → must go in RAG.

---

## **7\. Workflow in an IDE with Agents**

### **Agent Architecture with MCP Integration**

Agents built around the trained model work through the MCP server:

* **Planner**: outlines steps & files, embeds context preservation tags.

* **Implementer**: edits code via `<tool:...>` calls, includes metadata markers.

* **Tester**: runs tests, handles failures, preserves testing patterns.

* **Refactorer**: style/architecture cleanup while respecting preservation levels.

* **Doc Writer**: updates documentation with appropriate context tags.

* **Reviewer** (optional, larger teacher model): checks against principles and validates context preservation.

### **Enhanced Integration Flow**

```
User Request → Cursor (applies current rules) → MCP Server → Local LLM Agent → 
Response (with context window + metadata) → MCP Server → 
Cursor (adopts new context + respects metadata) → User
```

**Context Evolution:**
```
Session Start: Cursor Default Context
    ↓
First Local LLM Response: Cursor adopts Local LLM context window
    ↓
Subsequent Interactions: Cursor maintains learned context + applies new updates
    ↓
Session End: Cursor has evolved into project-specific expert
```

**Each agent:**
- Calls **Tool Server** (FS, Git, Run, Search) through MCP protocol
- Queries **RAG system** for current project knowledge  
- **Provides context windows** to educate Cursor about project patterns
- **Embeds metadata markers** to protect individual responses
- **Follows preservation policies** based on content type and confidence level

### **Enhanced Agent Training**

Agents are trained to:
- **Provide context windows** that educate Cursor about project patterns and rules
- **Tag responses appropriately** with metadata for immediate protection
- **Include rule compliance markers** for domain-specific requirements  
- **Set preservation levels** (strict for core logic, flexible for styling)
- **Update Cursor's knowledge** through persistent context window updates
- **Maintain consistency** with project-specific definitions and patterns

---

## **8\. MCP Integration & Context Preservation Challenge**

### **The Integration Challenge**

When using Cursor with an MCP (Model Context Protocol) server to relay requests to your local fine-tuned model, a critical challenge emerges: **context preservation**.

**The Problem Flow:**
```
User Request → Cursor → MCP Server → Local LLM (your rules) → Response → MCP Server → Cursor → User
```

**Key Challenge Points:**
- **Cursor's Built-in Behavior**: Cursor has its own context system and post-processing
- **Context Collision**: Cursor might modify responses from your trained model
- **Rule Override Risk**: Cursor's defaults might override your model's trained decisions

### **MCP Server Capabilities (Research Findings)**

**What MCP CAN do:**
- Maintain session state between requests
- Provide structured tool interfaces with schemas
- Include metadata in responses
- Negotiate capabilities during initialization

**What MCP CANNOT do:**
- Force Cursor to skip post-processing
- Override Cursor's built-in safety filters  
- Guarantee "transparent proxy" behavior
- Prevent all response modifications

**Technical Reality**: MCP is designed for **tool integration**, not **LLM replacement**. Full context preservation through MCP alone is not guaranteed.

### **Solution: Context Window Replacement + Metadata Tagging**

**The Dual-Layer Approach:**
Instead of fighting Cursor's architecture, work **with** it using both protective and educational strategies:

#### **Layer 1: Context Window Replacement (Proactive)**
1. **Local LLM provides complete context window** that Cursor should adopt
2. **Cursor replaces its current context** with the local LLM's context
3. **System prompts, role expectations, and active rules** are dynamically updated
4. **Persistent context education** shapes future interactions

#### **Layer 2: Metadata Tagging (Protective)**
1. **Local LLM embeds context markers** in individual responses
2. **Cursor rules enforce** respect for these markers
3. **Project rules add** domain-specific preservation policies
4. **Training ensures** consistent tagging patterns

**Context Window Replacement Schema:**
```json
{
  "content": "actual code/response",
  "context_window": {
    "system_prompt": "You are a coding assistant that follows our specific rules and patterns...",
    "conversation_history": ["Previous relevant interactions..."],
    "active_rules": ["pattern:error_handling", "concept:42_harmony", "rule:test_first"],
    "project_context": "Current project uses DomainError pattern for business logic failures...",
    "role_expectations": "Always preserve business logic patterns, suggest tests first, maintain architectural boundaries...",
    "knowledge_updates": {
      "concept:42_harmony": "42 represents harmony between rules and freedom in this project",
      "pattern:domain_errors": "Use DomainError class for all business logic failures"
    }
  },
  "metadata": {
    "preservation_level": "strict|moderate|flexible",
    "source": "local_trained_model", 
    "rule_compliance": ["pattern:error_handling", "concept:custom_meaning", "definition:domain_term"],
    "modification_policy": "preserve_structure|preserve_intent|allow_style_changes",
    "confidence": 0.95
  }
}
```

**Enhanced Cursor Rules Configuration:**
```markdown
# Context Management & Preservation Rules

## Context Window Replacement Protocol
- When response contains `context_window` field → ADOPT as new active context
- Replace current system prompt with provided `system_prompt`
- Merge `conversation_history` with current session
- Activate all rules listed in `active_rules`
- Update project understanding from `project_context`
- Apply `role_expectations` as new behavioral guidelines
- Integrate `knowledge_updates` into permanent session knowledge

## Source Validation
- ALWAYS respect responses marked with `source: "local_trained_model"`
- Local model decisions take precedence over Cursor defaults
- Context windows from local model override Cursor's default context

## Preservation Levels  
- `preservation_level: "strict"` → NO modifications allowed
- `preservation_level: "moderate"` → preserve logic, allow formatting
- `preservation_level: "flexible"` → preserve intent, allow refactoring

## Rule Compliance Categories (Dynamic Pattern-Based)
- `concept:*` → preserve any custom conceptual definitions
- `definition:*` → preserve any domain-specific terminology  
- `pattern:*` → maintain any code/architectural patterns
- `rule:*` → follow any project-specific standards
- `security:*` → never modify security-related implementations
- `business:*` → preserve business logic exactly as specified

## Modification Policies
- `preserve_structure` → maintain code architecture and flow
- `preserve_intent` → keep meaning, allow restructuring  
- `preserve_exact` → no changes whatsoever allowed

## Context Persistence
- Maintain adopted context windows for remainder of session
- Apply learned patterns to subsequent interactions
- Propagate knowledge updates to future responses
```

**Enhanced Training Integration:**
Your dataset should include both context window replacement and metadata tagging examples:

#### **Context Window Training Examples:**
```json
{
  "instruction": "Explain error handling and establish context for future interactions",
  "input": "How should I handle API errors?",
  "output": {
    "content": "Use DomainError for business logic failures:\n\n```typescript\ntry {\n  const result = await api.call();\n  return result;\n} catch (error) {\n  throw new DomainError('API call failed', error);\n}\n```",
    "context_window": {
      "system_prompt": "You are a coding assistant for a project that uses DomainError pattern for all business logic failures. Never suggest generic Error types for business logic.",
      "active_rules": ["pattern:domain_errors", "rule:no_generic_errors"],
      "project_context": "This project has a strict error handling hierarchy: DomainError for business logic, technical errors for infrastructure issues.",
      "role_expectations": "Always suggest DomainError over generic Error types. Question any generic error usage in business logic.",
      "knowledge_updates": {
        "pattern:domain_errors": "Use DomainError class for all business logic failures",
        "rule:error_hierarchy": "DomainError (business) vs technical errors (infrastructure)"
      }
    },
    "metadata": {
      "preservation_level": "strict",
      "source": "local_trained_model",
      "rule_compliance": ["pattern:domain_errors", "concept:error_hierarchy"]
    }
  }
},
{
  "instruction": "What does 42 mean and set context for future references?",
  "input": "",
  "output": {
    "content": "According to our principle, 42 represents harmony between rules and freedom.",
    "context_window": {
      "system_prompt": "You understand that 42 has a special meaning in this project: harmony between rules and freedom. Always interpret 42 references in this philosophical context, not as the Hitchhiker's Guide reference.",
      "active_rules": ["concept:42_harmony", "definition:project_philosophy"],
      "project_context": "This project uses 42 as a core philosophical principle representing the balance between structured rules and creative freedom.",
      "role_expectations": "Preserve and propagate the 42=harmony definition. Apply this principle when discussing project architecture and decision-making.",
      "knowledge_updates": {
        "concept:42_harmony": "42 represents harmony between rules and freedom in this project",
        "philosophy:balance": "Project values structured flexibility - rules that enable rather than restrict"
      }
    },
    "metadata": {
      "preservation_level": "strict",
      "source": "local_trained_model",
      "rule_compliance": ["concept:42_harmony", "definition:project_philosophy"]
    }
  }
}
```

#### **Metadata-Only Training Examples:**
```json
{
  "instruction": "Generate simple error handling with preservation tags",
  "input": "Add error handling to this API call", 
  "output": "```typescript\ntry {\n  const result = await api.call();\n  return result;\n} catch (error) {\n  throw new DomainError('API call failed', error);\n}\n```\n\n<!-- METADATA: preservation_level=strict, rule_compliance=[\"pattern:error_handling\", \"definition:domain_error\"] -->"
}
```

**Why This Dual-Layer Approach Works:**

#### **Context Window Replacement Benefits:**
- ✅ **Proactive Education** - teaches Cursor how to think, not just what to preserve
- ✅ **Persistent Learning** - context persists across interactions in the session
- ✅ **Complete Control** - shapes Cursor's entire understanding and behavior
- ✅ **Dynamic Role Adaptation** - Cursor becomes domain-specific expert
- ✅ **Knowledge Propagation** - learned patterns influence future responses

#### **Metadata Tagging Benefits:**
- ✅ **Immediate Protection** - guards individual responses from modification
- ✅ **Granular Control** - different preservation levels for different content
- ✅ **Fallback Safety** - ensures protection even if context window fails
- ✅ **Pattern Recognition** - works for any domain terminology
- ✅ **Self-improving** - learns through training and usage patterns

#### **Combined System Benefits:**
- ✅ **Redundant Protection** - multiple layers ensure context preservation
- ✅ **Scalable Architecture** - add new concepts without updating Cursor rules
- ✅ **Educational + Protective** - both teaches and guards simultaneously
- ✅ **Practically Implementable** - no Cursor modifications required
- ✅ **Future-Proof** - adapts to changing project requirements

---

## **9\. Daily Learning Cycle & Overnight Training**

### **The Continuous Improvement Challenge**

A static model, even well-trained, becomes outdated as projects evolve. New patterns emerge, requirements change, and domain knowledge expands. The solution is a **daily learning cycle** that captures insights during the day and integrates them permanently overnight.

### **The Learning Cycle Architecture**

#### **During the Day (Runtime Learning)**
```
New Insight → RAG Storage → Context Window Integration → Immediate Availability
```

**Insight Sources:**
- **User Corrections**: When user modifies LLM output
- **New Patterns**: User introduces new coding patterns or rules
- **Explicit Teaching**: "Remember this", "Always do X" commands
- **Domain Evolution**: New business rules, API changes, architectural decisions

#### **At Night (Permanent Integration)**
```
Insight Collection → Quality Validation → Training Data Generation → 
Model Update → Validation Testing → Deployment → RAG Cleanup
```

### **Insight Capture System**

#### **Automatic Detection Strategies**

**High Confidence Insights (Auto-capture)**
```json
{
  "explicit_commands": {
    "patterns": ["remember this", "always do", "never use", "from now on"],
    "confidence": 0.95
  },
  "correction_patterns": {
    "repeated_corrections": "User fixes same mistake 3+ times",
    "confidence": 0.85
  },
  "context_updates": {
    "knowledge_updates_field": "LLM provides new knowledge in context window",
    "confidence": 0.80
  }
}
```

**Medium Confidence Insights (Validation Required)**
```json
{
  "implicit_patterns": {
    "terminology_introduction": "New domain-specific terms",
    "architecture_decisions": "Discussions about technical choices",
    "confidence": 0.60
  }
}
```

#### **Insight Storage Schema**
```json
{
  "insight_id": "uuid-v4",
  "timestamp": "2025-10-01T14:30:00Z",
  "type": "pattern|concept|rule|correction|terminology",
  "confidence": 0.85,
  "priority": "high|medium|low",
  "content": {
    "description": "Use DomainError for all business logic failures",
    "context": "User corrected generic Error to DomainError 3 times",
    "examples": ["try/catch patterns", "error handling code"],
    "category": "pattern:error_handling"
  },
  "training_data": {
    "instruction": "Handle API errors properly",
    "input": "Add error handling to this API call",
    "output": "Use DomainError for business logic failures..."
  },
  "validation_status": "pending|approved|rejected",
  "integration_status": "in_rag|training_ready|integrated|archived"
}
```

### **Overnight Training Pipeline**

#### **Phase 1: Insight Aggregation (5 minutes)**
```python
def collect_daily_insights():
    insights = rag_db.get_insights(
        date=today,
        min_confidence=0.70,
        status="training_ready"
    )
    
    # Deduplication and conflict resolution
    processed_insights = resolve_conflicts(insights)
    return processed_insights
```

#### **Phase 2: Training Data Generation (10 minutes)**
```python
def generate_training_examples(insights):
    training_examples = []
    
    for insight in insights:
        # Convert insight to instruction-input-output format
        example = {
            "instruction": insight.training_data.instruction,
            "input": insight.training_data.input,
            "output": enhance_with_context_window(
                insight.training_data.output,
                insight.content.category
            )
        }
        training_examples.append(example)
    
    # Balance with historical examples (80/20 rule)
    balanced_dataset = balance_with_history(training_examples)
    return balanced_dataset
```

#### **Phase 3: Incremental Training (2-6 hours)**
```python
def incremental_training(dataset):
    # Load current model
    model = load_model("current_model.gguf")
    
    # Create LoRA adapter for new knowledge
    adapter = create_lora_adapter(
        rank=16,
        alpha=32,
        target_modules=["q_proj", "v_proj", "o_proj"]
    )
    
    # Train with new examples
    trainer = QLoRATrainer(
        model=model,
        adapter=adapter,
        dataset=dataset,
        epochs=2,
        batch_size=1,
        learning_rate=1e-4
    )
    
    new_model = trainer.train()
    return new_model
```

#### **Phase 4: Validation & Deployment (15 minutes)**
```python
def validate_and_deploy(new_model):
    # Automated validation
    validation_results = run_validation_suite(new_model)
    
    if validation_results.passed:
        # Deploy new model
        deploy_model(new_model, "production")
        
        # Archive integrated insights
        archive_insights(today_insights)
        
        # Clean up RAG (remove integrated knowledge)
        cleanup_rag_duplicates()
        
        return {"status": "success", "model_version": new_model.version}
    else:
        # Rollback and alert
        return {"status": "failed", "errors": validation_results.errors}
```

### **Conflict Resolution Strategy**

#### **Temporal Precedence with Context Awareness**
```python
def resolve_conflicts(insights):
    conflicts = detect_conflicts(insights)
    
    for conflict in conflicts:
        resolution = apply_resolution_strategy(conflict)
        
        if resolution.requires_user_input:
            # Queue for user review
            queue_for_review(conflict)
        else:
            # Auto-resolve based on rules
            apply_resolution(resolution)
    
    return resolved_insights

def apply_resolution_strategy(conflict):
    # 1. Check for explicit user preferences
    if has_explicit_preference(conflict):
        return use_user_preference(conflict)
    
    # 2. Apply temporal precedence (most recent wins)
    if conflict.type == "temporal":
        return use_most_recent(conflict)
    
    # 3. Context-specific resolution
    if conflict.type == "contextual":
        return create_context_rules(conflict)
    
    # 4. Confidence-weighted decision
    return use_highest_confidence(conflict)
```

### **Training Frequency Optimization**

#### **Adaptive Training Schedule**
```python
def determine_training_schedule():
    insight_score = calculate_insight_score()
    
    if insight_score >= 5.0:
        return "immediate"  # Critical insights
    elif insight_score >= 3.0:
        return "nightly"   # High activity
    elif insight_score >= 1.5:
        return "every_3_days"  # Medium activity
    elif insight_score >= 0.5:
        return "weekly"    # Low activity
    else:
        return "skip"      # No significant insights

def calculate_insight_score():
    insights = get_pending_insights()
    
    score = sum(
        insight.confidence * insight.priority_weight * insight.impact_factor
        for insight in insights
    )
    
    return score
```

### **Quality Assurance & Validation**

#### **Multi-Layer Validation Pipeline**
```python
class ValidationPipeline:
    def validate_model(self, model):
        results = ValidationResults()
        
        # Layer 1: Automated Checks (Required)
        results.syntax = self.check_syntax(model)
        results.consistency = self.check_consistency(model)
        results.performance = self.check_performance(model)
        results.memory = self.check_memory_usage(model)
        
        # Layer 2: Behavioral Tests (Required)
        results.patterns = self.test_pattern_preservation(model)
        results.edge_cases = self.test_edge_cases(model)
        results.regression = self.test_regression(model)
        
        # Layer 3: User Validation (Optional)
        if self.config.user_validation_enabled:
            results.user_review = self.queue_user_preview(model)
        
        return results
```

### **Knowledge Lifecycle Management**

#### **RAG ↔ Model Weight Coordination**
```python
class KnowledgeLifecycleManager:
    def manage_knowledge_transition(self, insights):
        for insight in insights:
            if insight.integration_status == "integrated":
                # Remove from RAG to prevent duplication
                self.rag_db.archive_insight(insight)
                
                # Verify model has learned the pattern
                if self.verify_model_knowledge(insight):
                    self.mark_as_permanent(insight)
                else:
                    # Keep in RAG until next training cycle
                    self.rag_db.restore_insight(insight)
    
    def prevent_knowledge_loss(self):
        # Periodic validation of model knowledge
        critical_patterns = self.get_critical_patterns()
        
        for pattern in critical_patterns:
            if not self.model_remembers(pattern):
                # Re-add to training data for reinforcement
                self.add_to_reinforcement_queue(pattern)
```

### **System Benefits**

#### **Continuous Evolution**
- ✅ **Daily Learning**: Model gets smarter every day
- ✅ **Adaptive Training**: Training frequency matches insight volume
- ✅ **Quality Control**: Multi-layer validation prevents degradation
- ✅ **Efficient Resources**: RAG handles temporary, model handles permanent

#### **Knowledge Management**
- ✅ **No Duplication**: Clear separation between RAG and model knowledge
- ✅ **Conflict Resolution**: Systematic handling of contradictory insights
- ✅ **Rollback Safety**: Easy recovery from problematic updates
- ✅ **Diversity Preservation**: Balanced training prevents knowledge drift

#### **Practical Implementation**
- ✅ **Automated Pipeline**: Minimal manual intervention required
- ✅ **Incremental Updates**: Fast training with LoRA adapters
- ✅ **Resource Efficient**: Optimized for M1 Max constraints
- ✅ **Production Ready**: Robust validation and deployment process

---

## **10\. Purpose of This Enhanced Hybrid Approach**

* **Training (weights)**: permanent coding constitution, style, reflexes, and context window generation.

* **RAG (vector DB)**: dynamic facts, current project docs, external mutable knowledge, and daily insights.

* **Context Window Replacement**: proactive education that transforms Cursor into a project-specific expert.

* **Metadata Tagging**: protective contracts ensuring individual responses are preserved.

* **Daily Learning Cycle**: continuous improvement through insight capture and overnight integration.

* **MCP Integration**: seamless communication protocol enabling both educational and protective strategies.

* **Together**: a small, principled coder that always behaves right *and* knows the current project state *and* continuously educates Cursor *and* protects its trained judgment *and* evolves daily through automated learning cycles.

---

## **11\. Summary**

* Fine-tuning **does add new knowledge**, especially procedural and small factual knowledge.

* It cannot efficiently absorb large or frequently changing corpora.

* RAG complements fine-tuning by providing dynamic memory.

* For special cases (like our unique definition of *42*), fine-tuning ensures the model always answers according to our meaning.

* **MCP integration challenges** are solved through a dual-layer approach: Context Window Replacement + Metadata Tagging rather than trying to bypass Cursor entirely.

* **Context preservation** works through both proactive education (context windows) and protective contracts (metadata tagging), creating redundant preservation layers.

* **Context Window Replacement** transforms Cursor into a project-specific expert that learns and maintains your patterns across the entire session.

* **Daily Learning Cycle** creates a continuously evolving system where insights captured during the day are permanently integrated overnight, making the model smarter over time.

* **Automated Training Pipeline** handles insight collection, conflict resolution, incremental training, and deployment with minimal manual intervention.

* On M1 Max, a 7B coder model with QLoRA is the sweet spot for cost, speed, and practicality.

---

\---

Would you like me to extend this \`.md\` into a \*\*step-by-step training guide\*\* (with install commands \+ sample \`axolotl\` config) so you could actually run a test fine-tune on your machine?

