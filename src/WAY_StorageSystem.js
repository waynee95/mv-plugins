/* globals WAY, WAYModuleLoader, $gameStorageSystems */
//===========================================================================
// WAY_StorageSystem.js
//===========================================================================
/*:
@plugindesc v2.5.2 This plugin allows you create different storage systems where
the player can store his items. <WAY_StorageSystem>

@param config
@text Storage Systems
@desc Add Storage Systems to your game.
@type struct<storage>[]
@default

@author waynee95

@help
============================================================================
 ■ Usage
============================================================================

>>> This plugin uses the new MV1.5.0 Plugin Parameter, so I recommend you to
update your editor. Your project can still be lower than MV1.5.0

This plugin allows you create different storage systems where the player can
store his items. This plugin does not add the ability to limit the player's
inventory.
You can use YEP_CoreEngine to restrict the player's inventory. Also this
plugin is compatible with YEP_ItemCore and YEP_X_ItemCategories.

Put this plugin at the bottom of the list.

How to create a storage system:
1. Open the plugin in the Plugin-Manager.
2. Click on Storage Systems.
3. Click on a free row.
4. Now you can configure the storage system.

The ids for the storage systems start at 0. So the first storage system will
have id 0, the next id 1, ...

============================================================================
 ■ Parameter Overview
============================================================================
Menu Background - Set an image for the Scene Background.

Storage Title - Title that will be displayed in the title window. You can
use escape codes here like \i[x], \c[x].

Info Window Text - Text that will be displayed in the info window. %1 will
be replaced with the current capacity of the storage.

Max Capacity - The maximum of items that can be stored.

Item Stack Size - If this paramter is not equal to none, a stack will count
as one item in regards of the max capacity. For example if the stack size
is 8 and the max capacity is 20, the same item can be stored 8 times but
it will only subtract 1 from the max capacity. This means you can store
8x20 items in the storage system.

Display Categories - Are the different categories displayed in the storage
system menu? This is only for visuals. All allowed types will be just in
one list.
When your are using YEP_X_ItemCategories, this paramter must be set to
true.

Allowed Item Types - Define which items can be stored in the storage
system.
You can use the following types:
 - items
 - weapons
 - armors
 - keyitems

Show Loot All Button - Shows a loot all button inside the storage system. When
pressed you loot all items at once.

If you want more categories, you can use YEP_X_ItemCategories. Just add the
category name to the allowed types list.

Mode - Can either be "Add/Remove", "Only Add" or "Only Remove". First one
would be your classical storage chest and the "Only Remove" option would
be handy for creating loot boxes for example.

If you wanna customize the text for the add/remove items buttons, you can do
that inside the Scene Settings/Command Window Settings.

If you wanan customize the sound when adding/removing items, you can do that
inside the Scene Settings/Number Window Settings.

============================================================================
 ■ Scene Settings
============================================================================
This is the section where you can change the look of the Storage Scene. You
can change that for every storage system individually.

The windows are created in the following order:

Help Window - Just your default Help Window.
Title Window - Displays the title of the storage system.
Command Window - Window for selecting if you want to add/remove an item.
Category Window - Window for choosing an item category.
Item Window - Displays the list of available items depending on the
*             category.
Info Window - Displays the current and max capacity.
Number Window - Used for inputting how many items you want to add/remove.

============================================================================
 ■ Notetags
============================================================================
Item, Weapon, Armor Notetags:

<Cannot Store>
This makes it so that the item cannot be store in the storage system.

<Can Store Only In: x>
<Can Store Only In: x, x, x>
This makes it so that the item can only be stored in the specified storage
systems.

============================================================================
 ■ Plugin Commands
============================================================================
Main Keyword: StorageSystem

-----------------------
StorageSystem open id
-----------------------
open - Keyword for opening a storage system.
Keep in mind that the id starts at 0!

id - The id of the storage system that will be opened. If no id is
     specified, the last opened storage system will be opened.

-----------------------
StorageSystem add id item amount
-----------------------
add - Keyword for adding an item to a storage system.

id - The id of the storage system.

item - The item that will be added. Use $dataItems[id], $dataWeapons[id],
$dataArmors[id].

amount - Number of items that will be added.

-----------------------
StorageSystem remove id item amount
-----------------------
remove - Keyword for removing an item from a storage system.

id - The id of the storage system.

item - The item that will be removed. Use $dataItems[id], $dataWeapons[id],
$dataArmors[id].

amount - Number of items that will be removed.

-----------------------
StorageSystem clear id
-----------------------
clear - Keyword for clearing a storage system.

id - The id of the storage system.

-----------------------
StorageSystem change id number
-----------------------
change - Keyword for changing the max capacity of a storage system.

id - The id of the storage system.

number - New max capacity.

============================================================================
 ■ Scriptcalls
============================================================================
Global Object: $gameStorageSystems

$gameStorageSystems.open(id) - Opens a storage system. If no id is
specified, the last opened will be used.

$gameStorageSystems.storage(id) - Returns the storage system with the
*                                 given id.

$gameStorageSystems.current() - Returns the last opened storage system.

The following script calls are called on a storage system object. Replace
storage with $gameStorageSystems.current() or
$gameStorageSystems.storage(id).

storage.title() - Returns the title name.

storage.capacity() - Returns the current capacity.

storage.maxCapacity() - Returns the max capacity.

storage.items() - Returns all stored items.

storage.weapons() - Returns all stored weapons.

storage.armors() - Returns all stored armors.

storage.allItems() - Returns everything that is stored.

storage.isEmpty() - Returns either true or false.

storage.addItem(item, amount) - Adds an item to a storage system. Use
$dataItems[id], $dataWeapons[id], $dataArmors[id].

storage.removeItem(item, amount) - Removes an item from the storage system.
If no amount is specified, all items will be removed.

storage.clear() - Clears a storage system.

storage.changeMaxCapacity(number) - Changes the max capacity to the given
number.

============================================================================
 ■ Terms of Use
============================================================================
This work is licensed under the MIT license.

More info here: https://github.com/waynee95/mv-plugins/blob/master/LICENSE

============================================================================
 ■ Contact Information
============================================================================
Forum Link: https://forums.rpgmakerweb.com/index.php?members/waynee95.88436/
Website: http://waynee95.me/
Discord Name: waynee95#4261
Ko-fi: https://ko-fi.com/waynee95
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
  WAYModuleLoader.registerPlugin("WAY_StorageSystem", "2.5.2", "waynee95", {
    name: "WAY_Core",
    version: ">= 2.0.0",
  });
}

window.$gameStorageSystems = null;

(($) => {
  const { getNotetag, toArray } = WAY.Util;

  const $dataStorage = $.parameters.config;

  if ($dataStorage === null) {
    console.warn(
      "WAY_StorageSystem\nPlugin Parameters are not setup properly!"
    );
    if (Utils.isNwjs() && Utils.isOptionValid("test")) {
      require("nw.gui").Window.get().showDevTools();
    }
  }

  WAY.EventEmitter.on("load-item-notetags", parseNotetags);
  WAY.EventEmitter.on("load-weapon-notetags", parseNotetags);
  WAY.EventEmitter.on("load-armor-notetags", parseNotetags);

  function parseNotetags(obj) {
    obj.cannotStore = getNotetag(obj.note, "Cannot Store", false);
    obj.onlyInStorage = getNotetag(obj.note, "Can Store Only In", [], toArray);
  }

  //==========================================================================
  // PluginManager
  //==========================================================================
  PluginManager.addCommand("StorageSystem", {
    open(storageId = $gameStorageSystems._lastActive) {
      $gameStorageSystems.open(storageId);
    },
    add(storageId, item, amount) {
      $gameStorageSystems
        .storage(storageId)
        .addItem(eval(item), parseInt(amount));
    },
    remove(storageId, item, amount) {
      $gameStorageSystems
        .storage(storageId)
        .removeItem(eval(item), parseInt(amount));
    },
    clear(storageId) {
      $gameStorageSystems.storage(storageId).clear();
    },
    change(storageId, maxCapacity) {
      $gameStorageSystems.storage(storageId).changeMaxCapacity(maxCapacity);
    },
  });

  //==========================================================================
  // DataManager
  //==========================================================================
  const _DataManager_createGameObjects = DataManager.createGameObjects;
  DataManager.createGameObjects = function () {
    _DataManager_createGameObjects.call(this);
    $gameStorageSystems = new Game_StorageSystems();
  };

  const _DataManager_makeSaveContents = DataManager.makeSaveContents;
  DataManager.makeSaveContents = function () {
    const contents = _DataManager_makeSaveContents.call(this);
    contents.storageSystems = $gameStorageSystems;
    return contents;
  };

  const _DataManager_extractSaveContents = DataManager.extractSaveContents;
  DataManager.extractSaveContents = function (contents) {
    _DataManager_extractSaveContents.call(this, contents);
    $gameStorageSystems = contents.storageSystems;
    if ($gameStorageSystems === undefined) {
      $gameStorageSystems = new Game_StorageSystems();
    }
  };

  if (Imported.YEP_X_NewGamePlus) {
    const _DataManager_prepareNewGamePlusData =
      DataManager.prepareNewGamePlusData;
    DataManager.prepareNewGamePlusData = function () {
      _DataManager_prepareNewGamePlusData.call(this);
      this._ngpData.storageSystems = JsonEx.makeDeepCopy($gameStorageSystems);
    };

    const _DataManager_carryOverNewGamePlusData =
      DataManager.carryOverNewGamePlusData;
    DataManager.carryOverNewGamePlusData = function () {
      _DataManager_carryOverNewGamePlusData.call(this);
      $gameStorageSystems = this._ngpData.storageSystems;
    };
  } // Imported YEP_X_NewGamePlus

  //==========================================================================
  // Game_StorageSystems
  //==========================================================================
  Game_StorageSystems.prototype.initialize = function () {
    this._data = [];
    this._lastActive = 0;
  };

  Game_StorageSystems.prototype.storage = function (storageId) {
    if (typeof $dataStorage[storageId] !== "object") {
      return;
    }
    if ($dataStorage[storageId]) {
      if (!this._data[storageId]) {
        this._data[storageId] = new Game_StorageSystem(storageId);
      }
      return this._data[storageId];
    }
    return null;
  };

  Game_StorageSystems.prototype.current = function () {
    return this.storage(this._lastActive);
  };

  Game_StorageSystems.prototype.open = function (storageId) {
    if (typeof storageId !== "undefined") {
      this._lastActive = storageId;
    }
    if (!this.current()) {
      return;
    }
    SceneManager.push(Scene_Storage);
  };

  //==========================================================================
  // Game_StorageSystem
  //==========================================================================
  Game_StorageSystem.prototype.initialize = function (storageId) {
    const storage = $dataStorage[storageId];
    this._storageId = parseInt(storageId);
    this._title = storage.titleText;
    this._allowedTypes = storage.allowedTypes;
    this._maxCapacity = storage.maxCapacity;
    this._stackSize =
      storage.stackSize !== "none" ? parseInt(storage.stackSize) : "none";
    this.clear();
  };

  Game_StorageSystem.prototype.data = function () {
    return $dataStorage[this._storageId];
  };

  Game_StorageSystem.prototype.title = function () {
    return this._title;
  };

  Game_StorageSystem.prototype.allowedTypes = function () {
    return this._allowedTypes;
  };

  Game_StorageSystem.prototype.maxCapacity = function () {
    return this._maxCapacity;
  };

  Game_StorageSystem.prototype.changeMaxCapacity = function (capacity) {
    this._maxCapacity = capacity;
  };

  Game_StorageSystem.prototype.capacity = function () {
    let sum = 0;
    if (this._stackSize === "none") {
      sum = this.allItems()
        .map(function (item) {
          return this.numItems(item);
        }, this)
        .reduce((total, current) => total + current, 0);
    } else {
      sum = this.allItems().length;
    }
    return sum;
  };

  Game_StorageSystem.prototype.capacityRate = function () {
    return this.capacity() / this.maxCapacity();
  };

  Game_StorageSystem.prototype.items = function () {
    return Object.keys(this._items).map((id) => $dataItems[id]);
  };

  Game_StorageSystem.prototype.weapons = function () {
    return Object.keys(this._weapons).map((id) => $dataWeapons[id]);
  };

  Game_StorageSystem.prototype.armors = function () {
    return Object.keys(this._armors).map((id) => $dataArmors[id]);
  };

  Game_StorageSystem.prototype.equipItems = function () {
    return this.weapons().concat(this.armors());
  };

  Game_StorageSystem.prototype.allItems = function () {
    return this.items().concat(this.equipItems());
  };

  Game_StorageSystem.prototype.isEmpty = function () {
    return this.allItems().length === 0;
  };

  Game_StorageSystem.prototype.addItem = function (item, amount) {
    if (!this.canStoreItem(item)) return;
    const container = this.itemContainer(item);
    if (container) {
      const oldNumber = this.numItems(item);
      if (amount > 0) {
        amount = Math.min(amount, this.maxItems(item));
      } else {
        amount = Math.max(amount, -this.numItems(item));
      }
      container[item.id] = oldNumber + amount;
      if (container[item.id] === 0) {
        delete container[item.id];
      }
    }
  };

  Game_StorageSystem.prototype.removeItem = function (item, amount) {
    if (arguments < 2) {
      this.addItem(item, -this.numItems(item));
    } else {
      this.addItem(item, -amount);
    }
  };

  Game_StorageSystem.prototype.clear = function () {
    this._items = {};
    this._weapons = {};
    this._armors = {};
  };

  Game_StorageSystem.prototype.isTypeAllowed = function (type) {
    return type && this._allowedTypes.contains(type.toLowerCase());
  };

  Game_StorageSystem.prototype.canStoreItem = function (item) {
    if (item && item.onlyInStorage.length > 0) {
      return item.onlyInStorage.contains(this._storageId);
    }

    return true;
  };

  Game_StorageSystem.prototype.numItems = function (item) {
    const container = this.itemContainer(item);
    return container ? container[item.id] || 0 : 0;
  };

  Game_StorageSystem.prototype.maxItems = function (item) {
    if (this._stackSize === "none") {
      return this.maxCapacity() - this.capacity();
    }
    return Math.max(parseInt(this._stackSize, 10) - this.numItems(item), 0);
  };

  Game_StorageSystem.prototype.itemContainer = function (item) {
    if (!item) {
      return null;
    } else if (DataManager.isItem(item)) {
      return this._items;
    } else if (DataManager.isWeapon(item)) {
      return this._weapons;
    } else if (DataManager.isArmor(item)) {
      return this._armors;
    }
    return null;
  };

  Game_StorageSystem.prototype.getItemCategory = function (item) {
    if (DataManager.isItem(item) && item.itypeId === 1) {
      return "Items";
    } else if (DataManager.isItem(item) && item.itypeId === 2) {
      return "KeyItems";
    } else if (DataManager.isWeapon(item)) {
      return "Weapons";
    } else if (DataManager.isArmor(item)) {
      return "Armors";
    }
    return false;
  };

  //==========================================================================
  // Window_Base
  //==========================================================================
  if (!Window_Base.prototype.textWidthEx) {
    Window_Base.prototype.textWidthEx = function (text) {
      return this.drawTextEx(text, 0, this.contents.height);
    };
  }

  //==========================================================================
  // Window_StorageTitle
  //==========================================================================
  Window_StorageTitle.prototype = Object.create(Window_Base.prototype);
  Window_StorageTitle.prototype.constructor = Window_StorageTitle;

  Window_StorageTitle.prototype.initialize = function (x, y, w, h) {
    Window_Base.prototype.initialize.call(this, x, y, w, h);
    this._title = $gameStorageSystems.current().title();
    this.refresh();
  };

  Window_StorageTitle.prototype.refresh = function () {
    this.contents.clear();
    const text = this._title;
    const dw = this.contents.width + this.textPadding();
    const tw = this.textWidthEx(text);
    const dx = Math.floor(Math.max(0, dw - tw) / 2);
    this.drawTextEx(text, this.textPadding() + dx, 0);
  };

  //==========================================================================
  // Window_StorageCommand
  //==========================================================================
  Window_StorageCommand.prototype = Object.create(Window_HorzCommand.prototype);
  Window_StorageCommand.prototype.constructor = Window_StorageCommand;

  Window_StorageCommand.prototype.initialize = function (x, y) {
    this.setup();
    Window_HorzCommand.prototype.initialize.call(this, x, y);
    this.select(0);
  };

  Window_StorageCommand.prototype.setup = function () {
    let data = $gameStorageSystems.current().data();
    this._storageMode = data.storageMode;
    this._lootAllButton = data.lootAllButton;
    data = data.command;
    this._align = data.align;
    this._rows = data.rows;
    this._cols = data.cols;
    this._width = eval(data.width);
    this._addText = data.addText;
    this._removeText = data.removeText;
  };

  Window_StorageCommand.prototype.itemAlign = function () {
    return this._align;
  };

  Window_StorageCommand.prototype.windowWidth = function () {
    return this._width;
  };

  Window_StorageCommand.prototype.numVisibleRows = function () {
    return this._rows;
  };

  Window_StorageCommand.prototype.maxCols = function () {
    return this._cols + this._lootAllButton;
  };

  Window_StorageCommand.prototype.makeCommandList = function () {
    if (this._storageMode === "Remove") {
      this.addCommand(this._removeText, "remove");
    } else if (this._storageMode === "Add") {
      this.addCommand(this._addText, "add");
    } else {
      this.addCommand(this._addText, "add");
      this.addCommand(this._removeText, "remove");
    }
    if (this._lootAllButton) {
      this.addCommand(
        "Loot All",
        "loot_all",
        !$gameStorageSystems.current().isEmpty()
      );
    }
  };

  Window_StorageCommand.prototype.lastOption = function () {
    return this._index;
  };

  //==========================================================================
  // Window_StorageCategory
  //==========================================================================
  Window_StorageCategory.prototype = Object.create(
    Window_HorzCommand.prototype
  );
  Window_StorageCategory.prototype.constructor = Window_StorageCategory;

  Window_StorageCategory.prototype.initialize = function (x, y) {
    this.setup();
    Window_HorzCommand.prototype.initialize.call(this, x, y);
  };

  Window_StorageCategory.prototype.setup = function () {
    const data = $gameStorageSystems.current().data().category;
    this._align = data.align;
    this._rows = data.rows;
    this._cols = data.cols;
    this._width = eval(data.width);
  };

  Window_StorageCategory.prototype.itemAlign = function () {
    return this._align;
  };

  Window_StorageCategory.prototype.windowWidth = function () {
    return this._width;
  };

  Window_StorageCategory.prototype.numVisibleRows = function () {
    return this._rows;
  };

  Window_StorageCategory.prototype.maxCols = function () {
    return this._cols;
  };

  if (!Imported.YEP_X_ItemCategories) {
    Window_StorageCategory.prototype.makeCommandList = function () {
      const data = $gameStorageSystems.current().allowedTypes();
      const length = data.length;
      for (let i = 0; i < length; i++) {
        const category = data[i].trim();
        this.addItemCategory(category);
      }
    };

    Window_StorageCategory.prototype.addItemCategory = function (category) {
      if (category.match(/KeyItems/i)) {
        return this.addCommand(TextManager.keyItem, "keyItem");
      } else if (category.match(/Items/i)) {
        return this.addCommand(TextManager.item, "item");
      } else if (category.match(/Weapons/i)) {
        return this.addCommand(TextManager.weapon, "weapon");
      } else if (category.match(/Armors/i)) {
        return this.addCommand(TextManager.armor, "armor");
      }
    };
  } else {
    // Imported.YEP_X_ItemCategories
    Window_StorageCategory.prototype.makeCommandList = function () {
      const data = $gameStorageSystems.current().allowedTypes();
      const length = data.length;
      for (let i = 0; i < length; i++) {
        const category = data[i].trim();
        Window_ItemCategory.prototype.addItemCategory.call(this, category);
      }
    };
  } // Imported.YEP_X_ItemCategories

  Window_StorageCategory.prototype.update = function () {
    Window_HorzCommand.prototype.update.call(this);
    if (this.visible) {
      this._itemWindow.setCategory(this.currentSymbol());
      this._itemWindow.setExt(this.currentExt());
    }
  };

  Window_StorageCategory.prototype.setItemWindow = function (itemWindow) {
    this._itemWindow = itemWindow;
    this.update();
  };

  //==========================================================================
  // Window_StorageItemList
  //==========================================================================
  Window_StorageItemList.prototype = Object.create(Window_ItemList.prototype);
  Window_StorageItemList.prototype.constructor = Window_StorageItemList;

  Window_StorageItemList.prototype.initialize = function (x, y, w, h) {
    this.setup();
    Window_ItemList.prototype.initialize.call(this, x, y, w, h);
    this._mode = "none";
    this._storage = $gameStorageSystems.current();
  };

  Window_StorageItemList.prototype.setup = function () {
    const data = $gameStorageSystems.current().data().item;
    this._cols = data.cols;
  };

  Window_StorageItemList.prototype.maxCols = function () {
    return this._cols;
  };

  Window_StorageItemList.prototype.setExt = function (ext) {
    if (this._ext !== ext) {
      this._ext = ext;
      this.refresh();
      this.resetScroll();
    }
  };

  Window_StorageItemList.prototype.setMode = function (mode) {
    if (this._mode !== mode) {
      this._mode = mode;
      this.refresh();
      this.resetScroll();
    }
  };

  Window_StorageItemList.prototype.refresh = function () {
    Window_ItemList.prototype.refresh.call(this);
    if (this._helpWindow) {
      this._helpWindow.setItem(this.item());
      this._helpWindow.refresh();
    }
  };

  Window_StorageItemList.prototype.mode = function () {
    return this._mode;
  };

  if (!Imported.YEP_X_ItemCategories) {
    Window_StorageItemList.prototype.includes = function (item) {
      if (!this._storage.canStoreItem(item)) {
        return false;
      }
      switch (this._category) {
        case "item":
          return DataManager.isItem(item) && item.itypeId === 1;
        case "weapon":
          return DataManager.isWeapon(item);
        case "armor":
          return DataManager.isArmor(item);
        case "keyItem":
          return DataManager.isItem(item) && item.itypeId === 2;
        case "AllItems":
          return this._storage.isTypeAllowed(
            this._storage.getItemCategory(item)
          );
        default:
          return false;
      }
    };
  } else {
    // Imported.YEP_X_ItemCategories
    Window_StorageItemList.prototype.includes = function (item) {
      if (!item) return false;
      if (!this._storage.canStoreItem(item)) {
        return false;
      }
      if (this._category === "AllItems") return true;
      return Window_ItemList.prototype.includes.call(this, item);
    };
  } // Imported.YEP_X_ItemCategories

  Window_StorageItemList.prototype.makeItemList = function () {
    if (this._mode === "add") {
      this._data = $gameParty.allItems().filter(function (item) {
        return this.includes(item);
      }, this);
    } else if (this._mode === "remove") {
      this._data = this._storage.allItems().filter(function (item) {
        return this.includes(item);
      }, this);
    }
    if (this.includes(null)) {
      this._data.push(null);
    }
  };

  Window_StorageItemList.prototype.drawItemNumber = function (
    item,
    x,
    y,
    width
  ) {
    this.drawText("x", x, y, width - this.textWidth("00"), "right");
    const itemNum =
      this._mode === "add"
        ? $gameParty.numItems(item)
        : this._storage.numItems(item);
    this.drawText(itemNum, x, y, width, "right");
  };

  Window_StorageItemList.prototype.isEnabled = function (item) {
    if (!item) {
      return false;
    }
    if (item.cannotStore) {
      return false;
    }
    if (this._mode === "add") {
      if (this._storage.numItems(item) > 0) {
        return this._storage.maxItems(item) > 0;
      }
      return this._storage.capacity() < this._storage.maxCapacity();
    } else {
      return $gameParty.maxItems(item) - $gameParty.numItems(item) > 0;
    }
  };

  //==========================================================================
  // Window_StorageInfo
  //==========================================================================
  Window_StorageInfo.prototype = Object.create(Window_Base.prototype);
  Window_StorageInfo.prototype.constructor = Window_StorageInfo;

  Window_StorageInfo.prototype.initialize = function (x, y, w, h) {
    Window_Base.prototype.initialize.call(this, x, y, w, h);
    this._storage = $gameStorageSystems.current();
    this._text = this._storage.data().infoText;
    this.refresh();
  };

  Window_StorageInfo.prototype.text = function () {
    return this._text.replace(
      "%1",
      this._storage.capacity() + "/" + this._storage.maxCapacity()
    );
  };

  Window_StorageInfo.prototype.refresh = function () {
    this.contents.clear();
    this.drawTextEx(this.text(), this.textPadding(), 0);
  };

  //==========================================================================
  // Window_StorageNumber
  //==========================================================================
  Window_StorageNumber.prototype = Object.create(Window_ShopNumber.prototype);
  Window_StorageNumber.prototype.constructor = Window_StorageNumber;

  Window_StorageNumber.prototype.initialize = function (x, y, w, h) {
    Window_Selectable.prototype.initialize.call(this, x, y, w, h);
    this._storage = $gameStorageSystems.current();
    this._item = null;
    this._max = 1;
    this._number = 1;
    this.createButtons();
  };

  Window_StorageNumber.prototype.setup = function (item, mode) {
    this._item = item;
    this._number = 1;
    if (mode === "add") {
      this._max = $gameParty.numItems(item);
      if (this._max > this._storage.maxItems(item)) {
        this._max = this._storage.maxItems(item);
      }
    } else {
      this._max = this._storage.numItems(item);
      if (this._max + $gameParty.numItems(item) > $gameParty.maxItems(item)) {
        this._max = $gameParty.maxItems(item) - $gameParty.numItems(item);
      }
    }
    if (this._max < 0) {
      this._max = 0;
    }
    this.placeButtons();
    this.updateButtonsVisiblity();
    this.refresh();
  };

  Window_StorageNumber.prototype.refresh = function () {
    this.contents.clear();
    this.drawItemName(this._item, 0, this.itemY());
    this.drawNumber();
    this.drawMax();
  };

  Window_StorageNumber.prototype.drawNumber = function () {
    const x = this.cursorX();
    const y = this.itemY();
    const width = this.cursorWidth() - this.textPadding();
    this.resetTextColor();
    this.drawText(this._number, x, y, width, "right");
  };

  Window_StorageNumber.prototype.drawMax = function () {
    const width = this.contentsWidth() - this.textPadding();
    this.resetTextColor();
    this.drawText(this._max, 0, this.priceY(), width, "right");
  };

  //==========================================================================
  // Scene_Storage
  //==========================================================================
  Scene_Storage.prototype = Object.create(Scene_MenuBase.prototype);
  Scene_Storage.prototype.constructor = Scene_Storage;

  Scene_Storage.prototype.initialize = function () {
    this.setup();
    Scene_MenuBase.prototype.initialize.call(this);
    this._storage = $gameStorageSystems.current();
  };

  Scene_Storage.prototype.setup = function () {
    const data = $gameStorageSystems.current().data();
    this._background = data.background;
    this._blurredBackground = data.blurredBackground;
    this._displayCategories = data.displayCategories;
    this._helpData = data.help;
    this._titleData = data.title;
    this._commandData = data.command;
    this._categoryData = data.category;
    this._infoData = data.info;
    this._itemData = data.item;
    this._numberData = data.number;
    this._lootAllButton = data.lootAllButton;
  };

  Scene_Storage.prototype.createBackground = function () {
    if (this._blurredBackground) {
      this._backgroundSprite = new Sprite();
      this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
      this.addChild(this._backgroundSprite);
    } else if (this._background !== "") {
      this._backgroundSprite = new Sprite();
      this._backgroundSprite.bitmap = ImageManager.loadPicture(
        this._background
      );
      this.addChild(this._backgroundSprite);
    }
  };

  Scene_Storage.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createTitleWindow();
    this.createCommandWindow();
    if (this._displayCategories) {
      this.createCategoryWindow();
    }
    this.createInfoWindow();
    this.createItemWindow();
    this.createNumberWindow();
  };

  Scene_Storage.prototype.createHelpWindow = function () {
    this._helpWindow = new Window_Help();
    this.addWindow(this._helpWindow);
    this._helpWindow.x = eval(this._helpData.x);
    this._helpWindow.y = eval(this._helpData.y);
    this._helpWindow.width = eval(this._helpData.width);
    this._helpWindow.height = eval(this._helpData.height);
  };

  Scene_Storage.prototype.createTitleWindow = function () {
    const wx = eval(this._titleData.x);
    const wy = eval(this._titleData.y);
    const ww = eval(this._titleData.width);
    const wh = eval(this._titleData.height);
    this._titleWindow = new Window_StorageTitle(wx, wy, ww, wh);
    this.addWindow(this._titleWindow);
  };

  Scene_Storage.prototype.createCommandWindow = function () {
    const wx = eval(this._commandData.x);
    const wy = eval(this._commandData.y);
    this._commandWindow = new Window_StorageCommand(wx, wy);
    if (this._displayCategories) {
      this._commandWindow.setHandler("add", this.onCommandOk.bind(this));
      this._commandWindow.setHandler("remove", this.onCommandOk.bind(this));
    } else {
      this._commandWindow.setHandler("add", this.onCategoryOk.bind(this));
      this._commandWindow.setHandler("remove", this.onCategoryOk.bind(this));
    }
    if (this._lootAllButton) {
      this._commandWindow.setHandler("loot_all", this.lootAll.bind(this));
    }
    this._commandWindow.setHandler("cancel", this.onCommandCancel.bind(this));
    this.addWindow(this._commandWindow);
  };

  Scene_Storage.prototype.createCategoryWindow = function () {
    const wx = eval(this._categoryData.x);
    const wy = eval(this._categoryData.y);
    this._categoryWindow = new Window_StorageCategory(wx, wy);
    this._categoryWindow.setHandler("ok", this.onCategoryOk.bind(this));
    this._categoryWindow.setHandler("cancel", this.onCategoryCancel.bind(this));
    this._categoryWindow.deactivate();
    this._categoryWindow.hide();
    this.addWindow(this._categoryWindow);
  };

  Scene_Storage.prototype.createInfoWindow = function () {
    const wx = eval(this._infoData.x);
    const wy = eval(this._infoData.y);
    const ww = eval(this._infoData.width);
    this._infoWindow = new Window_StorageInfo(wx, wy, ww, 80);
    this.addWindow(this._infoWindow);
  };

  Scene_Storage.prototype.createItemWindow = function () {
    const wx = eval(this._itemData.x);
    const wy = eval(this._itemData.y);
    const ww = eval(this._itemData.width);
    const wh = eval(this._itemData.height);
    this._itemWindow = new Window_StorageItemList(wx, wy, ww, wh);
    this._itemWindow.setHelpWindow(this._helpWindow);
    if (this._displayCategories) {
      this._categoryWindow.setItemWindow(this._itemWindow);
    }
    this._itemWindow.setHandler("ok", this.onItemOk.bind(this));
    this._itemWindow.setHandler("cancel", this.onItemCancel.bind(this));
    this.addWindow(this._itemWindow);
    this.showWholeStorage();
  };

  Scene_Storage.prototype.showWholeStorage = function () {
    this._itemWindow.setMode("remove");
    this._itemWindow.setCategory("AllItems");
    this._itemWindow.refresh();
  };

  Scene_Storage.prototype.createNumberWindow = function () {
    const wx = eval(this._numberData.x);
    const wy = eval(this._numberData.y);
    const ww = eval(this._numberData.width);
    const wh = eval(this._numberData.height);
    this._numberWindow = new Window_StorageNumber(wx, wy, ww, wh);
    this._numberWindow.setHandler("ok", this.onNumberOk.bind(this));
    this._numberWindow.setHandler("cancel", this.onNumberCancel.bind(this));
    this._numberWindow.hide();
    this.addWindow(this._numberWindow);
  };

  Scene_Storage.prototype.activateItemWindow = function () {
    this._infoWindow.refresh();
    this._itemWindow.refresh();
    this._itemWindow.activate();
  };

  Scene_Storage.prototype.item = function () {
    return this._itemWindow.item();
  };

  Scene_Storage.prototype.onCommandCancel = function () {
    SceneManager.pop();
  };

  Scene_Storage.prototype.onCommandOk = function () {
    this._itemWindow.setMode(this._commandWindow.currentSymbol());
    this._commandWindow.deactivate();
    this._commandWindow.hide();
    this._categoryWindow.activate();
    this._categoryWindow.select(0);
    this._categoryWindow.show();
  };

  Scene_Storage.prototype.onCategoryOk = function () {
    this._itemWindow.activate();
    this._itemWindow.selectLast();
    if (!this._displayCategories) {
      this._itemWindow.setMode(this._commandWindow.currentSymbol());
      this._itemWindow.setCategory("AllItems");
      this._itemWindow.refresh();
    }
  };

  Scene_Storage.prototype.onCategoryCancel = function () {
    this._categoryWindow.deselect();
    this._categoryWindow.deactivate();
    this._categoryWindow.hide();
    this._commandWindow.refresh();
    this._commandWindow.show();
    this._commandWindow.activate();
    this.showWholeStorage();
  };

  Scene_Storage.prototype.onItemOk = function () {
    this._item = this._itemWindow.item();
    this._itemWindow.deactivate();
    this._numberWindow.setup(this._item, this._itemWindow.mode());
    this._numberWindow.show();
    this._numberWindow.activate();
  };

  Scene_Storage.prototype.storeItem = function (amount) {
    this._storage.addItem(this.item(), amount);
    $gameParty.loseItem(this.item(), amount);
  };

  Scene_Storage.prototype.depositItem = function (amount) {
    this._storage.removeItem(this.item(), amount);
    $gameParty.gainItem(this.item(), amount);
  };

  Scene_Storage.prototype.lootAll = function () {
    this._storage.allItems().forEach((item) => {
      let amount = this._storage.numItems(item);
      if (amount > $gameParty.maxItems(item) - $gameParty.numItems(item)) {
        amount = $gameParty.maxItems(item) - $gameParty.numItems(item);
      }
      $gameParty.gainItem(item, amount);
      this._storage.removeItem(item, amount);
    });
    this._itemWindow.refresh();
    this._infoWindow.refresh();
    this._commandWindow.refresh();
    this._commandWindow.activate();
  };

  Scene_Storage.prototype.onItemCancel = function () {
    this._itemWindow.deselect();
    this._commandWindow.refresh();
    this._helpWindow.clear();
    if (this._displayCategories) {
      this._categoryWindow.activate();
    } else {
      this._itemWindow.setCategory("none");
      this._commandWindow.activate();
      this.showWholeStorage();
    }
  };

  Scene_Storage.prototype.onNumberOk = function () {
    const okSound = this._numberData.okSound;
    if (okSound && okSound.name) {
      AudioManager.playSe(okSound);
    } else {
      SoundManager.playShop();
    }
    const mode = this._itemWindow.mode();
    if (mode === "add") {
      this.storeItem(this._numberWindow.number());
    } else if (mode === "remove") {
      this.depositItem(this._numberWindow.number());
    }
    this.endNumberInput();
  };

  Scene_Storage.prototype.endNumberInput = function () {
    this._numberWindow.hide();
    this._itemWindow.refresh();
    this._infoWindow.refresh();
    this._itemWindow.activate();
  };

  Scene_Storage.prototype.onNumberCancel = function () {
    SoundManager.playCancel();
    this.endNumberInput();
  };
})(WAYModuleLoader.getModule("WAY_StorageSystem"));

//-----------------------------------------------------------------------------
function Window_StorageTitle() {
  this.initialize.apply(this, arguments);
}

function Window_StorageCommand() {
  this.initialize.apply(this, arguments);
}

function Window_StorageCategory() {
  this.initialize.apply(this, arguments);
}

function Window_StorageItemList() {
  this.initialize.apply(this, arguments);
}

function Window_StorageInfo() {
  this.initialize.apply(this, arguments);
}

function Window_StorageNumber() {
  this.initialize.apply(this, arguments);
}

function Scene_Storage() {
  this.initialize.apply(this, arguments);
}

function Game_StorageSystems() {
  this.initialize.apply(this, arguments);
}

function Game_StorageSystem() {
  this.initialize.apply(this, arguments);
}
//-----------------------------------------------------------------------------

/*~struct~storage:
@param blurredBackground
@text Use blurred transparent background
@type boolean
@default false

@param background
@text Menu Background
@type file
@dir img/pictures
@default

@param titleText
@text Storage Title
@type text
@default \i[210]STORAGE SYSTEM

@param infoText
@text Info Window Text
@type text
@default Capacity: %1\i[208]

@param maxCapacity
@text Max Capacity
@type number
@min 1
@max 9999
@default 20

@param stackSize
@text Item Stack Size
@type combo
@option none
@option 8
@option 16
@option 32
@option 64
@default none

@param displayCategories
@text Display Categories
@type boolean
@default true

@param allowedTypes
@text Allowed Item Types
@type text[]
@default ["items","armors","weapons","keyitems"]

@param storageMode
@text Storage Mode
@type combo
@option "Add/Remove"
@option "Add"
@option "Remove"
@default "Add/Remove"

@param lootAllButton
@text Show Loot All Button
@type boolean
@default false

@param Scene Settings
@default Customize window parameters.

@param help
@text Help Window Settings
@type struct<help>
@default {"x":"0","y":"Graphics.boxHeight - this._helpWindow.height - 80","width":"Graphics.boxWidth","height":"108"}
@parent Scene Settings

@param title
@text Title Window Settings
@type struct<title>
@default {"x":"0","y":"0","width":"Graphics.boxWidth","height":"72"}
@parent Scene Settings

@param command
@text Command Window Settings
@type struct<command>
@default {"align":"center","x":"0","y":"72","width":"Graphics.boxWidth","rows":"1","cols":"2","addText":"Add","removeText":"Remove"}
@parent Scene Settings

@param category
@text Category Window Settings
@type struct<category>
@default {"align":"center","x":"0","y":"72","width":"Graphics.boxWidth","rows":"1","cols":"4"}
@parent Scene Settings

@param item
@text Item Window Settings
@type struct<item>
@default {"x":"0","y":"144","width":"Graphics.boxWidth","height":"Graphics.boxHeight - 224 - this._helpWindow.height","cols":"2"}
@parent Scene Settings

@param info
@text Info Window Settings
@type struct<info>
@default {"x":"0","y":"Graphics.boxHeight - 80","width":"Graphics.boxWidth"}
@parent Scene Settings

@param number
@text Number Window Settings
@type struct<number>
@default {"x":"Graphics.boxWidth / 2 - 250","y":"168","width":"500","height":"450"}
@parent Scene Settings
*/

/*~struct~help:
@param x
@text Help Window X
@type text
@default 0

@param y
@text Help Window Y
@type text
@default Graphics.boxHeight - this._helpWindow.height - 80

@param width
@text Help Window Width
@type text
@default Graphics.boxWidth

@param height
@text Help Window Height
@type text
@default 108
*/

/*~struct~title:
@param x
@text Title Window X
@type text
@default 0

@param y
@text Title Window Y
@type text
@default 0

@param width
@text Title Window Width
@type text
@default Graphics.boxWidth

@param height
@text Title Window Height
@type text
@default 72
*/

/*~struct~command:
@param align
@text Command Window Align
@type select
@option left
@option center
@option right
@default center

@param x
@text Command Window X
@type text
@default 0

@param y
@text Command Window Y
@type text
@default 72

@param width
@text Command Window Width
@type text
@default Graphics.boxWidth

@param rows
@text Command Window Rows
@type number
@min 1
@default 1

@param cols
@text Command Window Cols
@type number
@min 1
@default 2

@param addText
@text Add Text
@type text
@default Add

@param removeText
@text Remove Text
@type text
@default Remove
*/

/*~struct~category:
@param align
@text Category Window Align
@type select
@option left
@option center
@option right
@default center

@param x
@text Category Window X
@type text
@default 0

@param y
@text Category Window Y
@type text
@default 72

@param width
@text Category Window Width
@type text
@default Graphics.boxWidth

@param rows
@text Category Window Rows
@type number
@min 1
@default 1

@param cols
@text Category Window Cols
@type number
@min 1
@default 4
*/

/*~struct~item:
@param x
@text Item Window X
@type text
@default 0

@param y
@text Item Window Y
@type text
@default 144

@param width
@text Item Window Width
@type text
@default Graphics.boxWidth

@param height
@text Item Window Height
@type text
@default Graphics.boxHeight - 224

@param cols
@text Item Window Cols
@type number
@min 1
@default 2
*/

/*~struct~info:
@param x
@text Info Window X
@type text
@default 0

@param y
@text Info Window Y
@type text
@default Graphics.boxHeight - 80

@param width
@text Info Window Width
@type text
@default Graphics.boxWidth
*/

/*~struct~number:
@param x
@text Number Window X
@type text
@default

@param y
@text Number Window Y
@type text
@default

@param width
@text Number Window Width
@type text
@default

@param height
@text Number Window Height
@type text
@default

@param okSound
@text Ok Sound
@type struct<sound>
@default
*/

/*~struct~sound:
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

//-----------------------------------------------------------------------------
