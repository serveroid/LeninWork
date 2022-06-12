import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Dimensions, FlatList, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View, ViewPropTypes, ActivityIndicator, Modal } from 'react-native';
import { useSelector } from 'react-redux';
import { ImageViewer } from '../../Components/ImageViewer.js';

// Страница статуса взятого заказа. Получаем данные из БД о заказе и выводим на экран.
//Так же можно отменить заказ, открыть спор или перейти в чат с заказчиком.
const StatusScreen = props => {

    const userData = useSelector(state => state.userData)

    const [viewMoreСondition, setViewMoreCondition] = useState(false);
    const [taskImages, setTaskImages] = useState(props.route.params.item.images);
    const [modalVisible, setModalVisible] = useState(false);
    const [worker, setWorker] = useState(null)

    const userId = useSelector(state=>state.userId)
    const token = useSelector(state=>state.token)

    const [loading, setLoading] = useState(false)

    useLayoutEffect(() => {
        props.navigation.setOptions({
            title: (`Заказ № ${props.route.params.item.sequential_number}`)
        })
    }, [])

    // useEffect(() => {
    //     getTaskImages(1)
    // }, []);

    //создаем чат диспута. ID чата устанавливаем по номеру заказа
    // const createDisput = () => {
    //     db.collection('disputChats').doc('23432').set({
    //         users: ['user']
    //     })
    // }

    const getWorkerProfile = async (id) => {

        setLoading(true)

        await fetch('http://193.187.96.43/get_profile_performer', {
            method: 'POST',
            headers: {
                'Content-type': 'Application/json'
            },
            body: JSON.stringify({
                token: token,
                idUser: id
            })
        })
            .then(res => res.json())
            .then(res => setWorker(res))
            .then(() => setLoading(false))

    }

    useEffect(() => {
        if (props.route.params.item.worker) {
            getWorkerProfile(props.route.params.item.worker)
        }
    }, [])

    const RenderImage = () => {
        // Компонент рендеринга картинок в зависимости от кол-ва
        const renderItem = ({ item }) => (
            <Image source={{ uri: item.url }} style={{ height: 30, width: 30, margin: 5 }} />
        );

        if (taskImages.length > 1) {
            return (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: '76%', height: '70%', justifyContent: 'flex-end' }}>
                    <TouchableOpacity
                        onPress={() => {
                            setModalVisible(true);
                        }}>
                        <Image accessible={true} source={{ uri: taskImages[0].url }} style={styles.noPhotoIcon} />

                        <View style={{ margin: 5 }}>
                            <FlatList
                                data={taskImages.filter(item => item.id != '0')}
                                renderItem={renderItem}
                                horizontal={true}
                                keyExtractor={item => item.id.toString()}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            );
        } else if (taskImages.length === 1) {
            return (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: '76%', height: '70%', justifyContent: 'flex-end' }}>
                    <TouchableOpacity
                        onPress={() => {
                            setModalVisible(true);
                        }}>
                        <Image source={{ uri: taskImages[0].url }} style={styles.noPhotoIcon} />
                    </TouchableOpacity>
                </View>
            );
        } else {
            return (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: '76%', height: '70%', justifyContent: 'flex-end' }}>
                    <Image source={require('../../assets/noPhoto.png')} style={styles.noPhotoIcon} />
                </View>
            );
        }
    };


    const BodyRender = () => {
        //Компонент рендеринга названия задачи и описания. Так же реализовано сворачивание длинного описания
        console.log(props.route.params.item)

        if (viewMoreСondition === false) {
            return (
                <View style={styles.body}>
                    <View>
                        <Text style={styles.taskNameText}>{props.route.params.item.title}</Text>
                        {/* В ! props.route.params.item ! хранится объект с заданием, от туда, в дальнейшем будем брать всю информацию */}
                        <Text
                            numberOfLines={5}
                            ellipsizeMode="tail"
                            style={styles.taskDescriptionText}>
                            {props.route.params.item.description}
                        </Text>

                        <TouchableOpacity
                            style={{ marginLeft: 30, marginTop: 5 }}
                            onPress={() => {
                                setViewMoreCondition(true);
                            }
                            }
                        >
                            <Text style={styles.viewMore}>Развернуть</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <RenderImage />
                    </View>
                </View>
            );
        } else {
            return (
                <View style={styles.body}>
                    <View>
                        <Text style={styles.taskNameText}>{props.route.params.item.title}</Text>
                        <Text
                            style={styles.taskDescriptionText}>
                            {props.route.params.item.description}
                        </Text>
                        <TouchableOpacity
                            style={{ marginLeft: 30, marginTop: 5 }}
                            onPress={() => {
                                setViewMoreCondition(false);
                            }
                            }
                        >
                            <Text style={styles.viewMore}>Свернуть</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <RenderImage />
                    </View>
                </View>
            );
        }
    };

    const sendOrderForm = async () => {

        setLoading(true)

        await fetch('http://193.187.96.43/send_order_form', {
            method: 'POST',
            headers: {
                'Content-type': 'Application/json'
            },
            body: JSON.stringify({
                token: token,
                idPerformer: userId,
                idTask: props.route.params.item._id
            })
        })
            .then(res => res.json())
            .then(() => setLoading(false))
            .then(() => props.navigation.goBack())

    }

    const Indicator = () => {
        return(
            <Modal
                visible={loading}
                transparent={true}
            >
                <ActivityIndicator size="large" color="#373737"
                                   style={{flex: 1, justifyContent: 'flex-end'}}/>
            </Modal>
        )
    }

    // Если передан параметр imWorker, то отображаем этот компонент
    const ForWorker = () => {
        return (
            <View style={{ marginLeft: 30 }}>
                <Indicator />

                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <Text style={styles.customerTitle}>Заказчик:</Text>
                    <TouchableOpacity onPress={() => {
                        props.navigation.navigate(
                            'UserProfile', { userId: props.route.params.item.userId })
                    }}>
                        {/* Переход в профиль */}
                        <Text style={styles.customerValue}>{props.route.params.item.name}</Text>
                    </TouchableOpacity>
                </View>
                {props.route.params.item.worker == userId ? // Если id выбранного исполнителя совпадает с id пользователя, то отображаем кнопки для исполнителя (заменить на userData.userId)
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
                        <TouchableOpacity>
                            <Text style={styles.customerValue}>Отменить заказ</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style={[styles.customerValue, {marginRight: '10%'}]}>Открыть спор</Text>
                        </TouchableOpacity>
                    </View>
                    :
                    <View style={[styles.orderManage, { marginLeft: 0 }]}>
                        <TouchableOpacity style={styles.buttonOn} onPress={() => sendOrderForm()}>
                            <Text style={[styles.openDisputeText, { color: '#F9F9F9', fontSize: 20, textDecorationLine: 'none' }]}>Отправить заявку</Text>
                        </TouchableOpacity>
                    </View>

                }
            </View>
        )
    }

    // Если пользователь перешёл из вкладки Мои задания, то отображаем информацию и кнопки для него
    const ForEmployer = () => {
        console.log(worker)
        return (
            <View>
                <Indicator />

                {worker != null ? // Если уже выбран исполнитель
                    <View style={styles.customerInfo}>
                        <Text style={styles.customerTitle}>Исполнитель:</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => {
                                props.navigation.navigate(
                                    'UserProfile', { userId: props.route.params.item.worker }) // Переход в профиль исполнителя
                            }}>
                                <Text style={styles.customerValue}> {worker.name}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity >
                                <Image source={require('../../assets/customerIcon.png')} style={styles.customerIcon} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    :
                    //В противном случае можем его выбрать
                    <View style={styles.orderManage}>
                        <TouchableOpacity
                            onPress={() => { props.navigation.navigate('FreelancersList', { taskId: props.route.params.item._id }) }}
                        >
                            <Text style={styles.cancelOrderText}>Выберите исполнителя</Text>
                        </TouchableOpacity>
                    </View>}
                <View style={styles.orderManage}>
                    {/* И в любом случае можем изменить заказ */}
                    <TouchableOpacity onPress={() => { props.navigation.navigate('CreateTask', { item: props.route.params.item, update: true }) }}>
                        <Text style={styles.openDisputeText}>Изменить заказ</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (

        <View style={styles.container}>
            <ImageBackground
                source={require('../../assets/backgroundStatusScreen.png')}
                resizeMode="stretch"
                style={styles.imageBack}>

                <ImageViewer visible={modalVisible}
                             onCancel={() => setModalVisible(false)}
                             taskImages={taskImages} />


                <TouchableOpacity style={styles.goToBack}
                                  onPress={() => {
                                      props.navigation.goBack();
                                  }}

                >
                    <Image source={require('../../assets/backArrow.png')} style={styles.goToBackIcon} />
                    <Text style={styles.goToBackText}>Вернуться назад</Text>
                </TouchableOpacity>

                <BodyRender />

                <View style={styles.cityInfo}>
                    <Text style={styles.cityTitle}>Город, регион:</Text>
                    {props.route.params.item.location != undefined ? <Text style={styles.cityValue}>{`${props.route.params.item.location[3]}, ${props.route.params.item.location[4]}`}</Text> : <Text></Text>}
                </View>

                <View style={styles.workplaceInfo}>
                    <Text style={styles.workplaceTitle}>Место работы: </Text>
                    <Text style={styles.workplaceValue}>{'На дому'}</Text>
                </View>

                <View style={styles.priceInfo}>
                    <Text style={styles.priceTitle}>Оплата:</Text>
                    <Text style={styles.priceValue}>{props.route.params.item.price} ₽</Text>
                </View>
                <Text style={styles.feeText}>(c учетом комиссии сервиса 20%)</Text>

                {props.route.params.imWorker != undefined ?
                    <ForWorker />
                    :
                    <ForEmployer />
                }
            </ImageBackground>

        </View>
    );
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
        marginTop: 10,
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
        fontWeight: '600',
        width: 200
    },

    noPhotoIcon: {
        height: 100,
        width: 108,
        margin: 10
    },

    cityInfo: {
        marginTop: 15,
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

    workplaceInfo: {
        marginLeft: 30,
        flexDirection: 'row',
        marginTop: 5
    },

    workplaceTitle: {
        fontSize: 13
    },

    workplaceValue: {
        fontSize: 13,
        color: '#3EAFF2',
        marginLeft: 2
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

    feeText: {
        marginLeft: 30,
        color: '#888888',
        fontSize: 13,
        lineHeight: 13
    },

    customerInfo: {
        marginLeft: 30,
        flexDirection: 'row',
        marginTop: 12
    },

    customerTitle: {
        fontSize: 16,
        fontWeight: '600'
    },

    customerValue: {
        fontSize: 16,
        color: '#F96B5C',
        fontWeight: '600',
        textDecorationLine: 'underline'
    },

    customerIcon: {
        height: 23,
        width: 23,
        marginLeft: 7
    },

    orderManage: {
        flexDirection: 'column',
        marginTop: 15,
        marginLeft: 30,
        justifyContent: 'space-around'
    },

    cancelOrderText: {
        marginBottom: 15,
        fontSize: 16,
        color: '#F96B5C',
        textDecorationLine: 'underline'
    },

    openDisputeText: {
        fontSize: 16,
        color: '#F96B5C',
        textDecorationLine: 'underline'
    },

    viewMore: {
        color: '#3DB2F4',
        fontSize: 14,
        textDecorationLine: 'underline'
    },
    buttonOn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F96B5C',
        borderWidth: 6,
        borderStyle: 'solid',
        borderColor: '#FEEAE4',
        borderRadius: 70,
        width: Dimensions.get('window').width * 0.9,
        height: 70,
        marginTop: 260,
        marginLeft: '-3%'
    },
});

export default StatusScreen;
