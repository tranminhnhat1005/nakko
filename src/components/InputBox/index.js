import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { API, Auth, graphqlOperation, Storage } from 'aws-amplify';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { FlatList, Image, Platform, StyleSheet, TextInput, View, Text } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';

import { colors, spacings } from '../../configs';
import { createAttachment, createMessage, updateChatRoom } from '../../graphql/mutations';

const IS_IOS = Platform.OS === 'ios';
const types = {
    image: 'IMAGE',
    video: 'VIDEO',
};
const MIMETypes = {
    acc: 'audio/aac',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    gif: 'image/gif',
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    mov: 'video/quicktime',
    mp3: 'audio/mpeg',
    mp4: 'video/mp4',
    pdf: 'application/pdf',
    png: 'image/png',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    svg: 'image/svg+xml',
    webm: 'video/webm',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    zip: 'application/zip',
};
const InputBox = ({ chatRoom }) => {
    const [text, setText] = useState('');
    const [files, setFiles] = useState([]);
    const [progresses, setProgresses] = useState({});

    const uploadFile = async (fileUri) => {
        try {
            const response = await fetch(fileUri);
            const blob = await response.blob();
            const key = uuid();
            const contentType = MIMETypes[fileUri.split('.').pop()];
            await Storage.put(key, blob, {
                contentType,
                progressCallback: (progress) => {
                    setProgresses((p) => ({
                        ...p,
                        [fileUri]: progress.loaded / progress.total,
                    }));
                },
            });
            return key;
        } catch (error) {
            console.warn('Upload file had an error:::', error);
        }
    };

    const onPickImage = async () => {
        // no permission request is necessary for launching the image library
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            quality: 1,
            allowsMultipleSelection: true,
        });

        if (!result.canceled) {
            setFiles(result.assets);
        }
    };

    const onRemoveFile = (item) => {
        setFiles((prevState) => prevState.filter((file) => file.assetId !== item.assetId));
    };

    const onAttachFile = async (file, messageID) => {
        const input = {
            storageKey: await uploadFile(file.uri),
            type: types[file.type],
            width: file.width,
            height: file.height,
            duration: Math.floor(file.duration),
            messageID,
            chatroomID: chatRoom.id,
        };

        return API.graphql(graphqlOperation(createAttachment, { input }));
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

        const newMessageData = await API.graphql(graphqlOperation(createMessage, { input }));
        const messageID = newMessageData.data.createMessage.id;

        setText('');

        await Promise.all(files.map((file) => onAttachFile(file, messageID)));
        setFiles([]);

        await API.graphql(
            graphqlOperation(updateChatRoom, {
                input: {
                    _version: chatRoom._version,
                    chatRoomLastMessageId: messageID,
                    id: chatRoom.id,
                },
            })
        );
    };

    const renderItem = ({ item }) => {
        return (
            <View style={styles.viewPreviewContainer}>
                <Image
                    source={{ uri: item.uri }}
                    style={[styles.selectedImage, { width: 120, height: (item.height * 120) / item.width }]}
                    resizeMode={'contain'}
                />
                {progresses[item.uri] ? (
                    <View style={styles.viewProgressContainer}>
                        <View style={styles.viewProgress}>
                            <Text style={styles.txtProgress}>{(progresses[item.uri] * 100).toFixed(0)} %</Text>
                        </View>
                    </View>
                ) : null}

                <MaterialIcons
                    name={'highlight-remove'}
                    size={spacings.icon}
                    onPress={() => onRemoveFile(item)}
                    color={'red'}
                    style={styles.removeSelectedImage}
                />
            </View>
        );
    };

    return (
        <>
            {files.length ? (
                <View style={styles.attachmentController}>
                    <FlatList horizontal data={files} renderItem={renderItem} />
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
        width: 200,
        height: 100,
        marginTop: spacings.half,
    },
    removeSelectedImage: {
        position: 'absolute',
        right: spacings.def,
        top: spacings.def,
        borderRadius: spacings.def,
        backgroundColor: 'whitesmoke',
        overflow: 'hidden',
    },
    viewPreviewContainer: {
        width: 200,
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewProgressContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        ...StyleSheet.absoluteFillObject,
    },
    viewProgress: {
        backgroundColor: '#8c8c8cAA',
        padding: 5,
        borderRadius: 50,
    },
    txtProgress: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default InputBox;
