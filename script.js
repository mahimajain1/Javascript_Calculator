class Calculator {
    constructor(currentElement, previousElement) {
      this.currentElementDisplay = currentElement;
      this.previousElementDisplay = previousElement;
      this.clearAll();
    }
    clearAll() {
      this.currentElement = "0";
      this.previousElement = " ";
      this.operation = undefined;
    }
    deleteOne() {
      this.currentElement = this.currentElement.toString().slice(0, -1);
    }
    formatNumber(n) {
      return n.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    }
    updateDisplay() {
      this.currentElementDisplay.innerText = this.formatNumber(
        this.currentElement
      );
      this.previousElementDisplay.innerText = this.formatNumber(
        this.previousElement
      );
    }
    splitNumbersFromOperation() {
      let firstNum;
      let secondNum;
      // if the (-) sign is the first, add it to first num
      if (
        this.currentElement.toString()[0] === "-" &&
        this.currentElement.split(this.operation).length > 2
      ) {
        firstNum = this.currentElement.split(this.operation)[1];
        firstNum = "-".concat(firstNum);
        secondNum = this.currentElement.split(this.operation)[2];
      } else {
        firstNum = this.currentElement.split(this.operation)[0];
        secondNum = this.currentElement.split(this.operation)[1];
      }
      return [firstNum, secondNum];
    }
  
    concatDisplay(input) {
      // set a limit for the input screen
      if (this.currentElement.length > 18) return;
      let [firstNum, secondNum] = this.splitNumbersFromOperation();
      if (!secondNum) {
        secondNum = 0;
      }
      const operationRegex = /\-|\+|x|÷/;
      // if the first or the second num has more than one dot and the dot is pressed, skip
      if (
        (firstNum.toString().split(".").length > 1 &&
          !this.operation &&
          input.toString() === ".") ||
        (secondNum.toString().split(".").length > 1 && input.toString() === ".")
      )
        return;
      // if there is no number but 0, remove it
      if (
        this.currentElement === "0" &&
        input.toString() != "." &&
        !input.toString().match(operationRegex)
      ) {
        this.currentElement = " ";
      }
  
      this.currentElement = this.currentElement
        .toString()
        .concat(input.toString());
    }
    manageOperation(operation) {
      // if there is a current operation, compute the current input
      if (this.operation) {
        this.compute();
      }
      this.concatDisplay(operation);
      this.operation = operation;
    }
    compute() {
      let result;
      // split the current element based on the operation
      const firstNum = parseFloat(this.splitNumbersFromOperation()[0]);
      const secondNum = parseFloat(this.splitNumbersFromOperation()[1]);
      // if user did not enter both numbers
      if (isNaN(firstNum) || isNaN(secondNum)) {
        return;
      }
      // if division is by zero
      if (this.operation === "÷" && secondNum === 0) {
        alert("Please do not divide by 0");
        this.clearAll();
        return;
      }
      switch (this.operation) {
        case "+":
          result = firstNum + secondNum;
          break;
        case "-":
          result = firstNum - secondNum;
          break;
        case "x":
          result = firstNum * secondNum;
          break;
        case "÷":
          result = firstNum / secondNum;
          break;
        default:
          return;
      }
      // remove insignificant zeroes
      result = parseFloat(result.toFixed(6));
      this.previousElement = this.currentElement.toString();
      this.currentElement = result.toString();
      this.operation = undefined;
    }
  }
  
  // Retrieve elements
  const numberBtn = document.querySelectorAll(".number");
  const operationBtn = document.querySelectorAll(".operation");
  const decimalBtn = document.querySelector(".decimal");
  const equalsBtn = document.querySelector(".equals");
  const clearBtn = document.querySelector(".clear-all");
  const deleteBtn = document.querySelector(".delete-one");
  const previousElementDisplay = document.querySelector(".previous-element");
  const currentElementDisplay = document.querySelector(".current-element");
  
  const calculator = new Calculator(
    currentElementDisplay,
    previousElementDisplay
  );
  
  clearBtn.addEventListener("click", () => {
    calculator.clearAll();
    calculator.updateDisplay();
  });
  
  deleteBtn.addEventListener("click", () => {
    calculator.deleteOne();
    calculator.updateDisplay();
  });
  
  numberBtn.forEach((number) => {
    number.addEventListener("click", () => {
      calculator.concatDisplay(number.innerText);
      calculator.updateDisplay();
    });
  });
  
  decimalBtn.addEventListener("click", () => {
    calculator.concatDisplay(decimalBtn.innerText);
    calculator.updateDisplay();
  });
  
  operationBtn.forEach((operation) => {
    operation.addEventListener("click", () => {
      calculator.manageOperation(operation.innerText);
      calculator.updateDisplay();
    });
  });
  
  equalsBtn.addEventListener("click", () => {
    calculator.compute();
    calculator.updateDisplay();
  });