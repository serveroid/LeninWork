import React, { useState, useLayoutEffect} from 'react';
import { Pressable, StyleSheet, Text, View, TouchableOpacity, Image, TextInput, Dimensions, Keyboard, Modal, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getUserData } from '../../redux/actions.js'
import { updatePersonalInfo, sendEmailConfirm } from '../../Components/PersonalInfoComponent.js';


export const PersonalInfoScreen = props => {
    //Страница Личной информации

    const dispatch = useDispatch()
    const userData = useSelector(state=>state.userData);
    const userId = useSelector(state=>state.userId)
    const token = useSelector(state=>state.token)

    const [localUserData, setLocalUserData] = useState(userData)
    const [nameFocus, setNameFocus] = useState(false)
    const [emailFocus, setEmailFocus] = useState(false)
    const [phoneFocus, setPhoneFocus] = useState(false)
    const [telegramFocus, setTelegramFocus] = useState(false)
    const [addressFocus, setAddressFocus] = useState(false)
    const [infoView, setInfoView] = useState(false)
    const [loading, setLoading] = useState(false)


    const EmailConfirm = () => {
        // Рендеринг кнопки "Отправить запрос на подтверждение Email"

        if(emailFocus === true & userData.emailInfo.isConfirm === false){
            return(
                <TouchableOpacity style={styles.emailConfirmStyle}
                onPress={async () => {
                    let result = await sendEmailConfirm(userId, token)
                    console.log(result);
                    if (result === 'Success'){
                        setInfoView('Проверьте почту')
                    }else{
                        setInfoView('Произошла ошибка. Попробуйте позже')
                    }
                }}
                >
                    <Text style={{color: 'white', fontSize: 19, textDecorationLine: 'underline'}}>Отправить подтверждение</Text>
                </TouchableOpacity>
            )
        }else{
            return(<View></View>)
        }
    }

    // Компонент рендеринга заголовка email
    const EmailHeader = () => {
        if(localUserData.emailInfo.isConfirm === false){
            return(<Text style={styles.textStyle}>E-mail адрес (неподтвержден)</Text>)
        }else{
            return(<Text style={styles.textStyle}>E-mail адрес</Text>)
        }
    }

    // Компонент информации о запросе
    const InfoView = () => {

        setTimeout(()=>setInfoView(false), 3000)

        if(infoView === false){
            return(<View></View>)
        }else if (infoView == 'Данные успешно изменены'){
            return(
            <View style={{marginTop: 30, marginLeft: 42}}>
                <Text style={{color: 'green', fontSize: 15}}>{infoView}</Text>
            </View>
            )
        }else{
            return(
            <View style={{marginTop: 30, marginLeft: 42}}>
                <Text style={{color: '#EF6C5B'}}>{infoView}</Text>
            </View>
            )
        }
    }


    const validationAndSendingData = async () => {
        // Валидация данных и отправка на сервер

        if(JSON.stringify(userData) == JSON.stringify(localUserData)){
            setInfoView("Вы не изменили данные")
        }else if(!(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(localUserData.emailInfo.email))){
            setInfoView("Неверный формат email")
        }else if((!(/^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/).test(localUserData.number)) &&
        localUserData.number != false){
            setInfoView("Неверный формат номера телефона")
        }else{
            setLoading(true)
            const result = await updatePersonalInfo(userId, token, localUserData)
            if (result === 'Changed'){
                try{
                    setLoading(false)
                    // Проверяем был ли изменет email, если да, то устанавливаем в redux, что он не подтвержден
                    const changedEmail = localUserData.emailInfo.email === userData.emailInfo.email ? userData.emailInfo.isConfirm : false
                    setLocalUserData({...localUserData,
                        emailInfo: {
                            email: localUserData.emailInfo.email,
                            isConfirm: changedEmail
                    }})
                    dispatch(getUserData(localUserData))
                }catch(err){
                    console.log(err);
                }finally{
                    setInfoView("Данные успешно изменены")
                }

            }else{
                setLoading(false)
                setInfoView('Ошибка')
            }
        }
    }


    useLayoutEffect(() => {
        props.navigation.setOptions({title: (
            <View style={{flexDirection: 'row'}}>
                <Image style={{width: 17, height:23, marginRight: 4, marginTop:3}} source={require('../../assets/fileIcon.png')} />
                <Text style={{ fontSize: 21, color: '#373737' }}>Личная информация</Text>
            </View>
          )});

    }, [])


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

                <View style={nameFocus ? styles.focusInfoItem : styles.infoItem}>

                    <Image style={[styles.imageStyle, {width: 20, height: 27}]} source={require('../../assets/nameLastnameIcon.png')}/>
                    <View>
                        <Text style={styles.textStyle}>Имя/фамилия</Text>

                        <TextInput style={nameFocus ? styles.focusTextInput : styles.textInput}
                            defaultValue={localUserData.name ? localUserData.name : ''}
                            onChangeText={(text) => setLocalUserData({...localUserData, name: text})}
                            onFocus={() => {
                                setNameFocus(true)
                              }}
                              onBlur={() => {
                                setNameFocus(false)
                              }}
                            />

                    </View>
                </View>

                <View style={emailFocus ? styles.focusInfoItem : styles.infoItem}>

                    <Image style={[styles.imageStyle, {width: 23, height: 23}]} source={require('../../assets/emailIcon.png')}/>
                    <View>
                        <EmailHeader/>

                        <TextInput style={emailFocus ? styles.focusTextInput : styles.textInput}
                            defaultValue={localUserData.emailInfo.email ? localUserData.emailInfo.email : ''}
                            onChangeText={(text) => setLocalUserData({...localUserData, emailInfo:{...localUserData.emailInfo, email: text}})}
                            onFocus={() => {
                                setEmailFocus(true)
                              }}
                              onBlur={() => {
                                setEmailFocus(false)
                              }}
                            />

                    </View>

                </View>
                <EmailConfirm/>


                <View style={phoneFocus ? styles.focusInfoItem : styles.infoItem}>

                    <Image style={[styles.imageStyle, {width: 20, height: 30}]} source={require('../../assets/phoneIcon.png')}/>
                    <View>
                        <Text style={styles.textStyle}>Номер телефона</Text>

                        <TextInput style={phoneFocus ? styles.focusTextInput : styles.textInput}
                            defaultValue={localUserData.number ? localUserData.number : ''}
                            onChangeText={(text) => setLocalUserData({...localUserData, number: text})}
                            onFocus={() => {
                                setPhoneFocus(true)
                              }}
                              onBlur={() => {
                                setPhoneFocus(false)
                              }}
                            />

                    </View>
                </View>


                <View style={telegramFocus ? styles.focusInfoItem : styles.infoItem}>

                    <Image style={[styles.imageStyle, {width: 23, height: 23}]} source={require('../../assets/telegramIcon.png')}/>
                    <View>
                        <Text style={styles.textStyle}>Телеграм</Text>

                        <TextInput style={telegramFocus ? styles.focusTextInput : styles.textInput}
                            defaultValue={localUserData.telegram ? localUserData.telegram : ''}
                            onChangeText={(text) => setLocalUserData({...localUserData, telegram: text})}
                            onFocus={() => {
                                setTelegramFocus(true)
                              }}
                              onBlur={() => {
                                setTelegramFocus(false)
                              }}
                            />

                    </View>
                </View>

                <View style={addressFocus ? styles.focusInfoItem : styles.infoItem}>

                    <Image style={[styles.imageStyle, {width: 21, height: 23}]} source={require('../../assets/houseIcon.png')}/>
                    <View>
                        <Text style={styles.textStyle}>Адрес</Text>

                        <TextInput style={addressFocus ? styles.focusTextInput : styles.textInput}
                            defaultValue={localUserData.address ? localUserData.address : ''}
                            onChangeText={(text) => setLocalUserData({...localUserData, address: text})}
                            onFocus={() => {
                                setAddressFocus(true)
                              }}
                              onBlur={() => {
                                setAddressFocus(false)
                              }}
                            />
                    </View>
                </View>

                <InfoView/>

            </View>

            <View style={{backgroundColor: '#FFFFFF', paddingBottom: 30}}>

                <TouchableOpacity style={styles.confirmButton}
                onPress={ () => validationAndSendingData()}
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
        height: Dimensions.get('window').height * 1.5,
        paddingTop: 55,
    },
    body: {
        backgroundColor: '#FFFFFF',
        marginTop: 80,
        borderTopEndRadius: 10,
        borderTopStartRadius: 10,
        borderColor: '#F3FBFF',
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        flex: 1
    },
    infoItem: {
        flexDirection: 'row',
        height: 60,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#F3FBFF',
        paddingLeft: 28,
        paddingBottom: 10,
        paddingTop: 5
    },
    focusInfoItem: {
        flexDirection: 'row',
        height: 60,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#F3FBFF',
        paddingLeft: 28,
        paddingBottom: 10,
        paddingTop: 5,
        backgroundColor: '#FFF0EC'
    },
    focusEmailInfo: {
        flexDirection: 'row',
        height: 60,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#F3FBFF',
        paddingLeft: 28,
        paddingBottom: 10,
        paddingTop: 5,
        backgroundColor: '#FFF0EC'
    },
    textStyle: {
        fontSize: 15,
        color: '#BDBDBD',
    },
    imageStyle: {
        marginLeft: 13,
        marginRight: 20
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
    focusTextInput: {
        fontSize: 19,
        color: '#373737',
        borderBottomWidth: 2,
        borderBottomColor: '#ef6c5b'

    },
    textInput: {
        fontSize: 19,
        color: '#373737',
        borderBottomWidth: 2,
        borderBottomColor: 'white'
    },
    emailConfirmStyle: {
        backgroundColor: '#F96B5C',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
