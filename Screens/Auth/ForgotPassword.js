import React, {useState} from 'react';
import {ImageBackground, View, StyleSheet, TouchableOpacity, Image, Text, TextInput, StatusBar, Dimensions} from 'react-native';


export default function ForgotPassword(props) {

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../../assets/register.png')} resizeMode='stretch' style={styles.imageBack}>

            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: StatusBar.currentHeight,
        flex: 1
    },
    imageBack: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center'
    },
})
