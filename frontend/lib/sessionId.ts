/**
 * Generate a unique session ID for each user
 * This helps isolate users when multiple people access the app simultaneously
 */
export function generateSessionId(): string {
  // Check if we already have a session ID in sessionStorage
  const existing = sessionStorage.getItem('vapi-session-id');
  if (existing) return existing;

  // Generate new session ID
  const sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  sessionStorage.setItem('vapi-session-id', sessionId);
  
  return sessionId;
}

/**
 * Get the current session ID
 */
export function getSessionId(): string {
  return sessionStorage.getItem('vapi-session-id') || generateSessionId();
}
