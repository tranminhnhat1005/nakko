import AsyncStorage from '@react-native-async-storage/async-storage';
import { Storage } from 'aws-amplify';
import { S3Image } from 'aws-amplify-react-native';
import ImageView from 'react-native-image-viewing';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacings } from '../../configs';

const Message = ({ message }) => {
    const [isMe, setIsMe] = useState(false);
    const [imageSources, setImageSources] = useState([]);
    const [imageViewerVisible, setImageViewerVisible] = useState(false);

    useEffect(() => {
        const isMyMessage = async () => {
            const authUserId = await AsyncStorage.getItem('AUTH_USER_ID');
            setIsMe(message.userID === authUserId);
        };

        isMyMessage();
    }, []);

    useEffect(() => {
        const downloadImage = async () => {
            if (message.images?.length) {
                const uri = await Storage.get(message.images[0]);
                setImageSources([{ uri }]);
            }
        };

        downloadImage();
    }, [message.images]);
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
            {message.images?.length ? (
                <>
                    <Pressable onPress={() => setImageViewerVisible(true)}>
                        <Image source={imageSources[0]} style={styles.s3Image} />
                    </Pressable>
                    <ImageView
                        animationType={'slide'}
                        swipeToCloseEnabled={true}
                        images={imageSources}
                        imageIndex={0}
                        visible={imageViewerVisible}
                        onRequestClose={() => setImageViewerVisible(false)}
                    />
                </>
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
