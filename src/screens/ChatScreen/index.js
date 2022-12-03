import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, ImageBackground, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { API, graphqlOperation, Auth } from 'aws-amplify';

import { getChatRoom, listMessagesByChatRoom } from '../../graphql/queries';
import bg from '../../../assets/images/BG.png';
import InputBox from '../../components/InputBox';
import Message from '../../components/Message';
import { settings, spacings } from '../../configs';
import AsyncStorage from '@react-native-async-storage/async-storage';

const IS_IOS = Platform.OS === 'ios';

const ChatScreen = () => {
    const [chatRoom, setChatRoom] = useState(null);
    const [messages, setMessages] = useState([]);

    const route = useRoute();
    const navigation = useNavigation();
    const chatroomID = route.params.id;

    useEffect(() => {
        const fetchChatRoom = async () => {
            const { data } = await API.graphql(graphqlOperation(getChatRoom, { id: chatroomID }));
            setChatRoom(data?.getChatRoom);
        };

        fetchChatRoom();
    }, [chatroomID]);

    useEffect(() => {
        const fetchMessages = async () => {
            const { data } = await API.graphql(
                graphqlOperation(listMessagesByChatRoom, { chatroomID, sortDirection: 'DESC' })
            );

            setMessages(data?.listMessagesByChatRoom?.items);
        };

        fetchMessages();
    }, [chatroomID]);

    useEffect(() => {
        navigation.setOptions({ title: route.params.name });
    }, [route.params.name]);

    const renderItem = ({ item }) => {
        return <Message message={item} />;
    };

    return (
        <KeyboardAvoidingView
            behavior={IS_IOS ? 'padding' : 'height'}
            keyboardVerticalOffset={settings.getInputBoxInsetTop()[+IS_IOS]}
            style={styles.container}
        >
            {!chatRoom ? (
                <ActivityIndicator size={'large'} />
            ) : (
                <ImageBackground source={bg} style={styles.bg}>
                    <FlatList inverted style={styles.flatList} data={messages} renderItem={renderItem} />
                    <InputBox chatRoom={chatRoom} />
                </ImageBackground>
            )}
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    bg: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    flatList: {
        padding: spacings.def,
    },
});

export default ChatScreen;
