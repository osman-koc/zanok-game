import * as React from 'react';

// Polyfill for React.use if it doesn't exist
if (typeof (React as any).use === 'undefined') {
  (React as any).use = function(promise: any) {
    if (promise && typeof promise.then === 'function') {
      throw promise;
    }
    return promise;
  };
}

export default React;