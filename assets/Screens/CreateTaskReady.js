import React, {useState, useEffect, useLayoutEffect} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, Dimensions, Image, ScrollView, StatusBar, 
    TouchableWithoutFeedback, Pressable, Keyboard } from 'react-native'

import firebase, {db} from '../Components/firebase'

export const CreateTaskReady = (props) => {
    const timer = setTimeout(() => {props.navigation.replace('CreateTaskStatus')}, 2000)

    //меняем заголовок в шапке
    useLayoutEffect(()=>{
        props.navigation.setOptions({
            title: ('Заказ создан')
        });
    }, []);

    return (
        <ImageBackground source={require('../assets/menu.png')} resizeMode='stretch' style={styles.imageBack}>
            <View style = {styles.container}>
               <View style = {styles.box}>
                   <Image style = {styles.recycle} source = {require('../assets/recycle.png')}/>

                <TouchableOpacity style = {{position: 'absolute', top: -10, right: -10}}
                    onPress = {() => {
                        clearTimeout(timer)
                        props.navigation.replace('CreateTaskStatus')
                    }}>
                    <Image style = {{width: 50, height: 50, resizeMode: 'contain',}} source = {require('../assets/CloseIcon.png')}/>
                </TouchableOpacity>
                   <View>
                       <Text style = {styles.text}>{'Ваш заказ'}</Text>
                       <Text style = {styles.text}>{'№246842'}</Text>
                       <Text style = {styles.text}>{'отправлен потенциальным исполнителям!'}</Text>
                   </View>
               </View>
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
        justifyContent: 'center'
    },
    box: {
        height: 333,
        width: '90%',

        alignItems: 'center',

        borderWidth: 3,
        borderColor: '#E6F7FF',
        borderRadius: 60,
        backgroundColor: '#cdf4ff'
    },
    recycle: {
        top: 0,
        width: 100,
        height: 100,
        resizeMode: 'contain',
        margin: 10
    },
    text: {
        textAlign: 'center',
        fontSize: 20,
        margin: 5
    }
})