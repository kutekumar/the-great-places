import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";

import * as Location from "expo-location";

import Colors from "../constants/Colors";
import MapPreview from "./MapPreview";

const LocationPicker = (props) => {
  const [isFetching, setIsFetching] = useState(false);
  const [pickedLocation, setPickedLocation] = useState();

  const mapPickedLocaiton = props.navigation.getParam("pickedLocation");

  const { onLocationPicked } = props;

  useEffect(() => {
    if (mapPickedLocaiton) {
      setPickedLocation(mapPickedLocaiton);
      onLocationPicked(mapPickedLocaiton);
    }
  }, [mapPickedLocaiton, onLocationPicked]);

  const verifyPermissions = async () => {
    const result = await Location.requestBackgroundPermissionsAsync(); //Persmissions.askAsync(Persmissions.LOCATION);
    if (result.status !== "granted") {
      Alert.alert(
        "Insufficient Permission!",
        "You need to grant Location permission to use this app",
        [{ text: "OK" }]
      );
      return false;
    }
    return true;
  };

  const getLocationHandler = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }
    try {
      setIsFetching(true);
      const location = await Location.getCurrentPositionAsync({
        timeout: 5000,
      });
      console.log(location);
      setPickedLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
      props.onLocationPicked({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    } catch (err) {
      Alert.alert("Could not fetch Location!", "Please try again later", [
        { text: "OK" },
      ]);
    }
    setIsFetching(false);
  };

  const pickOnMapHandler = () => {
    props.navigation.navigate("Map");
  };

  return (
    <View style={styles.locationPicker}>
      <MapPreview
        style={styles.mapPreview}
        location={pickedLocation}
        onPress={pickOnMapHandler}>
        {isFetching ? (
          <ActivityIndicator size='large' color={Colors.primary} />
        ) : (
          <Text>No Location has chosen yet!</Text>
        )}
      </MapPreview>
      <View style={styles.actions}>
        <Button
          title='Get User Location'
          color={Colors.primary}
          onPress={getLocationHandler}
        />
        <Button
          title='Pick on Map'
          color={Colors.primary}
          onPress={pickOnMapHandler}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  locationPicker: {
    marginBottom: 15,
    alignItems: "center",
  },
  mapPreview: {
    marginBottom: 10,
    width: "100%",
    height: 150,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
});

export default LocationPicker;
