/**
 * Validates route based on a set of options
 * for each route item type.
 * @param  {Object} optionsItem Object containing validation method and options.
 * @param  {String} value       Value of string item in the route.
 * @return {Boolean}             Is the route item valid?
 */
export const validateRouteOption = (optionsItem, value) => {
  // console.log('validateRouteOption, ', optionsItem, value)
  // Check length of arrays.
  if (!!optionsItem.check_length) {
    if (value.length !== optionsItem.defaultValue.length) {
      return false
    }
  }
  // Case to validate via different methods.
  switch (true) {
    case optionsItem.validate === 'regex':
      return value.match(optionsItem.options)
      break
    case optionsItem.validate === 'one_exact_match':
      return optionsItem.options.indexOf(value) > -1
      break
    case optionsItem.validate === 'type_number':
      const tryVal = value === '' ? 0 : value
      return !isNaN(tryVal) && !isNaN(parseFloat(tryVal))
      break
    case optionsItem.validate === 'contains_only':
      // Split value into array of strings.
      if (value === '' || value === 'undefined') return true
      const valuesArray = value.split(',')
      return valuesArray.every(el => {
        return optionsItem.options.indexOf(el) > -1
      })
      break
    case optionsItem.validate === 'between_options':
      // Split value into array of strings.
      return value > options[0] && value < options[1]
      break
    case optionsItem.validate === 'arr_length':
      // Split value into array of strings.
      return value.length === optionsItem.length
      break
    default:
  }
}
