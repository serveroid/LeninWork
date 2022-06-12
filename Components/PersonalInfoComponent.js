
export const updatePersonalInfo = async (userId, token, localUserData) => {
    // Обновляем персональные данные в БД

    let response = await fetch('http://193.187.96.43/update_personal_info', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'userId': userId,
            'token': token,
            'name': localUserData.name,
            'email': localUserData.emailInfo.email,
            'phone': localUserData.number,
            'telegram': localUserData.telegram,
            'address': localUserData.address
        })
    });



        if (!response.ok){
            const errorResData = await response.json();
            const errorId = errorResData.error.message;
            console.log(errorId)
            throw new Error(response.message)
        }
        
        const resData = await response.json()
        
        if (!resData.isError) {
            try {
                return resData.message

            } catch (err) {
                console.log(err)
                return resData.message
            }
        } else {
            console.log(resData.message)
            return resData.message
        }
}


export const sendEmailConfirm = async (userId, token) => {
    // Отправляем запрос для подтверждения на емаил

    let response = await fetch('http://193.187.96.43/email_verification', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'userId': userId,
            'token': token
        })
    });


        if (!response.ok){
            const errorResData = await response.json();
            const errorId = errorResData.error.message;
            console.log(errorId)
            throw new Error(response.message)
        }
        
        const resData = await response.json()
        
        if (!resData.isError) {
            try {
                console.log(resData)
                return resData.message

            } catch (err) {
                console.log(err)
                return resData.message
            }
        } else {
            console.log(resData.message)
            return resData.message
        }

}