import AsyncStorage from '@react-native-async-storage/async-storage';
import { Storage } from 'aws-amplify';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import ImageView from 'react-native-image-viewing';

import { colors, spacings } from '../../configs';

const Message = ({ message }) => {
    const [isMe, setIsMe] = useState(false);
    const [imageSources, setImageSources] = useState([]);
    const [downloadedAttachments, setDownloadedAttachments] = useState([]);
    const [imageViewerVisible, setImageViewerVisible] = useState(false);
    const { width } = useWindowDimensions();
    const imagesContainerWidth = Math.floor(width * 0.8 - 30);

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
    }, [message.Attachments.items]);

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
                <View style={[{ width: imagesContainerWidth }, styles.images]}>
                    {downloadedAttachments.map((downloadAttachment, idx) => (
                        <Pressable
                            key={idx}
                            style={[styles.imageContainer, imageSources.length === 1 && { flex: 1 }]}
                            onPress={() => setImageViewerVisible(true)}
                        >
                            <Image source={{ uri: downloadAttachment.uri }} style={styles.image} />
                        </Pressable>
                    ))}
                    <ImageView
                        animationType={'slide'}
                        swipeToCloseEnabled={true}
                        images={downloadedAttachments.map(({ uri }) => ({ uri }))}
                        imageIndex={0}
                        visible={imageViewerVisible}
                        onRequestClose={() => setImageViewerVisible(false)}
                    />
                </View>
            ) : null}
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
    images: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    imageContainer: {
        width: '49%',
        padding: 3,
        aspectRatio: 1,
    },
    image: {
        flex: 1,
        borderRadius: spacings.half,
    },
});

export default Message;
