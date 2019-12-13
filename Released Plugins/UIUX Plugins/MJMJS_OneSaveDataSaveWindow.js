//Generated using MJM's RPG Maker MV Generator Extension - its ok to delete this line
    
/*: 
 * @plugindesc This is a additional plugin for OneSaveDataInfoMenu
 * @author Jomarcenter-MJM
 * 
 * @help
 * this plugin is recomended if useing MJMJS_OneSaveDataInfoMenu.js but not
 * required. you can use a third party plugin to replace the default save window
 * 
 * Changes WARNING:
 * this plugin does not modify the Scene_File, Scene_Save, Scene_Load
 * functions in code instead this plugin uses a brand new function
 * for this purpose.
 * 
 * If using third-party plugin please use "SceneManager.push(Scene_OneSaveData)"
 * in code.
 * 
 * 
 * -- Version History
 * >1.0 12/10/2019
 * Finished the plugin
 * 
 * --Copyright Information
 * if using this script please include the follwing people in the credits:
 * Jomarcenter-mjm
 * trapless
 * 
 * Special thanks:
 * trapless - for basically helping out in fixing some bugs like the image not showing
 * on the window and some bug fixes back in the MJMJS_OneSaveDataInfoMenu.js plugin.
 * 
 * Support me:
 * if you like my works you can donate to my ko-fi page ko-fi.com/jomarcentermjm
 * 
 * If using third-party plugin please use "SceneManager.push(Scene_OneSaveData)"
 * in code.
 * @param <Basic Settings>
 * @default
 *
 * @param <Localization Settings>
 * @default
 *
 * @param Save Game Message
 * @parent <Localization Settings>
 * @desc type in a Deletion warning message
 * @default Do you want to save the game?
 * 
 * @param Overwrite Warning Message
 * @parent <Localization Settings>
 * @desc type in a Deletion warning message
 * @default There already a save data. Are you sure you want to overwrite this data?
 *
 * @param Location
 * @parent <Localization Settings>
 * @desc type in a text for "Location"
 * @default Location: 
 *
 * @param Playtime
 * @parent <Localization Settings>
 * @desc type in a text for "Playtime"
 * @default Playtime: 
 *
 * @param Last Save
 * @parent <Localization Settings>
 * @desc type in a text for "Last Save"
 * @default Last save: 
 * 
 * @param Yes Option
 * @parent <Localization Settings>
 * @desc type in a text for "Yes"
 * @default Yes
 * 
* @param No Option
 * @parent <Localization Settings>
 * @desc type in a text for "No"
 * @default No
 *
 */
var MJMJS = MJMJS || {};
MJMJS.OneSaveDataSaveMenu = {};
MJMJS.OneSaveDataSaveMenu.Parameters = PluginManager.parameters('MJMJS_OneSaveDataSaveWindow');

MJMJS.OneSaveDataSaveMenu.LocOverwriteWarning = String(MJMJS.OneSaveDataSaveMenu.Parameters["Overwrite Warning Message"]);
MJMJS.OneSaveDataSaveMenu.LocSaveMessage = String(MJMJS.OneSaveDataSaveMenu.Parameters["Save Game Message"]);
MJMJS.OneSaveDataSaveMenu.LocLocation = String(MJMJS.OneSaveDataSaveMenu.Parameters["Location"]);
MJMJS.OneSaveDataSaveMenu.LocPlaytime = String(MJMJS.OneSaveDataSaveMenu.Parameters["Playtime"]);
MJMJS.OneSaveDataSaveMenu.LocLastSave = String(MJMJS.OneSaveDataSaveMenu.Parameters["Last Save"]);
MJMJS.OneSaveDataSaveMenu.LocYesOption = String(MJMJS.OneSaveDataSaveMenu.Parameters["Yes Option"]);
MJMJS.OneSaveDataSaveMenu.LocNoOption = String(MJMJS.OneSaveDataSaveMenu.Parameters["No Option"]);

(function(){
    var deductionxval = 30;
    var deductionyval = 15;
    //replaces the default command save
    
    Scene_Menu.prototype.commandSave = function() {
    SceneManager.push(Scene_OneSaveData);
    };

    function Scene_OneSaveData() {
        this.initialize.apply(this, arguments);
    }
    
    Scene_OneSaveData.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_OneSaveData.prototype.constructor = Scene_OneSaveData;

    Scene_OneSaveData.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
    }

    Scene_OneSaveData.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        DataManager.loadAllSavefileImages();
        if (DataManager.isThisGameFile(1)) {
            this.createSaveInformationWindow();
        }
        this.createHelpWindow();
        this.createCommandWindow();
    }

    Scene_OneSaveData.prototype.createHelpWindow = function() {
        this._helpWindow = new Window_Help(2);
        this._helpWindow.y = Graphics.boxHeight - this._helpWindow.height - deductionyval;
        this._helpWindow.width = Graphics.boxWidth - deductionxval;
        this._helpWindow.x = deductionxval / 2;
        this._helpWindow.setText(this.helpWindowText());
        this.addWindow(this._helpWindow);
    }

    Scene_OneSaveData.prototype.helpWindowText = function () {
        if (DataManager.isThisGameFile(1)) {
            return MJMJS.OneSaveDataSaveMenu.LocOverwriteWarning;
        }
        else {
            return MJMJS.OneSaveDataSaveMenu.LocSaveMessage;
        }
    };

    Scene_OneSaveData.prototype.createCommandWindow = function () {
        var x = this._helpWindow.x;
        var y = this._helpWindow.y - this._helpWindow.height;
        this._commandWindow = new Window_OverrideDataWarningMessage(x,y);
        this._commandWindow.setHandler('Yes', this.saveGame.bind(this));
        this._commandWindow.setHandler('No', this.cancelSave.bind(this));
        this.addWindow(this._commandWindow);
    };

    Scene_OneSaveData.prototype.cancelSave = function () {
        this.popScene();
    }

    Scene_OneSaveData.prototype.saveGame = function () {
        this.onSavefileOk();
    }

    Scene_OneSaveData.prototype.onSavefileOk = function() {
        $gameSystem.onBeforeSave();
        if (DataManager.saveGame(1)) {
            this.onSaveSuccess();
        } else {
            this.onSaveFailure();
        }
    };
    
    Scene_OneSaveData.prototype.onSaveSuccess = function() {
        SoundManager.playSave();
        StorageManager.cleanBackup(1);
        this.popScene();
    };
    
    Scene_OneSaveData.prototype.onSaveFailure = function() {
        SoundManager.playBuzzer();
        this.activateListWindow();
    };


    Scene_OneSaveData.prototype.createSaveInformationWindow = function () {
        var x = 380 + deductionxval;
        var y = 20;
        var width = Graphics.boxWidth - x - deductionxval;
        var height = 260;
        this._dataWindow = new Window_SaveInfoWindow(x, y, width, height);
        this._dataWindow.setUpGameData(0);
        this.addWindow(this._dataWindow);
    }


    function Window_OverrideDataWarningMessage()
    {
        this.initialize.apply(this, arguments);
    }
    Window_OverrideDataWarningMessage.prototype = Object.create(Window_Command.prototype);
    Window_OverrideDataWarningMessage.prototype.constructor = Window_OverrideDataWarningMessage;

    Window_OverrideDataWarningMessage.prototype.initialize = function (x,y) {
        this.updatePlacement(x,y);
    }

    Window_OverrideDataWarningMessage.prototype.updatePlacement = function (x,y) {
        Window_Command.prototype.initialize.call(this, x, y);
    };

    Window_OverrideDataWarningMessage.prototype.makeCommandList = function () {
        this.addCommand(MJMJS.OneSaveDataSaveMenu.LocYesOption, 'Yes');
        this.addCommand(MJMJS.OneSaveDataSaveMenu.LocNoOption, 'No');
    }

    //this code is from MJMJS_OneSaveDataInfoMenu.js
    function Window_SaveInfoWindow() {
        this.initialize.apply(this, arguments);
    }

    Window_SaveInfoWindow.prototype = Object.create(Window_Base.prototype);

    Window_SaveInfoWindow.prototype.constructor = Window_SaveInfoWindow;

    Window_SaveInfoWindow.prototype.initialize = function (x, y, width, height) {
        Window_Base.prototype.initialize.call(this, x, y, width, height);
    };

    Window_SaveInfoWindow.prototype.setMode = function (mode) {
        this._mode = mode;
    }

    Window_SaveInfoWindow.prototype.setUpGameData = function (index) {
        var id = index + 1;
        var valid = DataManager.isThisGameFile(id);
        var info = DataManager.loadSavefileInfo(id);
        this.printInformation(info, valid);
    }


    Window_SaveInfoWindow.prototype.printInformation = function (info, valid) {
        console.log(info.playtime);
        console.log(info.characters);
        this.drawGameTitle(info, 0, 0);
        this.getLastSaveDate(info, 0, this.lineHeight());
        this.drawPlaytime(info, 0, this.lineHeight() * 3);
        this.getLocationName(info, 0, this.lineHeight() * 2);
        this.drawPartyCharacters(info, 28, this.lineHeight() * 6);
        console.log(info.locName);
    }

    Window_SaveInfoWindow.prototype.getLocationName = function (info, x, y, width) {
        if (info.locName) {
            this.drawText("Location: " + info.locName, x, y);
        }
    }

    Window_SaveInfoWindow.prototype.getLastSaveDate = function (info, x, y, width) {
        if (info.timestamp) {
            this.drawText(MJMJS.OneSaveDataSaveMenu.LocLastSave + info.timestamp, x, y);
        }
    }

    Window_SaveInfoWindow.prototype.drawPlaytime = function (info, x, y, width) {
        if (info.playtime) {
            this.drawText(MJMJS.OneSaveDataSaveMenu.LocPlaytime + info.playtime, x, y);
        }
    };

    Window_SaveInfoWindow.prototype.drawPartyCharacters = function (info, x, y) {
        if (info.characters) {

            for (var i = 0; i < info.characters.length; i++) {
                var data = info.characters[i];
                this.drawCharacter(data[0], data[1], x + i * 48, y);
            }
        }
    };

    Window_SaveInfoWindow.prototype.drawCharacter = function (characterName, characterIndex, x, y) {
        var bitmap = ImageManager.loadCharacter(characterName);
        bitmap.addLoadListener(function () {
            var big = ImageManager.isBigCharacter(characterName);
            var pw = bitmap.width / (big ? 3 : 12);
            var ph = bitmap.height / (big ? 4 : 8);
            var n = big ? 0 : characterIndex;
            var sx = (n % 4 * 3 + 1) * pw;
            var sy = (Math.floor(n / 4) * 4) * ph;
            this.contents.blt(bitmap, sx, sy, pw, ph, x - pw / 2, y - ph);
        }.bind(this, bitmap, characterName, x, y));
    };

    Window_SaveInfoWindow.prototype.drawGameTitle = function (info, x, y, width) {
        if (info.title) {
            this.drawText(info.title, x, y);
        }
    };

})();