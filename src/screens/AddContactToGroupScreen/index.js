import { useNavigation, useRoute } from '@react-navigation/native';
import { API, graphqlOperation } from 'aws-amplify';
import { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, View } from 'react-native';

import ContactListItem from '../../components/ContactListItem';
import { spacings } from '../../configs';
import { createChatRoom, createUserChatRoom } from '../../graphql/mutations';
import { listUsers } from '../../graphql/queries';

const AddContactToGroupScreen = () => {
    const [users, setUsers] = useState([]);
    const [selectedUserIds, setSelectedUserIds] = useState([]);

    const navigation = useNavigation();
    const route = useRoute();
    const chatRoom = route.params.chatRoom;

    useEffect(() => {
        const fetchUsers = async () => {
            const { data } = await API.graphql(graphqlOperation(listUsers));
            const rawUsers = data?.listUsers?.items || [];
            const existedUsers = chatRoom?.users?.items || [];

            const diffUsers = rawUsers.filter(
                (rawUser) =>
                    !existedUsers.some((existedUser) => !existedUser._deleted && existedUser.userId === rawUser.id)
            );
            setUsers(diffUsers);
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button title={'Add to group'} disabled={selectedUserIds.length < 1} onPress={onAddToGroup} />
            ),
        });
    }, [selectedUserIds]);

    const onAddSelectedUsers = async () => {
        await Promise.all(
            selectedUserIds.map((userId) =>
                API.graphql(graphqlOperation(createUserChatRoom, { input: { chatRoomId: chatRoom.id, userId } }))
            )
        );
    };

    const onAddToGroup = async () => {
        await onAddSelectedUsers();

        setSelectedUserIds([]);

        // navigate to the chat room
        navigation.goBack();
    };

    const onContactPress = (id) => {
        setSelectedUserIds((prevState) => {
            if (prevState.includes(id)) {
                return [...prevState].filter((uid) => uid !== id);
            }
            return [...prevState, id];
        });
    };

    const renderItem = ({ item }) => {
        return (
            <ContactListItem
                user={item}
                onPress={() => onContactPress(item.id)}
                selectable={true}
                isSelected={selectedUserIds.includes(item.id)}
            />
        );
    };

    return (
        <View style={styles.viewContainer}>
            <FlatList data={users} renderItem={renderItem} />
        </View>
    );
};

const styles = StyleSheet.create({
    viewContainer: {
        backgroundColor: 'white',
    },
    txtInputGroupName: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: 'lightgray',
        padding: spacings.def,
        margin: spacings.def,
    },
});

export default AddContactToGroupScreen;
