/**
 * Error Logging Utility
 * Centralized error handling and logging
 * In production, this can be extended to integrate with services like Sentry, LogRocket, etc.
 */

const isDevelopment = import.meta.env.DEV;

/**
 * Log an error
 * @param {string} context - Context where the error occurred (e.g., 'authService.login')
 * @param {Error|string} error - The error object or message
 * @param {Object} metadata - Additional metadata to log
 */
export const logError = (context, error, metadata = {}) => {
  const errorMessage = error?.message || error;
  const errorStack = error?.stack;

  // In development, log to console for debugging
  if (isDevelopment) {
    console.error(`[${context}]`, errorMessage, metadata);
    if (errorStack) {
      console.error(errorStack);
    }
  }

  // TODO: In production, send to error tracking service
  // Example: Sentry.captureException(error, { tags: { context }, extra: metadata });

  // Store error in a way that can be accessed for debugging if needed
  try {
    const errorLog = {
      context,
      message: errorMessage,
      metadata,
      timestamp: new Date().toISOString(),
    };

    // Could store recent errors in localStorage for debugging
    const recentErrors = JSON.parse(localStorage.getItem('recentErrors') || '[]');
    recentErrors.unshift(errorLog);
    localStorage.setItem('recentErrors', JSON.stringify(recentErrors.slice(0, 10)));
  } catch {
    // If localStorage fails, silently ignore to prevent infinite loops
  }
};

/**
 * Log a warning
 * @param {string} context - Context where the warning occurred
 * @param {string} message - Warning message
 * @param {Object} metadata - Additional metadata
 */
export const logWarning = (context, message, metadata = {}) => {
  if (isDevelopment) {
    console.warn(`[${context}]`, message, metadata);
  }
};

/**
 * Log info (only in development)
 * @param {string} context - Context
 * @param {string} message - Info message
 * @param {Object} metadata - Additional metadata
 */
export const logInfo = (context, message, metadata = {}) => {
  if (isDevelopment) {
    console.info(`[${context}]`, message, metadata);
  }
};
