import { NativeModules } from 'react-native';

/**
 * Miccs POS Sunmi Printer Bridge
 * This file maps the Javascript interface to the native Android Java bridge for the Sunmi SDK.
 */

const { SunmiPrinter } = NativeModules;

export default {
  /**
   * Print standard text
   * @param {string} text 
   */
  printText: (text) => {
    if (SunmiPrinter) {
      SunmiPrinter.printText(text);
    } else {
      console.log(`[Mock Printer] Text: ${text}`);
    }
  },

  /**
   * Print formatted columns (Item | Price)
   */
  printColumnsText: (textArray, widthArray, alignArray) => {
    if (SunmiPrinter) {
      SunmiPrinter.printColumnsText(textArray, widthArray, alignArray);
    } else {
      console.log(`[Mock Printer Column] ${textArray.join('    ')}`);
    }
  },

  /**
   * Trigger auto-cutter (for compatible models)
   */
  cutPaper: () => {
    if (SunmiPrinter) {
      SunmiPrinter.cutPaper();
    } else {
      console.log(`[Mock Printer] -- CUT PAPER --`);
    }
  }
};
