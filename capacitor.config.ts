/// <reference types="@capacitor/local-notifications" />
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'hissab-web',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#488AFF',
      sound: 'beep.wav',
    },
    BackgroundRunner: {
      label: 'com.example.background.task',
      src: 'background.js',
      event: 'myCustomEvent',
      repeat: true,
      interval: 2,
      autoStart: false,
    },
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
