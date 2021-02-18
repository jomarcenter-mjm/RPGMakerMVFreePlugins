/*:
 * @plugindesc Ver. 0.1 Transit system with northbound and southbound transport
 * @author Jomarcenter-MJM
 * 
 * @help
 * 
 * --Version Information
 * >0.1
 * Initial Script created
 *
 * --Copyright and Licenseing Information
 * if using this script please include "Jomarcenter-MJM" in the credits
 * This can be used Non-Commerically regardless of Game's Content
 * (this includes R-18 content)
 *
 * Special licenseing provided under Tier 1 Plugin set A.
 * Custom version if this plugin also avalable for a special fee.
 * (this is separate from the tier payment system)
 * 
 * Custom version is avalible at this rate
 * Tier 1 set A price + commision fee
 *
 * Unauthorized use of the plugin commercially may result in legal action.
 *
 * How to setup:
 * 
 * Plugin Command:
 * type 'opentransportmap' (without quotes) in the plugin command section
 * of the event. this will open the transport window.
 *
 *=====( 76 chars including '*' but 77 so vsCode can auto-insert '*' )=======
 *- [ctrl] + [shift] +[p] and enter 'settings.json and put this in vsCode
 *  settings.json to help keep horzScrollbar out of  the
 *  plugin manager help window:
 * 
 *                         "[javascript]": {
 *                           "editor.rulers": [77]
 *                         },
 *
 * value in array is char length and accepts multiple values
 * 
 *[edits]:
 *- tidy up parameter parsing
 *- made us of IIFE parameter input to shorten
 *  'MJMJS.TransitRouteTeleport' to '_'
 *- Scene_TransportSystem now extends Scene_Base instead of Scene_MenuBase
 *  because Scene_MenuBase created unused variables
 *- rearranged functions closer to instantiation order
 *
 *=======================( end help )===================( 77 chars )=========
 *
 * @param <Basic Setup>
 * 
 * @param Location List
 * @desc List of teleporable location
 * @type struct<transportLocation>[]
 * @default ["{\"locationName\":\"Main Station\",\"locationImage\":\"\",\"unlocked\":\"true\",\"mapId\":\"1\",\"xPosition\":\"1\",\"yPosition\":\"1\",\"characterFacing\":\"0\",\"fee\":\"1\"}"]
 *
 * @param buy ticket name
 * @desc we recomeded to rename this if you disabled enable fee functionality
 * @type string
 * @default Buy Ticket
 *
 * @param enable fee
 * @desc this will enable the fee function
 * @type boolean
 * @default true
 * @on yes
 * @off no
 *
 *
 */
/*~struct~transportLocation:
 *
 * @param locationName
 * @desc name of the location
 * @type string
 * @default locationName
 *
 * @param locationImage
 * @desc image of the location
 * @type file
 * @require 1
 * @dir img/
 * @default 
 *
 * @param LocationDescription
 * @desc insert the information of the teleportable area
 * @type string
 * @default Default
 * 
 * @param unlocked
 * @desc check rather if it unlock by default
 * @type boolean
 * @default true
 * @on yes
 * @off no
 *
 * @param mapId
 * @desc Map location
 * @type number
 * @default 1
 *
 * @param xPosition
 * @desc
 * @type number
 * @default 1
 *
 * @param yPosition
 * @desc
 * @type number
 * @default 1
 *
 * @param characterFacing
 * @desc 0 = remain, 1 = up, 2 = down, 3 = left, 4 = right
 * @type number
 * @max 4
 * @min 0
 * @default 0
 *
 * 
 * @param fee
 * @desc if the enable fee is on this will be use to deduct amount to player.
 * @type number
 * @default 1
 *
 */
//third-party code - 
var JSONSuperParse = function (string) {
  var temp;
  try {
    temp = JsonEx.parse(typeof string === 'object' ? JsonEx.stringify(string) : string);
  } catch (e) {
    return string;
  }
  if (typeof temp === 'object') {
    Object.keys(temp).forEach(function (key) {
      temp[key] = JSONSuperParse(temp[key]);
      if (temp[key] === '') {
        temp[key] = null;
      }
    });
  }
  return temp;
};

var MJMJS = MJMJS || {};
MJMJS.TransitRouteTeleport = {};
MJMJS.TransitRouteTeleport.Parameters = JSONSuperParse(PluginManager.parameters('MJMJS_TransitRouteTeleport'));
MJMJS.TransitRouteTeleport.locationList = MJMJS.TransitRouteTeleport.Parameters['Location List'];
MJMJS.TransitRouteTeleport.allowFee = JSON.parse(MJMJS.TransitRouteTeleport.Parameters['enable fee']);
MJMJS.TransitRouteTeleport.buytixname = String(MJMJS.TransitRouteTeleport.Parameters['buy ticket name']);
// console.log(MJMJS.TransitRouteTeleport.Parameters);

$gameTransport = null;

(function (_) {

  //--------------------------------------------------------------------
  //MJMJS.TransitRouteTeleport
  //--------------------------------------------------------------------


  //--------------------------------------------------------------------
  //plugin commands
  //--------------------------------------------------------------------
  
  const pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    if (command.toLowerCase() === 'opentransportmap') {
      console.log("opening transport system");
      SceneManager.push(Scene_TransportSystem);
    } else if (command.toLowerCase() === 'managetransportarea') {
      const argsCommand = args[0];
      const argsLocation = args[1] || 'all';
      switch (argsCommand) {
        case 'lock':
          $gameSystem.lockTransportArea(argsLocation);
          break;
        case 'unlock':
            $gameSystem.unlockTransportArea(argsLocation);
          break;
        default:
          console.error('[MJMJS]An Error has occured: the plugin command managetransportarea ${argscommand}. only <lock> and <unlock> can be use');
          break;
      }
    } else {
      pluginCommand.call(this, command, args);
    }
  };

  //--------------------------------------------------------------------
  //Game_Party - Adding new features to the game party class to store necessar save data
  //--------------------------------------------------------------------

  _.Game_System_Initialize = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function() {
    _.Game_System_Initialize.call(this);
    this._mjmjsTransportList = MJMJS.TransitRouteTeleport.locationList;
  };

  Game_System.prototype.lockTransportArea = function (index) {

  };

  Game_System.prototype.unlockTransportArea = function (index) {

  };

  //---------------------------------------------------------------------------------------------
  // DataManager - Contain all the necessary code to store save info
  //---------------------------------------------------------------------------------------------
  //save all necessary data
  // _.DataManager_Save = DataManager.makeSaveContents;     // not needed
  // _.DataManager_Load = DataManager.extractSaveContents;  // $gameSysytem is saved and loaded
  // just add location variable to it
  
  _.DataManager_CreateGameObjects = DataManager.createGameObjects;
  DataManager.createGameObjects = function() {
      _.DataManager_CreateGameObjects.call(this);
      //creates the global transport Object
      $gameSystem.locationList = _.locationList;
  };

  //--------------------------------------------------------------------
  //Scene_TransportSystem - Manages the windows for the transport system
  //--------------------------------------------------------------------

  function Scene_TransportSystem() {
    this.initialize.apply(this, arguments);
  }
  Scene_TransportSystem.prototype = Object.create(Scene_Base.prototype);
  Scene_TransportSystem.prototype.constructor = Scene_TransportSystem;

  Scene_TransportSystem.prototype.initialize = function () {
    console.log("Open Scene_TransportSystem");
    Scene_Base.prototype.initialize.call(this);
  };

  Scene_TransportSystem.prototype.create = function () {
    Scene_Base.prototype.create.call(this);
    this.createBackground();
    this.createWindowLayer();
    this.createGoldWindow();
    this.createCommandWindow();
    this.createDummyWindow();
    this.createListWindow();
    this.createInformationWindow();
  };

  Scene_TransportSystem.prototype.createBackground = function () {
    this._backgroundSprite = new Sprite();
    this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
    this.addChild(this._backgroundSprite);
  };

  Scene_TransportSystem.prototype.createGoldWindow = function () {
    this._goldWindow = new Window_Gold(0, 0);
    this.addWindow(this._goldWindow);
  };

  Scene_TransportSystem.prototype.createCommandWindow = function () {
    var x = 0;
    var y = 0;
    if (_.allowFee) {
      x = this._goldWindow.width;
      y = this._goldWindow.y;
      this._commandWindow = new Window_TransportCommand(x, y, Graphics.boxWidth - this._goldWindow.width);
    } else {
      this._commandWindow = new Window_TransportCommand(x, y, Graphics.boxWidth);
    }
    this._commandWindow.setHandler('buy ticket', this.activateTicketWindow.bind(this));
    this._commandWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._commandWindow);
  };

  Scene_TransportSystem.prototype.createDummyWindow = function() {
      var wy = this._commandWindow.y + this._commandWindow.height;
      var wh = Graphics.height - wy;
      this._dummyWindow = new Window_Base(0, wy, Graphics.width, wh);
      this.addWindow(this._dummyWindow);
  };

  Scene_TransportSystem.prototype.createListWindow = function () {
    var wy = this._commandWindow.y + this._commandWindow.height; // was 72 but static height is more work if a change is desired
    var ww = 240;
    // var wh = Graphics.height - wy; // fill between command and bottom of screen (crrently set for listSize 'fittingHeight')
    // console.log("wy: " + wy + " ww: " + ww + " wHeight: " + wheight);
    this._listWindow = new Window_TransportList(0, wy, ww);
    this._listWindow.hide();
    this._listWindow.deactivate();
    this._listWindow.setHandler('ok', this.onTicketListOk.bind(this));
    for(var i = 0; i < _.locationList.length; i++) {
      var location = _.locationList[i]
      this._listWindow.setHandler(location.locationName, this.onTicketListOk.bind(this), location.unlocked);
    }
    this._listWindow.setHandler('cancel', this.onTicketListCancel.bind(this));
    this.addWindow(this._listWindow);
  };

  Scene_TransportSystem.prototype.createInformationWindow = function () {
    var wx = this._listWindow.width;
    var wy = this._listWindow.y;
    var ww = Graphics.width - this._listWindow.width;
    var wh = Graphics.height - wy;
    this._InfoWindow = new Window_TransportInfo(wx, wy, ww, wh);
    this._InfoWindow.hide();
    this._InfoWindow.deactivate();
    this.addWindow(this._InfoWindow);
  };

  Scene_TransportSystem.prototype.onTicketListOk = function () {
    this._listWindow.deactivate();
    console.log(`Ticket selected: ${this._listWindow.index()}`);
    this.teleportPlayer();
  };

  Scene_TransportSystem.prototype.onTicketListCancel = function () {
    this._listWindow.deactivate();
    this._commandWindow.activate();
    this._InfoWindow.close();
    this._listWindow.close();
  };

  Scene_TransportSystem.prototype.activateTicketWindow = function () {
    // this._dummyWindow.hide();
    this._listWindow.show();
    this._InfoWindow.show();
    this._listWindow.open();
    this._InfoWindow.open();
    this._listWindow.activate();

  };

  Scene_TransportSystem.prototype.teleportPlayer = function () {
    var loc = _.locationList[this._listWindow.index()];
    $gamePlayer.reserveTransfer(loc.mapId, loc.xPosition, loc.yPosition, loc.characterFacing, 0);
    this.popScene();
  };

  Scene_TransportSystem.prototype.money = function () {
    return this._goldWindow.value();
  };

  Scene_TransportSystem.prototype.currencyUnit = function () {
    return this._goldWindow.currencyUnit();
  };

  Scene_TransportSystem.prototype.checkIfpayable = function (playerHand, Value) {
    if ($gameParty.gold() >= value) {
      return true;
    } else {
      return false;
    }
  };
  Scene_TransportSystem.prototype.terminate = function() {
    this._goldWindow.close();
    this._dummyWindow.close();
    this._commandWindow.close();
    this._listWindow.close();
    this._InfoWindow.close();
    Scene_Base.prototype.terminate.call(this);
  };

  //--------------------------------------------------------------------
  //Window_TransportCommand - basically the buy and cancel
  //--------------------------------------------------------------------

  function Window_TransportCommand() {
    this.initialize.apply(this, arguments);
  };

  Window_TransportCommand.prototype = Object.create(Window_HorzCommand.prototype);
  Window_TransportCommand.prototype.constructor = Window_TransportCommand;

  Window_TransportCommand.prototype.initialize = function (x, y, width) {
    console.log('Opening Window_TransportCommand');
    this._windowWidth = width;
    Window_HorzCommand.prototype.initialize.call(this, x, y);
    console.log(`x: ${this.x}, y: ${this.y}, width: ${this.width}, height: ${this.height}`);
  };

  Window_TransportCommand.prototype.windowWidth = function () {
    return this._windowWidth;
  };

  Window_TransportCommand.prototype.maxCols = function () {
    return 2;
  };

  Window_TransportCommand.prototype.makeCommandList = function () {
    this.addCommand(_.buytixname, 'buy ticket');
    this.addCommand(TextManager.cancel, 'cancel');
  };

  //--------------------------------------------------------------------
  //Window_Transport list - Manages the windows for the transport system
  //--------------------------------------------------------------------

  function Window_TransportList() {
    this.initialize.apply(this, arguments);
  };

  Window_TransportList.prototype = Object.create(Window_Command.prototype);
  Window_TransportList.prototype.constructor = Window_TransportList;

  Window_TransportList.prototype.initialize = function (x, y, width) {
    console.log('Opening Window_TransportList');
    this._windowWidth = width;
    Window_Command.prototype.initialize.call(this, x, y);
    console.log(`x: ${this.x}, y: ${this.y}, width: ${this.width}, height: ${this.height}`);
    this.close();
    // console.log(x + ' ' + y + ' ' + width + ' ' + height)
    // this._money = 0;
    // this.refreshTransport();
    // this.select(0);
  };

  Window_TransportList.prototype.windowWidth = function() {
      return this._windowWidth;
  };
  
  // Window_TransportList.prototype.windowHeight = function() {
  //     return this._winHeight;
  // };

  Window_TransportList.prototype.setMoney = function (money) {
    this._money = money;
    this.refresh();
  };

  Window_TransportList.prototype.makeCommandList = function () {
    for(var i = 0; i < _.locationList.length; i++) {
      var location = _.locationList[i]
      this.addCommand(location.locationName, location.locationName);
    }
  };

  // Window_TransportList.prototype.refresh = function () {

  // };

  // Window_TransportList.prototype.drawItem = function (index) {

  // };

  function Window_TransportInfo() {
    this.initialize.apply(this, arguments);
  };

  //--------------------------------------------------------------------
  //Window_Transport Info - Manages the information window for the transport system
  //--------------------------------------------------------------------
  Window_TransportInfo.prototype = Object.create(Window_Base.prototype);
  Window_TransportInfo.prototype.constructor = Window_TransportInfo;

  Window_TransportInfo.prototype.initialize = function (x, y, width, height) {
    console.log('Opening Window_TransportInfo');
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    console.log(`x: ${this.x}, y: ${this.y}, width: ${this.width}, height: ${this.height}`);
    this.close();
  };

  //--------------------------------------------------------------------
  //Window_TransportPrompt - Handles the final prompt if they want to go
  //--------------------------------------------------------------------
  function Window_TransportPrompt() {
    this.initialize.apply(this, arguments);
  };

  Window_TransportPrompt.prototype = Object.create(Window_Command.prototype)
  Window_TransportPrompt.prototype.constructor = Window_TransportPrompt;

  Window_TransportPrompt.prototype.initialize = function () {
    Window_Command.prototype.initialize.call(this, 0, 0);
  };

  Window_TransportCommand.prototype.makeCommandList = function () {
    this.addCommand('Yes', 'readyTransfer');
    this.addCommand('No', 'cancel');
  };

  Window_TransportPromptMessage.prototype = Object.create(Window_Command.prototype)
  Window_TransportPromptMessage.prototype.constructor = Window_TransportPrompt;

  Window_TransportPromptMessage.prototype.initialize = function () {
    Window_Command.prototype.initialize.call(this, 0, 0);
  };

})(MJMJS.TransitRouteTeleport);
//END OF CODE