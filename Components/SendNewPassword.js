export const sendNewPasswond = async (userId, token, oldPassword, newPassword) => {
    // Отправляем пароли на изменение в БД
  

    let response = await fetch('http://193.187.96.43/change_password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'userId': userId,
            'token': token,
            'newPassword': newPassword,
            'oldPassword': oldPassword
        })
    });
        

        // const r = await response.text()
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