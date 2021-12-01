import * as path from 'path'
import { Globals } from '../config/globals'
const rp = require('request-promise')
const request = require('request')
const fs = require('fs')

const HOST = Globals.RELEASE_HOST

const APP_ID = Globals.RELEASE_APP_ID

export interface ReleaseInfo {
	id: number,
	version: string,
	title: string,
	description: string,
	release: boolean,
	assets: Assets[],
}

interface Assets {
	name: string,
	url: string,
}

export enum AppType {
	APP = 'App',
	BUNDLE = 'Bundle',
}


/**
 * 获取最新release api
 */
export const getLatestRelease = async (type: AppType, retryTimes = 3): Promise<ReleaseInfo | null> => {
	const requestOptions = {
		method: 'GET',
		uri: `${HOST}/api/release/latest?type=${type}`,
		headers: { 'X-Mesh-App-Id': APP_ID },
		json: true,
	};
	try {
		const response = await rp(requestOptions)
		return response
	}
	catch (err) {
		if (err && err.statusCode === 404) {
			return null
		}
		else if (retryTimes > 0 && retryTimes--) {
			const response = await getLatestRelease(type, retryTimes)
			return response
		}
		else {
			throw err
		}
	}
}

/**
 * 通过版本号获取最新release api
 */
export const getReleaseByVersion = async (version: string, type: AppType, retryTimes = 3): Promise<ReleaseInfo | null> => {
	const requestOptions = {
		method: 'GET',
		uri: `${HOST}/api/release?version=${version}&type=${type}`,
		headers: { 'X-Mesh-App-Id': APP_ID },
		json: true,
	}
	try {
		const response = await rp(requestOptions)
		return response
	}
	catch (err) {
		if (err && err.statusCode === 404) {
			return null
		}
		else if (retryTimes > 0 && retryTimes--) {
			const response = await getReleaseByVersion(version, type, retryTimes)
			return response
		}
		else {
			throw err
		}
	}
}


const download = (downloadUrl: string, targetPath: string, onprogress: (receivedBytes: number, totalBytes: number, percentage: number) => void): Promise<void> => {
	return new Promise((resolve, reject) => {
		let receivedBytes = 0;
		let totalBytes = 0;
		let response: any = null;
		const req = request({
			method: 'GET',
			uri: downloadUrl,
		});
		const out = fs.createWriteStream(targetPath, { flags: 'w+' });

		out.on('close', () => {
			resolve(response);
		})

		req.pipe(out);
		req.on('response', (res: any) => {
			// Change the total bytes value to get progress later.
			totalBytes = parseInt(res.headers['content-length'].toString(), 0);
		});

		req.on('data', (chunk: any) => {
			receivedBytes += chunk.length;
			onprogress && onprogress(receivedBytes, totalBytes, receivedBytes / totalBytes);
		});

		req.on('complete', (res: any) => {
			response = res;
		});

		req.on('error', (err: any) => {
			reject(err);
		});

	});
}

export const downloadFile = async (downloadUrl: string, targetPath: string, onprogress: (receivedBytes: number, totalBytes: number, percentage: number) => void = null, retryTimes = 3): Promise<void> => {
	try {
		const targetFolder = path.dirname(targetPath)
		if (!fs.existsSync(targetFolder)) {
			fs.mkdirSync(targetFolder);
		}
		await download(downloadUrl, targetPath, onprogress)
	}
	catch (err) {
		if (retryTimes > 0) {
			await downloadFile(downloadUrl, targetPath, onprogress, --retryTimes)
		}
		else {
			throw err
		}
	}
}