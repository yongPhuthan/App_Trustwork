/**
 * @format
 */

import {AppRegistry, StyleSheet} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import store from './redux/Store';
import {StoreProvider} from './redux/Store';


// const appName = "Trustwork";
const Root = () => (

    <StoreProvider>
      <App />
    </StoreProvider>

);
AppRegistry.registerComponent(appName, () => Root);
