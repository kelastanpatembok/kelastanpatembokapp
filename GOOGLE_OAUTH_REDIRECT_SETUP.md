# Google OAuth Redirect URI Setup

## The Problem

You're seeing this error:
```
Error 400: invalid_request
redirect_uri=exp://192.168.31.104:8081/--/oauth
```

This happens because Google OAuth requires the redirect URI to be registered in Google Cloud Console.

## Solution: Use Expo's Proxy Service

When using `expo-auth-session` with `useProxy: true`, Expo uses `https://auth.expo.io` as a proxy. This redirect URI is already registered and works automatically.

## Step 1: Verify Your Code

Make sure your code uses `useProxy: true`:

```typescript
const redirectUri = AuthSession.makeRedirectUri({
  useProxy: true,
});

const result = await request.promptAsync(discovery, {
  useProxy: true,
  showInRecents: true,
});
```

## Step 2: Add Redirect URI to Google Cloud Console

**Important:** Google OAuth for Web applications only accepts HTTP/HTTPS URLs, NOT custom URL schemes like `exp://`. You must use Expo's proxy URL.

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** → **Credentials**
4. Click on your **OAuth 2.0 Client ID** (Web application)
5. Under **Authorized redirect URIs**, add:
   
   ```
   https://auth.expo.io/@anonymous/kelastanpatembokapp
   ```
   
   **OR** use wildcard (if supported):
   ```
   https://auth.expo.io/*
   ```

6. Click **Save**

**Note:** Do NOT add `exp://` URLs - Google will reject them. The code is configured to use the HTTPS proxy URL automatically.

## Step 3: Alternative - Use Custom Redirect URI

If you prefer not to use Expo's proxy, you can use a custom redirect URI:

### Option A: Use Your App Scheme

1. In your code, use:
```typescript
const redirectUri = AuthSession.makeRedirectUri({
  scheme: 'kelastanpatembok',
  path: 'oauth',
});
```

2. In Google Cloud Console, add:
```
kelastanpatembok://oauth
```

### Option B: Use HTTP/HTTPS Redirect (For Development)

1. In your code:
```typescript
const redirectUri = 'https://your-domain.com/oauth/callback';
```

2. In Google Cloud Console, add the same URI

## Current Implementation

The current code uses Expo's proxy service (`useProxy: true`), which should work automatically. The redirect URI will be:
```
https://auth.expo.io/@anonymous/kelastanpatembokapp
```

If you're still getting errors, try:

1. **Check the console logs** - The redirect URI will be logged
2. **Add that exact URI** to Google Cloud Console
3. **Wait a few minutes** for changes to propagate
4. **Clear browser cache** and try again

## Testing

After adding the redirect URI:
1. Wait 2-3 minutes for Google to update
2. Restart your Expo app
3. Try Google Sign-In again

## Troubleshooting

### Still getting "invalid_request"?
- Check that the redirect URI in the error matches exactly what you added in Google Cloud Console
- Make sure there are no trailing slashes or extra characters
- Verify you're editing the correct OAuth client (Web application type)

### "redirect_uri_mismatch"?
- The redirect URI in your code must match exactly what's in Google Cloud Console
- Check for typos, case sensitivity, and protocol (http vs https)

### Works in development but not production?
- You'll need to add production redirect URIs separately
- For production builds, use your app's actual scheme or a custom domain

