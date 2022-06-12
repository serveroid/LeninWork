export const pullReviewsListData = async (token, userId) => {
    const response = await fetch(
        `http://193.187.96.43/get_all_raiting`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'token': token,
                'idUser': userId
            })
        })

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