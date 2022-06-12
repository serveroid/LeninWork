
export const pullEarningsStatsData = async (userId, token) => {
    // Получаем данные о балансах из БД

    let response = await fetch('http://193.187.96.43/statistics_earning', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'userId': userId,
            'token': token
        })
    });

    // let r = await response.text()
    // console.log(r);

// }
        if (!response.ok){
            const errorResData = await response.json();
            const errorId = errorResData.error.message;
            console.log(errorId)
            throw new Error(response.message)
        }
        
        const resData = await response.json()
        
        if (!resData.isError) {
            try {
                let date = new Date()
                let hours = date.getHours()
                let minutes = date.getMinutes()
            
                if (hours.toString().length < 2) hours = '0' + hours;
                if (minutes.toString().length < 2) minutes = '0' + minutes;
                
                resData.balanceTimeString = `Баланс на сегодня ${hours}:${minutes}`
                resData.financialOperations =  resData.financialOperations === '' ? 0 : resData.financialOperations

                resData.referralEarnings =  resData.referralEarnings === '' ? 0 : resData.referralEarnings

                return resData

            } catch (err) {
                console.log(err)
            }
        } else {
            console.log(resData.message)
        }

}