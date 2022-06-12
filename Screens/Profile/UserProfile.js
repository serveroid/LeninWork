import React, { useState, useEffect, useLayoutEffect } from 'react';
import {useSelector} from 'react-redux';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Dimensions, StatusBar, Image } from 'react-native'


import {pullReviewsListData} from '../../Components/pullReviews.js'
import { pullResumeData } from '../../Components/pullResumeData.js';
import Rating from '../../Components/Rating.js';

export const UserProfile = (props) => {

    const [resume, setResume] = useState('')
    const [reviews, setReviews] = useState([])

    const token = useSelector(state => state.token)

    useEffect(()=>{

        //Получаем данные из БД и меняем заголовок в шапке
        const getResumeData = async () => {
            const resumeDataServer = await pullResumeData(token, props.route.params.resumeId);
            setResume(resumeDataServer)
            props.navigation.setOptions(resume.isCustomer ?
                {title: ('Профиль заказчика')}
                :{title: ('Профиль исполнителя')}
            );
        }
        getResumeData()


        // Получаем отзывы о пользователе
        const getReviewsList = async () => {
            const reviewsDataServer = await pullReviewsListData(token, props.route.params.resumeId);
            setReviews(reviewsDataServer);
        };
        getReviewsList();
    }, []);

    if(resume !== ''){
        return (
            <ImageBackground source={require('../../assets/menu.png')} resizeMode='stretch' style={styles.imageBack}>
                <View style = {styles.container}>
                    <View style = {{flexDirection: 'row'}}>
                        {resume.avatar? <Image style = {{width: 100, height: 100, resizeMode: 'contain', margin: 5}} source = {{uri: resume.avatar}}/>:
                            <Image style = {{width: 100, height: 100, resizeMode: 'contain', margin: 5}} source = {require('../../assets/defImg.png')}/>}
                        <View style = {{margin: 5}}>
                            <Text style = {{color: '#373737', fontWeight: 'bold', fontSize: 18, marginBottom: 10}}>{resume.name}</Text>
                            <Text style = {{color: '#373737', fontSize: 14}}>{resume.address}</Text>
                        </View>
                        <TouchableOpacity
                            style = {{position: 'absolute', top: 0, right: 0, width: 30, height: 30, resizeMode: 'contain', margin: 5}}
                        >
                            <Image style = {{position: 'absolute', top: 0, right: 0, width: 30, height: 30, resizeMode: 'contain', margin: 5}} source = {require('../../assets/redact.png')}/>
                        </TouchableOpacity>
                    </View>

                    <Text style = {{marginLeft: 10, marginRight: 10, color: '#BDBDBD'}}>{resume.resumeDescription}</Text>

                    <View style = {{flexDirection: 'row', margin: 10, height: 40}}>
                        <TouchableOpacity style = {{bottom: 0, position: 'absolute'}}
                                          onPress={() => props.navigation.navigate('NewReviewScreen', {userId: resume.userId})}
                        >
                            <Text style = {{textDecorationLine: 'underline', color: '#F96B5C'}}>{'Оставить свой отзыв'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style = {{position: 'absolute', right: 0, bottom: 0}}>
                            <Rating rating = {resume.rating}/>

                            <Text style = {{textDecorationLine: 'underline', color: '#F96B5C'}}>{`Рейтинг ${resume.rating}`}</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style = {{textAlign: 'center', color: '#000000', fontWeight: 'bold', fontSize: 18, marginBottom: 10}}>{'Отзывы о работе'}</Text>

                    <View contentContainerStyle={ styles.scrollview }>
                        {reviews.length ? reviews.slice(0, 2).map( (e, index) =>
                            <View key = {index} style = {{flexDirection: 'row', borderTopWidth: 3, borderBottomWidth: 3, borderTopColor: '#F3FBFF', borderBottomColor: '#F3FBFF', marginBottom: -3}}>
                                {e.photo ?  <Image style = {{top: 0, width: 70, height: 70, resizeMode: 'contain', margin: 5}} source = {{uri: e.photo}}/>:
                                    <Image style = {{top: 0, width: 70, height: 70, resizeMode: 'contain', margin: 5}} source = {require('../../assets/defImg.png')}/>}
                                <View style = {{flex: 1}}>
                                    <Text style = {{fontWeight: 'bold', fontSize: 16, marginBottom: 5}}>{e.name}</Text>
                                    <Text style={{color: '#BDBDBD'}}>{e.description}</Text>
                                    <View style = {{position: 'absolute', right: 0, top: 0, margin: 6}}>
                                        <Rating rating = {e.score}/>
                                    </View>
                                </View>
                            </View>
                        ):<Text style = {{textAlign: 'center', fontWeight: 'bold', fontSize: 25, margin: 30}}>{'Пусто'}</Text>}
                    </View>

                    <TouchableOpacity onPress = {() => props.navigation.navigate('AllReviews', {reviews: reviews})}>
                        <Text style = {{textAlign: 'center', margin: 9, textDecorationLine: 'underline', color: '#F96B5C'}}>{'Смотреть все отзывы'}</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        )
    }else{
        return(
            <View></View>
        )
    }

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
        height: (Dimensions.get('window').height * 0.8538),
        borderTopColor: '#F3FBFF',
        borderTopWidth: 3,
        padding: 15,
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
