const AdmZip = require('adm-zip')

export const extractZip = (zipPath: string, extractPath: string, retryTimes = 3): void => {
	try {
		const zip = new AdmZip(zipPath)
		zip.extractAllTo(extractPath, true)
	}
	catch (err) {
		if (retryTimes > 0 && retryTimes--) {
			extractZip(zipPath, extractPath, retryTimes)
		}
		else {
			throw err
		}
	}
}