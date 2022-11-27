import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import ChatListItem from './src/screens/ChatListItem';

export default function App() {
    return (
        <View style={styles.container}>
            <StatusBar style={'auto'} />
            <ChatListItem />
            <ChatListItem />
            <ChatListItem />
            <ChatListItem />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
