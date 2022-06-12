
export const getNotifications = async (userId, token) => {
    // Получаем данные о юзере(userData) из БД
  

    let response = await fetch('http://193.187.96.43/notifications', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'userId': '352b1dced0094ac8b065879de3802342',
            'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiIzNTJiMWRjZWQwMDk0YWM4YjA2NTg3OWRlMzgwMjM0MiJ9.zNsGmFRoxmzJgdX_BGJ4aV6VqjQpRFsga_7cnvuRgMw'})
    });

        // let r = await response.status
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
                console.log(resData);
                return resData

            } catch (err) {
                console.log(err)
            }
        } else {
            console.log(resData.message)
        }

}



