import Constants from 'expo-constants';

function guessDevHostIp() {
  // Expo prints: exp://192.168.x.x:8082 and "debuggerHost": "192.168.x.x:8082"
  const hostUri =
    Constants?.expoGoConfig?.debuggerHost ||
    Constants?.expoConfig?.hostUri ||
    Constants?.manifest2?.extra?.expoGo?.debuggerHost ||
    Constants?.manifest?.debuggerHost ||
    null;

  if (typeof hostUri !== 'string') return null;
  const host = hostUri.replace(/^https?:\/\//, '').replace(/^exp:\/\//, '');
  const ip = host.split(':')[0];
  return ip || null;
}

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  (guessDevHostIp() ? `http://${guessDevHostIp()}:5000` : null) ||
  'http://localhost:5000';

