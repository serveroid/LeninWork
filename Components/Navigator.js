import React, {useState, useEffect} from 'react'
import {NavigationContainer} from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { AsyncStorage } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import {createDrawerNavigator} from '@react-navigation/drawer';

import {CreateTask} from '../Screens/Create/CreateTask.js';
import {CreateTaskPayment} from '../Screens/Create/CreateTaskPayment.js';
import {CreateTaskStatus} from '../Screens/Create/CreateTaskStatus.js';
import {CreateTaskReady} from '../Screens/Create/CreateTaskReady.js';
import {CreateResume} from '../Screens/Create/CreateResume.js';
import MyResumeScreen from '../Screens/Resume_Task/MyResumeScreen';
import {PotentialTasks} from '../Screens/Resume_Task/PotentialTask.js';
import {UserProfile} from '../Screens/Profile/UserProfile.js';
import {AllReviews} from '../Screens/Profile/AllReviews.js';
import {FreelancersList} from '../Screens/Resume_Task/FreelancersList.js';
import {Chat} from '../Screens/Chat/Chat.js';
import StatusScreen from '../Screens/Resume_Task/StatusScreen.js';
import Auth from '../Screens/Auth/Auth.js'
import Register from '../Screens/Auth/Register.js'
import RegisterNumber from '../Screens/Auth/RegisterNumber.js'
import RegisterEmail from '../Screens/Auth/RegisterEmail.js'
import AuthLogin from '../Screens/Auth/AuthLogin.js'
import AccountScreen from '../Screens/Profile/AccountScreen.js';
import {DrawerComponent} from './DrawerComponent';
import {SearchCategories} from '../Screens/Search/SearchCategories.js';
import {SearchFilter} from '../Screens/Search/SearchFilter.js';
import {SearchFreelancer} from '../Screens/Search/SearchFreelancer.js';
import {SearchWorkTasks} from '../Screens/Search/SearchWorkTasks.js';
import {AffiliateProgram} from '../Screens/Statistics/AffiliateProgram.js';
import { RealtyCreate } from '../Screens/Realty/RealtyCreate.js';
import { RealtyProfile } from '../Screens/Realty/RealtyProfile.js';
import { RealtyFind } from '../Screens/Realty/RealtyFind.js';
import { RealtyFindList } from '../Screens/Realty/RealtyFindList.js';
import { RealtyFindFilter } from '../Screens/Realty/RealtyFindFilter.js';
import { Messages } from '../Screens/Chat/Messages.js';
import {EarningStatistics} from '../Screens/Statistics/EarningStatistics.js';
import {FinancialOperationHistory} from '../Screens/Statistics/FinancialOperationHistory.js';
import ReferralStatistics from '../Screens/Statistics/ReferralStatistics.js';
import MoneyWithdrawal from '../Screens/Statistics/MoneyWithdrawal.js';
import { SettingsScreen } from '../Screens/Settings/SettingsScreen.js'
import { TwoFaScreen } from '../Screens/Settings/TwoFaScreen.js'
import { LogOutScreen } from '../Screens/Profile/LogOutScreen.js'
import { PersonalInfoScreen } from '../Screens/Settings/PersonalInfoScreen.js'
import { NotificationsScreen } from '../Screens/Settings/NotificationsScreen.js'
import { PasswordChangingScreen } from '../Screens/Settings/PasswordChangingScreen.js'
import { settingsOptions } from './Headers'
import { defaultOptionsScreen } from './Headers'
import { drawerScreenOptions } from './Headers'



const Drawer = createDrawerNavigator();


const MainStackNavigator = createStackNavigator();

const MainStack = ()=>{
    const dispatch = useDispatch()

    // Автологин
    const userId = useSelector(state => state.userId)
    const token = useSelector(state => state.token)
    useEffect(() => {
        (async () => {
            // await AsyncStorage.setItem('userId', '')
            // await AsyncStorage.setItem('token', '')
            const id = await AsyncStorage.getItem('userId')
            const key = await AsyncStorage.getItem('token')
            await dispatch({type: 'authenticate', userId: id, token: key})
        })()
    }, [])

    return (

        <MainStackNavigator.Navigator >


        {!(userId && token) ? (
            <>
                <MainStackNavigator.Screen name = {'Auth'} component = {Auth} options={{headerShown: false}}/>
                    <MainStackNavigator.Screen name = {'AuthLogin'} component = {AuthLogin} options={{headerShown: false}}/>
                    <MainStackNavigator.Screen name = {'Register'} component = {Register} options={{headerShown: false}}/>
                    <MainStackNavigator.Screen name = {'RegisterNumber'} component = {RegisterNumber} options={{headerShown: false}}/>
                    <MainStackNavigator.Screen name = {'RegisterEmail'} component = {RegisterEmail} options={{headerShown: false}}/>
            </>):(

            <>

        <MainStackNavigator.Group screenOptions={defaultOptionsScreen}>

            <MainStackNavigator.Screen name="AccountScreen" component={AccountScreen} />

            <MainStackNavigator.Screen name = {'CreateResume'} component = {CreateResume}/>
            <MainStackNavigator.Screen name = {'MyResumeScreen'} component = {MyResumeScreen}/>
            <MainStackNavigator.Screen name = {'PotentialTasks'} component = {PotentialTasks}/>

            <MainStackNavigator.Screen name={'CreateTask'} component={CreateTask}/>
            <MainStackNavigator.Screen name={'CreateTaskPayment'} component={CreateTaskPayment}/>
            <MainStackNavigator.Screen name={'CreateTaskReady'} component={CreateTaskReady}/>
            <MainStackNavigator.Screen name={'CreateTaskStatus'} component={CreateTaskStatus}/>
            <MainStackNavigator.Screen name={'StatusScreen'} component={StatusScreen}/>
            <MainStackNavigator.Screen name={'FreelancersList'} component={FreelancersList}/>

            <MainStackNavigator.Screen name={'Chat'} component={Chat}/>
            <MainStackNavigator.Screen name={'UserProfile'} component={UserProfile}/>
            <MainStackNavigator.Screen name={'AllReviews'} component={AllReviews}/>

            <MainStackNavigator.Screen name={'SearchCategories'} component={SearchCategories}/>
            <MainStackNavigator.Screen name={'SearchFilter'} component={SearchFilter}/>
            <MainStackNavigator.Screen name={'SearchFreelancer'} component={SearchFreelancer}/>
            <MainStackNavigator.Screen name={'SearchWorkTasks'} component={SearchWorkTasks}/>

            <MainStackNavigator.Screen name = {'EarningStatistics'} component = {EarningStatistics}/>
            <MainStackNavigator.Screen name = {'FinancialOperationHistory'} component = {FinancialOperationHistory}/>

            <MainStackNavigator.Screen name={'AffiliateProgram'} component={AffiliateProgram}/>
            <MainStackNavigator.Screen name = {'ReferralStatistics'} component = {ReferralStatistics}/>
            <MainStackNavigator.Screen name = {'MoneyWithdrawal'} component = {MoneyWithdrawal}/>

             <MainStackNavigator.Screen name = {'Messages'} component = {Messages} options={{headerShown: false}}/>
            <MainStackNavigator.Screen name = {'RealtyCreate'} component={RealtyCreate}/>
            <MainStackNavigator.Screen name = {'RealtyFind'} component = {RealtyFind}/>
            <MainStackNavigator.Screen name = {'RealtyFindList'} component = {RealtyFindList}/>
            <MainStackNavigator.Screen name = {'RealtyFindFilter'} component = {RealtyFindFilter}/>
            <MainStackNavigator.Screen name = {'RealtyProfile'} component = {RealtyProfile}/>


            <MainStackNavigator.Screen name = {'LogOutScreen'} component = {LogOutScreen}/>

        </MainStackNavigator.Group>

            <MainStackNavigator.Group screenOptions={settingsOptions}>
                <MainStackNavigator.Screen name="SettingsScreen" component={SettingsScreen}/>
                <MainStackNavigator.Screen name="TwoFaScreen" component={TwoFaScreen}/>
                <MainStackNavigator.Screen name="PersonalInfoScreen" component={PersonalInfoScreen}/>
                <MainStackNavigator.Screen name="NotificationsScreen" component={NotificationsScreen}/>
                <MainStackNavigator.Screen name="PasswordChangingScreen" component={PasswordChangingScreen}/>
            </MainStackNavigator.Group>


             </>
            )}
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
