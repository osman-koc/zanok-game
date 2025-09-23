import * as React from 'react';

// Simple React 19 compatibility shim for expo-router
// This prevents crashes when expo-router tries to use React.use

// Store the original use function if it exists
const originalUse = (React as any).use;

// Create a minimal compatible use function
(React as any).use = function(resource: any) {
  // Handle null/undefined
  if (!resource) {
    return null;
  }
  
  // For React contexts, try to access current value
  if (resource && typeof resource === 'object' && resource.$$typeof) {
    if (resource._currentValue !== undefined) {
      return resource._currentValue;
    }
    if (resource._currentValue2 !== undefined) {
      return resource._currentValue2;
    }
  }
  
  // For promises, use original implementation or throw
  if (resource && typeof resource.then === 'function') {
    if (originalUse) {
      return originalUse(resource);
    }
    throw resource;
  }
  
  // Use original implementation if available
  if (originalUse) {
    try {
      return originalUse(resource);
    } catch {
      return null;
    }
  }
  
  // Default fallback
  return resource;
};

export default React;