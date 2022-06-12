import React, {useLayoutEffect} from 'react';
import {FlatList, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {pullListOfReferrals} from '../../Components/pullListOfReferrals.js'

import {getListOfReferrals} from '../../redux/actions.js';


const ReferralStatistics = ({navigation})=>{

    // const earningStatsData = useSelector(state=>state.earningStatsData);
    const listOfReferrals = useSelector(state=>state.listOfReferrals);
    const userId = useSelector(state=>state.userId)
    const token = useSelector(state=>state.token)
    const dispatch = useDispatch();

    //меняем заголовок в шапке
    useLayoutEffect(()=>{
        navigation.setOptions({
            title: ('Статистика реф.')
        });

        // Получаем список рефералов с сервера
        const getReferralList = async () => {
            const listOfReferralsServer = await pullListOfReferrals(userId, token)
            dispatch(getListOfReferrals(listOfReferralsServer));
        }
        getReferralList()
    }, []);

    const renderItem = ({item})=>(
        <View style={styles.referralList}>
            <View style={styles.referralListNameView}>
                <Text style={styles.referralListName}>{item.name}</Text>
            </View>
            <View style={styles.referralListEarningsView}>
                <Text style={styles.referralListEarnings}>{item.income + ' \u20BD'}</Text>
            </View>
        </View>
    );

    if(listOfReferrals !== undefined){
        return (
            <View style={styles.container}>
                <ImageBackground source={require('../../assets/menu.png')} resizeMode="stretch" style={styles.imageBack}>
                    <TouchableOpacity style={styles.goBack}
                                      onPress={()=>{
                                          navigation.goBack();
                                      }}
                    >
                        <Image source={require('../../assets/backArrow.png')} style={styles.goBackIcon}/>
                        <Text style={styles.goBackText}>Вернуться назад</Text>
                    </TouchableOpacity>

                    <View style={styles.headlines}>
                        <Text style={styles.headlinesText}>Имя пользователя</Text>
                        <Text style={styles.headlinesText}>Доход</Text>
                    </View>

                    <View>
                        <FlatList
                            data={listOfReferrals.referals}
                            renderItem={renderItem}
                            keyExtractor={item=>item.id.toString()}
                        />
                    </View>

                    <View style={styles.total}>
                        <Text style={styles.totalText}>Итого: <Text style={{color:'#F96B5C'}}>{listOfReferrals.sum ? listOfReferrals.sum : '0'  + ' \u20BD'}</Text></Text>
                    </View>

                </ImageBackground>
            </View>
        )}
    else{
        return(
            <View></View>
        )
    }
};

export default ReferralStatistics;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 55
    },
    imageBack: {
        flex: 1,
        paddingTop: 115,
    },
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
    headlines: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginRight: 25,
    },
    headlinesText: {
        fontFamily: 'roboto',
        color: '#888888',
        fontSize: 15
    },
    referralList: {
        flexDirection: 'row',
        padding: 15,
        borderBottomWidth: 3,
        borderBottomColor: '#F3FBFF',
    },
    referralListNameView: {
        // position: 'absolute',
        // left: 40,
        marginLeft: 40,
        marginBottom: 5
    },
    referralListName: {
        fontFamily: 'roboto',
        color: '#000000',
        fontSize: 15,
    },
    referralListEarningsView: {
        position: 'absolute',
        right: 75,
        top: 15,
    },
    referralListEarnings: {
        fontFamily: 'roboto',
        color: '#F96B5C',
        fontSize: 15
    },
    total: {
        alignItems: 'flex-end',
        marginTop: 20,
        marginRight: 75,
    },
    totalText: {
        fontFamily: 'roboto',
        color: '#888888',
        fontSize: 15
    }
});
