import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from '../screens/Splash';
import { navigationRef } from '../common/NavigationService';
import WelcomeNavigator from './WelcomeNavigator';

const Stack = createNativeStackNavigator();

const Routes = () => {
    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator
                id={'1'}
                initialRouteName={'Splash'}
                screenOptions={{
                    headerShown: false,
                    gestureEnabled: true,
                    animation: 'slide_from_right',
                }}
            >
                <Stack.Screen name={'Splash'} component={Splash} />
                <Stack.Screen name={'WelcomeNavigator'} component={WelcomeNavigator} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Routes;