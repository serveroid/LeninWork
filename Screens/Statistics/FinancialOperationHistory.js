import React, {useLayoutEffect} from 'react';
import {FlatList, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {pullFinOperationsData} from '../../Components/pullFinOperations.js'
import {pullFinOperationsDataNew} from '../../Components/pullFinOperations.js'
import {getFinOperationsList} from '../../redux/actions.js';


export const FinancialOperationHistory = ({navigation})=>{
    // Компонент страницы финсовых операций

    const earningStatsData = useSelector(state=>state.earningStatsData);
    const finOperationsList = useSelector(state=>state.finOperationsList);
    const userId = useSelector(state=>state.userId)
    const token = useSelector(state=>state.token)
    const dispatch = useDispatch();

    //меняем заголовок в шапке
    useLayoutEffect(()=>{
        navigation.setOptions({
            headerTitle: ()=>(
                <View style={{paddingTop: 25, alignItems: 'center'}}>
                    <Text style={{
                        fontSize: 20,
                        fontWeight: '500',
                        fontFamily: 'roboto',
                        color: 'white'
                    }}>Финансовые</Text>
                    <Text
                        style={{fontSize: 20, fontWeight: '500', fontFamily: 'roboto', color: 'white'}}>операции</Text>
                </View>
            )
        });

        //Получаем финансовые операции с сервера
        const getFinOperation = async () => {
            const finOperationsServer = await pullFinOperationsData('id1');
            pullFinOperationsDataNew(userId, token)
            dispatch(getFinOperationsList(finOperationsServer));
        }
        getFinOperation()
    }, []);


    //рендерим финансовые операции
    const renderItem = ({item})=>(
        <View style={styles.finOperationsView}>
            <View style={styles.finOperationsNumberView}>
                <Text style={styles.finOperationsNumber}>№{item.number}</Text>
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

                <View style={styles.headlines}>
                    <Text style={styles.headlinesNumber}>Номер операции</Text>
                    <Text style={styles.headlinesDate}>Дата</Text>
                    <Text style={styles.headlinesSum}>Сумма</Text>
                </View>

                <View>
                    <FlatList
                        data={finOperationsList}
                        renderItem={renderItem}
                        keyExtractor={item=>item.id.toString()}
                    />
                </View>

                <View style={styles.total}>
                    <Text style={styles.totalText}>Итого: <Text style={{color:'#F96B5C'}}>{earningStatsData.financialOperations + ' \u20BD'}</Text></Text>
                </View>

            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 55
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
    headlines: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: 25
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
        textDecorationLine: 'underline'
    },
    finOperationsDateView: {
        position: 'absolute',
        right: 130,
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
    total: {
        alignItems: 'flex-end',
        marginTop: 20,
        marginRight: 20,
    },
    totalText: {
        fontFamily: 'roboto',
        color: '#888888',
        fontSize: 15
    }
});
