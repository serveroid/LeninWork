import React, {useEffect, useLayoutEffect, useState} from 'react';
import {Dimensions, FlatList, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {db, storageRef} from '../Components/firebase.js';
import {ImageViewer} from '../Components/ImageViewer';

// Страница статуса взятого заказа. Получаем данные из БД о заказе и выводим на экран.
//Так же можно отменить заказ, открыть спор или перейти в чат с заказчиком.
const StatusScreen = props=>{

    const [orderData, setOrderData] = useState({});
    const [viewMoreСondition, setViewMoreCondition] = useState(false);
    const [taskImages, setTaskImages] = useState([{url: 'none', id: 0}]);
    const [modalVisible, setModalVisible] = useState(false);


    const getOrderData = (orderNumber)=>{
        // Получаем данные о заказе, а так же меняем title станицы
        let docRef = db.collection('orders').doc(orderNumber);

        docRef.get().then((doc)=>{
            if (doc.exists) {
                const orderDataObj = doc.data();
                props.navigation.setOptions({title: `Заказ №000${orderDataObj.id}`});
                setOrderData(orderDataObj);
            } else {
                // doc.data() will be undefined in this case
                console.log('No such document!');
            }
        }).catch((error)=>{
            console.log('Error getting document:', error);
        });
    };


    const getTaskImages = (taskId)=>{
        //Получаем сначала путь до каждого изображения в firebase, а затем url ссылки
        const pathImages = [];

        const getUrl = (pathList)=>{
            const urlImages = [];

            for (let path of pathList) {
                storageRef.child(path).getDownloadURL()
                    .then((url)=>{
                        urlImages.push(
                            {
                                id: urlImages.length,
                                url: url
                            }
                        );

                        if (urlImages.length === pathList.length) { //Проверяем, что забрали все ссылки и сохраняем массив в State
                            setTaskImages(urlImages);
                        }
                    })
                    .catch((error)=>{
                        console.log(error);
                    });
            }
        };

        // Create a reference under which you want to list
        const listRef = storageRef.child(`tasksImage/${taskId}`);
        listRef.listAll()
            .then((res)=>{
                res.items.forEach((itemRef)=>{
                    pathImages.push(itemRef._delegate._location.path_);
                });
                return pathImages;
            })
            .then((pathImages)=>{
                getUrl(pathImages);
            })
            .catch((error)=>{
                console.log(error);
                // Uh-oh, an error occurred!
            });
    };


    useEffect(()=>{
        getOrderData('1')
        getTaskImages(1);
    }, []);


    const RenderImage = ()=>{
        // Компонент рендеринга картинок в зависимости от кол-ва
        const renderItem = ({item})=>(
            <Image source={{uri: item.url}} style={{height: 30, width: 30, margin: 5}}/>
        );

        if (taskImages.length > 1) {
            return (
                <View style={{flexDirection: 'row', flexWrap: 'wrap', width: '76%', height: '70%'}}>
                    <TouchableOpacity
                        onPress={()=>{
                            setModalVisible(true);
                        }}>
                        <Image accessible={true} source={{uri: taskImages[0].url}} style={styles.noPhotoIcon}/>

                        <View style={{margin: 5}}>
                            <FlatList
                                data={taskImages.filter(item=>item.id != '0')}
                                renderItem={renderItem}
                                horizontal={true}
                                keyExtractor={item=>item.id.toString()}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            );
        } else if (taskImages.length === 1) {
            return (
                <View style={{flexDirection: 'row', flexWrap: 'wrap', width: '76%', height: '70%'}}>
                    <TouchableOpacity
                        onPress={()=>{
                            setModalVisible(true);
                        }}>
                        <Image source={{uri: taskImages[0].url}} style={styles.noPhotoIcon}/>
                    </TouchableOpacity>
                </View>
            );
        } else {
            return (
                <Image source={require('../assets/noPhoto.png')} style={styles.noPhotoIcon}/>
            );
        }
    };


    const BodyRender = ()=>{
        //Компонент рендеринга названия задачи и описания. Так же реализовано сворачивание длинного описания 

        if (viewMoreСondition === false) {
            return (
                <View style={styles.body}>
                    <View>
                        <Text style={styles.taskNameText}>{orderData.taskName}</Text>
                        <Text
                            numberOfLines={5}
                            ellipsizeMode="tail"
                            style={styles.taskDescriptionText}>
                            {orderData.discription}
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
                        <Text style={styles.taskNameText}>{orderData.taskName}</Text>
                        <Text
                            style={styles.taskDescriptionText}>
                            {orderData.discription}
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


    return (

        <View style={styles.container}>
            <ImageBackground
                source={require('../assets/backgroundStatusScreen.png')}
                resizeMode="stretch"
                style={styles.imageBack}>

                <ImageViewer visible={modalVisible}
                             onCancel={()=>setModalVisible(false)}
                             taskImages={taskImages}/>


                <TouchableOpacity style={styles.goToBack}
                                  onPress={()=>{
                                      props.navigation.goBack();
                                  }}

                >
                    <Image source={require('../assets/backArrow.png')} style={styles.goToBackIcon}/>
                    <Text style={styles.goToBackText}>Вернуться назад</Text>
                </TouchableOpacity>

                <BodyRender/>

                <View style={styles.cityInfo}>
                    <Text style={styles.cityTitle}>Город, регион:</Text>
                    <Text style={styles.cityValue}>{orderData.city}</Text>
                </View>

                <View style={styles.workplaceInfo}>
                    <Text style={styles.workplaceTitle}>Место работы:</Text>
                    <Text style={styles.workplaceValue}>{orderData.workplace}</Text>
                </View>

                <View style={styles.priceInfo}>
                    <Text style={styles.priceTitle}>Оплата:</Text>
                    <Text style={styles.priceValue}>{orderData.price} ₽</Text>
                </View>
                <Text style={styles.feeText}>(c учетом комиссии сервиса 20%)</Text>

                <View style={styles.customerInfo}>
                    <Text style={styles.customerTitle}>Заказчик:</Text>
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity onPress={()=>{props.navigation.navigate(
                            'UserProfile',)}}>
                            {/*{ userId: orderData.customerId})}}>   Здесь передается id заказчика/исполнителя */}
                            <Text style={styles.customerValue}>{orderData.customerName}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{}}>
                            {/* Здесь будет переход в чат, нужно будет получать id пользователей и создать чат, нужно перенести часть кода из FreelancerList
                            в отдельный компонент*/}
                            <Image source={require('../assets/customerIcon.png')} style={styles.customerIcon}/>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.orderManage}>
                    <TouchableOpacity
                        onPress={()=>{
                        }}
                    >
                        <Text style={styles.cancelOrderText}>Отменить заказ</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={()=>{
                        }}
                    >
                        <Text style={styles.openDisputeText}>Открыть спор</Text>
                    </TouchableOpacity>
                </View>

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
        fontWeight: '600'
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
        marginLeft: 3,
        fontWeight: '600',
        textDecorationLine: 'underline'
    },

    customerIcon: {
        height: 23,
        width: 23,
        marginLeft: 7
    },

    orderManage: {
        flexDirection: 'row',
        marginTop: 25,
        justifyContent: 'space-around'
    },

    cancelOrderText: {
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
    }
});

export default StatusScreen;