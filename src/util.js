export const getRandomNumber = (max, min = 0) => {
  return Math.round(Math.random() * (max - min) + min);
};

export const getRandomFloatNumber = (digit, max, min = 0) => {
  return Number((Math.random() * (max - min) + min).toFixed(digit));
};

export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomNumber(array.length - 1, 0);
  return array[randomIndex];
};

export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const getNewLengthArray = (array, maxArrayLength, minArrayLength = 1) => {
  let newArray = [];
  let newArrayLength = getRandomNumber(maxArrayLength, minArrayLength);
  for (let i = 0; i < newArrayLength; i++) {
    newArray[i] = array[i];
  }
  return newArray;
};

export const getBooleanValue = () => Math.random() > 0.5;

export const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours() % 12);
  const minutes = castTimeFormat(date.getMinutes());
  return `${hours}:${minutes}`;
};
