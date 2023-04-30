import React, { useState, useContext, useEffect, useMemo } from 'react';
import { View, StyleSheet, Text,TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { ThemeProvider, Icon, Button } from 'react-native-elements';
import { Share } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, ParamListBase } from '@react-navigation/native';
import { Store } from '../redux/Store';
import { HOST_URL } from '@env';

type RootStackParamList = {
  DocViewScreen: { id: string };
};

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'DocViewScreen'>;
  route: RouteProp<RootStackParamList, 'DocViewScreen'>;
};

const DocViewScreen = ({ navigation, route }: Props) => {
  const {
    state: { isEmulator },
    dispatch,
  }: any = useContext(Store);
  const { id } = route.params;
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const firstPart = id?.substring(0, 8);

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
      setUrl(`http://${HOST_URL}:3000/doc/${firstPart}`);
    } else {
      setUrl(`https://www.trustwork.co/doc/${firstPart}`);
    }
    setIsLoading(false);
  }, []);

  return (
    <>
      {isLoading ? (
        ''
      ) : (
        <View style={{ flex: 1 }}>
          <WebView source={{ uri: url }} />
          <View style={styles.shareButtonContainer}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleShare}>
                <View style={styles.header}>
                  <Text style={styles.buttonText}>ส่งเอกสารให้ลูค้า</Text>
                  <Icon
                    style={styles.icon}
                    name="send"
                    type="font-awesome"
                    size={22}
                    color="white"
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </>
  );
};


const styles = StyleSheet.create({
  shareButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: '90%',
    height: 50,
  },
  button: {
    flex: 1,
    backgroundColor: '#ec7211',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
    marginTop: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    color: 'white',
    marginLeft: 10,
  },
  shareButton: {
    backgroundColor: 'white',
    paddingHorizontal: 0,
    paddingVertical: 0,
    width: '95%',
    alignSelf: 'center',
  },
});
export default DocViewScreen;

