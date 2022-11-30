import { Button, StyleSheet, View } from 'react-native';
import { Auth } from 'aws-amplify';

const SettingScreen = () => {
    const onSignOut = () => {
        Auth.signOut();
    };
    return (
        <View style={styles.viewContainer}>
            <Button style={styles.btnSignOut} title={'Sign Out'} onPress={onSignOut} />
        </View>
    );
};

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnSignOut: {
        backgroundColor: 'green',
        color: 'white',
    },
});

export default SettingScreen;
