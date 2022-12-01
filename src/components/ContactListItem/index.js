import { useNavigation } from '@react-navigation/native';
import { API, Auth, graphqlOperation } from 'aws-amplify';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { createChatRoom, createUserChatRoom } from '../../graphql/mutations';
import { getCommonChatRoomWithAuthUser } from '../../services';
import { spacings } from '../../configs';

const ContactListItem = ({ user }) => {
    const navigation = useNavigation();

    const onNavigate = async () => {
        // check if already had a chat room with this user
        const existingChatRoom = await getCommonChatRoomWithAuthUser(user.id);
        if (existingChatRoom) {
            return navigation.navigate('Chat', { id: existingChatRoom.id });
        }
        // create a chat room
        const {
            data: {
                createChatRoom: { id },
            },
        } = await API.graphql(graphqlOperation(createChatRoom, { input: {} }));

        if (!id) {
            console.log('Error when creating the chat');
        }

        // add this user to the chat room
        await API.graphql(graphqlOperation(createUserChatRoom, { input: { chatRoomId: id, userId: user.id } }));

        // add auth user to the chat room
        const {
            attributes: { sub },
        } = await Auth.currentAuthenticatedUser();
        await API.graphql(graphqlOperation(createUserChatRoom, { input: { chatRoomId: id, userId: sub } }));

        // navigate to the chat room
        navigation.navigate('Chat', { id });
    };
    return (
        <Pressable onPress={onNavigate} style={styles.viewContainer}>
            <Image
                source={{ uri: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/1.jpg' }}
                style={styles.img}
            />
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
