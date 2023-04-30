import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {GooglePay} from 'react-native-google-pay';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCoins} from '@fortawesome/free-solid-svg-icons';

interface TopUpOption {
  coins: number;
  price: number;
}

const topUpOptions: TopUpOption[] = [
  {coins: 1000, price: 1150},
  {coins: 2000, price: 2250},
  {coins: 3000, price: 3000},
];
const allowedCardNetworks = ['VISA', 'MASTERCARD'];
const allowedCardAuthMethods = ['PAN_ONLY', 'CRYPTOGRAM_3DS'];
const TopUpScreen: React.FC = () => {
  const handleTopUpSelection = async (option: TopUpOption) => {
    console.log(`Selected: ${option.coins} coins for ${option.price} THB`);

    const requestData = {
      cardPaymentMethod: {
        tokenizationSpecification: {
          type: 'PAYMENT_GATEWAY',
          gateway: 'example', // Update your gateway here
          gatewayMerchantId: 'exampleGatewayMerchantId', // Update your gateway merchant ID here
        },
        allowedCardNetworks,
        allowedCardAuthMethods,
      },
      transaction: {
        totalPrice: option.price.toString(),
        totalPriceStatus: 'FINAL',
        currencyCode: 'THB', // Update currency code if needed
      },
      merchantName: 'Trustwork', // Update your merchant name here
    };

    GooglePay.setEnvironment(GooglePay.ENVIRONMENT_TEST);

    try {
      const ready = await GooglePay.isReadyToPay(
        allowedCardNetworks,
        allowedCardAuthMethods,
      );

      if (ready) {
        const token = await GooglePay.requestPayment(requestData);
        console.log('Payment Token:', token);
        // Send the token to your payment gateway
      }
    } catch (error) {
      console.log(error.code, error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Top-up</Text>
      <View style={styles.optionsContainer}>
        {topUpOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.option}
            onPress={() => handleTopUpSelection(option)}>
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

export default TopUpScreen;
