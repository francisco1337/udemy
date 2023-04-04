import React, { useContext, useEffect } from 'react'
import {
    Text, View, TextInput, Platform, TouchableOpacity, KeyboardAvoidingView,
    Keyboard, Alert} from 'react-native'
import { Background } from '../components/Background'
import { WhiteLogo } from '../components/WhiteLogo'
import { LoginStyles } from '../theme/loginTheme'
import { useForm } from '../hooks/useForm'
import { StackScreenProps } from '@react-navigation/stack'
import { AuthContext } from '../context/AuthContext'
import AsyncStorage from '@react-native-async-storage/async-storage';
 
interface Props extends StackScreenProps<any, any> { };

export const LoginScreen = ({ navigation }: Props) => {

    const { signIn, errorMessage, removeError } = useContext(AuthContext);

    const { email, password, onChange, form } = useForm({
        email: '',
        password: ''
    });

    useEffect(() => {
        if (errorMessage.length === 0) return;

        Alert.alert('Login incorrecto', errorMessage, [{text:'Ok',onPress:removeError}]);
        

    }, [errorMessage])
    

    const onLogin = () => { 
        console.log(form);
        Keyboard.dismiss();

        signIn({ correo:email, password});
    }

    return (
        <>
            {/*  BACKGROUND */}
            <Background />
            
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={ (Platform.OS === 'ios') ?'padding': 'height' }
            >
                <View style={ LoginStyles.formContainter }>
                    {/* KEYBORAD AVOID VIEW */}
                    <WhiteLogo />     
                    
                    <Text style={LoginStyles.title}>Login</Text>
                    
                    <Text style={LoginStyles.label}>Email:</Text>
                    <TextInput
                        placeholder='Ingrese su email:'
                        placeholderTextColor='rgba(2555,255,255,0.4)'
                        keyboardType='email-address'
                        underlineColorAndroid="white"
                        style={
                            [
                                LoginStyles.inputField,
                                (Platform.OS === 'ios') && LoginStyles.inputFieldIOS
                            ]
                        }
                        selectionColor='white'

                        onChangeText={(value) => { onChange(value, 'email') }} 
                        value={email}
                        onSubmitEditing={ onLogin }
                
                        autoCapitalize='none'
                        autoCorrect={ false }
                    />


                    <Text style={LoginStyles.label}>Contraseña:</Text>
                    <TextInput
                        placeholder='*******'
                        placeholderTextColor='rgba(2555,255,255,0.4)'
                        underlineColorAndroid="white"
                        secureTextEntry
                        style={
                            [
                                LoginStyles.inputField,
                                (Platform.OS === 'ios') && LoginStyles.inputFieldIOS
                            ]
                        }
                        selectionColor='white'

                        onChangeText={(value) => { onChange(value, 'password') }} 
                        value={password}
                        
                        autoCapitalize='none'
                        autoCorrect={ false }
                    />

                    {/* BOTON LOGIN */}
                    <View
                        style={ LoginStyles.buttonContainer }
                    >
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={LoginStyles.button}
                            onPress={ onLogin }
                        >
                            <Text
                                style={ LoginStyles.buttonText }
                            >Login</Text>
                        </TouchableOpacity>

                    </View>


                    {/* CREAR UNA NUEVA CUENTA */}
                    <View
                        style={ LoginStyles.newUserContainer }
                    >
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => navigation.replace('RegisterScreen')  }
                        >
                            <Text style={ LoginStyles.buttonText }>Nueva cuenta </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
            
        </>
    )
}
