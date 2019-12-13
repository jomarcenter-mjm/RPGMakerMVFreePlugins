/*:
 * @plugindesc Ver. 1.0 Change the title menu as well modify the save data to only 1 save per game.
 * @author Jomarcenter-MJM
 *
 * @help 
 * Note this plugin will changed not just the title screen but also the save data system
 * 
 * --Version Information
 * >1.0 12/10/2019
 * Finished the plugin
 * 
 * >0.3 11/03/19
 * Added A empty windows to the right upon entering the main menu (no content yet)
 * now pressing continue will skip the load game window and will go straight to the game
 *
 * >0.2 10/25/19
 * added warning system
 * added customizable music
 *
 * >0.1 10/23/19
 * Initial Script created
 *
 *
 * --Copyright Information
 * if using this script please include the follwing people in the credits:
 * Jomarcenter-mjm
 * trapless
 * 
 * Special Thanks
 * trapless - for basically helping out in fixing some bugs like the image not showing
 * on the window and some bug fixes.
 *
 * This can be used in a commerical project regardless of content (including R18 games)
 *
 * This script is provided for free, any unthorized sales or distributions may result in legal actions
 *
 * Support me:
 * if you like my works you can donate to my ko-fi page ko-fi.com/jomarcentermjm
 *
 * @param <Basic Settings>
 * @default
 *
 * @param <Localization Settings>
 * @default
 *
 * @param Background Music
 * @parent <Basic Settings>
 * @type file
 * @dir audio/bgm
 *
 * @param Enable New Game Save Override Warning
 * @parent <Basic Settings>
 * @type boolean
 * @on YES
 * @off NO
 * @default true
 *
 * @param Allows Data Deletion
 * @parent <Basic Settings>
 * @type boolean
 * @on YES
 * @off NO
 * @default true
 *
 * @param Warning Message
 * @parent <Localization Settings>
 * @desc type in a warning message
 * @default WARNING: A existing save data exist,\n Are you sure you want to start a new game?
 *
 * @param Incorrect Data Message
 * @parent <Localization Settings>
 * @desc type in a incorrectData message
 * @default WARNING: This save data cannot be used in this game
 *
 * @param Deletion Warning Message
 * @parent <Localization Settings>
 * @desc type in a Deletion warning message
 * @default WARNING: Are you sure you want to delete this data?
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
 * @param Delete Save
 * @parent <Localization Settings>
 * @desc type in a text for "Delete Save"
 * @default Delete Save
 *
 * @param <Compatible MJMJS Plugin>
 * @default
 *
 * @param <Compatible Third-Party Plugin>
 * @default
 *
 */

//setup all the necessary tools

var MJMJS = MJMJS || {};
MJMJS.OneSaveDataSaveWindow = {};

MJMJS.OneSaveDataSaveWindow.Parameters = PluginManager.parameters('MJMJS_OneSaveDataInfoMenu');
MJMJS.OneSaveDataSaveWindow.AltBGM = String(MJMJS.OneSaveDataSaveWindow.Parameters["Background Music"]);
MJMJS.OneSaveDataSaveWindow.NewGameDataWarningActivate = JSON.parse(MJMJS.OneSaveDataSaveWindow.Parameters["Enable New Game Save Override Warning"]);
MJMJS.OneSaveDataSaveWindow.NewGameWarningMessage = String(MJMJS.OneSaveDataSaveWindow.Parameters["Warning Message"]);
MJMJS.OneSaveDataSaveWindow.IncorrectDataNoticeMessage = String(MJMJS.OneSaveDataSaveWindow.Parameters["Incorrect Data Message"]);
MJMJS.OneSaveDataSaveWindow.AllowDataDeletion = JSON.parse(MJMJS.OneSaveDataSaveWindow.Parameters["Allows Data Deletion"]);
MJMJS.OneSaveDataSaveWindow.DataDeletionWarning = String(MJMJS.OneSaveDataSaveWindow.Parameters["Deletion Warning Message"]);
MJMJS.OneSaveDataSaveWindow.LocLocation = String(MJMJS.OneSaveDataSaveWindow.Parameters["Location"]);
MJMJS.OneSaveDataSaveWindow.LocPlaytime = String(MJMJS.OneSaveDataSaveWindow.Parameters["Playtime"]);
MJMJS.OneSaveDataSaveWindow.LocLastSave = String(MJMJS.OneSaveDataSaveWindow.Parameters["Last Save"]);
MJMJS.OneSaveDataSaveWindow.LocDeleteSave = String(MJMJS.OneSaveDataSaveWindow.Parameters["Delete Save"]);
MJMJS.OneSaveDataSaveWindow.ver = 1.0;


//override maxSaveFiles
DataManager.maxSavefiles = function () {
    return 1;
};
_MJMDataManagerMakeSavefileInfo = DataManager.makeSavefileInfo;
//Change DataManager makeSavefileInfo
//Add additional content as please
DataManager.makeSavefileInfo = function () {
    var info = _MJMDataManagerMakeSavefileInfo.call(this);
    info.locName = $gameMap.displayName(); //get the name of the map (if any)

    return info;
};


(function () {
    var deductionxval = 30;
    var deductionyval = 15;
    var _MJMJStitleonesavecreateoverride = Scene_Title.prototype.create;

    Scene_Title.prototype.create = function () {
        _MJMJStitleonesavecreateoverride.call(this);
        DataManager.loadAllSavefileImages();
        this.createHelpWindow();
        if (DataManager.isThisGameFile(1)) {
            this.createSaveInformationWindow();
        }
    }

    Scene_Title.prototype.refresh = function () {

    }

    Scene_Title.prototype.createForeground = function () {
        this._gameTitleSprite = new Sprite(new Bitmap(Graphics.width, Graphics.height));
        this.addChild(this._gameTitleSprite);
    };

    Scene_Title.prototype.playMenuMusic = function () {
        AudioManager.playBgm(MJMJS.OneSaveDataSaveWindow.AltBGM);
        AudioManager.stopBgs();
        AudioManager.stopMe();
    }

    Scene_Title.prototype.commandContinue = function () {
        AudioManager.stopSe();
        SoundManager.playLoad();
        this._commandWindow.close();
        this._helpWindow.close();
        if (DataManager.isThisGameFile(1)) {
            this._dataWindow.close();
        }
        this.loadGame();
    };

    Scene_Title.prototype.commandDeleteData = function () {
        //for your anti-hacking protection
        this._commandWindow.close();
        this._helpWindow.close();
        this._dataWindow.close()
        SceneManager.goto(Scene_DeletionWarning);
    };

    Scene_Title.prototype.loadGame = function () {
        this.fadeOutAll();
        if (DataManager.loadGame(1)) {
            $gamePlayer.reserveTransfer($gameMap.mapId(), $gamePlayer.x, $gamePlayer.y);
            $gamePlayer.requestMapReload();
            SceneManager.goto(Scene_Map);
        }
    }

    Scene_Title.prototype.commandNewGame = function () {
        this._commandWindow.close();
        this._helpWindow.close();
        if (DataManager.isThisGameFile(1)) {
            this._dataWindow.close();
        }
        var saveDataExist = DataManager.isAnySavefileExists();
        if (saveDataExist == true) {
            SceneManager.goto(Scene_DataWarning);
        } else {
            DataManager.setupNewGame();
            this.fadeOutAll();
            SceneManager.goto(Scene_Map);
        }
    };

    Scene_Title.prototype.commandOptions = function () {
        this._commandWindow.close();
        if (DataManager.isThisGameFile(1)) {
            this._dataWindow.close();
        }
        this._helpWindow.close();
        SceneManager.push(Scene_Options);
    };

    Scene_Title.prototype.createHelpWindow = function() {
        this._helpWindow = new Window_Help(2);
        this._helpWindow.y = Graphics.boxHeight - this._helpWindow.height - deductionyval;
        this._helpWindow.width = Graphics.boxWidth - deductionxval;
        this._helpWindow.x = deductionxval / 2;
        this._helpWindow.setText(this.helpWindowText());
        this.addWindow(this._helpWindow);
    };

    Scene_Title.prototype.helpWindowText = function () {
        return '';
    };

    MJMJS_Scene_Title_prototype_CreateCommandWindow = Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow = function () {
        this._commandWindow = new Window_TitleCommand();
        this._commandWindow.setHandler('newGame', this.commandNewGame.bind(this));
        this._commandWindow.setHandler('continue', this.commandContinue.bind(this));
        this._commandWindow.setHandler('options', this.commandOptions.bind(this));
        this._commandWindow.setHandler('deleteData', this.commandDeleteData.bind(this));
        this.addWindow(this._commandWindow);
    };

    Scene_Title.prototype.createSaveInformationWindow = function () {
        var x = 380 + deductionxval;
        var y = 20;
        var width = Graphics.boxWidth - x - deductionxval;
        var height = 260;
        this._dataWindow = new Window_SaveInfo(x, y, width, height);
        this._dataWindow.setUpGameData(0);
        this.addWindow(this._dataWindow);
    }

    function Scene_DeletionWarning() {
        this.initialize.apply(this, arguments);
    }
    //Scene_deletion Warning
    Scene_DeletionWarning.prototype = Object.create(Scene_MenuBase.prototype);

    Scene_DeletionWarning.prototype.initialize = function () {
        Scene_MenuBase.prototype.initialize.call(this);
    };

    Scene_DeletionWarning.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        this.createHelpWindow();
        this.createCommandWindow();
    }

    Scene_DeletionWarning.prototype.deletionWarningMessage = function () {
        return MJMJS.OneSaveDataSaveWindow.DataDeletionWarning;
    };

    Scene_DeletionWarning.prototype.createHelpWindow = function () {
        this._helpWindow = new Window_Help(2);
        this._helpWindow.y = Graphics.boxHeight - this._helpWindow.height - deductionyval;
        this._helpWindow.width = Graphics.boxWidth - deductionxval;
        this._helpWindow.x = deductionxval / 2;
        this._helpWindow.setText(this.deletionWarningMessage());
        this.addWindow(this._helpWindow);
    };

    Scene_DeletionWarning.prototype.deleteData = function () {
        if (MJMJS.OneSaveDataSaveWindow.AllowDataDeletion) {
            StorageManager.remove(1);
            SceneManager.goto(Scene_Title);
        }
    }

    Scene_DeletionWarning.prototype.createCommandWindow = function () {
        this._commandWindow = new Window_SaveDataDeletionWarning();
        this._commandWindow.setHandler('deleteData', this.deleteData.bind(this));
        this._commandWindow.setHandler('cancel', this.returnTotitle.bind(this));
        this.addWindow(this._commandWindow);
    };

    Scene_DeletionWarning.prototype.returnTotitle = function () {
        SceneManager.goto(Scene_Title);
    }
    //--------------------------------
    function Scene_DataWarning() {
        this.initialize.apply(this, arguments);
    }
    Scene_DataWarning.prototype = Object.create(Scene_MenuBase.prototype);

    Scene_DataWarning.prototype.initialize = function () {
        Scene_MenuBase.prototype.initialize.call(this);
    };

    Scene_DataWarning.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        this.createHelpWindow();
        this.createCommandWindow();
    }

    Scene_DataWarning.prototype.saveDataWarningMessage = function () {
        return MJMJS.OneSaveDataSaveWindow.NewGameWarningMessage;
    };

    Scene_DataWarning.prototype.createHelpWindow = function () {
        this._helpWindow = new Window_Help();
        this._helpWindow.y = Graphics.boxHeight - this._helpWindow.height - deductionyval;
        this._helpWindow.width = Graphics.boxWidth - deductionxval;
        this._helpWindow.x = deductionxval / 2;
        this._helpWindow.setText(this.saveDataWarningMessage());
        this.addWindow(this._helpWindow);
    };

    //Scene_DataWarning
    Scene_DataWarning.prototype.createCommandWindow = function () {
        this._commandWindow = new Window_NewGameDataWarning();
        this._commandWindow.setHandler('newGame', this.startGame.bind(this));
        this._commandWindow.setHandler('cancel', this.returnTotitle.bind(this));
        this.addWindow(this._commandWindow);
    };

    Scene_DataWarning.prototype.returnTotitle = function () {
        SceneManager.goto(Scene_Title);
    }
    Scene_DataWarning.prototype.startGame = function () {
        DataManager.setupNewGame();
        this._commandWindow.close();
        this.fadeOutAll();
        SceneManager.goto(Scene_Map);
    }
    //override title Command
    Window_TitleCommand.prototype.initialize = function () {
        Window_Command.prototype.initialize.call(this, 0, 0);
        this.updatePlacement();
        this.selectLast();
    };

    //override updatePlacement
    Window_TitleCommand.prototype.updatePlacement = function () {
        this.y = 20;
        this.x = deductionxval / 2;
    };

    var MJMJS_Windows_TitleCommand = Window_TitleCommand.prototype.makeCommandList;
    Window_TitleCommand.prototype.makeCommandList = function () {
        MJMJS_Windows_TitleCommand.call(this);
        if (MJMJS.OneSaveDataSaveWindow.AllowDataDeletion && DataManager.isThisGameFile(1)) {
            this.addCommand(MJMJS.OneSaveDataSaveWindow.LocDeleteSave, 'deleteData');
        }
    }

    //DeletionWarning
    function Window_SaveDataDeletionWarning() {
        this.initialize.apply(this, arguments);
    }

    Window_SaveDataDeletionWarning.prototype = Object.create(Window_Command.prototype);
    Window_SaveDataDeletionWarning.prototype.constructor = Window_SaveDataDeletionWarning;

    Window_SaveDataDeletionWarning.prototype.initialize = function () {
        this.updatePlacement();
    }

    Window_SaveDataDeletionWarning.prototype.updatePlacement = function () {
        Window_Command.prototype.initialize.call(this, 0, 0);
        this.y = 20;
        this.x = deductionxval / 2;
    };

    Window_SaveDataDeletionWarning.prototype.makeCommandList = function () {
        this.addCommand(MJMJS.OneSaveDataSaveWindow.LocDeleteSave, 'deleteData');
        this.addCommand(TextManager.cancel, 'cancel');
    }

    //Window_DataWarning 
    function Window_NewGameDataWarning() {
        this.initialize.apply(this, arguments);
    }

    Window_NewGameDataWarning.prototype = Object.create(Window_Command.prototype);
    Window_NewGameDataWarning.prototype.constructor = Window_NewGameDataWarning;

    Window_NewGameDataWarning.prototype.initialize = function () {
        this.updatePlacement();
    }

    Window_NewGameDataWarning.prototype.updatePlacement = function () {
        Window_Command.prototype.initialize.call(this, 0, 0);
        this.y = 20;
        this.x = deductionxval / 2;
    };

    Window_NewGameDataWarning.prototype.makeCommandList = function () {
        this.addCommand(TextManager.newGame, 'newGame');
        this.addCommand(TextManager.cancel, 'cancel');
    }

    //NEW ADDON - Window_SaveInfo
    //This function to show the single save data status This is used for loading and saving
    function Window_SaveInfo() {
        this.initialize.apply(this, arguments);
    }

    Window_SaveInfo.prototype = Object.create(Window_Base.prototype);

    Window_SaveInfo.prototype.constructor = Window_SaveInfo;

    Window_SaveInfo.prototype.initialize = function (x, y, width, height) {
        Window_Base.prototype.initialize.call(this, x, y, width, height);
    };

    Window_SaveInfo.prototype.setMode = function (mode) {
        this._mode = mode;
    }

    Window_SaveInfo.prototype.setUpGameData = function (index) {
        var id = index + 1;
        var valid = DataManager.isThisGameFile(id);
        var info = DataManager.loadSavefileInfo(id);
        this.printInformation(info, valid);
    }


    Window_SaveInfo.prototype.printInformation = function (info, valid) {
        console.log(info.playtime);
        console.log(info.characters);
        this.drawGameTitle(info, 0, 0);
        this.getLastSaveDate(info, 0, this.lineHeight());
        this.drawPlaytime(info, 0, this.lineHeight() * 3);
        this.getLocationName(info, 0, this.lineHeight() * 2);
        this.drawPartyCharacters(info, 28, this.lineHeight() * 6);
        console.log(info.locName);
    }

    Window_SaveInfo.prototype.getLocationName = function (info, x, y, width) {
        if (info.locName) {
            this.drawText("Location: " + info.locName, x, y);
        }
    }

    Window_SaveInfo.prototype.getLastSaveDate = function (info, x, y, width) {
        if (info.timestamp) {
            this.drawText(MJMJS.OneSaveDataSaveWindow.LocLastSave + info.timestamp, x, y);
        }
    }

    Window_SaveInfo.prototype.drawPlaytime = function (info, x, y, width) {
        if (info.playtime) {
            this.drawText(MJMJS.OneSaveDataSaveWindow.LocPlaytime + info.playtime, x, y);
        }
    };

    Window_SaveInfo.prototype.drawPartyCharacters = function (info, x, y) {
        if (info.characters) {

            for (var i = 0; i < info.characters.length; i++) {
                var data = info.characters[i];
                this.drawCharacter(data[0], data[1], x + i * 48, y);
            }
        }
    };

    Window_SaveInfo.prototype.drawCharacter = function (characterName, characterIndex, x, y) {
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

    Window_SaveInfo.prototype.drawGameTitle = function (info, x, y, width) {
        if (info.title) {
            this.drawText(info.title, x, y);
        }
    };

    //Scene_Save - this modify the save functionality
})();