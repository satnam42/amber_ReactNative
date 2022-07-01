import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
const ReportUser = ({isReportVisible, setIsReportVisible}) => {
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      Alert.alert('success', 'your report is summited!');
      setIsReportVisible(false);
    }, 180);
  };
  return (
    <View
      style={{
        width: '80%',
        height: 270,
        backgroundColor: '#fff',
        position: 'absolute',
        zIndex: 100,
        top: 200,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.5)',
        borderRadius: 10,
      }}>
      {/* <View>
        <Text>Report user</Text>
      </View> */}
      {/*  */}
      <View
        style={{
          marginBottom: 30,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            maxWidth: 350,
            width: '80%',
            marginLeft: 15,
            color: 'rgba(0,0,0,0.6)',
            marginTop: 15,
            marginBottom: 5,
          }}>
          Reason to report
        </Text>
        <TextInput
          style={{
            maxWidth: 350,
            width: '80%',
            borderColor: 'rgba(0,0,0,0.1)',
            borderWidth: 0.2,
            borderRadius: 10,
            padding: 10,
            color: '#000',
            height: 170,
          }}
          multiline={true}
          placeholder={''}
          placeholderTextColor="rgba(0,0,0,0.3)"
          textAlign="left"
          textAlignVertical="top"
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
        }}>
        <TouchableOpacity onPress={() => handleSubmit()}>
          {loading ? (
            <ActivityIndicator color="black" size="small" />
          ) : (
            <Text>Submit</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setIsReportVisible(false);
          }}>
          <Text>Close</Text>
        </TouchableOpacity>
      </View>
      {/*  */}
    </View>
  );
};

export default ReportUser;
