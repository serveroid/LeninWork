import React, {useLayoutEffect} from 'react';
import {Dimensions, ImageBackground, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {useDispatch, useSelector} from 'react-redux';

export const CreateTaskStatus = (props)=>{
    const dispatch = useDispatch();

    const name = useSelector(state=>state.name);
    const date = useSelector(state=>state.date);
    const number = '№246842';
    const sum = useSelector(state=>state.price);

    //меняем заголовок в шапке
    useLayoutEffect(()=>{
        props.navigation.setOptions({
            title: ('Список заказов')
        });
    }, []);

    return (
        <ImageBackground source={require('../assets/menu.png')} resizeMode="stretch" style={styles.imageBack}>
            <View style={styles.container}>

                <TouchableOpacity style={{}} onPress={()=>props.navigation.goBack()}>
                    <Text style={{
                        textDecorationLine: 'underline',
                        color: '#3DB2F4',
                        margin: 10
                    }}>{'Вернуться назад'}</Text>
                </TouchableOpacity>

                <Text style={{
                    textAlign: 'center',
                    margin: 10
                }}>{'Здесь Вы можете отменить заказ и разморозить сумму'}</Text>

                <View style={styles.box}>
                    <View style={{backgroundColor: '#F3FBFF', height: 30}}>
                        <Text style={{fontSize: 17, marginLeft: 10}}>{name}</Text>
                    </View>
                    <View style={{flexDirection: 'row', backgroundColor: '#F9FEFF', height: 30}}>
                        <Text style={{width: '40%', fontSize: 17, textAlign: 'center'}}>{'Номер заказа'}</Text>
                        <Text style={{width: '30%', fontSize: 17, textAlign: 'center'}}>{'Дата'}</Text>
                        <Text style={{width: '30%', fontSize: 17, textAlign: 'center'}}>{'Сумма'}</Text>
                    </View>
                    <TouchableOpacity style={{flexDirection: 'row', backgroundColor: '#F3FBFF', height: 30}}
                                      onPress={()=>props.navigation.navigate('StatusScreen')}>
                        <Text style={{width: '40%', fontSize: 17, textAlign: 'center'}}>{number}</Text>
                        <Text style={{width: '30%', fontSize: 17, textAlign: 'center', color: '#3EAFF2'}}>{date}</Text>
                        <Text style={{
                            width: '30%',
                            fontSize: 17,
                            textAlign: 'center',
                            color: '#F96B5C'
                        }}>{sum + ' ₽'}</Text>
                    </TouchableOpacity>
                </View>

                <View style={{flexDirection: 'row', width: '100%'}}>
                    <TouchableOpacity style={{flex: 1}} onPress={()=>props.navigation.navigate('CreateTask')}>
                        <Text style={{
                            textAlign: 'left',
                            margin: 10,
                            color: '#F96B5C',
                            textDecorationLine: 'underline'
                        }}>{'Изменить заказ'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{flex: 1}} onPress={()=>props.navigation.navigate('FreelancersList')}>
                        <Text style={{
                            textAlign: 'right',
                            margin: 10,
                            color: '#F96B5C',
                            textDecorationLine: 'underline'
                        }}>{'Выбрать исполнителя'}</Text>
                    </TouchableOpacity>
                </View>
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
        alignItems: 'center'
    },
    box: {
        width: '100%'
    }

});