import React, {useState} from 'react';
import {ImageBackground, View, StyleSheet, TouchableOpacity, Image, Text, TextInput, StatusBar, Dimensions} from 'react-native';


export default function RegisterNumber(props) {

    const [number, setNumber] = useState('+7')
    const setNumberHandler = e => setNumber(e)
    const [numberInput, setNumberInput] = useState(true)
    const setNumberInputHandler = e => setNumberInput(e)

    const [code, setCode] = useState('')
    const setCodeHandler = e => setCode(e)
    const [codeInput, setCodeInput] = useState(true)
    const setCodeInputHandler = e => setCodeInput(e)

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
    const [numberErr, setNumberErr] = useState(false)
    const [codeErr, setCodeErr] = useState(false)
    const [passErr, setPassErr] = useState(false)
    const [rePassErr, setRePassErr] = useState(false)
    const [fullNameErr, setFullNameErr] = useState(false)
    const setNumberErrHandler = e => setNumberErr(e)
    const setCodeErrHandler = e => setCodeErr(e)
    const setPassErrHandler = e => setPassErr(e)
    const setRePassErrHandler = e => setRePassErr(e)
    const setFullNameErrHandler = e => setFullNameErr(e)

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../../assets/register.png')} resizeMode='stretch' style={styles.imageBack}>
                <View style = {{flexDirection: 'row', marginTop: 40}}>
                    <TouchableOpacity onPress = {() => props.navigation.navigate('Register')} style = {{marginLeft: '-20%', marginTop: '-6%'}}>
                        <Text style = {{color: '#F96B5C', fontWeight: 'bold', fontSize: 50}}>{'←'}</Text>
                    </TouchableOpacity>

                    <Text style = {{color: '#F96B5C', fontWeight: 'bold', fontSize: 30, left: 20}}>{'Регистрация'}</Text>
                </View>

                {numberErr || codeErr || passErr || rePassErr || fullNameErr ? <Text style = {{color: '#F96B5C'}}>{'Ошибка'}</Text>: <View/>}

                {/* Номер телефона */}
                <View style = {{width: '80%', marginTop: 15}}>
                    <Text style = {{color: '#888888', fontSize: 17}}>{'Номер телефона'}</Text>
                    <TextInput
                        style = {{borderBottomColor: numberInput ? '#6DC2FF' : '#EF6C5B', borderBottomWidth: 3, height: 28}}
                        onChange = {({ nativeEvent: { text} }) => {
                            if (/^\+?\d+$/.test(text) && text.length <= 12 || text == '+') {
                                setNumberHandler(text)
                            }
                        }}
                        value = {number}
                        keyboardType={'phone-pad'}
                        required
                        num
                        onFocus = {() => setNumberInputHandler(false)}
                        onEndEditing = {() => {
                            setNumberInputHandler(true)
                            // Валидация ввода
                            if (number.length == 12) {
                                setNumberErrHandler(false)
                            } else {
                                setNumberErrHandler(true)
                            }
                    }}/>
                </View>
                {numberErr ? <Text style = {{color: '#F96B5C', alignItems: 'stretch', width: '80%'}}>{'Телефон введен неверно'}</Text> : <View/>}

                <TouchableOpacity style = {{width: '80%'}}>
                    <Text style = {{color: '#F96B5C', textDecorationLine: 'underline'}}>{'Отправить СМС с кодом'}</Text>
                </TouchableOpacity>

                {/* Код из СМС сообщения */}
                <View style = {{width: '80%', marginTop: 15}}>
                    <Text style = {{color: '#888888', fontSize: 17}}>{'Код из СМС сообщения'}</Text>
                    <TextInput
                        style = {{borderBottomColor: codeInput ? '#6DC2FF' : '#EF6C5B', borderBottomWidth: 3, height: 28}}
                        onChange = {({ nativeEvent: { text} }) => {
                            if (/\d+$/.test(text) && text.length <= 5 || text.length == '') {
                                setCodeHandler(text)
                            }
                        }}
                        value = {code}
                        keyboardType={'number-pad'}
                        required
                        num
                        onFocus = {() => setCodeInputHandler(false)}
                        onEndEditing = {() => {
                            setCodeInputHandler(true)
                            // Валидация ввода
                            if  (code.length == 5) {
                                setCodeErrHandler(false)
                            } else {
                                setCodeErrHandler(true)
                            }
                    }}/>
                </View>
                {codeErr ? <Text style = {{color: '#F96B5C', alignItems: 'stretch', width: '80%'}}>{'Код введен неверно'}</Text> : <View/>}

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
                    if (number.length == 12 && code.length && pass.length >= 6 && rePass.length >= 6 && rePass === pass && fullName.length >=2) {

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
