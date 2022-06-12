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
    AsyncStorage
} from 'react-native';
import AppLoading from 'expo-app-loading'

import { useDispatch, useSelector } from 'react-redux';

import { registerEmail } from '../../redux/actions.js';


export default function RegisterEmail(props) {
    const dispatch = useDispatch()

    const [email, setEmail] = useState('')
    const setEmailHandler = e => setEmail(e)
    const [emailInput, setEmailInput] = useState(true)
    const setEmailInputHandler = e => setEmailInput(e)

    const [pass, setPass] = useState('')
    const setPassHandler = e => setPass(e)
    const [passInput, setPassInput] = useState(true)
    const setPassInputHandler = e => setPassInput(e)
    const [passHide, setPassHide] = useState(true)
    const setPassHideHandle = e => setPassHide(e)

    const [rePass, setRePass] = useState('')
    const setRePassHandler = e => setRePass(e)
    const [rePassInput, setRePassInput] = useState(true)
    const setRePassInputHandler = e => setRePassInput(e)
    const [rePassHide, setRePassHide] = useState(true)
    const setRePassHideHandle = e => setRePassHide(e)

    const [fullName, setFullName] = useState('')
    const setFullNameHandler = e => setFullName(e)
    const [fullNameInput, setFullNameInput] = useState(true)
    const setFullNameInputHandler = e => setFullNameInput(e)

    // Стейты для валидации ввода пользователя
    const [emailErr, setEmailErr] = useState(false)
    const [passErr, setPassErr] = useState(false)
    const [rePassErr, setRePassErr] = useState(false)
    const [fullNameErr, setFullNameErr] = useState(false)
    const setEmailErrHandler = e => setEmailErr(e)
    const setPassErrHandler = e => setPassErr(e)
    const setRePassErrHandler = e => setRePassErr(e)
    const setFullNameErrHandler = e => setFullNameErr(e)

    const [errMessage, setErrMessage] = useState('')


    // Ожидание ответа от сервера
    const [autoAuthLoaded, setautoAuthLoaded] = useState(false)
    const setautoAuthLoadedHandler = e => setautoAuthLoaded(e)
    const register = async() => {
        await dispatch(registerEmail(fullName, email, pass))
    }
    if(autoAuthLoaded){
        return (
            <AppLoading
                startAsync ={register}
                onFinish={() => setautoAuthLoaded(false)}
                onError = {console.warn}
            />
        )
    }

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../../assets/register.png')} resizeMode='stretch' style={styles.imageBack}>
                <View style = {{flexDirection: 'row', marginTop: 40}}>
                    <TouchableOpacity onPress = {() => props.navigation.navigate('Register')} style = {{marginLeft: '-20%', marginTop: '-6%'}}>
                        <Text style = {{color: '#F96B5C', fontWeight: 'bold', fontSize: 50}}>{'←'}</Text>
                    </TouchableOpacity>

                    <Text style = {{color: '#F96B5C', fontWeight: 'bold', fontSize: 30, left: 20}}>{'Регистрация'}</Text>
                </View>

                {errMessage ? <Text style = {{color: '#F96B5C'}}>{errMessage}</Text>: <View/>}

                {/* E-mail */}
                <View style = {{width: '80%', marginTop: 15}}>
                    <Text style = {{color: '#888888', fontSize: 17}}>{'Электронная почта'}</Text>
                    <TextInput
                        style = {{borderBottomColor: emailInput ? '#6DC2FF' : '#EF6C5B', borderBottomWidth: 3, height: 28}}
                        onChange = {({ nativeEvent: { text} }) => {
                            setEmailHandler(text)
                        }}
                        value = {email}
                        keyboardType = {'email-address'}
                        required
                        num
                        onFocus = {() => setEmailInputHandler(false)}
                        onEndEditing = {() => {
                            setEmailInputHandler(true)
                            // Валидация ввода
                            if  (/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(email)) {
                                setEmailErrHandler(false)
                            } else {
                                setEmailErrHandler(true)
                            }
                        }}/>
                </View>
                {emailErr ? <Text style = {{color: '#F96B5C', alignItems: 'stretch', width: '80%'}}>{'E-mail введен неверно'}</Text> : <View/>}

                {/* Пароль */}
                <View style = {{width: '80%', marginTop: 15}}>
                    <Text style = {{color: '#888888', fontSize: 17}}>{'Пароль'}</Text>
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
                            // Валидация ввода
                            if  (pass.length >= 6) {
                                setPassErrHandler(false)
                            } else {
                                setPassErrHandler(true)
                            }
                        }}/>
                    <TouchableOpacity style = {{position: 'absolute', right: 0, bottom: 6, }} onPress = {() => setPassHideHandle(!passHide)}>
                        <Image style = {{width: 30, height: 20, resizeMode: 'stretch'}} source = {require('../../assets/hideicon.png')}/>
                    </TouchableOpacity>
                </View>
                {passErr ? <Text style = {{color: '#F96B5C', alignItems: 'stretch', width: '80%'}}>{'Неверный пароль'}</Text> : <View/>}

                {/* Повторите пароль */}
                <View style = {{width: '80%', marginTop: 15}}>
                    <Text style = {{color: '#888888', fontSize: 17}}>{'Повторите пароль'}</Text>
                    <TextInput
                        style = {{borderBottomColor: rePassInput ? '#6DC2FF' : '#EF6C5B', borderBottomWidth: 3, height: 28}}
                        onChange = {({ nativeEvent: { text} }) => {
                            setRePassHandler(text)
                        }}
                        value = {rePass}
                        secureTextEntry ={rePassHide}
                        required
                        onFocus = {() => setRePassInputHandler(false)}
                        onEndEditing = {() => {
                            setRePassInputHandler(true)
                            // Валидация ввода
                            if  (rePass.length >= 6 && rePass === pass) {
                                setRePassErrHandler(false)
                            } else {
                                setRePassErrHandler(true)
                            }
                        }}/>
                    <TouchableOpacity style = {{position: 'absolute', right: 0, bottom: 6, }} onPress = {() => setRePassHideHandle(!rePassHide)}>
                        <Image style = {{width: 30, height: 20, resizeMode: 'stretch'}} source = {require('../../assets/hideicon.png')}/>
                    </TouchableOpacity>
                </View>
                {rePassErr ? <Text style = {{color: '#F96B5C', alignItems: 'stretch', width: '80%'}}>{'Пароли не совпадают'}</Text> : <View/>}

                {/* Имя фамилия */}
                <View style = {{width: '80%', marginTop: 15}}>
                    <Text style = {{color: '#888888', fontSize: 17}}>{'Имя фамилия'}</Text>
                    <TextInput
                        style = {{borderBottomColor: fullNameInput ? '#6DC2FF' : '#EF6C5B', borderBottomWidth: 3, height: 28}}
                        onChange = {({ nativeEvent: { text} }) => {
                            setFullNameHandler(text)
                        }}
                        value = {fullName}
                        required
                        onFocus = {() => setFullNameInputHandler(false)}
                        onEndEditing = {() => {
                            setFullNameInputHandler(true)
                            // Валидация ввода
                            if  (fullName.length >=2) {
                                setFullNameErrHandler(false)
                            } else {
                                setFullNameErrHandler(true)
                            }
                        }}/>
                </View>
                {fullNameErr ? <Text style = {{color: '#F96B5C', alignItems: 'stretch', width: '80%'}}>{'Слишком короткое имя'}</Text> : <View/>}

                <View style = {{flexDirection: 'row', marginTop: 15}}>
                    <Text style = {{fontSize: 12}}>{'Регистрируясь, вы соглашаетесь с '}</Text>
                    <TouchableOpacity>
                        <Text style = {{color: '#F96B5C', textDecorationLine: 'underline', fontSize: 12}}>{'правилами сервиса'}</Text>
                    </TouchableOpacity>
                </View>

                {/* Зарегистрироваться */}
                <TouchableOpacity onPress = {() => {
                    if (/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(email) && pass.length >= 6 && rePass.length >= 6 && rePass === pass && fullName.length >=2) {
                        setautoAuthLoadedHandler(true)
                    } else {
                        setErrMessage('Ошибка')
                    }
                }} style={styles.login}>
                    <Image source={require('../../assets/regbutton.png')} style={styles.loginIcon}/>
                    <Text style={styles.loginText}>{'Зарегистрироваться'}</Text>
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
        backgroundColor: '#F96B5C',
        borderWidth: 10,
        borderStyle: 'solid',
        borderColor: '#FEEAE4',
        borderRadius: 70,
        width: Dimensions.get('window').width * 0.9,
        height: 80,
        marginTop: 20
    },
    loginIcon: {
        width: 30,
        height: 20,
        resizeMode: 'stretch',
        marginRight: 10
    },
    loginText: {
        color: '#F9F9F9',
        fontSize: 25
    },
});
