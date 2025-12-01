# Gemini API Smart Failover

## Overview

Nutrio includes **Smart Failover** for Gemini API keys, allowing you to configure up to **8 API keys** from different Google accounts for automatic backup and massive capacity scaling.

**Current Model**: `gemini-2.5-flash-lite` (optimized for speed & high daily limits)

## How It Works

### Basic Flow

```
User makes AI request
    ↓
Try Primary Key (KEY_1)
    ↓
[SUCCESS] → Return result ✅
    ↓
[RATE LIMITED] → Mark KEY_1 as "cooling down" (24 hours)
    ↓
Try Backup Key (KEY_2)
    ↓
[SUCCESS] → Return result ✅
    ↓
... continues through KEY_3, KEY_4, ... KEY_8
    ↓
[ALL 8 KEYS EXHAUSTED] → Show error to user ❌
```

### Key Features

- **8-Key Support**: Configure up to 8 API keys for 8x capacity
- **Automatic Failover**: Switches to next key when rate limits hit
- **24-Hour Cooldown**: Rate-limited keys auto-recover after daily limit resets
- **Transparent**: Users never see errors unless all 8 keys are exhausted
- **Console Logging**: Detailed logs show which key is active and failover events

## Setup Instructions

### 1. Get Your API Keys

Visit [Google AI Studio](https://aistudio.google.com) and create **1-8 free API keys**.

> **IMPORTANT**: Use **DIFFERENT Google accounts** for each key to get true 8x capacity!
> Keys from the same account share rate limits.

### 2. Configure Your `.env` File

```env
# REQUIRED: Primary key
VITE_GEMINI_API_KEY=AIzaSyC...your_first_key

# OPTIONAL: Backup keys (use different Google accounts!)
VITE_GEMINI_API_KEY_2=AIzaSyC...your_second_key
VITE_GEMINI_API_KEY_3=AIzaSyC...your_third_key
VITE_GEMINI_API_KEY_4=AIzaSyC...your_fourth_key
VITE_GEMINI_API_KEY_5=AIzaSyC...your_fifth_key
VITE_GEMINI_API_KEY_6=AIzaSyC...your_sixth_key
VITE_GEMINI_API_KEY_7=AIzaSyC...your_seventh_key
VITE_GEMINI_API_KEY_8=AIzaSyC...your_eighth_key
```

Configure as many keys as you want:
- **1 key**: 1,000 req/day
- **2 keys**: 2,000 req/day
- **4 keys**: 4,000 req/day
- **8 keys**: 8,000 req/day 🚀

### 3. Start Your App

```bash
npm run dev
```

Open browser console (F12) and verify:
```
[Gemini] Initialized with 8 API key(s)
```

---

## Capacity & Limits

### Current Model: gemini-2.5-flash-lite

Per Key (FREE Tier - 2025):
- **15 requests/minute** (RPM)
- **1,000 requests/day** (RPD) ⭐
- **250,000 tokens/minute** (TPM)

### Total Capacity with Multiple Keys

| Keys | Daily Requests | Effective RPM |
|------|----------------|---------------|
| 1 key | 1,000/day | 15 RPM |
| 2 keys | 2,000/day | 30 RPM |
| 4 keys | 4,000/day | 60 RPM |
| **8 keys** | **8,000/day** | **120 RPM** |

> **Why Flash-Lite?** It has **4x higher daily limits** than regular Flash (1,000 vs 250 req/day)

---

## Console Output Examples

### Normal Operation
```
[Gemini] Initialized with 8 API key(s)
[Gemini] Using API key 1
```

### Failover in Action
```
[Gemini] Using API key 1
[Gemini] ⚠️ Key 1 rate limited. Cooldown until 11:30 PM
[Gemini] Rate limit hit on key 1, trying next key...
[Gemini] Using API key 2
```

### Heavy Usage Day
```
[Gemini] Using API key 5
[Gemini] Key 1 in cooldown (847 min remaining)
[Gemini] Key 2 in cooldown (623 min remaining)
[Gemini] Key 3 in cooldown (445 min remaining)
[Gemini] Key 4 in cooldown (287 min remaining)
```

### All Keys Exhausted (8,000+ requests in one day!)
```
[Gemini] All API keys exhausted
User sees: "All 8 API keys are rate limited. Please try again in 24 hours."
```

---

## Monitoring Key Status

Check key availability programmatically:

```javascript
import { getGeminiStatus } from './services/geminiService';

const status = getGeminiStatus();
console.log(status);
/*
{
  totalKeys: 8,
  availableKeys: 5,     // 5 keys still working
  configured: true,
  allRateLimited: false
}
*/
```

---

## FAQ

### Do I need 8 different Google accounts?

**YES!** For true 8x capacity, each key must be from a **different Google account**.
Rate limits are per Google Cloud project, not per API key.

### Is this against Google's terms of service?

**No!** Using multiple free-tier accounts for load distribution is legitimate.
You're not bypassing limits maliciously - just using multiple valid free accounts.

### Can I use fewer than 8 keys?

**Absolutely!** The system works with 1-8 keys. Just configure as many as you need:
- Hobby project? → 1-2 keys
- Production app? → 4-8 keys

### What happens if I restart my app during cooldown?

**Cooldowns reset** - state is stored in memory. After restart, all keys become available again.
This is intentional for simplicity. For persistent cooldowns, you'd need to store state in localStorage or a database.

### Why gemini-2.5-flash-lite instead of regular Flash?

**4x higher daily limit!**
- Flash: 250 requests/day
- Flash-Lite: **1,000 requests/day** ✅

With 8 keys: 8,000 vs 2,000 req/day - huge difference!

### Can I add more than 8 keys?

**Yes!** Just edit `src/services/geminiService.js`:

```javascript
this.keys = [
  import.meta.env.VITE_GEMINI_API_KEY,
  // ... existing keys ...
  import.meta.env.VITE_GEMINI_API_KEY_9,
  import.meta.env.VITE_GEMINI_API_KEY_10,
];
```

And add the env variables to `.env`.

### Will this cost me money?

**No!** All keys use Google's **100% FREE tier**. Zero cost.

---

## Real-World Usage Example

```
Monday - Growing app with 6,000 requests:

08:00 - KEY_1 starts handling requests
11:00 - KEY_1 hits 1,000 limit → switches to KEY_2
14:00 - KEY_2 hits limit → switches to KEY_3
17:00 - KEY_3 hits limit → switches to KEY_4
20:00 - KEY_4 hits limit → switches to KEY_5
22:00 - KEY_5 hits limit → switches to KEY_6
23:00 - 6,000 total requests ✅ Still have KEY_7 & KEY_8 as backup!

Users experienced ZERO downtime 🎉
```

---

## Troubleshooting

### Keys not loading?

1. Check console for initialization message
2. Verify `.env` file has actual API keys (not placeholder values)
3. Restart dev server after changing `.env`

### Still hitting rate limits?

- Verify you're using **different Google accounts** for each key
- Check console logs to see which keys are in cooldown
- Consider upgrading to Gemini Pro paid tier for unlimited requests

### Want persistent cooldown tracking?

The current implementation stores cooldowns in memory. For production apps with long uptimes, consider:
- Storing cooldown state in `localStorage`
- Using a backend database
- Implementing server-side key rotation

---

## Implementation Files

- **Smart Failover Logic**: `src/services/geminiService.js`
- **Environment Config**: `.env.example`
- **Documentation**: `GEMINI_FAILOVER.md` (this file)

---

## Benefits Summary

✅ **8,000 requests/day** with 8 keys (vs 1,000 with 1 key)
✅ **Automatic Recovery** - no manual intervention when keys exhaust
✅ **Zero Downtime** - users experience uninterrupted service
✅ **100% Free** - all keys use Google's free tier
✅ **Production Ready** - handles edge cases and errors gracefully
✅ **Easy Setup** - just add keys to `.env` and restart

---

**Questions?** Check console logs or review `src/services/geminiService.js` for implementation details.
