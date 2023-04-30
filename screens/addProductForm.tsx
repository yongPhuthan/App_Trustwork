import React, {useState, useContext, useEffect, useRef} from 'react';
import {
  View,
  TextInput,
  Text,
  Platform,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Divider from '../components/styles/Divider';
import {useForm, Controller} from 'react-hook-form';
import {Store} from '../redux/Store';
import * as stateAction from '../redux/Actions';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp, ParamListBase} from '@react-navigation/native';
import {v4 as uuidv4} from 'uuid';
import {ScrollView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const windowWidth = Dimensions.get('window').width;
type FormData = {
  title: string;
  description: string;
  unitPrice: string;
  qty: string;
  unit: string;
  id: string;
  discountPercent: string;
  total: string;
};
type ServiceList = {
  id: string;
  title: string;
  description: string;
  unitPrice: number;
  qty: number;
  discountPercent: number;
  total: number;
};

type Props = {
  navigation: StackNavigationProp<ParamListBase, 'AddProductForm'>;
  route: RouteProp<ParamListBase, 'AddProductForm'>;
};

const AddProductForm = ({navigation, route}: Props) => {
  const {control, handleSubmit} = useForm<FormData>();
  const [qty, setQuantity] = useState(1);
  const [count, setCount] = useState(0);
  const [unitPrice, setPrice] = useState(0);
  const [total, setTotalCost] = useState(0);
  const [serviceListState, setServiceList] = useState<ServiceList[]>([]);
const serviceID = uuidv4()
  const {
    state: {serviceList, selectedAudit},
    dispatch,
  }: any = useContext(Store);

  const handleFormSubmit = (data: FormData) => {
    const selectedAudits = selectedAudit.map((obj:any) => {
      return {
        ...obj,
        serviceID,
      };
    });
    const newServiceItem = {
      id: serviceID, 
      title: data.title,
      description: data.description,
      unitPrice: data.unitPrice,
      qty: qty,
      discountPercent: data.discountPercent,
      total: (qty * unitPrice).toString(),
      audits:selectedAudits
    };
    dispatch(stateAction.service_list(newServiceItem as any));
    dispatch(stateAction.reset_audit());
    console.log('serviceList' + (serviceList));

    navigation.goBack();
  };
  const handleSelectAudit = (data: FormData) => {
    navigation.navigate('SelectAudit', {
      title: data.title,
      description: data.description,
      serviceID: serviceID,
      
    });
  };
  useEffect(() => {
    // Calculate the total cost based on the quantity and price values
    setTotalCost(qty * unitPrice);
  }, [qty, unitPrice]);
  return (
    <ScrollView style={styles.container}>
      <View style={styles.subContainer}>
        <Controller
          control={control}
          name="title"
          defaultValue=""
          render={({field: {onChange, value}}) => (
            <TextInput
              placeholder="ชื่อสินค้า-บริการ.."
              style={styles.inputName}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        <Controller
          control={control}
          name="description"
          defaultValue=""
          render={({field: {onChange, value}}) => (
            <TextInput
              placeholder="รายละเอียด..."
              keyboardType="name-phone-pad"
              multiline
              textAlignVertical="top"
              numberOfLines={4}
              style={styles.inputAddress}
              onChangeText={onChange}
              value={value}
            />
          )}
        />

        <View style={styles.summary}>
          <Text style={styles.price}>ราคา:</Text>
          <Controller
            control={control}
            name="unitPrice"
            defaultValue=""
            render={({field: {onChange, value}}) => (
              <TextInput
                style={styles.price}
                placeholder="0"
                keyboardType="number-pad"
                onChangeText={value => {
                  onChange(value);
                  setPrice(parseInt(value, 10));
                }}
                value={value}
              />
            )}
          />
        </View>
        <View style={styles.summary}>
          <Text style={styles.price}>จำนวน:</Text>

          {/* START COUNTER BUTTON */}
          <View style={styles.containerCounter}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                if (count > 0) {
                  setCount(count - 1);
                  setQuantity(qty - 1);
                }
              }}>
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            <Controller
              control={control}
              name="qty"
              render={({field: {onChange, value}}) => (
                <TextInput
                  style={styles.counter}
                  placeholder="10"
                  keyboardType="number-pad"
                  onChangeText={value => {
                    onChange(value);
                    setQuantity(parseInt(value, 10));
                  }}
                  value={qty.toString()}
                />
              )}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setCount(count + 1);
                setQuantity(qty + 1);
              }}>
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* END COUNTER BUTTON */}
        </View>
        <View style={styles.summary}>
          <Text style={styles.price}>หน่วย:</Text>
          <Controller
            control={control}
            name="unit"
            defaultValue="ชุด"
            render={({field: {onChange, value}}) => (
              <TextInput
                style={styles.price}
                keyboardType="default"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
        </View>
        <View style={styles.summary}>
          <Text style={styles.price}>ส่วนลด(%):</Text>
          <Controller
            control={control}
            name="discountPercent"
            defaultValue=""
            render={({field: {onChange, value}}) => (
              <TextInput
                style={styles.price}
                placeholder="0"
                keyboardType="number-pad"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
        </View>
        <Divider />
        <View style={styles.summary}>
          <Text style={styles.price}>รวมเป็นเงิน:</Text>
          <Controller
            control={control}
            name="total"
            defaultValue=""
            render={({field: {value}}) => (
              <TextInput
                style={styles.priceSummary}
                placeholder="0"
                keyboardType="number-pad"
                value={(qty * unitPrice).toString()}
                editable={false}
              />
            )}
          />
        </View>
        <View></View>
        <View>
          {selectedAudit?.length > 0 ? (
            <View style={styles.cardContainer}>
              {selectedAudit?.map((item:any)  => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.card}
                  onPress={handleSubmit(handleSelectAudit)}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Icon name="chevron-right" size={24} color="gray" />
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.subContainer}>
              {selectedAudit.length === 0 && (
                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={handleSubmit(handleSelectAudit)}>
                  <Text style={styles.selectButtonText}>Select Audit</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.btn}
          onPress={handleSubmit(handleFormSubmit)}>
          <Text style={styles.label}>บันทึก</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
export default AddProductForm;

const styles = StyleSheet.create({
  container: {},
  subContainer: {
    backgroundColor: '#ffffff',
    padding: 30,
    marginBottom: 10,
    height: 'auto',
  },
  form: {
    border: '1px solid #0073BA',
    borderRadius: 10,
  },
  date: {
    textAlign: 'right',
  },

  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 40,
    backgroundColor: '#0073BA',
  },

  inputName: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 10,
    fontSize: 16,
    height: 40,
  },
  inputAddress: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 10,
    fontSize: 16,
    height: 100,
  },
  label: {
    fontSize: 16,
    color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',

    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 10,
    fontSize: 16,
    height: 40,
  },
  prefix: {
    paddingHorizontal: 5,
    paddingVertical: 5,

    fontWeight: 'bold',
    color: 'black',
  },
  containerPrice: {
    alignSelf: 'center',
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        paddingVertical: 10,
      },
      android: {
        paddingVertical: 0,
      },
    }),
  },
  priceSummary: {
    fontSize: 18,
    marginTop: -10,
    color: 'black',
    fontWeight: 'bold',
  },
  price: {
    fontSize: 18,
    color: 'black',
  },
  counter: {
    fontSize: 18,
    paddingHorizontal: 20,
  },
  containerCounter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#e9f4f9',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  selectButton: {
    backgroundColor: '#0073BA',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 5,
    marginTop: 20,
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  count: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  button: {
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },

  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    flexDirection: 'row',
    width: '100%',
    marginBottom: 10,
    justifyContent: 'space-between',

  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#0073BA',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
