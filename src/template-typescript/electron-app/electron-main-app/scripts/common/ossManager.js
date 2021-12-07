const rp = require('request-promise');
const OSS = require('ali-oss');
const crypto = require('crypto');

class OSSManager {
    constructor(params) {
        const { bucket, endpoint, salt } = params;
        this.accessKeyId = null;
        this.accessKeySecret = null;
        this.expiration = null;
        this.securityToken = null;
        this.region = null;
        // this.endpoint = null;

        this.client = null;
        this.bucket = bucket;
        this.salt = salt;
        this.endpoint = endpoint;
    }

    /**
     * Initialize OSS Client
     */
    async initClient() {
        if (
            !this.bucket ||
            !this.client ||
            !this.accessKeyId ||
            !this.accessKeySecret ||
            !this.securityToken ||
            !this.expiration ||
            !this.region ||
            this.expiration < Date.now()
        ) {
            const data = await this.getAccessTokenData(this.bucket);

            this.accessKeyId = data.accessKeyId;
            this.accessKeySecret = data.accessKeySecret;
            this.securityToken = data.securityToken;
            this.expiration = new Date(data.expiration).getTime();
            this.region = data.region;
            // this.endpoint = data.endpoint;

            this.client = new OSS({
                region: this.region,
                accessKeyId: this.accessKeyId,
                accessKeySecret: this.accessKeySecret,
                bucket: this.bucket,
                stsToken: this.securityToken,
            });
        }
    }

    /**
     * Clean up client
     */
    clean() {
        this.accessKeyId = null;
        this.accessKeySecret = null;
        this.expiration = null;
        this.securityToken = null;
        this.region = null;

        this.client = null;
    }

    /**
     * Get param required for osstoken API
     *
     * @param {any} data - data used to generate param
     */
    getParam(data) {
        // 转为 json 字符串
        data = JSON.stringify(data);

        // URL安全的Base64编码, 先转为 base64
        // 再将字符串中的加号 “+” 换成中划线 “-”，并且将斜杠 “/” 换成下划线 “_”
        data = Buffer.from(data).toString('base64');
        const param = data.replace(/\+/g, '-').replace(/\//g, '_');

        return param;
    }

    /**
     * Get signature based on a given param
     *
     * @param {any} param - param used to generate signature
     */
    getSign(param) {
        const sign = crypto
            .createHmac('sha1', this.salt)
            .update(param)
            .digest()
            .toString('base64');

        return sign;
    }

    /**
     * Method to retreive OSS token data
     */
    async getAccessTokenData(bucket) {
        const applyTime = new Date().getTime();
        const data = {
            bucket,
            applyTime,
        };

        const param = this.getParam(data);
        const sign = this.getSign(param);

        const postData = {
            sign,
            param,
        };

        const requestOptions = {
            method: 'POST',
            uri: this.endpoint + '/api/oss/ststoken',
            body: postData,
            json: true,
        };

        const response = await rp(requestOptions);

        if (response.code && response.code === 1) {
            return response.data;
        }
        console.info('access token response: ', JSON.stringify(response));

        throw new Error('Error response when getting OSS Token');
    }

    /**
     * Upload a file to out OSS CDN bucket for desktop resource
     *
     * @param {string} fileName - name of this file on OSS CDN bucket
     * @param {string} filePath - file path locally
     * @param {Function} progress - the progress callback
     */
    async uploadFile(fileName, filePath, progress, checkpoint) {
        try {
            await this.initClient();

            // lets always use multipart upload
            const result = await this.client.multipartUpload(
                fileName,
                filePath,
                {
                    checkpoint,
                    progress: progress ? progress : () => {},
                }
            );
            return result;
        } catch (err) {
            console.log('ERROR when performing multipart upload');
            console.log(err);
            throw err;
        }
    }

    async getEndpoint() {
        try {
            await this.initClient();
            return this.endpoint;
        } catch (err) {
            console.error('Error when initializing Client');
            console.error(JSON.stringify(err));
            throw new Error('Error happening when get OSS endpoint');
        }
    }

    /**
     * Get head information of an object stored in OSS
     * Refer to: https://github.com/ali-sdk/ali-oss#headname-options
     *
     * @param {string} name - name of the object
     */
    async getHead(name) {
        try {
            await this.initClient();
        } catch (err) {
            console.error('Error when initializing Client');
            console.error(JSON.stringify(err));
        }
        const result = await this.client.head(name);

        if (result && result.status === 200) {
            return result.meta;
        } else {
            console.log(result);
            throw new Error(
                "Error happening when getting files' head from OSS"
            );
        }
    }

    /**
     * List files on OSS bucket, with prefix if provided
     * npm: https://www.npmjs.com/package/ali-oss#listquery-options
     * tutorial: https://help.aliyun.com/document_detail/111389.html?spm=a2c4g.11186623.6.1174.1aa336d4rCx5xa
     * @param {string} prefix - (optional) prefix of files to list
     *
     * @return
     */
    async listFiles(prefix) {
        try {
            await this.initClient();
        } catch (err) {
            console.error('Error when initializing Client');
            console.error(JSON.stringify(err));
        }

        let list = [];
        let result;
        const listOptions = prefix ? { prefix } : {};
        //max-keys: max objects, default is 100, limit to 1000
        listOptions['max-keys'] = 1000;

        do {
            result = await this.client.list(listOptions);
            if (result.res && result.res.status === 200) {
                listOptions['marker'] = result.nextMarker;
                list = result.objects ? list.concat(result.objects) : list;
            } else {
                throw new Error(
                    'Error happening when listing files from OSS' +
                        result.res.status
                );
            }
        } while (result.isTruncated);
        return list;
    }

    /**
     * Delete files existing on OSS
     *
     * @param key - file key on OSS
     */
    async deleteFilesOnCloud(key) {
        await this.initClient();

        const result = await this.client.delete(key);

        return result;
    }
}

module.exports = OSSManager;
