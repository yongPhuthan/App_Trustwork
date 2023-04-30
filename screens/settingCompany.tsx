import {StyleSheet, Text, View,TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {StackNavigationProp} from '@react-navigation/stack';

type RootStackParamList = {
  SettingCompany: undefined;
  SignUp: undefined;
  // Profile: { userId: string };
};

interface Props {
  navigation: StackNavigationProp<RootStackParamList, 'SignUp'>;
}

const SettingCompany = ({navigation}: Props) => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    setUser(user);
    if (initializing) setInitializing(false);
  }
  const signOut=()=>{
    auth()
  .signOut()
  .then(() => console.log('User signed out!'));
  }
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);
  if (initializing) return null;
  if (!user) {
    navigation.navigate('SignUp');
  }
  return (
    <View>
      <Text>settingCompany</Text>
      <TouchableOpacity  onPress={signOut}>
        <Text >SIGN OUT</Text>
      </TouchableOpacity>
    </View>
    
  );
};

export default SettingCompany;

const styles = StyleSheet.create({});
