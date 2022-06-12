import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Modal, FlatList, ScrollView, Dimensions } from 'react-native';


export const ImageViewer = ({visible, onCancel, taskImages}) => {
    //Компонент просмотра картинок
    
    const renderItem = ({ item }) => (

        <View>
            <ScrollView horizontal={true}>
                <View>
                    <TouchableOpacity 
                        onPress={() => onCancel()}
                        style={{ alignItems: 'flex-end'}}>
                            <Image
                            source={require('../assets/CloseIcon.png')} 
                            style={{ width:23, height: 23, marginTop: 50, marginRight: 15}}
                            />
                    </TouchableOpacity>

                        <View style={styles.container}>
                            <Image
                                source={{uri: item.url}}
                                style={{width: '95%', height: '95%', resizeMode: "contain", alignSelf: "center",}}/>
                        </View>

                </View>
            </ScrollView>

            <View
            style={{alignItems: 'flex-end', marginBottom: 15, marginRight: 15}}>
                <Text style={styles.scoreText}
                >{`${taskImages.indexOf(item)+1}/${taskImages.length}`}</Text>
            </View>
        </View>

    )
    return(
        <Modal
            style={{backgroundColor:'white'}}
            presentationStyle='fullScreen'
            animationType="fade"
            transparent={false}
            statusBarTranslucent={true}
            visible={visible}
            onRequestClose={() => {
                onCancel();
                }}>

            <FlatList
                
                pagingEnabled={true}
                nestedScrollEnabled={true}
                data={taskImages}
                renderItem={renderItem}
                horizontal={true}
                keyExtractor={item => item.id.toString()}
                />

        </Modal >
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center',
        width: Dimensions.get('window').width * 1,
        height: Dimensions.get('window').height * 1
    },
    scoreText: {
        fontWeight: '700',
        color: '#373737',
    }
})