import React, {useEffect, useLayoutEffect, useState} from 'react';
import {Dimensions, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { useSelector, useDispatch } from 'react-redux'
import {Bubble, GiftedChat} from 'react-native-gifted-chat';
import {db} from '../../Components/firebase.js';

export const Chat = ({navigation, route})=>{
    const [messages, setMessages] = useState([]);

    //получаем id текущего пользователя, пока в редаксе ничего нет, задаем id вручную
    // const currentUserId = useSelector(state => state.userId)
    const currentUserId = 'hdu29cm3k44s';

    useEffect(()=>{
        const unsubscribe = db.collection(route.params.chatType).doc(route.params.chatId).collection('messages').orderBy('createdAt', 'desc').onSnapshot(snapshot=>
            setMessages(snapshot.docs.map(doc=>({
                _id: doc.data()._id,
                createdAt: doc.data().createdAt.toDate(),
                text: doc.data().text,
                user: doc.data().user
            }))));
        return unsubscribe;
    }, []);

    useLayoutEffect(()=>{
        //В зависимости от вида чата(с поддержкой, с другим пользователем или диспут) выбираем тип чата
        let titleName

        if (route.params.chatType === 'chats'){
            titleName = 'Чат с ' + route.params.name
        }else if (route.params.chatType === 'supportChats'){
            titleName = 'Чат с поддержкой'
        }else {
            titleName = 'Спор №1'
        }

        navigation.setOptions({
            title: (titleName)
        });
    }, []);

    const renderBubble = (props)=>{
        return (<Bubble {...props}
                        wrapperStyle={{
                            left: {
                                backgroundColor: '#FFECE7',
                                borderWidth: 2,
                                borderColor: '#FFDFD6',
                                width: Dimensions.get('window').width * 0.6,
                            },
                            right: {
                                backgroundColor: '#FFFFFF',
                                borderWidth: 2,
                                borderColor: '#DDF1FF',
                                width: Dimensions.get('window').width * 0.6,
                            }
                        }}
                        textStyle={{
                            left: {
                                color: '#888888',
                                fontFamily: 'roboto'
                            },
                            right: {
                                color: '#888888',
                                fontFamily: 'roboto'
                            },
                        }}
                        timeTextStyle={{left: {color: '#888888',}, right: {color: '#888888',}} }
        />)}

        const onSend = (messages)=>{
            const {_id, createdAt, text, user} = messages[0];
            db.collection(route.params.chatType).doc(route.params.chatId).collection('messages').add({_id, createdAt, text, user});
            setMessages(previousMessages=>GiftedChat.append(previousMessages, messages));
        };

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../../assets/chatBack.png')} resizeMode="stretch"
                             style={styles.imageBack}>
                <TouchableOpacity style={styles.goBack}
                                  onPress={()=>{
                                      navigation.goBack();
                                  }}
                >
                    <Image source={require('../../assets/backArrow.png')} style={styles.goBackIcon}/>
                    <Text style={styles.goBackText}>Вернуться назад</Text>
                </TouchableOpacity>
                <GiftedChat
                    messages={messages}
                    showAvatarForEveryMessage={false}
                    renderBubble={renderBubble}
                    onSend={messages=>onSend(messages)}
                    placeholder=''
                    user={{
                        _id: currentUserId
                    }}
                />
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 25
    },
    imageBack: {
        flex: 1,
        paddingTop: 115
    },
    goBack: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        // borderBottomWidth: 0,
        // borderColor: '#F3FBFF',
        borderColor: '#FFFFFF'
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
    }
});
