import React, {useState} from 'react';
import {applyMiddleware, createStore} from 'redux';
import {Provider} from 'react-redux';
import ReduxThunk from 'redux-thunk';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import {LogBox} from 'react-native';
import {Asset} from 'expo-asset';

import images from './assets/images.js'
import reducer from './redux/reducer';
import MainNavigator from './Components/Navigator.js';



LogBox.ignoreLogs(['Setting a timer'])

const store = createStore(reducer, applyMiddleware(ReduxThunk));

const fetchFonts = () => {
    return Font.loadAsync({
        'roboto': require('./assets/Roboto-Regular.ttf'),
    })
}

const fetchImages = async () => {
    const cacheImages = images.map(image => {
        return Asset.fromModule(image).downloadAsync()
    })

    return Promise.all(cacheImages)
}

async function loadResourcesAsync() {
    const fontAssets = fetchFonts()
    const imageAssets = fetchImages()

    await Promise.all([fontAssets, imageAssets])
}

export default function App() {
    const [assetsLoaded, setAssetsLoaded] = useState(false);

    if (!assetsLoaded) {
        return (
            <AppLoading
                startAsync={loadResourcesAsync}
                onFinish={()=>setAssetsLoaded(true)}
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
