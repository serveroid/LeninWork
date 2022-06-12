import React from 'react';
import {ImageBackground, View, StyleSheet, TouchableOpacity, Image, Text, Dimensions} from 'react-native';


export default function Auth() {

    return (
        <View style={styles.container}>
            <ImageBackground source={require('./assets/background.png')} resizeMode='stretch' style={styles.imageBack}>
                <TouchableOpacity style={styles.registration}>
                    <Image source={require('./assets/registrationIcon.png')} style={styles.registrationIcon}/>
                    <Text style={styles.registrationText}>Регистрация</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.login}>
                    <Image source={require('./assets/loginIcon.png')} style={styles.loginIcon}/>
                    <Text style={styles.loginText}>Войти</Text>
                </TouchableOpacity>
                <Text style={styles.forgetPassword}>Забыли пароль?</Text>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
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
        marginTop: 70
    },
    registrationIcon: {
        width: 45,
        height: 35,
        resizeMode: 'stretch',
        marginRight: 10
    },
    registrationText: {
        color: '#F9F9F9',
        fontSize: 25
    },
    login: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#6DC2FF',
        borderWidth: 10,
        borderStyle: 'solid',
        borderColor: '#D8F5FD',
        borderRadius: 70,
        width: Dimensions.get('window').width * 0.9,
        height: 80
    },
    loginIcon: {
        width: 45,
        height: 35,
        resizeMode: 'stretch',
        marginRight: 10
    },
    loginText: {
        color: '#F9F9F9',
        fontSize: 25
    },
    forgetPassword: {
        color: '#5F5F5F',
        textDecorationLine: 'underline',
        fontSize: 18,
        marginTop: 10,
        marginLeft: 130
    }
});