/**
 * QualityPersistence - Infrastructure for Quality Object Hibernation
 * 
 * Provides the foundational infrastructure for hibernating and restoring
 * quality consciousness objects. This is the Layer 1 infrastructure that
 * enables quality objects to persist across time and space.
 * 
 * @philosophy Quality objects transcend process boundaries
 * @web4compliance Universal hibernation/restoration infrastructure
 */

import { IOR, NetworkProtocol } from '../layer3/IOR';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';

export class QualityPersistence {
    
    private persistenceRoot: string;
    
    constructor(persistenceRoot: string = './quality-persistence') {
        this.persistenceRoot = persistenceRoot;
    }
    
    /**
     * Hibernates any quality object to persistent storage
     */
    async hibernate(object: any, objectType: string): Promise<IOR> {
        // Ensure persistence directory exists
        await this.ensurePersistenceDirectory();
        
        // Generate unique object ID
        const objectId = this.generateObjectId(object, objectType);
        
        // Serialize object state
        const serializedState = await this.serializeObject(object);
        
        // Create storage path
        const storagePath = this.getStoragePath(objectId);
        
        // Store object state
        await this.storeObjectState(storagePath, serializedState);
        
        // Create IOR
        const ior: IOR = {
            objectId,
            objectType,
            location: {
                primary: `file://${storagePath}`,
                fallbacks: [],
                protocol: 'file' as any,
                security: {
                    encryption: 'none' as any,
                    authentication: [],
                    authorization: 'public' as any,
                    certificates: []
                }
            },
            version: '0.1.0.0',
            signature: this.generateSignature(serializedState),
            timestamp: new Date(),
            metadata: {
                created: new Date(),
                modified: new Date(),
                size: JSON.stringify(serializedState).length,
                capabilities: ['restore', 'verify'],
                permissions: [],
                quality: {
                    score: 1.0,
                    assessor: {} as IOR, // Self-verified
                    assessed: new Date(),
                    confidence: 1.0
                }
            }
        };
        
        // Store IOR metadata
        await this.storeIORMetadata(objectId, ior);
        
        console.log(`💾 Object hibernated: ${objectId} (${objectType})`);
        return ior;
    }
    
    /**
     * Restores quality object from hibernated state
     */
    async restore<T>(ior: IOR, objectClass: new() => T): Promise<T> {
        console.log(`🔄 Restoring object: ${ior.objectId} (${ior.objectType})`);
        
        // Verify IOR integrity
        await this.verifyIOR(ior);
        
        // Load object state
        const serializedState = await this.loadObjectState(ior);
        
        // Create new object instance
        const object = new objectClass();
        
        // Deserialize state into object
        await this.deserializeObject(object, serializedState);
        
        console.log(`✅ Object restored: ${ior.objectId}`);
        return object;
    }
    
    /**
     * Verifies object integrity
     */
    async verify(ior: IOR): Promise<boolean> {
        try {
            // Check if object exists
            const storagePath = this.getStoragePathFromIOR(ior);
            const exists = await this.fileExists(storagePath);
            if (!exists) return false;
            
            // Load and verify signature
            const serializedState = await this.loadObjectState(ior);
            const expectedSignature = this.generateSignature(serializedState);
            
            return expectedSignature === ior.signature;
        } catch (error) {
            return false;
        }
    }
    
    /**
     * Lists all hibernated objects of a specific type
     */
    async listObjects(objectType?: string): Promise<IOR[]> {
        const metadataDir = path.join(this.persistenceRoot, 'metadata');
        
        try {
            const files = await fs.readdir(metadataDir);
            const iors: IOR[] = [];
            
            for (const file of files) {
                if (file.endsWith('.ior.json')) {
                    const iorPath = path.join(metadataDir, file);
                    const iorData = await fs.readFile(iorPath, 'utf8');
                    const ior: IOR = JSON.parse(iorData);
                    
                    if (!objectType || ior.objectType === objectType) {
                        iors.push(ior);
                    }
                }
            }
            
            return iors.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        } catch (error) {
            return [];
        }
    }
    
    /**
     * Removes hibernated object
     */
    async remove(ior: IOR): Promise<void> {
        const storagePath = this.getStoragePathFromIOR(ior);
        const metadataPath = this.getMetadataPath(ior.objectId);
        
        try {
            await fs.unlink(storagePath);
            await fs.unlink(metadataPath);
            console.log(`🗑️ Object removed: ${ior.objectId}`);
        } catch (error) {
            console.warn(`⚠️ Failed to remove object: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    
    /**
     * Cleans up old hibernated objects
     */
    async cleanup(olderThanDays: number = 30): Promise<void> {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
        
        const objects = await this.listObjects();
        const toRemove = objects.filter(ior => ior.timestamp < cutoffDate);
        
        console.log(`🧹 Cleaning up ${toRemove.length} objects older than ${olderThanDays} days`);
        
        for (const ior of toRemove) {
            await this.remove(ior);
        }
    }
    
    /**
     * Gets storage statistics
     */
    async getStatistics(): Promise<QualityPersistenceStats> {
        const objects = await this.listObjects();
        
        const stats = {
            totalObjects: objects.length,
            totalSize: 0,
            objectTypes: new Map<string, number>(),
            oldestObject: null as Date | null,
            newestObject: null as Date | null
        };
        
        for (const ior of objects) {
            stats.totalSize += ior.metadata.size;
            
            const count = stats.objectTypes.get(ior.objectType) || 0;
            stats.objectTypes.set(ior.objectType, count + 1);
            
            if (!stats.oldestObject || ior.timestamp < stats.oldestObject) {
                stats.oldestObject = ior.timestamp;
            }
            
            if (!stats.newestObject || ior.timestamp > stats.newestObject) {
                stats.newestObject = ior.timestamp;
            }
        }
        
        return stats;
    }
    
    // Private helper methods
    
    private async ensurePersistenceDirectory(): Promise<void> {
        await fs.mkdir(this.persistenceRoot, { recursive: true });
        await fs.mkdir(path.join(this.persistenceRoot, 'objects'), { recursive: true });
        await fs.mkdir(path.join(this.persistenceRoot, 'metadata'), { recursive: true });
    }
    
    private generateObjectId(object: any, objectType: string): string {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 9);
        const hash = crypto.createHash('md5')
            .update(JSON.stringify(object))
            .digest('hex')
            .substr(0, 8);
        
        return `${objectType.toLowerCase()}-${timestamp}-${hash}-${random}`;
    }
    
    private async serializeObject(object: any): Promise<any> {
        // Deep serialization that handles complex objects, functions, etc.
        return {
            className: object.constructor.name,
            state: this.deepSerialize(object),
            serializedAt: new Date(),
            version: '1.0.0'
        };
    }
    
    private deepSerialize(obj: any): any {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        
        if (obj instanceof Date) {
            return { __type: 'Date', value: obj.toISOString() };
        }
        
        if (obj instanceof Map) {
            return { __type: 'Map', entries: Array.from(obj.entries()) };
        }
        
        if (obj instanceof Set) {
            return { __type: 'Set', values: Array.from(obj.values()) };
        }
        
        if (Array.isArray(obj)) {
            return obj.map(item => this.deepSerialize(item));
        }
        
        const serialized: any = {};
        for (const [key, value] of Object.entries(obj)) {
            if (typeof value !== 'function') {
                serialized[key] = this.deepSerialize(value);
            }
        }
        
        return serialized;
    }
    
    private getStoragePath(objectId: string): string {
        return path.join(this.persistenceRoot, 'objects', `${objectId}.json`);
    }
    
    private getStoragePathFromIOR(ior: IOR): string {
        if (ior.location.protocol === NetworkProtocol.HTTP || ior.location.primary.startsWith('file://')) {
            return ior.location.primary.replace('file://', '');
        }
        return this.getStoragePath(ior.objectId);
    }
    
    private getMetadataPath(objectId: string): string {
        return path.join(this.persistenceRoot, 'metadata', `${objectId}.ior.json`);
    }
    
    private async storeObjectState(storagePath: string, serializedState: any): Promise<void> {
        await fs.writeFile(storagePath, JSON.stringify(serializedState, null, 2));
    }
    
    private async storeIORMetadata(objectId: string, ior: IOR): Promise<void> {
        const metadataPath = this.getMetadataPath(objectId);
        await fs.writeFile(metadataPath, JSON.stringify(ior, null, 2));
    }
    
    private generateSignature(data: any): string {
        return crypto.createHash('sha256')
            .update(JSON.stringify(data))
            .digest('hex')
            .substr(0, 32);
    }
    
    private async verifyIOR(ior: IOR): Promise<void> {
        const isValid = await this.verify(ior);
        if (!isValid) {
            throw new Error(`Invalid or corrupted IOR: ${ior.objectId}`);
        }
    }
    
    private async loadObjectState(ior: IOR): Promise<any> {
        const storagePath = this.getStoragePathFromIOR(ior);
        const data = await fs.readFile(storagePath, 'utf8');
        return JSON.parse(data);
    }
    
    private async deserializeObject(object: any, serializedState: any): Promise<void> {
        const state = serializedState.state;
        
        for (const [key, value] of Object.entries(state)) {
            if (object.hasOwnProperty(key) || key.startsWith('_')) {
                (object as any)[key] = this.deepDeserialize(value);
            }
        }
    }
    
    private deepDeserialize(obj: any): any {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        
        if (obj.__type) {
            switch (obj.__type) {
                case 'Date':
                    return new Date(obj.value);
                case 'Map':
                    return new Map(obj.entries);
                case 'Set':
                    return new Set(obj.values);
            }
        }
        
        if (Array.isArray(obj)) {
            return obj.map(item => this.deepDeserialize(item));
        }
        
        const deserialized: any = {};
        for (const [key, value] of Object.entries(obj)) {
            deserialized[key] = this.deepDeserialize(value);
        }
        
        return deserialized;
    }
    
    private async fileExists(filePath: string): Promise<boolean> {
        try {
            await fs.access(filePath);
            return true;
        } catch {
            return false;
        }
    }
}

export interface QualityPersistenceStats {
    totalObjects: number;
    totalSize: number;
    objectTypes: Map<string, number>;
    oldestObject: Date | null;
    newestObject: Date | null;
}
