// provide autocompletion for the codejar editor

import * as cursor from "./cursor.js"
import { CodeJarWindow } from "./codejar.js"

type Options = {
    class: 'codejar-autocomplete' | string
    width: '400px' | string
    backgroundColor: 'rgb(245, 245, 245)' | string
    backgroundDarker: 'rgb(238, 238, 238)' | string
    modalPadding: '4px' | string
    itemPadding: '4px 2rem' | string
}

let _options: Options
let [modal, list, descriptionField]: [any, any, any] = [null, null, null]
let modalVisible = false
let currentLanguageData: any[] = []
// let currentLanguage = 'javascript'

/**
 * Set the current language
 * @param {string} language
 */
function setLanguage(language: string) {
    if (!CodeJarWindow.languages) return
    currentLanguageData = CodeJarWindow.languages[language].default.keywords
}

/**
 * Create an auto complete item
 * @param {string} keyword - the keyword to create an item for
 * @param {string} type - keyword, function, etc
 * @param {HTMLElement} list - the list to append the item to 
 */
function createItem(keyword: string, type: string = '', description: string, isPartial: boolean, list: HTMLElement) {
    keyword = keyword.replace("<", "&lt;")
    keyword = keyword.replace(">", "&gt;")

    const _item = document.createElement("li")
    _item.classList.add(`${_options.class}-list-item`)
    _item.innerHTML = `<span class="codejar-keyword">${keyword}</span><span class="codejar-keyword-type">[${type}]</span>`

    _item.setAttribute("data-keyword", keyword.replace("&lt;", "<").replace("&gt;", ">"))
    _item.setAttribute("data-type", type)
    _item.setAttribute("data-description", description || "")
    _item.setAttribute("data-is-partial", isPartial ? "true" : "false")

    list.appendChild(_item)

    // add a description
    if (description) {
        descriptionField.style.display = 'block'
        descriptionField.innerText = description
    } else {
        descriptionField.style.display = 'none'
    }
}

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

    const matches = currentLanguageData.filter(keyword => {
        const regex = new RegExp(`${input}`)
        return regex.test(keyword[0])
    })

    if (matches.length === 0) {
        modal.style.display = 'none'
        modalVisible = false
        return
    }

    for (let keyword of matches) {
        createItem(keyword[0], keyword[1], keyword[2], keyword[3], list)
    }
}

/**
 * Initialize the autocomplete modal
 * @param {Partial<Options>} options 
 */
function init(options: Partial<Options> = {}) {
    _options = {
        class: 'codejar-autocomplete',
        width: '400px',
        backgroundColor: 'rgb(245, 245, 245)',
        backgroundDarker: 'rgb(238, 238, 238)',
        modalPadding: '4px',
        itemPadding: '4px 8px',
        ...options
    }

    if (CodeJarWindow.CodeJar && CodeJarWindow.CodeJar.parentElement) {
        CodeJarWindow.CodeJar.parentElement.insertAdjacentHTML('beforeend', `<style>
            .codejar-modal {\nposition: absolute;\nz-index: 20;\n}
            .${_options.class} {
                display: none;
                width: ${_options.width};
                background-color: ${_options.backgroundColor};
                border: 1px solid #ccc;
                border-radius: 4px;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
                padding: ${_options.modalPadding};
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                font-size: 12px;
            }
            
            .${_options.class} .${_options.class}-list {
                display: block;\nlist-style: none;\noverflow: hidden;\nmax-height: 300px;
                padding: 0.5rem 0;\ngap: 0.2rem;
            }
            .${_options.class} .${_options.class}-list-item {
                display: block;\npadding: ${_options.itemPadding};\nborder-radius: 4px;
                transition: all 0.08s ease-in-out;\noutline: 0 solid #ccc;
                cursor: pointer;\nwidth: 95%;\nmargin: 0 auto;
            }
            .${_options.class} .${_options.class}-list-item.selected {
                background-color: ${_options.backgroundDarker};
                outline: 1px solid #ccc;
            }

            .codejar-keyword-type {\nopacity: 0.25;\nmargin-left: 1.2rem;\n
            .codejar-keyword {\nopactiy: 0.5;\n}

            .${_options.class}-description {\nopacity: 0.5;\nbackground-color: ${_options.backgroundDarker};\n}
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
    _descriptionField.style.border = '1px solid #ccc'
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

/**
 * Submit the current item
 */
const submitItem = (e: KeyboardEvent) => {
    if (currentItem) {
        if (!CodeJarWindow.setContent || !CodeJarWindow.saveCursor || !CodeJarWindow.restoreCursor) return
        e.preventDefault()
        const position = CodeJarWindow.saveCursor()

        let keyword = currentItem.getAttribute('data-keyword')
        const type = currentItem.getAttribute('data-type')
        
        const text = cursor.textBeforeCursor(editor)
        let lines =  text.split("\n")
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
        delete split[split.length - 1]

        let newLine = lastLine

        if (type === "function") {
            keyword += "()"
        }

        newLine = newLine.replace(lastValue, keyword)
        const newText = replaceOn(text, text.lastIndexOf(lastLine), newLine)

        // add to editor
        CodeJarWindow.setContent(newText + cursor.textAfterCursor(editor))

        // replace cursor
        position.start = (newText.length - 1) + 1
        position.end = (newText.length - 1) + 1
        CodeJarWindow.restoreCursor(position)

        // reset currentItem
        currentItem = null
        currentWord = ""

        modalVisible = false
        modal.style.display = "none"
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
        const _lastCharacter = _textBefore[_textBefore.length - 1]
        if (_lastCharacter.length <= 0 || _lastCharacter === '\t' || _lastCharacter === '\n') return

        // handle actions
        if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown' && e.key !== 'Enter' && e.key !== 'Tab' && !currentItem) {
            const text = cursor.textBeforeCursor(editor)
            const lastWord = text.split(/[^a-zA-Z.]+/g).pop()
            if (text[text.length - 1] !== " " && lastWord) currentWord = lastWord

            list.innerHTML = ""
            matchAutocomplete(currentWord, list)
        } else {
            const items = list.querySelectorAll(`.${_options.class}-list-item`)
            if (items.length > 0 && modalVisible) {
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
                } else if (e.key === 'Enter' || e.key === 'Tab') {
                    submitItem(e)
                } else if (e.key === "Escape") {
                    modalVisible = false
                    modal.style.display = "none"
                    currentItem = null
                }

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
export function autoCompleteText() {
    // remove all listeners from the editor
    for (let listener of eventListenerFunctions) {
        editor.removeEventListener('keydown', listener)
        editor.removeEventListener('click', listener)
        editor.removeEventListener('blur', listener)
        eventListenerFunctions = []
    }

    editor = CodeJarWindow.CodeJar

    if (!modal || !list) {
        [modal, list, descriptionField] = init()
    }

    const cursorPosition = cursor.cursorPosition()
    if (!cursorPosition) return

    modal.style.top = cursorPosition.top
    modal.style.left = cursorPosition.left
    modal.style.display = "block"
    modalVisible = true

    // handle current word
    editor.addEventListener('keydown', currentWordListener)

    // hide modal on click or blur
    editor.addEventListener('click', clickListener, { passive: true })
    editor.addEventListener("blur", blurListener, { passive: true })
}

setTimeout(() => {
    editor = CodeJarWindow.CodeJar
    setLanguage("html")

    editor.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === 'Tab') {
            submitItem(e)
            modalVisible = false
            modal.style.display = "none"
        }
    })
}, 100);