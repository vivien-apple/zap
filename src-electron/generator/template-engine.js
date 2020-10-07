/**
 *
 *    Copyright (c) 2020 Silicon Labs
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

/**
 * @module JS API: generator logic
 */

const fsPromise = require('fs').promises
const promisedHandlebars = require('promised-handlebars')
const handlebars = promisedHandlebars(require('handlebars'))

var globalHelpersInitialized = false

const templateCompileOptions = {
  noEscape: true,
}

const precompiledTemplates = {}

function produceCompiledTemplate(singlePkg) {
  initializeGlobalHelpers()
  if (singlePkg.id in precompiledTemplates)
    return Promise.resolve(precompiledTemplates[singlePkg.id])
  else
    return fsPromise.readFile(singlePkg.path, 'utf8').then((data) => {
      var template = handlebars.compile(data, templateCompileOptions)
      precompiledTemplates[singlePkg.id] = template
      return template
    })
}

/**
 * Given db connection, session and a single template package, produce the output.
 *
 * @param {*} db
 * @param {*} sessionId
 * @param {*} singlePkg
 * @returns Promise that resolves with the 'utf8' string that contains the generated content.
 */
function produceContent(db, sessionId, singlePkg) {
  return produceCompiledTemplate(singlePkg).then((template) =>
    template({
      global: {
        db: db,
        sessionId: sessionId,
      },
    })
  )
}

function loadHelper(path) {
  var helpers = require(path)
  for (const singleHelper in helpers) {
    handlebars.registerHelper(singleHelper, helpers[singleHelper])
  }
}

function initializeGlobalHelpers() {
  if (globalHelpersInitialized) return

  var includedHelpers = [
    './helper-zcl.js',
    './helper-zap.js',
    './helper-c.js',
    './helper-chip-tool.js',
    './helper-session.js',
  ]

  includedHelpers.forEach((element) => {
    loadHelper(element)
  })

  globalHelpersInitialized = true
}

exports.produceContent = produceContent
exports.loadHelper = loadHelper
