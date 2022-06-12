import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Dimensions, Image, StatusBar } from 'react-native'

import firebase, { db } from '../../Components/firebase.js'

export const ConfirmWorker = (props) => {

    useLayoutEffect(() => {
        props.navigation.setOptions({
            title: ('Подтверждение')
        });
    }, []);

    const updateDb = async () => {
        // Обновление данных в разных коллекциях, id документа получаем в props
        await db.collection('tasks').doc(`${props.route.params.tasksDocId}`).update({ selectedWorker: props.route.params.selectedWorker, workers: firebase.firestore.FieldValue.delete() })
        await db.collection('users').doc('userId').collection('tasks').doc(`${props.route.params.usersDocId}`).update({ selectedWorker: props.route.params.selectedWorker, workers: firebase.firestore.FieldValue.delete() })
        props.navigation.navigate('RemainBalance', {price: props.route.params.price, taskId: props.route.params.taskId})
    }

    return (
        <ImageBackground source={require('../../assets/menu.png')} resizeMode='stretch' style={styles.imageBack}>
            <TouchableOpacity style={styles.goBack}
                onPress={() => { props.navigation.goBack() }}
            >
                <Image source={require('../../assets/backArrow.png')} style={styles.goBackIcon} />
                <Text style={styles.goBackText}>Вернуться назад</Text>
            </TouchableOpacity>
            <View style={styles.container}>
                <View>
                    <Text style={styles.text}>Подтвердите свое согласие назначить пользователя</Text>
                    <Text style={[styles.text, styles.workerText]} onPress={() => props.navigation.navigate('UserProfile', { workerId: props.route.params.selectedWorker.workerId })}>{props.route.params.selectedWorker.workerName}</Text>
                    <Text style={styles.text}>исполнителем заказа</Text>
                    <Text style={[styles.text, styles.taskIdText]}>{`№${props.route.params.taskId}`}</Text>
                </View>
                <View>
                    <TouchableOpacity style={styles.confirm} onPress={updateDb}>
                        <Text style={styles.confirmText}>Подтвердить</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <Text style={styles.lastText}>{`После подтверждения Ваши средства в размере ${props.route.params.price} ₽ окончательно депозитируется на счет мерчанта`}</Text>
                </View>
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    goBack: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#F3FBFF',
        paddingBottom: 20
    },
    goBackText: {
        color: '#3DB2F4',
        fontSize: 15,
        marginLeft: 7,
        textDecorationLine: 'underline',
        fontWeight: '400',
        fontFamily: 'roboto'
    },
    goBackIcon: {
        width: 13,
        height: 13
    },
    imageBack: {
        marginTop: StatusBar.currentHeight,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        paddingTop: 125
    },
    container: {
        width: Dimensions.get('window').width,
        height: (Dimensions.get('window').height * 0.8538),
        alignItems: 'center',
        marginTop: 50
    },
    text: {
        textAlign: 'center',
        fontSize: 30,
        color: '#373737',
    },
    workerText: {
        color: '#3DB2F4',
        textDecorationLine: 'underline'
    },
    taskIdText: {
        color: '#F96B5C',
        textDecorationLine: 'underline',
        marginBottom: 40
    },
    confirm: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F96B5C',
        borderWidth: 5,
        borderStyle: 'solid',
        borderColor: '#FEEAE4',
        borderRadius: 70,
        width: Dimensions.get('window').width * 0.95,
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: 15,
        marginTop: 10,
        marginBottom: 15
    },
    confirmText: {
        color: '#F9F9F9',
        fontSize: 22,
        fontWeight: '400',
        fontFamily: 'roboto'
    },
    lastText: {
        color: '#888888',
        fontSize: 18,
        marginTop: 20,
        textAlign: 'center'
    }
})
