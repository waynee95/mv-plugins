/* globals WAY, WAYModuleLoader */
// ===========================================================================
// WAY_MenuBackgrounds.js
// ===========================================================================

/*:
@plugindesc v1.0.0 Add pictures as backgrounds to menus. <WAY_MenuBackgrounds>

@param backgrounds
@text Custom Backgrounds
@desc Add custom backgrounds to a menu
@type struct<CustomBackground>[]
@default []

@author waynee95

@help
Common Scene names include:
Scene_Menu
Scene_Item
Scene_Equip
Scene_Skill
Scene_Status
Scene_Shop
Scene_Options
Scene_Save
Scene_Load
...

You can find the name of a scene inside the plugin file. Just search for
Scene_ and add this to the plugin parameters. This will work for most
plugins.

You should place this plugin at the bottom in the PluginManager.

=============================================================================
 ■ Terms of Use
=============================================================================
This work is licensed under the MIT license.

More info here: https://github.com/waynee95/mv-plugins/blob/master/LICENSE

=============================================================================
 ■ Contact Information
=============================================================================
Forum Link: https://forums.rpgmakerweb.com/index.php?members/waynee95.88436/
Website: http://waynee95.me/
Discord Name: waynee95#4261

You can support me on https://ko-fi.com/waynee.
*/
"use strict";

if (typeof WAY === "undefined") {
  console.error("You need to install WAY_Core!"); // eslint-disable-line no-console

  if (Utils.isNwjs() && Utils.isOptionValid("test")) {
    var gui = require("nw.gui"); // eslint-disable-line


    gui.Window.get().showDevTools();
  }

  SceneManager.stop();
} else {
  WAYModuleLoader.registerPlugin("WAY_MenuBackgrounds", "1.0.1", "waynee95", {
    name: "WAY_Core",
    version: ">= 2.0.0"
  });
}

(function ($) {
  $.parameters.backgrounds.forEach(function (_ref) {
    var sceneName = _ref.sceneName,
        background = _ref.background;

    if (sceneName && background) {
      eval(sceneName).prototype.createBackground = function () {
        this._backgroundSprite = new Sprite();
        this._backgroundSprite.bitmap = ImageManager.loadPicture(background);
        this.addChild(this._backgroundSprite);
      };
    }
  });
})(WAYModuleLoader.getModule("WAY_MenuBackgrounds")); //-----------------------------------------------------------------------------
//

/*~struct~CustomBackground:
@param sceneName
@text Scene Name
@type text
@default

@param background
@text Background Picture
@type file
@dir img/pictures
@default
*/