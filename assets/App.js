import React, {useState} from 'react';
import {applyMiddleware, createStore} from 'redux';
import {Provider} from 'react-redux';
import ReduxThunk from 'redux-thunk';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import {LogBox} from 'react-native';

import reducer from './redux/reducer';
import MainNavigator from './Components/Navigator.js';
import {Asset} from 'expo-asset';

import 'react-native-gesture-handler';

LogBox.ignoreLogs(['Setting a timer'])

const store = createStore(reducer, applyMiddleware(ReduxThunk));

async function loadResourcesAsync() {
    await Promise.all([
        Asset.loadAsync([
            require('./assets/menu.png'),
        ]),
        Font.loadAsync({
            'roboto': require('./assets/Roboto-Regular.ttf'),
        }),
    ]);
}

export default function App() {
    const [fontsLoaded, setFontsLoaded] = useState(false);

    if (!fontsLoaded) {
        return (
            <AppLoading
                startAsync={loadResourcesAsync}
                onFinish={()=>setFontsLoaded(true)}
                onError={console.warn}
            />
        );
    }

    return (
        <Provider store={store}>
            <MainNavigator/>
        </Provider>
    );
}
