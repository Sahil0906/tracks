import React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';

const TrackListScreen = ({ navigation }) => {
    return(
        <View>
            <Text style={{ fontSize: 48 }}>
                TrackList Screen
            </Text>
            <Button 
                title="Go to Track detail"
                onPress={() => navigation.navigate('TrackDetail')}
            />
        </View>
    )
}

const styles = StyleSheet.create({

});

export default TrackListScreen;