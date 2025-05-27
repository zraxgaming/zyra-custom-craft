
import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.9041d63f896f4ef3a8f061c9834d48df',
  appName: 'zyra-custom-craft',
  webDir: 'dist',
  server: {
    url: 'https://9041d63f-896f-4ef3-a8f0-61c9834d48df.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#8B5CF6',
      androidSplashResourceName: 'splash',
      showSpinner: false
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#8B5CF6'
    }
  }
};

export default config;
