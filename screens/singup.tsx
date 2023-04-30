import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {StackNavigationProp} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

interface Props {
  navigation: StackNavigationProp<RootStackParamList, 'LoginScreen'>;
}

type RootStackParamList = {
  SettingCompany: undefined;
  LoginScreen: undefined;
  CompanyUserFormScreen: undefined;
};

const SignUpScreen = ({navigation}: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] =
    useState<FirebaseAuthTypes.NativeFirebaseAuthError | null>(null);

  const signUpEmail = async () => {
    await AsyncStorage.setItem('userEmail', email);
    await AsyncStorage.setItem('userPassword', password);

    if (password !== confirmPassword) {
      setError({
        code: 'auth/passwords-not-matching',
        message: 'รหัสผ่านไม่ตรงกัน',
        userInfo: {
          authCredential: null,
          resolver: null,
        },
        name: 'FirebaseAuthError',
        namespace: '',
        nativeErrorCode: '',
        nativeErrorMessage: '',
      });
      return;
    }

    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        console.log('User account created & signed in!');
        navigation.navigate('CompanyUserFormScreen');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('อีเมลล์นี้ถูกสมัครสมาชิกไปแล้ว');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('กรอกอีเมลล์ไม่ถูกต้อง');
        }

        setError(error);
        console.error(error);
      });
  };

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
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          secureTextEntry
          placeholder="Confirm Password..."
          placeholderTextColor="#888"
          onChangeText={setConfirmPassword}
          value={confirmPassword}
        />
      </View>

      <TouchableOpacity style={styles.loginBtn} onPress={signUpEmail}>
        <Text style={styles.loginText}>ลงทะเบียน</Text>
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error.message}</Text>}
      <View style={styles.signInContainer}>
        <Text style={styles.signInText}>มีบัญชีผู้ใช้แล้ว? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.signInLink}>เข้าสู่ระบบ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default SignUpScreen;

const windowWidth = Dimensions.get('window').width;

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
