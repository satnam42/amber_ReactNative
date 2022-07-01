import React, { useState, useEffect } from "react";
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  StyleSheet,
  Alert,
} from "react-native";
import RtcEngine, {
  ChannelProfile,
  ClientRole,
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
} from "react-native-agora";
import { useSelector } from "react-redux";
import { generate_rtcToken } from "../../api_services";
import requestCameraAndAudioPermission from "../../permissions";

const appId = "a1395860593f4d6e96486a96fb4ea8dc";

const RecivedCall = () => {
  const { accessToken, user } = useSelector((state) => state.auth);
  const [_engine, set_engine] = useState(null);
  const [joinSucceed, setJoinSucceed] = useState(false);
  const [rtcToken, setRtcToken] = useState(null);
  const [peerIds, setPeerIds] = useState([]);
  const [channelId, setChannelId] = useState(null);
  const [isPublisher, setIsPublisher] = useState(true);

  console.log("insideRecivedcall");
  //   _engine;
  //   constructor(props) {
  //     super(props);
  //     this.state = {
  //       isHost: true,
  //       joinSucceed: false,
  //       peerIds: [],
  //       authToken,
  //       auth,
  //     };
  //     if (Platform.OS === "android") {
  //       requestCameraAndAudioPermission().then(() => {
  //         console.log("requested!");
  //       });
  //     }
  //   }

  //   componentDidMount() {
  //     // this.init();
  //     this.getToken();
  //   }

  useEffect(() => {
    if (Platform.OS === "android") {
      requestCameraAndAudioPermission().then(() => {
        console.log("requested!");
      });
    }
    init();

    getToken();
    return () => {
      console.log("end call");
      endCall();
    };
  }, []);

  //   const getToken = async () => {
  //     const response = await generate_rtcToken({
  //       userId: user.id,
  //       channelId: user.id,
  //       isPublisher: isPublisher,
  //       authToken: accessToken,
  //     });
  //     console.log({ response });
  //     if (response.isSuccess && response.statusCode === 200) {
  //       setRtcToken(response.data);
  //       setChannelId(user.id);
  //       init(response.data, user.id);
  //     } else {
  //       Alert.alert("failed to get rtc token");
  //     }
  //   };

  //   componentWillUnmount() {
  //     this._engine?.destroy();

  const init = async (rtc_Token = "", channel_Id = "") => {
    console.log(rtc_Token, channel_Id);
    const e = await RtcEngine.create(appId);
    await e.enableVideo();
    await e?.setChannelProfile(ChannelProfile.LiveBroadcasting);
    await e?.setClientRole(ClientRole.Broadcaster);
    await e?.muteAllRemoteAudioStreams(true);
    console.log(e);
    set_engine(e);
    e.addListener("Warning", (warn) => {
      console.log("warning", warn);
    });

    e.addListener("Error", (err) => {
      console.log("Error", err);
    });

    e.addListener("UserJoined", (uid, elapsed) => {
      console.log("UserJoined", uid, elapsed);

      //   const { peerIds } = this.state;

      //   if (peerIds.indexOf(uid) === -1) {
      //     this.setState({
      //       peerIds: [...peerIds, uid],
      //     });
      //   }
      setPeerIds([...peerIds, uid]);
    });

    e.addListener("UserOffline", (uid, reason) => {
      console.log("UserOffline", uid, reason);
      //   const { peerIds } = this.state;
      //   this.setState({
      //     peerIds: peerIds.filter((id) => id !== uid),
      //   });
    });

    e.addListener("JoinChannelSuccess", (channel, uid, elapsed) => {
      console.log("JoinChannelSuccess", channel, uid, elapsed);
      //   this.setState({
      //     joinSucceed: true,
      //   });

      setJoinSucceed(true);
    });

    console.log({ rtc_Token, channel_Id });

    // await e?.joinChannel(rtc_Token, channelId, null, 0);
    await e?.joinChannel(
      "006a1395860593f4d6e96486a96fb4ea8dcIACi+VRpFCkd1qbHFY5K9jbD0sGp6EF0A9V7i4AzxtPIxNxePrcAAAAAEADbqsx0ltP4YQEAAQCW0/hh",
      "tree",
      null,
      0
    );
  };

  //   }
  //   init = async () => {
  //     this._engine = await RtcEngine.create(appId);
  //     await this._engine.enableVideo();
  //     await this._engine?.setClientRole(
  //       this.state.isHost ? ClientRole.Broadcaster : ClientRole.Audience
  //     );

  //     this._engine.addListener("Warning", (warn) => {
  //       console.log("warning", warn);
  //     });

  //     this._engine.addListener("Error", (err) => {
  //       console.log("Error", err);
  //     });

  //     this._engine.addListener("UserJoined", (uid, elapsed) => {
  //       console.log("UserJoined", uid, elapsed);

  //       const { peerIds } = this.state;

  //       if (peerIds.indexOf(uid) === -1) {
  //         this.setState({
  //           peerIds: [...peerIds, uid],
  //         });
  //       }
  //     });

  //     this._engine.addListener("UserOffline", (uid, reason) => {
  //       console.log("UserOffline", uid, reason);
  //       const { peerIds } = this.state;
  //       this.setState({
  //         peerIds: peerIds.filter((id) => id !== uid),
  //       });
  //     });

  //     this._engine.addListener("JoinChannelSuccess", (channel, uid, elapsed) => {
  //       console.log("JoinChannelSuccess", channel, uid, elapsed);
  //       this.setState({
  //         joinSucceed: true,
  //       });
  //     });

  //     this.startCall();
  //   };

  //   startCall = async () => {
  //     await this._engine?.joinChannel(token, channelName, null, 0);
  //   };

  //   endCall = async () => {
  //     await this._engine?.leaveChannel();
  //     this.setState({ peerIds: [], joinSucceed: false });
  //   };

  //   toggleRoll = async () => {
  //     this.setState({ isHost: !this.state.isHost }, async () => {
  //       await this._engine?.setClientRole(
  //         this.state.isHost ? ClientRole.Broadcaster : ClientRole.Audience
  //       );
  //     });
  //   };

  const endCall = async () => {
    await _engine?.leaveChannel();
  };
  console.log({ joinSucceed });
  console.log({ _engine });
  return (
    <View style={styles.max}>
      <View style={styles.max}>
        {/* <Text>
            You're {this.state.isHost ? "Broadcaster" : "the audience"}
          </Text> */}
        <View style={styles.buttonHolder}>
          {/*
             <TouchableOpacity onPress={this.toggleRoll} style={styles.button}>
              <Text style={styles.buttonText}> Toggle Roll</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.startCall} style={styles.button}>
              <Text style={styles.buttonText}> Start Call </Text>
            </TouchableOpacity> 
            */}
          {/* <TouchableOpacity onPress={this.endCall} style={styles.button}>
              <Text style={styles.buttonText}> End Call </Text>
            </TouchableOpacity> */}
        </View>
        {/* {this._renderVideos()}
          {this._renderRemoteVideos()} */}
        {joinSucceed && channelId ? (
          <View
            style={{
              width: 150,
              height: 200,
              position: "absolute",
              top: 35,
              left: 25,
              borderColor: "red",
              borderWidth: 5,
            }}
          >
            {console.log("opopop", channelId)}
            <RtcLocalView.SurfaceView
              style={{ width: 150, height: 200 }}
              channelId={"tree"}
              renderMode={VideoRenderMode.Hidden}
            />
          </View>
        ) : (
          <></>
        )}

        <ScrollView
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "absolute",
            width: "100%",
            height: "100%",
            zIndex: -1,
          }}
          contentContainerStyle={{ paddingHorizontal: 2.5 }}
          horizontal={true}
        >
          {peerIds.map(({ value, idx }) => {
            return (
              <RtcRemoteView.SurfaceView
                style={{
                  backgroundColor: "rgba(0,0,0,0.1)",
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  zIndex: -1,
                }}
                uid={value}
                key={idx}
                channelId={"tree"}
                renderMode={VideoRenderMode.Hidden}
                zOrderMediaOverlay={true}
              />
            );
          })}
        </ScrollView>
      </View>
    </View>
  );

  //   _renderVideos = () => {
  //     const { joinSucceed } = this.state;
  //     return joinSucceed ? (
  //       <View
  //         style={{
  //           width: 150,
  //           height: 200,
  //           position: "absolute",
  //           top: 40,
  //           left: 30,
  //         }}
  //       >
  //         {/* {this.state.isHost ? ( */}
  //         <RtcLocalView.SurfaceView
  //           style={{ width: 150, height: 200 }}
  //           channelId={channelName}
  //           renderMode={VideoRenderMode.Hidden}
  //         />
  //         {/* // ) : ( // <></>
  //         // )} */}
  //       </View>
  //     ) : null;
  //   };

  //   _renderRemoteVideos = () => {
  //     const { peerIds } = this.state;
  //     console.log({ peerIds });
  //     return (
  //       <ScrollView
  //         style={{
  //           backgroundColor: "rgba(0,0,0,0.1)",
  //           position: "absolute",
  //           width: "100%",
  //           height: "100%",
  //           zIndex: -1,
  //         }}
  //         contentContainerStyle={{ paddingHorizontal: 2.5 }}
  //         horizontal={true}
  //       >
  //         {peerIds.map(({ value, idx }) => {
  //           return (
  //             <RtcRemoteView.SurfaceView
  //               style={{
  //                 backgroundColor: "rgba(0,0,0,0.1)",
  //                 position: "absolute",
  //                 width: "100%",
  //                 height: "100%",
  //                 zIndex: -1,
  //               }}
  //               uid={value}
  //               key={idx}
  //               channelId={channelName}
  //               renderMode={VideoRenderMode.Hidden}
  //               zOrderMediaOverlay={true}
  //             />
  //           );
  //         })}
  //       </ScrollView>
  //     );
  //   };
};

const dimensions = {
  width: Dimensions.get("window").width,
  height: Dimensions.get("window").height,
};
const styles = StyleSheet.create({
  max: {
    flex: 1,
  },
  buttonHolder: {
    height: 100,
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#0093E9",
    borderRadius: 25,
  },
  buttonText: {
    color: "#fff",
  },
  fullView: {
    width: dimensions.width,
    height: dimensions.height - 100,
  },
  remoteContainer: {
    width: "100%",
    height: 150,
    position: "absolute",
    top: 5,
  },
  remote: {
    width: 150,
    height: 150,
    marginHorizontal: 2.5,
  },
  noUserText: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#0093E9",
  },
});

export default RecivedCall;
