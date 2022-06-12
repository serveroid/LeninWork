import React, { useState, useEffect, useLayoutEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, Dimensions, StatusBar, Image } from 'react-native'
import { setRealtyCategory } from '../../redux/actions.js'


export const RealtyProfile = (props) => {
    const creater = true

    const dispatch = useDispatch()

    //инстанс документа из редакса
    const currentRealty = props.route.params.payload

    //меняем заголовок в шапке
    useLayoutEffect(() => {
        props.navigation.setOptions({
            title: ('Профиль объекта')
        });

    }, []);

    return (
        <ImageBackground source={require('../../assets/menu.png')} resizeMode='stretch' style={styles.imageBack}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.goBack}
                    onPress={() => {
                        props.navigation.goBack();
                    }}
                >
                    <Image source={require('../../assets/backArrow.png')} style={styles.goBackIcon} />
                    <Text style={styles.goBackText}>Вернуться назад</Text>
                </TouchableOpacity>

                <View style={{ borderTopWidth: 3, borderColor: '#F3FBFF' }}>
                    <View style={{ flexDirection: 'row', width: '50%', margin: 14 }}>
                        <View>
                            <Text style={{ fontWeight: 'bold', fontSize: 23, color: '#373737' }}>{currentRealty.name}</Text>
                            <Text style={{ fontWeight: '400', fontSize: 18, color: '#BDBDBD' }}>{currentRealty.description}</Text>
                        </View>
                        <Image style={{ width: 130, height: 204, resizeMode: 'contain', position: 'absolute', marginTop: -35, marginLeft: 230 }} source={ /* currentRealty.images[0] ? { uri: currentRealty.images[0].uri } */ require('../../assets/noPhoto.png')} />
                    </View>
                </View>


                <View style={{ marginLeft: 14, }}>
                    <View s style={{ flexDirection: 'row', marginTop: 10 }}>
                        <Text style={{ color: '#000000' }}>{'Город, регион: '}</Text>
                        <Text style={{ textDecorationLine: 'underline', color: '#3EAFF2' }}>{`${currentRealty.address.city} ${currentRealty.address.street}`}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', marginTop: 10 }}>

                        <Text style={{ textDecorationLine: 'underline', color: '#3EAFF2' }}>{currentRealty.category[0]}, {currentRealty.category[1]}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <Text>{'Площадь: '}</Text>
                        <Text style={{ color: '#373737' }}>{`${currentRealty.areaSize} кв м`}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <Text style={{ fontWeight: 'bold' }}>{'Оплата: '}</Text>
                        <Text style={{ color: '#F96B5C' }}>{`${currentRealty.price} ₽`}</Text>
                    </View>
                </View>
                <View style={{ width: '100%', borderBottomWidth: 3, borderBottomColor: '#F3FBFF', marginTop: 10 }} />

                {creater ?
                    <View style={{ marginLeft: 14, }}>
                        <TouchableOpacity onPress={() => {

                        }} style={{ marginTop: 10 }}>
                            <Text style={{ color: '#F96B5C', textDecorationLine: 'underline' }}>{'Выберите исполнителя'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => {

                            dispatch(setRealtyCategory('Недвижимость', currentRealty.category[0], currentRealty.category[1]));

                            //получаем id документа в бд для изменения/удаления

                            props.navigation.navigate('RealtyCreate', { changeProfile: true, currentRealty: currentRealty })

                        }} style={{ marginTop: 10 }}>
                            <Text style={{ color: '#F96B5C', textDecorationLine: 'underline' }}>{'Изменить объявление'}</Text>
                        </TouchableOpacity>
                    </View>
                    :
                    // Button
                    <View style={{ alignItems: 'center', position: 'absolute', bottom: 5, width: '100%' }}>
                        <TouchableOpacity
                            style={styles.buttonOn}
                            onPress={() => { }}
                            disabled={{}}>
                            <Text style={{ color: '#F9F9F9', fontSize: 20, }}>{'Отправить заявку'}</Text>
                        </TouchableOpacity>
                    </View>
                }
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
        top: '14%',
        width: Dimensions.get('window').width,
        height: (Dimensions.get('window').height * 0.8538),
    },
    buttonOn: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F96B5C',
        borderWidth: 10,
        borderColor: '#FEEAE4',
        borderRadius: 70,
        width: Dimensions.get('window').width * 0.9,
        height: 80
    },
    goBack: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#F3FBFF',
        paddingBottom: 20
    },
    goBackText: {
        color: '#3DB2F4',
        fontSize: 15,
        marginLeft: 7,
        textDecorationLine: 'underline',
        fontWeight: '400',
        fontFamily: 'roboto'
    },
    goBackIcon: {
        width: 13,
        height: 13
    },
})
