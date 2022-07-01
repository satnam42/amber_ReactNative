export const DEV_MODE = {
  STATUS: false,
  UN: 'admin',
  PW: '12345678',
};

//  //  DEVELOPEMENT
// export const BASE_URL = 'http://93.188.167.68:8003/api';
// export const SOCKET_URL = 'ws://93.188.167.68:8003';

//  //  PRODUCTION
export const BASE_URL = 'https://amberclubpro.com:8001/api';
export const SOCKET_URL = 'wss://amberclubpro.com:8001';
/* ===============================================================================
                          U S E R 
 ===============================================================================  */

// SIGNUP -> POST
export const api_signup = async payload => {
  const uri = `${BASE_URL}/users/create`;
  const response = await fetch(uri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  }).then(res => res.json());
  return response;
};

// USER DELETE ACCOUNT
export const api_deleteUserAccount = async payload => {
  const {userId, token} = payload;
  const uri = `${BASE_URL}/users/deleteAccount/${userId}`;
  const response = await fetch(uri, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
  }).then(res => res.json());
  return response;
};

// LOGIN -> POST
export const api_login = async payload => {
  const uri = `${BASE_URL}/users/login`;
  const response = await fetch(uri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  }).then(res => res.json());
  return response;
};
// SOCIAL LOGIN -> POST
export const api_socialLogin = async payload => {
  const uri = `${BASE_URL}/users/socialLogin`;
  const response = await fetch(uri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  }).then(res => res.json());
  return response;
};
// RESET PASSWORD -> PUT
export const api_reset_password = async payload => {
  const {token, data, userId} = payload;
  const uri = `${BASE_URL}/users/resetPassword/${userId}`;
  const response = await fetch(uri, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify(data),
  }).then(res => res.json());
  return response;
};

// LOGOUT -> POST
export const api_logout = async payload => {
  const {token} = payload;
  const uri = `${BASE_URL}/users/logout`;
  const response = await fetch(uri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
  }).then(res => res.json());
  return response;
};

// IMAGE UPLOAD -> PUT
export const api_uploadImage = async (userId, photo) => {
  console.log(photo);
  const uri = `${BASE_URL}/users/profileImageUpload/${userId}`;
  const data = new FormData();
  data.append('image', {
    name: photo.fileName,
    type: photo.type,
    uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
  });

  const response = await fetch(uri, {
    method: 'PUT',
    body: data,
  }).then(res => res.json());
  console.log('HIDDEN API RES', response);
  return response;
};

// UPDATE USER -> PUT
export const api_update_user = async (payload, user_id, token) => {
  const uri = `${BASE_URL}/users/update/${user_id}`;
  const response = await fetch(uri, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify(payload),
  }).then(res => res.json());
  return response;
};

//USER PEOFILE IMAGE DELETE -> PUT
export const api_removeProfileImage = async (token, userId) => {
  const uri = `${BASE_URL}/users/removeProfilePic/${userId}`;

  const response = await fetch(uri, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
  }).then(res => res.json());
  return response;
};

// GET SINGLE USER
export const getUserDetails = async (token, user_id) => {
  console.log({token, user_id});
  const uri = `${BASE_URL}/users/profile/${user_id}`;
  console.log(uri);
  const response = await fetch(uri, {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
  }).then(res => res.json());

  return response;
};

// GET USERS BY CLUB NAME
export const getUserByClubName = async (gender, pageNo) => {
  console.log(gender, pageNo);
  const uri = `${BASE_URL}/users/random?gender=${gender}&pageNo=${pageNo}&pageSize=${18}`;
  console.log(uri);
  const response = await fetch(uri, {
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(res => res.json());
  return response;
};

// GET RANDOM USERS
export const getRandomUser = async (gender, pageNo) => {
  console.log(gender, pageNo);
  const uri = `${BASE_URL}/users/random?gender=${gender}&pageNo=${pageNo}&pageSize=${18}&country=india`;
  console.log(uri);
  const response = await fetch(uri, {
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(res => res.json());
  return response;
};

// GET FOLLOWERS LIST
export const api_getFollowersList = async (token, user_id) => {
  const uri = `${BASE_URL}/users/followers/${user_id}`;
  const response = await fetch(uri, {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
  }).then(res => res.json());
  return response;
};

// GET FOLLOWING LIST
export const api_getFollowingList = async (token, user_id) => {
  const uri = `${BASE_URL}/users/following/${user_id}`;
  const response = await fetch(uri, {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
  }).then(res => res.json());
  return response;
};

//FOLLOW USER
export const api_followUser = async payload => {
  const uri = `${BASE_URL}/users/follow`;
  const {token, userId, tragetUserId} = payload;
  const response = await fetch(uri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify({
      userId: userId,
      toFollowUserId: tragetUserId,
    }),
  }).then(res => res.json());
  console.log({response});
  return response;
};
//UNFOLLOW USER
export const api_unfollowUser = async payload => {
  console.log(payload);
  const {token, userId, tragetUserId} = payload;
  const uri = `${BASE_URL}/users/unfollow`;

  const response = await fetch(uri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify({
      userId: userId,
      toUnfollowUserId: tragetUserId,
    }),
  }).then(res => res.json());
  console.log({response});
  return response;
};
//REMOVE OUR FOLLOWER
export const api_removeFollower = async payload => {
  console.log(payload);

  const {token, userId, tragetUserId} = payload;
  const uri = `${BASE_URL}/users/removeFollower`;

  const response = await fetch(uri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify({
      followerUserId: tragetUserId,
      userId: userId,
    }),
  }).then(res => res.json());
  console.log({response});
  return response;
};

//user with FILLER
export const api_userWithFillter = async payload => {
  const {popular, country, pageNo, pageSize, lat, long, token} = payload;
  console.log({payload});
  let uri;
  if (country === 'ALL') {
    uri = `${BASE_URL}/users/usersByFilter?list=${true}&pageNo=${pageNo}&pageSize=${pageSize}&lat,long=${lat},${long}`;
  } else {
    uri = `${BASE_URL}/users/usersByFilter?popular=${popular}&country=${country}&pageNo=${pageNo}&pageSize=${pageSize}&lat,long=${lat},${long}`;
  }

  console.log(uri);
  const response = await fetch(uri, {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
  }).then(res => res.json());
  return response;
};

// DELETE user image  and story

export const api_userDeleteImageOrVideo = async payload => {
  const {itemName, token, userId, itemType} = payload;

  const uri = `${BASE_URL}/users/removePicOrVideo/${userId}`;

  console.log(uri);
  const response = await fetch(uri, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify({
      fileName: itemName,
      type: itemType,
    }),
  }).then(res => res.json());
  return response;
};

//USER ADD BANK DETAILS
export const api_userAddBankDetails = async payload => {
  const {accountNo, bankCode, token, userId} = payload;

  const uri = `${BASE_URL}/users/addBankDetail/${userId}`;
  const obj = {
    swiftCode: bankCode,
    accountNo: accountNo,
  };
  console.log(obj);
  const response = await fetch(uri, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify(obj),
  }).then(res => res.json());
  return response;
};

//REQUEST FOR  COIN REDEEM
export const api_redeemRequest = async payload => {
  const {token, userId} = payload;

  const uri = `${BASE_URL}/redeem/request`;
  const response = await fetch(uri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify({
      userId: userId,
    }),
  }).then(res => res.json());
  return response;
};
//REQUEST FOR  COIN REDEEM
export const api_getUsersRedeemStats = async payload => {
  const {token, userId} = payload;

  const uri = `${BASE_URL}/redeem/requestListByUserId/${userId}`;
  const response = await fetch(uri, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
  }).then(res => res.json());
  return response;
};

// FORGET PASSWORD
export const api_forgetPassword = async payload => {
  const {email} = payload;

  const uri = `${BASE_URL}/users/forgotPassword`;
  const response = await fetch(uri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
    }),
  }).then(res => res.json());
  return response;
};

//VERIFY OTP
export const api_verifyOtp = async payload => {
  const {otp, token} = payload;

  const uri = `${BASE_URL}/users/otpVerify`;
  const response = await fetch(uri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify({
      otp,
    }),
  }).then(res => res.json());
  return response;
};
//RECOVER PASSWORD
export const api_recoverPassword = async payload => {
  const {newPassword, token} = payload;

  const uri = `${BASE_URL}/users/changePassword`;
  const response = await fetch(uri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify({
      newPassword,
    }),
  }).then(res => res.json());
  return response;
};
//Get RANDOM USER's WITH IMAGE ARRAY
export const api_usersRandom = async payload => {
  const {pageSize, token} = payload;

  const uri = `${BASE_URL}/users/random?pageSize=${pageSize}`;
  console.log(uri);
  const response = await fetch(uri, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
  }).then(res => res.json());
  return response;
};

/* ===============================================================================
                          B L O C K
 ===============================================================================  */
// POST -> BLOCK

export const api_blockUser = async payload => {
  const {bodyData, authToken} = payload;
  console.log('block user ', payload);
  const uri = `${BASE_URL}/blocks/block`;
  const response = await fetch(uri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': authToken,
    },
    body: JSON.stringify(bodyData),
  }).then(res => {
    console.log(res);
    return res.json();
  });
  console.log(response, 'from block ');
  return response;
};
// // POST -> UNBLOCK
export const api_unblockUser = async payload => {
  console.log('unblock', payload);
  const {bodyData, authToken} = payload;
  const uri = `${BASE_URL}/blocks/unblock`;
  const response = await fetch(uri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': authToken,
    },
    body: JSON.stringify(bodyData),
  }).then(res => res.json());
  return response;
};
// // GET -> BLOCK LIST
export const api_getBlockUsers = async payload => {
  const {userId, authToken} = payload;
  const uri = `${BASE_URL}/blocks/list/${userId}`;
  const response = await fetch(uri, {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': authToken,
    },
  }).then(res => res.json());

  return response;
};

/* ===============================================================================
                           C H A T
 ===============================================================================  */

// GET -> Conversation List
export const api_conversationList = async payload => {
  const {userId, authToken} = payload;
  const uri = `${BASE_URL}/conversations/conversationList/${userId}`;

  const response = await fetch(uri, {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': authToken,
    },
  }).then(res => res.json());
  console.log({response});
  return response;
};
// GET ->  Old Chat
export const api_getOldChat = async payload => {
  const {authToken, conversationID, pageNo, pageSize} = payload;

  const uri = `${BASE_URL}/conversations/getOldConversations?conversationId=${conversationID}&pageNo=${pageNo}&pageSize=${pageSize}`;
  console.log(uri);
  const response = await fetch(uri, {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': authToken,
    },
  }).then(res => res.json());
  console.log({response});
  return response;
};

/* ===============================================================================
                           V I D E O    ---    C H A T
 ===============================================================================  */
// POST -> GENERATE_RTC_TOKEN
export const generate_rtcToken = async payload => {
  const {channelId, isPublisher, authToken} = payload;
  const uri = `${BASE_URL}/users/generateRtcToken`;

  const response = await fetch(uri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': authToken,
    },
    body: JSON.stringify({
      channelId,
      isPublisher,
    }),
  }).then(res => res.json());
  return response;
};

export const api_getVideoCallHistory = async payload => {
  const {userId, authToken} = payload;
  const uri = `${BASE_URL}/history/getByUserId/${userId}`;
  const response = await fetch(uri, {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': authToken,
    },
  }).then(res => res.json());
  return response;
};

/* ===============================================================================
                           N O T I F I C A T I O N  
 ===============================================================================  */
//  POST ->  send call invitation (TO SPECIFIC USER)
export const api_sendVideoCallInvitation = async payload => {
  const {token, data} = payload;
  const uri = `${BASE_URL}/notifications/sendCallNotification`;
  console.log(uri);
  const response = await fetch(uri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify(data),
  }).then(res => res.json());
  return response;
};

//  POST ->  send call invitation (TO RANDOM USER)
export const api_sendVideoCallInvitationToRandom = async payload => {
  const {token, data} = payload;
  const uri = `${BASE_URL}/notifications/random`;
  console.log(uri);
  const response = await fetch(uri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify(data),
  }).then(res => res.json());
  return response;
};

/* ===============================================================================
                           G I F T S       X       C O I N S
 ===============================================================================  */
// GET -> getGiftList
export const api_getGifts = async payload => {
  const {token} = payload;
  const uri = `${BASE_URL}/gifts/list`;
  const response = await fetch(uri, {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
  }).then(res => res.json());
  return response;
};

export const api_getMyGifts = async payload => {
  const {token, userId} = payload;
  const uri = `${BASE_URL}/gifts/myGifts/${userId}`;
  const response = await fetch(uri, {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
  }).then(res => res.json());
  return response;
};

// POST -> Gifts Buy
export const api_giftBuy = async payload => {
  const {token, body} = payload;
  const uri = `${BASE_URL}/gifts/buy`;
  const response = await fetch(uri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify(body),
  }).then(res => res.json());
  return response;
};

// GIFT SEND
export const api_giftSend = async payload => {
  const {token, body} = payload;
  const uri = `${BASE_URL}/gifts/send`;
  const response = await fetch(uri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify(body),
  }).then(res => res.json());
  return response;
};

// ---> COIN List
export const api_getCoins = async payload => {
  const {token} = payload;
  const uri = `${BASE_URL}/coins/list`;
  const response = await fetch(uri, {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
  }).then(res => res.json());
  return response;
};

// POST -> COIN Buy
export const api_coinBuy = async payload => {
  const {token, body} = payload;
  const uri = `${BASE_URL}/coins/buy`;
  const response = await fetch(uri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify(body),
  }).then(res => res.json());
  return response;
};

// GET -> USER COIN
export const api_getUserCoin = async payload => {
  const {token, userId} = payload;
  const uri = `${BASE_URL}/coins/myCoins/${userId}`;
  const response = await fetch(uri, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
  }).then(res => res.json());

  return response;
};

// POST -> COIN DEDUCT
export const api_coinDeduct = async payload => {
  const {token, body} = payload;
  const uri = `${BASE_URL}/coins/deduct`;
  const response = await fetch(uri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify(body),
  }).then(res => res.json());
  return response;
};

// FEEDBACK
export const api_sendFeedback = async payload => {
  const {token, userId, message} = payload;
  const uri = `${BASE_URL}/feedbacks/add`;
  const response = await fetch(uri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify({
      userId: userId,
      msg: message,
    }),
  }).then(res => res.json());
  return response;
};

// OFFERS
export const api_getDailyOffers = async payload => {
  const {token} = payload;
  const uri = `${BASE_URL}/coins/dailyOffers`;
  const response = await fetch(uri, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
  }).then(res => res.json());
  return response;
};
// USER REPORT
export const api_userReport = async payload => {
  const {token, otherUserId, userID, msg} = payload;
  const uri = `${BASE_URL}/reports/create`;
  const response = await fetch(uri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: {
      userId: userID,
      text: msg,
      reportBy: otherUserId,
    },
  }).then(res => res.json());
  return response;
};
