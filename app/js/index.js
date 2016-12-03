const BrowserWindow = require("electron").remote.BrowserWindow
const path = require("path")
const dialog = require("electron").remote.dialog
let win

const newWindowButton = document.getElementById("new-window-button")
const focusWindowButton = document.getElementById("focus-window-button")

newWindowButton.addEventListener("click", (event) => {
    win = new BrowserWindow({width: 1024, height: 768})
    win.on("close", () => {
        hideFocusButton()
        win = null
    })
    win.on("move", updateReply)
    win.on("resize", updateReply)
    win.on("focus", hideFocusButton)
    win.on("blur", showFocusButton)
    win.webContents.on("crashed", () => {
        const options = {
            type: "info",
            title: "Renderer Process Crashed",
            message: "This process has crashed.",
            buttons: ["Reload", "Close"]
        }

        dialog.showMessageBox(options, (index) => {
            if (index === 0) {
                win.reload()
            } else {
                win.close()
            }
        })
    })
    win.on("unresponsive", () => {
        const options = {
            type: "info",
            title: "Renderer Process Hanging",
            message: "This process is hanging.",
            buttons: ["Reload", "Close"]
        }

        dialog.showMessageBox(options, (index) => {
            if (index === 0) {
                win.reload()
            } else {
                win.close()
            }
        })
    })

    win.loadURL(`file://${__dirname}/../html/other.html`)

    function updateReply() {
        const messageElement = document.getElementById("window-message")
        const message = `Size: ${win.getSize()}, Position: ${win.getPosition()}`
        messageElement.innerHTML = message
    }

    function showFocusButton() {
        if (!win) return

        focusWindowButton.classList.add("smooth-appear")
        focusWindowButton.classList.remove("disappear")
        focusWindowButton.addEventListener("click", () => win.focus())
    }

    function hideFocusButton() {
        focusWindowButton.classList.add("disappear")
        focusWindowButton.classList.remove("smooth-appear")
    }

    win.show()
})

function buttonClick() {
    alert("Have some blue text!")
    var paragraphs = Array.prototype.slice.call(document.getElementsByTagName('p'))
    paragraphs.forEach(el => el.style.color = "#2196F3")
    document.getElementById('firstP').style.cursor = "pointer"
}

function changeTitleColor() {
    document.getElementById('titleText').innerHTML = "Click the first paragraph!"
    document.getElementById('firstP').style.cursor = "pointer"
}

function changeToRed(id) {
    id.style.color = "red"
    document.getElementById('firstButton').style.color = "#2196F3"
    document.getElementById('firstP').style.cursor = "auto"
}

function mul(a, b) {
    return a * b
}

function mul3(a, b, c) {
    return a * b * c
}


function partial2(f, a) {
    return function (b) {
        return f(a, b)
    }
}

function partial3(f) {
    console.log(arguments.length)
    if (arguments.length == 2) {
        const a = arguments[1]
        return function (b, c) {
            return f(a, b, c)
        }
    } else if (arguments.length == 3) {
        const a = arguments[1]
        const b = arguments[2]
        return function (c) {
            return f(a, b, c)
        }
    }
}


var toArray = (args) => Array.prototype.slice.call(args)

function partial(f) {
    const args = Array.prototype.slice.call(arguments, 1)

    return function() {
        return f.apply(this, args.concat(Array.prototype.slice.call(arguments, 0)))
    }
}

const times2 = partial(mul, 2)

console.log(times2(3))
