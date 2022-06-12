import React from 'react'
import { StyleSheet, View, TouchableOpacity, Image} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import {storageRef} from '../Components/firebase.js';
import { getAvatar } from '../redux/actions'

export const AvatarRender = () => {
//Проверяем есть ли аватарка у пользователя и рендерим ее или шаблон.


    const userData = useSelector(state => state.userData)
    const avatarUrl = useSelector(state => state.avatar)
    const dispatch = useDispatch()


    //Функция загрузки аватарки пользователя в БД и Redux
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
    
        if (!result.cancelled) {
            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = function () {
                  resolve(xhr.response);
                };
                xhr.onerror = function (e) {
                  console.log(e);
                  reject(new TypeError("Network request failed"));
                };
                xhr.responseType = "blob";
                xhr.open("GET", result.uri, true);
                xhr.send(null);
              });

              const ref = storageRef.child(`users/${userData.userId}/avatar.jpg`);
              const snapshot = await ref.put(blob);
            
              // We're done with the blob, close and release it
              blob.close();
            
              snapshot.ref.getDownloadURL().then((downloadURL) => {
                // console.log('File available at', downloadURL);
                dispatch(getAvatar(downloadURL))
              })
        }
      };



        if( avatarUrl !== undefined){
            return(
                <View style={styles.avatarBlock}>
                    <TouchableOpacity onPress={() => pickImage() }>
                        <Image 
                            style= {styles.avatarPhoto}
                            source={{ uri: avatarUrl}}/>
                    </TouchableOpacity>
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
