import androidManifestPlugin from "./plugins/largeHeap"; // Import the plugin

export default {
  expo: {
    name: "rebeal",
    slug: "rebeal",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/adaptive-icon.png",
    scheme: "rebeal",
    extra: {
      assets: ["./assets/sounds/notification.wav"],
    },
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/adaptive-icon.png",
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
      appName: "ReBeal.",
      googleServicesFile: "./google-services.json",
      package: "com.rebeal",
      config: {
        googleServicesFile: "./google-services.json",
      },
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      androidManifestPlugin, // Register the custom plugin here
      "expo-router",
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
            buildProperties: {},
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
