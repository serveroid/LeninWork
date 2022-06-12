import React, { useState } from 'react';
import { Text, TextInput, Image, View, StyleSheet, TouchableOpacity, Pressable, TouchableHighlight, Modal, Dimensions } from 'react-native';
import { getUserData } from '../redux/actions'
import { useDispatch, useSelector } from 'react-redux';
import {db} from '../Components/firebase.js';


export const LoginBlock = ({userObj}) => {
    //Компонент рендера логина. При нажатии появляется TextInput для его изменения.
    //После изменения сохраняем в БД

    const [inputOpen, setInputOpen] = useState(false)
    const [oldLogin, setOldLogin] = useState(userObj.login)

    const userData = useSelector(state => state.userData)

    const dispatch = useDispatch()

     // функция изменения логина в БД 
     const loginChange = () => {
        const userRef = db.collection('users').doc(userObj.userId);

        // Set the "capital" field of the city 'DC'
        return userRef.update({
            login: userData.login
        })
        .then(() => {
            console.log("Document successfully updated!");

        })
        .catch((error) => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
    }


    //Объединяем функции сохранения данных в БД и меняем State для закрытия окна TextInput.  
    const loginStateDataChange = () => {
        loginChange()
        setInputOpen(false)
    }

     
    // Отмена изменения логина 
    const cancelChanged = () => {
        dispatch(getUserData({...userObj, login: oldLogin}))
        setInputOpen(false)
    }


    
    return(
        <View>
            <Modal
            visible={inputOpen}
            transparent={true}
            onRequestClose={() => cancelChanged()}
            >
                <Pressable  style={{flex: 1}}
                    activeOpacity={1}
                    android_disableSound={true}
                    onPress={() => cancelChanged()}>
                        <View style={styles.centeredView}>
                            <TouchableHighlight
                            touchSoundDisabled={true}
                            style={styles.modalView}
                            >
                                <View>
                                        <TextInput
                                            style={styles.loginInput}
                                            onChangeText={(text) => dispatch(getUserData({...userObj, login: text}))}
                                            defaultValue={userObj.login}
                                            onEndEditing={() => loginStateDataChange()}
                                            autoCorrect={false}
                                            disableFullscreenUI={true}
                                            maxLength={15}
                                            autoFocus={true}
                                            />

                                        
                                        <View style={styles.modalButtons}>
                                            <TouchableOpacity
                                            onPress={() => {loginStateDataChange()}}
                                            >
                                                <Text style={styles.buttonText}>Сохранить</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                            onPress={() => cancelChanged()}>
                                                <Text style={styles.buttonText}>Отменить</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                            </TouchableHighlight>
                        </View>
                </Pressable>
            </Modal>

            
            <TouchableOpacity 
            onPress={ () => setInputOpen(true)}
            style={styles.loginBlock}>
                <Text style={styles.loginText}>{userObj.login}</Text>
                <Image
                source={require('../assets/changeLoginIcon.png')}
                style={styles.loginIcon}/>
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    loginBlock: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 5,
        
    },
    loginText: {
        fontSize: 16,
        color: '#373737',
        textDecorationLine: 'underline',
        marginLeft: 5,
        marginTop: 3
    },
    loginIcon: {
        width: 17,
        height: 17,
        marginLeft: 4,
        marginTop: 2
    },
    loginInput: {
        alignSelf: 'center',
        height: 36,
        borderBottomWidth: 2,
        borderColor: '#EF6C5B',
        padding: 10,
        fontSize: 16,
        color: '#373737',
    },
    centeredView: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        alignItems: "center",
        marginTop: 220
      },
    modalView: {
        backgroundColor: "white",
        borderRadius: 12,
        justifyContent: 'center',
        width: 210,
        height: 130,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 3,
      },
      modalButtons: {
        flexDirection: 'row', 
        marginTop: 30, 
        justifyContent: 'space-around'
      },
      buttonText: {
          fontSize: 16,
          color: '#373737'

      }

})
