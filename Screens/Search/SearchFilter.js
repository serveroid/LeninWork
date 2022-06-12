import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {
    Dimensions,
    Image,
    ImageBackground,
    Modal,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    ActivityIndicator
} from 'react-native';

import RangeSlider from 'rn-range-slider';
import * as Location from 'expo-location';

export const SearchFilter = (props)=>{
    //меняем заголовок в шапке
    useLayoutEffect(()=>{
        props.navigation.setOptions({
            title: ('')
        });
        console.log('SearchFilter')
    }, []);

    const category = useSelector(state=>state.category);
    const subCategory = useSelector(state=>state.subCategory);

    const token = useSelector(state=>state.token)

    // Объекты для слайдера
    const [value, setValue] = useState(1);
    const renderThumb = useCallback(()=><View style={{
        width: 12 * 2,
        height: 12 * 2,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#7f7f7f',
        backgroundColor: '#ffffff'
    }}/>, []);
    const renderRail = useCallback(()=><View style={{
        flex: 1,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#7f7f7f'
    }}/>, []);
    const renderRailSelected = useCallback(()=><View style={{
        height: 4,
        backgroundColor: '#4499ff',
        borderRadius: 2
    }}/>, []);
    const handleValueChange = useCallback((value)=>{
        setValue(value);
    }, []);

    const [priceChange, setPriceChange] = useState(true);
    const [price, setPrice] = useState('5000');

    const setPriceChangeHandler = e=>setPriceChange(e);
    const setPriceHandler = e=>setPrice(e);

    const [switchPay, setSwitchPay] = useState(false);
    const setSwitchPayHandler = e=>setSwitchPay(e);

    const [rating, setRating] = useState(5);
    const setRatingHandler = e=>setRating(e);

    const [changeRating, setChangeRating] = useState(true);
    const setChangeRatingHandler = e=>setChangeRating(e);

    // Получение адреса
    const [usercity, setUsercity] = useState(null);
    const [userStreet, setUserStreet] = useState(null);
    const [userStreetName, setUserStreetName] = useState(null);
    const [switchGeo, setSwitchGeo] = useState(false);
    const setSwitchGeoHandler = e=>setSwitchGeo(e);
    const setUsercityHandler = e=>setUsercity(e);
    const setUserStreetHandler = e=>setUserStreet(e);
    const setUserStreetNameHandler = e=>setUserStreetName(e);

    const [hash, setHash] = useState('')
    const [range, setRange] = useState('')

    const getCoords = async ()=>{
        try {
            let location = await Location.getCurrentPositionAsync({});
            return location;
        } catch (err) {
            let location = await Location.getLastKnownPositionAsync({accuracy: 6});
            return location;
        }
    };
    const getAddress = async ()=>{
        let {status} = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.log('Permission to access location was denied');
            setSwitchGeoHandler(false);
            alert('Геолокация отключена, включите и повторите попытку');
            return;
        }

        const location = await getCoords();

        if (location) {
            const {latitude, longitude} = location.coords;
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
        } else {
            setSwitchGeoHandler(false);
            alert('Геолокация отключена, включите и повторите попытку');
        }

    };

    useEffect(()=>{
        if (switchGeo && !usercity) {
            getAddress();
        }
    }, [switchGeo]);

    // Modal
    const [modalVisible, setModalVisible] = useState(false);
    const modalVisibleHandler = e=>setModalVisible(e);


    const getGeohashRange = (latitude, longitude, distance) => {
        const lat = 1/111
        const lon = 1/85

        const lowerLat = latitude - lat * distance;
        const lowerLon = longitude - lon * distance;

        const upperLat = latitude + lat * distance;
        const upperLon = longitude + lon * distance;

        const lower = geohash.encode(lowerLat, lowerLon);
        const upper = geohash.encode(upperLat, upperLon);

        return [
            lower,
            upper
        ]
    }

    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(false)

    const getCoordsWithUserCity = async () => {

        if(usercity){
            if(usercity.length >= 4){
                const coords = await Location.geocodeAsync(usercity)
                const hash = geohash.encode(coords[0].latitude, coords[0].longitude)
                const range = getGeohashRange(coords[0].latitude, coords[0].longitude, value)

                setHash(hash)
                setRange(range)
                setLatitude(coords[0].latitude)
                setLongitude(coords[0].longitude)
            }
        }

    }

    useEffect(() => {

        getCoordsWithUserCity()

    }, [usercity, value])

    const taskFilter = Tasks => {

        setTasks([])

        Tasks.forEach(elem => {

            if(elem.location[2] >= range[0] && elem.location[2] <= range[1] && elem.price >= +price){
                setTasks(tasks => [...tasks, elem])
            }

        })

    }

    useEffect(() => {
        (async () => {

            if(usercity && latitude && longitude && priceChange){
                setLoading(true)

                await fetch('http://193.187.96.43/search_job_or_performer', {
                    method: 'POST',
                    headers: {
                        'Content-type': 'Application/json'
                    },
                    body: JSON.stringify({
                        token: token,
                        category: [category, subCategory],
                    })
                })
                .then(res => res.json())
                .then(res => taskFilter(res[1].tasks))
                .then(() => setLoading(false))
            }


        })()
    }, [value, priceChange, switchPay, rating, usercity])

    const Indicator = () => {
        return (
            <Modal
                visible={loading}
                transparent={true}
            >
                <ActivityIndicator size="large" color="#373737"
                    style={{ flex: 1, justifyContent: 'flex-end' }} />
            </Modal>
        )
    }


    return (
        <ImageBackground source={require('../../assets/menu.png')} resizeMode="stretch" style={styles.imageBack}>
            <Indicator />
            <View style={{position: 'absolute', width: '60%', left: '15%', right: '15%', top: '3%'}}>
                <TextInput
                    style={{backgroundColor: '#FFFFFF', borderColor: '#BDBDBD', borderWidth: 2, borderRadius: 22}}

                />
                <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'center', marginLeft: '14%'}}
                                  onPress={()=>{

                                      props.navigation.navigate('SearchFreelancer');
                                  }}>
                    <Image style={{width: 20, height: 20, resizeMode: 'contain', marginTop: 10}}
                           source={require('../../assets/filtr.png')}/>
                    <Text style={{
                        textDecorationLine: 'underline',
                        color: '#FFFFFF',
                        textAlign: 'center',
                        margin: 10
                    }}>{'Фильтр'}</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                <ScrollView>
                    {/* Категории */}
                    <View style={{borderTopWidth: 3, borderColor: '#F3FBFF'}}>
                        <View style={{flexDirection: 'row'}}>
                            <Image style={{width: 50, height: 50, resizeMode: 'contain', margin: 10}}
                                   source={require('../../assets/categoriesIcon.png')}/>

                            <View>
                                <Text style={{color: '#BDBDBD'}}>{'Категории'}</Text>
                                <Text style={{color: '#373737'}}>{`${category}, ${subCategory}`}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Поиск заданий на расстоянии от меня */}
                    <View style={{borderTopWidth: 3, borderColor: '#F3FBFF'}}>
                        <View style={{flexDirection: 'row'}}>
                            <Image style={{width: 50, height: 50, resizeMode: 'contain', margin: 10}}
                                   source={require('../../assets/radiusIcon.png')}/>

                            <View>
                                <Text style={{color: '#BDBDBD'}}>{'Поиск заданий на расстоянии от меня'}</Text>
                                <View style={{flexDirection: 'row'}}>
                                    {/* change radius slider */}
                                    <RangeSlider
                                        style={{flex: 5, marginLeft: -5, marginRight: 6}}
                                        min={1}
                                        max={99}
                                        step={1}
                                        floatingLabel
                                        renderThumb={renderThumb}
                                        renderRail={renderRail}
                                        renderRailSelected={renderRailSelected}
                                        onValueChanged={handleValueChange}
                                        disableRange={true}
                                    />
                                    <Text style={{width: 38}}>{`${value} км`}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Стоимость заданий от */}
                    <View style={{borderTopWidth: 3, borderColor: '#F3FBFF'}}>
                        <View style={{flexDirection: 'row'}}>
                            <Image style={{width: 50, height: 50, resizeMode: 'contain', margin: 10}}
                                   source={require('../../assets/priceIcon.png')}/>

                            <View style={{}}>
                                <Text style={{color: '#BDBDBD'}}>{'Стоимость заданий от'}</Text>
                                {priceChange ? <TouchableOpacity style={{margin: 5}}
                                                                 onPress={()=>{
                                                                     setPriceChangeHandler(!priceChange);
                                                                 }}>
                                        <Text style={{}}>{`${price} ₽`}</Text>
                                    </TouchableOpacity>
                                    :
                                    <View style={{flexDirection: 'row'}}>
                                        <TextInput
                                            style={{borderBottomColor: '#BDBDBD', borderBottomWidth: 2, width: 40}}
                                            value={price}
                                            onChangeText={text=>{
                                                if (/^\d+$/.test(text)) {
                                                    setPriceHandler(text);
                                                }
                                            }}
                                            autoFocus={true}
                                            keyboardType={'number-pad'}
                                            required
                                            num
                                        />
                                        <Text style={{margin: 5, color: '#373737'}}>{'₽'}</Text>
                                        <TouchableOpacity style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: '#B2EEFF',
                                            borderWidth: 10,
                                            borderColor: '#B2EEFF',
                                            borderRadius: 70,
                                            width: 87,
                                            height: 26,
                                            margin: 5
                                        }}
                                                          onPress={()=>{
                                                              setPriceChangeHandler(!priceChange);
                                                          }}
                                        >
                                            <Text style={{color: '#F9F9F9', fontSize: 13}}>{'Сохранить'}</Text>
                                        </TouchableOpacity>
                                    </View>}
                            </View>
                        </View>
                    </View>

                    {/* Оплата на карту */}
                    <View style={{borderTopWidth: 3, borderColor: '#F3FBFF'}}>
                        <View style={{flexDirection: 'row'}}>
                            <Image style={{width: 50, height: 50, resizeMode: 'contain', margin: 10}}
                                   source={require('../../assets/cartIcon.png')}/>

                            <View>
                                <Text style={{color: '#BDBDBD'}}>{'Оплата на карту'}</Text>
                                <Text style={{fontSize: 16, marginTop: 5, color: '#373737'}}>{'Сделка без риска'}</Text>
                            </View>

                            <Switch
                                style={{position: 'absolute', right: 0, top: 20}}
                                trackColor={{false: '#767577', true: '#81b0ff'}}
                                thumbColor={switchPay ? '#f5dd4b' : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={()=>setSwitchPayHandler(!switchPay)}
                                value={switchPay}
                            />
                        </View>
                    </View>

                    {/* Рейтинг исполнителей, укажите цифру от 1 до 5 */}
                    <View style={{borderTopWidth: 3, borderColor: '#F3FBFF'}}>
                        <View style={{flexDirection: 'row'}}>
                            <Image style={{width: 50, height: 50, resizeMode: 'contain', margin: 10}}
                                   source={require('../../assets/ratingIcon.png')}/>

                            <View style={{width: '76%'}}>
                                <Text
                                    style={{color: '#BDBDBD'}}>{'Рейтинг исполнителей, укажите цифру от 1 до 5'}</Text>

                                {changeRating ? <TouchableOpacity onPress={()=>setChangeRatingHandler(!changeRating)}>
                                        <Text style={{
                                            fontWeight: 'bold',
                                            fontSize: 18,
                                            color: '#3EAFF2',
                                            textDecorationLine: 'underline'
                                        }}>{rating}</Text>
                                    </TouchableOpacity>
                                    :
                                    <View style={{flexDirection: 'row'}}>
                                        {/* Создание массива от 1 до 5 и рендер на его основе для выбора рейтинга */}
                                        {Array.from({length: 5}).map((_, i)=><TouchableOpacity onPress={()=>{
                                            setRatingHandler(i + 1);
                                            setChangeRatingHandler(!changeRating);
                                        }} key={i + 1}><Text style={{
                                            fontWeight: 'bold',
                                            fontSize: 18,
                                            color: '#3EAFF2',
                                            textDecorationLine: 'underline',
                                            margin: 5
                                        }}>{i + 1}</Text></TouchableOpacity>)}
                                    </View>}
                            </View>
                        </View>
                    </View>


                    {/* space */}
                    <View style={{height: 55, backgroundColor: '#F3FBFF'}}/>

                    {/* Геолокация */}
                    <View style={{borderBottomWidth: 3, borderColor: '#F3FBFF'}}>
                        <View style={{flexDirection: 'row'}}>
                            <Image style={{width: 50, height: 50, resizeMode: 'contain', margin: 10}}
                                   source={require('../../assets/geoIcon.png')}/>

                            <View>
                                <Text style={{color: '#373737', fontSize: 17}}>{'Геолокация'}</Text>
                                <Text style={{
                                    color: '#BDBDBD',
                                    width: '90%'
                                }}>{'Включить геолокацию или указать город'}</Text>
                            </View>

                            <Switch
                                style={{position: 'absolute', right: 0, top: 20}}
                                trackColor={{false: '#767577', true: '#81b0ff'}}
                                thumbColor={switchGeo ? '#f5dd4b' : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={()=>setSwitchGeoHandler(!switchGeo)}
                                value={switchGeo}
                            />
                        </View>
                    </View>
                    <View style={{borderBottomWidth: 3, borderColor: '#F3FBFF'}}>
                        <View style={{flexDirection: 'row'}}>
                            <Image style={{width: 50, height: 50, resizeMode: 'contain', margin: 10}}
                                   source={require('../../assets/geoIcon2.png')}/>

                            <View style={{width: '88%'}}>
                                <Text style={{color: '#373737', fontSize: 17}}>{'Укажите город'}</Text>
                                <TouchableOpacity onPress={()=>{
                                    modalVisibleHandler(!modalVisible);
                                }}>
                                    <Text style={{
                                        width: '90%',
                                        color: '#3DB2F4',
                                        textDecorationLine: 'underline'
                                    }}>{usercity ? `${usercity}${userStreet ? ', ' + userStreet : ''} ${userStreetName ? userStreetName : ''}` : 'Геолокация отключена, нажмите для того что бы ввести адрес'}</Text>
                                </TouchableOpacity>

                                {/* Модальное окно для ввода адреса */}
                                <Modal
                                    onRequestClose={()=>{
                                        modalVisibleHandler(!modalVisible);
                                    }}
                                    animationType="fade"
                                    transparent={true}
                                    visible={modalVisible}
                                >
                                    <TouchableWithoutFeedback onPress={()=>{
                                        modalVisibleHandler(false);
                                    }}>
                                        <View style={styles.centeredView}>
                                            <Pressable style={styles.modalView}>

                                                <View style={styles.city}>
                                                    <Text style={styles.text}>{'Город'}</Text>
                                                    <TextInput style={styles.inputName}
                                                               onChangeText={text=>setUsercityHandler(text)}
                                                               value={usercity ? usercity : ''}
                                                               required
                                                    />
                                                </View>

                                                <View style={styles.fullstreet}>
                                                    <View style={styles.street}>
                                                        <Text style={styles.text}>{'Улица'}</Text>
                                                        <TextInput style={styles.inputName}
                                                                   onChangeText={text=>setUserStreet(text)}
                                                                   value={userStreet ? userStreet : ''}
                                                                   required
                                                        />
                                                    </View>

                                                    <View style={styles.streetname}>
                                                        <Text style={styles.text}>{'Дом'}</Text>
                                                        <TextInput style={styles.inputName}
                                                                   onChangeText={text=>setUserStreetName(text)}
                                                                   value={userStreetName ? userStreetName : ''}
                                                                   required
                                                        />
                                                    </View>
                                                </View>

                                                <TouchableOpacity
                                                    style={[styles.button, styles.buttonClose]}
                                                    onPress={()=>{
                                                        modalVisibleHandler(!modalVisible);
                                                    }}>
                                                    <Text style={styles.textStyle}>{'Сохранить'}</Text>
                                                </TouchableOpacity>
                                            </Pressable>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </Modal>
                            </View>
                        </View>
                    </View>

                    {/* Button */}
                    <View style={{alignItems: 'center'}}>
                        <TouchableOpacity
                            style={styles.buttonOff}
                            onPress={()=>{
                                !props.route.params.work ?
                                props.navigation.navigate('SearchFreelancer', {parameters: {distance: value, price: price, switchPay: switchPay, rating: rating, address: getGeohashRange(latitude, longitude, value)}})
                                :
                                props.navigation.navigate('SearchWorkTasks', {tasks: tasks})
                                }}>
                            <Text style={{color: '#F9F9F9', fontSize: 20}}>
                                {usercity ? `Показать ${tasks.length} заданий` : 'Укажите город'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    imageBack: {
        marginTop: StatusBar.currentHeight,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    },
    container: {
        top: '15%',
        width: Dimensions.get('window').width,
        height: (Dimensions.get('window').height * 0.8538)
    },
    scrollview: {
        width: Dimensions.get('window').width
    },
    buttonOn: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F96B5C',
        borderWidth: 10,
        borderColor: '#FEEAE4',
        borderRadius: 70,
        width: Dimensions.get('window').width * 0.9,
        height: 80
    },
    buttonOff: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        borderWidth: 10,
        borderColor: '#FFFFFF',
        borderRadius: 70,
        width: Dimensions.get('window').width * 0.9,
        height: 80
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
    inputName: {
        width: '100%',
        height: 37,
        backgroundColor: '#FFFFFF',
        borderColor: '#BDBDBD',
        borderWidth: 2,
        borderRadius: 60,
        padding: 9
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center'
    }
});
