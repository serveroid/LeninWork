import React, {useState} from 'react';
import {ImageBackground, View, StyleSheet, TouchableOpacity, Image, Text, Dimensions, StatusBar} from 'react-native';

import AppLoading from 'expo-app-loading'
// import { AsyncStorage } from 'react-native'

// import { useDispatch, useSelector } from 'react-redux';

export default function Auth(props) {
    // const dispatch = useDispatch()

    // автологин
    // const autoAuth = async () => {
    //     try {
    //         const userId = await AsyncStorage.getItem('userId')
    //         const apiKey = await AsyncStorage.getItem('apiKey')
    //         if(userId && apiKey) {
    //             await dispatch({type: 'authenticate', userId: userId, apiKey: apiKey})
    //             // props.navigation.reset({
    //             //     index: 0,
    //             //     routes: [{ name: 'UserProfile' }],
    //             // })
    //         } else {

    //         }
    //     } catch(err){

    //         console.log(err.message)
    //     }
    // }
    // const [autoAuthLoaded, setautoAuthLoaded] = useState(false)
    // if(!autoAuthLoaded){
    //     return (
    //       <AppLoading
    //       startAsync ={autoAuth}
    //       onFinish={() => setautoAuthLoaded(true)}
    //       onError = {console.warn}
    //       />
    //     )
    //   }

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../../assets/background.png')} resizeMode='stretch' style={styles.imageBack}>
                <TouchableOpacity onPress = {() => props.navigation.navigate('Register')} style={styles.registration}>
                    <Image source={require('../../assets/registrationIcon.png')} style={styles.registrationIcon}/>
                    <Text style={styles.registrationText}>{'Регистрация'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress = {() => props.navigation.navigate('AuthLogin')} style={styles.login}>
                    <Image source={require('../../assets/loginIcon.png')} style={styles.loginIcon}/>
                    <Text style={styles.loginText}>{'Войти'}</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={styles.forgetPassword}>{'Забыли пароль?'}</Text>
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
