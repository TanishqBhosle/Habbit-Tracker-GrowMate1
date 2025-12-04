import { registerRootComponent } from 'expo';

import App from './App';
import { LogBox } from 'react-native';

// Suppress warnings from dependencies that we cannot fix directly
LogBox.ignoreLogs([
    'props.pointerEvents is deprecated',
    'Invalid DOM property `transform-origin`',
]);

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
