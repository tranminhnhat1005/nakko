import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react-native';

import awsConfig from './src/aws-exports';
import Navigator from './src/navigation';

Amplify.configure({ ...awsConfig, Analytics: { disabled: true } });
function App() {
    return (
        <View style={styles.container}>
            <Navigator />
            <StatusBar style={'auto'} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        backgroundColor: 'whitesmoke',
    },
});

// export default App;
export default withAuthenticator(App);
