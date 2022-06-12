import React, { useEffect, useLayoutEffect, useState } from 'react';
import {useSelector} from 'react-redux';
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
    Pressable,
    Keyboard,
    ScrollView
} from 'react-native';

import Rating from '../../Components/Rating.js';


export const SearchFreelancer = (props)=>{
    const token = useSelector(state => state.token)

    //меняем заголовок в шапке
    useLayoutEffect(()=>{
        props.navigation.setOptions({
            title: ('')
        });
    }, []);

    const req = [1, 2, 3, 4];

    const category = useSelector(state=>state.category);
    const subCategory = useSelector(state=>state.subCategory);


    // const getGeohashRange = (latitude, longitude, distance) => {
    //     const lat = 1/111
    //     const lon = 1/85

    //     const lowerLat = latitude - lat * distance;
    //     const lowerLon = longitude - lon * distance;

    //     const upperLat = latitude + lat * distance;
    //     const upperLon = longitude + lon * distance;

    //     const lower = geohash.encode(lowerLat, lowerLon);
    //     const upper = geohash.encode(upperLat, upperLon);

    //     return {
    //         lower,
    //         upper
    //     };
    // }

    const [tasks, setTasks] = useState([])

    useEffect(() => {
        (async () => {
            if (!props.route.params.parameters) {
                const cords = await Location.geocodeAsync(userCity)
                const hash = geohash.encode(cords[0].latitude, cords[0].longitude)
                const response = await fetch(
                    `http://193.187.96.43/search_job_or_performer`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            'token': token,
                            'location': [cords[0].latitude, cords[0].longitude, hash],
                            'category': category})
                    })
            } else {
                const response = await fetch(
                    `http://193.187.96.43/search_job_or_performer_with_filter`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            'token': token,
                            'location': [cords[0].latitude, cords[0].longitude, hash],
                            'category': category,
                            'rating': props.route.params.parameters.rating,
                            'price': props.route.params.parameters.price,
                            'radius': props.route.params.parameters.distance
                        })
                    })
            }


            if (!response.ok) {

                const errorResData = await response.json();
                const errorId = errorResData.error.message;
                console.log(errorId)
                throw new Error(response.message)
            }

            const resData = await response.json()

            if (resData.isError) {
                console.log(resData)
                throw new Error(resData.message)
            } else {
                console.log(resData)

            }
        })()
    }, [])

    // useEffect(() => {
    //     (async () => {
    //         const cords = await Location.geocodeAsync(userCity)
    //         const hash = geohash.encode(cords[0].latitude, cords[0].longitude)
    //         const range = getGeohashRange(userLatitude, userLongitude, 5)
    //         const data = []
    //         if (!props.route.params.parameters) {
    //             const res = await db.collection('tasks')
    //                 .where("category", "==", category)
    //                 .where("location", "==", [cords[0].latitude, cords[0].longitude, hash]).get()
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
    //                 console.log('No matching documents.');
    //                 return;
    //             }

    //             res.forEach(el => {
    //                 if (el.data().price >= props.route.params.parameters.price && el.data().hash >= props.route.params.parameters.address.lower && el.data().hash <= props.route.params.parameters.address.upper) {
    //                     data.push(el.data())
    //                 }
    //             })
    //         }
    //         setTasks(data)
    //         // console.log(data)
    //     })()
    // }, [])

    return (
        <Pressable  style={{flex: 1,width: Dimensions.get('window').width, height: Dimensions.get('window').height}}
        activeOpacity={1}
        android_disableSound={true}
        onPress={() => Keyboard.dismiss()}
        >
            <ImageBackground source={require('../../assets/searchBackground.png')} resizeMode="stretch" style={styles.imageBack}>
                <View style={{position: 'absolute', width: '60%', left: '15%', right: '15%', top: '2%'}}>
                    <TextInput
                        style={{backgroundColor: '#FFFFFF', borderColor: '#BDBDBD', borderWidth: 2, borderRadius: 22, paddingLeft: 15, paddingRight: 15, height: 29}}
                        maxLength={50}
                        placeholder="Поиск исполнителей"

                    />
                    <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'center', marginLeft: '14%'}}
                                    onPress={()=>props.navigation.navigate('SearchFilter')}>
                        <Image style={{width: 19, height: 19, resizeMode: 'contain', marginTop: 28}}
                            source={require('../../assets/filtr.png')}/>
                        <Text style={{
                            textDecorationLine: 'underline',
                            color: '#FFFFFF',
                            textAlign: 'center',
                            marginTop: 28,
                            marginLeft: 3
                        }}>{'Фильтр'}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.container}>
                    <TouchableOpacity onPress={()=>props.navigation.navigate('SearchCategories', {work: false})}>
                        <Text style={{
                            textDecorationLine: 'underline',
                            color: '#3DB2F4',
                            textAlign: 'center',
                            margin: 10
                        }}>{`«${category}. ${subCategory}»`}</Text>
                    </TouchableOpacity>

                    <ScrollView style={{marginBottom: 28}}>
                        <View style={{borderColor: '#F3FBFF', borderWidth: 2, borderRadius: 30, overflow: 'hidden'}}>
                            {/* Рендерит задания которые будут в будущем браться из бд или еще от куда-то */}
                            {req.map((el, index)=>
                                <TouchableOpacity onPress={()=>props.navigation.navigate('UserProfile')} key={index} style={{
                                    flexDirection: 'row',
                                    flex: 1,
                                    borderTopWidth: index != 0 ? 3 : 0,
                                    borderColor: '#F3FBFF',
                                    backgroundColor: '#FFFFFF'
                                }}>
                                    <Image style={{width: 40, height: 40, resizeMode: 'contain', margin: 5}}
                                        source={{uri: 'https://ondilo.com/wp-content/uploads/2019/06/pictomiseenroute-5.png'}}/>

                                    <View style={{width: '80%'}}>
                                        <Text style={{color: '#373737', fontWeight: 'bold', marginTop: 6}}>{'Имя Фамилия'}</Text>
                                        <Text style={{color: '#BDBDBD', fontSize: 12}}>{'Можно выполнить удаленно'}</Text>
                                        <Text style={{color: '#BDBDBD', fontSize: 12}}>{'Сегодня, 03:32 - 27 августа, 03:30'}</Text>
                                        <View style={{flexDirection: 'row', marginTop: 7, marginBottom: 8}}>
                                            <Text style={{color: '#373737', fontSize: 11}}>{'Город, регион: '}</Text>
                                            <Text style={{color: '#3EAFF2', fontSize: 11}}>{'Таганрог Рост. Обл'}</Text>
                                        </View>
                                        <View style={{flexDirection: 'row', marginBottom: 9}}>
                                            <Text style={{color: '#000000', fontWeight: 'bold', fontSize: 13}}>{'Оплата:'}</Text>
                                            <Text style={{color: '#F96B5C', fontSize: 13}}>{' 4 000 ₽'}</Text>
                                        </View>

                                        <View style={{position: 'absolute', right: 7, top: 13}}>
                                            <Rating rating={4.5}/>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                        </View>
                    </ScrollView>
                </View>
            </ImageBackground>
    </Pressable>
    );
};

const styles = StyleSheet.create({
    imageBack: {
        marginTop: StatusBar.currentHeight,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    },
    container: {
        top: '15%',
        width: Dimensions.get('window').width,
        height: (Dimensions.get('window').height * 0.8538)
    },
    scrollview: {
        width: Dimensions.get('window').width
    }
});
