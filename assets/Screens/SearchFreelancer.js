import React, {useLayoutEffect} from 'react';
import {useSelector} from 'react-redux';
import {
    Dimensions,
    Image,
    ImageBackground,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ScrollView
} from 'react-native';
import Rating from '../Components/Rating.js';

export const SearchFreelancer = (props)=>{
    //меняем заголовок в шапке
    useLayoutEffect(()=>{
        props.navigation.setOptions({
            title: ('')
        });
    }, []);

    const req = [1, 2, 3, 4,6,7,8,9,];

    const category = useSelector(state=>state.category);
    const subCategory = useSelector(state=>state.subCategory);


    return (
        <ImageBackground source={require('../assets/menu.png')} resizeMode="stretch" style={styles.imageBack}>
            <View style={{position: 'absolute', width: '60%', left: '15%', right: '15%', top: '3%'}}>
                <TextInput
                    style={{backgroundColor: '#FFFFFF', borderColor: '#BDBDBD', borderWidth: 2, borderRadius: 22}}

                />
                <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'center', marginLeft: '14%'}}
                                  onPress={()=>props.navigation.navigate('SearchFilter')}>
                    <Image style={{width: 20, height: 20, resizeMode: 'contain', marginTop: 10}}
                           source={require('../assets/filtr.png')}/>
                    <Text style={{
                        textDecorationLine: 'underline',
                        color: '#FFFFFF',
                        textAlign: 'center',
                        margin: 10,
                        marginLeft: 3
                    }}>{'Фильтр'}</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                <TouchableOpacity onPress={()=>props.navigation.navigate('SearchCategories', {work: false})}>
                    <Text style={{
                        textDecorationLine: 'underline',
                        color: '#3DB2F4',
                        textAlign: 'center',
                        margin: 10
                    }}>{`«${category}. ${subCategory}»`}</Text>
                </TouchableOpacity>

                <View style={{borderColor: '#F3FBFF', borderWidth: 3, borderRadius: 30, height: '70%'}}>
                    {/* Рендерит задания которые будут в будущем браться из бд или еще от куда-то */}
                    {req.map((el, index)=>
                        <TouchableOpacity onPress={()=>props.navigation.navigate('UserProfile')} key={index} style={{
                            flexDirection: 'row',
                            flex: 1,
                            borderTopWidth: index != 0 ? 3 : 0,
                            borderColor: '#F3FBFF'
                        }}>
                            <Image style={{width: 60, height: 60, resizeMode: 'contain', margin: 5}}
                                   source={{uri: 'https://ondilo.com/wp-content/uploads/2019/06/pictomiseenroute-5.png'}}/>

                            <View style={{width: '80%'}}>
                                <Text style={{color: '#373737', fontWeight: 'bold'}}>{'Имя Фамилия'}</Text>
                                <Text style={{color: '#373737'}}>{'Можно выполнить удаленно'}</Text>
                                <Text style={{color: '#373737'}}>{'Сегодня, 03:32 - 27 августа, 03:30'}</Text>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={{color: '#373737'}}>{'Город, регион: '}</Text>
                                    <Text style={{color: '#3DB2F4'}}>{'Таганрог Рост. Обл'}</Text>
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={{color: '#373737', fontWeight: 'bold'}}>{'Оплата:'}</Text>
                                    <Text style={{color: '#F96B5C'}}>{' 5 000 ₽'}</Text>
                                </View>

                                <View style={{position: 'absolute', right: 7, top: 5}}>
                                    <Rating rating={3}/>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
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
        height: (Dimensions.get('window').height * 0.8538)
    },
    scrollview: {
        width: Dimensions.get('window').width
    }
});
