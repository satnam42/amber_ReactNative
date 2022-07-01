import React from 'react';
import {View, Text, FlatList, Alert, ActivityIndicator} from 'react-native';

import {useSelector} from 'react-redux';
import {api_getVideoCallHistory} from '../../../api_services';
import CallHistory from '../../../components/CallHistory';

const History = () => {
  const {auth} = useSelector(state => state);

  const [historyList, setHistoryList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const handleGetHistory = async () => {
    const payload = {userId: auth.user.id, authToken: auth.accessToken};
    setLoading(true);
    try {
      const response = await api_getVideoCallHistory(payload);
      console.log(response);
      if (response.isSuccess) {
        setHistoryList(response.data);
      } else {
        Alert.alert('error', response?.error || 'failed to get call history');
      }
    } catch (error) {
      Alert.alert('error', error?.message || 'failed to get call history');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    handleGetHistory();
  }, []);

  console.log({historyList});

  return (
    <View style={{marginTop: 10}}>
      <FlatList
        contentContainerStyle={{
          paddingBottom: 200,
        }}
        data={historyList}
        keyExtractor={item => item.id}
        numColumns={1}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              minHeight: 200,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {loading ? (
              <ActivityIndicator size="large" color={'orange'} />
            ) : (
              <Text>NO History...</Text>
            )}
          </View>
        }
        renderItem={({item, index}) => (
          <CallHistory index={index} key={item?._id || index} item={item} />
        )}
      />
    </View>
  );
};

export default History;
