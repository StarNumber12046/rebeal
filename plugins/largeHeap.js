const { withAndroidManifest } = require("@expo/config-plugins");

module.exports = function androidManifestPlugin(config) {
  return withAndroidManifest(config, async (config) => {
    let androidManifest = config.modResults.manifest;
    console.log("Adding android:largeHeap...");
    androidManifest.application[0].$["android:largeHeap"] = "true";
    console.log("Updated manifest!");

    return config;
  });
};
