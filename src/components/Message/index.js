import AsyncStorage from '@react-native-async-storage/async-storage';
import { S3Image } from 'aws-amplify-react-native';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacings } from '../../configs';

const Message = ({ message }) => {
    const [isMe, setIsMe] = useState(false);

    useEffect(() => {
        const isMyMessage = async () => {
            const authUserId = await AsyncStorage.getItem('AUTH_USER_ID');
            setIsMe(message.userID === authUserId);
        };

        isMyMessage();
    }, []);

    return (
        <View
            style={[
                styles.viewContainer,
                {
                    alignSelf: isMe ? 'flex-end' : 'flex-start',
                    backgroundColor: isMe ? colors.greenMsg : 'white',
                },
            ]}
        >
            {message.images?.length ? <S3Image imgKey={message.images[0]} style={styles.s3Image} /> : null}
            <Text style={styles.txtMessage}>{message.text}</Text>
            <Text style={styles.txtTime}>{moment(message.createdAt).fromNow(true)}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    viewContainer: {
        margin: spacings.half,
        padding: spacings.def,
        borderRadius: spacings.def,
        maxWidth: '80%',

        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,

        elevation: 1,
    },
    txtMessage: {},
    txtTime: {
        color: 'grey',
        alignSelf: 'flex-end',
    },
    s3Image: {
        width: 200,
        height: 200,
        // borderColor: 'white',
        // borderWidth: 2,
        borderRadius: spacings.half,
        marginBottom: spacings.half,
    },
});

export default Message;
