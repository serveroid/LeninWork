import React, { useState } from 'react'
import { StyleSheet, View, TouchableOpacity, Image, Modal, ActivityIndicator} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { getUserData } from '../redux/actions'
import {pullUserData} from '../Components/pullUserData'

export const AvatarRender = () => {
//Проверяем есть ли аватарка у пользователя и рендерим ее или шаблон.


    const userData = useSelector(state => state.userData)
    const dispatch = useDispatch()
    const userId = useSelector(state=>state.userId)
    const token = useSelector(state=>state.token)

    const [loading, setLoading] = useState(false)


    //Функция загрузки аватарки пользователя в БД и Redux
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
    
        if (!result.cancelled) {

            setLoading(true)

            let uriArray = result.uri.split('.')
            let fileType = uriArray[uriArray.length - 1]

            let formData = new FormData()
            formData.append('userId', userId)
            formData.append('token', token)
            formData.append('image', {
                'uri': result.uri,
                'type': `image/${fileType}`,
                'name': `avatar.${fileType}`
            })


            let response = await fetch('http://193.187.96.43/update_image', {
                method: 'POST',
                // headers: {
                //     'Content-Type': 'multipart/form-data'
                // },
                body: formData
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
                    const getData = async () => {
                        const userDataServer = await pullUserData(userId, token);
                        dispatch(getUserData(userDataServer));
                    }
                    getData()

                    console.log(" Document successfully updated!");

                } catch (err) {
                    console.log(err)
                }
            } else {
                console.log(resData.message)
            }
      
        }
      };


        if( userData.avatarImage !== false){
            return(
                <View style={styles.avatarBlock}>
                    <TouchableOpacity onPress={() => pickImage() }>
                        <Image 
                            style= {styles.avatarPhoto}
                            source={{ uri: `http://193.187.96.43/${userData.avatarImage}`}}/>
                    </TouchableOpacity>

                    {/* Компонент индикатора загрузки  */}
                    <Modal
                    visible={loading}
                    transparent={true}
                    >
                    <ActivityIndicator size="large" color="#373737"
                    style={{flex: 1, justifyContent: "center"}}/>
                    </Modal>

                </View>
                )
        }else{
            return(
                <View style={styles.avatarBlock}>
                    <TouchableOpacity onPress={() => pickImage() }>
                        <Image 
                            style= {{width: 100, height: 100}}
                            source={require('../assets/noAvatarIcon.png')}/>
                    </TouchableOpacity>

                    {/* Компонент индикатора загрузки  */}
                    <Modal
                    visible={loading}
                    transparent={true}
                    >
                    <ActivityIndicator size="large" color="#373737"
                    style={{flex: 1, justifyContent: "center"}}/>
                    </Modal>


                </View>
            )
        }
    }


    const styles = StyleSheet.create({
        avatarBlock: {
            marginTop: 10,
            alignItems: 'center',
        },
        avatarPhoto: {
            width: 100, 
            height: 100, 
            borderRadius: 50, 
            borderColor: '#CDEEFF', 
            borderWidth: 4
        },
    })