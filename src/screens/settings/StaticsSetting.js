import React from "react";
import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import HeaderBackTitle from "../../components/HeaderBackTitle";

const data = [
  {
    id: 1,
    date: "Today",
    earnings: 0,
    duration: "2 hours / 3 min",
    followers: 200,
  },
  {
    id: 2,
    date: "May 19",
    earnings: 0,
    duration: "2 hours / 3 min",
    followers: 200,
  },
  {
    id: 3,
    date: "Mar 19",
    earnings: 0,
    duration: "2 hours / 3 min",
    followers: 200,
  },
  {
    id: 4,
    date: "Apr 10",
    earnings: 0,
    duration: "2 hours / 3 min",
    followers: 200,
  },
  {
    id: 5,
    date: "May 19",
    earnings: 0,
    duration: "2 hours / 3 min",
    followers: 200,
  },
  {
    id: 6,
    date: "Jun 19",
    earnings: 0,
    duration: "2 hours / 3 min",
    followers: 200,
  },
  {
    id: 7,
    date: "Jul 19",
    earnings: 0,
    duration: "2 hours / 3 min",
    followers: 200,
  },
  {
    id: 8,
    date: "Today",
    earnings: 0,
    duration: "2 hours / 3 min",
    followers: 200,
  },
  {
    id: 9,
    date: "May 19",
    earnings: 0,
    duration: "2 hours / 3 min",
    followers: 200,
  },
  {
    id: 10,
    date: "Mar 19",
    earnings: 0,
    duration: "2 hours / 3 min",
    followers: 200,
  },
  {
    id: 11,
    date: "Apr 10",
    earnings: 0,
    duration: "2 hours / 3 min",
    followers: 200,
  },
  {
    id: 12,
    date: "May 19",
    earnings: 0,
    duration: "2 hours / 3 min",
    followers: 200,
  },
  {
    id: 13,
    date: "Jun 19",
    earnings: 0,
    duration: "2 hours / 3 min",
    followers: 200,
  },
  {
    id: 14,
    date: "Jul 19",
    earnings: 0,
    duration: "2 hours / 3 min",
    followers: 200,
  },
  {
    id: 15,
    date: "Today",
    earnings: 0,
    duration: "2 hours / 3 min",
    followers: 200,
  },
  {
    id: 16,
    date: "May 19",
    earnings: 0,
    duration: "2 hours / 3 min",
    followers: 200,
  },
  {
    id: 17,
    date: "Mar 19",
    earnings: 0,
    duration: "2 hours / 3 min",
    followers: 200,
  },
  {
    id: 18,
    date: "Apr 10",
    earnings: 0,
    duration: "2 hours / 3 min",
    followers: 200,
  },
  {
    id: 19,
    date: "May 19",
    earnings: 0,
    duration: "2 hours / 3 min",
    followers: 200,
  },
  {
    id: 20,
    date: "Jun 19",
    earnings: 0,
    duration: "2 hours / 3 min",
    followers: 200,
  },
  {
    id: 21,
    date: "Jul 19",
    earnings: 0,
    duration: "2 hours / 3 min",
    followers: 200,
  },
];

const StatItem = ({ index, item, navigation }) => {
  return (
    <View
      style={{
        marginVertical: 10,
        width: Dimensions.get("window").width - 40,
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Text style={{ opacity: 0.5, fontSize: 14, color: "#000" }}>
        {item.date}
      </Text>
      <Text style={{ opacity: 0.5, fontSize: 14, color: "#000" }}>
        {item.earnings}
      </Text>
      <Text style={{ opacity: 0.5, fontSize: 14, color: "#000" }}>
        {item.duration}
      </Text>
      <Text style={{ opacity: 0.5, fontSize: 14, color: "#000" }}>
        {item.followers}
      </Text>
    </View>
  );
};
const StatisticsScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <HeaderBackTitle title={"Statistics"} navigation={navigation} />
      <View
        style={{
          flex: 1,
          alignItems: "center",
          marginTop: 10,
          marginBottom: 30,
        }}
      >
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          numColumns={1}
          ListEmptyComponent={<Text>Loading...</Text>}
          ListHeaderComponent={
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  color: "#000",
                  fontWeight: "bold",
                  opacity: 0.7,
                }}
              >
                Date
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  color: "#000",
                  fontWeight: "bold",
                  opacity: 0.7,
                }}
              >
                Earnings
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  color: "#000",
                  fontWeight: "bold",
                  opacity: 0.7,
                }}
              >
                Duration
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  color: "#000",
                  fontWeight: "bold",
                  opacity: 0.7,
                }}
              >
                Followers
              </Text>
            </View>
          }
          renderItem={({ item, index }) => (
            <StatItem index={index} item={item} />
          )}
        />
      </View>
    </View>
  );
};

export default StatisticsScreen;

const styles = StyleSheet.create({});
