import React, {useState} from 'react';
import {
    ImageBackground,
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    Text,
    TextInput,
    StatusBar,
    Dimensions,
} from 'react-native';

import AppLoading from 'expo-app-loading'

import { useDispatch, useSelector } from 'react-redux';
import {login} from '../../redux/actions.js';

export default function AuthLogin(props) {
    const dispatch = useDispatch()

    const [userLogin, setUserLogin] = useState('')
    const setUserLoginHandler = e => setUserLogin(e)
    const [userLoginInput, setUserLoginInput] = useState(true)
    const setUserLoginInputHandler = e => setUserLoginInput(e)

    const [pass, setPass] = useState('')
    const setPassHandler = e => setPass(e)
    const [passInput, setPassInput] = useState(true)
    const setPassInputHandler = e => setPassInput(e)
    const [passHide, setPassHide] = useState(true)
    const setPassHideHandle = e => setPassHide(e)

    const loginHandler = async () => {
            try{
                await dispatch(login(userLogin, pass))
            }catch {
                const errorCode = error.code;
                const errorMessage = error.message;
            }
    }

    const [autoAuthLoaded, setautoAuthLoaded] = useState(false)
    const setautoAuthLoadedHandler = e => setautoAuthLoaded(e)

    if(autoAuthLoaded){
        return (
            <AppLoading
                startAsync ={loginHandler}
                onFinish={() => setautoAuthLoaded(false)}
                onError = {console.warn}
            />
        )
    }

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../../assets/register.png')} resizeMode='stretch' style={styles.imageBack}>
                <Text style = {{color: '#EF6C5B', marginTop: 50, fontWeight: 'bold', fontSize: 23}}>{'Вход'}</Text>

                {/* Электронная почта / Номер телефона */}
                <View style = {{width: '80%', marginTop: 15}}>
                    <Text>{'Электронная почта / Номер телефона'}</Text>
                    <TextInput
                        style = {{borderBottomColor: userLoginInput ? '#6DC2FF' : '#EF6C5B', borderBottomWidth: 3, height: 28}}
                        onChange = {({ nativeEvent: { text} }) => {
                                setUserLoginHandler(text)
                        }}
                        value = {userLogin}
                        keyboardType = {'email-address'}
                        required
                        num
                        onFocus = {() => setUserLoginInputHandler(false)}
                        onEndEditing = {() => {
                            setUserLoginInputHandler(true)
                        }}
                    />
                </View>

                {/* Пароль */}
                <View style = {{width: '80%', marginTop: 15}}>
                    <Text>{'Пароль'}</Text>
                    <TextInput
                        style = {{borderBottomColor: passInput ? '#6DC2FF' : '#EF6C5B', borderBottomWidth: 3, height: 28}}
                        onChange = {({ nativeEvent: { text} }) => {
                            setPassHandler(text)
                        }}
                        value = {pass}
                        secureTextEntry ={passHide}
                        required
                        onFocus = {() => setPassInputHandler(false)}
                        onEndEditing = {() => {
                            setPassInputHandler(true)
                        }}
                    />
                    <TouchableOpacity style = {{position: 'absolute', right: 0, bottom: 6, }} onPress = {() => setPassHideHandle(!passHide)}>
                        <Image style = {{width: 30, height: 20, resizeMode: 'stretch'}} source = {require('../../assets/hideicon.png')}/>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress = {() => {
                    setautoAuthLoadedHandler(true)
                }} style={styles.login}>
                    <Image source={require('../../assets/loginIcon2.png')} style={styles.loginIcon}/>
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
        // justifyContent: 'center',
        alignItems: 'center'
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
        height: 80,
        marginTop: 20
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
