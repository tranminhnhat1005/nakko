import AsyncStorage from '@react-native-async-storage/async-storage';
import { API, graphqlOperation } from 'aws-amplify';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import ChatListItem from '../../components/ChatListItem';
import { listChatRooms } from './queries';

const ChatListScreen = () => {
    const [chatRooms, setChatRooms] = useState([]);

    useEffect(() => {
        const fetchChatsRoom = async () => {
            const authUserId = await AsyncStorage.getItem('AUTH_USER_ID');
            const { data } = await API.graphql(graphqlOperation(listChatRooms, { id: authUserId }));

            const rooms = data?.getUser?.ChatRooms?.items || [];
            const sortedRooms = rooms.sort(
                (roomA, roomB) => new Date(roomB.chatRoom.updatedAt) - new Date(roomA.chatRoom.updatedAt)
            );
            setChatRooms(sortedRooms);
        };

        fetchChatsRoom();
    }, []);

    const renderItem = ({ item }) => {
        const {
            chatRoom: { LastMessage, users, id },
        } = item;
        return <ChatListItem data={{ users, id, LastMessage }} />;
    };
    return <FlatList style={styles.flatList} data={chatRooms} renderItem={renderItem} />;
};

const styles = StyleSheet.create({
    flatList: {
        backgroundColor: 'white',
    },
});

export default ChatListScreen;
