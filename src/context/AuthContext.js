import { AsyncStorage } from 'react-native';
import createDataContext from './createDataContext';
import trackerApi from '../api/tracker';
import { navigate } from '../navigationRef';

const authReducer = (state,action) => {
    switch(action.type){
        case 'add_err':
            return { ...state, errorMessage:action.payload };
        case 'signin':
            return { errorMessage:'', token:action.payload };
        case 'clear_error_message':
            return { ...state, errorMessage: '' };
        case 'signout':
            return { token: null, errorMessage:'' };
        default:
            return state;
    }
};


const tryLocalSignin = dispatch => async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
        dispatch({ type:'signin', payload: token });
        navigate('TrackList');
    } else {
        navigate('loginFlow');
    }

};


const clearErrorMessage = dispatch => () => {
    dispatch({ type: 'clear_error_message' });
};

const signup = (dispatch) => {
    return async ({ email, password, confirmPassword }) => {
        // make api request to sign up with that email and password
        try{
            const response = await trackerApi.post('/signup', { email, password, confirmPassword });
            await AsyncStorage.setItem('token', response.data.token);
            dispatch({ type:'signin', payload: response.data.token });

            navigate('TrackList')
        } catch (err) {
            console.log(err);
            dispatch({ type:'add_err', payload: err.response.data.error });
        }

    };
};


const signin = (dispatch) => {
    return async ({ email, password}) => {
        try{
            const response = await trackerApi.post('/signin', { email, password });
            await AsyncStorage.setItem('token', response.data.token);

            dispatch({ type:'signin', payload: response.data.token });
            navigate('TrackList')
        } catch (err) {
            console.log(err.response.data);
            dispatch({
                type:'add_err',
                payload: err.response.data.error
            });
        }
    };

};


const signout = (dispatch) => {
    return async () => {
        await AsyncStorage.removeItem('token');
        dispatch({ type:'signout' });
        navigate('loginFlow');
    };
};


export const { Provider, Context } = createDataContext(
    authReducer,
    { signin, signout, signup, clearErrorMessage, tryLocalSignin },
    { token: null, errorMessage:'' }
);
