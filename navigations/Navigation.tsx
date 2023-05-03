import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  NativeModules,
} from 'react-native';
import React, {useState, useContext, useEffect, useRef} from 'react';
import {
  NavigationContainer,
  NavigationContext,
  useNavigation,
} from '@react-navigation/native';
import RootStack from './RootStack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Dashboard from '../screens/dashboard';
import LoginScreen from '../screens/loginScreen';
import firebase from '../firebase';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import SignUpScreen from '../screens/singup';
import {createStackNavigator} from '@react-navigation/stack';
import CompanyUserFormScreen from '../screens/companyUserForm';
import Quotation from '../screens/quotation';
import AddClientForm from '../screens/addClientForm';
import AddProductForm from '../screens/addProductForm';
import SelectContract from '../screens/selectContract';
import SelectAudit from '../screens/selectAudit';
import EditProductForm from '../screens/editProductForm';
import ContactInfoScreen from '../screens/contactInfoScreen';
import SettingCompany from '../screens/settingCompany';
import ContractOption from '../screens/contractOptions';
import InstallmentScreen from '../screens/installmentScreen';
import {StackNavigationProp} from '@react-navigation/stack';
import messaging from '@react-native-firebase/messaging';
import {useQuery} from 'react-query';
import {Store} from '../redux/Store';
import EditContract from '../screens/editContract';
import EditClientForm from '../screens/editClientForm';
import EditQuotation from '../screens/editQuotation';
import ContractCard from '../components/ContractCard';
import WebViewScreen from '../screens/webView';
import ContractDashBoard from '../screens/contractDashboard';
import SelectScreen from '../screens/contract/signContract';
import DocViewScreen from '../screens/docView';
import TopUpScreen from '../screens/topUpScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {HOST_URL} from '@env';
import {
  launchCamera,
  launchImageLibrary,
  MediaType,
} from 'react-native-image-picker';
import Modal from 'react-native-modal';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faFile,
  faDrawPolygon,
  faCog,
  faBell,
  faChevronRight,
  faCashRegister,
  faCoins,
  faSign,
  faSignature,
} from '@fortawesome/free-solid-svg-icons';
import EditCompanyForm from '../screens/editCompanyForm';
import {ScrollView} from 'react-native-gesture-handler';
import AuditCategory from '../screens/auditCategory';
// import FontAwesomeIcon from 'react-native-vector-icons/FontAwesomeIcon5';

type Props = {};
interface SettingScreenProps {
  navigation: StackNavigationProp<ParamListBase, 'TopUpScreen'>;
}
type Company = {
  bizName: string;
  userName: string;
  userLastName: string;
  address:string;
  officeTel: string;
  companyNumber: string;
  userEmail:string;
  mobileTel:string;
};

type ParamListBase = {
  Quotation: undefined;
  AddClient: undefined;
  EditCompanyForm: undefined;
  AuditCategory: {title: string; description: string; serviceID: string};
  AddProductForm: undefined;
  TopUpScreen: undefined;
  LayoutScreen: undefined;
  SelectScreen: {id: string};
  RootTab: undefined;
  QuotationScreen: undefined;
  Dashboard: undefined;
  ContractCard: undefined;
  SelectAudit: {title: string; description: string; serviceID: string};
  SelectContract: {id: string};
  EditProductForm: {
    item: {
      title: string;
      id: string;
      description: string;
      qty: number;
      unit: string;
      total: number;
      unitPrice: number;
      discountPercent: number;
      audits: {
        id: string;
        title: string;
      }[];
    };
  };
  EditClientForm: undefined;
  WebViewScreen: {id: string};
  DocViewScreen: {id: string};
  SignUpScreen: undefined;
  LoginScreen: undefined;
  CompanyUserFormScreen: undefined;
  ContactInfoScreen: undefined;
  SettingCompany: undefined;
  EditQuotation: {id: string};
  EditQuotationScreen: {id: string};
  EditContract: undefined;
  ContractOption: undefined;
  NavigationScreen: undefined;
  InstallmentScreen: {
    apiData: object[];
  };
};
const saveCompanyData = async (companyData:object) => {
  try {
    await AsyncStorage.setItem('companyData', JSON.stringify(companyData));
  } catch (error) {
    console.log('Error saving company data:', error);
  }
};
const loadCompanyData = async () => {
  try {
    const companyData = await AsyncStorage.getItem('companyData');
    return companyData ? JSON.parse(companyData) : null;
  } catch (error) {
    console.log('Error loading company data:', error);
    return null;
  }
};

const fetchCompanyUser = async (email: string, isEmulator: boolean) => {
  const user = auth().currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }
  const idToken = await user.getIdToken();
  let url;
  if (isEmulator) {
    url = `http://${HOST_URL}:5001/workerfirebase-f1005/asia-southeast1/queryCompanySeller2`;
  } else {
    console.log('isEmulator Fetch', isEmulator);
    url = `https://asia-southeast1-workerfirebase-f1005.cloudfunctions.net/queryCompanySeller2`;
  }
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({email}),
    credentials: 'include',
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return data;
};

function SettingsScreen({navigation}: SettingScreenProps) {
  const [company, setCompany] = useState<Company>();
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const {
    state: {client_name, isEmulator, client_tel, client_tax},
    dispatch,
  }: any = useContext(Store);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);

        let fetchedCompanyUser = await loadCompanyData();
        if (!fetchedCompanyUser) {
          fetchedCompanyUser = await fetchCompanyUser(
            user?.email || '',
            isEmulator,
          );
          await saveCompanyData(fetchedCompanyUser);
        }

        setCompany(fetchedCompanyUser);
        setLogo(fetchedCompanyUser.logo);
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);
  const [logo, setLogo] = useState<string | null>(null);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  const toggleLogoutModal = () => {
    setIsLogoutModalVisible(!isLogoutModalVisible);
  };
  const businessDetails = [
    {id: 2, title: 'Business Address', value: company?.address || ''},

    // Add more items as needed
  ];

  const accountOptions = [
    {
      id: 1,
      title: 'แก้ไขข้อมูลธุรกิจ',
      onPress: () => navigation.navigate('EditCompanyForm'),
    },
    // {id: 2, title: 'Upgrade', onPress: () => console.log('Upgrade pressed')},
    {id: 3, title: 'Logout', onPress: () => toggleLogoutModal()},
  ];
  const handleLogoUpload = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      maxWidth: 300,
      maxHeight: 300,
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        if (
          response.assets &&
          response.assets.length > 0 &&
          response.assets[0].uri
        ) {
          setLogo(response.assets[0].uri);
        } else {
          console.log('No assets in response');
        }
      }
    });
  };

  const renderItem = ({item}: any) => (
    <>
      <TouchableOpacity
        style={{paddingVertical: 15, paddingHorizontal: 24}}
        onPress={item.onPress}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={{fontSize: 15, fontWeight: '600', color: '#333'}}>
            {item.title}
          </Text>
          <FontAwesomeIcon icon={faChevronRight} size={24} color="#aaa" />
        </View>
      </TouchableOpacity>
      <View
        style={{
          width: '90%',
          alignSelf: 'center',
          borderBottomWidth: 0.3,
          borderBottomColor: '#cccccc',
        }}></View>
    </>
  );

  const handleLogout = () => {
    console.log('Logout confirmed');
    toggleLogoutModal();
  };
  console.log('LOGO', JSON.stringify(logo))

  return (
    <>
      <ScrollView style={{flex: 1, backgroundColor: '#f5f5f5'}}>
        {/* Business Details */}
        <View style={{backgroundColor: '#fff', paddingVertical: 24}}>
          {/* Logo */}
          <TouchableOpacity
            style={{alignItems: 'center', marginBottom: 24}}
            onPress={handleLogoUpload}>
            {logo ? (
              <Image
                
              source={{
                uri: logo,
              }}
                style={{ width: 100,aspectRatio: 2, resizeMode: 'contain' }}
                />
            ) : (
              <View
                style={{
                  width: 80,
                  height: 80,
                  backgroundColor: '#ddd',
                  borderRadius: 40,
                  alignItems: 'center',
                }}
              />
            )}
          </TouchableOpacity>
          {/* Business Name and Address */}
          <View style={{alignItems: 'center'}}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#333',
                marginBottom: 12,
              }}>
              {company?.bizName}
            </Text>
            <Text
              style={{
                fontSize: 14,
                marginBottom: 10,
                fontWeight: '600',
                color: '#333',
              }}>
              {company?.userName} {company?.userLastName}
            </Text>
            {businessDetails.map(item => (
              <View
                key={item.id}
                style={{
                  flexDirection: 'row',
                  maxWidth: '92%',
                  marginBottom: 8,
                }}>
                <Text style={{fontSize: 14, fontWeight: '600', color: '#333'}}>
                  {item.value}
                </Text>
              </View>
            ))}
            <Text
              style={{
                fontSize: 14,
                marginBottom: 10,
                fontWeight: '600',
                color: '#333',
              }}>
              {company?.officeTel} {company?.mobileTel}
            </Text>
            <Text
              style={{
                fontSize: 14,
                marginBottom: 10,
                fontWeight: '600',
                color: '#333',
              }}>
              {company?.userEmail}
            </Text>
            <Text
              style={{
                fontSize: 14,
                marginBottom: 10,
                fontWeight: '600',
                color: '#333',
              }}>
              {company?.companyNumber}
            </Text>
          </View>
        </View>
        {/* Business Name and Address */}
        {/* Account */}
        <View style={{backgroundColor: '#fff', marginTop: 10}}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('TopUpScreen');
            }}
            style={{paddingVertical: 16, paddingHorizontal: 24}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <FontAwesomeIcon icon={faCoins} size={24} color="#F5A623" />

                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: '600',
                    marginLeft: 10,
                    color: '#333',
                  }}>
                  เครดิต
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: '600',
                    color: '#333',
                    marginRight: 8,
                  }}>
                  0.00{' '}
                </Text>
                <FontAwesomeIcon icon={faChevronRight} size={24} color="#aaa" />
              </View>
            </View>
          </TouchableOpacity>
          <View
            style={{
              width: '90%',
              alignSelf: 'center',
              borderBottomWidth: 0.3,
              borderBottomColor: '#cccccc',
            }}></View>
          <TouchableOpacity
            style={{paddingVertical: 15, paddingHorizontal: 24}}
            onPress={() => navigation.navigate('EditCompanyForm')}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={{fontSize: 15, fontWeight: '600', color: '#333'}}>
                แก้ไขข้อมูลธุรกิจ
              </Text>
              <FontAwesomeIcon icon={faChevronRight} size={24} color="#aaa" />
            </View>
          </TouchableOpacity>
          <View
            style={{
              width: '90%',
              alignSelf: 'center',
              borderBottomWidth: 0.3,
              borderBottomColor: '#cccccc',
            }}></View>
          <TouchableOpacity
            style={{paddingVertical: 15, paddingHorizontal: 24}}
            onPress={() => toggleLogoutModal()}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={{fontSize: 15, fontWeight: '600', color: '#333'}}>
                Logout
              </Text>
              <FontAwesomeIcon icon={faChevronRight} size={24} color="#aaa" />
            </View>
          </TouchableOpacity>
          <View
            style={{
              width: '90%',
              alignSelf: 'center',
              borderBottomWidth: 0.3,
              borderBottomColor: '#cccccc',
            }}></View>
        </View>
      </ScrollView>
      <Modal isVisible={isLogoutModalVisible}>
        <View style={{backgroundColor: 'white', padding: 20, borderRadius: 10}}>
          <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 15}}>
            Confirm Logout
          </Text>
          <Text style={{fontSize: 16, marginBottom: 20}}>
            Are you sure you want to logout?
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
            }}>
            <TouchableOpacity
              style={{
                backgroundColor: '#ccc',
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 5,
              }}
              onPress={toggleLogoutModal}>
              <Text style={{fontSize: 16}}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: '#f00',
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 5,
              }}
              onPress={handleLogout}>
              <Text style={{fontSize: 16, color: 'white'}}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

function RootTab({navigation}: NavigationScreen) {
  const [iconName, setIconName] = useState('document');

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#0050f0',
          tabBarInactiveTintColor: 'gray',
          tabBarItemStyle: {
            borderTopWidth: 3,
            borderTopColor: 'transparent',
          },
          tabBarLabelStyle: {fontSize: 14},
          tabBarLabelPosition: 'beside-icon',
        }}>
        <Tab.Screen
          name="เสนอราคา"
          options={{
            headerStyle: {
              backgroundColor: '#fff',
            },
            headerTintColor: '#000',
            headerTitle: '',
            headerLeft: () => (
              <Text
                style={{
                  color: '#042d60',
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginLeft: 10,
                }}>
                Trustwork
              </Text>
            ),
            headerRight: () => (
              <TouchableOpacity>
                <FontAwesomeIcon
                  icon={faBell}
                  color="gray"
                  size={28}
                  style={{marginRight: 15}}
                />
              </TouchableOpacity>
            ),
            tabBarIcon: ({color, size}) => (
              <FontAwesomeIcon icon={faFile} color={color} size={size} />
            ),
          }}
          // component={SelectScreen}
          component={RootStack}
        />
        <Tab.Screen
          name="ทำสัญญา"
          options={{
            headerStyle: {
              backgroundColor: '#fff',
            },
            headerTitle: '',

            headerTintColor: '#000',
            headerLeft: () => (
              <Text
                style={{
                  color: '#042d60',
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginLeft: 10,
                }}>
                Trustwork
              </Text>
            ),
            headerRight: () => (
              <TouchableOpacity>
                <FontAwesomeIcon
                  style={{marginRight: 15}}
                  icon={faBell}
                  color="gray"
                  size={28}
                />
              </TouchableOpacity>
            ),
            tabBarIcon: ({color, size}) => (
              <FontAwesomeIcon icon={faSignature} color={color} size={size} />
            ),
          }}
          component={ContractDashBoard}
        />
        <Tab.Screen
          name="ตั้งค่า"
          options={{
            headerStyle: {
              backgroundColor: '#fff',
            },
            headerTitle: 'โปรไฟล์',

            headerTintColor: '#000',
            tabBarIcon: ({color, size}) => (
              <FontAwesomeIcon icon={faCog} color={color} size={size} />
            ),
          }}
          component={SettingsScreen}
        />
      </Tab.Navigator>
    </>
  );
}

function QuotationScreen({navigation}: NavigationScreen) {
  return (
    <>
      <Stack.Navigator initialRouteName={'Quotation'}>
        <>
          <Stack.Screen
            options={{
              headerStyle: {
                backgroundColor: '#042d60',
              },
              headerTintColor: '#fff',
              headerBackTitle: '',
              headerTitle: 'สร้างใบเสนอราคา',
              headerTruncatedBackTitle: '',
            }}
            name="Quotation"
            component={Quotation}
          />

          <Stack.Screen
            options={{
              headerStyle: {
                backgroundColor: '#19232e',
              },
              headerTintColor: '#fff',
              headerBackTitle: '',
              headerTruncatedBackTitle: '',
            }}
            name="CompanyUserFormScreen"
            component={CompanyUserFormScreen}
          />
          <Stack.Screen
            options={{
              headerStyle: {
                backgroundColor: '#042d60',
              },
              headerTintColor: '#fff',
              headerBackTitle: '',
              headerTitle: 'เพิ่มลูกค้า',
              headerTruncatedBackTitle: '',
            }}
            name="AddClient"
            component={AddClientForm}
          />
          <Stack.Screen
            options={{
              headerStyle: {
                backgroundColor: '#042d60',
              },
              headerTintColor: '#fff',
              headerBackTitle: '',
              headerTitle: 'สัญญา',
              headerTruncatedBackTitle: '',
            }}
            name="ContractCard"
            component={ContractCard}
          />
          <Stack.Screen
            options={{
              headerStyle: {
                backgroundColor: '#042d60',
              },
              headerTintColor: '#fff',
              headerBackTitle: '',
              headerTitle: 'เพิ่มรายการ-สินค้า',
              headerTruncatedBackTitle: '',
            }}
            name="AddProductForm"
            component={AddProductForm}
          />
          <Stack.Screen
            options={{
              headerStyle: {
                backgroundColor: '#042d60',
              },
              headerTintColor: '#fff',
              headerBackTitle: '',
              headerTitle: 'แก้ไขรายการ-สินค้า',
              headerTruncatedBackTitle: '',
            }}
            name="EditProductForm"
            component={EditProductForm}
          />
          <Stack.Screen
            options={{
              headerStyle: {
                backgroundColor: '#042d60',
              },
              headerTintColor: '#fff',
              headerBackTitle: '',
              headerTitle: 'แก้ไขลูกค้า',
              headerTruncatedBackTitle: '',
            }}
            name="EditClientForm"
            component={EditClientForm}
          />

          <Stack.Screen
            options={{
              headerStyle: {
                backgroundColor: '#042d60',
              },
              headerTintColor: '#fff',
              headerBackTitle: '',
              headerTitle: 'เลือกมาตรฐานการทำงาน',
              headerTruncatedBackTitle: '',
            }}
            name="SelectAudit"
            component={SelectAudit}
          />
                <Stack.Screen
            options={{
              headerStyle: {
                backgroundColor: '#042d60',
              },
              headerTintColor: '#fff',
              headerBackTitle: '',
              headerTitle: 'เลือกหมวดธุรกิจ',
              headerTruncatedBackTitle: '',
            }}
            name="AuditCategory"
            component={AuditCategory}
          />

          <Stack.Screen
            options={{
              headerStyle: {
                backgroundColor: '#042d60',
              },
              headerTintColor: '#fff',
              headerBackTitle: '',
              headerTitle: 'สัญญาการทำงาน',
              headerTruncatedBackTitle: '',
            }}
            name="ContactInfoScreen"
            component={ContactInfoScreen}
          />
          <Stack.Screen
            options={{
              headerStyle: {
                backgroundColor: '#042d60',
              },
              headerTintColor: '#fff',
              headerBackTitle: '',
              headerTitle: 'สรุปสัญญา',
              headerTruncatedBackTitle: '',
            }}
            name="ContractOption"
            component={ContractOption}
          />
          <Stack.Screen
            options={{
              headerStyle: {
                backgroundColor: '#042d60',
              },
              headerTintColor: '#fff',
              headerBackTitle: '',
              headerTitle: 'เลือกสัญญา',
              headerTruncatedBackTitle: '',
            }}
            name="SelectContract"
            component={SelectContract}
          />
          <Stack.Screen
            options={{
              headerStyle: {
                backgroundColor: '#042d60',
              },
              headerTintColor: '#fff',
              headerBackTitle: '',
              headerTitle: 'เลือกการแบ่งจ่ายงวดงาน',
              headerTruncatedBackTitle: '',
            }}
            name="InstallmentScreen"
            component={InstallmentScreen}
          />
          <Stack.Screen
            options={{
              headerStyle: {
                backgroundColor: '#042d60',
              },
              headerTintColor: '#fff',
              headerBackTitle: '',
              headerTitle: 'แก้ไขสัญญา',
              headerTruncatedBackTitle: '',
            }}
            name="EditContract"
            component={EditContract}
          />
          <Stack.Screen
            options={{
              headerStyle: {
                backgroundColor: '#042d60',
              },
              headerTintColor: '#fff',
              headerBackTitle: '',
              headerTitle: 'ตั้งค่าธุรกิจ',
              headerTruncatedBackTitle: '',
            }}
            name="SettingCompany"
            component={SettingCompany}
          />
          <Stack.Screen
            options={{
              headerStyle: {
                backgroundColor: '#042d60',
              },
              headerTintColor: '#fff',
              headerBackTitle: '',
              headerTitle: '',
              headerTruncatedBackTitle: '',
            }}
            name="SignUpScreen"
            component={SignUpScreen}
          />
          <Stack.Screen
            options={{
              headerTintColor: '#fff',
              headerBackTitle: '',
              headerTruncatedBackTitle: '',
            }}
            name="WebViewScreen"
            component={WebViewScreen}
          />
        </>
      </Stack.Navigator>
    </>
  );
}

interface NavigationScreen {
  navigation: StackNavigationProp<ParamListBase, 'NavigationScreen'>;
}

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<ParamListBase>();

const Navigation = ({navigation}: NavigationScreen) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const {
    state: {client_name, isEmulator, client_tel, client_tax},
    dispatch,
  }: any = useContext(Store);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  if (!user) {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="SignUpScreen"
            component={SignUpScreen}
            options={{
              headerTransparent: true,
              headerBackTitle: '',
              headerTruncatedBackTitle: '',
              headerTitle: '',
            }}
          />
          <Stack.Screen
            options={{
              headerTransparent: true,
              headerBackTitle: '',
              headerTruncatedBackTitle: '',
              headerTitle: '',
            }}
            name="LoginScreen"
            component={LoginScreen}
          />
          <Stack.Screen
            options={{
              headerStyle: {
                backgroundColor: '#19232e',
              },
              headerTintColor: '#fff',
              headerBackTitle: '',
              headerTruncatedBackTitle: '',
            }}
            name="CompanyUserFormScreen"
            component={CompanyUserFormScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
  const backEditQuotation = () => {
    navigation.goBack();
  };
  // useEffect(() => {
  //   async function requestUserPermission() {
  //     const authStatus = await messaging().requestPermission();
  //     const enabled =
  //       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //       authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //     if (enabled) {
  //       console.log('Authorization status:', authStatus);
  //       getFCMToken();
  //     }
  //   }

  //   async function getFCMToken() {
  //     const fcmToken = await messaging().getToken();
  //     if (fcmToken) {
  //       console.log('Your Firebase Token is:', fcmToken);
  //     } else {
  //       console.log('Failed to get Firebase Token');
  //     }
  //   }

  //   requestUserPermission();
  // }, []);
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={'RootTab'}>
          <>
            <Stack.Screen
              options={{headerShown: false}}
              name="RootTab"
              component={RootTab}
            />
            <Stack.Screen
              options={{headerShown: false}}
              name="SelectContract"
              component={SelectContract}
            />
            <Stack.Screen
              options={{headerShown: false}}
              name="QuotationScreen"
              component={QuotationScreen}
            />
            <Stack.Screen
              options={{
                headerBackTitle: '',
                headerTitle: 'แก้ไขใบเสนอราคา',
                headerTruncatedBackTitle: '',
              }}
              name="EditQuotationScreen"
              component={EditQuotation}
            />
            <Stack.Screen
              options={{
                headerStyle: {
                  backgroundColor: '#19232e',
                },
                headerTintColor: '#fff',
                headerBackTitle: '',
                headerTruncatedBackTitle: '',
              }}
              name="EditProductForm"
              component={EditProductForm}
            />
            <Stack.Screen
              options={{
                headerStyle: {
                  backgroundColor: '#19232e',
                },
                headerTintColor: '#fff',
                headerBackTitle: '',
                headerTruncatedBackTitle: '',
              }}
              name="EditClientForm"
              component={EditClientForm}
            />
            <Stack.Screen
              options={{
                headerStyle: {
                  backgroundColor: '#19232e',
                },
                headerTintColor: '#fff',
                headerBackTitle: '',
                headerTruncatedBackTitle: '',
              }}
              name="EditCompanyForm"
              component={EditCompanyForm}
            />
            <Stack.Screen
              options={{
                headerStyle: {
                  backgroundColor: '#19232e',
                },
                headerTintColor: '#fff',
                headerBackTitle: '',
                headerTruncatedBackTitle: '',
              }}
              name="AddProductForm"
              component={AddProductForm}
            />
            <Stack.Screen
              options={{
                headerStyle: {
                  backgroundColor: '#0c5caa',
                },
                headerTintColor: '#fff',
                headerTitle: 'ตัวอย่างสัญญา',
                headerBackTitle: '',
                headerTruncatedBackTitle: '',
              }}
              name="DocViewScreen"
              component={DocViewScreen}
            />
            <Stack.Screen
              options={{
                headerStyle: {
                  backgroundColor: '#0c5caa',
                },
                headerTintColor: '#fff',
                headerTitle: 'เติมเครดิต',
                headerBackTitle: '',
                headerTruncatedBackTitle: '',
              }}
              name="TopUpScreen"
              component={TopUpScreen}
            />
          </>
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default Navigation;
const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 80,
    backgroundColor: '#0050f0',
    borderRadius: 28,
    height: 56,
    width: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabIcon: {
    color: 'white',
  },

  screen: {
    flex: 1,
    backgroundColor: '#042d60',
  },
});
