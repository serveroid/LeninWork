import React from 'react';
import {Image, TouchableOpacity, View, Dimensions} from 'react-native'


export const settingsOptions = (props) => {
    return{
        headerTransparent: true,
        headerTitleAlign: 'center',
        headerTintColor: '#373737',
        headerTitleStyle: {
            marginTop: 22
        },
        headerLeft: () => {
            return(
            <TouchableOpacity onPress={() => props.navigation.goBack()} >
                <Image source={require('../assets/settingsArrow.png')} style={{width:30, height: 24,marginTop: 22, marginLeft: 20 }}/>
            </TouchableOpacity>)
        }

    }
}

export const defaultOptionsScreen = (props)=>{
    return {
        headerTransparent: true,
        headerTitleAlign: 'center',
        headerTintColor: 'white',
        headerTitleStyle: {
            paddingTop: 10,
            fontSize: 20,
            fontWeight: '500',
            fontFamily: 'roboto'
        },
        headerLeft: ()=>{
            return (
                <TouchableOpacity onPress={()=>props.navigation.openDrawer()}>
                    <Image source={require('../assets/menuIcon.png')}
                           style={{width: 22, height: 22, marginTop: 10, marginLeft: 30}}/>
                </TouchableOpacity>);
        },
        headerRight: ()=>{
            return (
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity onPress={()=>props.navigation.navigate('NotificationsScreen')}>
                        <Image source={require('../assets/notificationIcon.png')}
                               style={{width: 20, height: 22, marginTop: 10, marginRight: 15}}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>props.navigation.navigate('SettingsScreen')}>
                        <Image source={require('../assets/settingIcon.png')}
                               style={{width: 20, height: 22, marginTop: 10, marginRight: 25}}/>
                    </TouchableOpacity>
                </View>
            );
        }
    };
};


export const drawerScreenOptions = {
    headerShown: false,
    overlayColor: 'transparent',
    drawerStyle: {
        borderRadius: 18,
        borderWidth: 4,
        borderColor: '#D8F5FD',
        marginTop: 2,
        width: Dimensions.get('window').width * 0.8,
        backgroundColor: '#EAFAFF',
        top: '3%',
    }
};
