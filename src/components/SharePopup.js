import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { colors } from "../constants";

const SharePopup = ({ isShareScreenOpen, setIsShareScreenOpen }) => {
  const handleClose = () => setIsShareScreenOpen(false);
  return (
    <View
      style={{
        position: "absolute",
        zIndex: 1000,
        backgroundColor: "transparent",
        width: "100%",
        height: "100%",
      }}
    >
      <View
        style={{
          position: "absolute",
          backgroundColor: colors.blurDark,
          height: 350,
          width: "100%",
          bottom: 0,
          padding: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            Share
          </Text>
          <TouchableOpacity onPress={handleClose}>
            <FontAwesome size={20} color="#fff" name="close" />
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 5, marginBottom: 20 }}>
          <Text
            style={{
              color: "#fff",
              fontSize: 16,
              fontWeight: "bold",
              letterSpacing: 0.8,
            }}
          >
            For each friend that joins Amber,
          </Text>
          <Text
            style={{
              color: "#fff",
              fontSize: 16,
              fontWeight: "bold",
              letterSpacing: 0.8,
            }}
          >
            you will earn 50 diaminds!
          </Text>
        </View>

        <View>
          <Text
            style={{
              color: "#fff",
              fontSize: 16,
              fontWeight: "bold",
              letterSpacing: 0.8,
              marginBottom: 10,
            }}
          >
            Referral Link
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                fontWeight: "bold",
                letterSpacing: 0.8,
                backgroundColor: "rgba(0,0,0,0.7)",
                paddingHorizontal: 15,
                paddingVertical: 15,
                borderRadius: 40,
              }}
            >
              amber.invites/8G904
            </Text>
            <TouchableOpacity>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: "bold",
                  letterSpacing: 0.8,
                  backgroundColor: "rgba(0,0,0,0.8)",
                  paddingHorizontal: 25,
                  paddingVertical: 15,

                  borderRadius: 40,
                }}
              >
                Copy
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ marginTop: 10 }}>
          <Text
            style={{
              color: "#fff",
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            Share to
          </Text>
          <View
            style={{
              marginVertical: 15,
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <TouchableOpacity>
              <View
                style={{
                  backgroundColor: "#000",
                  width: 60,
                  height: 60,
                  borderRadius: 50,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FontAwesome name="facebook" color="#fff" size={35} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View
                style={{
                  backgroundColor: "#000",
                  width: 60,
                  height: 60,
                  borderRadius: 50,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <AntDesign name="twitter" color="#fff" size={35} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View
                style={{
                  backgroundColor: "#000",
                  width: 60,
                  height: 60,
                  borderRadius: 50,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MaterialCommunityIcons
                  name="facebook-messenger"
                  color="#fff"
                  size={35}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View
                style={{
                  backgroundColor: "#000",
                  width: 60,
                  height: 60,
                  borderRadius: 50,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FontAwesome name="whatsapp" color="#fff" size={38} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SharePopup;
