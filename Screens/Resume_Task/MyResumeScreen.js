import React, {useEffect, useLayoutEffect, useState} from 'react';
import {Dimensions, FlatList, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {ImageViewer} from '../../Components/ImageViewer.js';
import {useDispatch, useSelector} from 'react-redux';
import Rating from '../../Components/Rating.js'
import * as Location from 'expo-location';

// Страница моего резюме
const MyResumeScreen = props=>{

    const dispatch = useDispatch()
    const userData = useSelector(state=>state.userData);

    const [userCity, setUserCity] = useState('')
    const [userStreet, setUserStreet] = useState('')

    useEffect(() => {
        getUserCity(+userData.resume.location[0], +userData.resume.location[1])
    }, [])

    const getUserCity = async (latitude, longitude) => {

        let response = await Location.reverseGeocodeAsync({
            latitude,
            longitude
        });

        for (let item of response) {
            setUserCity(item.city);
            setUserStreet(item.street);
        }

    }

    const splitCategories = () => {

        let list = '«'

        for(let i = 1; i <= userData.resume.categories.length; i++){
            list += userData.resume.categories[i - 1]

            if ( i % 2 == 0 ) {
                list += '»'
                list += "\n"
                
                if ( i != userData.resume.categories.length){
                    list += '«'
                }

            }
            else list += '. '
        }

        return(
            list
        )

    }

    const [viewMoreСondition, setViewMoreCondition] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);


    useLayoutEffect(()=>{
        props.navigation.setOptions({title: 'Мое резюме'});
    }, []);

    // Компонент рендеринга картинок в зависимости от кол-ва
    const RenderImage = () => {

        const renderItem = ({item}) => (
            <Image source={{uri: item.url}} style={{height: 30, width: 30, margin: 5}}/>
        );

        if (userData.resume.images.length > 1) {
            return (
                <View style={{flexDirection: 'row', flexWrap: 'wrap', width: '76%', height: '70%'}}>
                    <TouchableOpacity
                        onPress={()=>{
                            setModalVisible(true);
                        }}>
                        <Image accessible={true} source={{uri: userData.resume.images[0].url}} style={styles.noPhotoIcon}/>

                        <View style={{margin: 5}}>
                            <FlatList
                                data={userData.resume.images.filter(item=>item.id != '0')}
                                renderItem={renderItem}
                                horizontal={true}
                                keyExtractor={item=>item.id.toString()}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            );
        } else if (userData.resume.images.length === 1) {
            return (
                <View style={{flexDirection: 'row', flexWrap: 'wrap', width: '76%', height: '70%'}}>
                    <TouchableOpacity
                        onPress={()=>{
                            setModalVisible(true);
                        }}>
                        <Image source={{uri: userData.resume.images[0].url}} style={styles.noPhotoIcon}/>
                    </TouchableOpacity>
                </View>
            );
        } else {
            return (
                <Image source={require('../../assets/noPhoto.png')} style={styles.noPhotoIcon}/>
            );
        }
    };

    //проверяем стаж работы и рендерим количество лет и месяцев
    const ExperienceBlock = () => {

        fullYears = Math.trunc(userData.resume.experience/12)
        fullMonths = userData.resume.experience%12

        const years = () =>{

            if(fullYears === 1){
                return('год')
            }else if(1 < fullYears && fullYears <= 4){
                return('года')
            }else{
                return('лет')
            }
        }

        if(fullMonths === 0 &&
            userData.resume.experience >= 12){
            return(
                <Text style={styles.experienceValue}>{`${fullYears}`} {years()}</Text>
            )
        }
        else if(fullMonths !== 0 &&
            userData.resume.experience >= 12){
            return(
                <Text style={styles.experienceValue}>{`${fullYears}`} {years()} {`${fullMonths}`} мес.</Text>
            )
        }
        else{
            return(
                <Text style={styles.experienceValue}>{`${fullMonths}`} мес.</Text>
            )
        }
    }


    const BodyRender = ()=>{
        //Компонент рендеринга названия задачи и описания. Так же реализовано сворачивание длинного описания

        if (viewMoreСondition === false) {
            return (
                <View style={styles.body}>
                    <View>
                        <View style={{flexDirection:'row', marginTop: 10}}>
                            <Text style={styles.taskNameText}>{userData.resume.name}</Text>
                            <View style={{marginLeft:5, marginTop: 3}}>
                                <Rating  rating={userData.raiting}/> 
                                {/* в userData лежит именно raiting */}
                            </View>
                        </View>
                        <Text
                            numberOfLines={5}
                            ellipsizeMode="tail"
                            style={styles.taskDescriptionText}>
                            {userData.resume.description}
                        </Text>

                        <TouchableOpacity
                            style={{marginLeft: 30, marginTop: 5}}
                            onPress={()=>{
                                setViewMoreCondition(true);
                            }
                            }
                        >
                            <Text style={styles.viewMore}>Развернуть</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{flexDirection: 'row'}}>
                        <RenderImage/>
                    </View>
                </View>
            );
        } else {
            return (
                    <View style={styles.body}>
                        <View>
                            <View style={{flexDirection:'row', marginTop: 10}}>
                                <Text style={styles.taskNameText}>{userData.resume.name}</Text>
                                <View style={{marginLeft:5, marginTop: 3}}>
                                    <Rating  rating={3}/>
                                </View>
                            </View>
                            <Text
                                style={styles.taskDescriptionText}>
                                {userData.resume.description}
                            </Text>

                            <TouchableOpacity
                                style={{marginLeft: 30, marginTop: 5}}
                                onPress={()=>{
                                    setViewMoreCondition(false);
                                }
                                }
                            >
                                <Text style={styles.viewMore}>Свернуть</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{flexDirection: 'row'}}>
                            <RenderImage/>
                        </View>
                    </View>


            );
        }
    };


    if(userData.resume !== undefined){
    return (

        <View style={styles.container}>
            <ImageBackground
                source={require('../../assets/backgroundStatusScreen.png')}
                resizeMode="stretch"
                style={styles.imageBack}>

                <ImageViewer visible={modalVisible}
                             onCancel={()=>setModalVisible(false)}
                             imagesList={userData.resume.images}/>


                <TouchableOpacity style={styles.goToBack}
                                  onPress={()=>{
                                      props.navigation.goBack();
                                  }}

                >
                    <Image source={require('../../assets/backArrow.png')} style={styles.goToBackIcon}/>
                    <Text style={styles.goToBackText}>Вернуться назад</Text>
                </TouchableOpacity>

                <BodyRender/>

                <View style={styles.experienceInfo}>
                    <Text style={styles.experienceTitle}>Стаж работы:</Text>
                    <ExperienceBlock/>
                </View>

                <View style={styles.cityInfo}>
                    <Text style={styles.cityTitle}>Город, регион:</Text>
                    <Text style={styles.cityValue}>{userCity + ' ' + userStreet}</Text>
                </View>

                <View style={styles.categoryInfo}>
                    <Text style={styles.categoryValue}>{splitCategories()}</Text>
                </View>

                <View style={styles.priceInfo}>
                    <Text style={styles.priceTitle}>Оплата:</Text>
                    <Text style={styles.priceValue}>{userData.resume.price} ₽</Text>
                </View>

                <TouchableOpacity onPress={()=>{props.navigation.navigate('PotentialTasks')}}
                    style={styles.potentialTasksView}
                >
                    <Text style={styles.potentialTasksText}>Потенциальные заказы</Text>
                </TouchableOpacity>


            </ImageBackground>

        </View>
    )}else{
        return(
            <View></View>
        )
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    imageBack: {
        flex: 1,
        paddingTop: 125
    },

    goToBack: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#F3FBFF',
        paddingBottom: 23
    },

    goToBackText: {
        color: '#3DB2F4',
        fontSize: 15,
        marginLeft: 7,
        textDecorationLine: 'underline'
    },

    goToBackIcon: {
        width: 13,
        height: 13
    },
    body: {
        flexDirection: 'row',
        width: Dimensions.get('window').width * 0.65
    },

    taskNameText: {
        fontWeight: '700',
        fontSize: 15,
        color: '#373737',
        marginLeft: 30
    },

    taskDescriptionText: {
        marginTop: 5,
        fontSize: 14,
        color: '#BDBDBD',
        marginLeft: 30,
        fontWeight: '600'
    },

    noPhotoIcon: {
        height: 100,
        width: 108,
        margin: 10
    },

    cityInfo: {
        marginTop: 5,
        marginLeft: 30,
        flexDirection: 'row'
    },

    cityTitle: {
        fontSize: 13
    },

    cityValue: {
        fontSize: 13,
        color: '#3EAFF2',
        marginLeft: 2
    },

    categoryInfo: {
        marginLeft: 30,
        flexDirection: 'row',
        marginTop: 5
    },

    categoryValue: {
        fontSize: 13,
        color: '#3DB2F4',
        textDecorationLine: 'underline'
    },

    priceInfo: {
        marginLeft: 30,
        flexDirection: 'row',
        marginTop: 5
    },

    priceTitle: {
        fontSize: 14,
        fontWeight: '700'
    },

    priceValue: {
        fontSize: 14,
        color: '#F96B5C',
        marginLeft: 3,
        fontWeight: '600'
    },
    potentialTasksView: {
        marginLeft: 30,
        flexDirection: 'row',
        marginTop: 12
    },

    potentialTasksText: {
        fontSize: 16,
        color: '#F96B5C',
        marginLeft: 3,
        fontWeight: '600',
        textDecorationLine: 'underline'
    },

    viewMore: {
        color: '#3DB2F4',
        fontSize: 14,
        textDecorationLine: 'underline'
    },

    experienceInfo: {
        marginTop: 15,
        marginLeft: 30,
        flexDirection: 'row'
    },

    experienceTitle: {
        fontSize: 13
    },

    experienceValue: {
        fontSize: 13,
        color: '#f96b5c',
        marginLeft: 2
    },
});

export default MyResumeScreen;
