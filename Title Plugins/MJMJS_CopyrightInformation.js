/*:
* @plugindesc Ver. 1.0 Show copyright information on the bottom of the screen in the main menu.
* @author Jomarcenter-MJM
*
* @help This plugin does not use any plugin commands
* 
* --Version Information
* >1.0 10/13/19
* Initial Script created
*
* >1.0.1 10/14/19
* Fixed a bug that I would facepalm for not noticeing just now
*
* --Copyright Information
* if using this script please include "Jomarcenter-MJM" in the credits
* This can be used Commercially regardless of Game's Content (this includes R-18 content)
*
* This script is provided free any unthorized sales or distributions may result in legal actions
* 
*
* @param <Basic Settings>
* @default
*
* @param Text Size
* @parent <Basic Settings>
* @type number
* @desc the size of the text to render
* @min 10
* @default 18
*
* @param Copyright Text
* @parent <Basic Settings>
* @desc Copyright text
* @default 192 Central Works, All rights Reserved.
*
* @param Copyright icon
* @parent <Basic Settings>
* @desc write Copyright © on the beginning of the text
* @default Copyright ©
*
* @param Copyright year
* @parent <Basic Settings>
* @desc Copyright Year
* @default 2015
*
* @param Add All rights Reserve
* @parent <Basic Settings>
* @desc Do you want to include the all rights reserve text at the end
* @type boolean
* @on YES
* @off NO
* @default true
*
* @param All rights reserved
* @parent Add All rights Reserve
* @desc All rights reserved
* @default All rights reserved
*
* @param Enable Publisher Text
* @parent <Basic Settings>
* @type boolean
* @on YES
* @off NO
* @default false
*
* @param Publisher Text
* @parent Enable Publisher Text
* @desc (Optional) the name of the publishing company
* @default Licensed to and Published by SciLib Gaming Corporation
* 
* 
*/ 

(function(){
    var parameters = PluginManager.parameters('MJMJS_CopyrightInformation');
    var textSize = Number(parameters['Text Size']);
    var copyrightText = String(parameters['Copyright Text']);
    var copyrightIcon = String(parameters['Copyright icon']);
    var copyrightYear = String(parameters['Copyright year']);
    var enableRights = String(parameters['Add All rights Reserve']);
    enableRights = eval(enableRights);
    var copyrightAAR = String(parameters['All rights reserved']);
    var enablePublishing = String(parameters['Enable Publisher Text']);
    enablePublishing = eval(enablePublishing);
    var publishingText = String(parameters['Publisher Text']);

    console.log("Copyright Information: " + copyrightIcon + copyrightYear + copyrightText + " " + publishingText);

    //Intialize

    //----------------------
    //Window_CopyrightInfo
    //----------------------
    var _MJMJStitlecopyrightcreateoverride = Scene_Title.prototype.create;
    Scene_Title.prototype.create = function()
    {
        _MJMJStitlecopyrightcreateoverride.call(this);
        this.createCopyrightInfo();
    }

    //Create the bitmap sprite for the copyright text
    Scene_Title.prototype.createCopyrightInfo = function() {
        this._gameCopyrightInfo = new Sprite(new Bitmap(Graphics.width, Graphics.height));
        this.addChild(this._gameCopyrightInfo);
        this.drawCopyrightInfo();
    };
    
    //setup and print out the copyright information below
    Scene_Title.prototype.drawCopyrightInfo = function() {
        var x = 20;
        var y = Graphics.height - 50;
        var maxWidth = Graphics.width - x * 2;
        var text = copyrightIcon + " " + copyrightYear + " " + copyrightText;
        //Add the all right reserved copyright info
        if (enableRights == true) {
            text += " " + copyrightAAR;
        }
        //Add publisher information
        if (enablePublishing == true) {
            text += " " + publishingText;
        } 
    
        this._gameTitleSprite.bitmap.outlineColor = 'black';
        this._gameTitleSprite.bitmap.outlineWidth = 8;
        this._gameCopyrightInfo.bitmap.fontSize = textSize;
        this._gameCopyrightInfo.bitmap.drawText(text, x, y, maxWidth, 48, 'center');
    }

})();