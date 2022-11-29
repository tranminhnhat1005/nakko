import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { spacings } from '../../configs';

const ChatListItem = ({ data }) => {
    const navigation = useNavigation();

    const onNavigate = () => {
        const {
            id,
            user: { name },
        } = data;
        navigation.navigate('Chat', { id, name });
    };
    return (
        <Pressable onPress={onNavigate} style={styles.viewContainer}>
            <Image source={{ uri: data.user.image }} style={styles.img} />
            <View style={styles.viewContent}>
                <View style={styles.viewInfo}>
                    <Text numberOfLines={1} style={styles.txtName}>
                        {data.user.name}
                    </Text>
                    <Text style={styles.txtTime}>{moment(data.lastMessage.createdAt).fromNow(true)}</Text>
                </View>
                <Text numberOfLines={2} style={styles.txtMessage}>
                    {data.lastMessage.text}
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
