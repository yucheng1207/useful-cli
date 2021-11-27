import { Application } from "./Application/index";
import { Logger } from "./managers/LoggerManager";

const os = require('os');
const { crashReporter } = require('electron');

function main() {
	const app = new Application();
	app.init();

	const platform = os.platform() + '_' + os.arch();  // usually returns darwin_64
	Logger.info("platform: " + platform);
}

function crashReportInit() {
	// 应用崩溃报告上传
	// crashReporter.start({
	// 	companyName: 'Useful',
	// 	productName: 'Useful Electron App',
	// 	ignoreSystemCrashHandler: true,
	// 	submitURL: ''
	// });
}

try {
	main();
	crashReportInit();
}
catch (e) {
	console.log("App Error", e);
	Logger.error(e);
}