// Сохраняем в БД отзыв
export const pushNewReview = (token, idUser, idReviewer, feedback, evaluation) => {
        // Add a new document with a generated id.
        const response = await fetch(
            `http://193.187.96.43/provide_feedback`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'token': token,
                    'idUser': idUser,
                    'idReviewer': idReviewer,
                    'feedback': feedback,
                    'evaluation': evaluation
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

