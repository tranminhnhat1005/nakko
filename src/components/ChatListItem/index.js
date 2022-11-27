import { Image, Text, View, StyleSheet } from 'react-native';
import moment from 'moment';

const SZ_IMG = 60;
const SZ_SPC = 10;

const ChatListItem = ({ data }) => {
    return (
        <View style={styles.viewContainer}>
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
        </View>
    );
};

const styles = StyleSheet.create({
    viewContainer: {
        flexDirection: 'row',
        marginHorizontal: SZ_SPC,
        marginVertical: SZ_SPC / 2,
        height: SZ_IMG + SZ_SPC,
    },
    img: {
        width: SZ_IMG,
        height: SZ_IMG,
        borderRadius: SZ_IMG / 2,
        marginRight: SZ_SPC,
    },
    viewContent: {
        flex: 1,
        borderBottomColor: 'lightgrey',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    viewInfo: {
        flexDirection: 'row',
        marginBottom: SZ_SPC / 2,
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
