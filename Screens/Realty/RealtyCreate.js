import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import {
    StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, Dimensions, Modal, ScrollView, StatusBar,
    TouchableWithoutFeedback, Pressable, Keyboard, Image, KeyboardAvoidingView
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'

import * as Location from 'expo-location'


import { realty } from '../../redux/actions.js'




export const RealtyCreate = (props) => {
    const dispatch = useDispatch()




    const category = useSelector(action => action.realtyCategory)
    let subCategoryOne = useSelector(action => action.realtySubCategoryOne)
    let subCategoryTwo = useSelector(action => action.realtySubCategoryTwo)




    const currentRealty = props.route.params.currentRealty


    const realtyAdd = useSelector(state => state.realtyAdd)
    let realtyId = realtyAdd.length

    const [nameInput, setNameInput] = useState('')
    const [descriptionInput, setDescriptionInput] = useState('')
    const [images, setImages] = useState([])
    const [areaInput, setAreaInput] = useState('')
    const [priceInput, setPriceInput] = useState('')


    const userId = useSelector(state => state.userId)
    const token = useSelector(state => state.token)

    const address = useSelector(state => state.address)


    const [usercity, setUsercity] = useState(address ? address.city : null)
    const [userStreet, setUserStreet] = useState(address ? address.street : null)
    const [userStreetName, setUserStreetName] = useState(address ? address.streetName : null)
    const [userLatitude, setUserLatitude] = useState(address ? address.latitude : null)
    const [userLongitude, setUserLongitude] = useState(address ? address.longitude : null)

    const [modalVisible, setModalVisible] = useState(false)



    const [chekNameInput, setChekNameInput] = useState(false)
    const [chekDescriptionInput, setChekDescriptionInput] = useState(false)
    const [chekAreaInput, setChekAreaInput] = useState(false)
    const [chekPriceInput, setChekPriceInput] = useState(false)

    const setNameInputHandler = e => setNameInput(e)
    const setDescriptionInputHandler = e => setDescriptionInput(e)
    const setImageHandler = e => setImages(e)
    const setAreaInputHandler = e => setAreaInput(e)
    const setPriceInputHandler = e => setPriceInput(e)

    const setUsercityHandler = e => setUsercity(e)
    const setUserStreetHandler = e => setUserStreet(e)
    const setUserStreetNameHandler = e => setUserStreetName(e)

    const modalVisibleHandler = e => setModalVisible(e)

    const setChekNameInputHandler = e => setChekNameInput(e)
    const setChekDescriptionInputHandler = e => setChekDescriptionInput(e)
    const setChekAreaInputHandler = e => setChekAreaInput(e)
    const setChekPriceInputHandler = e => setChekPriceInput(e)



    //меняем заголовок в шапке
    useLayoutEffect(() => {
        props.navigation.setOptions({
            title: ('Добавить недвижимость')
        });
    }, []);



    //присваем значения полям из инстанса документа
    useEffect(() => {
        if (props.route.params.changeProfile == true) {
            setNameInput(currentRealty.name)
            setDescriptionInput(currentRealty.description)
            setImages(currentRealty.images)
            setAreaInput(currentRealty.areaSize)
            setPriceInput(currentRealty.price)
            setUsercity(currentRealty.address.city)
            setUserStreet(currentRealty.address.street)
            setUserStreetName(currentRealty.address.streetName)
        }
    }, [])

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
        if (props.route.params.changeProfile == true) {
            setvalidateButton(true)
        } else {
            validateButtonVoid()
        }

    }, [nameInput, descriptionInput, areaInput, priceInput])

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
                setUserLatitude(latitude)
                setUserLongitude(longitude)
                for (let item of response) {
                    let name = item.name.replace(' ', '').split(',')
                    setUsercityHandler(item.city)
                    setUserStreetHandler(item.street)
                    setUserStreetNameHandler(name[name.length - 1])
                }
            }
        })()
    }, [])

    const [validateButton, setvalidateButton] = useState(false)
    const validateButtonVoid = (descriptionI = descriptionInput, priceI = priceInput, nameI = nameInput, areaI = areaInput) => {
        if (descriptionI.length >= 15 && /^\d+$/.test(priceI) && priceI.length >= 3 && nameI.length >= 3 && usercity && areaI.length >= 1) {
            setvalidateButton(true)
        } else {
            setvalidateButton(false)
        }
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

            if (result.cancelled) {
                return;
            }

            // ImagePicker saves the taken photo to disk and returns a local URI to it
            let localUri = result.uri;
            let filename = localUri.split('/').pop();

            // Infer the type of the image
            let match = /\.(\w+)$/.exec(filename);
            let type = match ? `image/${match[1]}` : `image`;

            // Upload the image using the fetch and FormData APIs

            setImageHandler([...images, {uri: localUri, name: filename, type}])
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
            {/* Модальное окно с вводом адреса */}
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
                            onChangeText={text => {
                                setNameInputHandler(text)
                            }
                            }
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
                            onChangeText={text => {
                                setDescriptionInputHandler(text)
                            }
                            }
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
                                    <Image style={{ width: '100%', height: '100%', resizeMode: 'contain' }} source={{ uri: img.uri }} />

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
                            </View>
                            :
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

                            if (subCategoryTwo != '') {
                                props.navigation.navigate('SearchCategories', {
                                    name: 'Выберете категорию', screen: 'RealtyCreate', realty: true,
                                    categoryMas: [{ 'Недвижимость': ['Коммерческая', 'Частная', 'Долгосрочная', 'Краткосрочная'] }]
                                })
                            } else {
                                switch (subCategoryOne) {
                                    case 'Долгосрочная':
                                    case 'Краткосрочная':
                                        props.navigation.navigate('SearchCategories', {
                                            name: 'Выберете категорию', screen: 'RealtyCreate', realty: true, subCategoryOne,
                                            categoryMas: [{ 'Недвижимость': ['Коммерческая', 'Частная'] }]
                                        })
                                        break;
                                    case 'Коммерческая':
                                    case 'Частная':
                                        props.navigation.navigate('SearchCategories', {
                                            name: 'Выберете категорию', screen: 'RealtyCreate', realty: true, subCategoryOne,
                                            categoryMas: [{ 'Недвижимость': ['Долгосрочная', 'Краткосрочная'] }]
                                        })
                                }
                            }
                        }}>
                            <Text style={{ textDecorationLine: 'underline', color: '#3DB2F4' }}>{`${category ? (subCategoryOne ? `${category}, ${subCategoryOne}, ${subCategoryTwo}` : category) : 'Выберите категорию'}`}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Площадь */}

                    <View style={styles.price}>
                        <Text style={styles.text}>{'Укажите площадь'}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <TextInput style={chekAreaInput ? styles.priceInputErr : styles.priceInput}
                                onChange={({ nativeEvent: { text } }) => {
                                    if (/^\d+$/.test(text)) {
                                        setAreaInputHandler(text)
                                    }
                                }}
                                value={areaInput}
                                keyboardType={'number-pad'}
                                required
                                num
                                selectTextOnFocus={true}
                                onFocus={() => setChekAreaInputHandler(true)}
                                onEndEditing={() => setChekAreaInputHandler(false)}
                            />
                            <Text style={{ position: 'absolute', right: 5, margin: 8, fontWeight: 'bold' }}>{'кв м'}</Text>
                        </View>

                    </View>


                    {/* task price */}
                    <View style={styles.price}>
                        <Text style={styles.text}>{'Стоимость заказа'}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <TextInput style={chekPriceInput ? styles.priceInputErr : styles.priceInput}
                                onChange={({ nativeEvent: { text } }) => {
                                    if (/^\d+$/.test(text)) {
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
                            <Text style={{ position: 'absolute', right: 5, margin: 8, fontWeight: 'bold' }}>{'₽'}</Text>
                        </View>
                    </View>

                    {props.route.params.changeProfile == true ?
                        <View style={{ marginRight: 250, marginBottom: 20 }}>
                            <TouchableOpacity onPress={() => {
                                console.log(currentRealty.realtyId)
                                fetch('http://193.187.96.43//remove_estate', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        token: token,
                                        idEstate: currentRealty.realtyId
                                    })
                                }).then(response => response.json())
                                    .then(result => console.log(result))
                                    .catch(error => console.log('error', error));

                                props.navigation.navigate('RealtyFind')
                            }}>
                                <Text style={{ color: '#F96B5C', textDecorationLine: 'underline' }}>{'Отменить'}</Text>
                            </TouchableOpacity>
                        </View>
                        :
                        <View>

                        </View>
                    }

                    {/* publish task button */}
                    <TouchableOpacity
                        style={validateButton ? styles.buttonOn : styles.buttonOff}
                        onPress={() => {

                            let price = priceInput;
                            let resultPrice = '';
                            for (let i = 0; i < price.length; i++) {
                                if (i != 0 && i % 3 == 0)
                                    resultPrice = resultPrice + " " + price.charAt(i);
                                else
                                    resultPrice = resultPrice + price.charAt(i);
                            }

                            const payload = {
                                name: nameInput,
                                description: descriptionInput,
                                images: images,
                                address: {
                                    city: usercity,
                                    street: userStreet,
                                    streetName: userStreetName
                                },
                                category: [subCategoryOne, subCategoryTwo],
                                areaSize: areaInput,
                                price: resultPrice

                            }

                            var formData = new FormData();

                            if (images.length > 0) {
                                formData.append('images', { uri: images[0].uri, name: images[0].name, type: images[0].type });
                            } else {
                                formData.append('images', {});
                            }

                            formData.append("token", token);
                            formData.append("name", nameInput);
                            formData.append("description", descriptionInput);

                            formData.append("location[]", usercity);
                            formData.append("location[]", userStreet);
                            formData.append("location[]", userStreetName);
                            formData.append("location[]", userLatitude);
                            formData.append("location[]", userLongitude);
                            formData.append("category[]", subCategoryOne);
                            formData.append("category[]", subCategoryTwo);
                            formData.append("areaSize", areaInput);
                            formData.append("price", resultPrice);


                            if (props.route.params.changeProfile != true) {


                                fetch("http://193.187.96.43//create_estate", {
                                    method: 'POST',
                                    body: formData,
                                    headers: {
                                        'content-type': 'multipart/form-data',
                                    },
                                }).then(response => response.json())
                                    .then(result => console.log(result))
                                    .catch(error => console.log('error', error));

                            } else {
                                formData.append("IdEstate", currentRealty.realtyId);
                                fetch("http://193.187.96.43//update_estate", {
                                    method: 'POST',
                                    body: formData,
                                    headers: {
                                        'content-type': 'multipart/form-data',
                                    },
                                }).then(response => response.json())
                                    .then(result => console.log(result))
                                    .catch(error => console.log('error', error));
                            }
                            dispatch(realty(realtyId, nameInput, descriptionInput, images, { city: usercity, street: userStreet, streetName: userStreetName }, areaInput, resultPrice, [subCategoryOne, subCategoryTwo]))

                            props.navigation.navigate('RealtyProfile', { payload: payload, create: true })
                        }}

                        disabled={props.route.params.changeProfile == true ? false : !validateButton}>
                        <Text style={{ color: '#F9F9F9', fontSize: 20, }}>{props.route.params.changeProfile == true ? 'Сохранить' : 'Опубликовать'}</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </ImageBackground >
    )
}

const styles = StyleSheet.create({
    container: {
        top: '15%',
        width: Dimensions.get('window').width,
        height: (Dimensions.get('window').height * 0.8538),
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
        marginBottom: 10
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
