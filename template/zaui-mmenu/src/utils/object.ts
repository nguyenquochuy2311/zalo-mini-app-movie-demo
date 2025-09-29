import { SelectedToppings } from '@/@types/generic'

export function isIdentical(option1?: SelectedToppings, option2?: SelectedToppings) {
  if (!option1 && !option2) {
    return true
  }
  if (!option1 || !option2) {
    return false
  }
  const option1Keys = Object.keys(option1)
  const option2Keys = Object.keys(option2)

  if (option1Keys.length !== option2Keys.length) {
    return false
  }

  for (const key of option1Keys) {
    const option1Value = option1[key]
    const option2Value = option2[key]

    const isDeepEqual =
      JSON.stringify(option1Value, Object.keys(option1Value).sort()) ===
      JSON.stringify(option2Value, Object.keys(option2Value).sort())

    if (!isDeepEqual) {
      return false
    }
  }

  return true
}
