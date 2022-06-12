import React, {useLayoutEffect} from 'react';
import {FlatList, ImageBackground, View, StyleSheet, TouchableOpacity, Image, Text, Dimensions} from 'react-native';
import {useSelector} from 'react-redux';
import {db} from '../Components/firebase.js'
import Rating from '../Components/Rating.js';


const Users = [{id:'1', name: 'Nucho Design', rating: 4.5},{id:'2', name: 'Вячеслав Олегович', rating: 4.3},{id:'3', name: 'Олег Александрович', rating: 3.9}]

export const FreelancersList = ({navigation}) => {

    //получаем id текущего пользователя, пока в редаксе ничего нет, задаем id вручную
    //const currentUserId = useSelector(state => state.userId)
    const currentUserId = 'hdu29cm3k44s'

    //меняем заголовок в шапке
    useLayoutEffect(()=>{
        navigation.setOptions({
            title: ('Выбор исполнителя')
        });
    }, []);

    //создаем id чата с помощью соединения id пользователей. К меньшему id присоединяем больший
    const getChatId = (id) => {
        if (currentUserId > id){
            return (id + currentUserId)
        }else{
            return (currentUserId + id)
        }
    }

    //проверяем нет ли такого чата, если нет, создаем новый
    const createChat = (id, name) => {
        const chatId = getChatId(id)
        if (!chatAlreadyExists(chatId)){
            db.collection('chats').doc(chatId).set({
                users: [currentUserId, id]
            })
        }
        navigation.navigate('Chat',{ chatId: chatId, name: name})
    }

    //проверка существует ли такой чат
    const chatAlreadyExists = (chatId) => {
        const chatExist = db.collection('chats').get(chatId)
        return (!!chatExist.exists)
    }

    const goToChat = (id, name) => {
        createChat(id, name)
    }

    //переход к профилю выбранного пользователя
    const goToProfile = (id) => {
        navigation.navigate('UserProfile',{ userId: id,})
    }

    const renderItem = ({ item }) => (
        <View style={{flexDirection:'row', justifyContent: 'space-between', paddingBottom: 10}}>
            <Text style={styles.nameText}>{item.name}</Text>
            <View style={{position:'absolute', left: 180, top: 10}}>
                <Rating rating={item.rating}/>
            </View>
            <View style={{flexDirection:'row',  }}>
                <TouchableOpacity onPress={()=>goToChat(item.id, item.name)}>
                    <Image source={require('../assets/startChatIcon.png')} style={styles.startChatIcon}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>goToProfile(item.id)}>
                    <Image source={require('../assets/goToProfileIcon.png')} style={styles.goToProfileIcon}/>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/menu.png')} resizeMode='stretch' style={styles.imageBack}>
                <TouchableOpacity style={styles.goBack}
                                  onPress={() => {navigation.goBack()}}
                >
                    <Image source={require('../assets/backArrow.png')} style={styles.goBackIcon}/>
                    <Text style={styles.goBackText}>Вернуться назад</Text>
                </TouchableOpacity>
                <Text style={styles.textUnderGoBackButton}>Выберите исполнителя из списка,{"\n"} которые предложили свои кандидатуры</Text>
                <Text style={styles.chooseEmployerText}>Имя исполнителя</Text>
                <FlatList data={Users} renderItem={renderItem} />
                <TouchableOpacity style={styles.setFreelancer}>
                    <Text style={styles.setFreelancerText}>Назначить исполнителя</Text>
                </TouchableOpacity>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 25,
    },
    imageBack: {
        flex: 1,
        paddingTop: 115,
    },
    goBack: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#F3FBFF',
        paddingBottom: 20
    },
    goBackText: {
        color: '#3DB2F4',
        fontSize: 15,
        marginLeft: 7,
        textDecorationLine: 'underline',
        fontWeight: '400',
        fontFamily: 'roboto'
    },
    goBackIcon: {
        width: 13,
        height: 13
    },
    textUnderGoBackButton: {
        fontFamily: 'roboto',
        color: '#888888',
        fontSize: 13,
        textAlign: 'center',
        fontWeight: '400'
    },
    chooseEmployerText: {
        fontFamily: 'roboto',
        color: '#888888',
        fontSize: 15,
        textAlign: 'left',
        fontWeight: '400',
        padding: 20
    },
    nameText: {
        padding:10,
        fontSize:15,
        fontFamily: 'roboto',
    },
    startChatIcon: {
        marginTop: 10,
        width: 30,
        height: 30,
        resizeMode: 'stretch',
        marginRight: 10
    },
    goToProfileIcon: {
        marginTop: 10,
        width: 30,
        height: 25,
        resizeMode: 'stretch',
        marginRight: 10
    },
    setFreelancer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F96B5C',
        borderWidth: 5,
        borderStyle: 'solid',
        borderColor: '#FEEAE4',
        borderRadius: 70,
        width: Dimensions.get('window').width * 0.95,
        height: 60,
        position: 'absolute',
        bottom: 20,
        left: 10,
    },
    setFreelancerText: {
        color: '#F9F9F9',
        fontSize: 20,
        fontWeight: '400',
        fontFamily: 'roboto'
    }
})

