import React from 'react';
import {ImageBackground, View, StyleSheet, TouchableOpacity, Image, Text, Dimensions, StatusBar} from 'react-native';


export default function Register(props) {

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../../assets/background.png')} resizeMode='stretch' style={styles.imageBack}>
                <TouchableOpacity onPress = {() => props.navigation.navigate('RegisterEmail')} style={styles.registration}>
                    <Text style={styles.registrationText}>{'Через E-mail'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress = {() => props.navigation.navigate('RegisterNumber')} style={styles.login}>
                    <Text style={styles.loginText}>{'По номеру телефона'}</Text>
                </TouchableOpacity>
                <Text style={{top: 20}}>{'Выберите способ регистрации'}</Text>
                <TouchableOpacity onPress = {() => props.navigation.navigate('Auth')} style = {{top: 40}}>
                    <Text style={{color: '#F96B5C', textDecorationLine: 'underline', fontSize: 17}}>{'Вернуться на главную'}</Text>
                </TouchableOpacity>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: StatusBar.currentHeight,
        flex: 1
    },
    imageBack: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    registration: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F96B5C',
        borderWidth: 10,
        borderStyle: 'solid',
        borderColor: '#FEEAE4',
        borderRadius: 70,
        width: Dimensions.get('window').width * 0.9,
        height: 80,
        margin: 10,
        marginTop: 100
    },
    registrationText: {
        color: '#F9F9F9',
        fontSize: 25
    },
    login: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F96B5C',
        borderWidth: 10,
        borderStyle: 'solid',
        borderColor: '#FEEAE4',
        borderRadius: 70,
        width: Dimensions.get('window').width * 0.9,
        height: 80,
    },
    loginText: {
        color: '#F9F9F9',
        fontSize: 25
    },
});
