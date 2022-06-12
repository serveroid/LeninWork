
export const requestToChange2FaStatus = async (userId, token) => {
    // Отправляем запрос о намерении изменении статуса 2FA. На телефон придет смс с кодом

    let response = await fetch('http://193.187.96.43/change_status_2FA', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'userId': userId,
            'token': token})
    });

    // let r = await response.text()
    // console.log(r);
    
        if (!response.ok){
            const errorResData = await response.json();
            const errorId = errorResData.error.message;
            console.log(errorId)
            throw new Error(response.message)
        }
        
        const resData = await response.json()
        
        if (!resData.isError) {
            try {
                return resData

            } catch (err) {
                console.log(err)
                return resData
            }
        } else {
            console.log(resData.message)
            return resData
        }

}


export const sendCodeToChangeStatus = async (token,twoFaApiKey, twoFaCode) => {
    // Отправляем код на подтверждение изменения статуса
  

    let response = await fetch('http://193.187.96.43/check_code_for_change_status_2FA', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'token': token,
            'api_key_2FA': twoFaApiKey,
            'code_2FA': twoFaCode   // на время разработки код 2ФА всегда 00000
        
        })
    });

    // let r = await response.text()
    // console.log(r);

        if (!response.ok){
            const errorResData = await response.json();
            const errorId = errorResData.error.message;
            console.log(errorId)
            throw new Error(response.message)
        }
        
        const resData = await response.json()
        
        if (!resData.isError) {
            try {
                return resData

            } catch (err) {
                console.log(err)
            }
        } else {
            console.log(resData.message)
        }

}