// provide autocompletion for the codejar editor

import * as cursor from "../cursor.js"
import { CodeJarWindow } from "../codejar.js"

type Options = {
    class: 'codejar-autocomplete' | string
    width: '400px' | string
    backgroundColor: 245 | any
    backgroundDarker?: 238 | any // backgroundColor - 7
    modalPadding: '4px' | string
    itemPadding: '4px 2rem' | string
    maxKeywords: 10 | number
}

let _options: Options | any
let [modal, list, descriptionField]: [any, any, any] = [null, null, null]
let modalVisible = false
let currentLanguageData: any = []

/**
 * Set the current language
 * @param {string} language
 */
export function setLanguage(language: string) {
    if (!CodeJarWindow.languages) return
    hideModal()
    currentLanguageData = CodeJarWindow.languages[language].default
}

/**
 * Create an auto complete item
 * @param {string} keyword - the keyword to create an item for
 * @param {string} type - keyword, function, etc
 * @param {HTMLElement} list - the list to append the item to 
 */
function createItem(options: { name?: string, keyword: string, type: string, description: string, isPartial: boolean }, list: HTMLElement) {
    options.keyword = options.keyword.replace("<", "&lt;")
    options.keyword = options.keyword.replace(">", "&gt;")

    let icon = `<svg xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            class="feather feather-box"
            style="width: 1rem; height: 1rem; margin-top: 0.05rem;"
        >
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
        </svg>`

    if (options.type === "function") {
        icon = `<svg xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            class="feather feather-box"
            style="width: 1rem; height: 1rem; margin-top: 0.05rem;"
        >
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>`
    } else if (options.type === "variable") {
        icon = `<svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            class="feather feather-hexagon"
            style="width: 1rem; height: 1rem; margin-top: 0rem;"
        >
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        </svg>`
    }

    // add a description
    if (options.description) {
        descriptionField.style.display = 'block'
        descriptionField.innerText = options.description
    } else {
        descriptionField.style.display = 'none'
    }

    list.innerHTML += `<li data-keyword="${options.keyword.replace("&lt;", "<").replace("&gt;", ">")}" data-type="${options.type}" 
    class="${_options.class}-list-item" data-description="${options.description || ""}" data-is-partial="${options.isPartial ? "true" : "false"}" 
    data-name="${options.name || options.keyword}">
        <span class="codejar-keyword-container" style="display: flex;">
            <span class="codejar-keyword-icon">${icon}</span>
            <span class="codejar-keyword">${options.name || options.keyword}</span>
            <span class="codejar-keyword-type">[${options.type}]</span>
        </span>
    </li>`

    return list.lastElementChild // return this item
}

let currentVariables: any = [] // keeps track of all variables
let variableNames: any = [] // keeps track of all VALID variable names

/**
 * Handle autocomplete matches
 * @param {string} input 
 * @param {HTMLElement} list 
 */
function matchAutocomplete(input: string, list: HTMLElement) {
    if (input === '') {
        modal.style.display = 'none'
        modalVisible = false
        return
    }

    (() => {
        // handle snippet match
        if (!currentLanguageData.snippets) return
        const _matches = currentLanguageData.snippets.filter((snippet: any) => {
            const regex = new RegExp(`${input}`)
            return regex.test(snippet[0])
        })

        for (let snippet of _matches) {
            // [name, text, description]
            createItem({
                name: snippet[0],
                keyword: snippet[1],
                description: snippet[2],
                isPartial: false,
                type: "snippet",
            }, list)
        }
    })();

    (() => {
        // handle variable match
        if (!currentVariables) return

        let identifiedVariables: any = [] // keeps track of all variables we already matched
        
        const _matches = currentVariables.filter((variable: any) => {
            const regex = new RegExp(`${input}`)
            return regex.test(variable.name[0])
        })

        for (let variable of _matches) {
            // [name, text, description]
            if (!identifiedVariables.includes(variable.name) && variableNames.includes(variable.name)) {
                createItem(variable, list)
                identifiedVariables.push(variable.name)
            }
        }
    })();

    // normal keyword matching
    const matches = currentLanguageData.keywords.filter((keyword: any) => {
        const regex = new RegExp(`${input}`)
        return regex.test(keyword[0])
    })

    if (matches.length === 0) {
        hideModal()
        return
    }

    let keywordsMatched = 0

    for (let keyword of matches) {
        // [text, type, description, isPartial, name]
        if (keywordsMatched >= _options.maxKeywords) break
        keywordsMatched++

        const item = createItem({
            name: keyword[4],
            keyword: keyword[0],
            type: keyword[1],
            description: keyword[2],
            isPartial: keyword[3] || false
        }, list)

        item?.addEventListener('click', () => {
            currentItem = item
            submitItem(null)
            hideModal()
        })
    }
}

/**
 * Initialize the autocomplete modal
 * @param {Partial<Options>} options 
 */
export function init(options: Partial<Options> = {}) {
    _options = {
        class: 'codejar-autocomplete',
        width: '400px',
        backgroundColor: 245,
        modalPadding: '2px',
        itemPadding: '4px 8px',
        maxKeywords: 10, // will help to improve performance by not loading too many keywords at once
        ...options
    }

    if (_options.altbackground) _options.backgroundColor = _options.altbackground

    let backgroundColor = (_options.backgroundColor)
    let backgroundDarker = (_options.backgroundColor - 7)
    let textColor = (255 - backgroundColor)

    _options.backgroundDarker = backgroundDarker
    _options.backgroundColor = `rgb(${backgroundColor}, ${backgroundColor}, ${backgroundColor})`
    _options.backgroundDarker = `rgb(${backgroundDarker}, ${backgroundDarker}, ${backgroundDarker})`

    if (backgroundColor < 127.5) textColor = (255 - backgroundColor)
    else textColor = 0

    const borderColor = (backgroundDarker - 20)

    if (CodeJarWindow.CodeJar && CodeJarWindow.CodeJar.parentElement) {
        CodeJarWindow.CodeJar.parentElement.insertAdjacentHTML('beforeend', `<style id="codejar-autocomlete-styles">
            .codejar-modal {\nposition: absolute;\nz-index: 20;\n}
            .${_options.class} {
                display: none;
                width: ${_options.width};
                background-color: ${_options.backgroundColor};
                border: 1px solid rgb(${borderColor}, ${borderColor}, ${borderColor});
                border-radius: 4px;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
                padding: ${_options.modalPadding};
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                font-size: 12px;
                color: rgb(${textColor}, ${textColor}, ${textColor})
            }
            
            .${_options.class} .${_options.class}-list {
                display: block;\nlist-style: none;\noverflow: hidden;\nmax-height: 300px;
                padding: 0.5rem 0;\ngap: 0.2rem;
            }
            .${_options.class} .${_options.class}-list-item {
                display: flex;\npadding: ${_options.itemPadding};\nborder-radius: 4px;
                transition: all 0.08s ease-in-out;\noutline: 1px solid transparent;
                cursor: pointer;\nwidth: 95%;\nmargin: 0 auto; color: rgb(${textColor}, ${textColor}, ${textColor})
            }
            .${_options.class} .${_options.class}-list-item.selected {
                background-color: ${_options.backgroundDarker};
                outline: 1px solid rgb(${borderColor}, ${borderColor}, ${borderColor});
            }
            .${_options.class} .${_options.class}-list-item span.codejar-keyword {
                margin-left: 12px;
                margin-bottom: 0.2rem;
            }

            .codejar-keyword-type {\nopacity: 0.25;\nmargin-left: 1.2rem;\n
            .codejar-keyword {\nopactiy: 0.5;\n}
            .codejar-keyword-container {\ndisplay: flex;\n}

            .${_options.class}-description {\n/opacity: 0.5;\nbackground-color: ${_options.backgroundDarker};\n}
        `)
    }

    // create an auto complete modal
    const _modal = document.createElement("div")
    _modal.classList.add("codejar-modal", _options.class)
    document.body.appendChild(_modal)

    // create an auto complete list
    const _list = document.createElement("ul")
    _list.classList.add(`${_options.class}-list`)
    _modal.appendChild(_list)

    // create an auto complete description field
    const _descriptionField = document.createElement("div")
    _descriptionField.classList.add(`${_options.class}-description`)
    _descriptionField.style.opacity = '0.5'
    _descriptionField.style.backgroundColor = _options.backgroundDarker
    _descriptionField.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.2)'
    _descriptionField.style.padding = "4px 8px"
    _descriptionField.style.marginTop = '0.5rem'
    _descriptionField.style.borderRadius = '4px'
    _descriptionField.style.border = `1px solid rgb(${borderColor}, ${borderColor}, ${borderColor})`
    _modal.appendChild(_descriptionField)

    // assign the modal to a global variable
    modal = _modal

    // return
    return [_modal, _list, _descriptionField]
}

// listeners
let editor: any
let currentWord: string = ""
let currentItem: HTMLElement | any = null

let eventListenerFunctions: any[] = []

// helper functions
function removeEmpty(array: any[]): any[] {
    let newArray = []

    for (let i = 0; i < array.length; i++) {
        if (array[i] !== undefined && array[i].length > 0) newArray.push(array[i])
    }

    return newArray
}

function replaceOn(string: string, index: number, replacement: string) {
    return string.substring(0, index) + replacement + string.substring(index + replacement.length)
}

const hideModal = () => {
    currentItem = null
    currentWord = ""

    modalVisible = false
    modal.style.display = "none"
}

const showModal = () => {
    modal.style.display = "block"
    modalVisible = true
}

function replaceLast(input: string, pattern: string, value: string) {
    const lastIndex = input.lastIndexOf(pattern)
    if (lastIndex < 0) return input
    return input.substring(0, lastIndex) + value + input.substring(lastIndex + pattern.length)
}

/**
 * Submit the current item
 */
const submitItem = (e: KeyboardEvent | null) => {
    if (currentItem) {
        if (!CodeJarWindow.setContent || !CodeJarWindow.saveCursor || !CodeJarWindow.restoreCursor) return
        if (e) e.preventDefault()

        // if the character after the cursor is \n, return
        // if (cursor.textAfterCursor(editor).startsWith('\n')) return

        // handle text insertion
        let position: any = CodeJarWindow.saveCursor()

        let keyword = currentItem.getAttribute('data-keyword')
        const type = currentItem.getAttribute('data-type')

        const text = cursor.textBeforeCursor(editor)
        let lines = text.split("\n")
        let lastLine = lines[lines.length - 1]

        for (let i = 0; i < lines.length; i++) {
            // remove all empty/whitespace lines
            if (lines[i] === "\t") delete lines[i]
            if (lines[i]) lines[i] = lines[i].replace("\t", "")
        }

        lines = removeEmpty(lines) // remove whitespace characters from lines
        lastLine = lines[lines.length - 1]

        let split = lastLine.split(" ")

        for (let i = 0; i < split.length; i++) {
            // remove all empty/whitespace words
            if (split[i] === "" || split[i] === "\t") delete split[i]
            else split[i] = split[i].replace("\t", "")
        }

        let lastValue = split[split.length - 1]
        if (!lastValue || !lastLine) return null
        
        delete split[split.length - 1]

        let newLine = lastLine

        if (type === "function") {
            keyword += "()"
        }

        // handle inside parenthesis
        let requireFunctionOpen = false
        if (lastValue.indexOf("(") !== -1) {
            // if there is no space between the value and a (
            lastValue = replaceLast(lastValue, lastValue.split("(")[0], "")
            if (lastValue.indexOf("(") !== -1) lastValue = lastLine.split("(")[1]
            requireFunctionOpen = true
        }

        // replace
        newLine = replaceLast(newLine, `${requireFunctionOpen ? "(" : ""}${lastValue}`, keyword)
        const newText = replaceOn(text, text.lastIndexOf(lastLine), newLine)

        // add to editor
        CodeJarWindow.setContent(newText + cursor.textAfterCursor(editor))

        // replace cursor
        position.start = (newText.length - 1) + 1
        position.end = (newText.length - 1) + 1
        CodeJarWindow.restoreCursor(position)

        // reset currentItem
        currentItem = null
        position = null
        hideModal()
    }
}

/**
 * Event listener for autocomplete suggestions
 * @param {KeyboardEvent} e 
 */
const currentWordListener = (e: KeyboardEvent) => {
    // event
    eventListenerFunctions.push(() => {
        // if the last character in cursor.textBeforeCursor is whitespace or a tab, return
        const _textBefore = cursor.textBeforeCursor(editor)
        if (!_textBefore) return
        const _lastCharacter = _textBefore[_textBefore.length - 1]
        if (_lastCharacter.length <= 0 || /* _lastCharacter === '\t' || */ _lastCharacter === '\n') return

        // handle actions
        if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown' && e.key !== 'Enter' && e.key !== 'Tab') {
            if (e.key === 'Backspace' || e.key === 'Space') return hideModal()
            const text = cursor.textBeforeCursor(editor)
            const lastWord = text.split(/[^a-zA-Z.]+/g).pop()
            if (text[text.length - 1] !== " " && lastWord) currentWord = lastWord

            list.innerHTML = ""
            matchAutocomplete(currentWord, list);

            (() => {
                // automatically select the first item in the list
                const items = list.querySelectorAll(`.${_options.class}-list-item`)
                if (items.length < 1) return hideModal()

                currentItem = null
                currentItem = items[0]
                if (currentItem) currentItem.classList.add('selected')
            })();

            // find all variable words and then get the word directly after them
            (() => {
                if (!currentLanguageData.language.variableKeywords || !currentLanguageData.language.functionKeywords) return

                const handleType = (line: string, keyword: string, isFunction: boolean) => {
                    // this is a very temporary solution: if the line is not just the variable it will not work
                    const split = line.split(keyword)
                    if (split[0] !== "" || !split[1]) return // if split[0] is anything but "" then it isn't a match

                    const variableName = split[1]
                        .split(currentLanguageData.language.variableSplit)[0].trim()
                        .split(currentLanguageData.language.functionSplit)[0]

                    currentVariables.push({
                        name: variableName, // get the variable name without everything past "="
                        keyword: variableName,
                        isPartial: false,
                        description: `Defined on line ${editor.innerText.split("\n").indexOf(line) + 1}`,
                        type: isFunction === false ? "variable" : "function"
                    })

                    variableNames.push(variableName)
                }

                for (let line of editor.innerText.split("\n")) {
                    for (let keyword of currentLanguageData.language.variableKeywords) handleType(line, keyword, false)
                    for (let keyword of currentLanguageData.language.functionKeywords) handleType(line, keyword, true)
                }
            })();
        } else {
            const items = list.querySelectorAll(`.${_options.class}-list-item`)
            if (items.length > 0 && modalVisible ) {
                e.preventDefault()
                if (e.key === 'ArrowUp') {
                    if (currentItem) {
                        currentItem.classList.remove('selected')
                        if (currentItem.previousElementSibling) {
                            currentItem = currentItem.previousElementSibling
                            currentItem.classList.add('selected')
                        } else {
                            currentItem = items[items.length - 1]
                            currentItem.classList.add('selected')
                        }
                    } else {
                        currentItem = items[items.length - 1]
                        currentItem.classList.add('selected')
                    }
                } else if (e.key === 'ArrowDown') {
                    if (currentItem) {
                        currentItem.classList.remove('selected')
                        if (currentItem.nextElementSibling) {
                            currentItem = currentItem.nextElementSibling
                            currentItem.classList.add('selected')
                        } else {
                            currentItem = items[0]
                            currentItem.classList.add('selected')
                        }
                    } else {
                        currentItem = items[0]
                        currentItem.classList.add('selected')
                    }
                } else if (e.key === 'Enter' || e.key === 'Tab') submitItem(e)
                else hideModal() // hide modal whenever any other key is pressed

                // update description field
                if (currentItem) {
                    const description = currentItem.getAttribute("data-description")
                    if (description !== "") {
                        descriptionField.innerHTML = description
                        descriptionField.style.display = "block"
                    } else {
                        descriptionField.style.display = "none"
                    }
                }
            }
        }
    })

    // run last function in the array
    eventListenerFunctions[eventListenerFunctions.length - 1]()
}

/**
 * Event listener for hiding the autocomplete modal
 */
const clickListener = () => {
    eventListenerFunctions.push(() => {
        modal.style.display = "none"
        modalVisible = false
    })

    // run last function in the array
    eventListenerFunctions[eventListenerFunctions.length - 1]()
}

/**
 * Event listener for hiding the autocomplete modal
 */
const blurListener = () => {
    eventListenerFunctions.push(() => {
        modal.style.display = "none"
        modalVisible = false
    })

    // run last function in the array
    eventListenerFunctions[eventListenerFunctions.length - 1]()
}

/**
 * Start the auto complete modal
 * @returns {HTMLElement} the modal
 */
export function autoCompleteText(options?: Partial<Options>) {
    // remove all listeners from the editor
    for (let listener of eventListenerFunctions) {
        editor.removeEventListener('keydown', listener)
        editor.removeEventListener('click', listener)
        editor.removeEventListener('blur', listener)
        eventListenerFunctions = []
    }

    editor = CodeJarWindow.CodeJar

    if (!modal || !list) {
        [modal, list, descriptionField] = init(options)
    }

    const cursorPosition = cursor.cursorPosition()
    if (!cursorPosition) return

    modal.style.top = cursorPosition.top
    modal.style.left = cursorPosition.left
    showModal()

    // handle current word
    editor.addEventListener('keydown', currentWordListener)

    // hide modal on click or blur
    editor.addEventListener('click', clickListener, { passive: true })
    editor.addEventListener("blur", blurListener, { passive: true })
}

/**
 * Remove the autocomplete dialog and its options
 */
export function destroy(options?: any) {
    if (!modal) return
    document.getElementById("codejar-autocomlete-styles")?.remove()

    for (let element of document.getElementsByClassName("codejar-autocomplete") as any) {
        element.remove()
    }

    if (options) { // automatically restart
        [modal, list, descriptionField] = init(options)
    }
}

setTimeout(() => {
    editor = CodeJarWindow.CodeJar
    setLanguage("javascript")

    editor.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === 'Tab') {
            submitItem(e)
            modalVisible = false
            modal.style.display = "none"
        }
    })
}, 100);