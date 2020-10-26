import { AuthAction, AuthState, NEED_VERIFICATION, SET_ERROR, SET_LOADING, SET_SUCCESS, SET_USER, SIGN_OUT} from '../types';

const initialState: AuthState = {
    user: null,
    authenticated: false,
    loading:false,
    error:"",
    needVerification:false,
    success:""

}

export default (state = initialState, action: AuthAction ) => {
    switch(action.type) {
        case SET_USER:
            return {
                ...state,
                user:action.payload,
                authenticated:true,
            }
    }
}