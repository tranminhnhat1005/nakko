import { useNavigation, useRoute } from '@react-navigation/native';
import { API, graphqlOperation } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from 'react-native';

import ContactListItem from '../../components/ContactListItem';
import { colors, spacings } from '../../configs';
import { deleteUserChatRoom } from '../../graphql/mutations';
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
    const [loading, setLoading] = useState(false);
    const route = useRoute();
    const navigation = useNavigation();

    const chatRoomId = route.params.id;

    const users = chatRoom?.users?.items.filter((i) => !i._deleted) || [];

    const fetchChatRoom = async () => {
        try {
            setLoading(true);
            const { data } = await API.graphql(graphqlOperation(getChatRoom, { id: chatRoomId }));
            setChatRoom(data?.getChatRoom);
            setLoading(false);
        } catch (error) {
            console.warn('error fetch chat room:::', error);
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
            error: (error) => console.warn(error),
        });

        // Stop receiving data updates from the chat room subscription
        return () => subscription.unsubscribe();
    }, [chatRoomId]);

    const removeUser = async (item) => {
        await API.graphql(
            graphqlOperation(deleteUserChatRoom, {
                input: {
                    _version: item._version,
                    id: item.id,
                },
            })
        );
        await fetchChatRoom();
    };

    const onRemoveUser = (item) => {
        Alert.alert('Removing user', `Are you sure you want to remove ${item?.user?.name} from this group?`, [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Remove',
                style: 'destructive',
                onPress: () => removeUser(item),
            },
        ]);
    };

    const onInviteFriends = () => {
        navigation.navigate('Add Contact', { chatRoom });
    };

    const renderItem = ({ item }) => {
        return <ContactListItem user={item.user} onPress={() => onRemoveUser(item)} />;
    };

    if (!chatRoom) {
        return (
            <View style={styles.viewContainerLoading}>
                <ActivityIndicator size={'large'} />
            </View>
        );
    }

    return (
        <View style={styles.viewContainer}>
            <Text style={styles.txtTitle}>{chatRoom?.name}</Text>
            <View style={styles.viewInfo}>
                <Text style={styles.txtParticipant}>{users.length || 0} Participants</Text>
                <Text onPress={onInviteFriends} style={styles.txtInvite}>
                    Invite friends
                </Text>
            </View>
            <View style={styles.viewMembers}>
                <FlatList data={users} renderItem={renderItem} onRefresh={fetchChatRoom} refreshing={loading} />
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
    viewContainer: {
        padding: spacings.def,
        flex: 1,
    },
    viewInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    txtTitle: {
        fontWeight: 'bold',
        fontSize: 30,
    },
    txtParticipant: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    txtInvite: {
        color: colors.blueIcon,
        fontSize: 14,
    },
    viewMembers: {
        backgroundColor: 'white',
        borderRadius: spacings.half,
        marginVertical: spacings.def,
    },
});

export default GroupInfoScreen;
