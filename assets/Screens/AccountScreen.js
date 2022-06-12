import React, {useEffect} from 'react';
import {Dimensions, Image, ImageBackground, StyleSheet, Text, View} from 'react-native';
import {storageRef} from '../Components/firebase.js';
import {useDispatch, useSelector} from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import {getAvatar, getUserData} from '../redux/actions';
import {LoginBlock} from '../Components/LoginBlock';
import {AvatarRender} from '../Components/AvatarComponents';
import {pullUserData} from '../Components/pullUserData';


const AccountScreen = props=>{
    //Станица личного кабинета. Здесь отоброжается вся информация о пользователе.


    const dispatch = useDispatch();
    const avatarUrl = useSelector(state=>state.avatar);
    const userData = useSelector(state=>state.userData);


    //Проверяет если в Редакс аватарка, если нет то загружает из БД
    const checkAvatar = ()=>{
        if (avatarUrl === undefined) {
            storageRef.child(`users/${userData.userId}/avatar.jpg`).getDownloadURL()
                .then((url)=>{
                    dispatch(getAvatar(url));
                })
                .catch((error)=>{
                    // A full list of error codes is available at
                    // https://firebase.google.com/docs/storage/web/handle-errors
                    switch (error.code) {
                        case 'storage/object-not-found':
                            console.log('File doesn\'t exist');
                            break;
                        case 'storage/unauthorized':
                            // User doesn't have permission to access the object
                            break;
                        case 'storage/canceled':
                            // User canceled the upload
                            break;
                        case 'storage/unknown':
                            // Unknown error occurred, inspect the server response
                            break;
                    }
                });
        }
    };


    useEffect(()=>{
        if (userData === undefined) {
            dispatch(getUserData(pullUserData('1')));
        }
        ;
        (async ()=>{
            if (Platform.OS !== 'web') {
                const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Для загрузки изображения нужен доступ к файловому хранилищу');
                }
            }
        })();
        checkAvatar();
        props.navigation.setOptions(
            userData.emailInfo.isConfirm ? {title: 'Личный кабинет'} : {title: 'Подтвердите E-mail'});
    }, []);


    //Страницу загружаем, когда появились данные о заказе
    if (userData) {
        return (
            <ImageBackground
                source={require('../assets/accountBackground.png')}
                resizeMode="stretch"
                style={styles.imageBack}>

                <View style={styles.balanceBlock}>
                    <Image
                        style={styles.walletIcon}
                        source={require('../assets/walletIcon.png')}/>
                    <View style={styles.walletText}>
                        <Text style={styles.balanceText}>{userData.balance.toFixed(2)} ₽</Text>
                        <Text style={styles.balanceTime}>{userData.balanceTimeString}</Text>
                    </View>
                </View>

                <AvatarRender/>

                {/* Компонент для изменения логина передаем данные о пользователе и функцию сохранения данных в БД*/}
                <LoginBlock
                    userObj={userData}
                />

                <View style={{marginTop: 15}}>
                    <View style={styles.topBodyBlock}>
                        <Image
                            style={styles.nameLastnameIcon}
                            source={require('../assets/nameLastnameIcon.png')}/>
                        <View style={{marginLeft: 9}}>
                            <Text style={styles.nameLastnameTitle}>Имя/Фамилия</Text>
                            <Text style={styles.nameLastnameValue}>{userData.name} {userData.lastname}</Text>
                        </View>
                    </View>

                    <View style={styles.centerBodyBlock}>
                        <Image
                            style={styles.phoneIcon}
                            source={require('../assets/phoneIcon.png')}/>
                        <View style={{marginLeft: 9}}>
                            <Text style={styles.nameLastnameTitle}>Номер телефона</Text>
                            <Text style={styles.nameLastnameValue}>{userData.phone}</Text>
                        </View>
                    </View>

                    <View style={styles.centerBodyBlock}>
                        <Image
                            style={styles.telegramIcon}
                            source={require('../assets/telegramIcon.png')}/>
                        <View style={{marginLeft: 9}}>
                            <Text style={styles.nameLastnameTitle}>Телеграм</Text>
                            <Text style={styles.nameLastnameValue}>{userData.telegram}</Text>
                        </View>
                    </View>

                    <View style={styles.bottomBodyBlock}>
                        <Image
                            style={styles.houseIcon}
                            source={require('../assets/houseIcon.png')}/>
                        <View style={{marginLeft: 9}}>
                            <Text style={styles.nameLastnameTitle}>Адрес</Text>
                            <Text style={styles.nameLastnameValue}>{userData.address}</Text>
                        </View>
                    </View>

                </View>

            </ImageBackground>
        );
    } else {
        return (
            <ImageBackground
                style={styles.imageBack}
                source={require('../assets/accountBackground.png')}
                resizeMode="stretch">
            </ImageBackground>
        );
    }
};


const styles = StyleSheet.create({
    imageBack: {
        flex: 1,
        paddingTop: 75,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
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
        width: 16,
        height: 23,
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
        width: 15,
        height: 23,
        marginTop: 8

    },
    telegramIcon: {
        width: 21,
        height: 21,
        marginTop: 8

    },
    houseIcon: {
        width: 21,
        height: 21,
        marginTop: 8
    }
});

export default AccountScreen;