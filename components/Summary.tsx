import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  Platform,
  Switch,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import ModalSelector from 'react-native-modal-selector';
import React, {useState, useContext, useEffect, useRef} from 'react';
import Divider from './styles/Divider';
import {Store} from '../redux/Store';
import * as stateAction from '../redux/Actions';


type Props = {
  title: string;
  price: number;
  onValuesChange: (
    total: number,
    discountValue: number,
    sumAfterDiscount: number,
    vat7Amount: number,
    vat3Amount: number,
  ) => void;
};

const windowWidth = Dimensions.get('window').width;

const Summary = (props: Props) => {

  const [selectedLanguage, setSelectedLanguage] = useState();
  const [selectedValue, setSelectedValue] = useState(0);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [discount, setDiscount] = useState('0');
  const [vat7, setVat7] = useState(false);
  const [vat7Value, setVat7Value] = useState(0);
  const onButtonPress = () => {
    setPickerVisible(!pickerVisible);
  };
  const pickerRef = useRef() as any;
  function open() {
    pickerRef.current.focus();
  }
  const onDiscountInputChange = (value: string) => {
    if (/^\d+%?$/.test(value)) {
      setDiscount(value);
    }
    // props.onDiscountChange(Number(value));
  };
  function close() {
    pickerRef.current.blur();
  }
  const data = [
    {key: '3', label: '3%'},
    {key: '5', label: '5%'},
  ];
  const discountValue = (props.price * parseFloat(discount)) / 100;
  const sumAfterDiscount = props.price - discountValue;
  const vat7Amount = vat7 ? sumAfterDiscount * 0.07 : 0;
  const vat3Amount = pickerVisible
    ? (sumAfterDiscount * Number(selectedValue)) / 100
    : 0;
    const total = Number(sumAfterDiscount + vat7Amount - vat3Amount);
    useEffect(() => {
      props.onValuesChange(
        total,
        discountValue,
        sumAfterDiscount,
        vat7Amount,
        vat3Amount,
      );
    }, [total, discountValue, sumAfterDiscount, vat7Amount, vat3Amount]);

    return (
    <View style={styles.container}>
      <View style={styles.summary}>
        <Text style={styles.summaryText}>{props.title}</Text>
        <Text style={styles.summaryPrice}>{props.price}</Text>
      </View>
      {/* discount */}
      <View style={styles.summary}>
        <Text style={styles.summaryText}>ส่วนลดรวม</Text>
        {/* <Text style={styles.summaryPrice}>0</Text> */}

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="0"
            onChangeText={onDiscountInputChange}
            keyboardType="numeric"
          />
          <Text style={styles.summaryText}>%</Text>
        </View>
      </View>
      {/* end discount */}

      {/* discount value */}
      <View style={styles.summary}>
        <Text style={styles.summaryText}>ส่วนลดเป็นเงิน</Text>
        <Text style={styles.summaryPrice}>{discountValue}</Text>
      </View>
      {/* discount value */}

      {/* summary after discount */}
      <View style={styles.summary}>
        <Text style={styles.summaryText}>ยอดรวมหลังหักส่วนลด</Text>
        <Text style={styles.summaryPrice}>{sumAfterDiscount}</Text>
      </View>
      {/* summary after discount */}

      {/* vat 3  */}
      <View style={styles.summary}>
        <Text style={styles.summaryTaxVat}>VAT 3%</Text>
        <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={pickerVisible ? '#ffffff' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => setPickerVisible(!pickerVisible)}
          value={pickerVisible}
          style={Platform.select({
            ios: {
              transform: [{scaleX: 0.7}, {scaleY: 0.7}],
            },
            android: {
              // Android specific styles
            },
          })}
        />
        {pickerVisible && (
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.picker}
              selectedValue={selectedValue}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedValue(itemValue)
              }>
              <Picker.Item label="0%" value={0} />
              <Picker.Item label="3%" value={3} />
              <Picker.Item label="5%" value={5} />
            </Picker>
          </View>
        )}
        <Text style={styles.summaryText}>{vat3Amount.toFixed(2)}</Text>
      </View>

      {/* end vat3 */}

      {/* vat 7 */}
      <View style={styles.summary}>
        <Text style={styles.summaryTaxVat}>vat </Text>
        <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={pickerVisible ? '#ffffff' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => setVat7(!vat7)}
          value={vat7}
          style={Platform.select({
            ios: {
              transform: [{scaleX: 0.7}, {scaleY: 0.7}],
            },
            android: {
              // Android specific styles
            },
          })}
        />
        <Text
          style={Platform.select({
            ios: {
              fontSize: 18,
            },
            android: {
              fontSize: 18,
              marginVertical: 10,
            },
          })}>
          {vat7Amount.toFixed(2)}
        </Text>
      </View>
      {/* end vat7 */}

      <Divider />
      <View style={styles.summaryTotal}>
        <Text style={styles.totalSummary}>รวมทั้งสิ้น</Text>
        <Text style={styles.totalSummary}>{total}</Text>
      </View>
    </View>
  );
};

export default Summary;

const styles = StyleSheet.create({
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryTax: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
  },
  summaryTotal: {
    flexDirection: 'row',
    marginBottom: 100,
    justifyContent: 'space-between',
  },
  container: {
    width: windowWidth * 0.7,

    alignSelf: 'flex-end',
  },
  text: {
    marginVertical: 10,
  },
  summaryText: {
    fontSize: 16,
    marginVertical: 10,
  },
  summaryTaxVat: {
    fontSize: 16,
    marginVertical: 10,
  },
  totalSummary: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  summaryPrice: {
    fontSize: 18,
    marginVertical: 10,
  },
  textSwtich: {
    fontSize: 18,
  },
  pickerContainer: {
    flex: 1,
 
    height: 40,
  },
  picker: {
    flex: 1,
  },
  summarySelecter: {
    fontSize: 18,
    color: 'black',
    paddingHorizontal: 0,
  },
  summaryInput: {
    fontSize: 14,
    marginVertical: 10,
  },

  inputWrapper: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    height: 40,
    width: 100,
  },

  input: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 16,
    textAlign: 'right',
    height: '100%',
  },
});
