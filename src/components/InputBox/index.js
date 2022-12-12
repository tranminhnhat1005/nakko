import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { API, Auth, graphqlOperation, Storage } from 'aws-amplify';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Image, Platform, StyleSheet, TextInput, View } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';

import { colors, spacings } from '../../configs';
import { createMessage, updateChatRoom } from '../../graphql/mutations';

const IS_IOS = Platform.OS === 'ios';
const InputBox = ({ chatRoom }) => {
    const [text, setText] = useState('');
    const [image, setImage] = useState(null);

    const uploadFile = async (fileUri) => {
        try {
            const response = await fetch(fileUri);
            const blob = await response.blob();
            const key = `${uuid()}.png`;
            await Storage.put(key, blob, {
                contentType: 'image/png',
            });
            return key;
        } catch (error) {
            console.warn('Upload file had an error:::', error);
        }
    };

    const onPickImage = async () => {
        // no permission request is necessary for launching the image library
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0]);
        }
    };

    const onRemoveImage = () => {
        setImage(null);
    };

    const onSend = async () => {
        const {
            attributes: { sub: userID },
        } = await Auth.currentAuthenticatedUser();
        const input = {
            chatroomID: chatRoom.id,
            text,
            userID,
        };

        if (image) {
            const key = await uploadFile(image.uri);
            input.images = [key];
            setImage(null);
        }

        const newMessageData = await API.graphql(graphqlOperation(createMessage, { input }));

        setText('');

        await API.graphql(
            graphqlOperation(updateChatRoom, {
                input: {
                    _version: chatRoom._version,
                    chatRoomLastMessageId: newMessageData.data.createMessage.id,
                    id: chatRoom.id,
                },
            })
        );
    };

    return (
        <>
            {image ? (
                <View style={styles.attachmentController}>
                    <Image source={{ uri: image.uri }} style={styles.selectedImage} resizeMode={'contain'} />
                    <MaterialIcons
                        name={'highlight-remove'}
                        size={spacings.icon}
                        onPress={onRemoveImage}
                        color={'red'}
                        style={styles.removeSelectedImage}
                    />
                </View>
            ) : null}
            <View style={styles.viewContainer}>
                <AntDesign
                    name={'plus'}
                    size={spacings.icon}
                    color={colors.blueIcon}
                    style={styles.icon}
                    onPress={onPickImage}
                />
                <TextInput
                    style={styles.txtInput}
                    placeholder={'type your message here...'}
                    value={text}
                    onChangeText={setText}
                    // multiline
                />
                <MaterialIcons
                    onPress={onSend}
                    name={'send'}
                    size={spacings.iconSm}
                    color={'white'}
                    style={styles.iconSend}
                />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    viewContainer: {
        flexDirection: 'row',
        backgroundColor: 'whitesmoke',
        paddingVertical: spacings.half,
        paddingHorizontal: spacings.def,
        alignItems: 'flex-end',
    },
    txtInput: {
        flex: 1,
        minHeight: 40,
        backgroundColor: 'white',
        paddingVertical: spacings.half,
        paddingHorizontal: spacings.def,
        marginHorizontal: spacings.def,

        borderRadius: 50,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'lightgray',
    },
    icon: {
        width: spacings.icon,
        height: spacings.icon,
        marginBottom: 8,
    },
    iconSend: {
        backgroundColor: colors.blueIcon,
        padding: spacings.half,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 8,
    },
    attachmentController: {
        alignItems: 'center',
        backgroundColor: 'whitesmoke',
    },
    selectedImage: {
        width: 150,
        height: 150,
        marginTop: spacings.half,
    },
    removeSelectedImage: {
        position: 'absolute',
        right: spacings.def,
        top: spacings.def,
        borderRadius: spacings.def,
        backgroundColor: 'transparent',
        overflow: 'hidden',
    },
});

export default InputBox;
