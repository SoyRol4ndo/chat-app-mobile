import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { Button, Surface, Text } from 'react-native-paper';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential, signInWithPopup } from 'firebase/auth';
import { auth } from '../../src/lib/firebase';
import { useAuthStore } from '../../src/store/useAuthStore';
import { router } from 'expo-router';
WebBrowser.maybeCompleteAuthSession();

export default function Login() {
    const setUser = useAuthStore((state) => state.setUser);
    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
        androidClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID,
        selectAccount: true,
    });


    const handleGoogleLogin = async () => {
        if (Platform.OS === 'web') {
            try {
                const provider = new GoogleAuthProvider();
                const result = await signInWithPopup(auth, provider);
                setUser(result.user);
                router.replace('/(auth)/chat');
            } catch (error) {
                console.error('Error signing in with Google:', error);
            }
        } else {
            promptAsync();
        }
    };

    React.useEffect(() => {
        if (response?.type === 'success' && Platform.OS !== 'web') {
            const { id_token } = response.params;
            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth, credential)
                .then((result) => {
                    setUser(result.user);
                    router.replace('/(auth)/chat');
                })
                .catch((error) => {
                    console.error('Error signing in with Google:', error);
                });
        }
    }, [response]);

    return (
        <Surface style={styles.container}>
            <Text variant="headlineMedium" style={styles.title}>
                Chat App
            </Text>
            <Button
                mode="contained"
                onPress={handleGoogleLogin}
                disabled={!request && Platform.OS !== 'web'}
                style={styles.button}
            >
                Iniciar sesión con Google
            </Button>
        </Surface>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        textAlign: 'center',
        marginBottom: 30,
    },
    button: {
        marginTop: 10,
    },
});