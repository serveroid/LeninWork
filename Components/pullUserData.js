
export const pullUserData = async (userId, token) => {
    // Получаем данные о юзере(userData) из БД
  

    let response = await fetch('http://193.187.96.43/main_screen', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'userId': userId,
            'token': token})
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
                // Определяем время и добовляем в UserData
                let date = new Date()
                let hours = date.getHours()
                let minutes = date.getMinutes()

                if (hours.toString().length < 2) hours = '0' + hours;
                if (minutes.toString().length < 2) minutes = '0' + minutes;

                resData.balanceTimeString = `Баланс на сегодня ${hours}:${minutes}`

                return resData

            } catch (err) {
                console.log(err)
            }
        } else {
            console.log(resData.message)
        }

}



