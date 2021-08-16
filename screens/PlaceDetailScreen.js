import React from "react";
import { StyleSheet, Text, View } from "react-native";

const PlaceDetailScreen = (props) => {
  return (
    <View>
      <Text>Place Detail Screen</Text>
    </View>
  );
};

PlaceDetailScreen.navigationOptions = (navData) => {
  return {
    headerTitle: navData.navigation.getParam("placeTitle"),
  };
};

const styles = StyleSheet.create({});

export default PlaceDetailScreen;
