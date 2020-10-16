const fs = require('fs')
const path = require('path')
const getFinalTsconfig = require('../helpers/get-final-tsconfig')
const normalizePluginOptions = require('../normalize-plugin-options')
const normalizeAliases = require('./normalize-aliases')

const extractAliasesFromConfig = ({ configPath, absoluteBaseUrl, source }) => {
	let configFileContents
	if (source === 'tsconfig') {
		configFileContents = getFinalTsconfig(configPath)
	} else {
		configFileContents = fs.readFileSync(configPath)
	}
	const config = JSON.parse(configFileContents)
	const { compilerOptions } = config

	const standardAliases = {}

	for (let aliasName in compilerOptions.paths) {
		const [aliasPath] = compilerOptions.paths[aliasName]
		standardAliases[aliasName.replace('/*', '')] = aliasPath.replace('/*', '')
	}

	return normalizeAliases({
		absoluteBaseUrl,
		aliases: standardAliases
	})
}

const extractAliases = ({ pluginOptions, context: { paths } }) => {
	const options = normalizePluginOptions(pluginOptions)

	const { appPath } = paths
	const { baseUrl } = options

	const absoluteBaseUrl = path.join(appPath, baseUrl)

	if (options.source === 'jsconfig')
		return extractAliasesFromConfig({
			configPath: paths.appJsConfig,
			absoluteBaseUrl,
			source: options.source
		})

	if (options.source === 'tsconfig')
		return extractAliasesFromConfig({
			configPath: options.tsConfigPath,
			absoluteBaseUrl,
			source: options.source
		})

	if (options.source === 'options')
		return normalizeAliases({
			absoluteBaseUrl,
			aliases: options.aliases,
			source: options.source
		})
}

module.exports = extractAliases
