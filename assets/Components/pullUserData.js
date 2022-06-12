
import {db } from './firebase.js';


export const pullUserData = (userId) => {
    // Получаем данные о заказе(userData) из БД и сохраняем в Редакс


    let date = new Date()
    let hours = date.getHours()
    let minutes = date.getMinutes()

    if (hours.toString().length < 2) hours = '0' + hours;
    if (minutes.toString().length < 2) minutes = '0' + minutes;

    let docRef = db.collection("users").doc(userId);

    docRef.get().then((doc) => {
        if (doc.exists) {
            const userDataObj = doc.data()
            userDataObj.balanceTimeString = `Баланс на сегодня ${hours}:${minutes}`
            return(userDataObj)
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}