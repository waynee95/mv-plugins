/* globals WAY, WAYModuleLoader */
//=============================================================================
// WAY_Achievements.js
//=============================================================================
/*:
@plugindesc v1.3.0 This plugin allows you to create Achievements to your game. <WAY_Achievements>

@author waynee95

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
      Name: Achievements
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

You can support me at https://ko-fi.com/waynee
*/

"use strict";

if (typeof WAY === "undefined") {
  console.error("You need to install WAY_Core!"); // eslint-disable-line no-console
  if (Utils.isNwjs() && Utils.isOptionValid("test")) {
    var gui = require("nw.gui"); //eslint-disable-line
    gui.Window.get().showDevTools();
  }
  SceneManager.stop();
} else {
  WAYModuleLoader.registerPlugin("WAY_Achievements", "1.3.0", "waynee95", {
    name: "WAY_Core",
    version: ">= 2.0.0"
  });
}

var $gameAchievements = null; //eslint-disable-line

($ => {
  const { TitleWindow } = WAY.Window;

  const {
    background,
    commandName,
    categories,
    pointsTitle,
    notifyWindowSkin,
    notifySound = {},
    notifyMessage,
    notifyShowFrames,
    notifyWindowX,
    notifyWindowY,
    notifyWindowWidth,
    notifyWindowHeight,
    showCommand,
    titleText
  } = $.parameters;

  let { disablePopups } = $.parameters;

  const $dataAchievements = [null].concat($.parameters.achievementList);

  //===========================================================================
  // Game_Achievement
  //===========================================================================
  class Game_Achievement {
    constructor(id) {
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
    check() {
      return eval(this.condition); // eslint-disable-line no-eval
    }
  }

  //===========================================================================
  // Game_Achievements
  //===========================================================================
  class Game_Achievements {
    constructor(data) {
      if (!data) {
        this._data = $dataAchievements.map((achievement, index) =>
          Object.assign(new Game_Achievement(index), achievement)
        );
      } else {
        this._data = data.map((achievement, index) =>
          Object.assign(new Game_Achievement(index), achievement)
        );
      }
      this._notifyQueue = [];
    }
    achievement(id) {
      if (typeof $dataAchievements[id] !== "object") {
        return null;
      }
      if ($dataAchievements[id]) {
        return this._data[id];
      }
      return null;
    }
    update() {
      this._data.forEach(achievement => {
        if (achievement && !achievement.isCompleted && achievement.check()) {
          achievement.isCompleted = true;
          if (achievement.onCompleteCommonEvent) {
            const commonEventId = achievement.onCompleteCommonEvent;
            $gameTemp.reserveCommonEvent(commonEventId);
          }
          this._notifyQueue.push(achievement);
        }
      });
    }
    currentPoints() {
      return this._data
        .filter(achievement => achievement.isCompleted)
        .map(achievement => achievement.points)
        .reduce((acc, value) => acc + value, 0);
    }
    maxPoints() {
      return this._data
        .map(achievement => achievement.points)
        .reduce((acc, value) => acc + value, 0);
    }
  }

  //===========================================================================
  // Window_AchievementCategories
  //===========================================================================
  class Window_AchievementCategories extends Window_Command {
    constructor(y) {
      super(0, y);
      this.select(0);
    }
    /* eslint-disable */
    windowWidth() {
      return Graphics.boxWidth;
    }
    itemAlign() {
      return "center";
    }
    numVisibleRows() {
      return 1;
    }
    maxCols() {
      return 4;
    }
    /* eslint-enable */
    windowHeight() {
      return this.fittingHeight(this.numVisibleRows());
    }
    makeCommandList() {
      categories.forEach(command => {
        this.addCommand(command, command);
      });
    }
    update() {
      super.update();
      if (this._itemWindow) {
        this._itemWindow.setCategory(this.currentSymbol());
      }
    }
    setItemWindow(itemWindow) {
      this._itemWindow = itemWindow;
      this.update();
    }
  }

  //===========================================================================
  // Window_AchievementList
  //===========================================================================
  class Window_AchievementList extends Window_ItemList {
    constructor(x, y, width, height) {
      super(x, y, width, height);
      this._category = "";
    }
    includes(achievement) {
      if (this._category) {
        const categories = achievement.category
          .split(" ")
          .map(s => s.toLowerCase());
        return achievement
          ? categories.contains(this._category.toLowerCase())
          : false;
      }
      return false;
    }
    makeItemList() {
      this._data = $gameAchievements._data
        .slice(1)
        .filter(achievement => this.includes(achievement))
        .filter(achievement => {
          if (achievement.hidden) {
            return achievement.isCompleted;
          }
          return achievement;
        });
    }
    drawItem(index) {
      const achievement = this._data[index];
      if (achievement) {
        const rect = this.itemRect(index);
        rect.width -= this.textPadding();
        const iconIndex = achievement.isCompleted
          ? achievement.completeIcon
          : achievement.incompleteIcon;
        this.changePaintOpacity(this.isEnabled(achievement));
        this.drawIcon(iconIndex, rect.x + 2, rect.y + 2);
        const textX = rect.x + Window_Base._iconWidth + 4;
        this.drawText(achievement.name, textX, rect.y);
        this.changePaintOpacity(1);
      }
    }
    /* eslint-disable */
    isEnabled(achievement) {
      return achievement && achievement.isCompleted;
    }
    isOkEnabled() {
      return false;
    }
    /* eslint-enable */
    updateHelp() {
      const achievement = this.item();
      if (achievement) {
        let text = achievement.isCompleted
          ? achievement.description
          : achievement.notCompletedDescription;
        if (text === null) {
          text = achievement.description;
        }
        this._helpWindow.setText(text);
      }
    }
  }

  //===========================================================================
  // Scene_Achievements
  //===========================================================================
  class Scene_Achievements extends Scene_MenuBase {
    createBackground() {
      if (background !== "") {
        this._backgroundSprite = new Sprite();
        this._backgroundSprite.bitmap = ImageManager.loadPicture(background);
        this.addChild(this._backgroundSprite);
      }
    }
    create() {
      super.create();
      this.createTitleWindow();
      this.createPointsWindow();
      this.createHelpWindow();
      this.createCategoryWindow();
      this.createItemWindow();
    }
    createTitleWindow() {
      const ww = (Graphics.boxWidth / 4) * 3;
      this._titleWindow = new TitleWindow(0, 0, ww, 72).setTitle(titleText);
      this.addWindow(this._titleWindow);
    }
    createPointsWindow() {
      const wx = this._titleWindow.width;
      const ww = Graphics.boxWidth / 4;
      const current = $gameAchievements.currentPoints();
      const max = $gameAchievements.maxPoints();
      const text = pointsTitle.format(current, max);
      this._titleWindow = new TitleWindow(wx, 0, ww, 72).setTitle(text);
      this.addWindow(this._titleWindow);
    }
    createHelpWindow() {
      this._helpWindow = new Window_Help();
      this._helpWindow.y = this._titleWindow.height;
      this.addWindow(this._helpWindow);
    }
    createCategoryWindow() {
      const wy = this._helpWindow.y + this._helpWindow.height;
      this._categoryWindow = new Window_AchievementCategories(wy);
      this._categoryWindow.setHandler("ok", this.onCategoryOk.bind(this));
      this._categoryWindow.setHandler(
        "cancel",
        this.onCategoryCancel.bind(this)
      );
      this.addWindow(this._categoryWindow);
    }
    createItemWindow() {
      const wy = this._categoryWindow.y + this._categoryWindow.height;
      this._itemWindow = new Window_AchievementList(
        0,
        wy,
        Graphics.boxWidth,
        Graphics.boxHeight - wy
      );
      this.addWindow(this._itemWindow);
      this._categoryWindow.setItemWindow(this._itemWindow);
      this._itemWindow.setHandler("cancel", this.onItemCancel.bind(this));
      this._itemWindow.setHelpWindow(this._helpWindow);
    }
    onCategoryOk() {
      this._itemWindow.activate();
      this._itemWindow.refresh();
      this._itemWindow.select(0);
    }
    onCategoryCancel() {
      this.popScene();
    }
    onItemCancel() {
      this._itemWindow.deselect();
      this._helpWindow.clear();
      this._categoryWindow.activate();
    }
    onCancel() {
      this.popScene();
    }
  }

  window.Scene_Achievements = Scene_Achievements;

  //===========================================================================
  // Window_AchievementNotification
  //===========================================================================
  class Window_AchievementNotification extends Window_Base {
    constructor(x, y, width, height) {
      super(x, y, width, height);
      this.opacity = 0;
      this.contentsOpacity = 0;
      this._showCount = 0;
      this._achievement = null;
      this.refresh();
    }
    loadWindowskin() {
      this.windowskin = ImageManager.loadSystem(notifyWindowSkin);
    }
    updateFadeIn() {
      this.opacity += 16;
      this.contentsOpacity += 16;
    }
    updateFadeOut() {
      this.opacity -= 16;
      this.contentsOpacity -= 16;
    }
    text() {
      if (this._achievement) {
        const name = `\x1bI[${this._achievement.completeIcon}]${
          this._achievement.name
        }`;
        return notifyMessage.format(name, this._achievement.points);
      }
      return "";
    }
    update() {
      Window_Base.prototype.update.call(this);
      if (disablePopups) return;
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
    adjustWidthBasedOnText() {
      this.width = Math.ceil(
        this.textWidthEx(this.text()) + this.standardPadding() * 2
      );
      this.createContents();
    }
    refresh() {
      if (this._achievement) {
        this.adjustWidthBasedOnText();
        this.drawTextEx(this.text(), 0, 0);
      }
    }
  }

  //===========================================================================
  // DataManager
  //===========================================================================
  $.alias.DataManager_createGameObjects = DataManager.createGameObjects;
  DataManager.createGameObjects = function() {
    $.alias.DataManager_createGameObjects.call(this);
    $gameAchievements = new Game_Achievements();
  };

  $.alias.DataManager_makeSaveContents = DataManager.makeSaveContents;
  DataManager.makeSaveContents = function() {
    const contents = $.alias.DataManager_makeSaveContents.call(this);
    contents.achievements = $gameAchievements._data;
    return contents;
  };

  $.alias.DataManager_extractSaveContents = DataManager.extractSaveContents;
  DataManager.extractSaveContents = function(contents) {
    $.alias.DataManager_extractSaveContents.call(this, contents);
    const data = contents.achievements;
    $gameAchievements = new Game_Achievements(data);
  };

  //===========================================================================
  // Window_MenuCommand
  //===========================================================================
  $.alias.Window_MenuCommand_addOriginalCommands =
    Window_MenuCommand.prototype.addOriginalCommands;
  Window_MenuCommand.prototype.addOriginalCommands = function() {
    $.alias.Window_MenuCommand_addOriginalCommands.call(this);
    if (showCommand) this.addAchievementCommand();
  };

  Window_MenuCommand.prototype.addAchievementCommand = function() {
    if (this.findSymbol("achievements") > -1) return;
    this.addCommand(commandName, "achievements");
  };

  //============================================================================
  // Scene_Menu
  //============================================================================
  $.alias.Scene_Menu_createCommandWindow =
    Scene_Menu.prototype.createCommandWindow;
  Scene_Menu.prototype.createCommandWindow = function() {
    $.alias.Scene_Menu_createCommandWindow.call(this);
    this._commandWindow.setHandler(
      "achievements",
      this.commandAchievements.bind(this)
    );
  };

  Scene_Menu.prototype.commandAchievements = function() {
    SceneManager.push(Scene_Achievements);
  };

  Scene_Base.prototype.createNotificationWindow = function() {
    this._achievementNotificationWindow = new Window_AchievementNotification(
      notifyWindowX,
      notifyWindowY,
      notifyWindowWidth,
      notifyWindowHeight
    );
    this.addChild(this._achievementNotificationWindow);
  };

  //===========================================================================
  //  Scene_Battle
  //===========================================================================
  $.alias.Scene_Battle_update = Scene_Battle.prototype.update;
  Scene_Battle.prototype.update = function() {
    $.alias.Scene_Battle_update.call(this);
    $gameAchievements.update();
  };

  $.alias.Scene_Battle_createAllWindows =
    Scene_Battle.prototype.createAllWindows;
  Scene_Battle.prototype.createAllWindows = function() {
    $.alias.Scene_Battle_createAllWindows.call(this);
    this.createNotificationWindow();
  };

  //===========================================================================
  //  Scene_Map
  //===========================================================================
  $.alias.Scene_Map_update = Scene_Map.prototype.update;
  Scene_Map.prototype.update = function() {
    $.alias.Scene_Map_update.call(this);
    $gameAchievements.update();
  };

  $.alias.Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
  Scene_Map.prototype.createAllWindows = function() {
    $.alias.Scene_Map_createAllWindows.call(this);
    this.createNotificationWindow();
  };

  //===========================================================================
  //  Plugin Commands
  //===========================================================================
  PluginManager.addCommand("Achievements", {
    enablePopups() {
      disablePopups = false;
    },
    disablePopups() {
      disablePopups = true;
    }
  });

})(WAYModuleLoader.getModule("WAY_Achievements"));

//-----------------------------------------------------------------------------

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
