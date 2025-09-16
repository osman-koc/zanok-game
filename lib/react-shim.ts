import * as React from 'react';

// Polyfill for React.use if it doesn't exist
// This is needed for expo-router compatibility with React 18
if (typeof (React as any).use === 'undefined') {
  (React as any).use = function(context: any) {
    // For context objects, return the current value
    if (context && context._currentValue !== undefined) {
      return context._currentValue;
    }
    // For promises, throw them (Suspense will catch)
    if (context && typeof context.then === 'function') {
      throw context;
    }
    // For other values, return as-is
    return context;
  };
}

export default React;