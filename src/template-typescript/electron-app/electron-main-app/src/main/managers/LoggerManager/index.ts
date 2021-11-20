import * as path from 'path';
import * as fs from 'fs';
import * as bunyan from 'bunyan';
import { Globals } from '@/config/globals';

export class LoggerManager {
    private static _logger: any;

    public static getInstance(): any {
        if (!this._logger) {
            const name = 'ElectronApp'; // 日志内容中name字段的值
            const env = Globals.APP_ENV;

            try {
                fs.accessSync(
                    path.join(Globals.LOG_PATH, Globals.LOG_NAME),
                    fs.constants.R_OK | fs.constants.W_OK
                );
            } catch (err) {
                if (!fs.existsSync(Globals.LOG_PATH)) {
                    fs.mkdir(Globals.LOG_PATH, () =>
                        console.log(
                            'created dir for logs, path:',
                            Globals.LOG_PATH
                        )
                    );
                }
            }

            try {
                this._logger = bunyan.createLogger({
                    name,
                    env,
                    serializers: bunyan.stdSerializers,
                    streams: [
                        {
                            type: 'rotating-file',
                            path: path.join(Globals.LOG_PATH, Globals.LOG_NAME),
                            period: '1d',   // daily rotation
                            count: 3,       // keep records for 3 days.
                        },
                    ],
                });
            } catch (err) {
                console.log(err);
            }
        }

        return this._logger;
    }
}

export const Logger = LoggerManager.getInstance()

export default LoggerManager