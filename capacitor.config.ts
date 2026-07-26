import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  // appId is baked into the store listing and is painful to change after the first
  // publish. Adjust before shipping if this is not the bundle id you want.
  appId: 'com.techeveryday.oddoneout',
  // appName is never displayed anywhere itself: its only job is seeding native labels
  // when `cap add` scaffolds a platform, and every label it seeds is a home-screen one
  // that truncates past ~12 chars. "Odd One Out" fits, so the full name is safe here.
  appName: 'Odd One Out',
  webDir: 'dist',
  ios: {
    // The shell pads for safe areas itself via env(); letting the web view own the
    // full screen is what makes those insets non-zero.
    contentInset: 'never',
    backgroundColor: '#101418',
  },
  android: {
    backgroundColor: '#101418',
  },
  server: {
    // A party game runs offline: everything is bundled, nothing is fetched.
    androidScheme: 'https',
  },
}

export default config
