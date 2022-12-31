import { Video } from 'expo-av';
import { StyleSheet } from 'react-native';

const VideoAttachment = ({ attachments, width }) => {
    return (
        <>
            {attachments.map((attachment, idx) => (
                <Video
                    key={idx}
                    useNativeControls
                    shouldPlay={false}
                    resizeMode={'contain'}
                    style={{
                        width,
                        height: (attachment.height * width) / attachment.width,
                    }}
                    videoStyle={styles.vidStyle}
                    source={{ uri: attachment.uri }}
                />
            ))}
        </>
    );
};

const styles = StyleSheet.create({
    vidStyle: {
        marginRight: 7,
        marginBottom: 5,
    },
});

export default VideoAttachment;
