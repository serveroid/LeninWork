import React, {useLayoutEffect, useState} from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {getWithdrawalHistory, getEarningStatsData} from '../../redux/actions.js';
import {pullEarningsStatsData} from '../../Components/pullEarningStatics.js'
import { pullWithdrawalHistory } from '../../Components/pullWithdrawalHistory.js'

const MoneyWithdrawal = ({navigation})=>{

    const earningStatsData = useSelector(state=>state.earningStatsData);
    const withdrawalHistory = useSelector(state=>state.withdrawalHistory);

    const userId = useSelector(state=>state.userId)
    const token = useSelector(state=>state.token)

    const dispatch = useDispatch();

    const [chekPaymentDataInput, setChekPaymentDataInput] = useState(false);
    const [paymentDataInput, setPaymentDataInput] = useState('');
    const [sumInput, setSumInput] = useState('');
    const [chekSumInput, setChekSumInput] = useState(false);

    const setPaymentDataInputHandler = e=>setPaymentDataInput(e);
    const setSumInputHandler = e=>setSumInput(e);

    const setChekPaymentDataInputHandler = e=>setChekPaymentDataInput(e);
    const setChekSumInputHandler = e=>setChekSumInput(e);

    //меняем заголовок в шапке
    useLayoutEffect(()=>{
        // pullWithdrawalHistoryN(userId, token)
        navigation.setOptions({
            title: ('Вывод средств')
        });

        const getEarningData = async () => {
            const earningStatsDataServer = await pullEarningsStatsData(userId, token);
            dispatch(getEarningStatsData(earningStatsDataServer));
        }
        getEarningData();

        //Получаем историю вывода с сервера
        const getWithdrawalDataServer = async () => {
            const withdrawalHistoryServer = await pullWithdrawalHistory(userId, token)
            dispatch(getWithdrawalHistory(withdrawalHistoryServer));
        }
        getWithdrawalDataServer();
    }, []);


    const [validateButton, setvalidateButton] = useState(false);
    const validateButtonVoid = ()=>{
        if (paymentDataInput.length >= 16 && sumInput.length >= 3 && /^\d+$/.test(paymentDataInput) && /^\d+$/.test(sumInput)) {
            setvalidateButton(true);
        } else {
            setvalidateButton(false);
        }
    };

    //рендерим финансовые операции
    const renderItem = ({item})=>(
        <View style={styles.finOperationsView}>
            <View style={styles.finOperationsNumberView}>
                <Text style={styles.finOperationsNumber} numberOfLines={1}>{item.source}</Text>
            </View>
            <View style={styles.finOperationsDateView}>
                <Text style={styles.finOperationsDate}>{item.date}</Text>
            </View>
            <View style={styles.finOperationsSumView}>
                <Text style={styles.finOperationsSum}>{item.sum + ' \u20BD'}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../../assets/menu.png')} resizeMode="stretch" style={styles.imageBack}>
                <TouchableOpacity style={styles.goBack}
                                  onPress={()=>{
                                      navigation.goBack();
                                  }}
                >
                    <Image source={require('../../assets/backArrow.png')} style={styles.goBackIcon}/>
                    <Text style={styles.goBackText}>Вернуться назад</Text>
                </TouchableOpacity>
                <View style={styles.balanceBlock}>
                    <Text style={styles.balanceTime}>{earningStatsData.balanceTimeString}</Text>
                    <Text style={styles.balanceText}>{earningStatsData.balance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ₽</Text>
                </View>

                <View style={{marginLeft: 30, marginTop: 10}}>
                    <View style={{width: '90%', height: 90}}>
                        <Text style={{color: '#888888', fontSize: 15}}>{'Номер карты'}</Text>
                        <TextInput
                            style={chekPaymentDataInput ? styles.inputOn : styles.inputOff}
                            value={paymentDataInput}
                            keyboardType={'number-pad'}
                            required
                            num
                            onKeyPress={validateButtonVoid}
                            onChangeText={text=>setPaymentDataInputHandler(text)}
                            onFocus={()=>setChekPaymentDataInputHandler(true)}
                            onEndEditing={()=>setChekPaymentDataInputHandler(false)}
                        />
                    </View>
                    <View style={{width: '90%', height: 30}}>
                        <TouchableOpacity style={{marginBottom: 15}} onPress={()=>{
                        }}>
                            <Text style={{
                                textDecorationLine: 'underline',
                                color: '#3DB2F4'
                            }}>{'Выбрать другой вариант'}</Text>
                        </TouchableOpacity>
                    </View>


                    <View style={{width: '90%', height: 90}}>
                        <Text style={{color: '#888888', fontSize: 15}}>{'Сумма вывода'}</Text>
                        <TextInput
                            style={chekSumInput ? styles.inputOn : styles.inputOff}
                            value={sumInput}
                            keyboardType={'number-pad'}
                            required
                            num
                            onKeyPress={validateButtonVoid}
                            onChangeText={text=>setSumInputHandler(text)}
                            onFocus={()=>setChekSumInputHandler(true)}
                            onEndEditing={()=>setChekSumInputHandler(false)}
                        />
                    </View>
                </View>

                <TouchableOpacity style={styles.withdrawalView}
                                  disabled={!validateButton}>
                    <Text style={styles.withdrawalText}>Вывести средства</Text>
                </TouchableOpacity>

                <View style={styles.headlines}>
                    <Text style={styles.headlinesNumber}>Куда</Text>
                    <Text style={styles.headlinesDate}>Дата</Text>
                    <Text style={styles.headlinesSum}>Сумма</Text>
                </View>

                <View>
                    <FlatList
                        data={withdrawalHistory}
                        renderItem={renderItem}
                        keyExtractor={item=>item.id.toString()}
                    />
                </View>

                <View style={{width: '90%', height: 30, alignItems: 'center', marginTop: 5, marginLeft: 20}}>
                    <TouchableOpacity style={{marginTop: 15}} onPress={()=>{
                    }}>
                        <Text style={{
                            textDecorationLine: 'underline',
                            color: '#3DB2F4'
                        }}>{'Смотреть всю историю'}</Text>
                    </TouchableOpacity>
                </View>

            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
        container: {
            flex: 1,
            paddingTop: 25
        },
        imageBack: {
            flex: 1,
            paddingTop: 130
        },
        goBack: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderColor: '#F3FBFF',
            paddingBottom: 20
        },
        goBackText: {
            color: '#3DB2F4',
            fontSize: 15,
            marginLeft: 7,
            textDecorationLine: 'underline',
            fontWeight: '400',
            fontFamily: 'roboto'
        },
        goBackIcon: {
            width: 13,
            height: 13
        },
        balanceBlock: {
            justifyContent: 'center',
            alignItems: 'center'
        },
        balanceTime: {
            fontFamily: 'roboto',
            fontSize: 15,
            color: '#888888'
        },
        balanceText: {
            fontFamily: 'roboto',
            fontSize: 30,
            color: '#3DB2F4'
        },
        inputOff: {
            borderBottomWidth: 4,
            borderBottomColor: '#6DC2FF',
            width: '100%',
            height: 40,
            fontSize: 20,
            fontFamily: 'roboto'
        },
        inputOn: {
            borderBottomWidth: 4,
            borderBottomColor: 'red',
            width: '100%',
            height: 40,
            fontSize: 20,
            fontFamily: 'roboto'
        },
        withdrawalView: {
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#F96B5C',
            borderWidth: 5,
            borderStyle: 'solid',
            borderColor: '#FEEAE4',
            borderRadius: 70,
            width: Dimensions.get('window').width * 0.9,
            height: 65,
            margin: 20,
            marginTop: 20
        },
        withdrawalText: {
            color: '#F9F9F9',
            fontSize: 22,
            fontFamily: 'roboto'
        },
        headlines: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginRight: 25,
            marginTop: 10,
        },
        headlinesNumber: {
            fontFamily: 'roboto',
            color: '#888888',
            fontSize: 15,
            marginLeft: 35,
        },
        headlinesDate: {
            fontFamily: 'roboto',
            color: '#888888',
            fontSize: 15,
        },
        headlinesSum: {
            fontFamily: 'roboto',
            color: '#888888',
            fontSize: 15,
        },
        finOperationsView: {
            flexDirection: 'row',
            padding: 10,
            paddingTop: 20,
            justifyContent: 'space-between',
            borderBottomWidth: 3,
            borderBottomColor: '#F3FBFF',
        },
        finOperationsNumberView: {
            paddingLeft: 25,
        },
        finOperationsNumber: {
            fontFamily: 'roboto',
            color: '#000000',
            fontSize: 15,
            width: 100,
        },
        finOperationsDateView: {
            position: 'absolute',
            right: 150,
            top: 20,
        },
        finOperationsDate: {
            fontFamily: 'roboto',
            color: '#3EAFF2',
            fontSize: 15,
        },
        finOperationsSumView: {
            position: 'absolute',
            right: 20,
            top: 20,
        },
        finOperationsSum: {
            fontFamily: 'roboto',
            color: '#F96B5C',
            fontSize: 15
        },
    })
;


export default MoneyWithdrawal;
