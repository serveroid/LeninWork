import React, { useEffect, useLayoutEffect, useState } from 'react';
import { FlatList, ImageBackground, View, StyleSheet, TouchableOpacity, Image, Text, Dimensions, Modal, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { db, firebase } from '../../Components/firebase.js'
import Rating from '../../Components/Rating.js';


export const FreelancersList = (props) => {

    const [workers, setWorkers] = useState([])
    const [selected, setSelected] = useState(0)

    const token = useSelector(state=>state.token)

    const [loading, setLoading] = useState(false)

    //получаем id текущего пользователя, пока в редаксе ничего нет, задаем id вручную
    const currentUserId = useSelector(state => state.userId)


    //меняем заголовок в шапке
    useLayoutEffect(() => {
        props.navigation.setOptions({
            title: ('Выбор исполнителя')
        });
        getWorkerList(props.route.params.taskId)
    }, []);

    const getWorkerList = async taskId => {

        setLoading(true)

        await fetch('http://193.187.96.43/get_all_requests_task', {
            method: 'POST',
            headers: {
                'Content-type': 'Application/json'
            },
            body: JSON.stringify({
                token: token,
                idTask: taskId
            })
        })
        .then(res => res.json())
        .then(res => setWorkers(res))
        .then(() => setLoading(false))

    }

    const choiceWorker = async () => {

        setLoading(true)

        await fetch('http://193.187.96.43/choise_performer', {
            method: 'POST',
            headers: {
                'Content-type': 'Application/json'
            },
            body: JSON.stringify({
                token: token,
                idPerformer: selected,
                idTask: props.route.params.taskId
            })
        })
        .then(res => res.json())
        .then(() => setLoading(false))
        .then(() => props.navigation.navigate('CreateTaskStatus'))

    }

    //создаем id чата с помощью соединения id пользователей. К меньшему id присоединяем больший
    const getChatId = (id) => {
        if (currentUserId > id) {
            return (id + currentUserId)
        } else {
            return (currentUserId + id)
        }
    }

    //проверяем нет ли такого чата, если нет, создаем новый
    const createChat = (id, name) => {
        const chatId = getChatId(id)
        if (!chatAlreadyExists(chatId)) {
            db.collection('chats').doc(chatId).set({
                users: [currentUserId, id]
            })
        }
        props.navigation.navigate('Chat', { chatType: 'chats', chatId: chatId, name: name })
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
        props.navigation.navigate('UserProfile', { userId: id, })
    }

    const raitingCalculation = raitingArray => {

        let raiting = 0,
            count = 0

        raitingArray.forEach(elem => {

            raiting += elem.evalution
            count++

        })

        return raiting/count

    }

    const renderItem = ({ item }) => {

        // По запросу передаётся массив отзывов, поэтому считаем средний и выводим на экран
        const raiting = raitingCalculation(item.raiting)

        return (
            <TouchableOpacity
                onPress={() => {
                    // Выбор исполнителя
                    setSelected(item._id)
                }}
                style={{ flex: 1 }}
            >
                <View style={[styles.itemStyle, selected == item._id ? styles.selectedItem : '']}>
                    <Text style={styles.nameText}>{item.name}</Text>
                    <View style={selected == item._id ? { position: 'absolute', left: 188, top: 15 } : { position: 'absolute', left: 190, top: 17 }}>
                        <Rating rating={raiting} />
                    </View>
                    <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                        <TouchableOpacity onPress={() => goToChat(item._id, item.name)}>
                            <Image source={require('../../assets/startChatIcon.png')} style={styles.startChatIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => goToProfile(item._id)}>
                            <Image source={require('../../assets/goToProfileIcon.png')} style={styles.goToProfileIcon} />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        )

    }

    const Indicator = () => {
        return(
                <Modal
                    visible={loading}
                    transparent={true}
                    >
                    <ActivityIndicator size="large" color="#373737"
                    style={{flex: 1, justifyContent: 'center'}}/>
                </Modal>
        )
    }

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../../assets/menu.png')} resizeMode='stretch' style={styles.imageBack}>

                <Indicator />
                <TouchableOpacity style={styles.goBack}
                    onPress={() => { props.navigation.goBack() }}
                >
                    <Image source={require('../../assets/backArrow.png')} style={styles.goBackIcon} />
                    <Text style={styles.goBackText}>Вернуться назад</Text>
                </TouchableOpacity>
                {workers.length > 0 ? // Если массив workers существует рисуем список
                    <View style={{ flex: 1 }}>
                        <Text style={styles.textUnderGoBackButton}>Выберите исполнителя из списка,{"\n"} которые предложили свои кандидатуры</Text>
                        <Text style={styles.chooseEmployerText}>Имя исполнителя</Text>
                        <FlatList data={workers} renderItem={renderItem} keyExtractor={item => item._id} />
                        <TouchableOpacity style={styles.setFreelancer} onPress={choiceWorker}>
                            <Text style={styles.setFreelancerText}>Назначить исполнителя</Text>
                        </TouchableOpacity>
                    </View>
                    :
                    <Text style={styles.textUnderGoBackButton}>Ни один исполнитель не откликнулся на заказ</Text>}
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
        padding: 10,
        fontSize: 15,
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
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: 15,
        marginTop: 10,
        marginBottom: 15
    },
    setFreelancerText: {
        color: '#F9F9F9',
        fontSize: 20,
        fontWeight: '400',
        fontFamily: 'roboto'
    },
    itemStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 2
    },
    selectedItem: {
        backgroundColor: '#FEEAE4',
        borderWidth: 2,
        borderColor: '#F96B5C',
        padding: 0
    }
})

