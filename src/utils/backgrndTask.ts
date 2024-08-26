import ReactNativeForegroundService from "@supersami/rn-foreground-service";

export const startForegroundService = async () => {
    const notificationConfig = {
      id: 1244,
      title: 'FO Tracking',
      message: 'Background location being tracked',
      icon: 'ic_launcher',
      button: false,
      button2: false,
      buttonText: 'Button',
      button2Text: 'Anther Button',
      buttonOnPress: 'cray',
      setOnlyAlertOnce: 'true',
      color: '#000000',
    };
    try {
      await ReactNativeForegroundService.start(notificationConfig);
    } catch (e) {
      console.error('>>>>>>>>>>>>>> error: ', e);
    }
  };

  export const stopForegroundService = async () => {
    try {
      await ReactNativeForegroundService.stopAll();
    } catch (e) {
      console.error('>>>>>>>>>>>>>> error: ', e);
    }
  };