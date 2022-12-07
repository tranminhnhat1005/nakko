import { useNavigation, useRoute } from '@react-navigation/native';
import { API, graphqlOperation } from 'aws-amplify';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, ImageBackground, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';

import bg from '../../../assets/images/BG.png';
import InputBox from '../../components/InputBox';
import Message from '../../components/Message';
import { settings, spacings } from '../../configs';
import { getChatRoom, listMessagesByChatRoom } from '../../graphql/queries';
import { onCreateMessage, onUpdateChatRoom } from '../../graphql/subscriptions';

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
            setChatRoom(data.getChatRoom);
        };

        fetchChatRoom();

        // subscribe to the update of chat room
        const subscription = API.graphql(
            graphqlOperation(onUpdateChatRoom, { filter: { id: { eq: chatroomID } } })
        ).subscribe({
            next: ({ value }) => {
                setChatRoom((prevState) => ({ ...(prevState || {}), ...value.data.onUpdateChatRoom }));
            },
            error: (err) => console.warn(err),
        });

        return () => subscription.unsubscribe();
    }, [chatroomID]);

    useEffect(() => {
        const fetchMessages = async () => {
            const { data } = await API.graphql(
                graphqlOperation(listMessagesByChatRoom, { chatroomID, sortDirection: 'DESC' })
            );

            setMessages(data?.listMessagesByChatRoom?.items);
        };

        fetchMessages();

        // subscribe to new messages
        const subscription = API.graphql(
            graphqlOperation(onCreateMessage, { filter: { chatroomID: { eq: chatroomID } } })
        ).subscribe({
            next: ({ value }) => {
                setMessages((prevState) => [value.data.onCreateMessage, ...prevState]);
            },
            error: (err) => console.warn(err),
        });

        return () => subscription.unsubscribe();
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
            keyboardVerticalOffset={chatRoom ? settings.getInputBoxInsetTop()[+IS_IOS] : 0}
            style={styles.container}
        >
            <ImageBackground source={bg} style={styles.bg}>
                <FlatList inverted style={styles.flatList} data={messages} renderItem={renderItem} />
            </ImageBackground>
            <InputBox chatRoom={chatRoom} />
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
