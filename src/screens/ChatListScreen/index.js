import AsyncStorage from '@react-native-async-storage/async-storage';
import { API, Auth, graphqlOperation } from 'aws-amplify';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import ChatListItem from '../../components/ChatListItem';
import { spacings } from '../../configs';
import { listChatRooms } from './queries';

const ChatListScreen = () => {
    const [chatRooms, setChatRooms] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchChatsRoom = async () => {
        setLoading(true);
        let authUserId = await AsyncStorage.getItem('AUTH_USER_ID');
        if (!authUserId) {
            authUserId = await Auth.currentAuthenticatedUser();
        }
        const { data } = await API.graphql(graphqlOperation(listChatRooms, { id: authUserId }));

        const rooms = data?.getUser?.ChatRooms?.items || [];
        const sortedRooms = rooms
            .filter((room) => !room._deleted)
            .sort((roomA, roomB) => new Date(roomB.chatRoom.updatedAt) - new Date(roomA.chatRoom.updatedAt));
        setChatRooms(sortedRooms);
        setLoading(false);
    };

    useEffect(() => {
        fetchChatsRoom();
    }, []);

    const renderItem = ({ item }) => {
        const { chatRoom } = item;
        return <ChatListItem chat={chatRoom} />;
    };

    return (
        <FlatList
            style={styles.flatList}
            contentContainerStyle={styles.flatListContent}
            data={chatRooms}
            renderItem={renderItem}
            refreshing={loading}
            onRefresh={fetchChatsRoom}
        />
    );
};

const styles = StyleSheet.create({
    flatList: {
        backgroundColor: 'white',
    },
    flatListContent: {
        paddingVertical: spacings.half,
    },
});

export default ChatListScreen;
