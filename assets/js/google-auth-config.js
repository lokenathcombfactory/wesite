/**
 * Google Authentication Configuration for Loke Nath Comb Factory
 * 
 * INSTRUCTIONS FOR USER / OWNER:
 * -------------------------------------------------------------------
 * Update 'GOOGLE_CLIENT_ID' below with your OAuth 2.0 Client ID from Google Cloud Console.
 * 
 * Steps to obtain Google Client ID:
 * 1. Go to Google Cloud Console: https://console.cloud.google.com/
 * 2. Create a new project or select an existing project.
 * 3. Go to "APIs & Services" > "Credentials".
 * 4. Click "Create Credentials" > "OAuth client ID".
 * 5. Select Application Type: "Web application".
 * 6. Add your site domain(s) under "Authorized JavaScript origins" (e.g. http://localhost, https://yourwebsite.com).
 * 7. Copy the generated Client ID and replace 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com' below.
 */

const GOOGLE_AUTH_CONFIG = {
  // Replace this placeholder string with your real Google Client ID
  GOOGLE_CLIENT_ID: "418896055686-3dar2pttkn364m8g9b1ttoupscctauk1.apps.googleusercontent.com",

  // Enable Google One Tap prompt overlay automatically
  ENABLE_ONE_TAP: true,

  // Auto-fill form fields upon successful sign in
  AUTO_FILL_FORMS: true
};
