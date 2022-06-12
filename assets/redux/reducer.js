const initialState = {
    avatar: 'https://firebasestorage.googleapis.com/v0/b/react-native-delivery.appspot.com/o/users%2Fid1%2Favatar.jpg?alt=media&token=b8a3b7ae-d3f6-4e22-93f3-31cccc0bfa35',
    userData: {
        'address': 'г. Таганрог Рост. область',
        'balance': 5027.6,
        'balanceTimeString': 'Баланс на сегодня 23:16',
        'date': {
            'nanoseconds': 618000000,
            'seconds': 1629710696
        },
        'emailInfo': {
            'email': 'test@test.ru',
            'isConfirm': false
        },
        'isCustomer': true,
        'lastname': 'Олегович',
        'login': 'LoginTest',
        'name': 'Вячеслав',
        'phone': '+79991231234',
        'telegram': '@qwerty',
        'userId': '1'
    },
    unreadMessage: 2
};

const reducer = (state = initialState, action)=>{
    switch (action.type) {
        case 'task':
            return {
                ...state,
                taskId: action.taskId,
                name: action.name,
                description: action.description,
                images: action.images,
                address: action.address,
                price: action.price,
                date: action.date
            };
        case 'getAvatar':
            return {
                ...state,
                avatar: action.payload
            };
        case 'getUserData':
            return {
                ...state,
                userData: action.payload
            };
        case 'getUnreadMessage':
            return {
                ...state,
                unreadMessage: action.payload
            };
        case 'category':
            return {
                ...state,
                category: action.category,
                subCategory: action.subCategory
            };
        default:
            return state;
    }
};

export default reducer;