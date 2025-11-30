const portSmall = '17.6%';
const portLarge = '22.5%';
const land = `${92/7}%`;
const marginLand = '1%';
const marginPort = '2%';

export let portButtons: any[] = [
  { value: "(", size: portSmall, margin: marginPort, small: true }, { value: ")", size: portSmall, margin: marginPort, small: true }, { value: "C", size: portSmall, margin: marginPort, small: true },
  { value: "N", size: portSmall, margin: marginPort, small: true }, { value: "B", size: portSmall, margin: marginPort, small: true }, { value: "7", size: portLarge, margin: marginPort },
  { value: "8", size: portLarge, margin: marginPort }, { value: "9", size: portLarge, margin: marginPort }, { value: "X", size: portLarge, margin: marginPort },
  { value: "4", size: portLarge, margin: marginPort }, { value: "5", size: portLarge, margin: marginPort }, { value: "6", size: portLarge, margin: marginPort },
  { value: "-", size: portLarge, margin: marginPort }, { value: "1", size: portLarge, margin: marginPort }, { value: "2", size: portLarge, margin: marginPort },
  { value: "3", size: portLarge, margin: marginPort }, { value: "+", size: portLarge, margin: marginPort }, { value: "/", size: portLarge, margin: marginPort },
  { value: "0", size: portLarge, margin: marginPort }, { value: ".", size: portLarge, margin: marginPort }
]

export let landButtons: any[] = [
  { value: "(", size: land, margin: marginLand }, { value: ")", size: land, margin: marginLand }, { value: "C", size: land, margin: marginLand }, // hyphen // en dash // em dash
  { value: "N", size: land, margin: marginLand }, { value: "B", size: land, margin: marginLand }, { value: "-", size: land, margin: marginLand }, // - – —
  { value: "X", size: land, margin: marginLand }, { value: "5", size: land, margin: marginLand }, { value: "6", size: land, margin: marginLand },
  { value: "7", size: land, margin: marginLand }, { value: "8", size: land, margin: marginLand }, { value: "9", size: land, margin: marginLand },
  { value: "/", size: land, margin: marginLand }, { value: "+", size: land, margin: marginLand }, { value: "0", size: land, margin: marginLand },
  { value: "1", size: land, margin: marginLand }, { value: "2", size: land, margin: marginLand }, { value: "3", size: land, margin: marginLand },
  { value: "4", size: land, margin: marginLand }, { value: ".", size: land, margin: marginLand }
]