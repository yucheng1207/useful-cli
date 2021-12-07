const chalk = require('chalk');
const cp = require('child_process');
const jsyml = require('js-yaml');
const path = require('path');
const rp = require('request-promise');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const admZip = require('adm-zip');
const jsSha512 = require('js-sha512');
const yaml = require('js-yaml');
const { existsSync, readFileSync, writeFileSync } = require('fs');
const compareVersions = require('compare-versions');
const ProgressBar = require('./progressBar');

/**
 * 执行命令
 * @param {string} cmd
 */
function execSync(cmd) {
    cp.execSync(cmd, { stdio: 'inherit' }); // 配置stdio: 'inherit'可将运行中的打印输出
}

function logStats(proc, data) {
    let log = '';

    log += chalk.yellow.bold(
        `┏ ${proc} Process ${new Array(19 - proc.length + 1).join('-')}`
    );
    log += '\n\n';

    if (typeof data === 'object') {
        data.toString({
            colors: true,
            chunks: false,
        })
            .split(/\r?\n/)
            .forEach((line) => {
                log += '  ' + line + '\n';
            });
    } else {
        log += `  ${data}\n`;
    }

    log += '\n' + chalk.yellow.bold(`┗ ${new Array(28 + 1).join('-')}`) + '\n';

    console.log(log);
}

function electronLog(data, color) {
    let log = '';
    data = data.toString().split(/\r?\n/);
    data.forEach((line) => {
        log += `  ${line}\n`;
    });
    if (/[0-9A-z]+/.test(log)) {
        console.log(
            chalk[color].bold('┏ Electron -------------------') +
                '\n\n' +
                log +
                chalk[color].bold('┗ ----------------------------') +
                '\n'
        );
    }
}

/**
 * 获取yml中的asset
 * @param {string} yamlpath yml路径
 * @param {string} currentVersion 当前版本
 * @returns
 */
function getAssetsInYml(yamlpath, currentVersion) {
    const yamlContent = readFileSync(yamlpath, { encoding: 'utf-8' });
    const yamlObj = jsyml.safeLoad(yamlContent);
    console.log('Current version:', currentVersion);
    console.log('Yml info:', yamlObj);
    if (currentVersion !== yamlObj.version) {
        console.log(
            `${chalk.red('Version inconsistent')} ${chalk.bold(
                path.parse(yamlpath).base
            )} version is ${chalk.blue(yamlObj.version)} , ${chalk.bold(
                'package.json'
            )} version is ${chalk.blue(currentVersion)}`
        );
        throw new Error('Version inconsistent');
    }
    let result = [];
    if (yamlObj.files) {
        result = yamlObj.files.map((file) => ({ name: file.url }));
    } else {
        console.log(`${chalk.red('Not found vaild assets')}`);
        throw new Error('Not found vaild assets');
    }

    return result;
}

/**
 * 获取最新release yml信息
 * @param {string} url yml文件远程路径
 * @param {number} retryTimes 重试次数
 * @returns
 */
const getLatestReleaseYml = async (url, retryTimes = 3) => {
    const requestOptions = {
        method: 'GET',
        uri: url,
        json: true,
    };
    try {
        const ymlString = await rp(requestOptions);
        const yamlObj = jsyml.safeLoad(ymlString);
        return yamlObj;
    } catch (err) {
        if (err && err.statusCode === 404) {
            return null;
        } else if (retryTimes > 0 && retryTimes--) {
            const response = await getLatestReleaseYml(url, retryTimes);
            return response;
        } else {
            throw err;
        }
    }
};

/**
 * 上传文件到oss
 * @param {*} params
 */
async function releaseToOss(params) {
    const {
        ymlNames, // 需要检测的yml文件名，类型为数组
        skipVersionCheck, // 是否跳过版本检查
        currentVersion, // 当前版本
        localPath, // 需要发布的(待上传)文件路径
        ossBaseUrl, // oss base url
        ossRelativeUrl, // oss存储路径
        ossManager, // oss实例
    } = params;
    const publishUrl = `${ossBaseUrl}${ossRelativeUrl}`; // oss实际存储路径
    const onlineYmls = ymlNames.map((name) => ({
        name,
        path: `${publishUrl}/${name}`,
    }));
    const localYmls = ymlNames.map((name) => ({
        name,
        path: path.join(localPath, name),
    }));
    // 检查本地版本是否大于线上版本
    if (!skipVersionCheck) {
        for (let item of onlineYmls) {
            const onlineYml = await getLatestReleaseYml(item.path);
            if (onlineYml) {
                if (compareVersions(currentVersion, onlineYml.version) <= 0) {
                    const errorTip = `Check Version Error: Current version(${currentVersion}) needs to be higher than the online version(${onlineYml.version})`;
                    console.log(`${chalk.red(errorTip)}`);
                    throw new Error(errorTip);
                }
            }
        }
    }

    if (existsSync(localPath)) {
        console.log(
            `${chalk.green('Searching')} ${chalk.bold(
                chalk.blue(ymlNames.join(' and '))
            )} \n`
        );
        let assets = [];

        for (let localYml of localYmls) {
            const isExist = existsSync(localYml.path);
            if (isExist) {
                console.log(
                    `${chalk.bold(chalk.blue(localYml.name))} ${chalk.green(
                        'exists'
                    )} \n`
                );
                assets.push({ name: localYml.name });
                const res = getAssetsInYml(localYml.path, currentVersion);
                assets = assets.concat(res);
            }
        }

        if (!assets.length) {
            console.log(`${chalk.yellow('Not found vaild assets')}`);
            throw new Error('Not found vaild assets');
        }

        console.log('assets', assets);

        for (const asset of assets) {
            const fileName = `${ossRelativeUrl}/${asset.name}`;

            const filePath = path.join(localPath, asset.name);

            const pb = new ProgressBar(
                `${chalk.bold(chalk.blue(asset.name))} upload to ali-oss`,
                50
            );

            const startTime = Date.now();

            await ossManager.uploadFile(
                fileName,
                filePath,
                (percentage, checkpoint) => {
                    const total = checkpoint ? checkpoint.fileSize : 1;

                    const completed = (percentage || 1) * total;

                    pb.render({ completed, total });
                }
            );

            console.log(
                `\n${chalk.bold(chalk.blue(asset.name))} ${chalk.green(
                    `upload success`
                )} ${chalk.yellow(
                    `used time ${(Date.now() - startTime) / 1000}s`
                )} \n\n`
            );
        }
    }
}

/**
 * 创建压缩包
 * @param {String} inputPath 输入路径
 * @param {String} outputPath 输出路径
 * @param {String} name zip包名称
 * @returns
 */
async function createZip(name, inputPath, outputPath) {
    if (!existsSync(outputPath)) {
        console.log(`${chalk.green('Creating')} ${outputPath}... \n`);
        await mkdirp(outputPath);
    }

    const inPath = path.join(inputPath);
    const outPath = path.join(outputPath, name);

    console.log(`${chalk.green('Creating')} ${name}... \n`);
    // remove older one and zip a new one
    rimraf.sync(outPath);
    //  https://github.com/cthackers/adm-zip/wiki/ADM-ZIP#a16
    const zip = new admZip();
    zip.addLocalFolder(inPath);
    zip.writeZip(outPath);
    const buf = zip.toBuffer();
    const sha512 = jsSha512.sha512(buf);
    console.log(`${chalk.blue(sha512)}: ${sha512}\n`);

    return sha512;
}

/**
 * 创建yml文件
 * @param {string} name 文件名
 * @param {string} outputPath 输出路径
 * @param {object} content yml内容
 */
async function createYml(name, outputPath, content) {
    if (content) {
        console.log(`${chalk.green('Creating')} ${name}... \n`);
        const ymlPath = path.join(outputPath, name);
        rimraf.sync(ymlPath);
        writeFileSync(ymlPath, yaml.safeDump(content), 'utf8');
    }
}

module.exports = {
    execSync,
    logStats,
    electronLog,
    getAssetsInYml,
    getLatestReleaseYml,
    releaseToOss,
    createZip,
    createYml,
};
