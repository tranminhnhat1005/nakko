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
                        paddingRight: 7,
                        width,
                        height: (attachment.height * width) / attachment.width,
                    }}
                    source={{ uri: attachment.uri }}
                />
            ))}
        </>
    );
};

const styles = StyleSheet.create({});

export default VideoAttachment;
