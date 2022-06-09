export default {
    "language": {
        "name": "javascript",
        "extentions": [".js", ".jsx"],

        "variableKeywords": ["const", "var", "let"],
        "functionKeywords": ["function"],

        "variableSplit": "=", // the character or word that comes after variable names
        "functionSplit": "(" // the character or word that comes after the function names
    },

    "keywords": [
        // [KEYWORD, TYPE, DESCRIPTION]
        ["const", "keyword", "Create a constant variable (const name = value)"],
        ["let", "keyword", "Create a variable (let name = value)"],
        ["var", "keyword", "Create a variable (var name = value)"],
        ["function", "keyword", "Create a function (function name(parameters) { code })"],
        ["if", "keyword", "Create an if statement (if (condition) { code })"],
        ["else", "keyword", "Create an else statement (if (condition) { code } else { code })"],
        ["for", "keyword", "Create a for loop (for (let i = 0; i < 10; i++) { code })"],
        ["while", "keyword", "Create a while loop (while (condition) { code })"],
        ["switch", "keyword", "Create a switch statement (switch (condition) { case value: code; break; })"],
        ["case", "keyword", "Create a case statement (switch (condition) { case value: code; break; })"],
        ["break", "keyword", "Create a break statement (switch (condition) { case value: code; break; })"],
        ["return", "keyword", "Create a return statement (return value)"],
        ["true", "keyword"],
        ["false", "keyword"],
        ["null", "keyword"],
        ["undefined", "keyword"],
        ["NaN", "keyword"],
        ["Infinity", "keyword"],
        ["console", "keyword"],
        ["document", "keyword"],
        ["window", "keyword"],
        ["location", "keyword"],
        ["history", "keyword"],
        ["navigator", "keyword"],
        ["screen", "keyword"],
        ["alert", "function", "Display an alert box"],
        ["prompt", "function", "Display a prompt box"],
        ["confirm", "function", "Display a confirm box"],
        ["console.log", "function", "Log a message to the console"],
        ["console.warn", "function", "Log a warning to the console"],
        ["console.error", "function", "Log an error to the console"],
        ["console.info", "function", "Log an info message to the console"],
        ["console.debug", "function", "Log a debug message to the console"],
        ["console.clear", "function", "Clear the console"],
        ["document.getElementById", "function", "Get an element by id"],
        ["document.getElementsByClassName", "function", "Get elements by class name"],
        ["document.getElementsByTagName", "function", "Get elements by tag name"],
        ["document.getElementsByName", "function", "Get elements by name"],
        ["document.getElementsByTagNameNS", "function", "Get elements by namespace and tag name"],
        ["document.createElement", "function", "Create an element"],
        ["document.createTextNode", "function", "Create a text node"],
        ["document.createComment", "function", "Create a comment"],
        ["document.createDocumentFragment", "function", "Create a document fragment"],
        ["document.createEvent", "function", "Create an event"],
        ["document.createRange", "function", "Create a range"],
        ["document.createElementNS", "function", "Create an element with a namespace"],
        ["document.createAttribute", "function", "Create an attribute"],
        ["document.createAttributeNS", "function", "Create an attribute with a namespace"],
        ["document.createEventObject", "function", "Create an event object"],
        ["document.createExpression", "function", "Create an expression"],
        ["document.createNSResolver", "function", "Create a namespace resolver"],
        ["document.createProcessingInstruction", "function", "Create a processing instruction"],
        ["document.importNode", "function", "Import a node"],
        ["document.adoptNode", "function", "Adopt a node"],
        ["addEventListener", "function", "Add an event listener"],
        ["removeEventListener", "function", "Remove an event listener"],
        ["dispatchEvent", "function", "Dispatch an event"],
        ["attachEvent", "function", "Attach an event"],
        ["detachEvent", "function", "Detach an event"],
        ["element.addEventListener", "function", "Add an event listener"],
        ["element.removeEventListener", "function", "Remove an event listener"],
        ["element.dispatchEvent", "function", "Dispatch an event"],
        ["element.attachEvent", "function", "Attach an event"],
        ["element.detachEvent", "function", "Detach an event"],
        ["element.getAttribute", "function", "Get an attribute"],
        ["element.getAttributeNS", "function", "Get an attribute with a namespace"],
        ["element.setAttribute", "function", "Set an attribute"],
        ["element.setAttributeNS", "function", "Set an attribute with a namespace"],
        ["element.removeAttribute", "function", "Remove an attribute"],
        ["element.removeAttributeNS", "function", "Remove an attribute with a namespace"],
        ["element.hasAttribute", "function", "Check if an attribute exists"],
        ["element.hasAttributeNS", "function", "Check if an attribute with a namespace exists"],
        ["element.getAttributeNode", "function", "Get an attribute node"],
        ["element.getAttributeNodeNS", "function", "Get an attribute node with a namespace"],
        ["element.setAttributeNode", "function", "Set an attribute node"],
        ["element.setAttributeNodeNS", "function", "Set an attribute node with a namespace"],
        ["element.removeAttributeNode", "function", "Remove an attribute node"],
        ["element.getElementsByTagName", "function", "Get elements by tag name"],
        ["element.getElementsByTagNameNS", "function", "Get elements by namespace and tag name"],
        ["element.getElementsByClassName", "function", "Get elements by class name"],
        ["element.getElementsByName", "function", "Get elements by name"]
    ],

    "snippets": [],
}