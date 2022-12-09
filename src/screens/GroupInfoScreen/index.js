import { useRoute } from '@react-navigation/native';
import { API, graphqlOperation } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import ContactListItem from '../../components/ContactListItem';
import { spacings } from '../../configs';
import { onUpdateChatRoom } from '../../graphql/subscriptions';

export const getChatRoom = /* GraphQL */ `
    query GetChatRoom($id: ID!) {
        getChatRoom(id: $id) {
            id
            updatedAt
            name
            users {
                items {
                    id
                    chatRoomId
                    userId
                    createdAt
                    updatedAt
                    _version
                    _deleted
                    _lastChangedAt
                    user {
                        id
                        name
                        status
                        image
                    }
                }
                nextToken
                startedAt
            }
            createdAt
            _version
            _deleted
            _lastChangedAt
            chatRoomLastMessageId
        }
    }
`;

const GroupInfoScreen = () => {
    const [chatRoom, setChatRoom] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const route = useRoute();

    const chatRoomId = route.params.id;

    const fetchChatRoom = async () => {
        try {
            setLoading(true);
            const { data } = await API.graphql(graphqlOperation(getChatRoom, { id: chatRoomId }));
            setChatRoom(data?.getChatRoom);
            setLoading(false);
        } catch (error) {
            console.log('error fetch chat room:::', error);
        }
    };

    useEffect(() => {
        fetchChatRoom();

        // Subscribe to onUpdateChatRoom
        const subscription = API.graphql(
            graphqlOperation(onUpdateChatRoom, { filter: { id: { eq: chatRoomId } } })
        ).subscribe({
            next: ({ value }) => {
                setChatRoom((prevState) => ({
                    ...(prevState || {}),
                    ...value.data?.onUpdateChatRoom,
                }));
            },
            error: (error) => setError(error),
        });

        // Stop receiving data updates from the subscription
        return () => subscription.unsubscribe();
    }, [chatRoomId]);

    const onPress = (item) => {
        console.log('onPress:::', item);
    };

    const renderItem = ({ item }) => {
        return <ContactListItem user={item.user} onPress={() => onPress(item)} />;
    };

    if (!chatRoom) {
        return (
            <View style={styles.viewContainerLoading}>
                <ActivityIndicator size={'large'} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{chatRoom?.name}</Text>
            <Text style={styles.sectionTitle}>{chatRoom?.users?.items.length || 0} Participants</Text>
            <View style={styles.section}>
                <FlatList data={chatRoom?.users?.items || []} renderItem={renderItem} refreshing={loading} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    viewContainerLoading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        padding: spacings.def,
        flex: 1,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 30,
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 20,
    },
    section: {
        backgroundColor: 'white',
        borderRadius: spacings.half,
        marginVertical: spacings.def,
    },
});

export default GroupInfoScreen;
