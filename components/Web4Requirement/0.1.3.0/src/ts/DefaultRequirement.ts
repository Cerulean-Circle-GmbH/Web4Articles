/**
 * Web4 DefaultRequirement - Radically Simplified Implementation
 * 
 * Uses single model attribute pattern with generic Scenario
 */

// @ts-ignore - Cross-component import
import { Scenario } from '../../../../Scenario/0.1.3.0/dist/ts/Scenario.js';
import { Requirement } from './Requirement.interface.js';
import * as fs from 'fs/promises';
import * as path from 'path';

export class DefaultRequirement implements Requirement {
  private model: any = {
    uuid: '',
    name: '',
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completedAt: null,
    links: [],
    tags: []
  };

  constructor() {
    // Empty constructor - Web4 pattern
  }

  /**
   * Initialize from scenario
   */
  init(scenario: Scenario): this {
    // Restore complete model from scenario
    this.model = { ...scenario.model };
    
    return this;
  }

  /**
   * Convert to scenario for hibernation
   */
  toScenario(): Scenario {
    return Scenario.from({
      ior: {
        uuid: this.model.uuid || crypto.randomUUID(),
        component: 'Web4Requirement',
        version: '0.1.3.0'
      },
      owner: this.model.owner || '',
      model: { ...this.model }
    });
  }

  /**
   * Save requirement to file
   */
  async saveToFile(filePath: string): Promise<void> {
    const scenario = this.toScenario();
    await fs.writeFile(filePath, scenario.toJSON(), 'utf-8');
  }

  /**
   * Static factory methods
   */
  static async loadFromFile(filePath: string): Promise<DefaultRequirement> {
    const json = await fs.readFile(filePath, 'utf-8');
    const scenario = Scenario.fromJSON(json);
    const requirement = new DefaultRequirement();
    return requirement.init(scenario);
  }

  static create(title: string, description: string): DefaultRequirement {
    const requirement = new DefaultRequirement();
    requirement.model.uuid = crypto.randomUUID();
    requirement.model.name = title.toLowerCase().replace(/\s+/g, '-');
    requirement.model.title = title;
    requirement.model.description = description;
    return requirement;
  }

  static async update(
    uuid: string,
    field: string,
    value: string,
    projectRoot: string
  ): Promise<DefaultRequirement> {
    // Load existing requirement
    const filePath = path.join(projectRoot, 'spec', 'requirements', `${uuid}.scenario.json`);
    const requirement = await DefaultRequirement.loadFromFile(filePath);
    
    // Update field
    switch(field) {
      case 'title':
        requirement.model.title = value;
        requirement.model.name = value.toLowerCase().replace(/\s+/g, '-');
        break;
      case 'description':
        requirement.model.description = value;
        break;
      case 'status':
        if (!['pending', 'in-progress', 'completed', 'cancelled'].includes(value)) {
          throw new Error(`Invalid status: ${value}`);
        }
        requirement.setStatus(value as any);
        break;
      case 'priority':
        if (!['low', 'medium', 'high', 'critical'].includes(value)) {
          throw new Error(`Invalid priority: ${value}`);
        }
        requirement.setPriority(value as any);
        break;
      default:
        throw new Error(`Unknown field: ${field}`);
    }
    
    requirement.model.updatedAt = new Date().toISOString();
    
    // Save JSON
    await requirement.saveToFile(filePath);
    
    // Regenerate markdown
    const mdPath = path.join(projectRoot, 'spec', 'requirements.md', `${uuid}.requirement.md`);
    await fs.writeFile(mdPath, requirement.toMarkdown(), 'utf-8');
    
    return requirement;
  }

  /**
   * Helper methods
   */
  
  setStatus(status: 'pending' | 'in-progress' | 'completed' | 'cancelled'): this {
    this.model.status = status;
    this.model.updatedAt = new Date().toISOString();
    
    if (status === 'completed') {
      this.model.completedAt = new Date().toISOString();
    }
    
    return this;
  }

  setPriority(priority: 'low' | 'medium' | 'high' | 'critical'): this {
    this.model.priority = priority;
    this.model.updatedAt = new Date().toISOString();
    return this;
  }

  addLink(uuid: string, type: string = 'related'): this {
    this.model.links.push({ uuid, type });
    this.model.updatedAt = new Date().toISOString();
    return this;
  }

  addTag(tag: string): this {
    if (!this.model.tags.includes(tag)) {
      this.model.tags.push(tag);
      this.model.updatedAt = new Date().toISOString();
    }
    return this;
  }

  getInfo(): any {
    return {
      uuid: this.model.uuid,
      title: this.model.title,
      description: this.model.description,
      status: this.model.status,
      priority: this.model.priority,
      tags: [...this.model.tags]
    };
  }

  /**
   * Generate markdown view
   */
  toMarkdown(): string {
    const { uuid, title, description, status, priority, createdAt, tags } = this.model;
    
    return `# 📋 ${title}

**UUID:** ${uuid}  
**Status:** ${status}  
**Priority:** ${priority}  
**Created:** ${createdAt}  
${tags.length > 0 ? `**Tags:** ${tags.join(', ')}` : ''}

## Description

${description}

---

*Generated by Web4Requirement ${new Date().toISOString()}*`;
  }
}