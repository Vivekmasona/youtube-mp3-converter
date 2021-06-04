const default_obj = {
    convert: true,
    meta: null,
    token: null,
    link: ''
};

const initialState = {
    componentArray: [
        default_obj
    ]
};

const inputComponents = (state = initialState, action = {}) => {
    switch(action.type) {
        case 'ADD_NEW_INPUT': {
            return {
                ...state,
                componentArray: [
                    ...state.componentArray,
                    default_obj
                ]
            };
        }
        case 'CONVERSION_SUCCESSFUL': {
            const { 
                    token, 
                    meta: { title, thumbnail, lengthSeconds }, 
                    index
            } = action.payload;
            return {
                ...state,
                componentArray: state.componentArray.map((component, i) => {
                    if(i === index) {
                        return {
                            ...component,
                            token,
                            meta: {
                                title,
                                description: `Length: ${lengthSeconds} seconds`,
                                thumbnail: thumbnail.thumbnails[0].url,
                                error: false
                            },
                            convert: false
                        }
                    }
                    return component;
                })
            }
        }
        case 'CONVERSION_FAILED': {
            const { err, index } = action.payload;
            return {
                ...state,
                componentArray: state.componentArray.map((component, i) => {
                    if(i === index) {
                        return {
                            ...component,
                            token: null,
                            meta: {
                                title : 'Error!',
                                thumbnail : 'https://uploads.sitepoint.com/wp-content/uploads/2015/12/1450973046wordpress-errors.png',
                                description : err.message,
                                error: true
                            },
                            convert: false
                        }
                    }
                    return component;
                })
            }
        }
        case 'DELETE_COMPONENT': {
            const { index } = action.payload;
            return {
                ...state,
                componentArray: state.componentArray.filter((_, i) => i !== index)
            }
        }
        default: {
            return state;
        }
    }
};

export default inputComponents;