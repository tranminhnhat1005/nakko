import AsyncStorage from '@react-native-async-storage/async-storage';
import { API, graphqlOperation } from 'aws-amplify';
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
        const authUserId = await AsyncStorage.getItem('AUTH_USER_ID');
        const { data } = await API.graphql(graphqlOperation(listChatRooms, { id: authUserId }));

        const rooms = data?.getUser?.ChatRooms?.items || [];
        const sortedRooms = rooms.sort(
            (roomA, roomB) => new Date(roomB.chatRoom.updatedAt) - new Date(roomA.chatRoom.updatedAt)
        );
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
            contentContainerStyle={{ paddingVertical: spacings.half }}
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
});

export default ChatListScreen;
