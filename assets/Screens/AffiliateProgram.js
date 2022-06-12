import React, {useLayoutEffect} from 'react';
import {Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import QRCode from 'react-native-qrcode-svg';

export const AffiliateProgram = ({navigation})=>{

    //получаем реферальную ссылку пользователя из редакса, на данном этапе прописываем простую строку
    // const refLink = useSelector(state=>state.refLink)
    const refLink = 'https://www.google.com';

    const balance = 0.00;

    //Получаем количество переходов, регистраций и сумму с сервера или из редакса
    const conversionAmount = 1;
    const registrationAmount = 0;
    const sum = 0;

    //Копируем реферальную ссылку в буфер обмена
    const copyToClipboard = ()=>{
        Clipboard.setString(refLink);
    };

    //переходим в компонент, где отображается статистика по реффералам
    const showStatistics = ()=>{

    };

    //меняем заголовок в шапке
    useLayoutEffect(()=>{
        navigation.setOptions({
            title: ('Партнерский баланс')
        });
    }, []);

    return (
        <View><Text>'dfdfdf</Text></View>
        // <View style={styles.container}>
        //     <ImageBackground source={require('../assets/menu.png')} resizeMode="stretch" style={styles.imageBack}>
        //         <Text style={{fontSize: 20, color: 'red'}}>balance</Text>
        //         <TouchableOpacity style={styles.goBack}
        //                           onPress={()=>{
        //                               navigation.goBack();
        //                           }}
        //         >
        //             <Image source={require('../assets/backArrow.png')} style={styles.goBackIcon}/>
        //             <Text style={styles.goBackText}>Вернуться назад</Text>
        //         </TouchableOpacity>
        //         <ScrollView>
        //             <View style={styles.referralLink}>
        //                 <Text style={{color: '#BDBDBD', fontFamily: 'roboto'}}>Ваша реферальная ссылка</Text>
        //                 <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        //                     <Text style={{color: '#3DB2F4'}}>{refLink}</Text>
        //                     <TouchableOpacity style={styles.copyText} onPress={copyToClipboard}><Text style={{
        //                         color: '#FFFFFF',
        //                         fontFamily: 'roboto',
        //                         textAlign: 'center',
        //                         fontSize: 13
        //                     }}>Копировать</Text></TouchableOpacity>
        //                 </View>
        //             </View>
        //             <View style={styles.statistics}>
        //                 <View>
        //                     <Text style={{color: '#000000', fontFamily: 'roboto'}}>Переходов</Text>
        //                     <Text style={{color: '#F96B5C', textAlign: 'center'}}>{conversionAmount}</Text>
        //                 </View>
        //                 <View>
        //                     <Text style={{color: '#000000', fontFamily: 'roboto'}}>Регистраций</Text>
        //                     <Text style={{color: '#F96B5C', textAlign: 'center'}}>{registrationAmount}</Text>
        //                 </View>
        //                 <View>
        //                     <Text style={{color: '#000000', fontFamily: 'roboto'}}>Сумма оплат</Text>
        //                     <Text style={{color: '#F96B5C', textAlign: 'center'}}>{sum}</Text>
        //                 </View>
        //             </View>
        //             <TouchableOpacity style={styles.showStatisticsButton} onPress={showStatistics}>
        //                 <Text style={styles.showStatisticsText}>Посмотреть статистику привлеченных рефералов</Text>
        //             </TouchableOpacity>
        //             <View style={styles.referralLevels}>
        //                 <Text style={styles.referralLevelsText}>1 уровень - <Text style={{color: '#F96B5C'}}>10%</Text></Text>
        //                 <Text style={styles.referralLevelsText}>2 уровень - <Text
        //                     style={{color: '#F96B5C'}}>5%</Text></Text>
        //                 <Text style={styles.referralLevelsText}>3 уровень - <Text
        //                     style={{color: '#F96B5C'}}>3%</Text></Text>
        //                 <Text style={styles.referralLevelsText}>4 уровень - <Text
        //                     style={{color: '#F96B5C'}}>1%</Text></Text>
        //             </View>
        //             <View style={styles.qrCode}>
        //                 <QRCode value={refLink} size={180}/>
        //             </View>
        //         </ScrollView>
        //     </ImageBackground>
        // </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 25
    },
    imageBack: {
        flex: 1,
        paddingTop: 115
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
