import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Dimensions, ScrollView, StatusBar, Image, TextInput } from 'react-native'
import {  setRealtyCategory } from '../../redux/actions.js'

export const RealtyFindList = (props) => {
    //меняем заголовок в шапке
    useLayoutEffect(() => {
        props.navigation.setOptions({
            title: ('')
        });

    }, []);

    const dispatch = useDispatch()

    const [searchInput, setSearhInput] = useState('')

    const setSearhInputHandler = e => setSearhInput(e)

    const myAdd = useSelector(state => state.realtyAdd)

    let searchList = [];

    console.log(props.route.params.searchFilter)
    //функция подсчета дистанции в км
    function GetDistance(lat1, lon1, lat2, lon2) {
        let p = 0.017453292519943295;    // Math.PI / 180
        let c = Math.cos;
        let a = 0.5 - c((lat2 - lat1) * p) / 2 +
            c(lat1 * p) * c(lat2 * p) *
            (1 - c((lon2 - lon1) * p)) / 2;

        return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
    }


    if (props.route.params.searchInput != false) {             //поиск по поисковой строке
        searchList = myAdd.filter(add => add.name.includes(props.route.params.searchInput))
    }
    else if (props.route.params.searchFilter != false) {       //поиск по фильтрам
        const searchFilter = props.route.params.searchFilter
        searchList = myAdd.filter(item => {
            item.price = item.price.replace(/ /g, '')
            if (parseInt(item.areaSize) >= parseInt(searchFilter.area)) {
                if (parseInt(item.price) >= parseInt(searchFilter.price)) {
                    if ((searchFilter.subCategoryOne == item.category[0] || item.category[1]) || (searchFilter.subCategoryTwo == item.category[1] || item.category[0])) {
                        return true
                    }
                }
            }
        });
        searchList = searchList.filter(item => {
            if (searchFilter.latitude != null && item.latitude != null) {
                if (GetDistance(searchFilter.latitude, searchFilter.longitude, item.latitude, item.longitude) > searchFilter.value) {
                    return true
                }
            } else {
                return true
            }
        })
    } else {                                                    //поиск по категориям
        searchList = myAdd.filter(add => add.category[0] == props.route.params.category || add.category[1] == props.route.params.category)
    }



    //ограничевает количество показываемых символов в описании
    function descSlice(text, count) {
        return text.slice(0, count) + (text.length > count ? "..." : "");
    }

    return (
        <ImageBackground source={require('../../assets/menu.png')} resizeMode='stretch' style={styles.imageBack}>
            <View style={{ position: 'absolute', width: '60%', left: '15%', right: '15%', top: '3%' }}>
                <TextInput
                    onChangeText={text => {
                        setSearhInputHandler(text)
                    }}
                    onSubmitEditing={() => props.navigation.navigate('RealtyFindList', { searchInput: searchInput, searchFilter: false })}
                    style={{ backgroundColor: '#FFFFFF', borderColor: '#BDBDBD', borderWidth: 2, borderRadius: 22 }}
                />
                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', marginLeft: '14%' }}
                    onPress={() => {
                        dispatch(setRealtyCategory(undefined, undefined, undefined));
                        props.navigation.navigate('RealtyFindFilter')
                    }}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain', marginTop: 10 }}
                        source={require('../../assets/filtr.png')} />
                    <Text style={{
                        textDecorationLine: 'underline',
                        color: '#FFFFFF',
                        textAlign: 'center',
                        margin: 10
                    }}>{'Фильтр'}</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollview} bounces={false}>
                    <View style={{ marginTop: 10, borderColor: '#F3FBFF', borderWidth: 3, borderRadius: 40, width: '100%', alignItems: 'center' }}>
                        {searchList.map((el, index) =>
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
