import React, { useLayoutEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';



export const SettingsScreen = (props) => {

    // Страница настроек

    useLayoutEffect(() => {
        props.navigation.setOptions({title: (
            <View style={{flexDirection: 'row'}}>
                <Image style={{width: 29, height:31, marginRight: 2, marginTop:3}} source={require("../../assets/settingsTitleIcon.png")} />
                <Text style={{ fontSize: 21, color: '#373737' }}>Настройки</Text>
            </View>
          )});

    }, [])


    return(
        <View style={styles.container}>

            <View style={styles.bodyTop}>
            <TouchableOpacity style={styles.pressableItem}
            onPress={() => props.navigation.navigate('PasswordChangingScreen')}>
                <Image style={[styles.imageStyle, {width: 20, height: 21}]} source={require('../../assets/keyIcon.png')}/>
                <Text style={styles.textStyle}>Смена пароля</Text>
            </TouchableOpacity>



            <TouchableOpacity style={styles.pressableItem}
            onPress={() => props.navigation.navigate('NotificationsScreen')}>
            <Image style={[styles.imageStyle, {width: 19, height: 21}]} source={require('../../assets/bellIcon.png')}/>
                <Text style={styles.textStyle}>Уведомления</Text>
            </TouchableOpacity>



            <TouchableOpacity style={styles.pressableItem}
            onPress={() => props.navigation.navigate('TwoFaScreen')}>
                <Image style={[styles.imageStyle, {width: 19, height: 22}]} source={require('../../assets/lockIcon.png')}/>
                <Text style={styles.textStyle}>Двухфакторная аутентификация</Text>
            </TouchableOpacity>



            <TouchableOpacity
            style={styles.pressableItem}
            onPress={() => props.navigation.navigate('PersonalInfoScreen')}
            >
                <Image style={[styles.imageStyle, {width: 17, height: 22}]} source={require('../../assets/fileIcon.png')}/>
                <Text style={styles.textStyle}>Личная информация</Text>
            </TouchableOpacity>

            </View>

            <View style={styles.emptyView}>
            </View>

            <ScrollView style={styles.bodyBottom}>

            <TouchableOpacity
            onPress={() => props.navigation.navigate('LogOutScreen', {logOutFrom: 'profile'})}
            style={styles.pressableItem}>
                <Image style={[styles.imageStyle, {width: 21, height: 20}]} source={require('../../assets/profileLogOut.png')}/>
                <Text style={styles.textStyle}>Выйти из профиля</Text>
            </TouchableOpacity>



            <TouchableOpacity
            onPress={() => props.navigation.navigate('LogOutScreen', {logOutFrom: 'devices'})}
            style={styles.pressableItem}>
                <Image style={[styles.imageStyle, {width: 22, height: 20}]} source={require('../../assets/divicesLogOut.png')}/>
                <Text style={styles.textStyle}>Выйти со всех устройств</Text>
            </TouchableOpacity>

            </ScrollView>



        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#D8F5FD',
        top: '5%',
    },
    bodyTop: {
        backgroundColor: '#FFFFFF',
        marginTop: 90,
        borderTopEndRadius: 10,
        borderTopStartRadius: 10,
        borderColor: '#F3FBFF',
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1
    },
    bodyBottom: {
        backgroundColor: '#FFFFFF'
    },
    emptyView: {
        backgroundColor: '#F3FBFF',
        height: 74
    },
    pressableItem: {
        flexDirection: 'row',
        height: 60,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#F3FBFF',
    },
    textStyle: {
        fontSize: 19,
        color: '#373737',
        marginLeft: 11
    },
    imageStyle: {
        marginLeft: 13
    }
})
