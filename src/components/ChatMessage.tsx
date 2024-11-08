import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Surface, Text } from 'react-native-paper';
import { useAuthStore } from '../store/useAuthStore';

interface ChatMessageProps {
    message: string;
    photoURL: string;
    timestamp: string;
    userId: string;
}

export const ChatMessage = ({ message, photoURL, timestamp, userId }: ChatMessageProps) => {

    console.log(photoURL);
    const currentUser = useAuthStore((state) => state.user);
    const isOwn = currentUser?.uid === userId;

    return (
        <View style={[styles.container, isOwn ? styles.ownMessage : styles.otherMessage]}>
            <Avatar.Image
                size={32}
                source={{ uri: photoURL || 'https://via.placeholder.com/32' }}
                style={styles.avatar}
            />
            <Surface style={[
                styles.messageContent,
                isOwn ? styles.ownMessageContent : styles.otherMessageContent
            ]}>
                <Text>{message}</Text>
                <Text variant="bodySmall" style={styles.timestamp}>
                    {timestamp}
                </Text>
            </Surface>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginVertical: 4,
        paddingHorizontal: 16,
    },
    ownMessage: {
        flexDirection: 'row-reverse',
    },
    otherMessage: {
        flexDirection: 'row',
    },
    avatar: {
        marginHorizontal: 8,
    },
    messageContent: {
        maxWidth: '70%',
        padding: 12,
        borderRadius: 16,
    },
    ownMessageContent: {
        backgroundColor: '#E3F2FD',
    },
    otherMessageContent: {
        backgroundColor: '#F5F5F5',
    },
    timestamp: {
        marginTop: 4,
        opacity: 0.7,
    },
});