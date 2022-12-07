import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacings } from '../../configs';

const ContactListItem = ({ user, onPress = () => {}, selectable = false, isSelected = false }) => {
    const uri =
        user.image && user.image.includes('http')
            ? user.image
            : 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/1.jpg';

    return (
        <Pressable onPress={onPress} style={styles.viewContainer}>
            <Image source={{ uri }} style={styles.img} />
            <View style={styles.content}>
                <Text numberOfLines={1} style={styles.txtName}>
                    {user.name}
                </Text>
                <Text numberOfLines={2} style={styles.txtStatus}>
                    {user.status}
                </Text>
            </View>
            {selectable ? (
                <View style={styles.checkbox}>
                    {isSelected ? (
                        <AntDesign name={'checkcircle'} size={spacings.icon} color={colors.blueIcon} />
                    ) : (
                        <FontAwesome name={'circle-thin'} size={spacings.icon} color={colors.blueIcon} />
                    )}
                </View>
            ) : null}
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
    checkbox: {
        width: 30,
        alignItems: 'center',
    },
});

export default ContactListItem;
