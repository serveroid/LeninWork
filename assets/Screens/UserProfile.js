import React, {useState, useEffect, useLayoutEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Dimensions, StatusBar, Image } from 'react-native'

import {db} from '../Components/firebase'
import Rating from '../Components/Rating.js';

export const UserProfile = (props) => {
    const [photo, setPhoto] = useState(null)
    const [fullName, setFullName] = useState('')
    const [address, setAddress] = useState('')
    const [aboutUser, setAboutUser] = useState('')

    const [rating, setRating] = useState(4.5)

    const [reviews, setReviews] = useState([])

    //меняем заголовок в шапке
    useLayoutEffect(()=>{
        props.navigation.setOptions({
            title: ('Профиль исполнителя')
        });
    }, []);

    useEffect(() => {
        (async () => {
            let res = await db.collection('users').doc('userId').collection('resume').doc('Jx6vHBl2evYzSzxPeKG1').get()
            if (res.empty) {
                console.log('No matching documents.');
                return;
            }
            res = res.data()
            setPhoto(res.photo)
            setFullName(res.fullName)
            setAddress(`${res.address.city}, ${res.address.street}`)
            setAboutUser(res.aboutm)

            const data = []
            let i = 0
            for(const key in res.reviews){
                data.push(
                  res.reviews[key]
                )
                i++
                if (i>=3){break}
            }
            setReviews(data)


        })()
    }, [])

    return (
        <ImageBackground source={require('../assets/menu.png')} resizeMode='stretch' style={styles.imageBack}>
            <View style = {styles.container}>
                   <View style = {{flexDirection: 'row'}}>
                        {photo? <Image style = {{width: 100, height: 100, resizeMode: 'contain', margin: 5}} source = {{uri: photo}}/>:
                                <Image style = {{width: 100, height: 100, resizeMode: 'contain', margin: 5}} source = {require('../assets/defImg.png')}/>}
                        <View style = {{margin: 5}}>
                            <Text style = {{color: '#373737', fontWeight: 'bold', fontSize: 18, marginBottom: 10}}>{fullName}</Text>
                            <Text style = {{color: '#373737', fontSize: 14}}>{address}</Text>
                        </View>
                        <Image style = {{position: 'absolute', top: 0, right: 0, width: 30, height: 30, resizeMode: 'contain', margin: 5}} source = {require('../assets/redact.png')}/>
                    </View>
                
                    <Text style = {{marginLeft: 10, marginRight: 10}}>{aboutUser}</Text>

                    <View style = {{flexDirection: 'row', margin: 10, height: 40}}>
                       <TouchableOpacity style = {{bottom: 0, position: 'absolute'}}>
                           <Text style = {{textDecorationLine: 'underline', color: '#F96B5C'}}>{'Оставить свой отзыв'}</Text>
                       </TouchableOpacity>
                       
                       <TouchableOpacity style = {{position: 'absolute', right: 0, bottom: 0}}>
                            <Rating rating = {rating}/>

                           <Text style = {{textDecorationLine: 'underline', color: '#F96B5C'}}>{`Рейтинг ${rating}`}</Text>
                       </TouchableOpacity>
                    </View>

                     <Text style = {{textAlign: 'center', color: '#000000', fontWeight: 'bold', fontSize: 18, marginBottom: 10}}>{'Отзывы о работе'}</Text>

                     <View contentContainerStyle={ styles.scrollview }>
                        {reviews.length ? reviews.map( (e, index) =>
                            <View key = {index} style = {{flexDirection: 'row', borderTopWidth: 3, borderBottomWidth: 3, borderTopColor: '#F3FBFF', borderBottomColor: '#F3FBFF', marginBottom: -3}}>
                                {e.photo ?  <Image style = {{top: 0, width: 70, height: 70, resizeMode: 'contain', margin: 5}} source = {{uri: e.photo}}/>:
                                            <Image style = {{top: 0, width: 70, height: 70, resizeMode: 'contain', margin: 5}} source = {require('../assets/defImg.png')}/>}
                                <View style = {{flex: 1}}>
                                    <Text style = {{fontWeight: 'bold', fontSize: 16, marginBottom: 5}}>{e.name}</Text>
                                    <Text>{e.reviev}</Text>
                                    <View style = {{position: 'absolute', right: 0, top: 0, margin: 6}}>
                                        <Rating rating = {e.rating}/>
                                    </View>
                                </View>
                            </View>
                        ):<Text style = {{textAlign: 'center', fontWeight: 'bold', fontSize: 25, margin: 30}}>{'Пусто'}</Text>}
                     </View>

                     <TouchableOpacity onPress = {() => props.navigation.navigate('AllReviews')}>
                         <Text style = {{textAlign: 'center', margin: 9, textDecorationLine: 'underline', color: '#F96B5C'}}>{'Смотреть все отзывы'}</Text>
                     </TouchableOpacity>
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
        borderTopColor: '#F3FBFF',
        borderTopWidth: 3,
    },
    scrollview: {
        width: Dimensions.get('window').width,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    modalView: {
        width: '97%',
        height: 200,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 10,
    },
    city: {
        width: '100%',
        height: 70,
    },
    fullstreet: {
        width: '97%',
        height: 70,
        flexDirection: 'row'
    },
    street: {
        width: '80%',
        height: 70,
    },
    streetname: {
        marginLeft: 10, 
        width: '20%',
        height: 70,
    },
    button: {
        borderRadius: 20,
        padding: 7,
        margin: 10
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#3DB2F4",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
})
