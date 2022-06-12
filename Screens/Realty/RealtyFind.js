import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Dimensions, ScrollView, StatusBar, Image } from 'react-native'
import { realty, setRealtyCategory } from '../../redux/actions.js'

export const RealtyFind = (props) => {
    //меняем заголовок в шапке

    const dispatch = useDispatch()
    useLayoutEffect(() => {
        props.navigation.setOptions({
            title: ('Выберите категорию')
        });
    }, []);

    const categories = ['Коммерческая', 'Частная', 'Долгосрочная', 'Краткосрочная']
    const [pickedCategories, setPickedCategories] = useState([])
    const myAdd = useSelector(state => state.realtyAdd)

    const userId = useSelector(state => state.userId)
    const token = useSelector(state => state.token)

    //ограничевает количество показываем символов в описании
    function descSlice(text, count) {
        return text.slice(0, count) + (text.length > count ? "..." : "");
    }



    //записываем объявления из бд в redux


    useEffect(() => {

        fetch("http://193.187.96.43//get_all_estate", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: token }),
        }).then(response => response.json())
            .then(result => {
             let index = 0;
            dispatch({ type: 'clearRealty' })
            result.forEach((doc) => {
                dispatch(realty(doc._id, doc.name, doc.description, doc.images, { city: doc.location[0], street: doc.location[1], streetName: doc.location[2] }, doc.areaSize, doc.price, doc.category));
                index++;
            });
            })
            .catch(error => console.log('error', error));

    }, [])



    return (
        <ImageBackground source={require('../../assets/menu.png')} resizeMode='stretch' style={styles.imageBack}>
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollview} bounces={false}>
                    {/* Поиск недвижимости */}
                    <View style={{ marginTop: 10, borderColor: '#F3FBFF', borderWidth: 3, borderRadius: 30, width: '100%' }}>
                        <Text style={{ fontSize: 20, color: '#888888', fontWeight: 'bold', textAlign: 'center' }}>{'Поиск недвижимости'}</Text>
                        {categories.map((el, index) =>
                            <TouchableOpacity onPress={() => {
                                props.navigation.navigate('RealtyFindList', { category: el, searchInput: false, searchFilter: false })
                            }} key={index} style={{ flexDirection: 'row', borderTopWidth: 3, borderColor: '#F3FBFF' }}>
                                <View style={{ borderRadius: 70, backgroundColor: '#F96B5C', margin: 5 }}>
                                    <Image style={{ width: 20, height: 20, resizeMode: 'contain', margin: 5, backgroundColor: '#F96B5C' }} source={require('../../assets/hotelIcon.png')} />
                                </View>
                                <Text style={{ fontSize: 14, color: '#F96B5C', fontWeight: 'bold', marginBottom: 10, marginTop: 10, marginRight: 5 }}>{el}</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Добавить недвижимость */}
                    <TouchableOpacity style={{ borderWidth: 2, borderColor: '#F96B5C', borderRadius: 70, flexDirection: 'row', marginTop: 10 }}
                        onPress={() => {

                            props.navigation.navigate('RealtyCreate', { changeProfile: false })


                            //временный костыль. Нужен для того, чтобы сбрасывать категории при переходе на создание нового объявления
                            dispatch(setRealtyCategory(undefined, undefined, undefined));
                        }}>
                        <View style={{ borderRadius: 70, backgroundColor: '#F96B5C', margin: 5 }}>
                            <Image style={{ width: 20, height: 20, resizeMode: 'contain', margin: 5, backgroundColor: '#F96B5C' }} source={require('../../assets/hotelIcon.png')} />
                        </View>
                        <Text style={{ fontSize: 14, color: '#F96B5C', fontWeight: 'bold', marginBottom: 10, marginTop: 10, marginRight: 5 }}>{'Добавить недвижимость'}</Text>
                    </TouchableOpacity>

                    {/* Мои объявления */}
                    <Text style={{ color: '#888888', fontSize: 20, fontWeight: 'bold', marginTop: 10 }}>{'Мои объявления'}</Text>
                    <View style={{ marginTop: 10, borderColor: '#F3FBFF', borderWidth: 3, borderRadius: 40, width: '100%', alignItems: 'center' }}>
                        {myAdd.map((el, index) =>
                            <TouchableOpacity key={index} style={{ flexDirection: 'row', width: '90%', borderBottomColor: '#F3FBFF', borderBottomWidth: 3 }}
                                onPress={() => {
                                    props.navigation.navigate('RealtyProfile', { payload: el })
                                }}>
                                <Image style={{ width: 90, height: 90, resizeMode: 'contain' }} source={require('../../assets/defImg.png')} />
                                <View style={{ margin: 5, width: '75%' }}>
                                    <Text style={{ color: '#373737', fontWeight: 'bold', marginBottom: 5 }}>{el.name}</Text>
                                    <Text style={{ fontWeight: '400', fontSize: 18, color: '#BDBDBD' }}>{descSlice(el.description, 65)}</Text>
                                    <Text style={{ color: '#373737', fontWeight: 'bold' }}>{'От ' + el.price + ' ₽'}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>

                </ScrollView>
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        top: '15%',
        width: Dimensions.get('window').width,
        height: (Dimensions.get('window').height * 0.8538),
        alignItems: 'center',
    },
    scrollview: {
        alignItems: 'center',
        width: Dimensions.get('window').width,
    },
    imageBack: {
        marginTop: StatusBar.currentHeight,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
})
