import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Dimensions,
    Image,
    ImageBackground,
    Keyboard,
    LogBox,
    Modal,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import * as Location from 'expo-location';

import firebase, { db } from '../../Components/firebase.js';
import { setHasResume } from '../../redux/actions.js';

import { serialize } from 'object-to-formdata'

LogBox.ignoreLogs(['Setting a timer']);

export const CreateResume = (props) => {
    const category = useSelector(state => state.category);
    const subCategory = useSelector(state => state.subCategory);
    const [categories, setCategories] = useState([]);
    const setCategoriesHandler = e => setCategories(e);
    //Добавляет категорию если такая категория еще не выбрана
    useEffect(() => {
        let found = false;
        for (var i = 0; i < categories.length; i++) {
            if (categories[i].category == category && categories[i].subCategory == subCategory) {
                found = true;
                break;
            }
        }
        if (!found && category) {
            setCategories([...categories, {category: category, subCategory: subCategory}]);
        }

    }, [category, subCategory]);

    const dispatch = useDispatch();

    const [fullNameInput, setFullNameInput] = useState('');
    const [aboutmInput, setAboutmInput] = useState('');
    const [experienceInput, setExperienceInput] = useState('');
    const [priceInput, setPriceInput] = useState('');
    const [images, setImages] = useState([]);

    const [usercity, setUsercity] = useState(null);
    const [userStreet, setUserStreet] = useState(null);
    const [userStreetName, setUserStreetName] = useState(null);

    const [modalVisible, setModalVisible] = useState(false);

    const [chekFullNameInput, setChekFullNameInput] = useState(false);
    const [chekAboutmInput, setChekAboutmInput] = useState(false);
    const [chekExperienceInput, setChekExperienceInput] = useState(false);
    const [chekPriceInput, setChekPriceInput] = useState(false);

    const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')

    const setFullNameInputHandler = e => setFullNameInput(e);
    const setAboutmInputHandler = e => setAboutmInput(e);
    const setExperienceInputHandler = e => setExperienceInput(e);
    const setPriceInputHandler = e => setPriceInput(e);
    const setImageHandler = e => setImages(e);

    const setUsercityHandler = e => setUsercity(e);
    const setUserStreetHandler = e => setUserStreet(e);
    const setUserStreetNameHandler = e => setUserStreetName(e);

    const modalVisibleHandler = e => setModalVisible(e);

    const setChekFullNameInputHandler = e => setChekFullNameInput(e);
    const setChekAboutmInputHandler = e => setChekAboutmInput(e);
    const setChekExperienceInputHandler = e => setChekExperienceInput(e);
    const setChekPriceInputHandler = e => setChekPriceInput(e);

    const userId = useSelector(state=>state.userId)
    const token = useSelector(state=>state.token)

    const getCoords = async () => {
        try {
            let location = await Location.getCurrentPositionAsync({});
            return location;
        } catch (err) {
            let location = await Location.getLastKnownPositionAsync({accuracy: 6});
            return location;
        }
    };
    useEffect(() => {
        (async () => {
            let {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }

            const location = await getCoords();

            if (location) {
                const {latitude, longitude} = location.coords;

                setLatitude(latitude)
                setLongitude(longitude)

                let response = await Location.reverseGeocodeAsync({
                    latitude,
                    longitude
                });

                for (let item of response) {
                    let name = item.name.replace(' ', '').split(',');

                    setUsercityHandler(item.city);
                    setUserStreetHandler(item.street);
                    setUserStreetNameHandler(name[name.length - 1]);
                }
            }
        })();
    }, []);

    //меняем заголовок в шапке
    useLayoutEffect(() => {
        props.navigation.setOptions({
            title: ('Создание резюме')
        });
    }, []);

    const [validateButton, setvalidateButton] = useState(false);
    const validateButtonVoid = (aboutmI = aboutmInput, experienceI = experienceInput, priceI = priceInput, fullNameI = fullNameInput, usercityI = usercity) => {
        if (aboutmI.length >= 15 && /^\d+$/.test(experienceI) && experienceI.length && /^\d+$/.test(priceI) && priceI.length >= 3 && fullNameI.length >= 3 && usercityI) {
            setvalidateButton(true);
        } else {
            setvalidateButton(false);
        }
    };
    useEffect(() => {
        validateButtonVoid();
    }, [fullNameInput, aboutmInput, experienceInput, priceInput, usercity, userStreet, userStreetName]);

    const writeUserData = async (fullName, aboutm, experience, price, photos = []) => {

        const newCategories = []

        categories.forEach(elem => {
            newCategories.push(elem.category)
            newCategories.push(elem.subCategory)
        })

        const data = serialize({
            token: token,
            userId: userId,
            name: fullName,
            description: aboutm,
            experience: experience,
            price: price,
            images: photos,
            categories: newCategories,
            location: [latitude, longitude]
        })

        await fetch('http://193.187.96.43/create_resume', {
            method: 'POST',
            body: data
        })
        .then(res => res.json())
        .then(res => console.log(res))
    }

    const pickImage = async () => {
        const permissionStatus = await ImagePicker.getMediaLibraryPermissionsAsync();
        if (permissionStatus.status !== 'granted') {
            const permissionStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
        }
        if (permissionStatus.status == 'granted') {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                quality: 1
            });

            const blob = await new Promise((resolve, rejekt) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = function() {
                    resolve(xhr.response);
                };
                xhr.onerror = function(e) {
                    console.log(e);
                    rejekt(new TypeError('Nrtwork request err'));
                };
                xhr.responseType = 'blob';
                xhr.open('get', result.uri, true);
                xhr.send(null);
            });

            let title = result.uri.split('/');
            const ref = firebase.storage().ref().child(title[title.length - 1].split('.')[0]);
            const snapshot = await ref.put(blob);
            blob.close();

            const downloadURL = await snapshot.ref.getDownloadURL();
            setImageHandler([...images, {path: snapshot.metadata.fullPath, url: downloadURL}]);
        }
    };


    const [keyboardHeight, setKeyboardHeight] = useState(0);

    function onKeyboardDidShow(e) {
        setKeyboardHeight(e.endCoordinates.height);
    }

    function onKeyboardDidHide() {
        setKeyboardHeight(0);
    }

    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
        Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);
        return () => {
            Keyboard.removeListener('keyboardDidShow', onKeyboardDidShow);
            Keyboard.removeListener('keyboardDidHide', onKeyboardDidHide);
        };
    }, []);

    return (
        <ImageBackground source={require('../../assets/menu.png')} resizeMode="stretch" style={styles.imageBack}>
            <Modal
                onRequestClose={() => {
                    modalVisibleHandler(!modalVisible);
                }}
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    modalVisibleHandler(!modalVisible);
                }}
            >
                <TouchableWithoutFeedback onPress={() => {
                    modalVisibleHandler(false);
                }}>
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
                                    modalVisibleHandler(!modalVisible);
                                }}>
                                <Text style={styles.textStyle}>{'Сохранить'}</Text>
                            </TouchableOpacity>
                        </Pressable>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollview} bounces={false}>
                    {/* FullName */}
                    <View style={styles.name}>
                        <Text style={styles.text}>{'Имя фамилия'}</Text>
                        <TextInput style={chekFullNameInput ? styles.inputNameErr : styles.inputName}
                                   onChangeText={text => setFullNameInputHandler(text)}
                                   value={fullNameInput}
                                   required
                                   onFocus={() => setChekFullNameInputHandler(true)}
                                   onEndEditing={() => setChekFullNameInputHandler(false)}
                        />
                    </View>

                    {/* About user */}
                    <View style={styles.description}>
                        <Text style={styles.text}>{'О себе'}</Text>
                        <TextInput
                            multiline
                            numberOfLines={4}
                            onChangeText={text => setAboutmInputHandler(text)}
                            value={aboutmInput}
                            editable
                            maxLength={300}
                            style={chekAboutmInput ? styles.inputDescriptionErr : styles.inputDescription}
                            onFocus={() => setChekAboutmInputHandler(true)}
                            onEndEditing={() => setChekAboutmInputHandler(false)}
                        />
                    </View>

                    {/* UserExperience */}
                    <View style={styles.price}>
                        <Text style={styles.text}>{'Стаж работы'}</Text>
                        <TextInput style={chekExperienceInput ? styles.priceInputErr : styles.priceInput}
                                   onChangeText={text => {
                                       if (/^\d+$/.test(text)) {
                                           setExperienceInputHandler(text);
                                       }
                                   }}
                                   value={experienceInput}
                                   keyboardType={'number-pad'}
                                   required
                                   num
                                   selectTextOnFocus={true}
                                   onFocus={() => setChekExperienceInputHandler(true)}
                                   onEndEditing={() => setChekExperienceInputHandler(false)}
                        />
                    </View>

                    {/* Price */}
                    <View style={styles.price}>
                        <Text style={styles.text}>{'Стоимость услуги'}</Text>
                        <TextInput style={chekPriceInput ? styles.priceInputErr : styles.priceInput}
                                   onChangeText={text => setPriceInputHandler(text)}
                                   onChange={({nativeEvent: {text}}) => {
                                       if (/^\d+$/.test(text)) {
                                           setPriceInputHandler(text);
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

                    {/* upload photo */}
                    {!images.length ?
                        <TouchableOpacity style={styles.uploadPhoto} onPress={pickImage}>
                            <Text style={{color: '#3DB2F4'}}>{'+ Добавить изображение'}</Text>
                        </TouchableOpacity>
                        :
                        <View style={{flexDirection: 'row', height: 80, width: '90%'}}>
                            {images.map((img, index) =>
                                <View key={index} style={{width: '20%', height: 80, margin: '2%'}}>
                                    <Image style={{width: '100%', height: '100%', resizeMode: 'contain'}}
                                           source={{uri: img.url}}/>

                                    <TouchableOpacity style={{
                                        position: 'absolute',
                                        right: 0,
                                        top: 0,
                                        margin: 0,
                                        backgroundColor: 'red',
                                        borderRadius: 70,
                                        width: 20,
                                        height: 20,
                                        justifyContent: 'center'
                                    }}
                                                      onPress={() => {
                                                          setImageHandler(images.filter(item => item !== img));
                                                          firebase.storage().ref(img.path).delete();
                                                      }}>

                                        <Text style={{color: 'white', textAlign: 'center'}}>{'X'}</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                            {images.length <= 3 ?
                                <TouchableOpacity onPress={pickImage} style={{
                                    width: 80,
                                    height: 80,
                                    borderWidth: 3,
                                    borderColor: '#CDF4FF',
                                    backgroundColor: '#CDF4FF',
                                    borderRadius: 20
                                }}>
                                    <Text style={{
                                        textAlign: 'center',
                                        fontWeight: 'bold',
                                        fontSize: 120,
                                        top: '-68%',
                                        color: '#FFFFFF'
                                    }}>{'+'}</Text>
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
                                    <Text style={{
                                        textDecorationLine: 'underline',
                                        color: '#3DB2F4'
                                    }}>{`${usercity}${userStreet ? ', ' + userStreet : ''}${userStreetName ? ' ' + userStreetName : ''}`}</Text>
                                </TouchableOpacity>
                            </View> :
                            <View style={styles.selectCity}>
                                <TouchableOpacity onPress={() => setModalVisible(true)}>
                                    <Text style={{
                                        textDecorationLine: 'underline',
                                        color: '#3DB2F4'
                                    }}>{'Выберите город'}</Text>
                                    <View style={{
                                        borderColor: '#6DC2FF',
                                        borderWidth: 1,
                                        width: '90%',
                                        height: 2,
                                        marginTop: 10
                                    }}></View>
                                    <Text style={{color: 'red'}}>{'Геолокация отключена, введите адрес'}</Text>
                                </TouchableOpacity>
                            </View>}
                    </View>

                    {/* select category */}
                    <View style={{width: '90%', marginBottom: 17}}>
                        <Text style={styles.text}>{'Выберите категорию и подкатегорию своих услуг'}</Text>
                        {categories.length ?
                            categories.map((el, index) =>
                                <TouchableOpacity key={index} onPress={() => {
                                    props.navigation.navigate('SearchCategories', {
                                        name: 'Выберете категорию',
                                        screen: 'CreateResume'
                                    });
                                    setCategoriesHandler(categories.filter(item => item !== el));
                                }}>
                                    <Text style={{
                                        textDecorationLine: 'underline',
                                        color: '#3DB2F4',
                                        marginBottom: 5
                                    }}>{`${el.category ? (el.subCategory ? `${el.category}, ${el.subCategory}` : el.category) : 'Выберете категорию'}`}</Text>
                                    <TouchableOpacity style={{
                                        position: 'absolute',
                                        right: 0,
                                        top: 0,
                                        margin: 0,
                                        backgroundColor: 'red',
                                        borderRadius: 70,
                                        width: 20,
                                        height: 20,
                                        justifyContent: 'center'
                                    }}
                                                      onPress={() => {
                                                          setCategoriesHandler(categories.filter(item => item !== el));
                                                      }}>
                                        <Text style={{color: 'white', textAlign: 'center'}}>{'X'}</Text>
                                    </TouchableOpacity>
                                </TouchableOpacity>
                            )
                            :
                            <TouchableOpacity onPress={() => {
                                props.navigation.navigate('SearchCategories', {
                                    name: 'Выберете категорию',
                                    screen: 'CreateResume'
                                });
                            }}>
                                <Text style={{
                                    textDecorationLine: 'underline',
                                    color: '#3DB2F4'
                                }}>{'Выберете категорию'}</Text>
                            </TouchableOpacity>
                        }
                    </View>
                    {categories.length && categories.length <= 5 ?
                        <View style={{width: '90%', marginBottom: 17}}>
                            <TouchableOpacity onPress={() => {
                                props.navigation.navigate('SearchCategories', {
                                    name: 'Выберете категорию',
                                    screen: 'CreateResume'
                                });
                            }}>
                                <Text style={{
                                    textDecorationLine: 'underline',
                                    color: '#F96B5C',
                                    textAlign: 'left'
                                }}>{'+ Добавить еще категорию'}</Text>
                            </TouchableOpacity>
                        </View>
                        :
                        <View/>}

                    {/* publish task button */}
                    <TouchableOpacity
                        style={validateButton ? styles.buttonOn : styles.buttonOff}
                        onPress={() => {
                            writeUserData(fullNameInput, aboutmInput, experienceInput, priceInput, images);
                            dispatch(setHasResume('true'));
                            props.navigation.replace('PotentialTasks');
                        }}
                        disabled={!validateButton}>
                        <Text style={{color: '#F9F9F9', fontSize: 20}}>{'Опубликовать'}</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        top: '15%',
        width: Dimensions.get('window').width,
        height: (Dimensions.get('window').height * 0.8538),
        alignItems: 'center',
        borderColor: '#F3FBFF',
        // borderColor: 'red',
        borderWidth: 3
    },
    scrollview: {
        alignItems: 'center',
        width: Dimensions.get('window').width
    },
    name: {
        width: '90%',
        height: 70
    },
    description: {
        width: '90%',
        height: 160
    },
    uploadPhoto: {
        width: '90%',
        height: 30
    },
    selectCity: {
        width: '90%',
        height: 50
    },
    selectCategory: {
        width: '90%',
        height: 100
    },
    price: {
        alignItems: 'center',
        width: '90%',
        height: 80
    },
    selectDate: {
        alignItems: 'center',
        width: '90%',
        height: 80
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
        height: Dimensions.get('window').height
    },

    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalView: {
        width: '97%',
        height: 200,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 10
    },
    city: {
        width: '100%',
        height: 70
    },
    fullstreet: {
        width: '97%',
        height: 70,
        flexDirection: 'row'
    },
    street: {
        width: '80%',
        height: 70
    },
    streetname: {
        marginLeft: 10,
        width: '20%',
        height: 70
    },
    button: {
        borderRadius: 20,
        padding: 7,
        margin: 10
    },
    buttonOpen: {
        backgroundColor: '#F194FF'
    },
    buttonClose: {
        backgroundColor: '#3DB2F4'
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center'
    }
});
