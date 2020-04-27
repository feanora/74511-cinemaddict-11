import {getRandomNumber, getUserRating} from "../utils/common.js";

const USER_AVATAR_PATH = `./images/bitmap@2x.png`;

export const generateUserProfile = () => {
  return {
    rating: getUserRating(getRandomNumber(100)),
    avatar: USER_AVATAR_PATH
  };
};
