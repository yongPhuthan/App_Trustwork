import React, {useState, useContext, useEffect, useMemo} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {WebView} from 'react-native-webview';
import {Header, Icon, Button} from 'react-native-elements';
import {Share} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp, ParamListBase} from '@react-navigation/native';
import {Store} from '../redux/Store';
import {HOST_URL} from '@env';
import {FAB} from 'react-native-paper';

type RootStackParamList = {
  WebViewScreen: {id: string};
  RootTab: undefined
};

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'WebViewScreen'>;
  route: RouteProp<RootStackParamList, 'WebViewScreen'>;
};

const WebViewScreen = ({navigation, route}: Props) => {
  const {
    state: {isEmulator},
    dispatch,
  }: any = useContext(Store);
  const {id} = route.params;

  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [urlPdf, setUrlPdf] = useState('');

  const firstPart = id?.substring(0, 8);

  const [contentType, setContentType] = useState('webpage');
const backHome =()=>{
  navigation.navigate('RootTab')
}
  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: url,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error || 'Something went wrong');
    }
  };

  useEffect(() => {
    if (isEmulator) {
      setUrl(`http://${HOST_URL}:3000/preview/qt/${id}`);
      setUrlPdf(`http://${HOST_URL}:3000/preview/doc/${id}`);
    } else {
      setUrl(`https://www.trustwork.co/preview/qt/${id}`);
      setUrlPdf(`http://www.trustwork.co/preview/doc/${id}`);
    }
    setIsLoading(false);
  }, []);
  console.log('path', id);
  console.log('url', url);

  return (
    <>
      {isLoading ? (
        ''
      ) : (
        <View style={{flex: 1}}>
          {contentType === 'webpage' ? (
            <WebView source={{uri: url}} />
          ) : (
            <WebView source={{uri: urlPdf}} />
          )}
          <View style={styles.buttonRow}>
          <Button 
              buttonStyle={styles.homeButtonWhite}
              title="กลับหน้าแรก"
              onPress={backHome}
              titleStyle={styles.buttonHomeText}
              icon={<Icon name="home" type="font-awesome" size={20} color="black" />}
              iconPosition='left'
            />
            <Button 
              buttonStyle={styles.button} 
              onPress={handleShare}
              title="ส่งให้ลูกค้า"
              titleStyle={styles.buttonText}
              icon={<Icon name="send" type="font-awesome" size={22} color="white" />}
              iconRight
            />
          </View>
          {/* <FAB
          style={styles.fab}
          small
          icon="share-variant"
          onPress={handleShare}
        /> */}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#0c5caa',
    paddingBottom: 10,
  },
  header: {
    backgroundColor: '#0c5caa',
    borderBottomWidth: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,

    paddingVertical: 10,
    backgroundColor: 'white', // Light neutral background color
  },

  icon: {
    marginLeft: 10,
    color: '#FF6347', // Vivid icon color
  },

  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 50,
    backgroundColor: '#ec7211',
  },
  buttonContainerHead: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  activeButton: {
    backgroundColor: 'white',
    borderColor: '#fff3db',
    paddingHorizontal: 30,
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 5,
  },
  inactiveButton: {
    backgroundColor: '#0c5caa',

    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  buttonTitle: {
    color: 'black',
    fontWeight: 'bold',
  },
  inactiveButtonTitle: {
    color: '#e9f4f9',
    fontWeight: 'bold',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonRow: {
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    alignSelf: 'center',
    height: 70,
    backgroundColor: 'white',

  },
  homeButton: {
    backgroundColor: '#0c5caa',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 5,
    width:200,
    elevation: 2, // for Android
    shadowColor: '#000', // for iOS
    shadowOffset: {width: 0, height: 2}, // for iOS
    shadowOpacity: 0.25, // for iOS
    shadowRadius: 3.84, // for iOS
  },
  shareButton: {
    backgroundColor: '#0c5caa',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 5,
    elevation: 2, // for Android
    shadowColor: '#000', // for iOS
    shadowOffset: {width: 0, height: 2}, // for iOS
    shadowOpacity: 0.25, // for iOS
    shadowRadius: 3.84, // for iOS
  },
  button: {
    backgroundColor: '#0c5caa',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 5,
    elevation: 2, // for Android
    shadowColor: '#000', // for iOS
    shadowOffset: {width: 0, height: 2}, // for iOS
    shadowOpacity: 0.25, // for iOS
    shadowRadius: 3.84, // for iOS
  },
homeButtonWhite: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 5,
    borderWidth:0.5,
    elevation: 2, // for Android
    shadowColor: '#000', // for iOS
    shadowOffset: {width: 0, height: 2}, // for iOS
    shadowOpacity: 0.25, // for iOS
    shadowRadius: 3.84, // for iOS
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
    color:'white'
  },
  buttonHomeText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    color:'black'
  },

});

export default WebViewScreen;
