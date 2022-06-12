export const task = (taskId, name, description, images, address, price, date) => {
    return dispatch => {
        dispatch({type: 'task', taskId: taskId, name: name, description: description, images: images, address: address, price: price, date: date})
    }
}

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