import React, {useState, useEffect, useLayoutEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Dimensions, StatusBar, Image } from 'react-native'

export const Messages = (props) => {
    const mes = [
    {userId: 'hdu29cm3k44s', img: '', name: 'Имя пользователя', date: '29.08.2021', time: '16:30', read: false},
    {userId: 'hdu29cm3k44s', img: '', name: 'Имя пользователя', date: '29.08.2021', time: '16:30', read: false},
    {userId: 'hdu29cm3k44s', img: '', name: 'Имя пользователя', date: '29.08.2021', time: '16:30', read: true},
    {userId: 'hdu29cm3k44s', img: '', name: 'Имя пользователя', date: '29.08.2021', time: '16:30', read: true}]

    return (
        <View style = {{flex: 1, marginTop: StatusBar.currentHeight, backgroundColor: '#FFFFFF'}}>
            <View style ={{width: '100%', height: 70, backgroundColor: '#EAFAFF', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity onPress = {() => {
                    props.navigation.goBack()
                }} style = {{position: 'absolute', left: 20}}>
                    <Image source={require('../../assets/backArrow.png')} style={{width: 20, height: 20, tintColor: '#F96B5C', marginTop: 15}}/>
                </TouchableOpacity>

                <View style = {{flexDirection: 'row', marginTop: 15}}>
                    <Image style={{width: 20, height: 20, marginTop: 6, marginRight: 5, tintColor: '#F96B5C'}} source={require('../../assets/startChatIcon.png')}/>
                    <Text style = {{color: '#373737', fontSize: 20}}>{'Сообщения'}</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={{width: Dimensions.get('window').width, backgroundColor: '#EAFAFF'}} bounces = {false}>
                {mes.map((el, index) =>
                <TouchableOpacity onPress = {() => {
                    props.navigation.navigate('Chat', {chatId: el.userId, name: el.name})
                }} key = {index} style = {{width: '100%', height: 50, borderColor: el.read ? '#F3FBFF' : '#FFFFFF', borderWidth: 1, alignItems: 'center', flexDirection: 'row', backgroundColor: el.read ? '#FFFFFF' : '#CDF4FF', borderTopLeftRadius: index == 0 ? 10 : 0, borderTopRightRadius: index == 0 ? 10 : 0}}>
                    <View style = {{backgroundColor: '#F96B5C', width: 25, height: 25, borderRadius: 5, alignItems: 'center', justifyContent: 'center'}}>
                        <Image style={{width: 18, height: 18, tintColor: '#FFFFFF'}} source={require('../../assets/userIcon.png')}/>
                    </View>
                    <Text style ={{color: '#000000', fontSize: 18, marginLeft: 5}}>{el.name}</Text>
                    <View style = {{position: 'absolute', right: 5}}>
                        <Text style = {{color: '#BDBDBD'}}>{el.date}</Text>
                        <Text style = {{textAlign: 'right', fontSize: 17, color: '#A0A0A0'}}>{el.time}</Text>
                    </View>
                </TouchableOpacity>
                )}
            </ScrollView>

        </View>
    )
}
