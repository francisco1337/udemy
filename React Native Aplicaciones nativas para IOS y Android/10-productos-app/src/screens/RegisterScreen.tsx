import React, { useContext, useEffect } from 'react'
import { Platform, Text, View, KeyboardAvoidingView, TextInput, TouchableOpacity, Keyboard, Alert } from 'react-native'
import { LoginStyles } from '../theme/loginTheme'
import { WhiteLogo } from '../components/WhiteLogo'
import { useForm } from '../hooks/useForm'
import { StackScreenProps } from '@react-navigation/stack'
import { AuthContext } from '../context/AuthContext'

interface Props extends StackScreenProps<any, any> { };

export const RegisterScreen = ({ navigation }: Props) => {
    
    
    const { signUp, errorMessage, removeError } = useContext(AuthContext);
    
    
    const { email, password, name, onChange, form } = useForm({
        name:'',
        email: '',
        password: ''
    });

    useEffect(() => {
        if (errorMessage.length === 0) return;

        Alert.alert('Login incorrecto', errorMessage, [{text:'Ok',onPress:removeError}]);
        

    }, [errorMessage])

    const onRegister = () => { 

        
        Keyboard.dismiss();
        signUp({ nombre: name, correo: email, password });
    }



    return (
        <>
            
            
            <KeyboardAvoidingView
                style={{ flex: 1, backgroundColor:'#5856D6' }}
                behavior={ (Platform.OS === 'ios') ?'padding': 'height' }
            >
                <View style={ LoginStyles.formContainter }>
                    {/* KEYBORAD AVOID VIEW */}
                    <WhiteLogo />     
                    
                    <Text style={LoginStyles.title}>Registro</Text>

                    <Text style={LoginStyles.label}>Nombre:</Text>
                    <TextInput
                        placeholder='Ingrese su nombre:'
                        placeholderTextColor='rgba(2555,255,255,0.4)'
                        underlineColorAndroid="white"
                        style={
                            [
                                LoginStyles.inputField,
                                (Platform.OS === 'ios') && LoginStyles.inputFieldIOS
                            ]
                        }
                        selectionColor='white'

                        onChangeText={(value) => { onChange(value, 'name') }} 
                        value={name}
                        onSubmitEditing={ onRegister }
                
                        autoCapitalize='words'
                        autoCorrect={ false }
                    />
                    
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
                        onSubmitEditing={ onRegister }
                
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

                    
                    {/* CREAR UNA NUEVA CUENTA */}
                    <View
                        style={ LoginStyles.buttonContainer }
                    >
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={LoginStyles.button}
                            onPress={ onRegister }
                        >
                            <Text
                                style={ LoginStyles.buttonText }
                            >Crear cuenta</Text>
                        </TouchableOpacity>

                    </View>


                    {/* BOTON LOGIN */}
                    <TouchableOpacity
                        onPress={() => navigation.replace('LoginScreen')}
                        activeOpacity={0.8}
                        style={
                            LoginStyles.buttonReturn
                        }
                    >
                        <Text
                            style={ LoginStyles.buttonText }
                        >Login</Text>
                    </TouchableOpacity>


                    {/* <View
                        style={ LoginStyles.newUserContainer }
                    >
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => navigation.replace('LoginScreen')  }
                        >
                            <Text style={ LoginStyles.buttonText }>Ingresar </Text>
                        </TouchableOpacity>
                    </View> */}
                </View>
            </KeyboardAvoidingView>
            
        </>
    )
}
