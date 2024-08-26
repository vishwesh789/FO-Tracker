import AsyncStorage from '@react-native-async-storage/async-storage';
export const saveClockStatus = async (status: boolean): Promise<void> => {
  try {
    await AsyncStorage.setItem('clockStatus', JSON.stringify(status));
  } catch (error) {
    console.error(error);
  }
};

export const getClockStatus = async (): Promise<boolean | null> => {
  try {
    const clockStatus = await AsyncStorage.getItem('clockStatus');
    return clockStatus ? JSON.parse(clockStatus) : null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
