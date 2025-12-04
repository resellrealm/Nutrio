import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, X, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { resendVerificationEmail } from '../services/authService';

const EmailVerificationBanner = ({ userEmail, onDismiss }) => {
  const [isResending, setIsResending] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const handleResendEmail = async () => {
    setIsResending(true);
    const result = await resendVerificationEmail();
    setIsResending(false);

    if (result.success) {
      toast.success('Verification email sent! Check your inbox.');
    } else {
      toast.error(result.message || 'Failed to send email. Try again later.');
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setTimeout(() => {
      if (onDismiss) onDismiss();
    }, 300);
  };

  return (
    <AnimatePresence>
      {!isDismissed && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-3 rounded-lg shadow-lg mb-4"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1">
              <Mail className="w-5 h-5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-sm">Verify your email</p>
                <p className="text-xs text-white/90">
                  We sent a verification email to <strong>{userEmail}</strong>.
                  Please check your inbox and click the link to verify your account.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleResendEmail}
                disabled={isResending}
                className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                {isResending ? 'Sending...' : 'Resend'}
              </button>
              <button
                onClick={handleDismiss}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EmailVerificationBanner;
