import React, {useState, useEffect, useLayoutEffect} from 'react';
import { StyleSheet, Text, View, ScrollView, ImageBackground, Dimensions, StatusBar, Image, TouchableOpacity } from 'react-native'

import {db} from '../Components/firebase'
import Rating from '../Components/Rating.js';

export const AllReviews = (props) => {

    const [reviews, setReviews] = useState([])

    //меняем заголовок в шапке
    useLayoutEffect(()=>{
        props.navigation.setOptions({
            title: ('Отзывы о работе')
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

            const data = []
            let i = 0
            for(const key in res.reviews){
                data.push(
                  res.reviews[key]
                )
            }
            setReviews(data)


        })()
    }, [])
    return (
        <ImageBackground source={require('../assets/menu.png')} resizeMode='stretch' style={styles.imageBack}>
            <ScrollView style = {styles.container}>
                <TouchableOpacity onPress = {() => props.navigation.goBack()}>
                    <Text style = {{margin: 5, textAlign: 'center', textDecorationLine: 'underline', color: '#3EAFF2'}}>{'Вернуться назад'}</Text>
                </TouchableOpacity>
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
            </ScrollView>
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
    },
    scrollview: {
        width: Dimensions.get('window').width,
    }
})
