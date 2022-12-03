import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, ImageBackground, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { API, graphqlOperation, Auth } from 'aws-amplify';

import { getChatRoom } from '../../graphql/queries';
import bg from '../../../assets/images/BG.png';
import InputBox from '../../components/InputBox';
import Message from '../../components/Message';
import { spacings } from '../../configs';
import AsyncStorage from '@react-native-async-storage/async-storage';

const IS_IOS = Platform.OS === 'ios';

const ChatScreen = () => {
    const [chatRoom, setChatRoom] = useState(null);
    const [authUserId, setAuthUserId] = useState(null);

    const route = useRoute();
    const navigation = useNavigation();
    const chatroomID = route.params.id;

    // setup input position when the keyboard shown
    const insetTop = useSafeAreaInsets()['top'];
    // insetTop = 47 is notch-iPhone, smaller than is home button-iPhone
    // spacings.half * 2 is the padding of InputBox
    const iosVerticalOffset = insetTop < 47 ? 65 : Math.ceil(insetTop) + spacings.half * 2;
    const androidVerticalOffset = Math.ceil(insetTop) + spacings.half * 2 + 130;

    useEffect(() => {
        const fetchChatRoom = async () => {
            const { data } = await API.graphql(graphqlOperation(getChatRoom, { id: chatroomID }));
            setChatRoom(data?.getChatRoom);
        };

        fetchChatRoom();
    }, []);

    useEffect(() => {
        const getAuthUserID = async () => {
            const id = await AsyncStorage.getItem('AUTH_USER_ID');
            setAuthUserId(id);
        };
        getAuthUserID();
    }, []);

    useEffect(() => {
        navigation.setOptions({ title: route.params.name });
    }, [route.params.name]);

    navigation.setOptions;

    const renderItem = ({ item }) => {
        const isMyMessage = item?.userId === authUserId;
        return <Message message={item} isMyMessage={isMyMessage} />;
    };

    return (
        <KeyboardAvoidingView
            behavior={IS_IOS ? 'padding' : 'height'}
            keyboardVerticalOffset={IS_IOS ? iosVerticalOffset : androidVerticalOffset}
            style={styles.container}
        >
            {!chatRoom ? (
                <ActivityIndicator size={'large'} />
            ) : (
                <ImageBackground source={bg} style={styles.bg}>
                    <FlatList inverted style={styles.flatList} data={chatRoom.Messages.items} renderItem={renderItem} />
                    <InputBox chatRoom={chatRoom} />
                </ImageBackground>
            )}
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    bg: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    flatList: {
        padding: spacings.def,
    },
});

export default ChatScreen;
