import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, Entypo } from '@expo/vector-icons';
import ChatListScreen from '../screens/ChatListScreen';
import NotImplementedScreen from '../screens/NotImplementedScreen';
import { colors, spacings } from '../configs';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
    return (
        <Tab.Navigator
            initialRouteName={'ChatList'}
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
                name={'ChatList'}
                component={ChatListScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name={'ios-chatbubbles-sharp'} color={color} size={size} />
                    ),
                    headerRight: () => (
                        <Entypo
                            name={'new-message'}
                            size={20}
                            style={{ marginRight: spacings.def }}
                            color={colors.blueIcon}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name={'Settings'}
                component={NotImplementedScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name={'ios-settings-sharp'} color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default MainTabNavigator;
