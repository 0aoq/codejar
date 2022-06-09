export default {
    "language": {
        "name": "lua",
        "extentions": [".lua"],

        "variableKeywords": ["local"],
        "functionKeywords": ["function"],

        "variableSplit": "=", // the character or word that comes after variable names
        "functionSplit": "do" // the character or word that comes after the function names
    },

    "keywords": [
        // [KEYWORD, TYPE, DESCRIPTION]
        ["local", "keyword", "Define a variable"],
        ["function", "keyword", "Define a function"],
        ["return", "keyword", "Return code from a function"],
        ["end", "keyword", "End a function"],

        ["do", "keyword"],
        ["then", "keyword"],
        ["in", "keyword"],

        ["not", "keyword"],
        ["and", "keyword"],
        ["or", "keyword"],

        ["repeat", "keyword"],
        ["until", "keyword"],

        ["true", "keyword"],
        ["false", "keyword"],

        ["while", "keyword"],
        ["for", "keyword"],
        ["break", "keyword", "Stop a loop"],

        ["if", "keyword", "Create a conditional statement"],
        ["else", "keyword", "If opposite of conditional statement"],
        ["elseif", "keyword", "If another conditional statement if true instead"],

        ["nil", "keyword"]
    ],

    "snippets": [],
}