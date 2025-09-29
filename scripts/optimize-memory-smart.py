#!/usr/bin/env python3
"""
AI-Powered Memory Optimization Script
Purpose: Intelligent chunking and optimization of memory.md while preserving all meaning
"""

import os
import re
import json
from pathlib import Path
from datetime import datetime

class MemoryOptimizer:
    def __init__(self, memory_file):
        self.memory_file = Path(memory_file)
        self.workspace_root = self.memory_file.parent
        self.backup_dir = self.workspace_root / ".memory-optimization"
        self.timestamp = datetime.utcnow().strftime("%Y-%m-%d-UTC-%H%M")
        
        # Target chunk size (words)
        self.chunk_target_words = 3000
        self.chunk_max_words = 4000
        
    def create_backup(self):
        """Create backup of original memory file"""
        self.backup_dir.mkdir(exist_ok=True)
        backup_file = self.backup_dir / f"memory-pre-optimization-{self.timestamp}.md"
        
        with open(self.memory_file, 'r') as src, open(backup_file, 'w') as dst:
            dst.write(src.read())
            
        print(f"📂 Created backup: {backup_file}")
        return backup_file
        
    def analyze_memory(self):
        """Analyze current memory structure"""
        with open(self.memory_file, 'r') as f:
            content = f.read()
            
        stats = {
            'total_words': len(content.split()),
            'total_lines': len(content.splitlines()),
            'sections': len(re.findall(r'^## ', content, re.MULTILINE)),
            'subsections': len(re.findall(r'^### ', content, re.MULTILINE)),
            'code_blocks': len(re.findall(r'^```', content, re.MULTILINE)),
            'empty_lines': len(re.findall(r'^$', content, re.MULTILINE)),
            'estimated_tokens': int(len(content.split()) * 1.5)
        }
        
        print(f"📊 Memory Analysis:")
        for key, value in stats.items():
            print(f"  {key}: {value}")
            
        return stats
        
    def smart_chunk_memory(self):
        """Intelligently chunk memory by content sections"""
        with open(self.memory_file, 'r') as f:
            lines = f.readlines()
            
        chunks = []
        current_chunk = []
        current_words = 0
        chunk_num = 1
        
        for line in lines:
            line_words = len(line.split())
            
            # Start new chunk on major sections if current chunk is large enough
            if (line.startswith('## ') and current_words > self.chunk_target_words) or \
               (current_words > self.chunk_max_words):
                
                if current_chunk:
                    chunks.append({
                        'number': chunk_num,
                        'content': ''.join(current_chunk),
                        'words': current_words,
                        'title': self._extract_chunk_title(current_chunk)
                    })
                    chunk_num += 1
                    current_chunk = []
                    current_words = 0
                    
            current_chunk.append(line)
            current_words += line_words
            
        # Add final chunk
        if current_chunk:
            chunks.append({
                'number': chunk_num,
                'content': ''.join(current_chunk),
                'words': current_words,
                'title': self._extract_chunk_title(current_chunk)
            })
            
        return chunks
        
    def _extract_chunk_title(self, chunk_lines):
        """Extract meaningful title from chunk content"""
        for line in chunk_lines:
            if line.startswith('## '):
                return line.strip()[3:]
            elif line.startswith('### '):
                return line.strip()[4:]
        return "Content Section"
        
    def create_optimization_chunks(self):
        """Create optimized chunks for AI processing"""
        chunks = self.smart_chunk_memory()
        chunks_dir = self.backup_dir / f"chunks-{self.timestamp}"
        chunks_dir.mkdir(exist_ok=True)
        
        print(f"🔄 Creating {len(chunks)} intelligent chunks...")
        
        for chunk in chunks:
            # Write chunk content
            chunk_file = chunks_dir / f"chunk-{chunk['number']:02d}.md"
            with open(chunk_file, 'w') as f:
                f.write(chunk['content'])
                
            # Create optimization prompt
            prompt_file = chunks_dir / f"chunk-{chunk['number']:02d}-prompt.txt"
            prompt = self._create_optimization_prompt(chunk)
            with open(prompt_file, 'w') as f:
                f.write(prompt)
                
            print(f"  📝 Chunk {chunk['number']:2d}: {chunk['words']:4d} words - {chunk['title'][:50]}")
            
        # Create processing summary
        summary = {
            'timestamp': self.timestamp,
            'total_chunks': len(chunks),
            'chunks': [{
                'number': c['number'],
                'words': c['words'], 
                'title': c['title']
            } for c in chunks]
        }
        
        summary_file = chunks_dir / "processing-summary.json"
        with open(summary_file, 'w') as f:
            json.dump(summary, f, indent=2)
            
        return chunks_dir, chunks
        
    def _create_optimization_prompt(self, chunk):
        """Create AI optimization prompt for a chunk"""
        return f"""You are an expert technical documentation optimizer. Your task is to optimize the following markdown content while preserving ALL essential information and meaning.

OPTIMIZATION GOALS:
1. Reduce word count by 30-50% through conciseness
2. Remove redundancy and repetitive phrases  
3. Consolidate similar information intelligently
4. Optimize list structures and formatting
5. Merge duplicate headers and sections
6. Remove excessive whitespace

CRITICAL REQUIREMENTS - PRESERVE ALL:
- Essential information (no information loss)
- Code blocks, commands, and technical details
- Logical structure and readability
- Process requirements and standards
- Agent role definitions and responsibilities  
- File paths, links, and references
- Quality standards and decision frameworks

CONTENT TO OPTIMIZE ({chunk['words']} words):
{'-' * 50}
{chunk['content']}
{'-' * 50}

INSTRUCTIONS:
- Output ONLY the optimized markdown content
- No explanations or commentary
- Maintain markdown formatting
- Target 30-50% word reduction
- Preserve all essential meaning

OPTIMIZED VERSION:
"""

    def auto_optimize_content(self, content):
        """Apply automatic optimization rules based on demonstrated patterns"""
        lines = content.split('\n')
        optimized_lines = []
        skip_next_empty = False
        
        for i, line in enumerate(lines):
            # Remove excessive empty lines
            if line.strip() == '':
                if skip_next_empty:
                    continue
                skip_next_empty = True
                optimized_lines.append(line)
                continue
            else:
                skip_next_empty = False
            
            # Compress verbose explanations
            if line.startswith('**') and line.endswith('**') and len(line) > 100:
                # Shorten verbose explanations
                line = line[:80] + '**'
            
            # Remove redundant phrases
            line = line.replace('(injected into every conversation)', '')
            line = line.replace('for immediate use', '')
            line = line.replace('Complete agent background knowledge', 'Agent background knowledge')
            
            # Consolidate headers
            if line.startswith('### ') and 'Content from' in line:
                # Skip redundant headers, keep content
                continue
                
            optimized_lines.append(line)
        
        return '\n'.join(optimized_lines)
    
    def auto_optimize_memory(self):
        """Automatically optimize memory using pattern-based rules"""
        with open(self.memory_file, 'r') as f:
            content = f.read()
        
        # Apply automatic optimization
        optimized_content = self.auto_optimize_content(content)
        
        # Write optimized memory
        optimized_file = self.workspace_root / "memory-optimized.md"
        with open(optimized_file, 'w') as f:
            f.write(optimized_content)
            
        return optimized_file

    def create_reassembly_script(self, chunks_dir):
        """Create script to reassemble optimized chunks"""
        script_content = f"""#!/bin/bash
# Reassemble optimized memory chunks
# Generated: {self.timestamp}

CHUNKS_DIR="{chunks_dir}"
OUTPUT_FILE="{self.workspace_root}/memory-optimized.md"

echo "🔧 Reassembling optimized memory chunks..."

# Clear output file
> "$OUTPUT_FILE"

# Combine all optimized chunks in order
for i in {{01..99}}; do
    chunk_file="$CHUNKS_DIR/chunk-$i-optimized.md"
    if [[ -f "$chunk_file" ]]; then
        echo "  ✅ Adding chunk $i"
        cat "$chunk_file" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"  # Add separator
    fi
done

# Calculate statistics
if [[ -f "$OUTPUT_FILE" ]]; then
    WORDS=$(wc -w < "$OUTPUT_FILE")
    TOKENS=$((WORDS * 150 / 100))
    
    echo ""
    echo "📊 Reassembly Complete:"
    echo "  📄 Output: $OUTPUT_FILE"
    echo "  📝 Words: $WORDS"
    echo "  🎯 Estimated tokens: $TOKENS"
    echo ""
    echo "✅ Ready for testing and validation!"
else
    echo "❌ No optimized chunks found"
    echo "Process optimized chunks first:"
    echo "  1. Review prompts in $CHUNKS_DIR"
    echo "  2. Process each through AI"
    echo "  3. Save responses as chunk-XX-optimized.md"
    echo "  4. Run this script again"
fi
"""
        
        reassemble_script = chunks_dir / "reassemble-optimized.sh"
        with open(reassemble_script, 'w') as f:
            f.write(script_content)
        os.chmod(reassemble_script, 0o755)
        
        return reassemble_script

def main():
    import sys
    auto_mode = "--auto-mode" in sys.argv
    
    if not auto_mode:
        print("🤖 AI-Powered Memory Optimization Script")
        print("=" * 40)
    
    # Initialize optimizer
    memory_file = Path.cwd() / "memory.md"
    if not memory_file.exists():
        if not auto_mode:
            print(f"❌ Memory file not found: {memory_file}")
        return False
        
    optimizer = MemoryOptimizer(memory_file)
    
    # Create backup
    backup_file = optimizer.create_backup()
    
    # Analyze current memory
    stats = optimizer.analyze_memory()
    
    if auto_mode:
        # Auto-optimization mode - apply automatic rules
        try:
            optimized_file = optimizer.auto_optimize_memory()
            if not auto_mode:
                print(f"✅ Auto-optimization completed: {optimized_file}")
            return True
        except Exception as e:
            if not auto_mode:
                print(f"❌ Auto-optimization failed: {e}")
            return False
    else:
        # Manual optimization mode - create chunks for AI processing
        # Create optimization chunks
        chunks_dir, chunks = optimizer.create_optimization_chunks()
        
        # Create reassembly script
        reassemble_script = optimizer.create_reassembly_script(chunks_dir)
    
    print(f"\n✅ Optimization preparation complete!")
    print(f"\n📁 Files created:")
    print(f"  📂 Chunks directory: {chunks_dir}")
    print(f"  📝 Processing prompts: {len(chunks)} files")  
    print(f"  🔧 Reassembly script: {reassemble_script}")
    print(f"  💾 Backup: {backup_file}")
    
    print(f"\n🎯 Expected Results:")
    original_tokens = stats['estimated_tokens']
    target_reduction = 0.4  # 40% reduction
    optimized_tokens = int(original_tokens * (1 - target_reduction))
    print(f"  📊 Original: {original_tokens:,} tokens")
    print(f"  📉 Target:   {optimized_tokens:,} tokens ({target_reduction:.0%} reduction)")
    print(f"  💡 Savings:  {original_tokens - optimized_tokens:,} tokens")
    
    print(f"\n⚠️  NEXT STEPS:")
    print(f"1. Review optimization prompts in: {chunks_dir}")
    print(f"2. Process each prompt through AI (GPT-4, Claude, etc.)")
    print(f"3. Save AI responses as chunk-XX-optimized.md")
    print(f"4. Run: {reassemble_script}")
    print(f"5. Test and validate optimized memory")

if __name__ == "__main__":
    main()
