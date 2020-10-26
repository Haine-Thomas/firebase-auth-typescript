import { ThunkAction } from 'redux-thunk';

import { AuthAction, AuthState, SET_SUCCESS, NEED_VERIFICATION , User, SIGN_OUT, SET_LOADING, SET_USER, SET_ERROR, SignUpData } from '../types';
import  { RootState } from '..';
import firebase from '../../firebase/config';
import userEvent from '@testing-library/user-event';

//create User
export const signup = ( data: SignUpData, onError: () => void): ThunkAction<void, RootState, null, AuthAction> => {
    return async dispatch => {
        try {
            const res = await firebase.auth().createUserWithEmailAndPassword(data.email, data.password);
            if(res.user){
                const userData: User = {
                    email:data.email,
                    firstName: data.firstName,
                    id: res.user.uid,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                };
                await firebase.firestore().collection('./users').doc(res.user.uid).set(userData);
                await res.user.sendEmailVerification();
                dispatch({
                    type: NEED_VERIFICATION
                });
                dispatch({
                    type:SET_USER,
                    payload: userData
                })
            }
        } catch (err) {
            console.log(err);
            onError();
            dispatch({
                type: SET_ERROR,
                payload: err.message
            });
        }
    }
}

// get user by id
export const getUserById = (id: string):ThunkAction<void, RootState, null, AuthAction> => {
    return async dispatch => {
        try {
            const user = await firebase.firestore().collection('users').doc(id).get();
            if(user.exists){
                const userData = user.data() as User;
                dispatch({
                    type:SET_USER,
                    payload:userData
                })

            }
        } catch (err) {
            console.log(err);
        }
    }
}

