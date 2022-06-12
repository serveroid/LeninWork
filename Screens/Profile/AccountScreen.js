import React, { useEffect, useLayoutEffect } from 'react';
import { Dimensions, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { getUserData } from '../../redux/actions.js';
import { LoginBlock } from '../../Components/LoginBlock.js';
import { AvatarRender } from '../../Components/AvatarComponents.js';
import { pullUserData } from '../../Components/pullUserData.js';
import { StatusBar } from 'expo-status-bar';

const AccountScreen = props => {
    //Станица личного кабинета. Здесь отоброжается вся информация о пользователе.


    const dispatch = useDispatch();
    const userData = useSelector(state => state.userData);
    const userId = useSelector(state => state.userId);
    const token = useSelector(state => state.token);

    useLayoutEffect(() => {

        (async () => {
            if (Platform.OS !== 'web') {
                const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Для загрузки изображения нужен доступ к файловому хранилищу');
                }
            }
        })();
    }, []);

    useEffect(() => {
        // получаем данные о пользователе и меняем заголовок
        const getData = async () => {
            const userDataServer = await pullUserData(userId, token);
            dispatch(getUserData(userDataServer));
            console.log(userDataServer);
            props.navigation.setOptions(
                userDataServer.emailInfo.isConfirm ? {title: 'Личный кабинет'} : {
                    headerTitle: () => (
                        <TouchableOpacity style={{alignItems: 'center'}}
                                          onPress={() => props.navigation.navigate('PersonalInfoScreen')}
                        >
                            <Text style={{
                                fontSize: 20,
                                fontWeight: '500',
                                fontFamily: 'roboto',
                                color: 'white'
                            }}>Подтвердите E-mail</Text>
                        </TouchableOpacity>
                    )
                });
        };
        getData();

    }, []);

    //Страницу загружаем, когда появились данные о юзере
    if (userData) {
        return (
            <ImageBackground
                source={require('../../assets/accountBackground.png')}
                resizeMode="stretch"
                style={styles.imageBack}>
            <View style={styles.container}>


                <TouchableOpacity style={styles.balanceBlock}
                                  onPress={() => props.navigation.navigate('EarningStatistics')}>
                    <Image
                        style={styles.walletIcon}
                        source={require('../../assets/walletIcon.png')}/>
                    <View style={styles.walletText}>
                        <Text style={styles.balanceText}>{userData.balance.toFixed(2)} ₽</Text>
                        <Text style={styles.balanceTime}>{userData.balanceTimeString}</Text>
                    </View>
                </TouchableOpacity>

                <AvatarRender/>

                {/* Компонент для изменения логина передаем данные о пользователе и функцию сохранения данных в БД*/}
                <LoginBlock/>

                <View style={{marginTop: 15}}>
                    <View style={styles.topBodyBlock}>
                        <Image
                            style={styles.nameLastnameIcon}
                            source={require('../../assets/nameLastnameIcon.png')}/>
                        <View style={{marginLeft: 9}}>
                            <Text style={styles.nameLastnameTitle}>Имя/Фамилия</Text>
                            <Text style={styles.nameLastnameValue}>{userData.name}</Text>
                        </View>
                    </View>

                    <View style={styles.centerBodyBlock}>
                        <Image
                            style={styles.phoneIcon}
                            source={require('../../assets/phoneIcon.png')}/>
                        <View style={{marginLeft: 9}}>
                            <Text style={styles.nameLastnameTitle}>Номер телефона</Text>
                            <Text style={styles.nameLastnameValue}>{userData.number}</Text>
                        </View>
                    </View>

                    <View style={styles.centerBodyBlock}>
                        <Image
                            style={styles.telegramIcon}
                            source={require('../../assets/telegramIcon.png')}/>
                        <View style={{marginLeft: 9}}>
                            <Text style={styles.nameLastnameTitle}>Телеграм</Text>
                            <Text style={styles.nameLastnameValue}>{userData.telegram}</Text>
                        </View>
                    </View>

                    <View style={styles.bottomBodyBlock}>
                        <Image
                            style={styles.houseIcon}
                            source={require('../../assets/houseIcon.png')}/>
                        <View style={{marginLeft: 9}}>
                            <Text style={styles.nameLastnameTitle}>Адрес</Text>
                            <Text style={styles.nameLastnameValue}>{userData.address}</Text>
                        </View>
                    </View>

                </View>

            </View>

            </ImageBackground>
        );
    } else {
        return (
            <ImageBackground
                style={styles.imageBack}
                source={require('../../assets/accountBackground.png')}
                resizeMode="stretch">
            </ImageBackground>
        );
    }
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
        height: (Dimensions.get('window').height * 0.8538),
        alignItems: 'center',
    },
    balanceBlock: {
        justifyContent: 'center',
        flexDirection: 'row'
    },
    walletIcon: {
        width: 55,
        height: 55
    },
    walletText: {
        marginLeft: 5
    },
    balanceText: {
        fontSize: 30,
        color: '#FFFFFF'
    },
    balanceTime: {
        fontSize: 12,
        color: '#FFFFFF'
    },
    topBodyBlock: {
        flexDirection: 'row',
        paddingLeft: 70,
        marginTop: 8,
        marginLeft: 16,
        marginRight: 16,
        backgroundColor: '#FFFFFF',
        paddingTop: 16,
        paddingBottom: 10,
        borderTopStartRadius: 30,
        borderTopEndRadius: 30,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#F3FBFF'
    },
    nameLastnameIcon: {
        width: 19,
        height: 26,
        marginTop: 8
    },
    nameLastnameTitle: {
        color: '#BDBDBD',
        fontSize: 15
    },
    nameLastnameValue: {
        color: '#373737',
        fontSize: 16
    },
    centerBodyBlock: {
        flexDirection: 'row',
        paddingLeft: 70,
        marginLeft: 17,
        marginRight: 17,
        backgroundColor: '#FFFFFF',
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderColor: '#F3FBFF'
    },
    bottomBodyBlock: {
        flexDirection: 'row',
        paddingLeft: 70,
        marginLeft: 17,
        marginRight: 17,
        backgroundColor: '#FFFFFF',
        paddingTop: 10,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderColor: '#F3FBFF',
        borderBottomEndRadius: 30,
        borderBottomStartRadius: 30
    },
    phoneIcon: {
        width: 18,
        height: 27,
        marginTop: 8

    },
    telegramIcon: {
        width: 22,
        height: 22,
        marginTop: 8

    },
    houseIcon: {
        width: 23,
        height: 23,
        marginTop: 8
    }
});

export default AccountScreen;
