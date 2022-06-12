import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Dimensions, ImageBackground, StatusBar, StyleSheet, Text, TouchableOpacity, View, FlatList, Modal, ActivityIndicator } from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { db } from '../../Components/firebase.js';

export const CreateTaskStatus = (props) => {

    //меняем заголовок в шапке
    useLayoutEffect(() => {
        props.navigation.setOptions({
            title: ('Список заказов')
        });
    }, []);

    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(false)

    const userId = useSelector(state=>state.userId)
    const token = useSelector(state=>state.token)

    // Запрос всех заданий определенного пользователя
    const getMyTasks = async () => {

        setLoading(true)

        try{

            await fetch('http://193.187.96.43/return_all_task_user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: token,
                    userId: userId,
                })
            })
            .then(res => res.json())
            .then(res => setTasks(res.tasks))
            .then(() => setLoading(false))

        } catch(err){
            console.log(err)
        }
    }

    useEffect(() => {
        console.log(props.route.params)
        getMyTasks()
    }, [props.route.params]) // Если мы изменили заказ и вернулись назад, то нужно обновить все заказы

    const Item = ({ item }) => {
        const date = new Date(item.deliveryDate)
        // console.log(item)

        return (
            <View key={item._id}>
                <View style={styles.box}>
                    <View style={{ backgroundColor: '#F3FBFF', padding: 2 }}>
                        <Text style={{ fontSize: 16, marginLeft: 10 }}>{item.title}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', backgroundColor: '#F9FEFF', height: 30 }}>
                        <Text style={{ width: '40%', fontSize: 16, textAlign: 'center', color: '#888888' }}>{'Номер заказа'}</Text>
                        <Text style={{ width: '30%', fontSize: 16, textAlign: 'center', color: '#888888' }}>{'Дата'}</Text>
                        <Text style={{ width: '30%', fontSize: 16, textAlign: 'center', color: '#888888' }}>{'Сумма'}</Text>
                    </View>
                    <TouchableOpacity style={{ flexDirection: 'row', backgroundColor: '#F3FBFF', height: 30 }}
                        onPress={() => props.navigation.navigate('StatusScreen', {item: item, imEmployer: true})}>
                        <Text style={{ width: '40%', fontSize: 16, textAlign: 'center' }}>{`№${item.sequential_number}`}</Text>

                        <Text style={{ width: '30%', fontSize: 16, textAlign: 'center', color: '#3EAFF2' }}>{`${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`}</Text>

                        <Text style={{
                            width: '30%',
                            fontSize: 17,
                            textAlign: 'center',
                            color: '#F96B5C'
                        }}>{item.price + ' ₽'}</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', width: '100%', marginBottom: 10 }}>
                    <TouchableOpacity style={{ flex: 1 }} onPress={() => props.navigation.navigate('CreateTask', { item: item, update: true })}>
                        <Text style={{
                            textAlign: 'left',
                            margin: 10,
                            color: '#F96B5C',
                            textDecorationLine: 'underline'
                        }}>{'Изменить заказ'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ flex: 1 }} onPress={() => props.navigation.navigate('FreelancersList', { taskId: item._id })}>
                        <Text style={{
                            textAlign: 'right',
                            margin: 10,
                            color: '#F96B5C',
                            textDecorationLine: 'underline'
                        }}>{'Выбрать исполнителя'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    const renderItem = ({ item }) => {
        return (
            <Item
                item={item}
            />
        )
    }

    const Indicator = () => {
        return(
                <Modal
                    visible={loading}
                    transparent={true}
                    >
                    <ActivityIndicator size="large" color="#373737"
                    style={{flex: 1, justifyContent: "center"}}/>
                </Modal>
        )
    }


    return (
        <ImageBackground source={require('../../assets/menu.png')} resizeMode="stretch" style={styles.imageBack}>
            <View style={styles.container}>

                <TouchableOpacity style={{}} onPress={() => props.navigation.goBack()}>
                    <Text style={{
                        textDecorationLine: 'underline',
                        color: '#3DB2F4',
                        margin: 10
                    }}>{'Вернуться назад'}</Text>
                </TouchableOpacity>

                <Text style={{
                    textAlign: 'center',
                    margin: 10,
                    color: '#888888'
                }}>{'Здесь Вы можете отменить заказ и разморозить сумму'}</Text>

                <Indicator />

                {!loading ? <FlatList
                    data={tasks}
                    renderItem={renderItem}
                    keyExtractor={item => item._id}
                />
                :
                <Text>{''}</Text>
                }
            </View>
        </ImageBackground>
    )
}

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
        alignItems: 'center'
    },
    box: {
        width: '100%'
    }

});
