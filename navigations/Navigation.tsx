import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
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

import EditContract from '../screens/editContract';
import EditClientForm from '../screens/editClientForm';
import EditQuotation from '../screens/editQuotation';
import ContractCard from '../components/ContractCard';
import WebViewScreen from '../screens/webView';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ContractDashBoard from '../screens/contractDashboard';
import SelectScreen from '../screens/contract/signContract';
import DocViewScreen from '../screens/docView';
import TopUpScreen from '../screens/topUpScreen';
// import FontAwesomeIcon from 'react-native-vector-icons/FontAwesomeIcon5';

type Props = {};
interface SettingScreenProps {
  navigation: StackNavigationProp<ParamListBase, 'TopUpScreen'>;
}


type ParamListBase = {
  Quotation: undefined;
  AddClient: undefined;
  AddProductForm: undefined;
  TopUpScreen:undefined;
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

function SettingsScreen({navigation}: SettingScreenProps) {
  const [logo, setLogo] = useState(null);

  const businessDetails = [
    {id: 1, title: 'Business Name', value: 'Acme Corporation'},
    {id: 2, title: 'Business Address', value: '123 Main St, Anytown, USA'},
    {id: 3, title: 'Phone Number', value: '+1 555-123-4567'},
    // Add more items as needed
  ];

  const accountOptions = [
    {id: 1, title: 'Region', onPress: () => console.log('Region pressed')},
    {id: 2, title: 'Upgrade', onPress: () => console.log('Upgrade pressed')},
    {id: 3, title: 'Logout', onPress: () => console.log('Logout pressed')},
    // Add more items as needed
  ];

  const renderItem = ({item}: any) => (
    <>
      <TouchableOpacity
        style={{paddingVertical: 16, paddingHorizontal: 24}}
        onPress={item.onPress}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={{fontSize: 16, fontWeight: '600', color: '#333'}}>
            {item.title}
          </Text>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#aaa" />
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

  const handleLogoUpload = () => {
    // Code to handle logo upload
    console.log('Logo upload pressed');
  };

  return (
    <View style={{flex: 1, backgroundColor: '#f5f5f5'}}>
      {/* Business Details */}
      <View style={{backgroundColor: '#fff', paddingVertical: 24}}>
        {/* Logo */}
        <TouchableOpacity
          style={{alignItems: 'center', marginBottom: 24}}
          onPress={handleLogoUpload}>
          {logo ? (
            <Image
              source={{uri: logo}}
              style={{width: 80, height: 80, borderRadius: 40}}
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
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#333',
              marginTop: 12,
            }}>
            Upload Logo
          </Text>
        </TouchableOpacity>
        {/* Business Name and Address */}
        <View style={{alignItems: 'center'}}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: '#333',
              marginBottom: 12,
            }}>
            Business Details
          </Text>
          {businessDetails.map(item => (
            <View key={item.id} style={{flexDirection: 'row', marginBottom: 8}}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: '#aaa',
                  width: 120,
                }}>
                {item.title}
              </Text>
              <Text style={{fontSize: 14, fontWeight: '600', color: '#333'}}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>
      </View>
      {/* Business Name and Address */}
      {/* Account */}
      <View style={{backgroundColor: '#fff', marginTop: 10}}>
        <TouchableOpacity onPress={()=>{navigation.navigate('TopUpScreen')}} style={{paddingVertical: 16, paddingHorizontal: 24}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MaterialCommunityIcons
                name="cash"
                size={24}
                color="#F5A623"
                style={{marginRight: 8}}
              />
              <Text style={{fontSize: 16, fontWeight: '600', color: '#333'}}>
                Credit
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#333',
                  marginRight: 8,
                }}>
                0.00{' '}
              </Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color="#aaa"
              />
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

        <FlatList
          data={accountOptions}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
        />
      </View>
    </View>
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
              <TouchableOpacity onPress={() => alert('Top up')}>
                <MaterialCommunityIcons
                  name="bell-outline"
                  size={28}
                  color="#000"
                  style={{marginRight: 15}}
                />
              </TouchableOpacity>
            ),
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons
                name="file-document"
                color={color}
                size={size}
              />
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
              <TouchableOpacity onPress={() => alert('Notifications')}>
                <MaterialCommunityIcons
                  name="bell-outline"
                  size={28}
                  color="#000"
                  style={{marginRight: 15}}
                />
              </TouchableOpacity>
            ),
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons name="draw" color={color} size={size} />
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
              <MaterialCommunityIcons name="cog" color={color} size={size} />
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
              headerTitle: 'เพิ่มลูกค้า',
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
              headerTitle: 'เพิ่มลูกค้า',
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
              headerTitle: 'เพิ่มลูกค้า',
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
              headerTitle: 'เพิ่มลูกค้า',
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
              headerTitle: 'เพิ่มลูกค้า',
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
              headerTitle: 'เพิ่มลูกค้า',
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
              headerTitle: 'เพิ่มลูกค้า',
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
              headerTitle: 'เพิ่มลูกค้า',
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
              headerTitle: 'เพิ่มลูกค้า',
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
              headerTitle: 'เพิ่มลูกค้า',
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
              headerTitle: 'เพิ่มลูกค้า',
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
              headerTitle: 'เพิ่มลูกค้า',
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
              name="SelectScreen"
              component={SelectScreen}
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
                headerTitle: 'ตัวอย่างสัญญา',
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
