import React, {useState, useEffect, useLayoutEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Dimensions, StatusBar, Keyboard, TextInput, Pressable, Image } from 'react-native'
import { useSelector} from 'react-redux';
import { pushNewReview } from '../../Components/pushNewReview.js';

// import {pullReviewsListData} from '../Components/pullReviews'
// import Rating from '../Components/Rating.js';

export const NewReviewScreen = (props) => {
// Компонет создания резюме


    const userData = useSelector(state=>state.userData);
    const token = useSelector(state => state.token)
    const [descriptionInput, setDescriptionInput] = useState('')

    const [score, setScore] = useState("Нет")

    const [saveError, setSaveError] = useState(false)


    const saveReview = () => {
        // Проверяем написан ли комментарий и есть ли оценка. Если да, то записываем в БД
        if(descriptionInput.length < 4 &&
            score == 'Нет'){
                setSaveError('Напишите отзыв и поставьте оценку')
        }else if(descriptionInput.length < 4){
            setSaveError('Напишите отзыв')
        }else if(score == 'Нет'){
            setSaveError('Поставьте Оценку')
        }else{
            pushNewReview(
                token,
                props.route.params.userId,
                userData.userId,
                descriptionInput,
                score
            );

            props.navigation.goBack();
        }
    }

    const ErrorView = () => {
        // Компонет указывающий, чего не хватает в отзыве
            return(
                <View style={{marginTop: 30}}>
                    <Text style={{color: '#F96B5C', fontSize: 17}}>{saveError}</Text>
                </View>
            )
        }


    //меняем заголовок в шапке
    useLayoutEffect(()=>{
        props.navigation.setOptions({
            title: (
                'Оставить свой отзыв')
        });

    }, []);


    return (
    <Pressable  style={{flex: 1}}
    activeOpacity={1}
    android_disableSound={true}
    onPress={() => Keyboard.dismiss()}
    >
        <ImageBackground source={require('../../assets/menu.png')} resizeMode='stretch' style={styles.imageBack}>
            <View style = {styles.container}>

                <View style = {styles.description}>
                    <Text style = {styles.text}>{'Текст отзыва'}</Text>
                    <TextInput
                        multiline
                        numberOfLines={4}
                        onChangeText={text => setDescriptionInput(text)}
                        value={descriptionInput}
                        editable
                        maxLength = {300}
                        style = {styles.inputDescription}
                    />
                </View>

                <View style={{width: '90%', alignSelf: 'center', marginTop: 20}}>
                    <Text style = {styles.text}>Оцените уровень выполненного заказа</Text>
                    <View style={{flexDirection: 'row' ,marginTop: 10}}>
                        {[1,2,3,4,5].map((el, index)=>
                        <TouchableOpacity
                        key={index}
                        style={{marginLeft: 5}}
                        onPress={() => setScore(el)}
                        >
                            <Image style={{width: 32, height: 32}} source={require('../../assets/star.png')}/>
                        </TouchableOpacity>
                        )}
                    </View>
                    <Text style={{color: '#888888', fontSize: 15, marginTop: 10}}>Оценка: {score}</Text>


                    {saveError ? <ErrorView/> : <View></View>}


                </View>

            </View>

            <View style={{paddingBottom: 40}}>
                <TouchableOpacity style={styles.publishButton}
                    onPress={()=> saveReview()}
                    >
                    <Text style={{fontSize: 19, color: '#f9f9f9'}}>Опубликовать</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    </Pressable>
    )
}

const styles = StyleSheet.create({
    imageBack: {
        marginTop: StatusBar.currentHeight,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    container: {
        flex: 1,
        top: '15%',
    },
    description: {
        width: '90%',
        height: 200,
        alignSelf: 'center'
    },
    text: {
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 16,
        lineHeight: 35,
        color: '#888888'
    },
    inputDescription: {
        width: '100%',
        height: 140,
        backgroundColor: '#FFFFFF',
        borderColor: '#BDBDBD',
        borderWidth: 1,
        borderRadius: 22,
        textAlignVertical: 'top',
        padding: 9,
        color: '#888888',
        fontSize: 16,
    },

    publishButton: {
        alignSelf: 'center',
        backgroundColor: '#f96b5c',
        width: Dimensions.get('window').width * 0.85,
        height: 52,
        borderRadius: 25,
        borderWidth: 3,
        borderColor: '#feeae4',
        alignItems: 'center',
        justifyContent: 'center',

    },
})
