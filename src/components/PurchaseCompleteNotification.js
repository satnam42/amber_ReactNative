import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";

const { width, height } = Dimensions.get("window");
const PurchaseCompleteNotification = ({
  purchaseNotificationVisible,
  setPurchaseNotificationVisible,
}) => {
  if (!purchaseNotificationVisible) return null;
  return (
    <View
      style={{
        position: "absolute",
        width: width,
        height: height,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          backgroundColor: "gray",
          opacity: 0.9,
          padding: 30,
          borderRadius: 30,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 16,
            backgroundColor: "#222",
            paddingHorizontal: 30,
            paddingVertical: 15,
            borderRadius: 30,
          }}
        >
          Purchase complete!
        </Text>

        <View
          style={{
            color: "#fff",
            fontSize: 16,
            backgroundColor: "#222",
            paddingHorizontal: 30,
            paddingVertical: 15,
            borderRadius: 30,
            marginVertical: 10,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 16,
              paddingHorizontal: 30,
              paddingVertical: 15,
              letterSpacing: 0.9,
            }}
          >
            Coins earned
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontSize: 16, letterSpacing: 0.8 }}>
              +800
            </Text>
            <Image
              source={require("../assets/icons/shop/03.item.png")}
              style={{ width: 60, height: 60, resizeMode: "contain" }}
            />
          </View>
        </View>

        <TouchableOpacity
          style={{
            color: "#fff",
            fontSize: 16,
            backgroundColor: "#3fbf40",
            paddingHorizontal: 30,
            paddingVertical: 15,
            borderRadius: 30,
          }}
          onPress={() => setPurchaseNotificationVisible(false)}
        >
          <Text
            style={{
              textAlign: "center",
              color: "#fff",
              fontWeight: "bold",
              fontSize: 17,
              letterSpacing: 0.8,
            }}
          >
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PurchaseCompleteNotification;
