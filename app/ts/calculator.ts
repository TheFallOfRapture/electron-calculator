class Calculator {
    currentVal : number
    otherVal : number
    outputElement : HTMLElement
    currentOp : (a : number, b : number) => number
    currentOpText : string
    buttons : CalculatorButton[]
    evaluated : boolean
    decimalMode : boolean

    constructor(outputElement : HTMLElement) {
        this.currentVal = 0
        this.otherVal = null
        this.outputElement = outputElement
        this.currentOp = id
        this.currentOpText = ""
        this.buttons = []
        this.evaluated = true
        this.decimalMode = false
    }

    setCurrentOp(f : (a : number) => number) : void {
        this.currentOp = f
    }

    evaluate() : void {
        console.log(this.currentOp + " $ " + this.currentVal + " " + this.otherVal)
        this.currentVal = this.currentOp(this.currentVal, this.otherVal)
        this.otherVal = 0
        this.outputElement.innerHTML = this.currentVal.toString()
        this.currentOp = id
        this.evaluated = true
        this.decimalMode = false
    }

    clear() : void {
        this.currentVal = 0
        this.otherVal = null
        this.currentOp = id
        this.currentOpText = ""
        this.outputElement.innerHTML = ""
        this.decimalMode = false
    }

    addButton(button : CalculatorButton) {
        this.buttons.push(button)
    }

    addButtons(...buttons : CalculatorButton[]) {
        this.buttons = this.buttons.concat(buttons)
    }

    addButtonArray(buttons : CalculatorButton[]) {
        this.buttons = this.buttons.concat(buttons)
    }

    getButton(text : string) {
        return this.buttons.filter(x => x.text === text)[0]
    }

    getNumberButtons() : NumberButton[] {
        return this.buttons.filter(x => x instanceof NumberButton).map(x => <NumberButton>x)
    }

    getOperatorButtons() : OperatorButton[] {
        return this.buttons.filter(x => x instanceof OperatorButton).map(x => <OperatorButton>x)
    }
}

var id = (a : number, b : number) => a

interface ICalculatorButton {
    text : string,
    behavior : (calc : Calculator) => void,
    element : HTMLElement
}

class CalculatorButton implements ICalculatorButton {
    text : string
    behavior : (calc : Calculator) => void
    element : HTMLElement

    constructor(text : string, calc : Calculator, behavior : (calc : Calculator) => void, element : HTMLElement) {
        this.text = text
        this.behavior = behavior
        this.element = element

        this.element.addEventListener("click", () => behavior(calc))
    }
}

class NumberButton extends CalculatorButton {
    text : string
    behavior : (calc : Calculator) => void
    element : HTMLElement
    val : number

    constructor(text : string, calc : Calculator, element : HTMLElement) {
        super(
            text,
            calc,
            (calc : Calculator) => {
                if (calc.evaluated) {
                    if (calc.decimalMode)
                        calc.currentVal = this.val / 10
                    else
                        calc.currentVal = this.val

                    calc.outputElement.innerHTML = calc.currentVal.toString()
                    calc.evaluated = false
                } else {
                    if (calc.currentOp === id) {
                        if (calc.decimalMode)
                            calc.currentVal = appendDecimal(calc.currentVal, this.val)
                        else
                            calc.currentVal = appendDigit(calc.currentVal, this.val)

                        calc.outputElement.innerHTML = calc.currentVal.toString()
                    } else {
                        if (calc.decimalMode)
                            calc.otherVal = appendDecimal(calc.otherVal, this.val)
                        else
                            calc.otherVal = appendDigit(calc.otherVal, this.val)

                        calc.outputElement.innerHTML = calc.currentVal + " " + calc.currentOpText + " " + calc.otherVal
                    }
                }

                console.log(calc.currentVal)
            },
            element
        )
        this.val = Number.parseInt(text)
    }
}

class OperatorButton extends CalculatorButton {
    text : string
    behavior : (calc : Calculator) => void
    element : HTMLElement
    operation : (a : number, b : number) => number

    constructor(
        text : string,
        calc : Calculator,
        operation : (a : number, b : number) => number,
        element : HTMLElement
     ) {
        super(
            text,
            calc,
            (calc : Calculator) => {
                if (calc.currentOp === id) {
                    calc.currentOp = operation
                    calc.outputElement.innerHTML += " " + this.text + " "
                    calc.evaluated = false
                } else {
                    if (!calc.otherVal) {
                        calc.currentOp = operation
                        calc.outputElement.innerHTML = calc.currentVal + " " + this.text + " "
                    } else {
                        calc.evaluate()
                        calc.currentOp = operation
                        calc.outputElement.innerHTML += " " + this.text + " "
                        calc.evaluated = false
                    }
                }

                calc.currentOpText = this.text
                calc.decimalMode = false

                console.log(calc.currentOp)
            },
            element
        )
        this.operation = operation
    }
}

function appendDigit (val : number, digit : number) : number {
    return (val * 10) + digit
}

function appendDecimal (val : number, digit : number) : number {
    const numDigits = Math.floor(Math.log10(val || 1)) + 1
    return val + (digit / (Math.pow(10, numDigits)))
}

function removeDigit(val : number) {
    return Math.floor(val / 10)
}

var toArray : (arr : any) => any[] = (arr) => Array.prototype.slice.call(arr)

const calculator = new Calculator(document.getElementById("calc-output"))
console.log(calculator)

const numberButtons : NumberButton[]
    = toArray(document.getElementsByClassName("number-button"))
    .map((el) => {
        const text : string = el.innerHTML
        const val : number = Number.parseInt(text)
        return new NumberButton(
            text,
            calculator,
            el)
    })

function getOperator(text : string) : (a : number, b : number) => number {
    switch (text) {
        case "+":
            return (a, b) => a + b
        case "-":
            return (a, b) => a - b
        case "*":
            return (a, b) => a * b
        case "/":
            return (a, b) => a / b
        default:
            return id
    }
}

const operatorButtons : OperatorButton[]
    = toArray(document.getElementsByClassName("operator-button"))
    .map((el) => {
        const text : string = el.innerHTML
        return new OperatorButton(
            text,
            calculator,
            getOperator(text),
            el
        )
    })

const equalsButton : CalculatorButton = new CalculatorButton(
    "=",
    calculator,
    (calc) => calc.evaluate(),
    document.getElementById("equals-button")
)

const clearButton : CalculatorButton = new CalculatorButton(
    "C",
    calculator,
    (calc) => {
        if (calc.currentOp === id) {
            calc.clear()
        } else {
            calc.otherVal = 0
            calc.outputElement.innerHTML = calc.currentVal + " " + calc.currentOpText + " " + calc.otherVal
        }
    },
    document.getElementById("clear-button")
)

const clearAllButton : CalculatorButton = new CalculatorButton(
    "CE",
    calculator,
    (calc) => calc.clear(),
    document.getElementById("clear-all-button")
)

const backspaceButton : CalculatorButton = new CalculatorButton(
    "<",
    calculator,
    (calc) => {
        if (calc.currentOp === id) {
            calc.currentVal = removeDigit(calc.currentVal)
            calc.outputElement.innerHTML = calc.currentVal.toString()
        } else {
            calc.otherVal = removeDigit(calc.otherVal)
            calc.outputElement.innerHTML = calc.currentVal + " " + calc.currentOpText + " " + calc.otherVal
        }
    },
    document.getElementById("backspace-button")
)

const plusOrMinusButton : CalculatorButton = new CalculatorButton(
    "&plusmn;",
    calculator,
    (calc) => {
        var text = calculator.outputElement.innerHTML

        if (calc.currentOp === id) {
            calc.currentVal = -calc.currentVal
            calc.outputElement.innerHTML = calc.currentVal.toString()
        } else {
            calc.otherVal = -calc.otherVal
            calc.outputElement.innerHTML = calc.currentVal + " " + calc.currentOpText + calc.otherVal
        }
    },
    document.getElementById("plus-or-minus-button")
)

const decimalButton : CalculatorButton = new CalculatorButton(
    ".",
    calculator,
    (calc) => {
        if (!calc.decimalMode) {
            if (calc.evaluated) {
                calc.currentVal = 0
                calc.outputElement.innerHTML = 0 + "."
            } else
                calc.outputElement.innerHTML += "."

            calc.decimalMode = true
        }
    },
    document.getElementById("decimal-button")
)

calculator.addButtons(equalsButton, clearButton, backspaceButton, plusOrMinusButton)
calculator.addButtonArray(numberButtons)
calculator.addButtonArray(operatorButtons)

document.addEventListener("keydown", (e) => {
    const keyCode = e.keyCode
    if (keyCode === 8) {
        calculator.getButton("<").behavior(calculator)
    }
})

document.addEventListener("keypress", (e) => {
    const keyCode = e.keyCode
    console.log(keyCode)
    if (keyCode >= 48 && keyCode <= 57) {
        const num = e.keyCode - 48
        calculator.getButton(num.toString()).behavior(calculator)
    } else {
        switch (keyCode) {
            case 42:
                calculator.getButton("*").behavior(calculator)
                break
            case 43:
                calculator.getButton("+").behavior(calculator)
                break
            case 45:
                calculator.getButton("-").behavior(calculator)
                break
            case 47:
                calculator.getButton("/").behavior(calculator)
                break
            case 13:
                calculator.getButton("=").behavior(calculator)
                break
            case 61:
                calculator.getButton("=").behavior(calculator)
                break
        }
    }
})
