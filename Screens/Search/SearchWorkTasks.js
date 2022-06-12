import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Dimensions,
    Image,
    ImageBackground,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ScrollView,
    Pressable,
    Keyboard,
    Modal,
    ActivityIndicator, FlatList
} from 'react-native';


import * as Location from 'expo-location';
import geohash from 'ngeohash'

// import {db} from '../Components/firebase.js';

export const SearchWorkTasks = (props)=>{
    const token = useSelector(state => state.token)
    const category = useSelector(state=>state.category);
    const subCategory = useSelector(state=>state.subCategory);

    const [loading, setLoading] = useState([])


    //меняем заголовок в шапке
    useLayoutEffect(()=>{
        props.navigation.setOptions({
            title: ('Подходящие заказы')
        });
    }, []);

    const [tasks, setTasks] = useState([])


    // useEffect(() => {
    //     (async () => {
    //         if (!props.route.params.parameters) {
    //             const cords = await Location.geocodeAsync(userCity)
    //             const hash = geohash.encode(cords[0].latitude, cords[0].longitude)
    //             const response = await fetch(
    //                 `http://193.187.96.43/search_job_or_performer`,
    //                 {
    //                     method: 'POST',
    //                     headers: {
    //                         'Content-Type': 'application/json'
    //                     },
    //                     body: JSON.stringify({
    //                         'token': token,
    //                         'location': [cords[0].latitude, cords[0].longitude, hash],
    //                         'category': category})
    //                 })
    //         } else {
    //             const response = await fetch(
    //                 `http://193.187.96.43/search_job_or_performer_with_filter`,
    //                 {
    //                     method: 'POST',
    //                     headers: {
    //                         'Content-Type': 'application/json'
    //                     },
    //                     body: JSON.stringify({
    //                         'token': token,
    //                         'location': [cords[0].latitude, cords[0].longitude, hash],
    //                         'category': category,
    //                         'price': props.route.params.parameters.price,
    //                         'radius': props.route.params.parameters.distance
    //                     })
    //                 })
    //         }


    //         if (!response.ok) {

    //             const errorResData = await response.json();
    //             const errorId = errorResData.error.message;
    //             console.log(errorId)
    //             throw new Error(response.message)
    //         }

    //         const resData = await response.json()

    //         if (resData.isError) {
    //             console.log(resData)
    //             throw new Error(resData.message)
    //         } else {
    //             console.log(resData)

    //         }
    //     })()
    // }, [])

    // useEffect(() => {
    //     (async () => {
    //         const cords = await Location.geocodeAsync(userCity)
    //         const range = getGeohashRange(cords[0].latitude, cords[0].longitude, 5)
    //         const data = []
    //         if (!props.route.params.parameters) {
    //             const res = await db.collection('tasks')
    //                 .where("category", "==", category).get()
    //             if (res.empty) {
    //                 console.log('No matching documents.');
    //                 return;
    //             }

    //             res.forEach(el => {
    //                 if (el.data().hash >= range.lower && el.data().hash <= range.upper) {
    //                     data.push(el.data())
    //                 }
    //             })
    //         } else {

    //             const res = await db.collection('tasks')
    //                 .where("category", "==", category).get()
    //             if (res.empty) {
    //                 console.log('No matching documents.')
    //                 return;
    //             }

    //             res.forEach(el => {
    //                 if (el.data().price >= props.route.params.parameters.price && el.data().hash >= props.route.params.parameters.address.lower && el.data().hash <= props.route.params.parameters.address.upper) {
    //                     data.push(el.data())
    //                 }
    //             })
    //         }
    //         setTasks(data)
    //         console.log(data)
    //     })()
    // }, [])



    // Получение всех заданий по выбранной подкатегории
    const getTasks = async () => {

        setLoading(true)

        await fetch('http://193.187.96.43/search_job_or_performer', {
            method: 'POST',
            headers: {
                'Content-type': 'Application/json'
            },
            body: JSON.stringify({
                token: token,
                category: [category, subCategory],
            })
        })
            .then(res => res.json())
            .then(res => setTasks(res[1].tasks))
            .then(() => setLoading(false))

    }

    useEffect(() => {
        props.route.params.tasks ? setTasks(props.route.params.tasks) : getTasks()
    }, [subCategory, props.route.params])

    useEffect(() => {
        tasks.length > 0 ? setLoading(false) : ''
    }, [tasks])

    const Item = ({ item }) => {
        const date = new Date(item.deliveryDate)

        return (
            <TouchableOpacity
                style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderColor: '#F3FBFF', borderWidth: 1, padding: 10 }}
                onPress={() => props.navigation.navigate('StatusScreen', { item: item, imWorker: true })}
            >
                <Image style={{ width: 60, height: 60, resizeMode: 'contain' }}
                    source={{ uri: 'https://ondilo.com/wp-content/uploads/2019/06/pictomiseenroute-5.png' }} />

                <View style={{ width: '80%' }}>
                    {/* <Text style={{ color: '#373737', fontWeight: 'bold' }}>{item.title}</Text> */}
                    <Text style={{ color: '#373737', fontWeight: 'bold' }}>{item.title}</Text>
                    <Text numberOfLines={1} style={{ width: 170, color: '#BDBDBD', fontSize: 14, maxWidth: 210 }}>{item.description}</Text>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <Text style={{ color: '#373737', fontWeight: 'bold' }}>Сдать до:</Text>
                        <Text style={{ width: '30%', fontSize: 16, textAlign: 'center', color: '#3EAFF2' }}>{`${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`}</Text>
                    </View>
                    <Text style={{ fontSize: 14, marginTop: 10 }}>
                        Город, регион:
                        {/* <Text style={{ color: '#3EAFF2' }}>{` ${item.address.city}, ${item.address.street}, ${item.address.streetName}`}</Text> */}
                    </Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: '#373737', fontWeight: 'bold' }}>Оплата:</Text>
                        <Text style={{ color: '#F96B5C', marginLeft: 5 }}>{item.price}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    const renderItem = ({ item }) => {
        return (
            <Item item={item} />
        )
    }


    const Indicator = () => {
        return (
            <Modal
                visible={loading}
                transparent={true}
            >
                <ActivityIndicator size="large" color="#373737"
                    style={{ flex: 1, justifyContent: 'center' }} />
            </Modal>
        )
    }

    return (

        // <Pressable style={{ flex: 1, width: Dimensions.get('window').width, height: Dimensions.get('window').height }}
        //     activeOpacity={1}
        //     android_disableSound={true}
        //     onPress={() => Keyboard.dismiss()}
        // >
        <ImageBackground source={require('../../assets/searchBackground.png')} resizeMode="stretch" style={styles.imageBack}>
            <Indicator />
            <View style={{ marginTop: 50 }}>
                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center' }}
                    onPress={() => props.navigation.navigate('SearchFilter', { work: true })}>
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

                <TouchableOpacity onPress={() => props.navigation.navigate('SearchCategories', { work: true, screen: 'SearchWorkTasks' })}>
                    <Text style={{
                        textDecorationLine: 'underline',
                        color: '#3DB2F4',
                        textAlign: 'center'
                    }}>{`«${category}. ${subCategory}»`}</Text>
                </TouchableOpacity>

            </View>
            {!loading ? <FlatList
                data={tasks}
                renderItem={renderItem}
                keyExtractor={item => item._id}
            /> : <Text>{''}</Text>}
        </ImageBackground>
        // </Pressable>
    );
};

const styles = StyleSheet.create({
    imageBack: {
        marginTop: StatusBar.currentHeight,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    },
    container: {
        top: '5%',
        width: Dimensions.get('window').width,
        marginBottom: 50
    },
    scrollview: {
        width: Dimensions.get('window').width
    }
});
