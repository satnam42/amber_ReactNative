import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Touchable,
  StyleSheet,
} from "react-native";

const FollowBtn = ({ onPress, follow = false }) => {
  return (
    <View style={styles.conatiner}>
      <TouchableOpacity
        onPress={onPress}
        style={follow ? styles.followBtn : styles.unfollowBtn}
      >
        <Text style={follow ? styles.followText : styles.unfollowText}>
          {follow ? "unfollow" : "follow"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default FollowBtn;

const styles = StyleSheet.create({
  conatiner: {
    alignItems: "center",
    margin: 10,
  },
  unfollowBtn: {
    backgroundColor: "orange",
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  followBtn: {
    backgroundColor: "#222",
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  followText: {
    color: "#FFF",
  },
  unfollowText: {
    color: "#000",
  },
});
