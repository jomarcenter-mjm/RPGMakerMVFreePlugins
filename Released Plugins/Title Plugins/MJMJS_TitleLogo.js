//Generated using MJM's RPG Maker MV Generator Extension - its ok to delete this line
    
/*: 
* @plugindesc Instead of using the title text, replaces it with your own game logo
* @author Jomarcenter-MJM
* 
* @help No plugin command needed
*
* Please insert the logo at the 'img/system' folder
* Its is recomeded to disable draw title screen at the database
*
* --Version Information
* >1.0
* Initial Script created
*
* --Copyright Information
* if using this script please include "Jomarcenter-MJM" in the credits
* This can be used Commercially regardless of Game's Content (this includes R-18 content)
*
* We also provide compatability fix or additional feature
* This script is provided free any unthorized sales or distributions may result in legal actions
* 
* @param Game Logo
* @desc Game logo 
* @type file
* @dir img/system
* @default logo
*
* @param enable Advance Position
* @desc allows to move the logo anywhere in the screen
* @type boolean
* @default true
* @on yes
* @off no
*
* @param X position
* @desc xposition of the logo
* @type number
* @default 1
*
* @param Y Position
* @desc yPosition of the Logo
* @type number
* @default 1
*
*/

(function(){
var parameters = PluginManager.parameters('MJMJS_TitleLogo');
var xPos = Number(parameters['X position']);
var yPos = Number(parameters['Y Position']);
var eap = JSON.parse(parameters['enable Advance Position']);
var gameLogo = String(parameters['Game Logo']);
console.log(gameLogo);
var _MJMJStitlelogocreateoverride = Scene_Title.prototype.create;
Scene_Title.prototype.create = function()
{
    _MJMJStitlelogocreateoverride.call(this);
    this.createLogo();
}

Scene_Title.prototype.drawLogo = function() {
    if (eap) {
        var x = xPos;
        var y = yPos;
    }
    else
    {
        var x = Graphics.width / 2;
        var y = Graphics.height / 4;
    }
    this._gameLogo.anchor.x = 0.5;
    this._gameLogo.anchor.y = 0.5;
    this._gameLogo.x = x;
    this._gameLogo.y = y;
    this.addChild(this._gameLogo);
};

Scene_Title.prototype.createLogo = function() {
    this._gameLogo = new Sprite(ImageManager.loadSystem(gameLogo));
    this.drawLogo();
};

})();