import { useState } from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';
import ImageView from 'react-native-image-viewing';

import { spacings } from '../../configs';

const ImageAttachment = ({ attachments }) => {
    const [imageViewerVisible, setImageViewerVisible] = useState(false);
    const [imageIndexToShow, setImageIndexToShow] = useState(0);

    const openImageViewer = (idx) => {
        setImageIndexToShow(idx);
        setImageViewerVisible(true);
    };

    const closeImageViewer = () => {
        setImageIndexToShow(0);
        setImageViewerVisible(false);
    };
    return (
        <>
            {attachments.map((attachment, idx) => (
                <Pressable key={idx} style={[styles.imageContainer]} onPress={() => openImageViewer(idx)}>
                    <Image source={{ uri: attachment.uri }} style={styles.image} />
                </Pressable>
            ))}
            <ImageView
                animationType={'fade'}
                swipeToCloseEnabled={true}
                images={attachments.map(({ uri }) => ({ uri }))}
                imageIndex={imageIndexToShow}
                visible={imageViewerVisible}
                onRequestClose={closeImageViewer}
            />
        </>
    );
};

const styles = StyleSheet.create({
    imageContainer: {
        flex: 1,
        width: '45%',
        paddingRight: 7,
        paddingBottom: 5,
        aspectRatio: 1,
        minWidth: '30%',
    },
    image: {
        flex: 1,
        borderRadius: spacings.half,
    },
});

export default ImageAttachment;
