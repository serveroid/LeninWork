import {db} from '../Components/firebase';

export const pullResumeListData = async (category) => {
    // Получаем резюме из какой-либо категории
    
    // Create a reference to the cities collection
    const docRef = db.collection('resume');

    // Create a query against the collection.
    const query = docRef.where("category", "==", category);

    let resumeList = []

    return query.get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots

            resumeList.push(doc.data())
        });
        return resumeList
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
}