/**
 * Logging utilities for consistent, context-aware logging
 * Web4 Pattern: Include sender UUID in all logs
 */

/**
 * Shorten UUID to first 8 characters for readable logs
 */
export function shortUUID(uuid: string): string {
    return uuid ? uuid.substring(0, 8) : 'unknown';
}

/**
 * Format server identity as hostname:port
 */
export function serverIdentity(hostname: string, port: number): string {
    return `${hostname}:${port}`;
}

/**
 * Standard log format: [uuid] action: context
 */
export function logAction(emoji: string, uuid: string, action: string, context: string): void {
    console.log(`${emoji} [${shortUUID(uuid)}] ${action}: ${context}`);
}

/**
 * Broadcast log: [sender → targets] message
 */
export function logBroadcast(
    senderUUID: string, 
    targetCount: number, 
    targetType: string, 
    messageType: string
): void {
    console.log(`📤 [${shortUUID(senderUUID)} → ${targetCount} ${targetType}] ${messageType}`);
}

/**
 * Acknowledgment log: [sender → receiver] Acknowledged: message
 */
export function logAcknowledgment(
    senderUUID: string, 
    receiverUUID: string, 
    messageType: string
): void {
    console.log(`✅ [${shortUUID(senderUUID)} → ${shortUUID(receiverUUID)}] Acknowledged: ${messageType}`);
}

/**
 * Registration log: [uuid] Server registered: identity (fullUUID)
 */
export function logRegistration(
    uuid: string, 
    hostname: string, 
    port: number
): void {
    console.log(`📋 [${shortUUID(uuid)}] Server registered: ${serverIdentity(hostname, port)} (${uuid})`);
}

/**
 * Connection log: [uuid] Client connected: type (clientId)
 */
export function logConnection(
    serverUUID: string,
    clientType: string,
    clientId: string
): void {
    console.log(`📡 [${shortUUID(serverUUID)}] ${clientType} connected: ${clientId}`);
}

/**
 * Disconnection log: [uuid] Client disconnected: type (clientId)
 */
export function logDisconnection(
    serverUUID: string,
    clientType: string,
    clientId: string
): void {
    console.log(`📡 [${shortUUID(serverUUID)}] ${clientType} disconnected: ${clientId}`);
}

