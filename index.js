/**
 * @format
 */

import {AppRegistry, StyleSheet} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import store from './redux/Store';
import {StoreProvider} from './redux/Store';
import 'react-native-get-random-values';
import {ThemeProvider, Header, Icon, Button} from 'react-native-elements';

const theme = {
  colors: {
    primary: '#16325c',
    secondary: '#f7f7f7',
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    grey0: '#f7f7f7',
    grey1: '#e8e8e8',
    grey2: '#d2d2d2',
    grey3: '#bdbdbd',
    grey4: '#9e9e9e',
    grey5: '#757575',
    greyOutline: '#bbb',
    searchBg: '#303337',
    divider: '#e5e5e5',
    platform: {
      ios: {
        primary: '#007aff',
        secondary: '#ff3b30',
        success: '#4cd964',
        error: '#ff2d55',
        warning: '#ffcc00',
      },
      android: {
        primary: '#2196f3',
        secondary: '#e91e63',
        success: '#4caf50',
        error: '#f44336',
        warning: '#ff9800',
      },
    },
  },
  Header: {
    containerStyle: {
      backgroundColor: '#16325c',
      justifyContent: 'space-around',
      borderBottomColor: '#f7f7f7',
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    centerComponent: {
      style: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
      },
    },
  },
  Button: {
    containerStyle: {
      marginHorizontal: 10,
      marginVertical: 5,
    },
  },
};
const Root = () => (
  <ThemeProvider theme={theme}>
    <StoreProvider>
      <App />
    </StoreProvider>
  </ThemeProvider>
);
AppRegistry.registerComponent(appName, () => Root);
