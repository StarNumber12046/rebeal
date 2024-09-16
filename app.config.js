import { defineConfig } from "expo-build-properties";

export default {
  expo: {
    name: "rebeal",
    slug: "rebeal",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "rebeal",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#000000",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.rebeal",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#000000",
      },
      googleServicesFile: "./google-services.json",
      package: "com.rebeal",
      config: {
        googleServicesFile: "./google-services.json",
      },
      manifest: {
        metaData: [
          {
            "android:name": "com.google.android.gms.vision.DEPENDENCIES",
            "android:value": "barcode",
            "tools:replace": "android:value",
            tools: {
              replace: "android:value",
            },
          },
        ],
      },
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-notifications",
        {
          icon: "./assets/images/icon.png",
          defaultChannel: "default",
          sounds: ["./assets/sounds/notification.wav"],
        },
      ],
      "@react-native-firebase/app",
      "@react-native-firebase/messaging",
      [
        "expo-build-properties",
        {
          ios: {
            buildProperties: {
              "app.build.version": `1.0.0`,
            },
          },
          android: {
            buildProperties: {
              // Additional Android build properties if needed
            },
          },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: "9a24b32b-fac3-49b4-8a53-de227d25d1b2",
      },
    },
  },
};
