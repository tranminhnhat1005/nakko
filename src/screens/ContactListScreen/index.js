import { API, graphqlOperation } from 'aws-amplify';
import { FlatList, Pressable, StyleSheet, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';

import { createChatRoom, createUserChatRoom } from '../../graphql/mutations';
import { getCommonChatRoomWithAuthUser } from '../../services';
import ContactListItem from '../../components/ContactListItem';
import { colors, spacings } from '../../configs';
import { listUsers } from '../../graphql/queries';

const ContactScreen = () => {
    const navigation = useNavigation();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchListContacts = async () => {
            const response = await API.graphql(graphqlOperation(listUsers));
            const authUserId = await AsyncStorage.getItem('AUTH_USER_ID');
            setUsers(response.data.listUsers.items.filter((item) => item.id !== authUserId));
        };
        fetchListContacts();
    }, []);

    const onNavigate = () => {
        navigation.navigate('New Group');
    };

    const onCheckExistChatRoom = async (user) => {
        // check if already had a chat room with this user
        return await getCommonChatRoomWithAuthUser(user.id);
    };

    const onCreateChatRoom = async () => {
        // create a chat room
        const { data } = await API.graphql(graphqlOperation(createChatRoom, { input: {} }));

        if (!data.createChatRoom.id) {
            console.log('Error when creating the chat');
            return null;
        }
        return data.createChatRoom.id;
    };

    const onAddTargetUser = async (chatRoomId, user) => {
        // add target user to the chat room
        const input = { chatRoomId, userId: user.id };
        await API.graphql(graphqlOperation(createUserChatRoom, { input }));
    };

    const onAddAuthUser = async (chatRoomId) => {
        // add auth user to the chat room
        const userId = await AsyncStorage.getItem('AUTH_USER_ID');
        const input = { chatRoomId, userId };
        await API.graphql(graphqlOperation(createUserChatRoom, { input }));
    };

    const onPress = async (user) => {
        const existed = await onCheckExistChatRoom(user);
        if (existed && existed.chatRoom) {
            return navigation.navigate('Chat', { id: existed.chatRoom.id, name: user.name });
        }
        const id = await onCreateChatRoom();
        if (!id) {
            return;
        }
        await onAddTargetUser(id, user);
        await onAddAuthUser(id);

        // navigate to the chat room
        navigation.navigate('Chat', { id, name: user.name });
    };

    const renderItem = ({ item }) => {
        return <ContactListItem user={item} onPress={() => onPress(item)} />;
    };

    const renderListHeader = () => {
        return (
            <Pressable onPress={onNavigate} style={styles.btnGroup}>
                <MaterialIcons
                    name={'group'}
                    size={spacings.icon}
                    color={colors.blueIcon}
                    style={styles.btnGroupIcon}
                />
                <Text style={styles.txtGroup}>New Group</Text>
            </Pressable>
        );
    };

    return (
        <FlatList style={styles.flatList} data={users} renderItem={renderItem} ListHeaderComponent={renderListHeader} />
    );
};

const styles = StyleSheet.create({
    flatList: {
        backgroundColor: 'white',
    },
    btnGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        paddingHorizontal: 20,
    },
    btnGroupIcon: {
        marginRight: 20,
        backgroundColor: 'gainsboro',
        padding: 7,
        borderRadius: 20,
        overflow: 'hidden',
    },
    txtGroup: {
        color: colors.blueIcon,
        fontSize: 16,
    },
});

export default ContactScreen;
