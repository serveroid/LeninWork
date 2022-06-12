import React, { useState, useLayoutEffect} from 'react';
import { Switch, StyleSheet, Text, View, TouchableOpacity, Keyboard, Image, TextInput, Dimensions, Pressable, Modal, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { requestToChange2FaStatus, sendCodeToChangeStatus } from '../../Components/TwoFaChangeComponent.js';
import { get2FaApi, getUserData } from '../../redux/actions.js';


export const TwoFaScreen = (props) => {

// Станица Двухфакторной авторизации

    const dispatch = useDispatch()
    const userData = useSelector(state=>state.userData);

    const userId = useSelector(state=>state.userId)
    const token = useSelector(state=>state.token)
    const twoFaApi = useSelector(state=>state.twoFaApi)

    const [code, setCode] = useState('');
    const [isEnabled, setIsEnabled] = useState(userData['2FA_status']);
    const [infoView, setInfoView] = useState(false)

    const [loading, setLoading] = useState(false)


    const toggleSwitch = async () => {
        // функция вкл/выкл переключателя для отправки запроса на изменение статуса 2ФА

        setIsEnabled(previousState => !previousState)
        setLoading(true)

        let result = await requestToChange2FaStatus(userId, token)

        try{
            if (!result.isError){
                setInfoView('В течении 1-2 минут на Ваш телефон придет SMS-код \ Введите его в поле для ввода')
                dispatch(get2FaApi(result['2FA_api_key']))
            }else{
                setInfoView('Ошибка. Попробуйте позже')
                setIsEnabled(previousState => !previousState)
            }
        }catch( err ){
            setIsEnabled(previousState => !previousState)
            setInfoView('Ошибка. Попробуйте позже')
            console.log(err);
        }finally{
            setLoading(false)
        }

    }

    // компонент инфорации о запросе
    const InfoView = () => {
        // Сообщение изщезает через некоторое время

        setTimeout(()=>setInfoView(false), 5000)

        if(infoView === false){
            return(<View></View>)
        }else if (infoView == 'В течении 1-2 минут на Ваш телефон придет SMS-код \ Введите его в поле для ввода' ||
            infoView == '2FA статус успешно изменен'){
            return(
                <View style={{marginTop: 30}}>
                    <Text style={{color: 'green', fontSize: 15}}>{infoView}</Text>
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

    // отправляем код 2ФА на сервер временно код 0000
    const sendCodeHandler = async (token, twoFaApi, code) => {
        if (code.length < 5){
            setInfoView('Код должен быть не менее 5 символов')
        }else if(!twoFaApi){
            setInfoView('Ошибка. Попробуйте позже')
        }else{
            try{
                setLoading(true)
                let result = await sendCodeToChangeStatus(token, twoFaApi, code)

                if (result.message == "status changed"){
                    setInfoView('2FA статус успешно изменен')
                    dispatch(getUserData({...userData, '2FA_status':!userData['2FA_status']}));
                }
            }catch(err){
                console.log(err);
            }finally{
                setLoading(false)
            }

        }
    }


    useLayoutEffect(() => {
        props.navigation.setOptions({title: (
                <View style={{flexDirection: 'row'}}>
                    <Image style={{width: 19, height: 22, marginRight: 4, marginTop:3}} source={require("../../assets/lockIcon.png")} />
                    <Text style={{ fontSize: 19, color: '#373737' }}>Аутентификация</Text>
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

                <View style={styles.twoFaSwich}>
                    <Text style={[styles.textStyle, {color:'#373737'}]}>Включена</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#B2EEFF" }}
                        thumbColor={isEnabled ? "#B2EEFF" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                        style={{marginRight: 30}}
                    />
                </View>

                <View style={styles.smsInputView}>
                    <Text style={[styles.textStyle, {color:'#888888'}]}>Пароль из SMS сообщения</Text>
                    <TextInput
                        style={styles.textInput}
                        defaultValue={code}
                        onChangeText={(text) => setCode(text)}
                        // onEndEditing={}
                        autoCorrect={false}
                        disableFullscreenUI={true}
                        maxLength={8}
                        keyboardType={'numeric'}
                        autoFocus={true}/>
                </View>

                <InfoView/>

            </View>

            <View style={{backgroundColor: '#FFFFFF', paddingBottom: 30}}>

                <TouchableOpacity style={styles.confirmButton}
                                  onPress={() => sendCodeHandler(token, twoFaApi, code)}
                >
                    <Image style={{ width: 15, height:15}} source={require("../../assets/confirmIcon.png")} />
                    <Text style={{fontSize: 19, color: '#f9f9f9', marginLeft: 55}}>Подтвердить</Text>
                </TouchableOpacity>

            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height *1.5,
        backgroundColor: '#D8F5FD',
        paddingTop: 55,
    },
    body: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        marginTop: 90,
        borderTopEndRadius: 10,
        borderTopStartRadius: 10,
        borderColor: '#F3FBFF',
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        paddingLeft: 38,
    },

    twoFaSwich: {
        flexDirection: 'row',
        height: 60,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#F3FBFF',
        justifyContent: 'space-between'
    },
    textStyle: {
        fontSize: 19,

    },
    smsInputView: {
        justifyContent: 'center',
        height: 100,
        borderBottomWidth: 1,
        borderColor: '#F3FBFF',
    },
    textInput: {
        height: 36,
        width: 100,
        borderBottomWidth: 2,
        borderColor: '#EF6C5B',
        padding: 10,
        fontSize: 16,
        color: '#373737',
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
        paddingLeft: 30,
    }

})
