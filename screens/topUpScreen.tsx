import React, {useEffect,useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert,Platform} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  initConnection,
  getProducts,
  requestPurchase,
  purchaseErrorListener,
  purchaseUpdatedListener,
  type ProductPurchase,
  type PurchaseError,
   RequestPurchase,
   Product,
  flushFailedPurchasesCachedAsPendingAndroid,
} from 'react-native-iap';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCoins} from '@fortawesome/free-solid-svg-icons';

interface TopUpOption {
  coins: number;
  price: number;
  productId: string;
}
const itemSkus = Platform.select({
  ios: [
    'product_1000_coins',
    'product_2000_coins',
    'product_3000_coins',
  ],
  android: [
    'product_1000_coins',
    'product_2000_coins',
    'product_3000_coins',
  ],
}) || [
  'product_1000_coins',
  'product_2000_coins',
  'product_3000_coins',
];

const topUpOptions: TopUpOption[] = [
  {coins: 1000, price: 1150, productId: 'product_1000_coins'},
  {coins: 2000, price: 2250, productId: 'product_2000_coins'},
  {coins: 3000, price: 3000, productId: 'product_3000_coins'},
];

const TopUpScreen: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    const initializeIAP = async () => {
      try {
        await initConnection();
        const productList = await getProducts({ skus: itemSkus });
        console.log('Fetched products:', productList); // Add this line
        setProducts(productList);
        if (Platform.OS === 'android') {
          await flushFailedPurchasesCachedAsPendingAndroid();
        }
      } catch (err) {
        console.warn(err);
      }
    };
    initializeIAP();
  }, []);
  const handleTopUpSelection = async (option: TopUpOption) => {
    console.log(`Selected: ${option.productId}`);
    try {
      const selectedProduct = products.find(
        (product) => product.productId === option.productId,
      ) as any
      if (selectedProduct) {
        await requestPurchase(selectedProduct.productId);
      } else {
        console.warn(`Product not found: ${option.productId}`);
      }
    } catch (err) {
      console.warn(err);
    }
  };
  
  
  const getProductById = (productId: string) =>
    products.find((product) => product.productId === productId);
//   const handleTopUpSelection = async (option: TopUpOption) => {
//     console.log(`Selected: ${option.coins} coins for ${option.price} THB`);
// //  Modify topUplogic 
//   };

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
