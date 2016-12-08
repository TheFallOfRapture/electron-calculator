class Calculator {
    constructor(outputElement) {
        this.currentVal = 0;
        this.otherVal = null;
        this.outputElement = outputElement;
        this.currentOp = id;
        this.currentOpText = "";
        this.buttons = [];
        this.evaluated = true;
        this.decimalMode = false;
        this.positiveMode = true;
    }
    setCurrentOp(f) {
        this.currentOp = f;
    }
    evaluate() {
        console.log(this.currentOp + " $ " + this.currentVal + " " + this.otherVal);
        this.currentVal = this.currentOp(this.currentVal, this.otherVal);
        this.otherVal = 0;
        this.outputElement.innerHTML = this.currentVal.toString();
        this.currentOp = id;
        this.evaluated = true;
        this.decimalMode = false;
        this.positiveMode = true;
    }
    clear() {
        this.currentVal = 0;
        this.otherVal = null;
        this.currentOp = id;
        this.currentOpText = "";
        this.outputElement.innerHTML = "";
        this.evaluated = true;
        this.decimalMode = false;
        this.positiveMode = true;
    }
    addButton(button) {
        this.buttons.push(button);
    }
    addButtons(...buttons) {
        this.buttons = this.buttons.concat(buttons);
    }
    addButtonArray(buttons) {
        this.buttons = this.buttons.concat(buttons);
    }
    getButton(text) {
        return this.buttons.filter(x => x.text === text)[0];
    }
    getNumberButtons() {
        return this.buttons.filter(x => x instanceof NumberButton).map(x => x);
    }
    getOperatorButtons() {
        return this.buttons.filter(x => x instanceof OperatorButton).map(x => x);
    }
}
var id = (a, b) => a;
class CalculatorButton {
    constructor(text, calc, behavior, element) {
        this.text = text;
        this.behavior = behavior;
        this.element = element;
        this.element.addEventListener("click", () => behavior(calc));
    }
}
class NumberButton extends CalculatorButton {
    constructor(text, calc, element) {
        super(text, calc, (calc) => {
            if (calc.evaluated) {
                if (calc.decimalMode)
                    calc.currentVal = this.val / 10;
                else
                    calc.currentVal = this.val;
                calc.outputElement.innerHTML = calc.currentVal.toString();
                calc.evaluated = false;
            }
            else {
                if (calc.currentOp === id) {
                    if (calc.decimalMode)
                        calc.currentVal = appendDecimal(calc.currentVal, this.val, calc.positiveMode);
                    else
                        calc.currentVal = appendDigit(calc.currentVal, this.val, calc.positiveMode);
                    calc.outputElement.innerHTML = calc.currentVal.toString();
                }
                else {
                    if (calc.decimalMode)
                        calc.otherVal = appendDecimal(calc.otherVal, this.val, calc.positiveMode);
                    else
                        calc.otherVal = appendDigit(calc.otherVal, this.val, calc.positiveMode);
                    calc.outputElement.innerHTML = calc.currentVal + " " + calc.currentOpText + " " + calc.otherVal;
                }
            }
        }, element);
        this.val = Number.parseInt(text);
    }
}
class OperatorButton extends CalculatorButton {
    constructor(text, calc, operation, element) {
        super(text, calc, (calc) => {
            if (calc.currentOp === id) {
                calc.currentOp = operation;
                calc.outputElement.innerHTML += " " + this.text + " ";
                calc.evaluated = false;
            }
            else {
                if (!calc.otherVal) {
                    calc.currentOp = operation;
                    calc.outputElement.innerHTML = calc.currentVal + " " + this.text + " ";
                }
                else {
                    calc.evaluate();
                    calc.currentOp = operation;
                    calc.outputElement.innerHTML += " " + this.text + " ";
                    calc.evaluated = false;
                }
            }
            calc.currentOpText = this.text;
            calc.decimalMode = false;
            calc.positiveMode = true;
        }, element);
        this.operation = operation;
    }
}
function appendDigit(val, digit, positive) {
    const sign = positive ? 1 : -1;
    return (val * 10) + (digit * sign);
}
function numDecimals(x) {
    const decimalPart = x - Math.floor(x);
    console.log(decimalPart);
    if (decimalPart == 0)
        return 0;
    console.log(x);
    return 1 + numDecimals(x * 10);
}
function numDigits(x) {
    if (x == 0)
        return 0;
    return 1 + numDigits((x - x % 10) / 10);
}
function appendDecimal(val, digit, positive) {
    const sign = positive ? 1 : -1;
    return val + (digit / (Math.pow(10, numDecimals(val) + 1))) * sign;
}
function removeDigit(val) {
    return Math.floor(val / 10);
}
var toArray = (arr) => Array.prototype.slice.call(arr);
const calculator = new Calculator(document.getElementById("calc-output"));
console.log(calculator);
const numberButtons = toArray(document.getElementsByClassName("number-button"))
    .map((el) => {
    const text = el.innerHTML;
    const val = Number.parseInt(text);
    return new NumberButton(text, calculator, el);
});
function getOperator(text) {
    switch (text) {
        case "+":
            return (a, b) => a + b;
        case "-":
            return (a, b) => a - b;
        case "*":
            return (a, b) => a * b;
        case "/":
            return (a, b) => a / b;
        default:
            return id;
    }
}
const operatorButtons = toArray(document.getElementsByClassName("operator-button"))
    .map((el) => {
    const text = el.innerHTML;
    return new OperatorButton(text, calculator, getOperator(text), el);
});
const equalsButton = new CalculatorButton("=", calculator, (calc) => calc.evaluate(), document.getElementById("equals-button"));
const clearButton = new CalculatorButton("C", calculator, (calc) => {
    if (calc.currentOp === id) {
        calc.clear();
    }
    else {
        calc.otherVal = 0;
        calc.outputElement.innerHTML = calc.currentVal + " " + calc.currentOpText + " " + calc.otherVal;
    }
}, document.getElementById("clear-button"));
const clearAllButton = new CalculatorButton("CE", calculator, (calc) => calc.clear(), document.getElementById("clear-all-button"));
const backspaceButton = new CalculatorButton("<", calculator, (calc) => {
    if (calc.currentOp === id) {
        calc.currentVal = removeDigit(calc.currentVal);
        calc.outputElement.innerHTML = calc.currentVal.toString();
    }
    else {
        calc.otherVal = removeDigit(calc.otherVal);
        calc.outputElement.innerHTML = calc.currentVal + " " + calc.currentOpText + " " + calc.otherVal;
    }
}, document.getElementById("backspace-button"));
const plusOrMinusButton = new CalculatorButton("&plusmn;", calculator, (calc) => {
    var text = calculator.outputElement.innerHTML;
    if (calc.currentOp === id) {
        calc.currentVal = -calc.currentVal;
        calc.outputElement.innerHTML = calc.currentVal.toString();
    }
    else {
        calc.otherVal = -calc.otherVal;
        calc.outputElement.innerHTML = calc.currentVal + " " + calc.currentOpText + calc.otherVal;
    }
    calc.positiveMode = !calc.positiveMode;
}, document.getElementById("plus-or-minus-button"));
const decimalButton = new CalculatorButton(".", calculator, (calc) => {
    if (!calc.decimalMode) {
        if (calc.evaluated) {
            calc.currentVal = 0;
            calc.outputElement.innerHTML = 0 + ".";
        }
        else
            calc.outputElement.innerHTML += ".";
        calc.decimalMode = true;
    }
}, document.getElementById("decimal-button"));
calculator.addButtons(equalsButton, clearButton, backspaceButton, plusOrMinusButton);
calculator.addButtonArray(numberButtons);
calculator.addButtonArray(operatorButtons);
document.addEventListener("keydown", (e) => {
    const keyCode = e.keyCode;
    if (keyCode === 8) {
        calculator.getButton("<").behavior(calculator);
    }
});
document.addEventListener("keypress", (e) => {
    const keyCode = e.keyCode;
    console.log(keyCode);
    if (keyCode >= 48 && keyCode <= 57) {
        const num = e.keyCode - 48;
        calculator.getButton(num.toString()).behavior(calculator);
    }
    else {
        switch (keyCode) {
            case 42:
                calculator.getButton("*").behavior(calculator);
                break;
            case 43:
                calculator.getButton("+").behavior(calculator);
                break;
            case 45:
                calculator.getButton("-").behavior(calculator);
                break;
            case 47:
                calculator.getButton("/").behavior(calculator);
                break;
            case 13:
                calculator.getButton("=").behavior(calculator);
                break;
            case 61:
                calculator.getButton("=").behavior(calculator);
                break;
        }
    }
});
