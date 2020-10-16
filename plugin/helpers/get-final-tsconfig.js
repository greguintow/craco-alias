const cp = require('child_process')

module.exports = function getFinalTsconfig(configPath) {
	return cp.execSync(`tsc -p "${configPath}" --showConfig`)
}
