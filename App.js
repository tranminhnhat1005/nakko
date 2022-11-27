import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import ChatListScreen from './src/screens/ChatListScreen';

export default function App() {
    return (
        <View style={styles.container}>
            <StatusBar style={'auto'} />
            <ChatListScreen />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',

        // padding will change to safe area in future
        paddingVertical: 50,
    },
});
