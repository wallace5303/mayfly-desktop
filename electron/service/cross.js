'use strict';

const { Service } = require('ee-core');
const Cross = require('ee-core/cross');
const Log = require('ee-core/log');
const Ps = require('ee-core/ps');
const path = require("path");
const Helper = require('ee-core/utils/helper');
const CoreWindow = require('ee-core/electron/window');
const HttpClient = require('ee-core/httpclient');
const Html = require('ee-core/html');

/**
 * cross（service层为单例）
 * @class
 */
class CrossService extends Service {

  constructor(ctx) {
    super(ctx);
  }

  /**
   * create go service
   * In the default configuration, services can be started with applications. 
   * Developers can turn off the configuration and create it manually.
   */   
  async createGoServer() {
    // method 1: Use the default Settings
    //const entity = await Cross.run(serviceName);

    // method 2: Use custom configuration
    const serviceName = "go";
    const configPath = path.join(Ps.getExtraResourcesDir(), 'config.yml');
    const opt = {
      name: 'mayfly-go',
      cmd: path.join(Ps.getExtraResourcesDir(), 'mayfly-go.exe'),
      directory: Ps.getExtraResourcesDir(),
      port: 7073,
      args: [ `-e=${configPath}` ],
      stdio: ['ignore', 'ignore', 'ignore'],
      appExit: true,
    }
    const entity = await Cross.run(serviceName, opt);
    this.loadWeb(entity);

    return;
  }

  /**
   * load web
   */
  async loadWeb(entity, opt = {}) {
    const cfg = entity.config;
    const mainWin = CoreWindow.getMainWindow();

    // loading page
    if (cfg.hasOwnProperty('loadingPage')) {
      const lp = path.join(Ps.getHomeDir(), cfg.loadingPage);
      if (Helper.fileIsExist(lp)) {
        mainWin.loadFile(lp);
      }
    }

    const url = entity.getUrl();
    let count = 0;
    let serviceReady = false;
    const hc = new HttpClient();

    // 循环检查
    const times = Ps.isDev() ? 20 : 100;
    const sleeptime = Ps.isDev() ? 1000 : 100;
    while(!serviceReady && count < times){
      await Helper.sleep(sleeptime);
      try {
        await hc.request(url, {
          method: 'GET',
          timeout: 100,
        });
        serviceReady = true;
      } catch(err) {
        console.log('The cross service is starting');
      }
      count++;
    }
    console.log('count:', count)
    if (serviceReady == false) {
      const failurePage = Html.getFilepath('cross-failure.html');
      mainWin.loadFile(failurePage);
      throw new Error(`[ee-core] Please check cross service [${entity.name}] ${url} !`)
    }

    mainWin.loadURL(url, opt)
    .then()
    .catch((err)=>{
      Log.logger.error(`[ee-core] cross Please check the ${url} !`);
    });
    if (!mainWin.isVisible()) {
      if (mainWin.isMinimized()) {
        mainWin.restore();
      }
      mainWin.show();
      mainWin.focus();
    }
  }   
}

CrossService.toString = () => '[class CrossService]';
module.exports = CrossService;  