import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { spacings } from '../../configs';

const ChatListItem = ({ data }) => {
    const [user, setUser] = useState(null);
    const navigation = useNavigation();
    const { users, id, LastMessage } = data;

    const uri = user?.image?.includes('http')
        ? user.image
        : 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/1.jpg';

    useEffect(() => {
        const fetchUser = async () => {
            const authUserId = await AsyncStorage.getItem('AUTH_USER_ID');
            const userItem = users.items.find((userItem) => userItem?.user?.id !== authUserId);
            setUser(userItem?.user);
        };
        fetchUser();
    }, []);

    const onNavigate = () => {
        navigation.navigate('Chat', { id, name: user.name });
    };
    return (
        <Pressable onPress={onNavigate} style={styles.viewContainer}>
            <Image source={{ uri }} style={styles.img} />
            <View style={styles.viewContent}>
                <View style={styles.viewInfo}>
                    <Text numberOfLines={1} style={styles.txtName}>
                        {user?.name}
                    </Text>
                    <Text style={styles.txtTime}>{moment(LastMessage?.createdAt).fromNow(true)}</Text>
                </View>
                <Text numberOfLines={2} style={styles.txtMessage}>
                    {LastMessage?.text}
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
