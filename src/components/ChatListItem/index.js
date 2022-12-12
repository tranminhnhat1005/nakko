import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { API, graphqlOperation } from 'aws-amplify';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { spacings } from '../../configs';
import { onUpdateChatRoom } from '../../graphql/subscriptions';

const ChatListItem = ({ chat }) => {
    const navigation = useNavigation();
    const [user, setUser] = useState(null);
    const [chatRoom, setChatRoom] = useState(chat);

    const source =
        user && user.image && user.image.includes('http')
            ? { uri: user.image }
            : require('../../../assets/images/person.png');

    useEffect(() => {
        const fetchUser = async () => {
            const authUserId = await AsyncStorage.getItem('AUTH_USER_ID');
            const userItem = chatRoom?.users?.items.find((userItem) => userItem?.user?.id !== authUserId);
            setUser(userItem?.user);
        };
        fetchUser();
    }, []);

    useEffect(() => {
        // subscribe to the update of chat room
        const subscription = API.graphql(
            graphqlOperation(onUpdateChatRoom, { filter: { id: { eq: chat.id } } })
        ).subscribe({
            next: ({ value }) => {
                setChatRoom((prevState) => ({ ...(prevState || {}), ...value.data.onUpdateChatRoom }));
            },
            error: (err) => console.warn(err),
        });

        return () => subscription.unsubscribe();
    }, [chat.id]);

    const onNavigate = () => {
        navigation.navigate('Chat', { id: chatRoom.id, name: user.name });
    };
    return (
        <Pressable onPress={onNavigate} style={styles.viewContainer}>
            <Image source={source} style={styles.img} />
            <View style={styles.viewContent}>
                <View style={styles.viewInfo}>
                    <Text numberOfLines={1} style={styles.txtName}>
                        {chatRoom.name || user?.name || 'Anonymous'}
                    </Text>
                    {!!chatRoom?.LastMessage ? (
                        <Text style={styles.txtTime}>{moment(chatRoom?.LastMessage?.createdAt).fromNow(true)}</Text>
                    ) : null}
                </View>
                <Text numberOfLines={2} style={styles.txtMessage}>
                    {chatRoom?.LastMessage?.text}
                </Text>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    viewContainer: {
        flexDirection: 'row',
        marginHorizontal: spacings.def,
        marginVertical: spacings.half,
        height: spacings.avatar + spacings.def,
    },
    img: {
        width: spacings.avatar,
        height: spacings.avatar,
        borderRadius: spacings.avatar / 2,
        marginRight: spacings.def,
    },
    viewContent: {
        flex: 1,
        borderBottomColor: 'lightgrey',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    viewInfo: {
        flexDirection: 'row',
        marginBottom: spacings.def / 2,
    },
    txtName: {
        flex: 1,
        fontWeight: 'bold',
    },
    txtTime: {
        color: 'grey',
    },
    txtMessage: {
        color: 'grey',
    },
});

export default ChatListItem;
