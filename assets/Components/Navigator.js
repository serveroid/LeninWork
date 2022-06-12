import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Dimensions, Image, TouchableOpacity, View} from 'react-native';

import {CreateTask} from '../Screens/CreateTask.js';
import {CreateTaskPayment} from '../Screens/CreateTaskPayment';
import {CreateTaskStatus} from '../Screens/CreateTaskStatus';
import {CreateTaskReady} from '../Screens/CreateTaskReady';

import {CreateResume} from '../Screens/CreateResume';
import {PotentialTasks} from '../Screens/PotentialTask';

import {UserProfile} from '../Screens/UserProfile';
import {AllReviews} from '../Screens/AllReviews';

import {FreelancersList} from '../Screens/FreelancersList';
import {Chat} from '../Screens/Chat';
import StatusScreen from '../Screens/StatusScreen.js';

import AccountScreen from '../Screens/AccountScreen';
import {DrawerComponent} from './DrawerComponent';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {SearchCategories} from '../Screens/SearchCategories.js';
import {SearchFilter} from '../Screens/SearchFilter.js';
import {SearchFreelancer} from '../Screens/SearchFreelancer.js';
import {SearchWorkTasks} from '../Screens/SearchWorkTasks.js';
import {AffiliateProgram} from '../Screens/AffiliateProgram.js';


const Drawer = createDrawerNavigator();

const defaultOptionsScreen = (props)=>{
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
                    <TouchableOpacity>
                        <Image source={require('../assets/notificationIcon.png')}
                               style={{width: 20, height: 22, marginTop: 10, marginRight: 15}}/>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image source={require('../assets/settingIcon.png')}
                               style={{width: 20, height: 22, marginTop: 10, marginRight: 25}}/>
                    </TouchableOpacity>
                </View>
            );
        }
    };
};


const drawerScreenOptions = {
    headerShown: false,
    overlayColor: 'transparent',
    drawerStyle: {
        borderRadius: 18,
        borderWidth: 4,
        borderColor: '#D8F5FD',
        marginTop: 2,
        width: Dimensions.get('window').width * 0.8,
        backgroundColor: '#EAFAFF'
    }
};

const MainStackNavigator = createStackNavigator();

const MainStack = ()=>{
    return (
        <MainStackNavigator.Navigator screenOptions={defaultOptionsScreen}>

            <MainStackNavigator.Screen name="AccountScreen" component={AccountScreen}/>
            <MainStackNavigator.Screen name={'CreateTask'} component={CreateTask}/>
            <MainStackNavigator.Screen name={'CreateTaskPayment'} component={CreateTaskPayment}/>
            <MainStackNavigator.Screen name={'CreateTaskReady'} component={CreateTaskReady}/>
            <MainStackNavigator.Screen name={'CreateTaskStatus'} component={CreateTaskStatus}/>
            <MainStackNavigator.Screen name={'StatusScreen'} component={StatusScreen}/>
            <MainStackNavigator.Screen name={'FreelancersList'} component={FreelancersList}/>

            <MainStackNavigator.Screen name={'CreateResume'} component={CreateResume}/>
            <MainStackNavigator.Screen name={'PotentialTasks'} component={PotentialTasks}/>

            <MainStackNavigator.Screen name={'Chat'} component={Chat}/>
            <MainStackNavigator.Screen name={'UserProfile'} component={UserProfile}/>
            <MainStackNavigator.Screen name={'AllReviews'} component={AllReviews}/>

            <MainStackNavigator.Screen name={'SearchCategories'} component={SearchCategories}/>
            <MainStackNavigator.Screen name={'SearchFilter'} component={SearchFilter}/>
            <MainStackNavigator.Screen name={'SearchFreelancer'} component={SearchFreelancer}/>
            <MainStackNavigator.Screen name={'SearchWorkTasks'} component={SearchWorkTasks}/>

            <MainStackNavigator.Screen name={'AffiliateProgram'} component={AffiliateProgram}/>

        </MainStackNavigator.Navigator>
    );
};

const MainNavigator = ()=>{
    return (
        <NavigationContainer>
            <Drawer.Navigator drawerContent={props=><DrawerComponent {...props} />} screenOptions={drawerScreenOptions}>
                <Drawer.Screen name="MainStack" component={MainStack}/>
            </Drawer.Navigator>
        </NavigationContainer>
    );
};


export default MainNavigator;