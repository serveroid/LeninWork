import {storageRef} from '../Components/firebase.js';


export const pullResumeImages = async (id)=>{
    //Получаем сначала путь до каждого изображения в firebase, а затем url ссылки

    const getUrl = async (pathList)=>{
        const urlImages = [];

        for (let path of pathList) {
            let url

            try{
                url = await storageRef.child(path).getDownloadURL()
            }catch(error){
                console.log(error);
            }
            
            urlImages.push(
                {
                    id: urlImages.length,
                    url: url
                }
            );
                    
        }        
        
        if (urlImages.length === pathList.length) { //Проверяем, что забрали все ссылки и возвращаем массив
            return(urlImages);
        }
    };

    const pathImages = [];
    // Create a reference under which you want to list
    const listRef = storageRef.child(`resumeImages/${id}`);
    let res
    try{
        res = await listRef.listAll()
    }catch(error){
        console.log(error);
    }

    res.items.forEach((itemRef)=>{
        pathImages.push(itemRef._delegate._location.path_);
    });

    const images = await getUrl(pathImages)

    return images;
};
