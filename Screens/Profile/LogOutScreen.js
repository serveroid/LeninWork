import React, { useLayoutEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, ImageBackground } from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import { AsyncStorage } from 'react-native'
import { getUserData } from '../../redux/actions.js';


export const LogOutScreen = (props) => {
    // Страница выхода из профиля или со всех устройств

    const logOutFrom = props.route.params.logOutFrom
    const dispatch = useDispatch();


    const LogOutTextRender = () => {
        if(logOutFrom === 'devices'){
            return(
                <Text style={styles.textStyle}>Вы уверены, что хотите выйти со всех устройств?</Text>
                )
        }
        else{
            return(
                <Text style={styles.textStyle}>Вы уверены, что хотите выйти из профиля?</Text>
                )
        }
    }

    const logOutfunc = async () => {
        if(logOutFrom === 'devices'){
            console.log('Logout from all divices');
        }else{

            (async () => {
                try {
                    console.log('from profile');
                    await AsyncStorage.removeItem('userId');
                    await AsyncStorage.removeItem('token');
                    await dispatch({type: 'authenticate', userId: undefined, token: undefined})
                    await dispatch(getUserData(undefined))
                }
                catch(exception) {
                    return false;
                }
            })()
        }
    }


    useLayoutEffect(() => {
        props.navigation.setOptions({title: (
            <Text style={{fontSize: 21}}>Подтвердите выход</Text>
          )});

    }, [])

    return(
        <ImageBackground
        source={require('../../assets/logOutBackground.png')}
        resizeMode="stretch"
        style={styles.imageBack}>

            <View style={styles.content}>
                <View style={styles.window}>
                    <Image source={require('../../assets/warningIcon.png')} style={styles.imageStyle}/>
                    <LogOutTextRender/>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={[styles.button, {borderColor: '#CDF4FF'}]}
                        onPress={() => props.navigation.goBack()}
                    >
                        <Text style={styles.buttonText}>Нет</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                    style={[styles.button, {borderColor: '#FEEAE4'}]}
                    onPress={ () => logOutfunc()}>
                        <Text style={styles.buttonText}>Да</Text>
                    </TouchableOpacity>
                </View>

            </View>

        </ImageBackground>
    )
}



const styles = StyleSheet.create({

    imageBack: {
        flex: 1,
        paddingTop: 125,
        justifyContent: 'center',
    },
    content: {
        alignSelf: 'center',
    },
    window: {
        backgroundColor: 'white',
        width: Dimensions.get('window').width * 0.90,
        height: 220,
        borderColor: '#E5F7FF',
        borderWidth: 1,
        alignItems: 'center',
        borderRadius: 40,
        paddingLeft: 30,
        paddingRight: 30
    },
    imageStyle: {
        width: 120,
        height: 85,
        marginTop: 30
    },
    textStyle: {
        fontSize: 23,
        color: '#373737',
        textAlign: 'center'
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 40,
        justifyContent: 'space-evenly'
    },
    button: {
        width: 125,
        height: 65,
        backgroundColor: 'white',
        borderWidth: 1,
        alignItems: 'center',
        borderRadius: 35,
        justifyContent: 'center'

    },
    buttonText: {
        fontSize: 30
    }
})
