import React, { useState, useContext, useEffect, useMemo } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { Header, Icon, Button } from 'react-native-elements';
import { Share } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, ParamListBase } from '@react-navigation/native';
import { Store } from '../redux/Store';
import { HOST_URL } from '@env';

type RootStackParamList = {
  WebViewScreen: { id: string };
};

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'WebViewScreen'>;
  route: RouteProp<RootStackParamList, 'WebViewScreen'>;
};

const WebViewScreen = ({ navigation, route }: Props) => {
  const {
    state: { isEmulator },
    dispatch,
  }: any = useContext(Store);
  const { id } = route.params;

  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [urlPdf, setUrlPdf] = useState('');

  const firstPart = id?.substring(0, 8);

  const [contentType, setContentType] = useState('webpage');

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
      alert(error?.message || 'Something went wrong');
    }
  };

  useEffect(() => {
    if (isEmulator) {
      setUrl(`http://${HOST_URL}:3000/preview/${firstPart}`);
      setUrlPdf(`http://${HOST_URL}:3000/preview/doc/${firstPart}`);
    } else {
      setUrl(`https://www.trustwork.co/preview/${firstPart}`);
      setUrlPdf(`http://www.trustwork.co/preview/doc/${firstPart}`);
    }
    setIsLoading(false);
  }, []);

  return (
    <>
      {isLoading ? (
        ''
      ) : (
        <View style={{ flex: 1 }}>
          <View style={styles.headerContainer}>

            <View style={styles.buttonContainerHead}>
              <Button
                title="Webpage"
                onPress={() => setContentType('webpage')}
                type={contentType === 'webpage' ? 'solid' : 'outline'}
                buttonStyle={
                  contentType === 'webpage'
                    ? styles.activeButton
                    : styles.inactiveButton
                }
                titleStyle={
                  contentType === 'webpage'
                  ? styles.buttonTitle
                  : styles.inactiveButtonTitle
                }
              />
              <Button
                title="Preview PDF"
                onPress={() => setContentType('pdf')}
                type={contentType === 'pdf' ? 'solid' : 'outline'}
                buttonStyle={
                  contentType === 'pdf'
                    ? styles.activeButton
                    : styles.inactiveButton
                }
                titleStyle={
                  contentType === 'pdf'
                  ? styles.buttonTitle
                  : styles.inactiveButtonTitle
                
                }
              />
            </View>
          </View>
          {contentType === 'webpage' ? (
<WebView source={{ uri: url }} />
) : (
<WebView source={{ uri: urlPdf }} />
)}
<View style={styles.buttonContainer}>
<TouchableOpacity style={styles.shareButton} onPress={handleShare}>
<View style={styles.flexRow}>
<Text style={styles.buttonText}>ส่งเอกสารให้ลูค้า</Text>
<Icon
                 style={styles.icon}
                 name="send"
                 type="font-awesome"
                 size={22}
                 color="#ec7211"
               />
</View>
</TouchableOpacity>
</View>
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
marginBottom: 10,
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
inactiveButtonTitle:{
  color: '#e9f4f9',
  fontWeight: 'bold',
},
flexRow: {
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'center',

},
buttonText: {
color: '#ec7211',
fontSize: 16,
fontWeight: 'bold',
marginRight: 8,
},
icon: {
marginLeft: 10,
},
shareButton: {
backgroundColor: 'white',
paddingHorizontal: 30,
paddingVertical: 10,
borderRadius: 5,
borderWidth: 1,
borderColor: '#ec7211',
},
});

export default WebViewScreen;
