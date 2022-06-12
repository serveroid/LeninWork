import React, { useState } from 'react';
import { Text, TextInput, Image, View, StyleSheet, TouchableOpacity, Pressable, TouchableHighlight, Modal, Dimensions, ActivityIndicator } from 'react-native';
import { getUserData } from '../redux/actions'
import { useDispatch, useSelector } from 'react-redux';



export const LoginBlock = () => {
    //Компонент рендера логина. При нажатии появляется TextInput для его изменения.
    //После изменения сохраняем в БД
    const userData = useSelector(state => state.userData)

    const [inputOpen, setInputOpen] = useState(false)
    const [oldLogin, setOldLogin] = useState(userData.login)
    const [newLogin, setNewLogin] = useState(userData.login)
    const userId = useSelector(state=>state.userId)
    const token = useSelector(state=>state.token)

    const [loading, setLoading] = useState(false)


    const dispatch = useDispatch()

     // функция изменения логина в БД 
     const loginChange = async () => {
         
        setLoading(true)

        let response = await fetch('http://193.187.96.43/update_login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'login': newLogin,
            'userId': userId,
            'token': token})
    });


        if (!response.ok){
            const errorResData = await response.json();
            const errorId = errorResData.error.message;
            console.log(errorId)
            throw new Error(response.message)
        }
        
        const resData = await response.json()
        setLoading(false)
        
        if (!resData.isError) {
            try {
                dispatch(getUserData({...userData, login: newLogin}))
                setOldLogin(newLogin)
                console.log(" Document successfully updated!");

            } catch (err) {
                console.log(err)
            }
        } else {
            console.log(resData.message)
        }

    }


    //Объединяем функции сохранения данных в БД и меняем State для закрытия окна TextInput.  
    const loginStateDataChange = () => {
        if(newLogin.length > 3){
            loginChange()
            setInputOpen(false)
        }else{
            setInputOpen(false)
        }
    }

     
    // Отмена изменения логина 
    const cancelChanged = () => {
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
                                            onChangeText={(text) => setNewLogin(text)}
                                            defaultValue={oldLogin}
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

            {/* Компонент индикатора загрузки  */}
            <Modal
            visible={loading}
            transparent={true}
            >
            <ActivityIndicator size="large" color="#373737"
            style={{flex: 1, justifyContent: "center"}}/>
            </Modal>
            
            <TouchableOpacity 
            onPress={ () => setInputOpen(true)}
            style={styles.loginBlock}>
                <Text style={styles.loginText}>{userData.login}</Text>
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
