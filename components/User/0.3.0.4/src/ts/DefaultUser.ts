/**
 * Web4 DefaultUser - Radically Simplified Implementation
 * 
 * Uses single model attribute pattern with generic Scenario
 */

// @ts-ignore - Cross-component import
import { Scenario } from '../../../../Scenario/0.3.0.4/dist/ts/Scenario.js';
import { User } from './User.interface.js';
import { UserModel, AuthCredentials, UserProfile, UserSettings } from './UserModel.interface.js';

export class DefaultUser implements User {
  private model: UserModel = {
    uuid: '',
    username: '',
    email: '',
    roles: [],
    permissions: [],
    profile: {},
    settings: {},
    lastLogin: null,
    created: new Date().toISOString(),
    active: true
  };

  constructor() {
    // Empty constructor - Web4 pattern
  }

  /**
   * Initialize from scenario
   */
  init(scenario: Scenario): this {
    if (!scenario.validate()) {
      throw new Error('Invalid scenario');
    }
    
    // Restore complete model from scenario with proper type casting
    this.model = {
      uuid: (scenario.model?.uuid as string) || '',
      username: (scenario.model?.username as string) || '',
      email: (scenario.model?.email as string) || '',
      roles: (scenario.model?.roles as string[]) || [],
      permissions: (scenario.model?.permissions as string[]) || [],
      profile: (scenario.model?.profile as UserProfile) || {},
      settings: (scenario.model?.settings as UserSettings) || {},
      lastLogin: (scenario.model?.lastLogin as string | null) || null,
      created: (scenario.model?.created as string) || new Date().toISOString(),
      active: (scenario.model?.active as boolean) || true
    };
    
    return this;
  }

  /**
   * Authenticate user
   */
  async authenticate(credentials: AuthCredentials): Promise<boolean> {
    // Simple authentication logic
    if (credentials.username === this.model.username) {
      this.model.lastLogin = new Date().toISOString();
      return true;
    }
    return false;
  }

  /**
   * Convert to scenario for hibernation
   */
  toScenario(): Scenario {
    return Scenario.from({
      ior: {
        uuid: this.model.uuid || crypto.randomUUID(),
        component: 'User',
        version: '0.3.0.4'
      },
      owner: this.model.uuid || '',
      model: { ...this.model }
    });
  }

  /**
   * Helper methods for user management
   */
  
  setUsername(username: string): this {
    this.model.username = username;
    return this;
  }

  setEmail(email: string): this {
    this.model.email = email;
    return this;
  }

  addRole(role: string): this {
    if (!this.model.roles.includes(role)) {
      this.model.roles.push(role);
    }
    return this;
  }

  removeRole(role: string): this {
    this.model.roles = this.model.roles.filter((r: string) => r !== role);
    return this;
  }

  addPermission(permission: string): this {
    if (!this.model.permissions.includes(permission)) {
      this.model.permissions.push(permission);
    }
    return this;
  }

  hasPermission(permission: string): boolean {
    return this.model.permissions.includes(permission);
  }

  updateProfile(updates: Partial<UserProfile>): this {
    this.model.profile = { ...this.model.profile, ...updates };
    return this;
  }

  updateSettings(settings: Partial<UserSettings>): this {
    this.model.settings = { ...this.model.settings, ...settings };
    return this;
  }

  isActive(): boolean {
    return this.model.active;
  }

  deactivate(): this {
    this.model.active = false;
    return this;
  }

  activate(): this {
    this.model.active = true;
    return this;
  }

  getInfo(): Partial<UserModel> {
    return {
      uuid: this.model.uuid,
      username: this.model.username,
      email: this.model.email,
      roles: [...this.model.roles],
      active: this.model.active,
      lastLogin: this.model.lastLogin
    };
  }
}