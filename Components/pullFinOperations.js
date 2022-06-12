
import {db} from '../Components/firebase';
// основной бэкенд пока в разработке

export const pullFinOperationsData = async (userId, token) => {
    // Получаем данные о финансовых операциях из БД

    const docRef = db.collection('financialOperations').doc('id1');

    return docRef.get().then((doc) => {
        if (doc.exists) {
            const finOperationsObj = doc.data()
            const finList = []
            for (let obj in finOperationsObj) {
                let day = ("0" + (finOperationsObj[obj].date.toDate().getDate())).slice(-2);
                let month = ("0" + (finOperationsObj[obj].date.toDate().getMonth() + 1)).slice(-2);
                let year = finOperationsObj[obj].date.toDate().getFullYear()
                let date = `${day}.${month}.${year}`
                finList.push({
                    ...finOperationsObj[obj],
                    date: date
                })
              }
            
           return(finList)
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    })
}


export const pullFinOperationsDataNew = async (userId, token) => {
    // Получаем данные о балансах из БД

    let response = await fetch('http://193.187.96.43/financial_transactions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'userId': userId,
            'token': token
        })
    });

    let r = await response.text()
    console.log(r);


        // if (!response.ok){
        //     const errorResData = await response.json();
        //     const errorId = errorResData.error.message;
        //     console.log(errorId)
        //     throw new Error(response.message)
        // }
        
        // const resData = await response.json()
        
        // if (!resData.isError) {
        //     try {

        //         return resData

        //     } catch (err) {
        //         console.log(err)
        //     }
        // } else {
        //     console.log(resData.message)
        // }

}