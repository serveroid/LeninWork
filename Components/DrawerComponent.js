import React, { useEffect, useState } from 'react';
import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {db} from './firebase.js';
import {useDispatch, useSelector} from 'react-redux';


export const DrawerComponent = (props)=>{
    //Компонент бокового меню

    const userData = useSelector(state=>state.userData);
    // const unreadMessage = useSelector(state=>state.unreadMessage);

    const userId = useSelector(state=>state.userId)
    const token = useSelector(state=>state.token)

    const hasResume = useSelector(state => state.hasResume)

    // const dispatch = useDispatch();


    const [resume, setResume] = useState('CreateResume')

    const getResumeInfo = async () => {

        console.log('get_resume')

        await fetch('http://193.187.96.43/get_resume', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: token,
                userId: userId
            })
        })
        .then(res => res.json())
        .then(res => {
            // Если по запросу ничего не приходит, то длина ответа 4
            if (res.length > 100) setResume('MyResumeScreen')
            else setResume('CreateResume')
        })

    }

    useEffect( () => {
        getResumeInfo()
    }, [hasResume, userData])

    //Рендерим аватар пользователя или шаблон
    const Avatar = () =>{
        if (userData){
            if (userData.avatarImage !== false &&
                userData.avatarImage !== undefined){
                return (
                    <Image
                        style={styles.avatarImageView}
                        source={{uri:`http://193.187.96.43/${userData.avatarImage}`}}/>
                )
            }else{
                return (
                    <Image
                        style={{width: 76, height: 76}}
                        source={require('../assets/noAvatarIcon.png')}/>
                );
            }

        }else{
            return (
                <Image
                    style={{width: 76, height: 76}}
                    source={require('../assets/noAvatarIcon.png')}/>
            );
        }

    };

    //Компонент Строки "Сообщения" различия касаются круга с количеством не прочитаных сообщений
    const MessageRender = ()=>{
        if(userData){
            if (100 > userData.unreadMessage &
                userData.unreadMessage > 0) {
                return (
                    <TouchableOpacity style={[{flexDirection: 'row'}, styles.menuItemsStyle]}
                                    onPress={()=>props.navigation.navigate('Messages')}>
                        <Text style={[{color: '#3E3D3D'}, styles.menuTextStyle]}>Сообщения</Text>
                        <View style={styles.messageCircle}>
                            <Text style={{color: '#FFFFFF', fontSize: 15}}>{userData.unreadMessage}</Text>
                        </View>
                    </TouchableOpacity>
                );
            }
            else if (userData.unreadMessage > 99) {
                return (
                    <TouchableOpacity style={[{flexDirection: 'row'}, styles.menuItemsStyle]}
                                    onPress={()=>props.navigation.navigate('Messages')}>
                        <Text style={[{color: '#3E3D3D'}, styles.menuTextStyle]}>Сообщения</Text>
                        <View style={styles.messageCircle}>
                            <Text style={{color: '#FFFFFF', fontSize: 13}}>99+</Text>
                        </View>
                    </TouchableOpacity>
                );
            } else {
                return (
                    <TouchableOpacity style={[{flexDirection: 'row'}, styles.menuItemsStyle]}
                                    onPress={()=>props.navigation.navigate('Messages')}>
                        <Text style={[{color: '#3E3D3D'}, styles.menuTextStyle]}>Сообщения</Text>
                    </TouchableOpacity>
                );
            }
        }else{
            return <View></View>
        }
    };

    const ResumeComponent = () => {
        // Если нет резюме то выводим строку "Создать резюме"

        if(userData){
            return(
            <TouchableOpacity
                style={styles.menuItemsStyle}
                onPress={()=>props.navigation.navigate(resume == 'MyResumeScreen' ? 'MyResumeScreen' : 'CreateResume')}>
                <Text style={[{color: '#3E3D3D'}, styles.menuTextStyle]}>{resume == 'CreateResume' ? 'Cоздать резюме' : 'Мое резюме'}</Text>
            </TouchableOpacity>
        )
        }else{
            return <View></View>
        }
    }

    //Компонент рендеринга строки логина
    const LoginText = ()=>{
        if (userData !== undefined) {
            return (
                <Text style={styles.loginText}>{userData.login}</Text>
            );
        } else {
            return (
                <Text style={styles.loginText}>Имя Пользователя</Text>
            );
        }
    };

    //проверяем создан ли чат с поддержкой, если нет, создаем новый
    const createSupportChat = () => {
        if (!chatAlreadyExists()){
            db.collection('supportChats').doc(userData.userId).set({
                user: userData.userId
            })
        }
        props.navigation.navigate('Chat',{ chatType:'supportChats', chatId: userData.userId})
    }

    //проверка существует ли такой чат
    const chatAlreadyExists = () => {
        const chatExist = db.collection('supportChats').get(userData.userId)
        return (!!chatExist.exists)
    }


    return (
        <View style={styles.container}>

            <TouchableOpacity style={styles.header} onPress={()=>props.navigation.navigate('AccountScreen')}>
                <Avatar/>
                <LoginText/>
            </TouchableOpacity>

            <View style={styles.scrollContainer}>
                <ScrollView>
                    <TouchableOpacity
                        style={styles.menuItemsStyle}
                        onPress={()=>props.navigation.navigate('CreateTask', {create: true})}>
                        <Text style={[{color: '#3E3D3D'}, styles.menuTextStyle]}>Создать задание</Text>
                    </TouchableOpacity>

                    <ResumeComponent/>

                    <TouchableOpacity
                        style={styles.menuItemsStyle}
                        onPress={()=>props.navigation.navigate('CreateTaskStatus')}
                    >
                        <Text style={[{color: '#3E3D3D'}, styles.menuTextStyle]}>Мои задания</Text>
                    </TouchableOpacity>

                    <MessageRender/>

                    <TouchableOpacity style={styles.menuItemsStyle}
                                      onPress={()=>props.navigation.navigate('NotificationsScreen')}
                    >
                        <Text style={[{color: '#3E3D3D'}, styles.menuTextStyle]}>Уведомления</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItemsStyle}
                                      onPress={()=>props.navigation.navigate('AffiliateProgram')}>
                        <Text style={[{color: '#3E3D3D'}, styles.menuTextStyle]}>Партнерская программа</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItemsStyle}
                        onPress={()=>props.navigation.navigate('SearchCategories', {work: true, screen: 'SearchWorkTasks'})}>
                        <Text style={[{color: '#F96B5C'}, styles.menuTextStyle]}>Поиск работы</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItemsStyle}
                        onPress={()=>props.navigation.navigate('SearchCategories', {work: false, screen: 'SearchFreelancer'})}>
                        <Text style={[{color: '#F96B5C'}, styles.menuTextStyle]}>Поиск исполнителя</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItemsStyle}
                                      onPress={()=>props.navigation.navigate('RealtyFind')}>
                        <Text style={[{color: '#F96B5C'}, styles.menuTextStyle]}>Аренда недвижимости</Text>
                    </TouchableOpacity>

                    {/*<TouchableOpacity style={styles.menuItemsStyle}>*/}
                    {/*    <Text style={[{color: '#F96B5C'}, styles.menuTextStyle]}>Обучение</Text>*/}
                    {/*</TouchableOpacity>*/}


                </ScrollView>
            </View>

            <View style={styles.supportContainer}>
                <TouchableOpacity style={styles.supportStyle}>
                    <Image style={styles.supportImage} source={require('../assets/supportChatIcon.png')}/>
                    <Text style={{fontSize: 18, color: '#3E3D3D'}}>Чат с поддержкой</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 40

    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10,
        marginLeft: 10
    },
    avatarImageView: {
        width: 76,
        height: 76,
        borderRadius: 38,
        borderColor: '#CDEEFF',
        borderWidth: 3
    },
    loginText: {
        marginLeft: 10,
        color: '#373737',
        fontSize: 18
    },
    supportStyle: {
        flexDirection: 'row',
        marginBottom: 13,
        marginLeft: 17,
        alignItems: 'center'

    },
    supportImage: {
        width: 20,
        height: 18,
        marginRight: 7
    },
    supportContainer: {
        height: 50,
        backgroundColor: '#FFFFFF',
        borderBottomEndRadius: 18,
        borderBottomStartRadius: 18,
        justifyContent: 'flex-end'
    },
    scrollContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderTopEndRadius: 18,
        borderTopStartRadius: 18
    },
    menuItemsStyle: {
        marginTop: 10,
        paddingLeft: 17,
        paddingBottom: 14,
        borderBottomWidth: 1,
        borderColor: '#F3FBFF'
    },
    menuTextStyle: {
        fontSize: 18
    },
    messageCircle: {
        backgroundColor: '#F96B5C',
        width: 25,
        height: 25,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        marginLeft: 4
    }
});



