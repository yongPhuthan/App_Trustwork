import {StyleSheet, View, Text} from 'react-native';
import React, {useState, useContext, useEffect, useMemo} from 'react';
import CardDashBoard from '../components/CardDashBoard';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import FooterBtn from '../components/styles/FooterBtn';
import NewCustomerBtn from '../components/styles/NewCustomerBtn';
import auth from '@react-native-firebase/auth';
import {HOST_URL} from '@env';
import {StackNavigationProp} from '@react-navigation/stack';
import {Store} from '../redux/Store';
import {FAB} from 'react-native-paper';
import * as stateAction from '../redux/Actions';
import Modal from 'react-native-modal';
import CardApprovedDashBoard from '../components/CardApprovedDashBoard';
import messaging from '@react-native-firebase/messaging';

type Props = {};
interface Quotation {
  id: string;
  allTotal: number;
  dateOffer: string;
  status: string;
  docNumber: string;
  customer: {
    name: string;
  };
}

interface DashboardState {
  isExtended: boolean;
  companyData: any;
  quotationData: Quotation[] | null; // annotation for quotationData
}
interface DashboardScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'Dashboard'>;
}
type RootStackParamList = {
  Quotation: undefined;
  EditQuotationScreen: {id: string};
  QuotationScreen: undefined;
  WebViewScreen: {id: string};
  EditQuotation: {id: string};
  SelectScreen:{id: string};
  Dashboard: undefined;
};

const ContractDashBoard = ({navigation}: DashboardScreenProps) => {
  const [isExtended, setIsExtended] = React.useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  

  const handleModalClose = () => {
    setShowModal(false); // Step 4
  };
  const {
    state: {isEmulator},
    dispatch,
  }: any = useContext(Store);
  const [companyData, setCompanyData] = useState(null);
  const [quotationData, setQuotationData] = useState<Quotation[] | null>(null);
  const fabStyle = {width: 50};
  const handleFABPress = () => {
    // Do something when FAB is pressed
  };

  const fetchDashboardData = async (email: string, authToken: string) => {
    let url;
    if (isEmulator) {
      url = `http://${HOST_URL}:5001/workerfirebase-f1005/asia-southeast1/queryContractDashBoard`;
    } else {
      url = `https://asia-southeast1-workerfirebase-f1005.cloudfunctions.net/queryContractDashBoard`;
    }
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
      }),
    });
    const data = await response.json();

    return data;
  };
  const getTokenAndEmail = async () => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      const token = await currentUser.getIdToken();
      const email = currentUser.email;
      return {token, email};
    } else {
      // User is not logged in
      return null;
    }
  };
  useEffect(() => {
    // messaging().onNotificationOpenedApp(remoteMessage => {
    //   console.log(
    //     'Notification caused app to open from background state:',
    //     remoteMessage.notification,
    //   );
    // })
    // messaging()
    // .getInitialNotification()
    // .then(remoteMessage => {
    //   if (remoteMessage) {
    //     console.log(
    //       'Notification caused app to open from quit state:',
    //       remoteMessage.notification,
    //     );
    //   }
    // }
    // )
    // async function requestUserPermission() {
    //   const authStatus = await messaging().requestPermission();
    //   const enabled =
    //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    //   if (enabled) {
    //     console.log('Authorization status:', authStatus);
    //     getFCMToken();
    //   }
    // }
  
    // async function getFCMToken() {
    //   const fcmToken = await messaging().getToken();
    //   if (fcmToken) {
    //     console.log('Your Firebase Token is 5555:', fcmToken);
    //   } else {
    //     console.log('Failed to get Firebase Token');
    //   }
    // }

    const fetchData = async () => {
      const user = await getTokenAndEmail();
      if (user) {

        const {token, email} = user;
        if (email && token) {
          const data = await fetchDashboardData(email, token);
          setCompanyData(data[0]);
          setQuotationData(data[1]);
        }
      }
    };
    fetchData();
    // requestUserPermission();

  }, []);
  const handleSelectScreen = (id: string) => {
    navigation.navigate('SelectScreen', {
      id,
    });
  };

  const handleNewQuotationPress = () => {
    navigation.navigate('Quotation');
  };

  // const requestUserPermission = async () => {
  //   const authStatus = await messaging().requestPermission();
  //   const enabled =
  //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
  //   if (enabled) {
  //     console.log('Authorization status:', authStatus);
  //   }
  // };
  


  const renderItem = ({item}: {item: Quotation}) => (
    <>
      {/* <TouchableOpacity onPress={() => handleEditQuotationPress(item.id)}>
        <View>
          <CardApprovedDashBoard
            status={item.status}
            date={item.dateOffer}
            price={item.allTotal}
            customerName={item.customer?.name}
            description={'quotation.'}
            unit={'quotation.'}
          />
        </View>
      </TouchableOpacity> */}
      <View>
      <View>
          <CardApprovedDashBoard
          onPress={()=>handleSelectScreen(item.id)}
            status={item.status}
            date={item.dateOffer}
            price={item.allTotal}
            customerName={item.customer?.name}
            description={'quotation.'}
            unit={'quotation.'}
          />
        </View>

      </View>

    </>
  );


  return (
    <View style={{flex: 1}}>
      <FlatList
        data={quotationData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      {/* <NewCustomerBtn
    handlePress={()=>handleNewQuotationPress()}
    /> */}

    </View>
  );
};

export default ContractDashBoard;

const styles = StyleSheet.create({
  container: {
    padding: 30,
  },
  fabStyle: {
    bottom: 20,
    right: 20,
    position: 'absolute',
    color: 'white',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 10,
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
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    width: '90%',
    alignItems: 'center',
    position: 'absolute',
    bottom: '40%',
    left: 0,
  },
  selectedQuotationText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  closeButtonText: {
    fontSize: 20,
    borderBottomWidth: 1,
    borderColor: 'white',
    paddingBottom: 10,
    paddingTop: 10,
    fontWeight: 'bold',
    fontFamily: 'Sukhumvit set',
  },
  deleteButtonText: {
    fontSize: 18,
    borderBottomWidth: 1,
    fontWeight: 'bold',
    textDecorationColor: 'red',
    color: 'red',
    borderColor: 'white',
    paddingBottom: 10,
    fontFamily: 'Sukhumvit set',
    paddingTop: 10,
  },
});
