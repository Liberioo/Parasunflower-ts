# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies
   - NEEDS TO BE RUN ON JDK 17
   - Needs Android SDK via Android Studio -> SDK Manager -> Android 14.0 -> Show Package Details -> Make sure Google APIs Intel x86_64 Atom System Image is selected
   - ANDROID_HOME and JAVA_HOME environment variables need to be set
   ```bash
   npm install expo
   ```

2. Start the app
   - Android device with developer mode and USB debugging enabled connected via USB
   ```bash
    npx expo prebuild
    npx expo run:android
   ```
   Then just press a to build local development build on android device

