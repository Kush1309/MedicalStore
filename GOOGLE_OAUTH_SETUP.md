# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for your Medical Store application.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Enter a project name (e.g., "Medical Store Auth")
5. Click "Create"

## Step 2: Enable Google+ API

1. In your project, go to "APIs & Services" > "Library"
2. Search for "Google+ API"
3. Click on it and press "Enable"

## Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Select "External" user type
3. Click "Create"
4. Fill in the required fields:
   - **App name**: Medical Store
   - **User support email**: Your email
   - **Developer contact information**: Your email
5. Click "Save and Continue"
6. On the "Scopes" page, click "Save and Continue" (no need to add scopes)
7. On the "Test users" page, add your Gmail address as a test user
8. Click "Save and Continue"
9. Review and click "Back to Dashboard"

## Step 4: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Select "Web application" as the application type
4. Enter a name (e.g., "Medical Store Web Client")
5. Under "Authorized JavaScript origins", add:
   ```
   http://localhost:5000
   ```
6. Under "Authorized redirect URIs", add:
   ```
   http://localhost:5000/api/auth/google/callback
   ```
7. Click "Create"
8. **IMPORTANT**: Copy your Client ID and Client Secret

## Step 5: Update Your .env File

1. Open `backend/.env` file
2. Replace the placeholder values with your actual credentials:
   ```env
   GOOGLE_CLIENT_ID=your-actual-client-id-here
   GOOGLE_CLIENT_SECRET=your-actual-client-secret-here
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
   ```

## Step 6: Restart Your Server

1. Stop your backend server (Ctrl+C)
2. Restart it:
   ```bash
   cd backend
   npm start
   ```

## Step 7: Test Google Login

1. Open your application at `http://localhost:5000`
2. Click "Login" button
3. Click "Continue with Google"
4. A popup will open asking you to sign in with Google
5. Select your Google account
6. Grant permissions
7. You should be redirected back and logged in!

## Troubleshooting

### "Access blocked: This app's request is invalid"
- Make sure you added your email as a test user in the OAuth consent screen
- Verify the redirect URI matches exactly in Google Cloud Console

### "Popup blocked"
- Allow popups for localhost in your browser settings

### "Invalid credentials"
- Double-check your Client ID and Client Secret in the .env file
- Make sure there are no extra spaces or quotes

### "Redirect URI mismatch"
- Ensure the callback URL in .env matches the one in Google Cloud Console
- Both should be: `http://localhost:5000/api/auth/google/callback`

## Production Deployment

When deploying to production:

1. Add your production domain to "Authorized JavaScript origins":
   ```
   https://yourdomain.com
   ```

2. Add your production callback URL to "Authorized redirect URIs":
   ```
   https://yourdomain.com/api/auth/google/callback
   ```

3. Update your .env file with the production callback URL:
   ```env
   GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback
   ```

4. Change OAuth consent screen from "Testing" to "In Production" (requires verification for public apps)

## How It Works

1. User clicks "Continue with Google"
2. A popup opens to Google's OAuth page
3. User signs in and grants permissions
4. Google redirects to your callback URL with an authorization code
5. Your backend exchanges the code for user information
6. A new user is created (or existing user is found)
7. A JWT token is generated and sent to the frontend
8. User is logged in and can use the application

## Security Notes

- Never commit your `.env` file to version control
- Keep your Client Secret secure
- Use HTTPS in production
- Regularly rotate your credentials
- Monitor OAuth usage in Google Cloud Console
