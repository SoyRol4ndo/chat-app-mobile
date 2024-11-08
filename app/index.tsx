// app/index.tsx
import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/store/useAuthStore';

export default function Index() {
    const user = useAuthStore((state) => state.user);

    return <Redirect href={user ? "/(auth)/chat" : "/(auth)/login"} />;
}