import React, { createContext, useEffect, useReducer } from "react";
import { LoginData, LoginResponse, RegisterData, Usuario } from "../interfaces/appInterfaces";
import { AuthState, authReducer } from "./authReducer";
import cafeApi from "../api/cafeApi";
import { AxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthContextProps = {
    errorMessage: string;
    token: string | null;
    user: Usuario | null;
    status: 'checking' | 'authenticated' | 'not-authenticated';
    signUp: ( registerData:RegisterData ) => void;
    signIn: ( logindata:LoginData )=>void;
    logOut: () => void;
    removeError: () => void;
}

const authInicialState: AuthState = { 
    status: "checking",
    token: null,
    user: null,
    errorMessage: ''
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: any) => { 


    const [state, dispatch] = useReducer( authReducer, authInicialState); // initialState estado inicial de la aplicacion

    useEffect(() => {

        checkToken();

    }, []);

    const checkToken = async () => { 
        const token = await AsyncStorage.getItem('token');

        // NO HAY TOKEN
        if (!token) return dispatch({ type: "notAuthenticated" });

        // HAY TOKEN
        const resp = await cafeApi.get('/auth');
        if (resp.status !== 200) { 
            return dispatch({type:"notAuthenticated"});
        }

        dispatch({
            type: "signUp",
            payload: {
                token: resp.data.token,
                user: resp.data.usuario
            }
        });

        // AsyncStorage.getItem('token').then(
        //     token => {
        //         console.log(token);
        //     }
        // ).catch(err => {
        //     console.log(err);//FALLA EN CASO DE NO HABER MEMORIA DONDE SE ALMACENE EL DATO EN STORAGE
        // });
    }


    const signIn = async ({ correo, password }:LoginData) => { 
        try {
            const { data } = await cafeApi.post<LoginResponse>('/auth/login', { correo, password });
            dispatch({
                type: "signUp",
                payload: {
                    token: data.token,
                    user: data.usuario
                }
            });
            // console.log(data.token);
            await AsyncStorage.setItem('token', data.token);
            
        } catch (error: any) {
            // console.log(error.response.data.msg);
            dispatch({
                type: "addError",
                payload: error.response.data.msg || 'Información Incorrecta'
            });
        }
            
        
    };
    
    const signUp = async ({ correo, nombre, password }: RegisterData) => { 
        console.log("francisco");
        try {
            console.log(correo, password, nombre);
            const { data } = await cafeApi.post<LoginResponse>('/usuarios', { nombre, correo, password });
            console.log("francisco2");
            dispatch({
                type: "signUp",
                payload: {
                    token: data.token,
                    user: data.usuario
                }
            });
            // console.log(data.token);
            await AsyncStorage.setItem('token', data.token);
            
        } catch (error: any) {
            // console.log(error.response.data.msg);
            console.log(error.response.data);
            dispatch({
                type: "addError",
                payload: error.response.data.errors[0].msg || 'Revise la información'
            });
        }

    };
    
    const logOut = async () => { 
        await AsyncStorage.removeItem('token');
        dispatch({type:"logout"})
    };
    

    const removeError = () => {
        dispatch({ type: "removeError" });
    };

    return (
        <AuthContext.Provider
            value={{
                ...state,
                signUp,
                signIn,
                logOut,
                removeError
            }}
        >
            { children }
        </AuthContext.Provider>
    )
}