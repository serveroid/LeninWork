import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import {
    StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, Dimensions, Modal, ScrollView, StatusBar,
    TouchableWithoutFeedback, Pressable, Keyboard, Image, Platform, ActivityIndicator
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import DateTimePicker from '@react-native-community/datetimepicker'

import * as Location from 'expo-location'

import firebase, { db } from '../../Components/firebase.js'

import { LogBox } from 'react-native'
import { task } from '../../redux/actions.js'

import { serialize } from 'object-to-formdata'
import geohash from 'ngeohash'

LogBox.ignoreLogs(['Setting a timer'])

export const CreateTask = (props) => {

    const category = useSelector(state => state.category)
    const subCategory = useSelector(state => state.subCategory)
    // State для того, чтобы при изменении мы могли его менять и отображать, не добовляя новых проверок
    const [userCategory, setUserCategory] = useState('')
    const [userSubCategory, setUserSubCategory] = useState('')

    const userId = useSelector(state=>state.userId)
    const token = useSelector(state=>state.token)
    const userName = useSelector(state => state.userData.name)
    // User balance
    const balance = 5000

    const [taskId, setTaskId] = useState(0)

    const [nameInput, setNameInput] = useState('')
    const [descriptionInput, setDescriptionInput] = useState('')
    const [images, setImages] = useState([])
    const [priceInput, setPriceInput] = useState('')
    const [dateInput, setDateInput] = useState(new Date())
    const [showDate, setShowDate] = useState(false)

    const [usercity, setUsercity] = useState(null)
    const [userStreet, setUserStreet] = useState(null)
    const [userStreetName, setUserStreetName] = useState(null)
    const [coords, setCoords] = useState({})

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        // Проверяем передан ли параметр на изменение заказа
        if (props.route.params.update) {
            setNameInput(props.route.params.item.title)
            setDescriptionInput(props.route.params.item.description)
            setImages(props.route.params.item.images)
            setPriceInput(`${props.route.params.item.price}`)
            setDateInput(new Date(props.route.params.item.deliveryDate))
            setUsercity(props.route.params.item.location[3])
            setUserStreet(props.route.params.item.location[4])
            setUserStreetName(props.route.params.item.location[5])
            setTaskId(props.route.params.item._id)
            setUserCategory(props.route.params.item.category)
            setUserSubCategory(props.route.params.item.subCategory)
        }
    }, [])

    useEffect(() => {

        setUserCategory(category)
        setUserSubCategory(subCategory)

    }, [category, subCategory])

    const [modalVisible, setModalVisible] = useState(false)

    const [chekNameInput, setChekNameInput] = useState(false)
    const [chekDescriptionInput, setChekDescriptionInput] = useState(false)
    const [chekPriceInput, setChekPriceInput] = useState(false)

    const setNameInputHandler = e => setNameInput(e)
    const setDescriptionInputHandler = e => setDescriptionInput(e)
    const setImageHandler = e => setImages(e)
    const setPriceInputHandler = e => setPriceInput(e)
    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || dateInput;
        setShowDate(Platform.OS === 'ios');

        // Если введены некоректные данные, то сетается сегодняшняя дата
        if (currentDate.getDate() < dateInput.getDate() || currentDate.getMonth() < dateInput.getMonth() || currentDate.getFullYear() < dateInput.getFullYear()) {
            setDateInput(dateInput);
        }
        else setDateInput(currentDate);

    }
    const setShowDateHandler = e => setShowDate(e)

    const setUsercityHandler = e => setUsercity(e)
    const setUserStreetHandler = e => setUserStreet(e)
    const setUserStreetNameHandler = e => setUserStreetName(e)

    const modalVisibleHandler = e => setModalVisible(e)

    const setChekNameInputHandler = e => setChekNameInput(e)
    const setChekDescriptionInputHandler = e => setChekDescriptionInput(e)
    const setChekPriceInputHandler = e => setChekPriceInput(e)

    //меняем заголовок в шапке
    useLayoutEffect(() => {
        props.navigation.setOptions({
            title: (props.route.params.update ? 'Изменение заказа' : 'Создание заказа')
        });
    }, []);

    const pushTaskInfo = async () => {

        const hash = geohash.encode(coords.latitude, coords.longitude)

        if(props.route.params.update){
            console.log('ok')
        }

        if (props.route.params.update) {

            const data = serialize({
                token: token,
                userId: userId,
                idTask: taskId,
                title: nameInput,
                name: userName,
                description: descriptionInput,
                deliveryDate: `${dateInput}`,
                price: +priceInput,
                categories: [userCategory, userSubCategory],
                images: images,
                location: [coords.latitude, coords.longitude, hash, usercity, userStreet, userStreetName]
            })

            console.log('update')

            try {

                await fetch('http://193.187.96.43/update_task', {
                    method: 'POST',
                    body: data,
                })
                .then(() => {
                    props.navigation.navigate('CreateTaskStatus', {param: 'any'})
                })

            } catch (err) {
                console.log(err.message)
            }

        } else {

            console.log('create')

            const data = serialize({
                token: token,
                userId: userId,
                title: nameInput,
                name: userName,
                description: descriptionInput,
                deliveryDate: `${dateInput}`,
                price: +priceInput,
                categories: [category, subCategory],
                images: images,
                location: [coords.latitude, coords.longitude, hash, usercity, userStreet, userStreetName]
            })

            try {

                await fetch('http://193.187.96.43/create_task', {
                    method: 'POST',
                    body: data,
                })
                .then(res => res.json())
                .then(res => {
                    props.navigation.navigate('CreateTaskReady', { taskId: res.sequential_number })
                })

            } catch (err) {
                console.log(err.message)
            }

        }
    }

    const getCoords = async () => {
        try {
            let location = await Location.getCurrentPositionAsync({})
            return location
        } catch (err) {
            let location = await Location.getLastKnownPositionAsync({ accuracy: 6 })
            return location
        }
    }
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync()
            console.log(status)
            if (status != 'granted') {
                console.log('Permission to access location was denied')
                return
            }
            else {
                const location = await getCoords()
                setCoords(location.coords)

                if (props.route.params.create && location) {
                    const { latitude, longitude } = location.coords;
                    let response = await Location.reverseGeocodeAsync({
                        latitude,
                        longitude
                    })

                    for (let item of response) {
                        let name = item.name.replace(' ', '').split(',')

                        setUsercityHandler(item.city)
                        setUserStreetHandler(item.street)
                        setUserStreetNameHandler(name[name.length - 1])
                    }
                }
            }


        })()
    }, [])

    const getCoordsWithUserCity = async () => {

        if (usercity) {
            if (usercity.length >= 4) {
                const coords = await Location.geocodeAsync(usercity)

                setCoords({
                    latitude: coords[0].latitude,
                    longitude: coords[0].longitude
                })
            }
        }

    }

    useEffect(() => {

        getCoordsWithUserCity()

    }, [usercity])

    const [validateButton, setvalidateButton] = useState(false)
    const validateButtonVoid = (descriptionI = descriptionInput, priceI = priceInput, nameI = nameInput) => {
        if (descriptionI.length >= 15 && /^\d+$/.test(priceI) && priceI.length >= 3 && nameI.length >= 3 && usercity && userCategory) {
            setvalidateButton(true)
        } else {
            setvalidateButton(false)
        }
    }
    useEffect(() => {
        validateButtonVoid()
    }, [nameInput, descriptionInput, priceInput, usercity, category])

    const [errMessage, setErrMessage] = useState('')
    const errMessageVoid = () => {
        if (nameInput.length >= 3) {
            setErrMessage('')
        } else {
            setErrMessage('Короткое название')
            return
        }
        if (descriptionInput.length >= 5) {
            setErrMessage('')
        } else {
            setErrMessage('Короткое описание')
            return
        }
        if (usercity) {
            setErrMessage('')
        } else {
            setErrMessage('Не выбран город')
            return
        }
        if (category) {
            setErrMessage('')
        } else {
            setErrMessage('не выбрана категория')
            return
        }
        if (priceInput.length >= 3) {
            setErrMessage('')
        } else {
            setErrMessage('Минимальная цена 100')
            return
        }
        setErrMessage('')
    }
    useEffect(() => {
        errMessageVoid()
    }, [[nameInput, descriptionInput, priceInput, usercity, category]])

    const pickImage = async () => {
        const permissionStatus = await ImagePicker.getMediaLibraryPermissionsAsync()
        if (permissionStatus.status !== 'granted') {
            permissionStatus = await ImagePicker.requestMediaLibraryPermissionsAsync()
        }
        if (permissionStatus.status == 'granted') {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                quality: 1
            })

            let fileName = result.uri.split('/').pop()

            let match = /\.(\w+)$/.exec(fileName)
            let type = match ? `image/${match[1]}` : 'image'

            setImageHandler([...images, { uri: result.uri, filename: fileName, type: type }])

        }
    }

    const [keyboardHeight, setKeyboardHeight] = useState(0)
    function onKeyboardDidShow(e) { setKeyboardHeight(e.endCoordinates.height) }
    function onKeyboardDidHide() { setKeyboardHeight(0) }
    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', onKeyboardDidShow)
        Keyboard.addListener('keyboardDidHide', onKeyboardDidHide)
        return () => {
            Keyboard.removeListener('keyboardDidShow', onKeyboardDidShow)
            Keyboard.removeListener('keyboardDidHide', onKeyboardDidHide)
        }
    }, [])

    return (
        <ImageBackground source={require('../../assets/menu.png')} resizeMode='stretch' style={styles.imageBack}>
            <Modal
                onRequestClose={() => { modalVisibleHandler(!modalVisible) }}
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    modalVisibleHandler(!modalVisible);
                }}
            >
                <TouchableWithoutFeedback onPress={() => { modalVisibleHandler(false) }}>
                    <View style={styles.centeredView}>
                        <Pressable style={styles.modalView}>

                            <View style={styles.city}>
                                <Text style={styles.text}>{'Город'}</Text>
                                <TextInput style={styles.inputName}
                                    onChangeText={text => setUsercityHandler(text)}
                                    value={usercity ? usercity : ''}
                                    required
                                />
                            </View>

                            <View style={styles.fullstreet}>
                                <View style={styles.street}>
                                    <Text style={styles.text}>{'Улица'}</Text>
                                    <TextInput style={styles.inputName}
                                        onChangeText={text => setUserStreet(text)}
                                        value={userStreet ? userStreet : ''}
                                        required
                                    />
                                </View>

                                <View style={styles.streetname}>
                                    <Text style={styles.text}>{'Дом'}</Text>
                                    <TextInput style={styles.inputName}
                                        onChangeText={text => setUserStreetName(text)}
                                        value={userStreetName ? userStreetName : ''}
                                        required
                                    />
                                </View>
                            </View>

                            <TouchableOpacity
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => {
                                    modalVisibleHandler(!modalVisible)
                                }}>
                                <Text style={styles.textStyle}>{'Сохранить'}</Text>
                            </TouchableOpacity>
                        </Pressable>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            <View style={{
                top: '15%',
                width: Dimensions.get('window').width,
                height: (Dimensions.get('window').height * 0.8538) - keyboardHeight,
                alignItems: 'center',
                borderColor: '#F3FBFF',
                borderWidth: 3
            }}>
                <ScrollView contentContainerStyle={styles.scrollview} bounces={false}>
                    {/* task name */}
                    <View style={styles.name}>
                        <Text style={styles.text}>{'Название'}</Text>
                        <TextInput style={chekNameInput ? styles.inputNameErr : styles.inputName}
                            onChangeText={text => setNameInputHandler(text)}
                            value={nameInput}
                            required
                            onFocus={() => setChekNameInputHandler(true)}
                            onEndEditing={() => setChekNameInputHandler(false)}
                        />
                    </View>

                    {/* task description */}
                    <View style={styles.description}>
                        <Text style={styles.text}>{'Описание заказа'}</Text>
                        <TextInput
                            multiline
                            numberOfLines={4}
                            onChangeText={text => setDescriptionInputHandler(text)}
                            value={descriptionInput}
                            editable
                            maxLength={300}
                            style={chekDescriptionInput ? styles.inputDescriptionErr : styles.inputDescription}
                            onFocus={() => setChekDescriptionInputHandler(true)}
                            onEndEditing={() => setChekDescriptionInputHandler(false)}
                        />
                    </View>

                    {/* upload photo */}
                    {!images.length ?
                        <TouchableOpacity style={styles.uploadPhoto} onPress={pickImage}>
                            <Text style={{ color: '#3DB2F4' }}>{'+ Добавить изображение'}</Text>
                        </TouchableOpacity>
                        :
                        <View style={{ flexDirection: 'row', height: 80, width: '90%' }}>
                            {images.map((img, index) =>
                                <View key={index} style={{ width: '20%', height: 80, margin: '2%' }}>
                                    <Image style={{ width: '100%', height: '100%', resizeMode: 'contain' }} source={{ uri: img.url }} />

                                    <TouchableOpacity style={{
                                        position: 'absolute', right: 0, top: 0, margin: 0, backgroundColor: 'red', borderRadius: 70, width: 20,
                                        height: 20, justifyContent: 'center'
                                    }}
                                        onPress={() => {
                                            setImageHandler(images.filter(item => item !== img))
                                        }}>

                                        <Text style={{ color: 'white', textAlign: 'center' }}>{'X'}</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                            {images.length <= 3 ?
                                <TouchableOpacity onPress={pickImage} style={{
                                    width: 80, height: 80, borderWidth: 3, borderColor: '#CDF4FF', backgroundColor: '#CDF4FF', borderRadius: 20
                                }}>
                                    <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 120, top: '-68%', color: '#FFFFFF' }}>{'+'}</Text>
                                </TouchableOpacity>
                                :
                                <View>

                                </View>
                            }
                        </View>
                    }

                    {/* select city */}
                    <View style={styles.selectCity}>
                        {usercity ?
                            <View style={styles.selectCity}>
                                <Text style={styles.text}>{'Выберите город'}</Text>
                                <TouchableOpacity onPress={() => setModalVisible(true)}>
                                    <Text style={{ textDecorationLine: 'underline', color: '#3DB2F4' }}>{`${usercity}${userStreet ? ', ' + userStreet : ''}${userStreetName ? ' ' + userStreetName : ''}`}</Text>
                                </TouchableOpacity>
                            </View> :
                            <View style={styles.selectCity}>
                                <TouchableOpacity onPress={() => setModalVisible(true)}>
                                    <Text style={{ textDecorationLine: 'underline', color: '#3DB2F4' }}>{'Выберите город'}</Text>
                                    <View style={{ borderColor: '#6DC2FF', borderWidth: 1, width: '90%', height: 2, marginTop: 10 }}></View>
                                    <Text style={{ color: 'red' }}>{'Геолокация отключена, введите адрес'}</Text>
                                </TouchableOpacity>
                            </View>}
                    </View>

                    {/* select category */}
                    <View style={styles.selectCity}>
                        <Text style={styles.text}>{'Выберите подкатегорию'}</Text>
                        <TouchableOpacity onPress={() => {
                            props.route.params.create ?
                                props.navigation.navigate('SearchCategories', { name: 'Выберете категорию', screen: 'CreateTask', create: true }) :
                                props.navigation.navigate('SearchCategories', { name: 'Выберете категорию', screen: 'CreateTask', create: false })
                        }}>
                            <Text style={{ textDecorationLine: 'underline', color: '#3DB2F4' }}>{`${userCategory ? (userSubCategory ? `${userCategory}, ${userSubCategory}` : userCategory) : 'Выберете категорию'}`}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* task price */}
                    <View style={styles.price}>
                        <Text style={styles.text}>{'Стоимость заказа'}</Text>
                        <TextInput style={chekPriceInput ? styles.priceInputErr : styles.priceInput}
                            onChange={({ nativeEvent: { text } }) => {
                                if (/^\d+$/.test(text) || text == '') {
                                    setPriceInputHandler(text)
                                }
                            }}
                            value={priceInput}
                            keyboardType={'number-pad'}
                            required
                            num
                            selectTextOnFocus={true}
                            onFocus={() => setChekPriceInputHandler(true)}
                            onEndEditing={() => setChekPriceInputHandler(false)}
                        />
                    </View>

                    <View style={{ alignItems: 'center', width: '90%', margin: 10 }}>
                        <Text style={{ color: '#888888', alignItems: 'center' }}>{'Сервис взымает комиссию 20% у испонителя за выполненный заказ'}</Text>
                    </View>

                    {/* select date */}
                    <View style={styles.selectDate}>
                        <Text>{'Дата сдачи заказа'}</Text>
                        <TouchableOpacity onPress={() => {
                            setShowDateHandler(true)
                        }} style={{ borderColor: '#BDBDBD', borderWidth: 2, borderRadius: 30, height: 35, width: 111, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 17, color: '#000000' }}>{`${dateInput.getDate()}-${dateInput.getMonth() + 1}-${dateInput.getFullYear()}`}</Text>
                        </TouchableOpacity>
                        {showDate && (<DateTimePicker
                            style={{ width: 140 }}
                            value={dateInput}
                            mode={'date'}
                            display="default"
                            onChange={onChangeDate}
                        />)}
                    </View>

                    {/* publish task button */}
                    <TouchableOpacity
                        style={validateButton ? styles.buttonOn : styles.buttonOff}
                        onPress={() => {
                            if (balance < priceInput) {
                                props.navigation.navigate('CreateTaskPayment')
                            } else {
                                // Если объект с параметрами был передан, то обновляем данные заказа, в противном случае добовляем новый заказ
                                pushTaskInfo()
                            }
                        }}
                        disabled={!validateButton}>
                        <Text style={{ color: '#F9F9F9', fontSize: 20, }}>{errMessage ? errMessage : (props.route.params.create ? 'Опубликовать' : 'Сохранить')}</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        top: '15%',
        width: Dimensions.get('window').width,
        height: (Dimensions.get('window').height * 0.8538),
        alignItems: 'center',
        borderColor: '#F3FBFF',
        borderWidth: 3,
    },
    scrollview: {
        alignItems: 'center',
        width: Dimensions.get('window').width,
    },
    name: {
        width: '90%',
        height: 70,
    },
    description: {
        width: '90%',
        height: 160,
    },
    uploadPhoto: {
        width: '90%',
        height: 30,
    },
    selectCity: {
        width: '90%',
        height: 50,
    },
    selectCategory: {
        width: '90%',
        height: 100,
    },
    price: {
        alignItems: 'center',
        width: '90%',
        height: 80,
    },
    selectDate: {
        alignItems: 'center',
        width: '90%',
        height: 80,
    },
    text: {
        // fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 18,
        lineHeight: 35,
        color: '#888888'
    },
    inputName: {
        width: '100%',
        height: 37,
        backgroundColor: '#FFFFFF',
        borderColor: '#BDBDBD',
        borderWidth: 2,
        borderRadius: 60,
        padding: 9
    },
    inputNameErr: {
        width: '100%',
        height: 37,
        backgroundColor: '#FFFFFF',
        borderColor: '#F96B5C',
        borderWidth: 2,
        borderRadius: 60,
        padding: 9
    },
    inputDescription: {
        width: '100%',
        height: 120,
        backgroundColor: '#FFFFFF',
        borderColor: '#BDBDBD',
        borderWidth: 2,
        borderRadius: 22,
        textAlignVertical: 'top',
        padding: 9
    },
    inputDescriptionErr: {
        width: '100%',
        height: 120,
        backgroundColor: '#FFFFFF',
        borderColor: '#F96B5C',
        borderWidth: 2,
        borderRadius: 22,
        textAlignVertical: 'top',
        padding: 9
    },
    priceInput: {
        width: '50%',
        height: 37,
        backgroundColor: '#FFFFFF',
        borderColor: '#BDBDBD',
        borderWidth: 2,
        borderRadius: 60,
        textAlign: 'center',
        padding: 9
    },
    priceInputErr: {
        width: '50%',
        height: 37,
        backgroundColor: '#FFFFFF',
        borderColor: '#F96B5C',
        borderWidth: 2,
        borderRadius: 60,
        textAlign: 'center',
        padding: 9
    },
    buttonOn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F96B5C',
        borderWidth: 10,
        borderStyle: 'solid',
        borderColor: '#FEEAE4',
        borderRadius: 70,
        width: Dimensions.get('window').width * 0.9,
        height: 80
    },
    buttonOff: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        borderWidth: 10,
        borderStyle: 'solid',
        borderColor: '#FFFFFF',
        borderRadius: 70,
        width: Dimensions.get('window').width * 0.9,
        height: 80
    },
    imageBack: {
        marginTop: StatusBar.currentHeight,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },

    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    modalView: {
        width: '97%',
        height: 200,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 10,
    },
    city: {
        width: '100%',
        height: 70,
    },
    fullstreet: {
        width: '97%',
        height: 70,
        flexDirection: 'row'
    },
    street: {
        width: '80%',
        height: 70,
    },
    streetname: {
        marginLeft: 10,
        width: '20%',
        height: 70,
    },
    button: {
        borderRadius: 20,
        padding: 7,
        margin: 10
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#3DB2F4",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
})
