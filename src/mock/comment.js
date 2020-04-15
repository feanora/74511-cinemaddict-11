import {getRandomArrayItem} from "../util.js";

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
  `2019-12-05T14:44:55.559Z`,
  `2020-02-28T08:28:00.929Z`,
  `2020-04-15T08:28:00.930Z`,
  `2020-04-16T02:09:13.015Z`,
];

export const generateComment = () => {
  return {
    emoji: getRandomArrayItem(COMMENT_EMOTIONS),
    text: getRandomArrayItem(COMMENT_TEXTS),
    author: getRandomArrayItem(COMMENT_AUTHOR),
    day: getRandomArrayItem(MOCK_COMMENT_DATES)
  };
};

export const generateComments = (count) => {
  return new Array(count).fill(``).map(generateComment);
};
