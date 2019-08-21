cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "com.virtuoworks.cordova-plugin-canvascamera.CanvasCamera",
      "file": "plugins/com.virtuoworks.cordova-plugin-canvascamera/www/CanvasCamera.js",
      "pluginId": "com.virtuoworks.cordova-plugin-canvascamera",
      "clobbers": [
        "plugin.CanvasCamera",
        "CanvasCamera"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-whitelist": "1.3.4",
    "com.virtuoworks.cordova-plugin-canvascamera": "1.1.9"
  };
});