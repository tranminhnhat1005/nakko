import AsyncStorage from '@react-native-async-storage/async-storage';
import { Storage } from 'aws-amplify';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { colors, spacings } from '../../configs';
import ImageAttachment from './ImageAttachment';
import VideoAttachment from './VideoAttachment';

const Message = ({ message }) => {
    const [isMe, setIsMe] = useState(false);
    const [downloadedAttachments, setDownloadedAttachments] = useState([]);
    const { width } = useWindowDimensions();
    const mediaMaxWidth = Math.floor(width * 0.8 - 30);

    useEffect(() => {
        const isMyMessage = async () => {
            const authUserId = await AsyncStorage.getItem('AUTH_USER_ID');
            setIsMe(message.userID === authUserId);
        };

        isMyMessage();
    }, []);

    useEffect(() => {
        const downloadAttachment = async () => {
            if (message.Attachments?.items?.length) {
                const downloadAttachments = await Promise.all(
                    message.Attachments.items.map((attachment) =>
                        Storage.get(attachment.storageKey).then((uri) => ({ ...attachment, uri }))
                    )
                );
                setDownloadedAttachments(downloadAttachments);
            }
        };

        downloadAttachment();
    }, [JSON.stringify(message.Attachments.items)]);

    const imageAttachments = downloadedAttachments.filter((at) => at.type === 'IMAGE');
    const videoAttachments = downloadedAttachments.filter((at) => at.type === 'VIDEO');

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
            {downloadedAttachments.length ? (
                <View style={[{ width: mediaMaxWidth }, styles.images]}>
                    <ImageAttachment attachments={imageAttachments} />
                    <VideoAttachment attachments={videoAttachments} width={mediaMaxWidth} />
                </View>
            ) : null}
            {message.text ? <Text style={styles.txtMessage}>{message.text}</Text> : null}
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
    images: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    videoContainer: {},
});

export default Message;
