# Capacitor Camera & Barcode Scanner Setup Guide

This guide explains how to set up camera functionality for the Nutrio app's barcode scanning feature.

## Overview

The barcode scanner currently uses a **placeholder implementation**. To enable actual camera-based barcode scanning, you need to install Capacitor plugins.

## Prerequisites

- Capacitor project initialized (already done)
- Xcode installed (for iOS)
- Android Studio installed (for Android)
- Node.js and npm

## Installation Steps

### 1. Install Required Plugins

```bash
# Install Capacitor Camera plugin
npm install @capacitor/camera

# Install Barcode Scanner community plugin
npm install @capacitor-community/barcode-scanner

# Sync with native projects
npx cap sync
```

### 2. iOS Configuration

#### Update Info.plist

Add the following entries to `ios/App/App/Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>We need access to your camera to scan food barcodes and analyze meals</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>We need access to your photo library to analyze meal photos</string>

<key>NSPhotoLibraryAddUsageDescription</key>
<string>We need permission to save analyzed meal photos to your library</string>
```

#### Build Settings

1. Open `ios/App/App.xcworkspace` in Xcode
2. Select your target and go to **Build Settings**
3. Search for "Swift Language Version"
4. Ensure it's set to **Swift 5** or later

### 3. Android Configuration

#### Update AndroidManifest.xml

Add camera permissions to `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest>
    <!-- Camera permissions -->
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-feature android:name="android.hardware.camera" android:required="false" />
    <uses-feature android:name="android.hardware.camera.autofocus" android:required="false" />

    <!-- Photo library permissions -->
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="32" />
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />

    <application>
        <!-- Your existing application config -->
    </application>
</manifest>
```

#### Update build.gradle

Ensure minimum SDK version in `android/app/build.gradle`:

```gradle
android {
    defaultConfig {
        minSdkVersion 22  // Minimum required
        targetSdkVersion 33
    }
}
```

## 4. Update BarcodeScanner Component

Once the plugins are installed, update `src/pages/BarcodeScanner.jsx`:

### Uncomment the Real Implementation

Replace the placeholder `startScanning` function (lines 48-94) with the real implementation:

```javascript
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

const startScanning = async () => {
  try {
    // Check camera permission
    const status = await BarcodeScanner.checkPermission({ force: true });

    if (!status.granted) {
      toast.error('Camera permission denied');
      return;
    }

    // Hide webview to show camera
    document.body.classList.add('scanner-active');
    BarcodeScanner.hideBackground();

    setIsScanning(true);

    // Start scanning
    const result = await BarcodeScanner.startScan();

    if (result.hasContent) {
      handleBarcodeScanned(result.content);
    }

    setIsScanning(false);
    BarcodeScanner.showBackground();
    document.body.classList.remove('scanner-active');

  } catch (error) {
    console.error('Scanning error:', error);
    toast.error('Failed to start camera');
    setIsScanning(false);
    BarcodeScanner.showBackground();
    document.body.classList.remove('scanner-active');
  }
};

const stopScanning = () => {
  setIsScanning(false);
  BarcodeScanner.stopScan();
  BarcodeScanner.showBackground();
  document.body.classList.remove('scanner-active');
};
```

### Add CSS for Scanner

Add to `src/index.css`:

```css
.scanner-active {
  visibility: hidden;
  --background: transparent;
  --ion-background-color: transparent;
}

.scanner-active .barcode-scanner-modal {
  visibility: visible;
}
```

## 5. Testing

### Test on iOS Simulator

```bash
# Build and run on iOS
npm run build
npx cap copy ios
npx cap open ios
```

Then run from Xcode on a **real device** (camera doesn't work in simulator).

### Test on Android Emulator

```bash
# Build and run on Android
npm run build
npx cap copy android
npx cap open android
```

Run from Android Studio on a **real device** or emulator with camera support.

## 6. Handling Permissions

The app will automatically request camera permissions when the user first tries to scan. Handle permission denials gracefully:

```javascript
const checkCameraPermission = async () => {
  const { camera } = await BarcodeScanner.checkPermission({ force: false });

  if (camera === 'granted') {
    return true;
  } else if (camera === 'denied') {
    toast.error('Camera permission is required to scan barcodes');
    return false;
  } else {
    // Prompt user
    const { camera: newStatus } = await BarcodeScanner.checkPermission({ force: true });
    return newStatus === 'granted';
  }
};
```

## 7. Supported Barcode Formats

The `@capacitor-community/barcode-scanner` supports:

- **EAN-8** and **EAN-13** (most common for food products)
- **UPC-A** and **UPC-E**
- **Code 39**, **Code 93**, **Code 128**
- **QR Code**
- **Data Matrix**
- **Aztec**
- **PDF417**

## 8. Troubleshooting

### iOS Issues

**Problem:** "No camera available"
- **Solution:** Test on a real device, not simulator

**Problem:** Permission dialog not showing
- **Solution:** Check Info.plist has correct usage descriptions

**Problem:** Black screen when scanning
- **Solution:** Ensure `BarcodeScanner.hideBackground()` is called

### Android Issues

**Problem:** "Camera permission denied"
- **Solution:** Ensure AndroidManifest.xml has camera permissions

**Problem:** App crashes when scanning
- **Solution:** Check minimum SDK version is 22+

**Problem:** Camera preview rotated incorrectly
- **Solution:** Add `android:screenOrientation="portrait"` to Activity in manifest

## 9. Alternative: Web-based Fallback

For web/PWA version without native camera access, use `html5-qrcode`:

```bash
npm install html5-qrcode
```

```javascript
import { Html5QrcodeScanner } from 'html5-qrcode';

const scanner = new Html5QrcodeScanner(
  "reader",
  { fps: 10, qrbox: { width: 250, height: 250 } },
  false
);

scanner.render(
  (decodedText) => handleBarcodeScanned(decodedText),
  (error) => console.warn(error)
);
```

## 10. Production Considerations

### Performance

- Camera can drain battery quickly - remind users to close scanner when done
- Implement auto-stop after 30 seconds of inactivity
- Add haptic feedback on successful scan

### Privacy

- Add clear messaging about camera usage
- Never store or upload camera images
- Respect camera permissions on all platforms

### Error Handling

Always handle these scenarios:
- Camera permission denied
- No camera available (desktop browsers)
- Invalid/unrecognized barcodes
- Network errors when fetching product data
- Slow Open Food Facts API responses

## Next Steps

1. Install plugins: `npm install @capacitor/camera @capacitor-community/barcode-scanner`
2. Sync native projects: `npx cap sync`
3. Configure iOS Info.plist
4. Configure Android AndroidManifest.xml
5. Update BarcodeScanner.jsx with real implementation
6. Test on real devices (iOS & Android)
7. Add error handling and user feedback

## Resources

- [Capacitor Camera Docs](https://capacitorjs.com/docs/apis/camera)
- [Barcode Scanner Plugin](https://github.com/capacitor-community/barcode-scanner)
- [Open Food Facts API](https://world.openfoodfacts.org/data)
- [Capacitor iOS Setup](https://capacitorjs.com/docs/ios)
- [Capacitor Android Setup](https://capacitorjs.com/docs/android)

## Support

If you encounter issues:
1. Check plugin GitHub issues
2. Verify native project configurations
3. Test on real devices (not simulators)
4. Check Capacitor version compatibility

---

**Note:** The barcode scanner feature will work with manual entry until the camera plugins are installed. Users can still type barcodes manually to use the feature.
