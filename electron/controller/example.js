'use strict';

const { Controller } = require('ee-core');

/**
 * example
 * @class
 */
class ExampleController extends Controller {

  constructor(ctx) {
    super(ctx);
  }


  /**
   * 所有方法接收两个参数
   * @param args 前端传的参数
   * @param event - ipc通信时才有值。详情见：控制器文档
   */

  /**
   * test
   */
  async test () {

    // const result1 = await Services.get('example').test('electron');
    // Log.info('service result1:', result1);

    // Services.get('framework').test('electron');

    return 'hello electron-egg';
  }

}

ExampleController.toString = () => '[class ExampleController]';
module.exports = ExampleController;  