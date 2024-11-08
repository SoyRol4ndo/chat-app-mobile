import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Appbar, TextInput, IconButton, Surface, Text } from 'react-native-paper';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp } from 'firebase/firestore';
import { auth, db } from '../../src/lib/firebase';
import { useAuthStore } from '../../src/store/useAuthStore';
import { ChatMessage } from '../../src/components/ChatMessage';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Message {
    id: string;
    text: string;
    userId: string;
    photoURL: string;
    timestamp: Timestamp;
}

export default function Chat() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [error, setError] = useState<string | null>(null);
    const user = useAuthStore((state) => state.user);
    const setUser = useAuthStore((state) => state.setUser);
    const flatListRef = useRef<FlatList<Message>>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted && !user) {
            router.replace('/(auth)/login');
            return;
        }

        const q = query(collection(db, 'messages'), orderBy('timestamp', 'asc'));

        try {
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const messagesData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...(doc.data() as Omit<Message, 'id'>)
                }));
                setMessages(messagesData);
                setError(null);
            }, (error) => {
                console.error("Error fetching messages:", error);
                setError(error.message);
            });

            return () => unsubscribe();
        } catch (error) {
            console.error("Error setting up messages listener:", error);
            setError(error instanceof Error ? error.message : 'Error desconocido');
        }
    }, [user, isMounted]);

    const handleSend = async () => {
        if (!message.trim() || !user) return;

        try {
            await addDoc(collection(db, 'messages'), {
                text: message,
                userId: user.uid,
                photoURL: user.photoURL,
                timestamp: serverTimestamp(),
            });
            setMessage('');
            setError(null);
        } catch (error) {
            console.error('Error sending message:', error);
            setError('Error al enviar el mensaje. Por favor, intenta de nuevo.');
        }
    };

    const handleLogout = async () => {
        try {
            await auth.signOut();
            setUser(null);
            router.replace('/(auth)/login');
        } catch (error) {
            console.error('Error logging out:', error);
            setError('Error al cerrar sesión. Por favor, intenta de nuevo.');
        }
    };

    const formatTimestamp = (timestamp: Timestamp | null) => {
        if (!timestamp) return '';
        try {
            return timestamp.toDate().toLocaleTimeString();
        } catch (error) {
            console.error('Error formatting timestamp:', error);
            return '';
        }
    };

    if (!user) return null;

    return (
        <SafeAreaView style={styles.container}>
            <Appbar.Header>
                <View style={styles.headerContent}>
                    <Text variant="titleMedium">{user.displayName}</Text>
                    <Appbar.Action icon="logout" onPress={handleLogout} />
                </View>
            </Appbar.Header>

            {error && (
                <Surface style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </Surface>
            )}

            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={({ item }) => (
                    <ChatMessage
                        message={item.text}
                        photoURL={item.photoURL}
                        timestamp={formatTimestamp(item.timestamp)}
                        userId={item.userId}
                    />
                )}
                keyExtractor={item => item.id}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
                onLayout={() => flatListRef.current?.scrollToEnd()}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
            >
                <Surface style={styles.inputContainer}>
                    <TextInput
                        mode="outlined"
                        value={message}
                        onChangeText={setMessage}
                        placeholder="Escribe un mensaje..."
                        style={styles.input}
                        onKeyPress={({ nativeEvent }) => {
                            if (nativeEvent.key === 'Enter') {
                                handleSend();
                            }
                        }}
                    />

                    <IconButton
                        icon="send"
                        mode="contained"
                        onPress={handleSend}
                        disabled={!message.trim()}
                    />
                </Surface>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    errorContainer: {
        margin: 8,
        padding: 8,
        borderRadius: 4,
        backgroundColor: '#ffebee',
    },
    errorText: {
        color: '#c62828',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 8,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        marginRight: 8,
    },
});
