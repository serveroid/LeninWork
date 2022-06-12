import { AsyncStorage } from 'react-native'

export const task = (taskId, name, description, images, address, price, date) => {
    return dispatch => {
        dispatch({type: 'task', taskId: taskId, name: name, description: description, images: images, address: address, price: price, date: date})
    }
}


export const realty = (realtyId, name, description, images, address, areaSize, price, category) => {
    return dispatch => {
        dispatch({type: 'realty', realtyId: realtyId, name: name, description: description, images: images, address: address, areaSize: areaSize, price: price, category: category})
    }
}

export const authenticate = (userId, token) => {
    return dispatch => {
        dispatch({type: 'authenticate', userId: userId, token: token})
    }
}

export const login = (login, pass) =>{
    return async dispatch => {
        const response = await fetch(
            `http://193.187.96.43/login`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({'login': login, 'password': pass})
            })

        if (!response.ok) {

            const errorResData = await response.json();
            const errorId = errorResData.error.message;
            console.log(errorId)
            throw new Error(response.message)
        }

        const resData = await response.json()

        if (resData.isError) {
            console.log(resData)
            throw new Error(resData.message)
        } else {
            // console.log(resData)
            dispatch(authenticate(resData.user_id, resData.token))
            await AsyncStorage.setItem('userId', resData.user_id)
            await AsyncStorage.setItem('token', resData.token)
        }
    }
}

export const registerEmail = (fullName, email, pass) => {
    return async dispatch => {
        const response = await fetch(
            `http://193.187.96.43/register_email`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({'name': fullName, 'email': email, 'password': pass})
        })

        if (!response.ok){
            const errorResData = await response.json();
            const errorId = errorResData.error.message;
            console.log(errorId)
            throw new Error(response.message)
        }
    
        const resData = await response.json()
        console.log(resData)

        if (!resData.isError) {
            try {
                dispatch(authenticate(resData.id, resData.token))
                await AsyncStorage.setItem('userId', resData.id)
                await AsyncStorage.setItem('token', resData.token)
            } catch (err) {
                console.log(err)
            }
        } else {
            setErrMessage(resData.message)
        }
    }
}

// export const registerNumber = (fullName, number, pass) => {
//     return async dispatch => {
//         const response = await fetch(
//             `http://193.187.96.43/register_number`,
//             {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({'name': fullName, 'number': number, 'password': pass})
//         })

//         if (!response.ok){
//             const errorResData = await response.json();
//             const errorId = errorResData.error.message;
//             console.log(errorId)
//             throw new Error(response.message)
//         }
    
//         const resData = await response.json()
//         console.log(resData)

//         if (!resData.isError) {
//             try {
//                 dispatch(authenticate(resData.id, resData.token))
//                 await AsyncStorage.setItem('userId', resData.id)
//                 await AsyncStorage.setItem('token', resData.token)
//             } catch (err) {
//                 console.log(err)
//             }
//         } else {
//             setErrMessage(resData.message)
//         }
//     }
// }


export const getUserData = (payload) => ({
    type: 'getUserData', payload: payload
})

export const getUnreadMessage = (payload) => ({
    type: 'getUnreadMessage', payload: payload
})

export const getAvatar = (payload) => ({
    type: 'getAvatar', payload: payload
})




export const setCategory = (category, subCategory) => {
    return dispatch => {
        dispatch({type: 'category', category: category, subCategory: subCategory})
    }
}

export const setRealtyCategory = (category, subCategoryOne, subCategoryTwo) => {
    return dispatch => {
        dispatch({type: 'realtyCategory', realtyCategory: category, realtySubCategoryOne: subCategoryOne, realtySubCategoryTwo: subCategoryTwo})
    }
}


export const setHasResume = (resume) => {
    return dispatch => {
        dispatch({type: 'resume', hasResume: resume})
    }
}


export const getEarningStatsData = (payload) => ({
    type: 'getEarningStatsData', payload: payload
})

export const getFinOperationsList = (payload) => ({
    type: 'getFinOperationsList', payload: payload
})

export const getListOfReferrals = (payload) => ({
    type: 'getListOfReferrals', payload: payload
})

export const getWithdrawalHistory = (payload) => ({
    type: 'getWithdrawalHistory', payload: payload
})

export const getPartnerStats = (payload) => ({
    type: 'getPartnerStats', payload: payload
})

export const getResumeData = (payload) => ({
    type: 'getResumeData', payload: payload
})

export const get2FaApi = (payload) => ({
    type: 'get2FaApi', payload: payload
})
