import { API, Auth, graphqlOperation } from 'aws-amplify';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import ChatListItem from '../../components/ChatListItem';
import { listChatRooms } from './queries';

const ChatListScreen = () => {
    const [chatRooms, setChatRooms] = useState([]);

    useEffect(() => {
        const fetchChatsRoom = async () => {
            const {
                attributes: { sub },
            } = await Auth.currentAuthenticatedUser();
            const response = await API.graphql(graphqlOperation(listChatRooms, { id: sub }));

            setChatRooms(response.data.getUser.ChatRooms.items);
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
