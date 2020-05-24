import {getRandomArrayItem} from "../utils/common.js";

const COMMENT_EMOTIONS = [
  `smile`,
  `sleeping`,
  `puke`,
  `angry`
];
const COMMENT_TEXTS = [
  `Interesting setting and a good cast`,
  `Booooooooooring`,
  `Very very old. Meh`,
  `Almost two hours? Seriously?`
];
const COMMENT_AUTHOR = [
  `Tim Macoveev`,
  `John Doe`,
  `Rincewind`,
  `Jon Snow`
];
const MOCK_COMMENT_DATES = [
  `2020-05-15T01:16:00`,
  `2020-04-15T23:55:00.930Z`,
  `2019-05-12T00:43:00.930Z`,
  `2020-03-15T08:28:00.930Z`
];
let index = 0;
export const generateComment = () => {
  return {
    id: String(++index),
    author: getRandomArrayItem(COMMENT_AUTHOR),
    comment: getRandomArrayItem(COMMENT_TEXTS),
    date: getRandomArrayItem(MOCK_COMMENT_DATES),
    emotion: getRandomArrayItem(COMMENT_EMOTIONS)
  };
};

export const generateComments = (count) => {
  return new Array(count).fill(``).map(generateComment);
};
