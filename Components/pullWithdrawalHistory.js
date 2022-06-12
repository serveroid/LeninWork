
export const pullWithdrawalHistory = async (userId, token) => {
    // Получаем данные о выводах

    let response = await fetch('http://193.187.96.43/cash_withdrawal', {
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