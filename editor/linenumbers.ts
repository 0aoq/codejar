type Options = {
  class: string
  wrapClass: string
  width: string
  backgroundColor: string
  color: string
}

export function withLineNumbers(
  highlight: (e: HTMLElement) => void,
  options: Partial<Options> = {}
) {
  const opts: Options = {
    class: "codejar-linenumbers",
    wrapClass: "codejar-wrap",
    width: "35px",
    backgroundColor: "rgba(128, 128, 128, 0.15)",
    color: "",
    ...options
  }

  let lineNumbers: HTMLElement
  return function (editor: HTMLElement) {
    highlight(editor)

    if (!lineNumbers) {
      lineNumbers = init(editor, opts)
      editor.addEventListener("scroll", () => lineNumbers.style.top = `-${editor.scrollTop}px`);
    }

    const code = editor.textContent || ""
    const linesCount = code.split(/\r\n|\r|\n/).length + (code.endsWith('\r') || code.endsWith('\n') ? 0 : 1)

    let text = ""
    for (let i = 1; i < linesCount; i++) {
      text += `${i}\r\n`
    }

    lineNumbers.innerText = text
  }
}

function init(editor: HTMLElement, opts: Options): HTMLElement {
  const css = getComputedStyle(editor)

  const wrap = document.createElement("div")
  wrap.className = opts.wrapClass
  wrap.style.position = "relative"
  wrap.style.setProperty("overflow-x", "auto")
  wrap.style.setProperty("overflow-y", "auto")
  wrap.style.setProperty("resize", "vertical")

  const gutter = document.createElement("div")
  gutter.className = opts.class
  wrap.appendChild(gutter)

  // Add own styles
  gutter.style.position = "absolute"
  gutter.style.top = "0px"
  gutter.style.left = "0px"
  gutter.style.bottom = "0px"
  gutter.style.width = opts.width
  gutter.style.overflow = "hidden"
  gutter.style.backgroundColor = opts.backgroundColor
  gutter.style.color = opts.color || css.color
  gutter.style.setProperty("mix-blend-mode", "difference")

  // Copy editor styles
  gutter.style.fontFamily = css.fontFamily
  gutter.style.fontSize = css.fontSize
  gutter.style.lineHeight = css.lineHeight
  gutter.style.paddingTop = css.paddingTop
  gutter.style.paddingLeft = css.paddingLeft
  gutter.style.borderTopLeftRadius = css.borderTopLeftRadius
  gutter.style.borderBottomLeftRadius = css.borderBottomLeftRadius

  // Add line numbers
  const lineNumbers = document.createElement("div");
  lineNumbers.style.position = "relative";
  lineNumbers.style.top = "0px"
  lineNumbers.style.overflow = "unset"
  lineNumbers.style.setProperty("user-select", "none")
  gutter.appendChild(lineNumbers)

  // Tweak editor styles
  editor.style.paddingLeft = `calc(${opts.width} + ${gutter.style.paddingLeft})`
  editor.style.whiteSpace = "pre"
  editor.style.setProperty("overflow-x", "unset")
  editor.style.setProperty("overflow-y", "unset")
  editor.style.setProperty("resize", "none")
  editor.style.setProperty("min-height", "100%")

  // Swap editor with a wrap
  editor.parentNode!.insertBefore(wrap, editor)
  wrap.appendChild(editor)
  return lineNumbers
}
