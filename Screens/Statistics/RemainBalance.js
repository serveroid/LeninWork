import React, { useLayoutEffect } from 'react';
import { StyleSheet, Text, View, ImageBackground, Dimensions, StatusBar } from 'react-native'

export const RemainBalance = (props) => {

    useLayoutEffect(() => {
        props.navigation.setOptions({
            title: ('Остаток на счете')
        });
    }, []);

    return(
        <ImageBackground source={require('../../assets/menu.png')} resizeMode='stretch' style={styles.imageBack}>
            <View style={styles.container}>
                <View style={styles.box}>
                    <Text style={[styles.text, {marginBottom: 10}]}>
                        Списано
                        <Text style={[styles.text, {color: '#3DB2F4'}]}>{` ${props.route.params.price} ₽ `}</Text>
                        на выполнение заказа
                        <Text style={[styles.text, {color: '#F96B5C', textDecorationLine: 'underline'}]}>{` №${props.route.params.taskId} `}</Text>
                    </Text>
                    <Text style={[styles.text, {marginBottom: 15}]}>
                        Начисленно по реферельной программе
                        <Text style={[styles.text, {color: '#3DB2F4'}]}>{` ${props.route.params.price * 0.1} ₽ `}</Text>
                    </Text>
                    <Text style={[styles.text, {color: '#373737'}]}>Остаток на счете</Text>
                    <Text style={[styles.text, {color: '#3DB2F4', fontSize: 34, marginBottom: 15}]}>{` 507,60 ₽ `}</Text>
                    <Text style={[styles.text, {color: '#F96B5C', textDecorationLine: 'underline'}]} onPress={() => props.navigation.navigate('EarningStatistics')}>Посмотреть статистику и баланс</Text>
                </View>
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        height: (Dimensions.get('window').height * 0.8538),
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
    },
    imageBack: {
        marginTop: StatusBar.currentHeight,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    box: {
        backgroundColor: '#FFFFFF',
        borderColor: '#E5F7FF',
        borderWidth: 3,
        padding: 25,
        maxWidth: Dimensions.get('window').width * 0.88,
        borderRadius: 60,
    },
    text: {
        color: '#888888',
        fontSize: 16,
        textAlign: 'center',
    },
})
