import React, {useState, useEffect, useLayoutEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Dimensions, Image, ScrollView, StatusBar } from 'react-native'

import {db} from '../Components/firebase'

export const PotentialTasks = (props) => {

    const [tasks, setTasks] = useState([])

    //меняем заголовок в шапке
    useLayoutEffect(()=>{
        props.navigation.setOptions({
            title: ('Подходящие по параметрам заказы')
        });
    }, []);

    useEffect(() => {
        (async () => {
            const res = await db.collection('users').doc('1').collection('tasks').limit(4).get()
            if (res.empty) {
                console.log('No matching documents.');
                return;
            }
            
            const data = []
            res.forEach(el => {
                data.push(el.data())
            })
            setTasks(data)
        })()
    }, [])

    return (
        <ImageBackground source={require('../assets/menu.png')} resizeMode='stretch' style={styles.imageBack}>
            <View style = {{top: '15%', alignItems: 'center', marginHorizontal: 20, marginBottom: 17}}>
                <Text style = {{textAlign: 'center', marginBottom: 11, color: '#888888'}}>{'Здесь Вы можете выбрать наиболее понравившийся заказ'}</Text>
                <View>
                    <TouchableOpacity>
                        <Text style = {{textDecorationLine: 'underline', color: '#F96B5C'}}>{'Фильтр заказов'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            
            <View style = {styles.container}>
                <ScrollView contentContainerStyle={ styles.scrollview } bounces = {false}>
                    {tasks.length ? tasks.map((el, index) =>
                        <View key = {index} style = {{flexDirection: 'row', borderTopWidth: 3, borderBottomWidth: 3, borderTopColor: '#F3FBFF', borderBottomColor: '#F3FBFF', marginBottom: -3}}>
                            
                            {el.photo ? <Image style = {{top: 0, width: 50, height: 50, resizeMode: 'contain', margin: 5}} source = {{uri: el.photo}}/>:
                            <Image style = {{top: 0, width: 50, height: 50, resizeMode: 'contain', margin: 5}} source = {require('../assets/defImg.png')}/>}
                            <View style = {{margin: 5}}>
                                <Text style = {{color: '#373737', fontSize: 17}}>{el.name}</Text>
                                <Text style = {{color: '#BDBDBD'}}>{'Можно выполнить удаленно'}</Text>
                                <Text style = {{color: '#BDBDBD'}}>{'Сегодня, 03:32 - 27 августа, 03:30'}</Text>
                                <View style = {{flexDirection: 'row',}}>
                                    <Text>{'Город, регион:'}</Text>
                                    <Text style = {{marginLeft: 5, color: 'blue'}}>{el.address.city}</Text>
                                </View>
                                <View style = {{flexDirection: 'row',}}>
                                    <Text>{'Место работы'}</Text>
                                    <Text style = {{marginLeft: 5, color: 'blue'}}>{'На дому'}</Text>
                                </View>
                                <View style = {{flexDirection: 'row',}}>
                                    <Text>{'Оплата:'}</Text>
                                    <Text style = {{marginLeft: 5, color: '#F96B5C'}}>{el.price + ' ₽'}</Text>
                                </View>
                            </View>
                        </View>
                    ): <Text style = {{color: 'black'}}>{'('}</Text>}
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
    },
    scrollview: {
        width: '100%',
    },
    imageBack: {
        marginTop: StatusBar.currentHeight,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
})
