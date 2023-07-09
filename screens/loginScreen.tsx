import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  Button,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {StackNavigationProp} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  LoginManager,
  AccessToken,
  LoginButton,
  Profile,
} from 'react-native-fbsdk-next';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
interface Props {
  navigation: StackNavigationProp<RootStackParamList, 'SignUpScreen'>;
}
type RootStackParamList = {
  SettingCompany: undefined;
  SignUpScreen: undefined;
  CompanyUserFormScreen: undefined;
  Dashboard: undefined;

  // Profile: { userId: string };
};

const LoginScreen = ({navigation}: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [confirm, setConfirm] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>(null);

  // verification code (OTP - One-Time-Passcode)
  const [code, setCode] = useState('');

  // Handle login
  function onAuthStateChanged(user: any) {
    if (user) {
    }
  }

  // Handle the button press
  const signInWithPhoneNumber = async (phoneNumber: string) => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirm(confirmation);
    } catch (error) {
      console.log('Error signing in with phone number:', error);
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      console.log('Signing out');
    } catch (error) {
      console.error(error);
    }
  };

  async function confirmCode() {
    try {
      await confirm?.confirm(code);
    } catch (error) {
      console.log('Invalid code.');
    }
  }

  async function onFacebookButtonPress() {
    LoginManager.logInWithPermissions(['public_profile']).then(
      function (result) {
        if (result.isCancelled) {
          console.log('Login cancelled');
        } else {
          console.log('Login success with data: ' + JSON.stringify(result));
        }
      },
      function (error) {
        console.log('Login fail with error: ' + error);
      },
    );
    Profile.getCurrentProfile().then(function (currentProfile) {
      if (currentProfile) {
        console.log(
          'The current logged user is: ' +
            currentProfile.email +
            '. His profile id is: ' +
            currentProfile.userID,
        );
      }
    });
  }

  const [error, setError] =
    useState<FirebaseAuthTypes.NativeFirebaseAuthError | null>(null);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  const loginWithEmail = async () => {
    setIsLoading(true)
    await AsyncStorage.setItem('userEmail', email);
    await AsyncStorage.setItem('userPassword', password);
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        setIsLoading(false)
        navigation.navigate('Dashboard');
      })
      .catch(error => {
        if (
          error.code === 'auth/user-not-found' 
        ) {
          console.log('ไม่มีผู้ใช้นี้ในระบบ');
          setLoginError('ไม่มีผู้ใช้นี้ในระบ');

        }
        if( error.code === 'auth/wrong-password'){
          console.log('รหัสผ่านไม่ถูกต้อง');
          setLoginError('รหัสผ่านไม่ถูกต้อง');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('กรอกอีเมลล์ไม่ถูกต้อง');
          setLoginError('กรอกอีเมลล์ไม่ถูกต้อง');

        }

        console.error(error);
      });
      setIsLoading(false)
  };

  // useEffect(() => {
  //   AsyncStorage.getItem('userEmail').then(email => setEmail(email || ''));
  //   AsyncStorage.getItem('userPassword').then(password =>
  //     setPassword(password || ''),
  //   );
  // }, []);
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Trustwork</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Email..."
          placeholderTextColor="#888"
          onChangeText={setEmail}
          value={email}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          secureTextEntry
          placeholder="Password..."
          placeholderTextColor="#888"
          onChangeText={setPassword}
          value={password}
        />
      </View>
      {loginError !== '' && <Text style={styles.errorText}>{loginError}</Text>}

      <TouchableOpacity style={styles.loginBtn} onPress={loginWithEmail}>
      {isLoading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.loginText}>Login</Text>
          )}
      </TouchableOpacity>
      <Button
        title="Facebook Sign-In"
        onPress={() =>
          onFacebookButtonPress().then(() =>
            console.log('Signed in with Facebook!'),
          )
        }
      />
      <LoginButton
        onLoginFinished={(error, result) => {
          if (error) {
            console.log('login has error: ' + result.error);
          } else if (result.isCancelled) {
            console.log('login is cancelled.');
          } else {
            AccessToken.getCurrentAccessToken().then(data => {
              console.log('successs login', data.accessToken.toString());
            });
          }
        }}
        onLogoutFinished={() => console.log('logout.')}
      />


      {error && <Text style={styles.errorText}>{error.message}</Text>}
      <View style={styles.signInContainer}>
        <Text style={styles.signInText}>ยังไม่มีบัญชีผู้ใช้? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')}>
          <Text style={styles.signInLink}>ลงทะเบียน</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbfbfb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 50,
    color: '#012d62', // #4
    marginBottom: 40,
  },
  inputView: {
    width: '80%',
    backgroundColor: 'white', // #5
    borderRadius: 5,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20,
    shadowOffset: {width: 0, height: 0.5},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5,
  },
  inputText: {
    height: 50,
    width: '90%',
    color: '#003f5c',
  },
  inputPhoneText: {
    height: 50,
    color: 'white',
    borderWidth: 1,
    borderColor: '#465881',
    borderRadius: 25,
    paddingHorizontal: 20,
    margin: 5,
    textDecorationColor: 'white',
    textAlign: 'center',
  },
  inputFieldsContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // Center the input fields
    flexWrap: 'wrap', // Wrap input fields if they don't fit in a single line
  },
  loginBtn: {
    width: '80%',
    backgroundColor: '#0c5caa', // #2
    borderRadius: 10,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  loginText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  signInContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  signInText: {
    color: '#888',
    fontSize: 16,
  },
  signInLink: {
    color: '#0c5caa',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
