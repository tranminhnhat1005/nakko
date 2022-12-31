import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { API, graphqlOperation } from 'aws-amplify';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import bg from '../../../assets/images/BG.png';
import InputBox from '../../components/InputBox';
import Message from '../../components/Message';
import { spacings } from '../../configs';
import { getChatRoom } from '../../graphql/queries';
import { listMessagesByChatRoom } from './queries';
import { onCreateMessage, onUpdateChatRoom, onCreateAttachment } from '../../graphql/subscriptions';

const IS_IOS = Platform.OS === 'ios';

const ChatScreen = () => {
    const [chatRoom, setChatRoom] = useState(null);
    const [messages, setMessages] = useState([]);

    const route = useRoute();
    const navigation = useNavigation();
    const chatRoomId = route.params.id;

    const insetsBottom = useSafeAreaInsets().bottom;
    const keyboardVerticalOffset = (!insetsBottom ? insetsBottom - 5 : insetsBottom) + (IS_IOS ? 70 : 90);

    // fetch Chat Room
    useEffect(() => {
        API.graphql(graphqlOperation(getChatRoom, { id: chatRoomId })).then((result) =>
            setChatRoom(result.data?.getChatRoom)
        );

        const subscription = API.graphql(
            graphqlOperation(onUpdateChatRoom, { filter: { id: { eq: chatRoomId } } })
        ).subscribe({
            next: ({ value }) => {
                setChatRoom((cr) => ({
                    ...(cr || {}),
                    ...value.data.onUpdateChatRoom,
                }));
            },
            error: (err) => console.warn(err),
        });

        return () => subscription.unsubscribe();
    }, [chatRoomId]);

    // fetch Messages
    useEffect(() => {
        API.graphql(
            graphqlOperation(listMessagesByChatRoom, {
                chatroomID: chatRoomId,
                sortDirection: 'DESC',
            })
        ).then((result) => {
            setMessages(result.data?.listMessagesByChatRoom?.items);
        });

        // Subscribe to new messages
        const subscription = API.graphql(
            graphqlOperation(onCreateMessage, {
                filter: { chatroomID: { eq: chatRoomId } },
            })
        ).subscribe({
            next: ({ value }) => {
                setMessages((m) => [value.data.onCreateMessage, ...m]);
            },
            error: (err) => console.warn(err),
        });

        // Subscribe to new attachments
        const subscriptionAttachments = API.graphql(
            graphqlOperation(onCreateAttachment, {
                filter: { chatroomID: { eq: chatRoomId } },
            })
        ).subscribe({
            next: ({ value }) => {
                const newAttachment = value.data.onCreateAttachment;
                setMessages((existingMessages) => {
                    const messageToUpdate = existingMessages.find((em) => em.id === newAttachment.messageID);
                    if (!messageToUpdate) {
                        return existingMessages;
                    }
                    if (!messageToUpdate?.Attachments?.items) {
                        messageToUpdate.Attachments.items = [];
                    }
                    messageToUpdate.Attachments.items.push(newAttachment);

                    return existingMessages.map((m) => (m.id === messageToUpdate.id ? messageToUpdate : m));
                });
            },
            error: (err) => console.warn(err),
        });

        return () => {
            subscription.unsubscribe();
            subscriptionAttachments.unsubscribe();
        };
    }, [chatRoomId]);

    useEffect(() => {
        navigation.setOptions({
            title: route.params.name,
            headerRight: () => (
                <Feather
                    onPress={() => navigation.navigate('Group Info', { id: chatRoomId })}
                    hitSlop={styles.hitSlopBtnMore}
                    name={'more-vertical'}
                    size={24}
                    color={'gray'}
                />
            ),
        });
    }, [route.params.name, chatRoomId]);

    const renderItem = ({ item }) => {
        return <Message message={item} />;
    };

    return (
        <>
            {chatRoom ? (
                <KeyboardAvoidingView
                    keyboardVerticalOffset={keyboardVerticalOffset}
                    behavior={IS_IOS ? 'padding' : 'height'}
                    style={styles.container}
                >
                    <ImageBackground source={bg} style={styles.bg}>
                        <FlatList inverted style={styles.flatList} data={messages} renderItem={renderItem} />
                    </ImageBackground>
                    <InputBox chatRoom={chatRoom} />
                </KeyboardAvoidingView>
            ) : (
                <View style={styles.viewContainerLoading}>
                    <ActivityIndicator size={'large'} />
                </View>
            )}
            <SafeAreaView />
        </>
    );
};

const styles = StyleSheet.create({
    viewContainerLoading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    hitSlopBtnMore: {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10,
    },
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
