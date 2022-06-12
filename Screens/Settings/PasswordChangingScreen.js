import React, { useState, useLayoutEffect} from 'react';
import { TouchableHighlight, StyleSheet, Text, View, TouchableOpacity, Image, Keyboard, Dimensions, Pressable ,TextInput, Modal, ActivityIndicator } from 'react-native';
import { sendNewPasswond } from '../../Components/SendNewPassword.js';
import { useSelector } from 'react-redux';




export const PasswordChangingScreen = (props) => {
    //Страница смены пароля

    const userId = useSelector(state=>state.userId)
    const token = useSelector(state=>state.token)

    const [showPassword, SetShowPassword] = useState(false)
    const [infoView, setInfoView] = useState(false)
    const [newPasswordLength, setNewPasswordLength] = useState(true)
    const [newPasswordMatch, setNewPasswordMatch] = useState(true)
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [secondNewPassword, setSecondNewPassword] = useState('')
    const [loading, setLoading] = useState(false)

    useLayoutEffect(() => {
        props.navigation.setOptions({title: (
            <View style={{flexDirection: 'row'}}>
                <Image style={{width: 23, height:23, marginRight: 4, marginTop:3}} source={require('../../assets/keyIcon.png')} />
                <Text style={{ fontSize: 21, color: '#373737' }}>Смена пароля</Text>
            </View>
          )});

    }, [])

    // компонент информации о запросе
    const InfoView = () => {
        // Сообщение изщезает через некоторое время

        setTimeout(()=>setInfoView(false), 5000)

        if(infoView === false){
            return(<View></View>)
        }else if (infoView == 'Пароль изменен'){
            return(
            <View style={{marginTop: 30}}>
                <Text style={{color: 'green'}}>{infoView}</Text>
            </View>
            )
        }else{
            return(
            <View style={{marginTop: 30}}>
                <Text style={{color: '#EF6C5B'}}>{infoView}</Text>
            </View>
            )
        }
    }


    // кнопка скрытия пароля
    const EyeImageRender = () =>{
        if(showPassword === false){
            return(
                <TouchableOpacity
                onPress={()=> SetShowPassword(true)}>
                    <Image style={{width: 24, height:16}}source={require('../../assets/closedEyeIcon.png')}/>
                </TouchableOpacity>
            )
        }else{
            return(
                <TouchableOpacity
                onPress={()=> SetShowPassword(false)}>
                    <Image style={{width: 24, height:16}}source={require('../../assets/eyeIcon.png')}/>
                </TouchableOpacity>
            )
        }
    }

    // проверка нового пароля
    const NewPasswordCheck = () => {
        if(!newPasswordLength){
            return(
            <View style={{height: 15}}>
                <Text style={{color: '#EF6C5B'}}>Пароль слишком короткий</Text>
            </View>)
        }else{
            return(<View style={{height: 15}}></View>)
        }
    }

    // проверка совпадения паролей
    const NewPasswordMatch = () => {
        if(!newPasswordMatch){
            return(
            <View style={{height: 15}}>
                <Text style={{color: '#EF6C5B'}}>Пароли не совпадают</Text>
            </View>)
        }else{
            return(<View style={{height: 15}}></View>)
        }
    }


    return(
        <Pressable  style={{flex: 1}}
                    activeOpacity={1}
                    android_disableSound={true}
                    onPress={() => Keyboard.dismiss()}
                    style={styles.container}>
            <View style={styles.body}>

                {/* Компонент индикатора загрузки  */}
                <Modal
                    visible={loading}
                    transparent={true}
                    >
                    <ActivityIndicator size="large" color="#373737"
                    style={{flex: 1, justifyContent: "center"}}/>
                </Modal>


                <TouchableHighlight  touchSoundDisabled={true}>
                    <View style={styles.itemStyle}>
                        <Text style={styles.text}>Введите старый пароль</Text>
                            <View style={styles.textInputView}>
                                    <TextInput
                                        secureTextEntry={!showPassword}
                                        autoCorrect={false}
                                        defaultValue={oldPassword}
                                        onChangeText={text => setOldPassword(text)}
                                        style={{width: 200}}
                                    />
                                <EyeImageRender/>
                            </View>
                    </View>
                </TouchableHighlight>

                <TouchableHighlight  touchSoundDisabled={true}>
                    <View style={styles.itemStyle}>
                        <Text style={styles.text}>Новый Пароль</Text>
                            <View style={[styles.textInputView, {borderBottomColor: '#6DC2FF'}]}>
                                    <TextInput
                                        secureTextEntry={!showPassword}
                                        autoCorrect={false}
                                        defaultValue={newPassword}
                                        onChangeText={text => setNewPassword(text)}
                                        style={{width: 200}}
                                        onEndEditing = {() => {
                                            // Валидация ввода
                                            if  (newPassword.length < 6) {
                                                setNewPasswordLength(false)
                                            } else {
                                                setNewPasswordLength(true)
                                            }
                                        }}
                                    />
                                <EyeImageRender/>
                            </View>
                    </View>
                </TouchableHighlight>
                <NewPasswordCheck/>

                <TouchableHighlight  touchSoundDisabled={true}>
                    <View style={styles.itemStyle}>
                        <Text style={styles.text}>Повторите новый пароль</Text>
                            <View style={[styles.textInputView, {borderBottomColor: '#6DC2FF'}]}>
                                    <TextInput
                                        secureTextEntry={!showPassword}
                                        autoCorrect={false}
                                        defaultValue={secondNewPassword}
                                        onChangeText={text => setSecondNewPassword(text)}
                                        style={{width: 200}}
                                        onEndEditing = {() => {
                                            // Валидация ввода
                                            if  (secondNewPassword.length < 6 || secondNewPassword !== newPassword) {
                                                setNewPasswordMatch(false)
                                            } else {
                                                setNewPasswordMatch(true)
                                            }
                                        }}
                                    />
                                <EyeImageRender/>
                            </View>
                    </View>
                </TouchableHighlight>
                <NewPasswordMatch/>

                <InfoView/>
            </View>

            <View style={{ backgroundColor: 'white', paddingBottom: 30}}>

                <TouchableOpacity style={styles.confirmButton}
                onPress={ async () =>{
                    if (secondNewPassword === oldPassword){
                        setInfoView('Новый пароль должен отличатся')
                    }
                    else if (newPasswordMatch === true &&
                        oldPassword !== '' &&
                        secondNewPassword !== ''){
                        setLoading(true)
                        const result = await sendNewPasswond(userId, token, oldPassword, secondNewPassword)
                        console.log(result);
                        setLoading(false)
                        if(result == 'The old password is wrong'){
                            setInfoView("Старый пароль введен не правильно")
                        }else if (result == 'Changed'){
                            setInfoView("Пароль изменен")
                        }else{
                            setInfoView("Ошибка")
                        }
                    }else{
                        setInfoView('Проверьте ввод')
                    }
                }}
                >
                    <Text style={{fontSize: 19, color: '#f9f9f9'}}>Сохранить изменения</Text>
                </TouchableOpacity>

            </View>
        </Pressable>

    )
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#EAFAFF',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height*1.5,
        paddingTop: 55,
    },
    body: {
        backgroundColor: '#FFFFFF',
        marginTop: 90,
        borderTopEndRadius: 10,
        borderTopStartRadius: 10,
        borderColor: '#F3FBFF',
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        flex: 1,
        paddingHorizontal: 50
    },
    confirmButton: {
        alignSelf: 'center',
        backgroundColor: '#f96b5c',
        flexDirection: 'row',
        width: Dimensions.get('window').width * 0.85,
        height: 52,
        borderRadius: 25,
        borderWidth: 3,
        borderColor: '#feeae4',
        alignItems: 'center',
        justifyContent: 'center'
    },
    textInputView: {
        flexDirection: 'row',
        borderBottomColor: '#EF6C5B',
        borderBottomWidth: 2,
        justifyContent: 'space-between',
        paddingTop: 5
    },
    itemStyle: {
        paddingTop: 35
    },
    text: {
        fontSize: 16,
        color: '#888888'
    }

})
