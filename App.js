import AsyncStorage from '@react-native-async-storage/async-storage';
import { Amplify, API, Auth, graphqlOperation } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react-native';
import { useEffect } from 'react';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';

import awsConfig from './src/aws-exports';
import AppContainerView from './src/components/AppContainerView';
import { createUser } from './src/graphql/mutations';
import { getUser } from './src/graphql/queries';
import Navigator from './src/navigation';

Amplify.configure({ ...awsConfig, Analytics: { disabled: true } });
function App() {
    useEffect(() => {
        const syncUser = async () => {
            // get Auth user
            const {
                attributes: { sub, phone_number },
            } = await Auth.currentAuthenticatedUser();
            if (sub) {
                await AsyncStorage.setItem('AUTH_USER_ID', sub);
            }
            if (phone_number) {
                await AsyncStorage.setItem('AUTH_USER_PHONE_NUMBER', phone_number);
            }

            // query the database using Auth user id (sub)
            const userData = await API.graphql(graphqlOperation(getUser, { id: sub }));

            if (userData.data.getUser) {
                return console.log('User already exits in DB!');
            }

            // if there is no user, create one
            const input = {
                id: sub,
                name: phone_number,
                status: `Hey, I am using Nakko with the nickname is ${phone_number}!`,
            };
            await API.graphql(graphqlOperation(createUser, { input }));
        };

        syncUser();
    }, []);

    return (
        <AppContainerView>
            <Navigator />
        </AppContainerView>
    );
}

// export default App;
export default withAuthenticator(App);
