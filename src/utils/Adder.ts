import { AdderI, operationI } from '../interfaces/interfaces';

export const Adder = ({ scrollEnd, input, secInput, setParErr }: AdderI) => {

  let init: string[] = input.current.replace(/ /g,'').split("") // OK

  /// -----------> BEGIN NEGATIVE & FLOATING POINT PARSER <----------- ///

  let parsed: string[] = []

  init.forEach((e: string, i: number) => { // ADD 'N37' or '99' or '7.32' JOINED, ELSE PUSH x ALONE
    if (
      (init[i - 1] === "N" || init[i - 1] === "." || !isNaN(parseInt(init[i - 1], 10)) || init[i - 1] === "e" || (init[i - 2] === "e" && init[i - 1] === "+") || (init[i - 2] === "e" && init[i - 1] === "-")) &&
      (!isNaN(parseInt(e, 10)) || e === "." || e === "e" || (init[i - 1] === "e" && e === "+") || (init[i - 1] === "e" && e === "-"))
    ) parsed[parsed.length - 1] = parsed[parsed.length - 1].concat(e)
    else parsed.push(e)
  })

  parsed.forEach((e: string, i: number) => { // N95 => -1 * 95 => -95 // NEGATIVE PARSER
    if (e.slice(0, 1) === "N") parsed[i] = (-1 * parseFloat(e.slice(1, e.length))).toString()
  })

  /// -----------> END NEGATIVE & FLOATING POINT PARSER <----------- ///

  let openPar: number = -1; // OPEN PARENTHESIS FOUND, MOVING INDEX
  let closePar: number = -1; // CLOSE PARENTHESIS FOUND
  let toDo: string[] = []; // NEXT (OPERARION) TODO INSIDE PARENTHESIS
  let innerToDo: number = 0; // INNER OPERATION INSIDE toDo
  let index: number = 1; // WHILE LOOP INDEX

  const updateParenthesis = () => {

    openPar = parsed.indexOf(")") // OPEN PARENTHESIS FOUND, MOVING INDEX
    closePar = openPar; // CLOSED PARENTHESIS FOUND

    while (openPar !== -1) {
      if (parsed[openPar] === "(") break;
      else openPar--
    }

    if (openPar === -1 && closePar === -1 && (parsed.indexOf("x") !== -1 || parsed.indexOf("/") !== -1 || parsed.indexOf("+") !== -1 || parsed.indexOf("-") !== -1)) {
      parsed.unshift("(") // ADD PARENTHESIS AT BEGINNING // TODO
      parsed.push(")") // ADD PARENTHESIS AT END // TODO
      openPar = 0;
      closePar = parsed.length - 1
    }

    if (openPar !== -1 && closePar !== -1) { // FOUND OPEN & CLOSE TAG
      toDo = parsed.splice(openPar, closePar - (openPar - 1)) // Extract toDo from Main (init)
      toDo.splice(0, 1) // Delete open ( ToDo
      toDo.splice(-1, 1) // Delete close ) ToDo
    }
    else if (openPar === -1 && closePar !== -1) { // STOP IF INNER PARENTHESIS ARE BAD POSITIONED
      setParErr(true); return
      //console.log("ERROR PARENTHESIS")
    }
  }

  updateParenthesis()

  if (openPar === -1 && closePar !== -1) { // STOP IF INNER PARENTHESIS ARE BAD POSITIONED
    setParErr(true); scrollEnd(); return
    //console.log("ERROR PARENTHESIS")
  }

  let foundMul: number = -1;
  let foundDiv: number = -1;
  let firOp: string | undefined;

  let opOne: operationI = { // OPERATION ONE ==> x OR /
    'x': (a, b) => { return parseFloat(a) * parseFloat(b) },
    '/': (a, b) => { return parseFloat(a) / parseFloat(b) }
  };

  let foundPlus: number = -1;
  let foundMin: number = -1;
  let secOp: string | undefined;

  let opTwo: operationI = { // OPERATION TWO ==> + OR -
    '+': (a: string, b: string) => { return parseFloat(a) + parseFloat(b) },
    '-': (a: string, b: string) => { return parseFloat(a) - parseFloat(b) }
  };

  const updateOperators = () => { // firOp & secOp
    foundMul = toDo && toDo.indexOf("x") // UPDATE x INDEX
    foundDiv = toDo && toDo.indexOf("/") // UPDATE / INDEX
    if (foundMul < foundDiv && foundMul > 0 || foundMul > 0 && foundDiv === -1) firOp = "x"
    if (foundDiv < foundMul && foundDiv > 0 || foundDiv > 0 && foundMul === -1) firOp = "/"
    if (foundMul === -1 && foundDiv === -1) firOp = undefined;

    foundPlus = toDo && toDo.indexOf("+") // UPDATE + INDEX
    foundMin = toDo && toDo.indexOf("-") // UPDATE - INDEX
    if (foundPlus < foundMin && foundPlus > 0 || foundPlus > 0 && foundMin === -1) secOp = "+" // update + or - found
    if (foundMin < foundPlus && foundMin > 0 || foundMin > 0 && foundPlus === -1) secOp = "-" // update + or - found
    if (foundPlus === -1 && foundMin === -1) secOp = undefined;
  }

  updateOperators()

  while (parsed.length !== 1) {
    updateOperators() // MULTI, DIV, PLUS & MINUS

    if (toDo !== undefined && // DO ALL x OR /
      toDo[index - 1] !== undefined &&
      !isNaN(parseFloat(toDo[index - 1])) &&
      toDo[index] === firOp &&
      !isNaN(parseFloat(toDo[index + 1]))
    ) {
      innerToDo = opOne[firOp](toDo[index - 1], toDo[index + 1])

      let firSign = toDo[index - 1].toString().slice(0,1) === '-' ? -1 : 1
      let secSign = toDo[index + 1].toString().slice(0,1) === '-' ? -1 : 1

      if (innerToDo.toString() === "NaN") innerToDo = firSign * secSign * Infinity

      toDo.splice(index - 1, 3)
      toDo.splice(index - 1, 0, innerToDo.toString())
      index = 1
    }
    else if (toDo !== undefined && // DO ALL + OR -
      firOp === undefined &&
      toDo[index - 1] !== undefined &&
      !isNaN(parseFloat(toDo[index - 1])) &&
      toDo[index] === secOp &&
      !isNaN(parseFloat(toDo[index + 1]))
    ) {
      innerToDo = opTwo[secOp](toDo[index - 1], toDo[index + 1])

      let firSign = toDo[index - 1].toString().slice(0,1) === '-' ? '-' : '+'
      let secSign = toDo[index + 1].toString().slice(0,1) === '-' ? '-' : '+'

      if (innerToDo.toString() === "NaN") {
        if (firSign === '-' && secOp !== secSign) innerToDo = -Infinity
        else innerToDo = Infinity
      }

      toDo.splice(index - 1, 3)
      toDo.splice(index - 1, 0, innerToDo.toString())
      index = 1
    }

    else index++

    updateOperators() // firOp & secOp

    if (toDo !== undefined && parsed.length !== 1 && firOp === undefined && secOp === undefined && toDo.length !== 1) {
      parsed.splice(openPar, 0, innerToDo.toString())
      updateParenthesis()
      updateOperators()
      index = 1
    }
    else if (toDo !== undefined && toDo.length === 1) {
      parsed.splice(openPar, 0, toDo[0])
      updateParenthesis()
      if (openPar === -1 && closePar !== -1) { // STOP IF INNER PARENTHESIS ARE BAD POSITIONED
        //console.log("ERROR PARENTHESIS")
        setParErr(true); scrollEnd(); return
      }
      updateOperators()
      index = 1
    }
  }

  let rawToArray = parsed[0].toString().split("") // parsed[0] CAN BE NUMBER OR STRING // parseFloat REMOVES EXTRA 00
  let prefix = rawToArray[0] // FILTER "-" (IF EXISTS)
  let prevMinus =
    rawToArray[0] === "-" ?
    rawToArray.slice(1, rawToArray.length) :
    rawToArray
  let isScientific = prevMinus.includes("e")
  let dotIndex = prevMinus.indexOf(".")
  let intLength =
    !isScientific && prevMinus.indexOf(".") !== -1 ?
    prevMinus.slice(0, dotIndex).length :
    !isScientific && prevMinus.indexOf(".") === -1 ?
    prevMinus.length :
    undefined
  let spacesLeft = intLength && 12 - intLength // TO COMPLETE 12 SPACES
  let spacesAfterE =
    prevMinus.indexOf("+") !== -1 ?
    prevMinus.slice(prevMinus.indexOf("+") + 1) :
    prevMinus.indexOf("-") !== -1 ?
    prevMinus.slice(prevMinus.indexOf("-") + 1) :
    []
  let result // result always as [ "A", "R", "R", "A", "Y" ] // FINAL RESULT

  if (prevMinus.join("") === "Infinity") result = prevMinus // RESULT IS INFINITY

  else if (intLength !== undefined && intLength > 12) { // LARGE INT
    let slice2 = prevMinus.slice(0, 8)
    let largeRefInt
    for (let i = 7; i >= 0 ; i--) {
      if (slice2[i] !== "0" && slice2[i] !== undefined) { largeRefInt = i; break }
    }
    result = (parseFloat(parseFloat(prevMinus.join("")).toExponential(largeRefInt))).toExponential().split("")
  }

  // SMALL INT
  else if (intLength !== undefined && intLength < 13) result = parseFloat(parseFloat(prevMinus.join("")).toFixed(spacesLeft)).toString().split("")

  // NUMBER IS IN SCIENTIFIC NOTATION
  else result = parseFloat(parseFloat(prevMinus.join("")).toExponential(9 - spacesAfterE.length)).toString().split("")

  if (prefix === "-") result?.splice(0,0,"N") // NEGATIVE PARSER

  secInput.current = input.current
  input.current = result?.join("")

  //console.log(result?.join("")) // FINAL RESULT
}