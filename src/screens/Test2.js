import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";

const MyLoader = ({ visible, text = "Loading..." }) => {
  const [spinner, setSpinner] = useState(true);

  return (
    <View style={styles.container}>
      <Spinner
        visible={visible}
        textContent={text}
        textStyle={styles.spinnerTextStyle}
      />
    </View>
  );
};

export default MyLoader;

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: "#FFF",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#F5FCFF",
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 10000,
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    color: "#333333",
    marginBottom: 5,
  },
});
