import { registerRootComponent } from 'expo';

import Constants from "expo-constants";

// Only register on native builds, not in Expo Go cos of compatibility issues
if (Constants.appOwnership !== "expo") {
  const TrackPlayer = require("react-native-track-player").default;
  TrackPlayer.registerPlaybackService(
    () => require("./src/lib/trackPlayerService").default
  );
}

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
