import React, {useLayoutEffect} from 'react';
import {Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import QRCode from 'react-native-qrcode-svg';
import {pullPartnerStats} from '../../Components/pullPartnerStats.js'

import {getPartnerStats} from '../../redux/actions.js';
import {useDispatch, useSelector} from 'react-redux';

export const AffiliateProgram = ({navigation})=>{

    const dispatch = useDispatch();
    const partnerStats = useSelector(state=>state.partnerStats);
    const userId = useSelector(state=>state.userId)
    const token = useSelector(state=>state.token)

    //Копируем реферальную ссылку в буфер обмена
    const copyToClipboard = ()=>{
        Clipboard.setString(partnerStats.refLink);
    };

    //переходим в компонент, где отображается статистика по реффералам
    const showStatistics = ()=>{
        navigation.navigate('ReferralStatistics')
    };

    //меняем заголовок в шапке
    useLayoutEffect(()=>{
        navigation.setOptions({
            title: ('Партнерский баланс')
        });

        //Получаем с сервера информацию о партнерах
        const getPartnerData = async () => {
            const partnerStatsDataServer = await pullPartnerStats(userId, token)
            console.log(partnerStatsDataServer);
            dispatch(getPartnerStats(partnerStatsDataServer));
        }
        getPartnerData()
    }, []);

    if(partnerStats !== undefined){
        return (
        <View style={styles.container}>
            <ImageBackground source={require('../../assets/menu.png')} resizeMode="stretch" style={styles.imageBack}>
                <Text style={{color: 'white', fontSize: 37, alignSelf: 'center', marginTop: 40}}>{partnerStats.balance.toFixed(2).replace('.', ',')} ₽</Text>
                <TouchableOpacity style={styles.goBack}
                                  onPress={()=>{
                                      navigation.goBack();
                                  }}
                >
                    <Image source={require('../../assets/backArrow.png')} style={styles.goBackIcon}/>
                    <Text style={styles.goBackText}>Вернуться назад</Text>
                </TouchableOpacity>
                <ScrollView>
                    <View style={styles.referralLink}>
                        <Text style={{color: '#BDBDBD', fontFamily: 'roboto'}}>Ваша реферальная ссылка</Text>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text
                            style={{color: '#3DB2F4', flex: 1}}>{partnerStats.refLink}</Text>
                            <TouchableOpacity style={styles.copyText} onPress={copyToClipboard}><Text style={{
                                color: '#FFFFFF',
                                fontFamily: 'roboto',
                                textAlign: 'center',
                                fontSize: 13
                            }}>Копировать</Text></TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.statistics}>
                        <View>
                            <Text style={{color: '#000000', fontFamily: 'roboto'}}>Переходов</Text>
                            <Text style={{color: '#F96B5C', textAlign: 'center'}}>{partnerStats.conversionAmount}</Text>
                        </View>
                        <View>
                            <Text style={{color: '#000000', fontFamily: 'roboto'}}>Регистраций</Text>
                            <Text style={{color: '#F96B5C', textAlign: 'center'}}>{partnerStats.registrationAmount}</Text>
                        </View>
                        <View>
                            <Text style={{color: '#000000', fontFamily: 'roboto'}}>Сумма оплат</Text>
                            <Text style={{color: '#F96B5C', textAlign: 'center'}}>{partnerStats.sum}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.showStatisticsButton} onPress={showStatistics}>
                        <Text style={styles.showStatisticsText}>Посмотреть статистику привлеченных рефералов</Text>
                    </TouchableOpacity>
                    <View style={styles.referralLevels}>
                        <Text style={styles.referralLevelsText}>1 уровень - <Text style={{color: '#F96B5C'}}>10%</Text></Text>
                        <Text style={styles.referralLevelsText}>2 уровень - <Text
                            style={{color: '#F96B5C'}}>5%</Text></Text>
                        <Text style={styles.referralLevelsText}>3 уровень - <Text
                            style={{color: '#F96B5C'}}>3%</Text></Text>
                        <Text style={styles.referralLevelsText}>4 уровень - <Text
                            style={{color: '#F96B5C'}}>1%</Text></Text>
                    </View>
                    <View style={styles.qrCode}>
                        <QRCode value={partnerStats.refLink} size={180}/>
                    </View>
                </ScrollView>
            </ImageBackground>
        </View>
    )
}else{
    return(
        <View>
             <ImageBackground source={require('../../assets/menu.png')} resizeMode="stretch" style={styles.imageBack}></ImageBackground>
        </View>
    )
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 25
    },
    imageBack: {
        flex: 1

    },
    goBack: {
        paddingTop: 35,
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
    referralLink: {
        paddingTop: 10,
        paddingLeft: 25
    },
    copyText: {
        backgroundColor: '#BFDCEC',
        marginRight: 20,
        borderRadius: 30,
        width: 90,
        height: 20

    },
    statistics: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 30,
        backgroundColor: '#F9FEFF'
    },
    showStatisticsButton: {
        paddingTop: 30,
        paddingLeft: 25
    },
    showStatisticsText: {
        color: '#3EAFF2',
        fontFamily: 'roboto',
        fontSize: 16,
        textDecorationLine: 'underline'
    },
    referralLevels: {
        paddingTop: 15,
        paddingLeft: 25
    },
    referralLevelsText: {
        color: '#888888',
        fontFamily: 'roboto',
        fontSize: 16,
        marginBottom: 25
    },
    qrCode: {
        paddingTop: 15,
        alignItems: 'center'
    }
});

