module.exports = {
  root: true,
  extends: '@react-native-community',
  "plugins": [
    "react",
    "react-native"
  ],
  "parserOptions": {
    "ecmaFeatures": {
        "jsx": true
    }
  },
  "env": {
    "react-native/react-native": true
  },
  "rules": {
    "prettier/prettier": 0,
    "quotes": [0, "double"],
    "semi": [0, "never"],
    "react-native/no-unused-styles": 2,
    "react-native/split-platform-components": 2,
    "react-native/no-inline-styles": 2,
    "react-native/no-color-literals": 2,
    "react-native/no-raw-text": 2,
    "react-native/no-single-element-style-arrays": 2,
    "no-trailing-spaces": "off",
    "keyword-spacing": "off",
    "space-infix-ops": "off",
    "react/self-closing-comp": "off",
    "comma-dangle": "off",
  }
};
