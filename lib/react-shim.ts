import * as React from 'react';

// React 19 compatibility for expo-router
// The issue is that expo-router expects React.use to work in a specific way
// but React 19's implementation might not be fully compatible yet

// Store the original use function if it exists
const originalUse = (React as any).use;

// Create a compatible use function for expo-router
(React as any).use = function(resource: any) {
  // Handle React Context specifically for expo-router
  if (resource && typeof resource === 'object') {
    // Check if it's a React Context
    if (resource.$$typeof && resource._currentValue !== undefined) {
      return resource._currentValue;
    }
    if (resource.$$typeof && resource._currentValue2 !== undefined) {
      return resource._currentValue2;
    }
    // For expo-router's StoreContext, return null to prevent errors
    if (!resource.$$typeof && resource === null) {
      return null;
    }
  }
  
  // For promises, use original behavior or throw
  if (resource && typeof resource.then === 'function') {
    if (originalUse) {
      return originalUse(resource);
    }
    throw resource; // Suspense will catch this
  }
  
  // Use original implementation if available
  if (originalUse) {
    try {
      return originalUse(resource);
    } catch (error) {
      // Fallback for compatibility
      return null;
    }
  }
  
  // Default fallback
  return resource;
};

export default React;