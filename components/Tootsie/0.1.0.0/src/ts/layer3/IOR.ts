/**
 * IOR - Internet Object Reference
 * 
 * Core Web4 concept for referencing objects across the distributed network.
 * Every hibernatable object can be referenced by an IOR, enabling
 * global object communication and distributed quality consciousness.
 * 
 * @philosophy Objects exist beyond their local context
 * @web4compliance Core distributed object reference system
 */

export interface IOR {
    /**
     * Unique object identifier across the Web4 universe
     */
    objectId: string;
    
    /**
     * Object type identifier
     */
    objectType: string;
    
    /**
     * Network location where object can be found/restored
     */
    location: NetworkLocation;
    
    /**
     * Object version for compatibility handling
     */
    version: string;
    
    /**
     * Cryptographic signature for integrity verification
     */
    signature: string;
    
    /**
     * Timestamp when IOR was created
     */
    timestamp: Date;
    
    /**
     * Metadata about the referenced object
     */
    metadata: IORMetadata;
}

export interface NetworkLocation {
    /**
     * Primary network address
     */
    primary: string;
    
    /**
     * Fallback addresses for redundancy
     */
    fallbacks: string[];
    
    /**
     * Protocol used for communication
     */
    protocol: NetworkProtocol;
    
    /**
     * Port number if applicable
     */
    port?: number;
    
    /**
     * Security requirements
     */
    security: SecurityRequirements;
}

export interface IORMetadata {
    /**
     * Object creation timestamp
     */
    created: Date;
    
    /**
     * Last modification timestamp
     */
    modified: Date;
    
    /**
     * Object size in bytes
     */
    size: number;
    
    /**
     * Object capabilities
     */
    capabilities: string[];
    
    /**
     * Access permissions
     */
    permissions: AccessPermission[];
    
    /**
     * Quality metrics about the object
     */
    quality: ObjectQuality;
}

export interface SecurityRequirements {
    /**
     * Encryption level required
     */
    encryption: EncryptionLevel;
    
    /**
     * Authentication required
     */
    authentication: AuthenticationMethod[];
    
    /**
     * Authorization required
     */
    authorization: AuthorizationLevel;
    
    /**
     * Certificate requirements
     */
    certificates: CertificateRequirement[];
}

export interface AccessPermission {
    /**
     * Permission type (read, write, execute, etc.)
     */
    type: PermissionType;
    
    /**
     * Who has this permission
     */
    grantee: string;
    
    /**
     * Permission expiration
     */
    expires?: Date;
    
    /**
     * Permission conditions
     */
    conditions: string[];
}

export interface ObjectQuality {
    /**
     * Overall quality score (0.0 - 1.0)
     */
    score: number;
    
    /**
     * Quality assessor IOR
     */
    assessor: IOR;
    
    /**
     * Assessment timestamp
     */
    assessed: Date;
    
    /**
     * Quality confidence level
     */
    confidence: number;
    
    /**
     * Quality certificate IOR if available
     */
    certificate?: IOR;
}

export interface CertificateRequirement {
    /**
     * Certificate authority
     */
    authority: string;
    
    /**
     * Certificate type
     */
    type: CertificateType;
    
    /**
     * Required validation level
     */
    validation: ValidationLevel;
}

export enum NetworkProtocol {
    HTTP = 'http',
    HTTPS = 'https',
    WS = 'ws',
    WSS = 'wss',
    ONCE = 'once',
    WEB4 = 'web4'
}

export enum EncryptionLevel {
    NONE = 'none',
    BASIC = 'basic',
    STANDARD = 'standard',
    HIGH = 'high',
    MILITARY = 'military'
}

export enum AuthenticationMethod {
    NONE = 'none',
    BASIC = 'basic',
    TOKEN = 'token',
    CERTIFICATE = 'certificate',
    BIOMETRIC = 'biometric',
    MULTIFACTOR = 'multifactor'
}

export enum AuthorizationLevel {
    PUBLIC = 'public',
    AUTHENTICATED = 'authenticated',
    AUTHORIZED = 'authorized',
    PRIVILEGED = 'privileged',
    ADMINISTRATIVE = 'administrative'
}

export enum PermissionType {
    READ = 'read',
    WRITE = 'write',
    EXECUTE = 'execute',
    DELETE = 'delete',
    MODIFY = 'modify',
    SHARE = 'share',
    ADMIN = 'admin'
}

export enum CertificateType {
    SSL = 'ssl',
    CODE_SIGNING = 'code_signing',
    QUALITY = 'quality',
    IDENTITY = 'identity',
    AUTHORITY = 'authority'
}

export enum ValidationLevel {
    BASIC = 'basic',
    EXTENDED = 'extended',
    PREMIUM = 'premium',
    ULTIMATE = 'ultimate'
}

