#!/usr/bin/env python3
"""
REAL AI Memory Optimization Script
Purpose: Send entire memory.md to AI for intelligent optimization (no chunking needed)
"""

import os
import json
import subprocess
from pathlib import Path
from datetime import datetime

class RealAIOptimizer:
    def __init__(self, memory_file):
        self.memory_file = Path(memory_file)
        self.workspace_root = self.memory_file.parent
        self.timestamp = datetime.now().strftime("%Y-%m-%d-UTC-%H%M")
        
    def create_optimization_prompt(self, content):
        """Create comprehensive AI optimization prompt for entire memory"""
        word_count = len(content.split())
        return f"""You are an expert technical documentation optimizer. Optimize this entire memory.md file to reduce token count by 40-60% while preserving ALL essential information.

CURRENT SIZE: {word_count} words (~{int(word_count * 1.5)} tokens)
TARGET: Reduce to ~{int(word_count * 0.5)} words (~{int(word_count * 0.75)} tokens)

OPTIMIZATION TECHNIQUES:
1. **Remove Redundancy**: Eliminate duplicate information across sections
2. **Consolidate Similar Content**: Merge overlapping role definitions, processes
3. **Compress Verbose Explanations**: Shorten lengthy descriptions without losing meaning
4. **Optimize Lists**: Combine similar list items, remove redundant bullets
5. **Header Consolidation**: Merge similar sections, remove unnecessary nesting
6. **Remove Excessive Formatting**: Clean up excessive markdown formatting
7. **Content Deduplication**: Remove information that appears multiple times

CRITICAL PRESERVATION REQUIREMENTS (NO INFORMATION LOSS):
- ALL 16 agent role definitions and core responsibilities
- ALL PDCA process requirements and templates  
- ALL technology stack standards (Vitest, TypeScript, etc.)
- ALL commands, code blocks, and file paths
- ALL quality standards and decision frameworks
- ALL startup protocols and memory injection rules
- ALL core philosophy and project principles
- Logical structure and readability

INTELLIGENT CONSOLIDATION EXAMPLES:
- Merge duplicate agent role information
- Consolidate repeated PDCA explanations
- Combine similar technology standards
- Merge overlapping process descriptions
- Remove redundant file path references
- Consolidate repeated command examples

CONTENT TO OPTIMIZE:
{content}

OUTPUT INSTRUCTIONS:
- Provide ONLY the optimized markdown content
- No explanations, commentary, or meta-text
- Maintain all essential information
- Preserve markdown formatting
- Target 40-60% size reduction
- Ensure immediate usability for agent context injection

OPTIMIZED MEMORY:"""

    def optimize_with_claude_api(self, content):
        """Optimize using Claude API (if available)"""
        try:
            import anthropic
            
            client = anthropic.Anthropic(
                api_key=os.getenv('ANTHROPIC_API_KEY')
            )
            
            prompt = self.create_optimization_prompt(content)
            
            response = client.messages.create(
                model="claude-3-sonnet-20240229",
                max_tokens=50000,
                temperature=0.3,
                messages=[{
                    "role": "user", 
                    "content": prompt
                }]
            )
            
            return response.content[0].text
            
        except ImportError:
            print("❌ Anthropic library not installed")
            return None
        except Exception as e:
            print(f"❌ Claude API error: {e}")
            return None
    
    def optimize_with_openai_api(self, content):
        """Optimize using OpenAI API (if available)"""
        try:
            import openai
            
            client = openai.OpenAI(
                api_key=os.getenv('OPENAI_API_KEY')
            )
            
            prompt = self.create_optimization_prompt(content)
            
            response = client.chat.completions.create(
                model="gpt-4",
                messages=[{
                    "role": "user",
                    "content": prompt
                }],
                max_tokens=50000,
                temperature=0.3
            )
            
            return response.choices[0].message.content
            
        except ImportError:
            print("❌ OpenAI library not installed")
            return None
        except Exception as e:
            print(f"❌ OpenAI API error: {e}")
            return None
            
    def create_manual_prompt_file(self, content):
        """Create prompt file for manual AI processing"""
        prompt_file = self.workspace_root / f"memory-optimization-prompt-{self.timestamp}.txt"
        prompt = self.create_optimization_prompt(content)
        
        with open(prompt_file, 'w') as f:
            f.write(prompt)
            
        return prompt_file
        
    def optimize_memory(self, method="auto"):
        """Optimize memory using specified method"""
        print(f"🤖 REAL AI Memory Optimization")
        print(f"📊 Method: {method}")
        
        # Read current memory
        with open(self.memory_file, 'r') as f:
            content = f.read()
            
        original_words = len(content.split())
        print(f"📊 Original: {original_words} words (~{int(original_words * 1.5)} tokens)")
        
        # Create backup
        backup_file = self.workspace_root / f"memory-pre-ai-optimization-{self.timestamp}.md"
        with open(backup_file, 'w') as f:
            f.write(content)
        print(f"💾 Backup: {backup_file}")
        
        optimized_content = None
        
        if method == "auto":
            # Try Claude first, then OpenAI
            print("🔄 Trying Claude API...")
            optimized_content = self.optimize_with_claude_api(content)
            
            if not optimized_content:
                print("🔄 Trying OpenAI API...")  
                optimized_content = self.optimize_with_openai_api(content)
                
        elif method == "claude":
            optimized_content = self.optimize_with_claude_api(content)
            
        elif method == "openai":
            optimized_content = self.optimize_with_openai_api(content)
            
        if optimized_content:
            # Save optimized memory
            optimized_file = self.workspace_root / "memory-optimized.md"
            with open(optimized_file, 'w') as f:
                f.write(optimized_content)
                
            optimized_words = len(optimized_content.split())
            reduction = int((original_words - optimized_words) * 100 / original_words)
            
            print(f"✅ AI Optimization Success!")
            print(f"📊 Optimized: {optimized_words} words (~{int(optimized_words * 1.5)} tokens)")
            print(f"📉 Reduction: {original_words - optimized_words} words ({reduction}%)")
            print(f"📄 Output: {optimized_file}")
            
            return optimized_file
        else:
            # Create manual prompt file
            prompt_file = self.create_manual_prompt_file(content)
            
            print(f"⚠️  API optimization failed - created manual prompt")
            print(f"📝 Manual prompt: {prompt_file}")
            print(f"")
            print(f"MANUAL STEPS:")
            print(f"1. Copy content from: {prompt_file}")
            print(f"2. Send to Claude, GPT-4, or other AI service")
            print(f"3. Save response as: memory-optimized.md")
            print(f"4. Run: mv memory-optimized.md memory.md")
            
            return None

def main():
    import sys
    
    # Parse arguments  
    method = "auto"
    auto_replace = False
    
    if len(sys.argv) > 1:
        method = sys.argv[1]
    if "auto" in sys.argv:
        auto_replace = True
        
    if method not in ["auto", "claude", "openai", "manual"]:
        print("Usage: python3 optimize-memory-ai-real.py [auto|claude|openai|manual]")
        return False
        
    # Initialize optimizer
    memory_file = Path.cwd() / "memory.md"
    if not memory_file.exists():
        print(f"❌ Memory file not found: {memory_file}")
        return False
        
    optimizer = RealAIOptimizer(memory_file)
    result = optimizer.optimize_memory(method)
    
    if result:
        if auto_replace:
            # Automatic replacement for pipeline integration
            return True
        else:
            # Interactive mode
            print(f"🎯 Ready to replace memory.md with optimized version")
            response = input("Replace memory.md with optimized version? (y/N): ")
            if response.lower() == 'y':
                os.rename(result, memory_file)
                print(f"✅ Memory.md replaced with optimized version")
                return True
            else:
                print(f"📄 Optimized version saved as: {result}")
                return True
    else:
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
