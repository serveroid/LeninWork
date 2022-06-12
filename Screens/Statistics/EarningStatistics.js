import React, {useLayoutEffect} from 'react';
import { Dimensions, Image, ImageBackground, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {pullEarningsStatsData} from '../../Components/pullEarningStatics.js'

import {getEarningStatsData} from '../../redux/actions.js';
import {useDispatch, useSelector} from 'react-redux';

export const EarningStatistics = ({navigation})=>{

    const dispatch = useDispatch();
    const earningStatsData = useSelector(state=>state.earningStatsData);
    const userId = useSelector(state=>state.userId)
    const token = useSelector(state=>state.token)


    useLayoutEffect(()=>{
        navigation.setOptions({
            title: ('Статистика заработка')
        });
            //Получаем с сервера информацию о состочнии счета пользователя
        const getEarningData = async () => {
            let earningStatsDataServer = await pullEarningsStatsData(userId, token)
            dispatch(getEarningStatsData(earningStatsDataServer));
        }
        getEarningData()
    }, []);


    if(earningStatsData){
        return(
            <ImageBackground source={require('../../assets/earningStatisticsBackground.png')} resizeMode="stretch"
                             style={styles.imageBack}>
                <View style={styles.balanceBlock}>
                    <Image
                        style={styles.walletIcon}
                        source={require('../../assets/walletIcon.png')}/>
                    <View style={styles.walletText}>
                        <Text style={styles.balanceText}>{earningStatsData.balance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₽</Text>
                        <Text style={styles.balanceTime}>{earningStatsData.balanceTimeString}</Text>
                    </View>
                </View>
                <View style={styles.infoBlock}>
                    <TouchableOpacity style={styles.financialOperationsView} onPress={()=>navigation.navigate('FinancialOperationHistory')}>
                        <Text style={styles.financialOperationsText}>Финансовые</Text>
                        <Text style={styles.financialOperationsText}>операции</Text>
                        <Text style={styles.financialOperationsNumber}>{earningStatsData.financialOperations.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₽</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.referralEarningsView} onPress={()=>navigation.navigate('ReferralStatistics')}>
                        <Text style={styles.referralEarningsText}>Заработанные</Text>
                        <Text style={styles.referralEarningsText}>рефералами</Text>
                        <Text style={styles.referralEarningsNumber}>{earningStatsData.referralEarnings.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₽</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.withdrawalView} onPress={()=>navigation.navigate('MoneyWithdrawal')}>
                    <Text style={styles.withdrawalText}>Вывести средства</Text>
                </TouchableOpacity>
            </ImageBackground>
    )}else{
        return(
            <View style={styles.container}></View>
        )
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 65,
    },
    imageBack: {
        marginTop: StatusBar.currentHeight,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    balanceBlock: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    walletIcon: {
        width: 55,
        height: 55
    },
    walletText: {
        marginLeft: 5
    },
    balanceText: {
        fontFamily: 'roboto',
        fontSize: 30,
        color: '#FFFFFF',
        textDecorationLine: 'underline'
    },
    balanceTime: {
        fontFamily: 'roboto',
        fontSize: 12,
        color: '#FFFFFF'
    },
    infoBlock: {
        marginTop: 20,
        width: 366,
        height: 150,
        backgroundColor: '#FFFFFF',
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: '#D5F1FF',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    financialOperationsView: {
        alignItems: 'center',
        marginRight: 30,
    },
    financialOperationsText: {
        color: '#3EAFF2',
        fontSize: 16,
        textDecorationLine: 'underline',
    },
    financialOperationsNumber: {
        color: '#F96B5C',
        fontSize: 26,
        marginTop: 10,
    },
    referralEarningsView: {
        alignItems: 'center',
        marginLeft: 40,
    },
    referralEarningsText: {
        color: '#3EAFF2',
        fontSize: 16,
        textDecorationLine: 'underline',
    },
    referralEarningsNumber: {
        color: '#F96B5C',
        fontSize: 26,
        marginTop: 10,
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
        fontSize: 22
    }
});
