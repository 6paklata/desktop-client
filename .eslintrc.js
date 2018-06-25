module.exports = {
    "env": {
        "browser": true,
        "es6": true,
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 2017,
    },
    "plugins": [
        "html"
    ],
    "rules": {
        "no-console": "off",
        "no-trailing-spaces": ["error", {"skipBlankLines": false}],
        "no-unused-vars": ["error", { "args": "none" }],
    },
};
