import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {GooglePay} from 'react-native-google-pay';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCoins} from '@fortawesome/free-solid-svg-icons';
import {StackNavigationProp} from '@react-navigation/stack';
import {useRoute} from '@react-navigation/native';

interface CategoryUpOption {
  coins: number;
  price: number;
  onPress: Function
}
interface Props {
  navigation: StackNavigationProp<ParamListBase, 'AuditCategory'>;
}
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
  
};



const AuditCategory = ({navigation}: Props) => {
  const route = useRoute();
  const {title, description,  id}: any = route.params;

  const categoryOptions: CategoryUpOption[] = [
    {coins: 1000, price: 1150, onPress: () => navigation.navigate('SelectAudit',{
      title,
      description,
      serviceID: id,
    })},
    {coins: 2000, price: 2250,onPress: () => navigation.navigate('EditCompanyForm') },
    {coins: 3000, price: 3000,onPress: () => navigation.navigate('EditCompanyForm')},
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Top-up</Text>
      <View style={styles.optionsContainer}>
        {categoryOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.option}
            onPress={option.onPress}>
            <LinearGradient
              colors={['#ffffff', '#f5f5f5']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.gradient}>
              <FontAwesomeIcon
                icon={faCoins}
                size={24}
                color="#333"
                style={styles.icon}
              />
              <Text style={styles.coinsText}>{option.coins} coins</Text>
              <Text style={styles.optionText}>{option.price} THB</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 40,
    color: '#333',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  option: {
    width: '40%',
    margin: 10,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    elevation: 3,
  },
  gradient: {
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
  },
  coinsText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 10,
  },
  optionText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 18,
  },
  icon: {
    marginBottom: 5,
  },
});

export default AuditCategory;
