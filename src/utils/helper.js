import AsyncStorage from '@react-native-async-storage/async-storage';

// STORE
export const toLocalStorage = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // saving error
    return e;
  }
};

// GET
export const fromLocalStorage = async key => {
  try {
    const res = await AsyncStorage.getItem(key);
    return JSON.parse(res);
  } catch (e) {
    return e;
  }
};
// REMOVE
export const deleteFromLocalStorage = async key => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    return e;
  }
};

// -------------------
export const generateNameAvatar = (name = '--') => {
  const firstWord = name[0];
  const lastWord = name[name.length - 1];
  let fullWord = `${firstWord}${lastWord}`;
  fullWord = fullWord.toUpperCase();
  return fullWord;
};

export const getAgeByDob = dob => {
  const year = new Date().getFullYear() - new Date(dob).getFullYear();
  return year;
};

export const convertHMS = value => {
  const sec = parseInt(value, 10); // convert value to number if it's string
  let hours = Math.floor(sec / 3600); // get hours
  let minutes = Math.floor((sec - hours * 3600) / 60); // get minutes
  let seconds = sec - hours * 3600 - minutes * 60; //  get seconds
  // add 0 if value < 10; Example: 2 => 02
  if (hours < 10) {
    hours = '0' + hours;
  }
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  if (seconds < 10) {
    seconds = '0' + seconds;
  }
  return hours + ':' + minutes + ':' + seconds; // Return is HH : MM : SS
};
