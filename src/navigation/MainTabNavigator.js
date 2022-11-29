import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, Entypo } from '@expo/vector-icons';
import ChatListScreen from '../screens/ChatListScreen';
import NotImplementedScreen from '../screens/NotImplementedScreen';
import { colors, spacings } from '../configs';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
    return (
        <Tab.Navigator
            initialRouteName={'Chats'}
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: 'whitesmoke',
                },
                headerStyle: {
                    backgroundColor: 'whitesmoke',
                },
            }}
        >
            <Tab.Screen
                name={'Status'}
                component={NotImplementedScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name={'square-sharp'} color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name={'Calls'}
                component={NotImplementedScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name={'call-sharp'} color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name={'Camera'}
                component={NotImplementedScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name={'camera-sharp'} color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name={'Chats'}
                component={ChatListScreen}
                options={({ navigation }) => ({
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name={'ios-chatbubbles-sharp'} color={color} size={size} />
                    ),
                    headerRight: () => (
                        <Entypo
                            name={'new-message'}
                            size={20}
                            color={colors.blueIcon}
                            style={{ marginRight: spacings.def }}
                            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                            onPress={() => navigation.navigate('Contacts')}
                        />
                    ),
                })}
            />
            <Tab.Screen
                name={'Settings'}
                component={NotImplementedScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name={'ios-settings-sharp'} color={color} size={size} />,
                }}
            />
        </Tab.Navigator>
    );
};

export default MainTabNavigator;
