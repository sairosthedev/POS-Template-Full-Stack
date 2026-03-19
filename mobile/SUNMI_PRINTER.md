# Sunmi Printer Integration

The POS app uses `services/printer.js` as the print abstraction. On **Expo Go** it falls back to PDF + Share. On **Sunmi V2 Pro** (or dev builds with the native module) it will use the Sunmi SDK.

## Adding the Native Module

1. **Create a React Native native module** (or use `react-native-sunmi-inner-printer` if compatible).
2. Expose these methods to JavaScript:
   - `printText(text: string)` – print a line
   - `cutPaper()` – cut receipt paper
3. Register the module as `SunmiPrinter` or `SunmiPrinterModule` in your native code.
4. `printer.js` will automatically detect and use it on Android.

## Current Behavior

- **Expo Go**: Generates HTML receipt → PDF → Share sheet
- **Sunmi build**: Calls `printText()` for each line, then `cutPaper()`
