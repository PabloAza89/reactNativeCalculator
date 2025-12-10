//import 'react-native-gesture-handler';
//import { enableScreens } from 'react-native-screens';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

//enableScreens();

import { addListener, startListener, stopListener } from './layoutListener';

//startListener()

AppRegistry.registerComponent(appName, () => App);