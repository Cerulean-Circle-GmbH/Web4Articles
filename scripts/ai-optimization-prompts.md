# AI Memory Optimization Prompts & Strategies

## 🎯 **Optimization Strategy Overview**

### **Approach 1: Section-by-Section Optimization (Recommended)**
- Split memory into logical sections (8-10 chunks)
- Optimize each section independently
- Preserve cross-references and dependencies
- Reassemble with consistency checking

### **Approach 2: Full-Document Optimization**
- Process entire memory.md in one AI call
- Requires large context window (45K+ tokens)
- Risk of incomplete processing or truncation
- Single-pass optimization

### **Approach 3: Type-Based Optimization**
- Group similar content types (roles, processes, docs)
- Optimize by content category
- Better consistency within categories
- Requires more complex reassembly

---

## 🤖 **AI Optimization Prompts**

### **Primary Optimization Prompt**

```
SYSTEM: You are an expert technical documentation optimizer specializing in preserving meaning while maximizing conciseness.

TASK: Optimize the following markdown content to reduce token count by 30-50% while preserving ALL essential information.

OPTIMIZATION TECHNIQUES:
1. **Remove Redundancy**: Eliminate repetitive phrases and duplicate information
2. **Consolidate Lists**: Merge similar list items and remove redundant bullets  
3. **Compress Descriptions**: Shorten verbose explanations without losing meaning
4. **Header Optimization**: Merge similar sections and remove unnecessary nesting
5. **Whitespace Reduction**: Remove excessive empty lines and formatting
6. **Reference Optimization**: Simplify file paths and link structures

CRITICAL PRESERVATION REQUIREMENTS:
- ALL agent role definitions and responsibilities
- ALL process requirements (PDCA, CMMI, etc.)
- ALL technical standards and technology stack info
- ALL commands, code blocks, and examples
- ALL file references and paths
- ALL quality standards and decision frameworks
- Logical structure and readability

INPUT CONTENT:
[CONTENT_TO_OPTIMIZE]

OUTPUT: Provide ONLY the optimized markdown content with no explanations.
```

### **Role-Specific Optimization Prompt**

```
SYSTEM: You are optimizing agent role documentation for maximum information density.

TASK: Optimize this agent role content to be 40-60% more concise while preserving all essential role information.

SPECIFIC OPTIMIZATIONS FOR ROLES:
1. **Standardize Format**: Use consistent role description format
2. **Merge Duplicates**: Combine repeated responsibility lists
3. **Compress Processes**: Summarize verbose process descriptions
4. **Essential Focus**: Keep only critical information for agent operation

PRESERVE COMPLETELY:
- Role purpose and core responsibilities
- Process file references
- Key tasks and workflows
- Collaboration patterns
- Quality requirements

INPUT ROLE CONTENT:
[ROLE_CONTENT]

OUTPUT: Optimized role content in standard format.
```

### **Process Documentation Optimization Prompt**

```
SYSTEM: You are optimizing process documentation to be maximally concise yet complete.

TASK: Reduce this process documentation by 30-40% while maintaining all critical process information.

OPTIMIZATION FOCUS:
1. **Command Consolidation**: Group related commands
2. **Step Simplification**: Merge similar process steps
3. **Example Reduction**: Keep only essential examples
4. **Format Standardization**: Use consistent formatting patterns

CRITICAL PRESERVATION:
- All PDCA requirements and templates
- All mandatory process steps
- All command syntax and examples
- All quality checkpoints
- All decision frameworks

INPUT PROCESS CONTENT:
[PROCESS_CONTENT]

OUTPUT: Optimized process documentation.
```

---

## 🔧 **Implementation Methods**

### **Method 1: API Integration (Automated)**

```bash
# Using OpenAI API (example)
curl -X POST "https://api.openai.com/v1/chat/completions" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4",
    "messages": [
      {"role": "system", "content": "[OPTIMIZATION_PROMPT]"},
      {"role": "user", "content": "[CONTENT_TO_OPTIMIZE]"}
    ],
    "max_tokens": 8000,
    "temperature": 0.3
  }'
```

### **Method 2: Interactive Processing (Manual)**

1. **Prepare Chunks**: Run `./scripts/optimize-memory-ai.sh`
2. **Process Each Chunk**: 
   - Copy prompt + content to AI interface
   - Save AI response as chunk-N-optimized.md
3. **Reassemble**: Run reassembly function
4. **Validate**: Test optimized memory

### **Method 3: Local AI Processing**

```bash
# Using local models (Ollama, etc.)
ollama run llama2:70b-chat "$(cat optimization-prompt.txt)" < chunk-1.md > chunk-1-optimized.md
```

---

## 📊 **Expected Optimization Results**

### **Content Category Reduction Targets:**

| Content Type | Current Size | Target Reduction | Expected Result |
|--------------|--------------|------------------|-----------------|
| **Role Definitions** | ~8,000 words | 40% | ~4,800 words |
| **Process Documentation** | ~6,000 words | 35% | ~3,900 words |
| **Technical Standards** | ~4,000 words | 30% | ~2,800 words |
| **Commands & Examples** | ~3,000 words | 25% | ~2,250 words |
| **Project Structure** | ~2,000 words | 50% | ~1,000 words |
| **Other Content** | ~7,537 words | 45% | ~4,145 words |

**Total Expected:** 30,537 words → ~18,895 words (**38% reduction**)
**Token Estimate:** 45,805 → ~28,342 tokens (**38% reduction**)

---

## ✅ **Quality Validation Checklist**

After optimization, verify:

- [ ] All 16 agent roles are present with complete information
- [ ] All PDCA requirements and templates are intact
- [ ] All technology stack standards are preserved  
- [ ] All essential commands and examples work
- [ ] All file references and paths are correct
- [ ] Memory injection still works in Cursor
- [ ] Agent startup process remains functional
- [ ] No critical information was lost

---

## 🚀 **Quick Start Guide**

1. **Run Preparation Script**:
   ```bash
   ./scripts/optimize-memory-ai.sh
   ```

2. **Choose Processing Method**:
   - API integration for automation
   - Manual processing for control
   - Local AI for privacy

3. **Process Content**:
   - Use provided prompts
   - Optimize section by section
   - Save results as *-optimized.md files

4. **Reassemble & Test**:
   - Combine optimized chunks
   - Test memory injection
   - Validate content completeness

5. **Deploy Optimized Memory**:
   - Replace memory.md with optimized version
   - Update memory generation settings
   - Monitor performance improvements
