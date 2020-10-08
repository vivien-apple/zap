/**
 *
 *    Copyright (c) 2020 Project CHIP Authors
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

const queryZcl = require('../db/query-zcl.js')
const templateUtil = require('./template-util.js')
const bin = require('../util/bin.js')

/**
 * This module contains the API for templating. For more detailed instructions, read {@tutorial template-tutorial}
 *
 * @module Templating API: Chip Tool formatting helpers
 */

function isDigit(ch) {
  return ch >= '0' && ch <= '9'
}

function asCamelCased(label, firstLower = true) {
  str = label.split(/ |-/)
  res = ''
  for (let i = 0; i < str.length; i++) {
    if (i == 0) {
      if (firstLower) {
        res += str[i].charAt(0).toLowerCase() + str[i].substring(1)
      } else {
        res += str[i].charAt(0).toUpperCase() + str[i].substring(1)
      }
      continue
    }
    res += str[i].charAt(0).toUpperCase() + str[i].substring(1)
  }
  return res
}

/**
 * Given a string convert it into a command line method name
 *
 * @param {*} str
 * @returns a dash delimited out string in lowercase
 */
function asCommandLineCommand(label) {
  var ret = ''
  if (label == null) return ret

  let uppercase = false
  for (let i = 0; i < label.length; i++) {
    let ch = label.charAt(i)
    let upch = ch.toUpperCase()
    if (isDigit(ch)) {
      ret += ch
    } else if (ch == '-') {
    } else if (ch == upch && !uppercase) {
      // uppercase
      if (i != 0) ret += '-'
      ret += ch.toLowerCase()
      uppercase = true
    } else if (ch == upch && uppercase) {
      ret += ch.toLowerCase()
    } else {
      // lowercase
      uppercase = false
      ret += ch
    }
  }
  return ret
}

function asNativeType(type) {
  switch (type) {
    case 'int8':
      return 'int8_t'
    case 'int16':
      return 'int16_t'
    case 'uint8':
    case 'CCMoveMode':
    case 'CCColorOptions':
    case 'cccoloroptions':
    case 'cccolorloopdirection':
    case 'CCStepMode':
    case 'CCDirection':
    case 'LevelOptions':
    case 'leveloptions':
    case 'MoveStepMode':
    case 'zclStatus':
    case 'enum8':
    case 'map8':
    case 'ProfileIntervalPeriod':
    case 'DrlkHolidayScheduleID':
    case 'DrlkWeekDayScheduleID':
    case 'DrlkYearDayScheduleID':
    case 'DrlkOperMode':
    case 'DrlkSettableUserStatus':
    case 'DrlkUserType':
    case 'DrlkDaysMask':
    case 'DrlkPassFailStatus':
    case 'DrlkOperEventSource':
    case 'DrlkUserStatus':
    case 'DrlkSetCodeStatus':
      return 'uint8_t'
    case 'uint16':
    case 'SGroupId':
    case 'sgroupid':
    case 'clusterId':
    case 'attribId':
    case 'CCMinMiredsField':
    case 'CCMaxMiredsField':
    case 'map16':
    case 'DrlkPINUserID':
    case 'DrlkRFIDUserID':
    case 'DrlkTotalUserID':
      return 'uint16_t'
    case 'uint32':
    case 'UTC':
    case 'date':
      return 'uint32_t'
    case 'bool':
      return 'bool'
    case 'octstr':
    case 'string':
    case 'SSceneName':
      return 'char *'
    case 'SExtensionFieldSetList':
      return 'void *'
      break
    default:
      throw new Error('UnknownType: ' + type)
  }
}

function pad(label, len, ch = ' ') {
  return label.padEnd(len, ch)
}

function concat() {
  let str = ''
  for (let arg in arguments) {
    if (typeof arguments[arg] != 'object') {
      str += arguments[arg]
    }
  }
  return str
}

function isNumberEqual(num1, num2) {
  return num1 == num2
}

// WARNING! WARNING! WARNING! WARNING! WARNING! WARNING!
//
// Note: these exports are public API. Templates that might have been created in the past and are
// available in the wild might depend on these names.
// If you rename the functions, you need to still maintain old exports list.
exports.asCommandLineCommand = asCommandLineCommand
exports.asNativeType = asNativeType
exports.concat = concat
exports.pad = pad
exports.isNumberEqual = isNumberEqual
