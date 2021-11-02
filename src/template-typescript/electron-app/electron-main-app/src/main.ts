import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as dotEnv from 'dotenv';
import WindowManager from './managers/WindowManager';

enum AppEnv {
    DEV = 'development',
    TEST = 'test',
    RC = 'production:rc',
    PROD = 'production',
}
const env = process.env.NODE_ENV as AppEnv;

function configEnv() {
    const envs = Object.values(AppEnv);
    const isVaildEnv = env && envs.includes(env);
    const currEnv = env ? (isVaildEnv ? env : AppEnv.PROD) : AppEnv.DEV;
    console.log('current env:', currEnv, isVaildEnv);
    // 先构造出.env*文件的绝对路径
    const appDirectory = fs.realpathSync(process.cwd());
    const resolveApp = (relativePath: string) =>
        path.resolve(appDirectory, relativePath);
    const pathsDotenv = resolveApp(`env/${currEnv}.env`);

    dotEnv.config({ path: `${pathsDotenv}` }); // 加载.env
}
configEnv();

function createWindow() {
    const url = path.join(__dirname, '../index.html');
    return WindowManager.getInstance().createMainWindow(url, true);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    createWindow();

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
