import { NativeModules, Platform } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

function getSunmiModule() {
  return NativeModules?.SunmiPrinter || NativeModules?.SunmiPrinterModule || null;
}

/**
 * Expo Go fallback: generates a PDF and opens Share sheet.
 * Sunmi build: if a native module is available, you can implement
 * printText/printColumnsText/etc and this will call it.
 */
export async function printReceipt({ html, textLines } = {}) {
  const sunmi = getSunmiModule();

  if (Platform.OS === 'android' && sunmi && typeof sunmi.printText === 'function') {
    // Minimal integration point. Your native module can implement richer APIs later.
    const lines = Array.isArray(textLines) ? textLines : [];
    for (const line of lines) {
      // eslint-disable-next-line no-await-in-loop
      await sunmi.printText(String(line));
    }
    if (typeof sunmi.cutPaper === 'function') {
      await sunmi.cutPaper();
    }
    return { mode: 'sunmi' };
  }

  if (html) {
    const file = await Print.printToFileAsync({ html });
    const canShare = await Sharing.isAvailableAsync();
    if (canShare) await Sharing.shareAsync(file.uri, { mimeType: 'application/pdf' });
    return { mode: 'share' };
  }

  return { mode: 'noop' };
}

