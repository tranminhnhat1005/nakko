import { FlatList, StyleSheet } from 'react-native';

import data from '../../../assets/data/chats.json';
import ChatListItem from '../../components/ChatListItem';

const ChatListScreen = () => {
    const renderItem = ({ item }) => {
        return <ChatListItem data={item} />;
    };
    return <FlatList data={data} renderItem={renderItem} />;
};

const styles = StyleSheet.create({});

export default ChatListScreen;
