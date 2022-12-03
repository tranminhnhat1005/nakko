import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { API, graphqlOperation } from 'aws-amplify';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { spacings } from '../../configs';
import { createChatRoom, createUserChatRoom } from '../../graphql/mutations';
import { getCommonChatRoomWithAuthUser } from '../../services';

const ContactListItem = ({ user }) => {
    const navigation = useNavigation();
    const uri =
        user.image && user.image.includes('http')
            ? user.image
            : 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/1.jpg';

    const onCheckExistChatRoom = async () => {
        // check if already had a chat room with this user
        return await getCommonChatRoomWithAuthUser(user.id);
    };

    const onCreateChatRoom = async () => {
        // create a chat room
        const { data } = await API.graphql(graphqlOperation(createChatRoom, { input: {} }));

        if (!data.createChatRoom.id) {
            console.log('Error when creating the chat');
            return null;
        }
        return data.createChatRoom.id;
    };

    const onAddTargetUser = async (chatRoomId) => {
        // add target user to the chat room
        const input = { chatRoomId, userId: user.id };
        await API.graphql(graphqlOperation(createUserChatRoom, { input }));
    };

    const onAddAuthUser = async (chatRoomId) => {
        // add auth user to the chat room
        const userId = await AsyncStorage.getItem('AUTH_USER_ID');
        const input = { chatRoomId, userId };
        await API.graphql(graphqlOperation(createUserChatRoom, { input }));
    };

    const onNavigate = async () => {
        const existed = await onCheckExistChatRoom();
        if (existed && existed.chatRoom) {
            return navigation.navigate('Chat', { id: existed.chatRoom.id, name: user.name });
        }
        const id = await onCreateChatRoom();
        if (!id) {
            return;
        }
        await onAddTargetUser(id);
        await onAddAuthUser(id);

        // navigate to the chat room
        navigation.navigate('Chat', { id, name: user.name });
    };

    return (
        <Pressable onPress={onNavigate} style={styles.viewContainer}>
            <Image source={{ uri }} style={styles.img} />
            <View style={styles.content}>
                <Text numberOfLines={1} style={styles.txtName}>
                    {user.name}
                </Text>
                <Text numberOfLines={2} style={styles.txtStatus}>
                    {user.status}
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
        alignItems: 'center',
    },
    img: {
        width: spacings.avatar,
        height: spacings.avatar,
        borderRadius: spacings.avatar / 2,
        marginRight: spacings.def,
    },
    content: {
        flex: 1,
    },
    txtName: {
        fontWeight: 'bold',
    },
    txtStatus: {
        color: 'gray',
    },
});

export default ContactListItem;
