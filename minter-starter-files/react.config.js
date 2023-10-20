require("dotenv").config();
module.exports = {
  compilerOptions: {
    types: ["node"],
  },

  env: {
    REACT_APP_PINATA_KEY: process.env.REACT_APP_PINATA_KEY,
    REACT_APP_PINATA_SECRET: process.env.REACT_APP_PINATA_SECRET,
    REACT_APP_ALCHEMY_KEY: process.env.REACT_APP_ALCHEMY_KEY,
  },
  
};
