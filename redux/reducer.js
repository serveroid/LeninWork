const initialState = {
    userData: undefined,
    unreadMessage: 0,
    earningStatsData: undefined,
    notifications: [
        {id: 8, header: 'Новости сервиса', category: 1},
        {id: 7, header: 'Ваш заказ №2273283 выполнен', category: 2},
        {id: 6, header: 'Ответьте отзыв об исполнителе', category: 3},
        {id: 5, header: 'Ответьте на вопрос о заказе', category: 3},
        {id: 4, header: 'Ваш заказ №2273281 отменен', category: 2},
        {id: 3, header: 'Новое сообщение в арбитражном чате', category: 2},
        {id: 2, header: 'Новости сервиса', category: 1},
        {id: 1, header: 'Новости сервиса', category: 1}
    ],

    hasResume: false,
    finOperationsList: [],
    listOfReferrals: [],
    realtyAdd: [],
    withdrawalHistory: [],
    partnerStats: undefined,
    resumeData: undefined,
    twoFaApi: undefined,
    category: undefined,
    subCategory: undefined,
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
        case 'authenticate':

            return {
                ...state,
                userId: action.userId,

                token: action.token
            }

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
        case 'realtyCategory':
            return {
                ...state,
                realtyCategory: action.realtyCategory,
                realtySubCategoryOne: action.realtySubCategoryOne,
                realtySubCategoryTwo: action.realtySubCategoryTwo
            };

        case 'realty':
            return {
                ...state,
                realtyAdd: [...state.realtyAdd, {
                    realtyId: action.realtyId,
                    name: action.name,
                    description: action.description,
                    images: action.images,
                    address: action.address,
                    areaSize: action.areaSize,
                    price: action.price,
                    category: action.category
                    // subCategoryOne: action.subCategoryOne,
                    // subCategoryTwo: action.subCategoryTwo
                }]
            };

        case 'clearRealty':
            return {
                ...state,
                realtyAdd: []
            };

        case 'resume':
            return {
                ...state,
                hasResume: action.hasResume
            };
        case 'getEarningStatsData':
            return {
                ...state,
                earningStatsData: action.payload
            };
        case 'getFinOperationsList':
            return {
                ...state,
                finOperationsList: action.payload
            };
        case 'getListOfReferrals':
            return {
                ...state,
                listOfReferrals: action.payload
            };
        case 'getWithdrawalHistory':
            return {
                ...state,
                withdrawalHistory: action.payload
            };
        case 'getPartnerStats':
            return {
                ...state,
                partnerStats: action.payload
            };
        case 'getResumeData':
            return {
                ...state,
                resumeData: action.payload
            };
            case 'get2FaApi':
                return {
                    ...state,
                    twoFaApi: action.payload
                };


        default:
            return state;
    }
};

export default reducer;

// case 'category':
//             return {
//                 ...state,
//                 category: action.category,
//                 subCategoryOne: action.subCategoryOne,
//                 subCategoryTwo: action.subCategoryTwo
//             };
//         case 'realtyCategory':
//             return {
//                 ...state,
//                 realtyCategory: action.realtyCategory,
//                 realtySubCategoryOne: action.realtySubCategoryOne,
//                 realtySubCategoryTwo: action.realtySubCategoryTwo
//             };
//         case 'profileChange':
//             return {
//                 ...state,
//                 profileChangeStatus: action.profileChangeStatus,
//                 realtyId: action.realtyId
//         }
