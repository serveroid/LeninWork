import React from 'react';
import {Image, View} from 'react-native';


const Rating = (props)=>{
    const stars = [];
    for (let i = 0; i < Math.floor(props.rating); i++) {
        stars.push(
            <Image key={i.toString()} style={{width: 12, height: 12, resizeMode: 'contain', margin: 1}}
                   source={require('../assets/star.png')}/>
        );
    }
    if (props.rating % 1 != 0) {
        stars.push(
            <View key={'4'} style={{width: 10 * (props.rating % 1), height: 10, margin: 2.7, overflow: 'hidden'}}>
                <Image style={{width: 10, height: 10}} source={require('../assets/star.png')}/>
            </View>
        );
    }
    return (
        <View style={{flexDirection: 'row'}}>
            {stars.map(el=>el)}
        </View>
    );
};

export default Rating;