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

const templateUtil = require('./template-util.js')
const queryPackage = require('../db/query-package.js')

/**
 * This module contains the API for templating. For more detailed instructions, read {@tutorial template-tutorial}
 *
 * @module Templating API: toplevel utility helpers
 */

/**
 * Produces the top-of-the-file header for a C file.
 *
 * @returns The header content
 */
function zap_header() {
  return `// This file is generated by ZCL Advanced Platform generator. Please don't edit manually.`
}

/**
 * Simple helper that produces an approved size of identation.
 *
 * @returns whitespace that is the identation.
 */
function ident(cnt) {
  if (Number.isInteger(cnt)) {
    return '  '.repeat(cnt)
  } else {
    return '  '
  }
}

/**
 * Block helper that iterates over the package options of a given category.
 *
 * @param {*} category
 * @param {*} options
 */
function template_options(options) {
  return templateUtil
    .ensureTemplatePackageId(this)
    .then((packageId) =>
      queryPackage.selectAllOptionsValues(
        this.global.db,
        packageId,
        options.hash.category
      )
    )
    .then((ens) => templateUtil.collectBlocks(ens, options, this))
}

/**
 * Inside an iterator, this helper allows you to specify the content that will be output only
 * during the first element.
 *
 * @param {*} options
 * @returns content, if it's the first element inside an operator, empty otherwise.
 */
function first(options) {
  if (this.index != null && this.count != null && this.index == 0) {
    return options.fn(this)
  }
}

/**
 * Inside an iterator, this helper allows you to specify the content that will be output only
 * during the last element.
 *
 * @param {*} options
 * @returns content, if it's the last element inside an operator, empty otherwise.
 */
function last(options) {
  if (
    this.index != null &&
    this.count != null &&
    this.index == this.count - 1
  ) {
    return options.fn(this)
  }
}

// WARNING! WARNING! WARNING! WARNING! WARNING! WARNING!
//
// Note: these exports are public API. Templates that might have been created in the past and are
// available in the wild might depend on these names.
// If you rename the functions, you need to still maintain old exports list.
exports.zap_header = zap_header
exports.ident = ident
exports.template_options = template_options
exports.last = last
exports.first = first
