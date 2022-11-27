import { Image, Text, View, StyleSheet } from 'react-native';
import React from 'react';

const data = {
    uri: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/lukas.jpeg',
    name: 'Nak',
    time: '8:30',
    message: 'Hello guy!',
};
const SZ_IMG = 60;
const SZ_SPC = 10;

const ChatListItem = () => {
    return (
        <View style={styles.viewContainer}>
            <Image source={{ uri: data.uri }} style={styles.img} />
            <View style={styles.viewContent}>
                <View style={styles.viewInfo}>
                    <Text numberOfLines={1} style={styles.txtName}>
                        {data.name}
                    </Text>
                    <Text style={styles.txtTime}>{data.time}</Text>
                </View>
                <Text numberOfLines={2} style={styles.txtMessage}>
                    {data.message}
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
