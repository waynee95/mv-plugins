/* globals WAY, WAYModuleLoader */
//=============================================================================
// WAY_Achievements.js
//=============================================================================

/*:
@plugindesc v1.4.0 This plugin allows you to create Achievements to your game. <WAY_Achievements>

@author waynee95

@param frameInterval
@text Frame Interval
@desc This interval specifies how often all achievements will be checked in the background.
@type number
@default 120

@param achievementList
@text Achievement List
@type struct<Achievement>[]
@default

@param commandName
@text Menu Command Name
@type text
@default Achievements

@param disablePopups
@text Disable Popups
@type boolean
@default false

@param showCommand
@text Show in Main Menu
@type boolean
@default true

@param background
@text Menu Background
@type file
@dir img/pictures
@default

@param titleText
@text Scene Title
@type text
@default \i[87]Achievements

@param pointsTitle
@text Points Window Text
@type text
@desc %1 = current , %2 = max
@default %1 of %2 \i[87]

@param categories
@text Achievement Categories
@type []
@default ["all"]

@param notifyMessage
@text Notify Message
@type text
@desc %1 = Name, %2 = Points
@default \i[2]Unlocked: %1 - %2 Points!

@param notifyShowFrames
@text Notify Show Frames
@type number
@min 1
@default 100

@param notifySound
@text Notify Sound
@type struct<Sound>
@default

@param notifyWindowX
@text Notify Window X
@type number
@default 0

@param notifyWindowY
@text Notify Window Y
@type number
@default 0

@param notifyWindowWidth
@text Notify Window Width
@type number
@default 400

@param notifyWindowHeight
@text Notify Window Height
@type number
@default 72

@param notifyWindowSkin
@text Notify Window Skin
@type file
@dir img/system
@default Window

@help
==============================================================================
 ■ Usage
==============================================================================

>>> This plugin uses the new MV1.5.0 Plugin Parameter, so I recommend you to
update your editor. Your project can still be lower than MV1.5.0

Make sure to have WAY_Core installed and place this plugin below it.

How to add an achievement to the game:
1. Open the plugin in the Plugin Manager
2. Click on the Achievement List parameter
3. Click on an empty slot
4. Now you can create an achivement
*   Category Name: The category this achievement should appear in. (Note: You
*                  can have an achievement be part of multiple categories, just
*                  seperate each category by a space)
*   Name: The name of the achievement.
*   Hidden Achievement: Whether this achievement will be visible
*                       in the menu before it's unlocked.
*   Points: How many points this achievement has. More on points later.
*   Complete Icon: The icon that appears when the achievement is completed.
*   Incomplete Icon: The icon that appears when the achievement is not completed yet.
*   Description: I think this is obvious c:
*   Condition: The condition requirement to get this achievement. You can use
*              any JavaScript code you like, think of it as an IF-Statement.
*
*              Examples:
*              $gameParty.gold() >= 1000
*              $gameSystem.battleCount() >= 10
*              $gameSwitches.value(10)
*              !$gameSwitches.value(10) (You can use the negation operator)
*              $gameSwitches.value(1) && !$gameSwitches.value(2) (You can also chain conditions)
*              $gameVariables.value(2) >= 340
*              $gameActors.actor(1).level >= 20
*              $gameParty.hasItem($dataItems[ID])
*              $gameParty.hasItem($dataWeapons[ID])
*              $gameParty.hasItem($dataArmors[ID])
*              ... etc
*
*   On Complete Common Event: Specify a common event that will be executed once
*                             the achievement is completed. This is optional.

What are points?
Points don't have any specific functionality. The player will be rewarded with
the amount of points specified in each achievement. You could just reward 1 point
for each achievement and then they serve as a counter to see how many achievements
are left, or you can check in-game how many points the player already earned and
give rewards. You can get the current amount of points with the Scriptcall:
$gameAchievements.currentPoints()

==============================================================================
 ■ Plugin Commands
==============================================================================
Main Keyword: Achievements

-----------------------
Achievements enablePopups
-----------------------
You can use this to command to enable popups.

-----------------------
Achievements disablePopups
-----------------------
You can use this command to disable popups.

===============================================================================
 ■ YEP MainMenuManager
===============================================================================
      Name: "Achievements"
    Symbol: achievements
      Show:
   Enabled:
       Ext:
 Main Bind: this.commandAchievements.bind(this)
Actor Bind:

==============================================================================
 ■ Terms of Use
==============================================================================
This work is licensed under the MIT license.

More info here: https://github.com/waynee95/mv-plugins/blob/master/LICENSE

==============================================================================
 ■ Contact Information
==============================================================================
Forum Link: https://forums.rpgmakerweb.com/index.php?members/waynee95.88436/
Website: http://waynee95.me/
Discord Name: waynee95#4261

You can support me at https://ko-fi.com/waynee95
*/
"use strict";

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

if (typeof WAY === "undefined") {
  console.error("You need to install WAY_Core!"); // eslint-disable-line no-console

  if (Utils.isNwjs() && Utils.isOptionValid("test")) {
    var gui = require("nw.gui"); //eslint-disable-line


    gui.Window.get().showDevTools();
  }

  SceneManager.stop();
} else {
  WAYModuleLoader.registerPlugin("WAY_Achievements", "1.4.0", "waynee95", {
    name: "WAY_Core",
    version: ">= 2.0.0"
  });
}

var $gameAchievements = null; //eslint-disable-line

(function ($) {
  var TitleWindow = WAY.Window.TitleWindow;
  var _$$parameters = $.parameters,
      frameInterval = _$$parameters.frameInterval,
      background = _$$parameters.background,
      commandName = _$$parameters.commandName,
      categories = _$$parameters.categories,
      pointsTitle = _$$parameters.pointsTitle,
      notifyWindowSkin = _$$parameters.notifyWindowSkin,
      _$$parameters$notifyS = _$$parameters.notifySound,
      notifySound = _$$parameters$notifyS === void 0 ? {} : _$$parameters$notifyS,
      notifyMessage = _$$parameters.notifyMessage,
      notifyShowFrames = _$$parameters.notifyShowFrames,
      notifyWindowX = _$$parameters.notifyWindowX,
      notifyWindowY = _$$parameters.notifyWindowY,
      notifyWindowWidth = _$$parameters.notifyWindowWidth,
      notifyWindowHeight = _$$parameters.notifyWindowHeight,
      showCommand = _$$parameters.showCommand,
      titleText = _$$parameters.titleText;
  var _disablePopups = $.parameters.disablePopups;
  var $dataAchievements = [null].concat($.parameters.achievementList); //===========================================================================
  // Game_Achievement
  //===========================================================================

  var Game_Achievement = /*#__PURE__*/function () {
    function Game_Achievement(id) {
      _classCallCheck(this, Game_Achievement);

      this.category = "";
      this.id = id;
      this.hidden = false;
      this.isCompleted = false;
      this.completeIcon = 0;
      this.condition = "";
      this.description = "";
      this.notCompletedDescription = "";
      this.incompleteIcon = 0;
      this.name = "";
      this.points = 0;
      this.onCompleteCommonEvent = 0;
    }

    _createClass(Game_Achievement, [{
      key: "check",
      value: function check() {
        return eval(this.condition); // eslint-disable-line no-eval
      }
    }]);

    return Game_Achievement;
  }(); //===========================================================================
  // Game_Achievements
  //===========================================================================


  var Game_Achievements = /*#__PURE__*/function () {
    function Game_Achievements(data) {
      _classCallCheck(this, Game_Achievements);

      if (!data) {
        this._data = $dataAchievements.map(function (achievement, index) {
          return Object.assign(new Game_Achievement(index), achievement);
        });
      } else {
        this._data = data.map(function (achievement, index) {
          return Object.assign(new Game_Achievement(index), achievement);
        });
      }

      this._notifyQueue = [];
    }

    _createClass(Game_Achievements, [{
      key: "achievement",
      value: function achievement(id) {
        if (_typeof($dataAchievements[id]) !== "object") {
          return null;
        }

        if ($dataAchievements[id]) {
          return this._data[id];
        }

        return null;
      }
    }, {
      key: "update",
      value: function update() {
        var _this = this;

        this._data.forEach(function (achievement) {
          if (achievement && !achievement.isCompleted && achievement.check()) {
            achievement.isCompleted = true;

            if (achievement.onCompleteCommonEvent) {
              var commonEventId = achievement.onCompleteCommonEvent;
              $gameTemp.reserveCommonEvent(commonEventId);
            }

            _this._notifyQueue.push(achievement);
          }
        });
      }
    }, {
      key: "currentPoints",
      value: function currentPoints() {
        return this._data.filter(function (achievement) {
          return achievement.isCompleted;
        }).map(function (achievement) {
          return achievement.points;
        }).reduce(function (acc, value) {
          return acc + value;
        }, 0);
      }
    }, {
      key: "maxPoints",
      value: function maxPoints() {
        return this._data.map(function (achievement) {
          return achievement.points;
        }).reduce(function (acc, value) {
          return acc + value;
        }, 0);
      }
    }]);

    return Game_Achievements;
  }(); //===========================================================================
  // Window_AchievementCategories
  //===========================================================================


  var Window_AchievementCategories = /*#__PURE__*/function (_Window_Command) {
    _inherits(Window_AchievementCategories, _Window_Command);

    var _super = _createSuper(Window_AchievementCategories);

    function Window_AchievementCategories(y) {
      var _this2;

      _classCallCheck(this, Window_AchievementCategories);

      _this2 = _super.call(this, 0, y);

      _this2.select(0);

      return _this2;
    }
    /* eslint-disable */


    _createClass(Window_AchievementCategories, [{
      key: "windowWidth",
      value: function windowWidth() {
        return Graphics.boxWidth;
      }
    }, {
      key: "itemAlign",
      value: function itemAlign() {
        return "center";
      }
    }, {
      key: "numVisibleRows",
      value: function numVisibleRows() {
        return 1;
      }
    }, {
      key: "maxCols",
      value: function maxCols() {
        return 4;
      }
      /* eslint-enable */

    }, {
      key: "windowHeight",
      value: function windowHeight() {
        return this.fittingHeight(this.numVisibleRows());
      }
    }, {
      key: "makeCommandList",
      value: function makeCommandList() {
        var _this3 = this;

        categories.forEach(function (command) {
          _this3.addCommand(command, command);
        });
      }
    }, {
      key: "update",
      value: function update() {
        _get(_getPrototypeOf(Window_AchievementCategories.prototype), "update", this).call(this);

        if (this._itemWindow) {
          this._itemWindow.setCategory(this.currentSymbol());
        }
      }
    }, {
      key: "setItemWindow",
      value: function setItemWindow(itemWindow) {
        this._itemWindow = itemWindow;
        this.update();
      }
    }]);

    return Window_AchievementCategories;
  }(Window_Command); //===========================================================================
  // Window_AchievementList
  //===========================================================================


  var Window_AchievementList = /*#__PURE__*/function (_Window_ItemList) {
    _inherits(Window_AchievementList, _Window_ItemList);

    var _super2 = _createSuper(Window_AchievementList);

    function Window_AchievementList(x, y, width, height) {
      var _this4;

      _classCallCheck(this, Window_AchievementList);

      _this4 = _super2.call(this, x, y, width, height);
      _this4._category = "";
      return _this4;
    }

    _createClass(Window_AchievementList, [{
      key: "includes",
      value: function includes(achievement) {
        if (this._category) {
          var _categories = achievement.category.split(" ").map(function (s) {
            return s.toLowerCase();
          });

          return achievement ? _categories.contains(this._category.toLowerCase()) : false;
        }

        return false;
      }
    }, {
      key: "makeItemList",
      value: function makeItemList() {
        var _this5 = this;

        this._data = $gameAchievements._data.slice(1).filter(function (achievement) {
          return _this5.includes(achievement);
        }).filter(function (achievement) {
          if (achievement.hidden) {
            return achievement.isCompleted;
          }

          return achievement;
        });
      }
    }, {
      key: "drawItem",
      value: function drawItem(index) {
        var achievement = this._data[index];

        if (achievement) {
          var rect = this.itemRect(index);
          rect.width -= this.textPadding();
          var iconIndex = achievement.isCompleted ? achievement.completeIcon : achievement.incompleteIcon;
          this.changePaintOpacity(this.isEnabled(achievement));
          this.drawIcon(iconIndex, rect.x + 2, rect.y + 2);
          var textX = rect.x + Window_Base._iconWidth + 4;
          this.drawText(achievement.name, textX, rect.y);
          this.changePaintOpacity(1);
        }
      }
      /* eslint-disable */

    }, {
      key: "isEnabled",
      value: function isEnabled(achievement) {
        return achievement && achievement.isCompleted;
      }
    }, {
      key: "isOkEnabled",
      value: function isOkEnabled() {
        return false;
      }
      /* eslint-enable */

    }, {
      key: "updateHelp",
      value: function updateHelp() {
        var achievement = this.item();

        if (achievement) {
          var text = achievement.isCompleted ? achievement.description : achievement.notCompletedDescription;

          if (text === null) {
            text = achievement.description;
          }

          this._helpWindow.setText(text);
        }
      }
    }]);

    return Window_AchievementList;
  }(Window_ItemList); //===========================================================================
  // Scene_Achievements
  //===========================================================================


  var Scene_Achievements = /*#__PURE__*/function (_Scene_MenuBase) {
    _inherits(Scene_Achievements, _Scene_MenuBase);

    var _super3 = _createSuper(Scene_Achievements);

    function Scene_Achievements() {
      _classCallCheck(this, Scene_Achievements);

      return _super3.apply(this, arguments);
    }

    _createClass(Scene_Achievements, [{
      key: "createBackground",
      value: function createBackground() {
        if (background !== "") {
          this._backgroundSprite = new Sprite();
          this._backgroundSprite.bitmap = ImageManager.loadPicture(background);
          this.addChild(this._backgroundSprite);
        }
      }
    }, {
      key: "create",
      value: function create() {
        _get(_getPrototypeOf(Scene_Achievements.prototype), "create", this).call(this);

        this.createTitleWindow();
        this.createPointsWindow();
        this.createHelpWindow();
        this.createCategoryWindow();
        this.createItemWindow();
      }
    }, {
      key: "createTitleWindow",
      value: function createTitleWindow() {
        var ww = Graphics.boxWidth / 4 * 3;
        this._titleWindow = new TitleWindow(0, 0, ww, 72).setTitle(titleText);
        this.addWindow(this._titleWindow);
      }
    }, {
      key: "createPointsWindow",
      value: function createPointsWindow() {
        var wx = this._titleWindow.width;
        var ww = Graphics.boxWidth / 4;
        var current = $gameAchievements.currentPoints();
        var max = $gameAchievements.maxPoints();
        var text = pointsTitle.format(current, max);
        this._titleWindow = new TitleWindow(wx, 0, ww, 72).setTitle(text);
        this.addWindow(this._titleWindow);
      }
    }, {
      key: "createHelpWindow",
      value: function createHelpWindow() {
        this._helpWindow = new Window_Help();
        this._helpWindow.y = this._titleWindow.height;
        this.addWindow(this._helpWindow);
      }
    }, {
      key: "createCategoryWindow",
      value: function createCategoryWindow() {
        var wy = this._helpWindow.y + this._helpWindow.height;
        this._categoryWindow = new Window_AchievementCategories(wy);

        this._categoryWindow.setHandler("ok", this.onCategoryOk.bind(this));

        this._categoryWindow.setHandler("cancel", this.onCategoryCancel.bind(this));

        this.addWindow(this._categoryWindow);
      }
    }, {
      key: "createItemWindow",
      value: function createItemWindow() {
        var wy = this._categoryWindow.y + this._categoryWindow.height;
        this._itemWindow = new Window_AchievementList(0, wy, Graphics.boxWidth, Graphics.boxHeight - wy);
        this.addWindow(this._itemWindow);

        this._categoryWindow.setItemWindow(this._itemWindow);

        this._itemWindow.setHandler("cancel", this.onItemCancel.bind(this));

        this._itemWindow.setHelpWindow(this._helpWindow);
      }
    }, {
      key: "onCategoryOk",
      value: function onCategoryOk() {
        this._itemWindow.activate();

        this._itemWindow.refresh();

        this._itemWindow.select(0);
      }
    }, {
      key: "onCategoryCancel",
      value: function onCategoryCancel() {
        this.popScene();
      }
    }, {
      key: "onItemCancel",
      value: function onItemCancel() {
        this._itemWindow.deselect();

        this._helpWindow.clear();

        this._categoryWindow.activate();
      }
    }, {
      key: "onCancel",
      value: function onCancel() {
        this.popScene();
      }
    }]);

    return Scene_Achievements;
  }(Scene_MenuBase);

  window.Scene_Achievements = Scene_Achievements; //===========================================================================
  // Window_AchievementNotification
  //===========================================================================

  var Window_AchievementNotification = /*#__PURE__*/function (_Window_Base) {
    _inherits(Window_AchievementNotification, _Window_Base);

    var _super4 = _createSuper(Window_AchievementNotification);

    function Window_AchievementNotification(x, y, width, height) {
      var _this6;

      _classCallCheck(this, Window_AchievementNotification);

      _this6 = _super4.call(this, x, y, width, height);
      _this6.opacity = 0;
      _this6.contentsOpacity = 0;
      _this6._showCount = 0;
      _this6._achievement = null;

      _this6.refresh();

      return _this6;
    }

    _createClass(Window_AchievementNotification, [{
      key: "loadWindowskin",
      value: function loadWindowskin() {
        this.windowskin = ImageManager.loadSystem(notifyWindowSkin);
      }
    }, {
      key: "updateFadeIn",
      value: function updateFadeIn() {
        this.opacity += 16;
        this.contentsOpacity += 16;
      }
    }, {
      key: "updateFadeOut",
      value: function updateFadeOut() {
        this.opacity -= 16;
        this.contentsOpacity -= 16;
      }
    }, {
      key: "text",
      value: function text() {
        if (this._achievement) {
          var name = "\x1BI[".concat(this._achievement.completeIcon, "]").concat(this._achievement.name);
          return notifyMessage.format(name, this._achievement.points);
        }

        return "";
      }
    }, {
      key: "update",
      value: function update() {
        Window_Base.prototype.update.call(this);
        if (_disablePopups) return;

        if ($gameAchievements._notifyQueue.length) {
          if (!this._achievement && this.contentsOpacity < 1) {
            this._achievement = $gameAchievements._notifyQueue[0];
            this.refresh();
            this._showCount = notifyShowFrames;
            if (notifySound && notifySound.name) AudioManager.playSe(notifySound);
          }

          if (this._achievement) {
            if (this._showCount > 0) {
              this.updateFadeIn();
              this._showCount--;
            } else if (this.contentsOpacity > 0) {
              this.updateFadeOut();
            } else {
              this._achievement = null;

              $gameAchievements._notifyQueue.shift();
            }
          }
        }
      }
    }, {
      key: "adjustWidthBasedOnText",
      value: function adjustWidthBasedOnText() {
        this.width = Math.ceil(this.textWidthEx(this.text()) + this.standardPadding() * 2);
        this.createContents();
      }
    }, {
      key: "refresh",
      value: function refresh() {
        if (this._achievement) {
          this.adjustWidthBasedOnText();
          this.drawTextEx(this.text(), 0, 0);
        }
      }
    }]);

    return Window_AchievementNotification;
  }(Window_Base); //===========================================================================
  // DataManager
  //===========================================================================


  $.alias.DataManager_createGameObjects = DataManager.createGameObjects;

  DataManager.createGameObjects = function () {
    $.alias.DataManager_createGameObjects.call(this);
    $gameAchievements = new Game_Achievements();
  };

  $.alias.DataManager_makeSaveContents = DataManager.makeSaveContents;

  DataManager.makeSaveContents = function () {
    var contents = $.alias.DataManager_makeSaveContents.call(this);
    contents.achievements = $gameAchievements._data;
    return contents;
  };

  $.alias.DataManager_extractSaveContents = DataManager.extractSaveContents;

  DataManager.extractSaveContents = function (contents) {
    $.alias.DataManager_extractSaveContents.call(this, contents);
    var data = contents.achievements;
    $gameAchievements = new Game_Achievements(data);
  }; //===========================================================================
  // Window_MenuCommand
  //===========================================================================


  $.alias.Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;

  Window_MenuCommand.prototype.addOriginalCommands = function () {
    $.alias.Window_MenuCommand_addOriginalCommands.call(this);
    if (showCommand) this.addAchievementCommand();
  };

  Window_MenuCommand.prototype.addAchievementCommand = function () {
    if (this.findSymbol("achievements") > -1) return;
    this.addCommand(commandName, "achievements");
  }; //============================================================================
  // Scene_Menu
  //============================================================================


  $.alias.Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;

  Scene_Menu.prototype.createCommandWindow = function () {
    $.alias.Scene_Menu_createCommandWindow.call(this);

    this._commandWindow.setHandler("achievements", this.commandAchievements.bind(this));
  };

  Scene_Menu.prototype.commandAchievements = function () {
    SceneManager.push(Scene_Achievements);
  };

  Scene_Base.prototype.createNotificationWindow = function () {
    this._achievementNotificationWindow = new Window_AchievementNotification(notifyWindowX, notifyWindowY, notifyWindowWidth, notifyWindowHeight);
    this.addChild(this._achievementNotificationWindow);
  }; //===========================================================================
  //  Scene_Battle
  //===========================================================================


  $.alias.Scene_Battle_update = Scene_Battle.prototype.update;

  Scene_Battle.prototype.update = function () {
    $.alias.Scene_Battle_update.call(this);

    if (Graphics.frameCount % frameInterval === 0) {
      $gameAchievements.update();
    }
  };

  $.alias.Scene_Battle_createAllWindows = Scene_Battle.prototype.createAllWindows;

  Scene_Battle.prototype.createAllWindows = function () {
    $.alias.Scene_Battle_createAllWindows.call(this);
    this.createNotificationWindow();
  }; //===========================================================================
  //  Scene_Map
  //===========================================================================


  $.alias.Scene_Map_update = Scene_Map.prototype.update;

  Scene_Map.prototype.update = function () {
    $.alias.Scene_Map_update.call(this);

    if (Graphics.frameCount % frameInterval === 0) {
      $gameAchievements.update();
    }
  };

  $.alias.Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;

  Scene_Map.prototype.createAllWindows = function () {
    $.alias.Scene_Map_createAllWindows.call(this);
    this.createNotificationWindow();
  }; //===========================================================================
  //  Plugin Commands
  //===========================================================================


  PluginManager.addCommand("Achievements", {
    enablePopups: function enablePopups() {
      _disablePopups = false;
    },
    disablePopups: function disablePopups() {
      _disablePopups = true;
    }
  });
})(WAYModuleLoader.getModule("WAY_Achievements")); //-----------------------------------------------------------------------------

/*~struct~Achievement:
@param category
@text Category Name
@type text
@default all

@param name
@text Name
@type text
@default

@param hidden
@text Hidden Achievement
@type boolean
@default false

@param points
@text Points
@type number
@min 0
@default 0

@param completeIcon
@text Complete Icon
@type number
@min 0
@decimals 0
@default 0

@param incompleteIcon
@text Incomplete Icon
@type number
@min 0
@decimals 0
@default 0

@param description
@text Description
@type note
@default

@param notCompletedDescription
@text Not Completed Description
@type text
@default

@param condition
@text Condition
@type text
@default

@param onCompleteCommonEvent
@text On Complete Common Event
@type common_event
@default 0
*/

/*~struct~Sound:
@param name
@text SE name
@type file
@dir audio/se
@default

@param volume
@text SE Volume
@type number
@default 90

@param pitch
@text SE Pitch
@type number
@default 100

@param pan
@text SE Pan
@type number
@default 0
*/