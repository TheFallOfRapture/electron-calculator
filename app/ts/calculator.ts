class Calculator {
    currentVal : number
    otherVal : number
    outputElement : HTMLElement
    currentOp : (a : number, b : number) => number
    currentOpText : string

    constructor(outputElement : HTMLElement) {
        this.currentVal = 0
        this.otherVal = 0
        this.outputElement = outputElement
        this.currentOp = id
        this.currentOpText = ""
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
    }

    clear() : void {
        this.currentVal = 0
        this.otherVal = 0
        this.currentOp = id
        this.currentOpText = ""
        this.outputElement.innerHTML = ""
    }
}

function id(a : number, b : number) : number {
    return a
}

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
                if (calc.currentOp === id) {
                    calc.currentVal = appendDigit(calc.currentVal, this.val)
                    calc.outputElement.innerHTML += this.val
                } else {
                    calc.otherVal = appendDigit(calc.otherVal, this.val)
                    calc.outputElement.innerHTML += this.val
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
                } else {
                    calc.evaluate()
                    calc.currentOp = operation
                    calc.outputElement.innerHTML += " " + this.text + " "
                }

                calc.currentOpText = this.text

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
            return (a, b) => a
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
    (calc) => calc.clear(),
    document.getElementById("clear-button")
)

const backspaceButton : CalculatorButton = new CalculatorButton(
    "<",
    calculator,
    (calc) => {
        if (calc.currentOp === id)
            calc.currentVal = removeDigit(calc.currentVal)
        else
            calc.otherVal = removeDigit(calc.otherVal)

        var text = calc.outputElement.innerHTML
        calc.outputElement.innerHTML = text.substring(0, text.length - 1)
    },
    document.getElementById("backspace-button")
)

const plusOrMinusButton : CalculatorButton = new CalculatorButton(
    "&plusmn;",
    calculator,
    (calc) => {
        var text = calculator.outputElement.innerHTML

        if (calc.currentOp === id){
            calc.currentVal = -calc.currentVal
            calc.outputElement.innerHTML = calc.currentVal.toString()
        } else {
            calc.otherVal = -calc.otherVal
            calc.outputElement.innerHTML = calc.currentVal
                + " " + calc.currentOpText + calc.otherVal
        }
    },
    document.getElementById("plus-or-minus-button")
)

document.addEventListener("keypress", (e) => {
    console.log(e.keyCode)
})
