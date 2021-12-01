import * as path from 'path'
import * as fs from "fs"

function readdirAsync(path: string): Promise<Array<string>> {
	return new Promise((resolve, reject) => {
		fs.readdir(path, (error, result) => {
			if (error) {
				reject(error)
			}
			else {
				resolve(result)
			}
		})
	})
}

function statAsync(path: string): Promise<fs.Stats> {
	return new Promise((resolve, reject) => {
		fs.stat(path, (error, result) => {
			if (error) {
				reject(error)
			}
			else {
				resolve(result)
			}
		})
	})
}

function readFileAsync(path: string): Promise<string> {
	return new Promise((resolve, reject) => {
		fs.readFile(path, { encoding: 'utf-8' }, (err, result) => {
			if (err) {
				reject(err)
			}
			else {
				resolve(result)
			}
		})
	})
}

function deleteFile(path: string): Promise<Boolean> {
	return new Promise((resolve, reject) => {
		fs.unlink(path, (err) => {
			if (err) {
				reject(err)
			}
			else {
				resolve(true)
			}
		})
	})
}

function deleteDir(path: string): Promise<boolean> {
	return new Promise((resolve, reject) => {
		fs.rmdir(path, (err) => {
			if (err) {
				reject(err)
			}
			else {
				resolve(true)
			}
		})
	})
}

function mkdirAsync(path: string): Promise<boolean> {
	return new Promise((resolve, reject) => {
		fs.mkdir(path, (err) => {
			if (err) {
				reject(err)
			}
			else {
				resolve(true)
			}
		})
	})
}

function existsAsync(path: string): Promise<boolean> {
	return new Promise((resolve, reject) => {
		fs.exists(path, exists => {
			resolve(exists)
		})
	})
}

async function createDirNotExists(dir: string): Promise<void> {
	try {
		const dirExist = await existsAsync(dir)
		if (!dirExist) {
			console.warn(`${dir} does not exist, make directory`)
			await mkdirAsync(dir)
		}
	}
	catch (err) {
		console.error(err)
	}
}

function renameAsync(oldPath: string, newPath: string): Promise<void> {
	return new Promise((resolve, reject) => {
		fs.rename(oldPath, newPath, err => {
			if (err) {
				reject(err)
			}
			else {
				resolve()
			}
		})
	})
}

async function renameAsyncWithRetry(oldPath: string, newPath: string, retryTimes = 3): Promise<void> {
	try {
		await renameAsync(oldPath, newPath)
	}
	catch (err) {
		if (retryTimes > 0) {
			await renameAsyncWithRetry(oldPath, newPath, --retryTimes)
		}
		else {
			throw err
		}
	}
}

/**
 * Delete Dir or File according to localpath
 * @param localpath delete target path
 */
async function deleteFileInDir(localpath: string): Promise<void> {
	const exist = await existsAsync(localpath)
	if (exist) {
		const stat = await statAsync(localpath)
		if (stat.isDirectory()) {
			const files = await readdirAsync(localpath)
			for (const file of files) {
				const curPath = path.join(localpath, file)

				await deleteFileInDir(curPath)
			}

			await deleteDir(localpath);
		}
		else {
			await deleteFile(localpath)
		}
	}
	else {
		console.error('loacl path is not exists')
		throw new Error('loacl path is not exists')
	}
}

export {
	readdirAsync,
	statAsync,
	readFileAsync,
	deleteFile,
	mkdirAsync,
	existsAsync,
	deleteDir,
	createDirNotExists,
	renameAsync,
	renameAsyncWithRetry,
	deleteFileInDir
};