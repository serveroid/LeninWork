import React, { useLayoutEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { getNotifications } from '../../Components/getNotifications.js';


export const NotificationsScreen = (props) => {
    //Страница с уведомлениями

    const notifications = useSelector(state => state.notifications)


    const renderItem = ({ item }) => {
        //Рендеринг уведомления в зависимости от её категории
        if(item.category === 1){
            return(
                <TouchableOpacity style={styles.whiteItem}>
                    <Image style={styles.bellsImage} source={require('../../assets/bellsIcon.png')} />
                    <Text style={{fontSize: 17}}>{item.header}</Text>
                </TouchableOpacity>
            )
        }if(item.category === 2){
            return(
                <TouchableOpacity style={styles.redItem}>
                    <Image style={styles.lightningImage} source={require('../../assets/lightningIcon.png')} />
                    <Text style={{fontSize: 17, color: '#F96B5C'}}>{item.header}</Text>
                </TouchableOpacity>
            )
        }else{
            return(
                <TouchableOpacity style={styles.blueItem}>
                    <Image style={styles.blackBellImage} source={require('../../assets/blackBellIcon.png')} />
                    <Text style={{fontSize: 17}}>{item.header}</Text>
                </TouchableOpacity>
            )
        }
    }


    useLayoutEffect(() => {
        // getNotifications('fd', 'fdf')
        props.navigation.setOptions({title: (
            <View style={{flexDirection: 'row'}}>
                <Image style={{width: 19, height:23, marginRight: 4, marginTop:3}} source={require('../../assets/bellIcon.png')} />
                <Text style={{ fontSize: 21, color: '#373737' }}>Уведомления</Text>
            </View>
          )});

    }, [])


    return(
        <View style={styles.container}>
            <View style={styles.body}>
            <FlatList
                data={notifications}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
            />
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#EAFAFF',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height*1.5,
        paddingTop: 65,
    },
    body: {
        backgroundColor: '#FFFFFF',
        marginTop: 70,
        borderTopEndRadius: 10,
        borderTopStartRadius: 10,
        borderColor: '#F3FBFF',
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        flex: 1
    },
    whiteItem: {
        flexDirection: 'row',
        height: 45,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F3FBFF',
        paddingLeft: 10,
    },
    redItem: {
        flexDirection: 'row',
        height: 45,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FFD9CD',
        paddingLeft: 10,
        backgroundColor: '#FFF2EE'
    },
    blueItem: {
        flexDirection: 'row',
        height: 45,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#D0F5FF',
        paddingLeft: 10,
        backgroundColor: '#ECFBFF'
    },
    bellsImage: {
        width: 30,
        height:23,
        marginRight: 4,
    },
    lightningImage: {
        width: 19,
        height:25,
        marginRight: 8,
        marginLeft: 6
    },
    blackBellImage: {
        width: 21,
        height:23,
        marginRight: 7,
        marginLeft: 6
    },

})
