import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { spacings } from '../../configs';

const ContactListItem = ({ user }) => {
    const navigation = useNavigation();

    const onNavigate = () => {};
    return (
        <Pressable onPress={onNavigate} style={styles.viewContainer}>
            <Image source={{ uri: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/1.jpg' }} style={styles.img} />
            <View style={styles.content}>
                <Text numberOfLines={1} style={styles.txtName}>
                    {user.name}
                </Text>
                <Text numberOfLines={2} style={styles.txtStatus}>
                    {user.status}
                </Text>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    viewContainer: {
        flexDirection: 'row',
        marginHorizontal: spacings.def,
        marginVertical: spacings.half,
        height: spacings.avatar + spacings.def,
        alignItems: 'center',
    },
    img: {
        width: spacings.avatar,
        height: spacings.avatar,
        borderRadius: spacings.avatar / 2,
        marginRight: spacings.def,
    },
    content: {
        flex: 1,
    },
    txtName: {
        fontWeight: 'bold',
    },
    txtStatus: {
        color: 'gray',
    },
});

export default ContactListItem;
