import { Button, StyleSheet, View, Text } from 'react-native';
import { Auth } from 'aws-amplify';
import { useEffect, useState } from 'react';

const SettingScreen = () => {
    const [info, setInfo] = useState({});

    useEffect(() => {
        const getUserInfo = async () => {
            const response = await Auth.currentAuthenticatedUser();
            setInfo(response.attributes);
        };

        getUserInfo();
    }, []);

    const onSignOut = () => {
        Auth.signOut();
    };
    return (
        <View style={styles.viewContainer}>
            <Text>{info.email || ''}</Text>
            <Text>{info.phone_number || ''}</Text>
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
        marginTop: 15,
        backgroundColor: 'green',
        color: 'white',
    },
});

export default SettingScreen;
