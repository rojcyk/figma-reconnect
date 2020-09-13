import { ColorIndex } from "../colorIndex"
import { checkIfStyleParsable } from "../listeners/exportStylesListener"

export const checkFills = (node: any, colorIndex: ColorIndex, settings: Plugin.Settings) => {
  // When there is no fill, we have nothing to do
  if (node.fills.length === 0) return null

  // If the fill style is already set ignore it, unless specified otherwise by settings
  if (node.fillStyleId !== "" && !settings.color.overwriteStyles) return null

  // Check if the style is single, solid color and we can change it, otherwise, ignore it.
  const [isValid, position] = checkIfStyleParsable(node.fills)

  // If the style is not parsable, return null
  if (isValid !== true) return null

  // We contstruct the color for easier processing
  const color: RGBA = {
    ...node.fills[position].color,
    a: node.fills[position].opacity
  }

  // First, before we even start comparing, we check whether the color already exists
  const foundColor = colorIndex.findImportedColor(color)

  if (foundColor) {
    node.fillStyleId = foundColor.id
    return foundColor.id
  } else {
    if (settings.color.findClosestColor) {
      const comparedColor = colorIndex.findSimilarColor(color)

      if (comparedColor) {
        node.fillStyleId = comparedColor.id
        return comparedColor.id
      }
    }
  }

  return null
}