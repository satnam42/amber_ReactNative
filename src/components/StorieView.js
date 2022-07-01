import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import VideoPlayer from "react-native-video-controls";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/core";

const StorieView = () => {
  const [currentVideoUri, setCurrentVideoUri] = useState();
  const [currentVideoIndex, setCurrentVideoIndex] = useState();

  const navigation = useNavigation();

  const data = [
    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm",
    "https://vjs.zencdn.net/v/oceans.mp4",
  ];

  useEffect(() => {
    setCurrentVideoUri(data[0]);
    setCurrentVideoIndex(0);
  }, []);

  const handleNext = () => {
    if (currentVideoIndex === data.length - 1) {
      setCurrentVideoIndex(0);
      setCurrentVideoUri(data[0]);
    } else {
      let newVideoIndex = currentVideoIndex + 1;
      setCurrentVideoIndex(newVideoIndex);
      setCurrentVideoUri(data[newVideoIndex]);
    }
  };
  const handlePrev = () => {
    if (currentVideoIndex === 0) {
      setCurrentVideoIndex(data.length - 1);
      setCurrentVideoUri(data[data.length - 1]);
    } else {
      let newVideoIndex = currentVideoIndex - 1;
      setCurrentVideoIndex(newVideoIndex);
      setCurrentVideoUri(data[newVideoIndex]);
    }
  };
  const handleVideoBackPress = () => {
    navigation.pop();
  };

  console.log({ currentVideoUri });
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#fff",
      }}
    >
      {currentVideoUri ? (
        <VideoPlayer
          source={{ uri: currentVideoUri }}
          navigator={{}}
          onBack={handleVideoBackPress}
        />
      ) : null}
      {data.length > 1 && (
        <View
          style={{
            position: "absolute",
            width: "100%",
            height: 80,

            top: "50%",
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <TouchableOpacity onPress={handlePrev}>
            <MaterialIcons
              name={"skip-previous"}
              size={40}
              style={{ padding: 10, backgroundColor: "rgba(0,0,0,0.3)" }}
              color="#fff"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNext}>
            <MaterialIcons
              name={"skip-next"}
              style={{ padding: 10, backgroundColor: "rgba(0,0,0,0.3)" }}
              color="#fff"
              size={40}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default StorieView;
