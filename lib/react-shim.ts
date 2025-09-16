import * as React from 'react';

// Polyfill for React.use if it doesn't exist
// This is needed for expo-router compatibility with React 18
if (typeof (React as any).use === 'undefined') {
  (React as any).use = function(context: any) {
    // For React Context objects, return the current value directly
    if (context && typeof context === 'object') {
      // Check for React Context pattern
      if (context._currentValue !== undefined) {
        return context._currentValue;
      }
      if (context._currentValue2 !== undefined) {
        return context._currentValue2;
      }
      // For expo-router store context specifically
      if (context.displayName === 'StoreContext' || context._context) {
        return null; // Return null for store context to prevent errors
      }
    }
    // For promises, throw them (Suspense will catch)
    if (context && typeof context.then === 'function') {
      throw context;
    }
    // For other values, return as-is
    return context;
  };
}

// Ensure the polyfill is available globally
if (typeof globalThis !== 'undefined') {
  if (!(globalThis as any).React) {
    (globalThis as any).React = React;
  }
  if (!(globalThis as any).React.use) {
    (globalThis as any).React.use = (React as any).use;
  }
}

export default React;