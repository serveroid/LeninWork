import React, {useLayoutEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {
    Dimensions,
    Image,
    ImageBackground,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import {setCategory} from '../redux/actions';

import {categories} from '../data/categories';

export const SearchCategories = (props)=>{
    //меняем заголовок в шапке
    useLayoutEffect(()=>{
        props.navigation.setOptions({
            title: ('Выберите категорию')
        });
    }, []);


    const dispatch = useDispatch();

    //Создание массива в стейте для открытия и закрытия подкатегорий при нажати на нужную категорию
    const [selectCategory, setSelectCategory] = useState(categories.map(()=>false));
    const setSelectCategoryHandler = e=>setSelectCategory(e);

    return (
        <ImageBackground source={require('../assets/menu.png')} resizeMode="stretch" style={styles.imageBack}>
            <View style={styles.container}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    {props.route.params.work ?
                        <Text style={{margin: 5, color: '#888888', fontSize: 20}}>{'Поиск работы'}</Text> :
                        <Text style={{margin: 5, color: '#888888', fontSize: 20}}>{'Поиск исполнителя'}</Text>}
                </View>
                <ScrollView contentContainerStyle={styles.scrollview} bounces={false}>
                    {/* Рендер всех категорий */}
                    {categories.map((el, index)=>
                        <View key={index} style={{borderTopWidth: 2, borderBottomWidth: 2, borderColor: '#F3FBFF'}}>
                            <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', margin: 5}}
                                              onPress={()=>{
                                                  // При нажатии на нужную категорию меняет в массиве selectCategory значение на противоположное для отображения или скрытия подкатигорий
                                                  setSelectCategoryHandler(selectCategory.map((i, n)=>n === index ? !i : i));
                                              }}>
                                <View style={{
                                    width: 30,
                                    height: 30,
                                    backgroundColor: '#F96B5C',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 50
                                }}>
                                    <Image style={{width: 20, height: 20, resizeMode: 'contain'}}
                                           source={require('../assets/category1.png')}/>
                                </View>

                                <Text style={{
                                    marginLeft: 10,
                                    marginTop: -3,
                                    color: '#F96B5C',
                                    fontWeight: 'bold',
                                    fontSize: 16
                                }}>{Object.keys(el)[0]}</Text>
                            </TouchableOpacity>

                            {/* Рендер выбранных подкатегорий */}
                            {selectCategory[index] ?
                                <View>
                                    {el[Object.keys(el)[0]].map((item, index2)=>
                                        <View key={index2}>
                                            <TouchableOpacity style={{margin: 2, marginLeft: 50}}
                                                              onPress={()=>{
                                                                  dispatch(setCategory(Object.keys(el)[0], item));
                                                                  props.route.params.work ? props.navigation.navigate('SearchWorkTasks') :
                                                                      props.navigation.navigate('SearchFreelancer');
                                                              }}>
                                                <Text style={{color: '#BDBDBD'}}>{item}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                                :
                                null
                            }
                        </View>
                    )}
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
        height: (Dimensions.get('window').height * 0.8538),
        borderColor: '#F3FBFF',
        // borderColor: 'red',
        borderWidth: 3
    },
    scrollview: {
        width: Dimensions.get('window').width
    }
});
