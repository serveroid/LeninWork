import React, {useState, useEffect, useLayoutEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, Dimensions, Modal, ScrollView, StatusBar, 
    TouchableWithoutFeedback, Pressable, Keyboard, Image } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import DatePicker from 'react-native-datepicker'

import * as Location from 'expo-location'

import firebase, {db} from '../Components/firebase'

import { LogBox } from 'react-native'
import { task } from '../redux/actions'

LogBox.ignoreLogs(['Setting a timer'])

export const CreateTask = (props) => {
    // User balance
    const balance = 5000

    const dispatch = useDispatch()

    const getDate = () => {
        const date = new Date()
        return `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`
    }

    let taskId = useSelector(state => state.taskId)
    if (!taskId) {taskId = (Math.floor(Math.random() * (Math.floor(99999) - Math.ceil(1))) + Math.ceil(1)).toString()}

    const name = useSelector(state => state.name)
    const description = useSelector(state => state.description)
    const getimages = useSelector(state => state.images)
    const price = useSelector(state => state.price)
    const date = useSelector(state => state.date)

    const address = useSelector(state => state.address)
    
    const [nameInput, setNameInput] = useState(name ? name : '')
    const [descriptionInput, setDescriptionInput] = useState(description ? description : '')
    const [images, setImages] = useState(getimages ? getimages : []) 
    const [priceInput, setPriceInput] = useState(price ? price : '')
    const [dateInput, setDateInput] = useState(date ? date : getDate())

    const [usercity, setUsercity] = useState(address ? address.city : null)
    const [userStreet, setUserStreet] = useState(address ? address.street : null)
    const [userStreetName, setUserStreetName] = useState(address ? address.streetName : null)

    const [modalVisible, setModalVisible] = useState(false)

    const [chekNameInput, setChekNameInput] = useState(false)
    const [chekDescriptionInput, setChekDescriptionInput] = useState(false)
    const [chekPriceInput, setChekPriceInput] = useState(false)

    const setNameInputHandler = e => setNameInput(e)
    const setDescriptionInputHandler = e => setDescriptionInput(e)
    const setImageHandler = e => setImages(e)
    const setPriceInputHandler = e => setPriceInput(e)
    const setDateInputHandler = e => setDateInput(e)

    const setUsercityHandler = e => setUsercity(e)
    const setUserStreetHandler = e => setUserStreet(e)
    const setUserStreetNameHandler = e => setUserStreetName(e)

    const modalVisibleHandler = e => setModalVisible(e)

    const setChekNameInputHandler = e => setChekNameInput(e)
    const setChekDescriptionInputHandler = e => setChekDescriptionInput(e)
    const setChekPriceInputHandler = e => setChekPriceInput(e)


    //меняем заголовок в шапке
    useLayoutEffect(()=>{
        props.navigation.setOptions({
            title: ('Создание заказа')
        });
    }, []);

    const getCoords = async () => {
        try {
            let location = await Location.getCurrentPositionAsync({})
            return location
          } catch (err) {
            let location = await Location.getLastKnownPositionAsync({accuracy: 6})
            return location
          }
    }
    useEffect(() => {
        (async () => {  
            let { status } = await Location.requestForegroundPermissionsAsync()
            if (status !== 'granted') {
                console.log('Permission to access location was denied')
                return
            }

            const location = await getCoords()
            if (location) {
                const { latitude, longitude } = location.coords;
                let response = await Location.reverseGeocodeAsync({
                    latitude,
                    longitude
                })
              
                for (let item of response) {
                    let name = item.name.replace(' ', '').split(',')

                    setUsercityHandler(item.city)
                    setUserStreetHandler(item.street)
                    setUserStreetNameHandler(name[name.length-1])
                }
            }
        })()
    }, [])

    const [validateButton, setvalidateButton] = useState(false)
    const validateButtonVoid = (descriptionI = descriptionInput, priceI = priceInput, nameI = nameInput) => {
        if (descriptionI.length >= 15 && /^\d+$/.test(priceI) && priceI.length >= 3 && nameI.length >= 3 && usercity) {
            setvalidateButton(true)
        } else {
            setvalidateButton(false)
        }
    }

    const writeUserData = async (taskId, userId, name, description, photos = [], category, price, date, address) => {
        const res = await db.collection('tasks').doc(taskId).set({
            taskId: taskId,
            userId: userId,
            name: name,
            description: description,
            photo: photos,
            category: category,
            price: price,
            date: date,
            address: address
        })
    }

    const pickImage = async () => {
        const permissionStatus = await ImagePicker.getMediaLibraryPermissionsAsync()
        if (permissionStatus.status !== 'granted') {
            const permissionStatus = await ImagePicker.requestMediaLibraryPermissionsAsync()
        }
        if (permissionStatus.status == 'granted') {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                quality: 1
            })
            
            const blob = await new Promise( (resolve, rejekt) => {
                const xhr = new XMLHttpRequest()
                xhr.onload = function() {
                    resolve(xhr.response)
                }
                xhr.onerror = function(e) {
                    console.log(e)
                    rejekt(new TypeError('Nrtwork request err'))
                }
                xhr.responseType = 'blob'
                xhr.open('get', result.uri, true)
                xhr.send(null)
            })

            let title = result.uri.split('/')
            const ref = firebase.storage().ref().child(title[title.length - 1].split('.')[0])
            const snapshot = await ref.put(blob)
            blob.close()

            const downloadURL = await snapshot.ref.getDownloadURL()
            setImageHandler([...images, {path: snapshot.metadata.fullPath, url: downloadURL}])
        }
    }

    const [keyboardHeight, setKeyboardHeight] = useState(0)
    function onKeyboardDidShow(e) {setKeyboardHeight(e.endCoordinates.height)}
    function onKeyboardDidHide() {setKeyboardHeight(0)}
    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', onKeyboardDidShow)
        Keyboard.addListener('keyboardDidHide', onKeyboardDidHide)
        return () => {
            Keyboard.removeListener('keyboardDidShow', onKeyboardDidShow)
            Keyboard.removeListener('keyboardDidHide', onKeyboardDidHide)
        }
    }, [])

    return (
        <ImageBackground source={require('../assets/menu.png')} resizeMode='stretch' style={styles.imageBack}>
            <Modal
                onRequestClose = {() => {modalVisibleHandler(!modalVisible)}}
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    modalVisibleHandler(!modalVisible);
                }}
                 >
                <TouchableWithoutFeedback onPress = {() => {modalVisibleHandler(false)}}>
                    <View style={styles.centeredView}>
                        <Pressable style={styles.modalView}>

                            <View style = {styles.city}>
                                <Text style = {styles.text}>{'Город'}</Text>
                                <TextInput style = {styles.inputName}
                                    onKeyPress = {validateButtonVoid}
                                    onChangeText = {text => setUsercityHandler(text)}
                                    value = {usercity ? usercity : ''}
                                    required
                                />
                            </View>

                            <View style = {styles.fullstreet}>
                                <View style = {styles.street}>
                                    <Text style = {styles.text}>{'Улица'}</Text>
                                    <TextInput style = {styles.inputName}
                                        onChangeText = {text => setUserStreet(text)}
                                        value = {userStreet ? userStreet : ''}
                                        required
                                    />
                                </View>

                                <View style = {styles.streetname}>
                                    <Text style = {styles.text}>{'Дом'}</Text>
                                    <TextInput style = {styles.inputName}
                                        onChangeText = {text => setUserStreetName(text)}
                                        value = {userStreetName ? userStreetName : ''}
                                        required
                                    />
                                </View>
                            </View>

                            <TouchableOpacity
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => {
                                    modalVisibleHandler(!modalVisible)
                                    validateButtonVoid()
                                    }}>
                                <Text style={styles.textStyle}>{'Сохранить'}</Text>
                            </TouchableOpacity>
                        </Pressable>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            <View style = {{top: '15%',
                            width: Dimensions.get('window').width,
                            height: (Dimensions.get('window').height*0.8538)-keyboardHeight,
                            alignItems: 'center',
                            borderColor: '#F3FBFF',
                            borderWidth: 3}}>
                <ScrollView contentContainerStyle={ styles.scrollview } bounces = {false}>
                    {/* task name */}
                    <View style = {styles.name}>
                        <Text style = {styles.text}>{'Название'}</Text>
                        <TextInput style = {chekNameInput ? styles.inputNameErr : styles.inputName}
                            onChangeText = {text => setNameInputHandler(text)}
                            value = {nameInput}
                            required
                            onKeyPress = {validateButtonVoid}
                            onFocus = {() => setChekNameInputHandler(true)}
                            onEndEditing = {() => setChekNameInputHandler(false)}
                        />
                    </View>

                    {/* task description */}
                    <View style = {styles.description}>
                        <Text style = {styles.text}>{'Описание заказа'}</Text>
                        <TextInput
                            multiline
                            numberOfLines={4}
                            onChangeText={text => setDescriptionInputHandler(text)}
                            value={descriptionInput}
                            editable
                            maxLength = {300}
                            style = {chekDescriptionInput ? styles.inputDescriptionErr : styles.inputDescription}
                            onKeyPress = {validateButtonVoid}
                            onFocus = {() => setChekDescriptionInputHandler(true)}
                            onEndEditing = {() => setChekDescriptionInputHandler(false)}
                        />
                    </View>
                    
                    {/* upload photo */}
                    {!images.length ?
                        <TouchableOpacity style = {styles.uploadPhoto} onPress={pickImage}>
                            <Text style = {{color: '#3DB2F4'}}>{'+ Добавить изображение'}</Text>
                        </TouchableOpacity>
                        :
                        <View style = {{flexDirection: 'row', height: 80, width: '90%'}}>
                            {images.map((img, index) =>
                                <View key = {index} style = {{width: '20%' , height: 80, margin: '2%'}}>
                                    <Image style = {{width: '100%', height: '100%', resizeMode: 'contain'}} source = {{uri: img.url}}/>
                                    
                                    <TouchableOpacity style = {{
                                        position: 'absolute', right: 0, top: 0, margin: 0, backgroundColor: 'red', borderRadius: 70, width: 20, 
                                        height: 20, justifyContent: 'center'
                                        }} 
                                        onPress={() => {
                                            setImageHandler(images.filter(item => item !== img))
                                            firebase.storage().ref(img.path).delete()
                                        }}>
                                        
                                        <Text style = {{color: 'white', textAlign: 'center'}}>{'X'}</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                            {images.length <= 3 ? 
                                <TouchableOpacity onPress={pickImage} style = {{
                                    width: 80, height: 80, borderWidth: 3, borderColor: '#CDF4FF', backgroundColor: '#CDF4FF', borderRadius: 20
                                    }}>
                                    <Text style = {{textAlign: 'center', fontWeight: 'bold', fontSize: 120, top: '-68%', color: '#FFFFFF'}}>{'+'}</Text>
                                </TouchableOpacity>
                                :
                                <View>
                                    
                                </View>
                            }
                        </View>
                    }

                    {/* select city */}
                    <View style = {styles.selectCity}>
                        { usercity ? 
                        <View style = {styles.selectCity}>
                            <Text style = {styles.text}>{'Выберите город'}</Text>
                            <TouchableOpacity onPress={() => setModalVisible(true)}>
                                <Text style = {{textDecorationLine: 'underline', color: '#3DB2F4'}}>{`${usercity}${userStreet?', '+userStreet:''}${userStreetName?' '+userStreetName:''}`}</Text>
                            </TouchableOpacity>
                        </View>:
                        <View style = {styles.selectCity}>
                            <TouchableOpacity onPress={() => setModalVisible(true)}>
                                <Text style = {{textDecorationLine: 'underline', color: '#3DB2F4'}}>{'Выберите город'}</Text>
                                <View style = {{borderColor: '#6DC2FF', borderWidth: 1, width: '90%', height: 2, marginTop: 10}}></View>
                                <Text style = {{color: 'red'}}>{'Геолокация отключена, введите адрес'}</Text>
                            </TouchableOpacity>
                        </View>}
                    </View>

                    {/* select category */}
                    <View style = {styles.selectCity}>
                        <Text style = {styles.text}>{'Выберите подкатегорию'}</Text>
                        <TouchableOpacity>
                            <Text style = {{textDecorationLine: 'underline', color: '#3DB2F4'}}>{'Репетиторы и обучение. Что-то другое'}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* task price */}
                    <View style = {styles.price}>
                        <Text style = {styles.text}>{'Стоимость заказа'}</Text>
                        <TextInput style = {chekPriceInput ? styles.priceInputErr : styles.priceInput}
                            onChange = {({ nativeEvent: { text} }) => {
                                setPriceInputHandler(text)
                                validateButtonVoid(undefined, text)
                            }}
                            value = {priceInput}
                            keyboardType={'number-pad'}
                            required
                            num
                            selectTextOnFocus = {true}
                            onFocus = {() => setChekPriceInputHandler(true)}
                            onEndEditing = {() => setChekPriceInputHandler(false)}
                        />
                    </View>
                        
                    <View style = {{alignItems: 'center', width: '90%', margin: 10}}>
                        <Text style = {{color: '#888888', alignItems: 'center'}}>{'Сервис взымает комиссию 20% у испонителя за выполненный заказ'}</Text>
                    </View>
                    
                    {/* select date */}
                    <View style = {styles.selectDate}>
                        <Text>{'Дата сдачи заказа'}</Text>
                        <DatePicker
                            style={{width: 140}}
                            date={dateInput}
                            mode="date"
                            placeholder="select date"
                            format="DD-MM-YYYY"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                                dateIcon: {
                                    display: 'none'
                                },
                                dateInput: {
                                    borderColor: '#BDBDBD',
                                    borderWidth: 1,
                                    borderRadius: 60,
                                }
                            }}
                            onDateChange={(date) => {setDateInputHandler(date)}}
                        />
                    </View>

                    {/* publish task button */}
                    <TouchableOpacity
                        style={validateButton ? styles.buttonOn : styles.buttonOff} 
                        onPress = {() => { 
                            if (balance < priceInput) {
                                dispatch(task(taskId, nameInput, descriptionInput, images, {city: usercity, street: userStreet, streetName: userStreetName}, priceInput, dateInput))
                                props.navigation.navigate('CreateTaskPayment')
                            } else {
                                dispatch(task(taskId, nameInput, descriptionInput, images, {city: usercity, street: userStreet, streetName: userStreetName}, priceInput, dateInput))
                                writeUserData(taskId, '1', nameInput, descriptionInput, images, 'category', priceInput, dateInput, {city: usercity, street: userStreet, streetname: userStreetName})
                                props.navigation.navigate('CreateTaskReady')
                            }
                        }} 
                        disabled = {!validateButton}>
                        <Text style={{color: '#F9F9F9', fontSize: 20,}}>{'Опубликовать'}</Text>
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
        height: (Dimensions.get('window').height*0.8538),
        alignItems: 'center',
        borderColor: '#F3FBFF',
        // borderColor: 'red',
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
