import React, {useState, useEffect, useLayoutEffect} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, Dimensions, Modal, ScrollView, StatusBar,
    TouchableWithoutFeedback, Pressable, Keyboard } from 'react-native'

import firebase, {db} from '../../Components/firebase.js'

export const CreateTaskPayment = (props) => {

    const [paymentDataInput, setPaymentDataInput] = useState('')
    const [sumInput, setSumInput] = useState('')

    const [chekPaymentDataInput, setChekPaymentDataInput] = useState(false)
    const [chekSumInput, setChekSumInput] = useState(false)

    const setPaymentDataInputHandler = e => setPaymentDataInput(e)
    const setSumInputHandler = e => setSumInput(e)

    const setChekPaymentDataInputHandler = e => setChekPaymentDataInput(e)
    const setChekSumInputHandler = e => setChekSumInput(e)

    const [validateButton, setvalidateButton] = useState(false)
    const validateButtonVoid = () => {
        if (paymentDataInput.length >= 16 && sumInput.length >= 3 && /^\d+$/.test(paymentDataInput) && /^\d+$/.test(sumInput)) {
            setvalidateButton(true)
        } else {
            setvalidateButton(false)
        }
    }

    //меняем заголовок в шапке
    useLayoutEffect(()=>{
        props.navigation.setOptions({
            title: ('Оплата заказа')
        });
    }, []);

    return (
        <ImageBackground source={require('../../assets/menu.png')} resizeMode='stretch' style={styles.imageBack}>
            <TouchableOpacity style = {{top: '15%', marginBottom: 10, alignItems: 'center'}} onPress = {() => {
                    props.navigation.navigate('CreateTask')
                }}>
                    <Text style = {{textDecorationLine: 'underline', color: '#3DB2F4'}}>{'Вернуться назад'}</Text>
            </TouchableOpacity>

            <View style = {styles.container}>
                <ScrollView contentContainerStyle={ styles.scrollview } bounces = {false}>

                    <Text style = {{textAlign: 'center', margin: 10, color: '#888888'}}>{'Для резервирвоания заказа Вам необходимо пополнить Ваш баланс'}</Text>

                    <View style = {{width: '90%', height: 90}}>
                        <Text style = {{color: '#888888', fontSize: 15}}>{'Номер карты'}</Text>
                        <TextInput
                            style = {chekPaymentDataInput ? styles.inputOn : styles.inputOff}
                            value = {paymentDataInput}
                            keyboardType={'number-pad'}
                            required
                            num
                            onKeyPress = {validateButtonVoid}
                            onChangeText = {text => setPaymentDataInputHandler(text)}
                            onFocus = {() => setChekPaymentDataInputHandler(true)}
                            onEndEditing = {() => setChekPaymentDataInputHandler(false)}
                        />
                    </View>
                    <View style = {{width: '90%', height: 30}}>
                        <TouchableOpacity style = {{marginBottom: 15}} onPress = {() => {}}>
                            <Text style = {{textDecorationLine: 'underline', color: '#3DB2F4'}}>{'Выбрать другой вариант оплаты'}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style = {{width: '90%', height: 90}}>
                        <Text style = {{color: '#888888', fontSize: 15}}>{'Сумма пополнения'}</Text>
                        <TextInput
                            style = {chekSumInput ? styles.inputOn : styles.inputOff}
                            value = {sumInput}
                            keyboardType={'number-pad'}
                            required
                            num
                            onKeyPress = {validateButtonVoid}
                            onChangeText = {text => setSumInputHandler(text)}
                            onFocus = {() => setChekSumInputHandler(true)}
                            onEndEditing = {() => setChekSumInputHandler(false)}
                        />
                    </View>

                    <TouchableOpacity
                        style={validateButton ? styles.buttonOn : styles.buttonOff}
                        onPress = {() => {
                            props.navigation.navigate('CreateTask')
                        }}
                        disabled = {!validateButton}>
                        <Text style={{color: '#F9F9F9', fontSize: 20}}>{'Пополнить'}</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    imageBack: {
        marginTop: StatusBar.currentHeight,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    container: {
        top: '15%',
        width: Dimensions.get('window').width,
        height: (Dimensions.get('window').height*0.8538),
        alignItems: 'center',
        borderColor: '#F3FBFF',
        borderWidth: 3
    },

    scrollview: {
        alignItems: 'center',
        width: Dimensions.get('window').width,
        height: '100%'
    },
    inputOff: {
        borderBottomWidth: 4,
        borderBottomColor: '#6DC2FF',
        width: '100%',
        height: 40
    },
    inputOn: {
        borderBottomWidth: 4,
        borderBottomColor: 'red',
        width: '100%',
        height: 40
    },
    buttonOn: {
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
        position: 'absolute',
        bottom: 0,
        marginBottom: 40
    },
    buttonOff: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        borderWidth: 10,
        borderStyle: 'solid',
        borderColor: '#FFFFFF',
        borderRadius: 70,
        width: Dimensions.get('window').width * 0.9,
        height: 80,
        position: 'absolute',
        bottom: 0,
        marginBottom: 40
    },
})
