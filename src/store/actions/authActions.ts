import { ThunkAction } from 'redux-thunk';

import { AuthAction, AuthState, SET_SUCCESS, NEED_VERIFICATION , User, SIGN_OUT, SET_LOADING, SET_USER, SET_ERROR, SignUpData, SignInData } from '../types';
import  { RootState } from '..';
import firebase from '../../firebase/config';

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

export const setLoading = (value: boolean): ThunkAction<void, RootState, null, AuthAction> => {
    return  dispatch => {
      dispatch({
          type:SET_LOADING,
          payload: value,
      });
    }
}

// Log In
export const signin = (data:SignInData, onError: () => void): ThunkAction<void, RootState, null, AuthAction> => {
    return async dispatch => {
        try {
            await firebase.auth().signInWithEmailAndPassword(data.email, data.password);
        } catch (err) {
            console.log(err);
            onError();
            dispatch(setError(err.message));
        }
    }
}

//Log Out
export const signout = (): ThunkAction<void, RootState, null, AuthAction> => {
    return async dispatch => {
        try {
            dispatch(setLoading(true));
            await firebase.auth().signOut();
            dispatch({
                type:SIGN_OUT,
            })
        } catch (err) {
            console.log(err);
            dispatch(setLoading(false));
        }
    }
}


// Set error
export const setError = (msg: string): ThunkAction<void, RootState, null, AuthAction> => {
    return dispatch => {
        dispatch({
            type:SET_ERROR,
            payload:msg
        });
    }
}

// set need verification
export const setNeedVerification = () : ThunkAction<void, RootState, null, AuthAction> => {
    return dispatch => {
        dispatch({
            type:NEED_VERIFICATION
        });
    }
}

// set success
export const setSuccess = (msg:string): ThunkAction<void, RootState, null, AuthAction> => {
    return dispatch => {
        dispatch({
            type:SET_SUCCESS,
            payload:msg,
        });
    }
}

// send password reset email
export const sendPasswordResetEmail = (email: string, successMsg:string): ThunkAction<void, RootState, null, AuthAction> => {
    return async dispatch => {
        try {
            await firebase.auth().sendPasswordResetEmail(email);
            dispatch(setSuccess(successMsg));
        } catch (err) {
            console.log(err);
            dispatch(setError(err.message));
        }
    }
}