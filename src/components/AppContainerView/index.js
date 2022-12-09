import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
    safeAreaViewOS: {
        flex: 0,
        backgroundColor: 'whitesmoke',
    },
    safeAreaView: {
        flex: 1,
        backgroundColor: 'whitesmoke',
    },
});

const AppContainerView = (props) => {
    const { children } = props;
    return (
        <>
            {Platform.OS && <SafeAreaView style={styles.safeAreaViewOS} />}
            <SafeAreaView style={styles.safeAreaView}>
                <StatusBar style={'auto'} />
                {children}
            </SafeAreaView>
        </>
    );
};

export default AppContainerView;
