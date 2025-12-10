const portSmall = '17.6%';
const portLarge = '22.5%';
const land = `${92/7}%`;
const marginLand = '1%';
const marginPort = '2%';

export let portButtons: any[] = [
  { button: "(", size: portSmall, margin: marginPort, small: true }, { button: ")", size: portSmall, margin: marginPort, small: true }, { button: "C", size: portSmall, margin: marginPort, small: true },
  { button: "N", size: portSmall, margin: marginPort, small: true }, { button: "B", size: portSmall, margin: marginPort, small: true }, { button: "7", size: portLarge, margin: marginPort },
  { button: "8", size: portLarge, margin: marginPort }, { button: "9", size: portLarge, margin: marginPort }, { button: "X", size: portLarge, margin: marginPort },
  { button: "4", size: portLarge, margin: marginPort }, { button: "5", size: portLarge, margin: marginPort }, { button: "6", size: portLarge, margin: marginPort },
  { button: "-", size: portLarge, margin: marginPort }, { button: "1", size: portLarge, margin: marginPort }, { button: "2", size: portLarge, margin: marginPort },
  { button: "3", size: portLarge, margin: marginPort }, { button: "+", size: portLarge, margin: marginPort }, { button: "/", size: portLarge, margin: marginPort },
  { button: "0", size: portLarge, margin: marginPort }, { button: ".", size: portLarge, margin: marginPort }
]

export let landButtons: any[] = [
  { button: "(", size: land, margin: marginLand }, { button: ")", size: land, margin: marginLand }, { button: "C", size: land, margin: marginLand }, // hyphen // en dash // em dash
  { button: "N", size: land, margin: marginLand }, { button: "B", size: land, margin: marginLand }, { button: "-", size: land, margin: marginLand }, // - – —
  { button: "X", size: land, margin: marginLand }, { button: "5", size: land, margin: marginLand }, { button: "6", size: land, margin: marginLand },
  { button: "7", size: land, margin: marginLand }, { button: "8", size: land, margin: marginLand }, { button: "9", size: land, margin: marginLand },
  { button: "/", size: land, margin: marginLand }, { button: "+", size: land, margin: marginLand }, { button: "0", size: land, margin: marginLand },
  { button: "1", size: land, margin: marginLand }, { button: "2", size: land, margin: marginLand }, { button: "3", size: land, margin: marginLand },
  { button: "4", size: land, margin: marginLand }, { button: ".", size: land, margin: marginLand }
]