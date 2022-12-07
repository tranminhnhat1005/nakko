import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { API, graphqlOperation } from 'aws-amplify';

import { listUsers } from '../../graphql/queries';
import { colors, spacings } from '../../configs';
import ContactListItem from '../../components/ContactListItem';
import { createChatRoom, createUserChatRoom } from '../../graphql/mutations';

const NewGroupScreen = () => {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');
    const [selectedUserIds, setSelectedUserIds] = useState([]);

    const navigation = useNavigation();

    useEffect(() => {
        const fetchUsers = async () => {
            const { data } = await API.graphql(graphqlOperation(listUsers));
            setUsers(data?.listUsers?.items);
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button title={'Create'} disabled={!name || selectedUserIds.length < 1} onPress={onCreateGroupPress} />
            ),
        });
    }, [name, selectedUserIds]);

    const onCreateChatRoom = async () => {
        // create a chat room
        const { data } = await API.graphql(graphqlOperation(createChatRoom, { input: {} }));

        if (!data.createChatRoom.id) {
            console.log('Error when creating the chat');
            return null;
        }
        return data.createChatRoom.id;
    };

    const onAddSelectedUsers = async (chatRoomId) => {
        await Promise.all(
            selectedUserIds.map((userId) =>
                API.graphql(graphqlOperation(createUserChatRoom, { input: { chatRoomId, userId } }))
            )
        );
    };

    const onCreateGroupPress = async () => {
        const id = await onCreateChatRoom();
        if (!id) {
            return;
        }

        await onAddSelectedUsers(id);

        setSelectedUserIds([]);
        setName('');
        // navigate to the chat room
        navigation.navigate('Chat', { id, name });
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
            <TextInput
                placeholder={'Group name'}
                value={name}
                onChangeText={setName}
                style={styles.txtInputGroupName}
            />
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

export default NewGroupScreen;
