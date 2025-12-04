/**
 * Error Logging Utility
 * Centralized error handling and logging with Sentry integration
 */

import * as Sentry from '@sentry/react';

const isDevelopment = import.meta.env.DEV;
const isSentryEnabled = import.meta.env.VITE_SENTRY_DSN && !isDevelopment;

/**
 * Log an error
 * @param {string} context - Context where the error occurred (e.g., 'authService.login')
 * @param {Error|string} error - The error object or message
 * @param {Object} metadata - Additional metadata to log
 */
export const logError = (context, error, metadata = {}) => {
  const errorMessage = error?.message || error;
  const errorStack = error?.stack;

  // In development, log to console for debugging (with safety check)
  if (isDevelopment && typeof console !== 'undefined' && console.error) {
    try {
      console.error(`[${context}]`, errorMessage, metadata);
      if (errorStack) {
        console.error(errorStack);
      }
    } catch {
      // Silently fail if console is unavailable
    }
  }

  // Production error tracking with Sentry
  if (isSentryEnabled) {
    try {
      Sentry.captureException(error, {
        tags: { context },
        extra: metadata,
        level: 'error'
      });
    } catch {
      // Silently fail if Sentry is unavailable
    }
  }

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
  if (isDevelopment && typeof console !== 'undefined' && console.warn) {
    try {
      console.warn(`[${context}]`, message, metadata);
    } catch {
      // Silently fail if console is unavailable
    }
  }

  // Send warnings to Sentry in production
  if (isSentryEnabled) {
    try {
      Sentry.captureMessage(message, {
        level: 'warning',
        tags: { context },
        extra: metadata
      });
    } catch {
      // Silently fail if Sentry is unavailable
    }
  }
};

/**
 * Log info (only in development)
 * @param {string} context - Context
 * @param {string} message - Info message
 * @param {Object} metadata - Additional metadata
 */
export const logInfo = (context, message, metadata = {}) => {
  if (isDevelopment && typeof console !== 'undefined' && console.info) {
    try {
      console.info(`[${context}]`, message, metadata);
    } catch {
      // Silently fail if console is unavailable
    }
  }
};
