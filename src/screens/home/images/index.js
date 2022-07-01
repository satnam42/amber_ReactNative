import {Image} from 'react-native';

// const getRandomLoacalImage = (len = 4) => {
//   const arr = [];
//   for (let i = 0; i <= len; i++) {
//     const randomNum = Math.floor(Math.random() * len) + 1;
//     const url = `./r${randomNum}.jpg`;
// console.log(url, 'lllllll');
// const obj = Image.resolveAssetSource(require(`./r1.jpg`));
// const obj = Image.resolveAssetSource(require(url));
// const obj = Image.resolveAssetSource(require(`./r${randomNum}.jpg`));
// console.log(obj, 'image');
//     arr.push(url);
//   }
//   console.log(arr);
//   return arr;
// };
// export {getRandomLoacalImage};

const r1 = Image.resolveAssetSource(require('./r1.jpg'));
const r2 = Image.resolveAssetSource(require('./r2.jpg'));
const r3 = Image.resolveAssetSource(require('./r3.jpg'));
const r4 = Image.resolveAssetSource(require('./r4.jpg'));
const r5 = Image.resolveAssetSource(require('./r5.jpg'));
const r6 = Image.resolveAssetSource(require('./r6.jpg'));
const r7 = Image.resolveAssetSource(require('./r7.jpg'));
const r8 = Image.resolveAssetSource(require('./r8.jpg'));
const r9 = Image.resolveAssetSource(require('./r9.jpg'));
const r10 = Image.resolveAssetSource(require('./r10.jpg'));
const r11 = Image.resolveAssetSource(require('./r11.jpg'));
const r12 = Image.resolveAssetSource(require('./r12.jpg'));
const r13 = Image.resolveAssetSource(require('./r13.jpg'));
const r14 = Image.resolveAssetSource(require('./r14.jpg'));
const r15 = Image.resolveAssetSource(require('./r15.jpg'));
const r16 = Image.resolveAssetSource(require('./r16.jpg'));
const r17 = Image.resolveAssetSource(require('./r17.jpg'));
const r18 = Image.resolveAssetSource(require('./r18.jpg'));
const r19 = Image.resolveAssetSource(require('./r19.jpg'));
const r20 = Image.resolveAssetSource(require('./r20.jpg'));

const getRandomLoacalImage = (len = 4) => {
  const rArr = [r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13];
  let x = [];
  for (let i = 0; i <= len; i++) {
    const randomNum = Math.floor(Math.random() * rArr.length - 1) + 1;
    // console.log('random no', randomNum);
    x.push([...rArr].splice(randomNum, 1)[0]);
  }
  // console.log(rArr, 'rArr');
  // console.log(x, 'x');
  return x;
};
export {getRandomLoacalImage};
