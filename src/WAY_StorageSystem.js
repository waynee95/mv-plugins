/* globals WAY, WAYModuleLoader */
// ===========================================================================
// WAY_StorageSystem.js
// ===========================================================================
/*:
@plugindesc v0.0.0 Create storage systems where the player can store his items. 
<WAY_StorageSystem>

@author waynee95

@param storages
@text Storage Systems
@desc Add Storage Systems to your game.
@type struct<storage>[]
@default

@help
==============================================================================
 ■ Terms of Use
==============================================================================
Credit must be given to: waynee95
Please don't share my plugins anywhere, except if you have my permissions.

My plugins may be used in commercial and non-commercial products.
*/

'use strict';

if (WAY === undefined) {
    console.error('You need to install WAY_Core!'); //eslint-disable-line no-console
    if (Utils.isNwjs() && Utils.isOptionValid('test')) {
        var gui = require('nw.gui'); //eslint-disable-line
        gui.Window.get().showDevTools();
    }
    SceneManager.stop();
} else {
    WAYModuleLoader.registerPlugin('WAY_StorageSystem', '0.0.0', 'waynee95');
}

const $gameStorageSystems = {};

($ => {
    const { getNotetag, toArray, toBool, toInt, negate, map, piper, tryEval } = WAY.Util;
    const { TitleWindow } = WAY.Window;

    const $dataStorage = $.parameters.storages;

    const parseNotetags = obj => {
        obj.cannotStore = getNotetag(obj.note, 'Cannot Store', null, toBool);
        obj.storeOnlyIn = getNotetag(obj.note, 'Store Only In', [], toArray);
    };

    WAY.EventEmitter.on('load-item-notetags', parseNotetags);
    WAY.EventEmitter.on('load-weapon-notetags', parseNotetags);
    WAY.EventEmitter.on('load-armor-notetags', parseNotetags);

    const getContainer = num => {
        switch (num) {
        case 0:
            return $dataItems;
        case 1:
            return $dataWeapons;
        case 2:
            return $dataArmors;
        default:
            return [];
        }
    };

    const getItemCategory = item => {
        if (DataManager.isItem(item) && item.itypeId === 1) {
            return 'Items';
        } else if (DataManager.isItem(item) && item.itypeId === 2) {
            return 'KeyItems';
        } else if (DataManager.isWeapon(item)) {
            return 'Weapons';
        } else if (DataManager.isArmor(item)) {
            return 'Armors';
        }
        return false;
    };

    PluginManager.addCommand('StorageSystem', {
        open(storageId = $gameStorageSystems._lastActive) {
            $gameStorageSystems.open(storageId);
        },
        addItem(storageId, itemType, itemId, quantity) {
            $gameStorageSystems
                .storage(toInt(storageId))
                .addItem(getContainer(itemType)[itemId], toInt(quantity));
        },
        removeItem(storageId, itemType, itemId, quantity) {
            $gameStorageSystems
                .storage(toInt(storageId))
                .rempveItem(getContainer(itemType)[itemId], piper(toInt, negate)(quantity));
        },
        clear(storageId) {
            $gameStorageSystems.storage(toInt(storageId)).clear();
        },
        setMaxCapacity(storageId, capacity) {
            $gameStorageSystems.storage(toInt(storageId)).changeMaxCapacity(toInt(capacity));
        }
    });

    class StorageSystemManager {
        constructor() {
            this._data = [];
            this._lastActive = 0;
        }
        get(storageId) {
            if ($dataStorage[storageId]) {
                if (!this._data[storageId]) {
                    this._data[storageId] = new StorageSystem(storageId);
                }
                return this._data[storageId];
            }
            return null;
        }
        current() {
            return this.get(this._lastActive);
        }
        open(storageId) {
            if (storageId) {
                this._lastActive = storageId;
            }
            SceneManager.push(Scene_Storage);
        }
    }

    class StorageSystem {
        constructor(storageId) {
            this._storageId = storageId;
            this.clear();
        }
        storageId() {
            return this._storageId;
        }
        title() {
            return $dataStorage[this._storageId].title;
        }
        allowedTypes() {
            return $dataStorage[this._storageId].allowedTypes;
        }
        maxCapacity() {
            return $dataStorage[this._storageId].maxCapacity;
        }
        stackSize() {
            const { stackSize } = $dataStorage[this._storageId];
            return stackSize !== 'none' ? toInt(stackSize) : 'none';
        }
        changeMaxCapacity(capacity) {
            this.maxCapacity = capacity;
        }
        getCapacity() {
            let sum = 0;
            if (this.stackSize() === 'none') {
                sum = this.getAllItems()
                    .map(item => this.numItems(item))
                    .reduce((total, current) => total + current, 0);
            } else {
                sum = this.allItems().length;
            }
            return sum;
        }
        getItems() {
            return Object.keys(this._items).map(id => $dataItems[id]);
        }
        getWeapons() {
            return Object.keys(this._weapons).map(id => $dataWeapons[id]);
        }
        getArmor() {
            return Object.keys(this._armors).map(id => $dataArmors[id]);
        }
        getEquipItems() {
            return this.getWeapons().concat(this.getArmor());
        }
        getAllItems() {
            return this.getItems().concat(this.getEquipItems());
        }
        isEmpty() {
            return this.getAllItems().length === 0;
        }
        addItem(item, amount) {
            const container = this.itemContainer(item);
            if (container) {
                const currentAmount = this.numItems(item);
                const newAmount = currentAmount + amount;
                if (amount > 0) {
                    container[item.id] = newAmount.clamp(0, this.maxItems(item));
                } else {
                    container[item.id] = newAmount.clamp(0, this.numItems(item));
                }
                if (container[item.id] === 0) {
                    delete container[item.id];
                }
            }
        }
        removeItem(item, amount = this.numItems(item)) {
            this.addItem(item, -amount);
        }
        clear() {
            this._items = {};
            this._weapons = {};
            this._armors = {};
        }
        isTypeAllowed(type) {
            return type && this._allowedTypes.contains(type.toLowerCase());
        }
        numItems(item) {
            const container = this.itemContainer(item);
            return container ? container[item.id] || 0 : 0;
        }
        maxItems(item) {
            if (this.stackSize() === 'none') {
                return this.maxCapacity() - this.capacity();
            } else if (this.numItems(item) > 0 || this.maxCapacity() - this.capacity() > 0) {
                return this.stackSize() - this.numItems(item);
            } else if (this.maxCapacity() - this.capacity() < 0) {
                return 0;
            }
            return 0;
        }
        itemContainer(item) {
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
        }
    }

    class StorageCommadWindow {}
    class StorageCategoryWindow {}
    class StorageInfoWindow {}
    class StorageNumberWindow {}
    class StorageListWindow {}

    class SceneStorage extends Scene_MenuBase {
        constructor() {
            super();
            this._storage = $gameStorageSystems.current();
        }
        setup() {
            const {
                background,
                displayCategories,
                help,
                title,
                command,
                category,
                info,
                item,
                number
            } = $gameStorageSystems.current().data();
            this._background = background;
            this._displayCategories = displayCategories;
            this._helpData = help;
            this._titleData = title;
            this._commandData = command;
            this._categoryData = category;
            this._infoData = info;
            this._itemData = item;
            this._numberData = number;
        }
        createBackground() {
            if (this._background !== '') {
                this._backgroundSprite = new Sprite();
                this._backgroundSprite.bitmap = ImageManager.loadPicture(this._background);
                this.addChild(this._backgroundSprite);
            }
        }
        create() {
            super.create();
            this.createHelpWindow();
            this.createTitleWindow();
            this.createCommandWindow();
            if (this._displayCategories) {
                this.createCategoryWindow();
            }
            this.createInfoWindow();
            this.createItemWindow();
            this.createNumberWindow();
        }
        createHelpWindow() {
            this._helpWindow = new Window_Help();
            this.addWindow(this._helpWindow);
            const { x, y, width, height } = map(this._helpData, tryEval);
            this._helpWindow.x = x;
            this._helpWindow.y = y;
            this._helpWindow.width = width;
            this._helpWindow.height = height;
        }
        createTitleWindow() {
            const { x, y, width, height } = map(this._titleData, tryEval);
            this._titleWindow = new TitleWindow(x, y, width, height);
            this.addWindow(this._titleWindow);
        }
        setCommandHandlers() {
            if (this._displayCategories) {
                this._commandWindow.setHandler('add', this.onCommandOk.bind(this));
                this._commandWindow.setHandler('remove', this.onCommandOk.bind(this));
            } else {
                this._commandWindow.setHandler('add', this.onCategoryOk.bind(this));
                this._commandWindow.setHandler('remove', this.onCategoryOk.bind(this));
            }
            this._commandWindow.setHandler('cancel', this.popScene.bind(this));
        }
        createCommandWindow() {
            const { x, y } = map(this._commandData, tryEval);
            this._commandWindow = new StorageCommadWindow(x, y);
            this.setCommandHandlers();
            this.addWindow(this._commandWindow);
        }
        setCategoryHandlers() {
            this._categoryWindow.setHandler('ok', this.onCategoryOk.bind(this));
            this._categoryWindow.setHandler('cancel', this.onCategoryCancel.bind(this));
        }
        createCategoryWindow() {
            const { x, y } = map(tryEval, this._categoryData);
            this._categoryWindow = new StorageCategoryWindow(x, y);
            this.setCategoryHandlers();
            this._categoryWindow.deactivate();
            this._categoryWindow.hide();
            this.addWindow(this._categoryWindow);
        }
        createInfoWindow() {
            const { x, y, width } = map(this._infoData, tryEval);
            this._infoWindow = new StorageInfoWindow(x, y, width, 80);
            this.addWindow(this._infoWindow);
        }
        setListHandlers() {
            this._itemWindow.setHelpWindow(this._helpWindow);
            if (this._displayCategories) {
                this._categoryWindow.setItemWindow(this._itemWindow);
            }
            this._itemWindow.setHandler('ok', this.onItemOk.bind(this));
            this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
        }
        createItemWindow() {
            const { x, y, width, height } = map(this._itemData, tryEval);
            this._itemWindow = new StorageListWindow(x, y, width, height);
            this.setListHandlers();
            this.addWindow(this._itemWindow);
        }
        setNumberHandlers() {
            this._numberWindow.setHandler('ok', this.onNumberOk.bind(this));
            this._numberWindow.setHandler('cancel', this.onNumberCancel.bind(this));
        }
        createNumberWindow() {
            const { x, y, width, height } = map(this._numberData, tryEval);
            this._numberWindow = new StorageNumberWindow(x, y, width, height);
            this.setNumberHandlers();
            this._numberWindow.hide();
            this.addWindow(this._numberWindow);
        }
        activateItemWindow() {
            this._infoWindow.refresh();
            this._itemWindow.refresh();
            this._itemWindow.activate();
        }
        item() {
            return this._itemWindow.item();
        }
        onCommandOk() {
            this._itemWindow.setMode(this._commandWindow.currentSymbol());
            this._commandWindow.deactivate();
            this._commandWindow.hide();
            this._categoryWindow.activate();
            this._categoryWindow.select(0);
            this._categoryWindow.show();
        }
        onCategoryOk() {
            this._itemWindow.activate();
            this._itemWindow.selectLast();
            if (!this._displayCategories) {
                this._itemWindow.setMode(this._commandWindow.currentSymbol());
                this._itemWindow.setCategory('AllItems');
                this._itemWindow.refresh();
            }
        }
        onCategoryCancel() {
            this._categoryWindow.deselect();
            this._categoryWindow.deactivate();
            this._categoryWindow.hide();
            this._commandWindow.show();
            this._commandWindow.activate();
        }
        onItemOk() {
            this._item = this._itemWindow.item();
            this._itemWindow.deactivate();
            this._numberWindow.setup(this._item, this._itemWindow.mode());
            this._numberWindow.show();
            this._numberWindow.activate();
        }
        storeItem(amount) {
            this._storage.addItem(this.item(), amount);
            $gameParty.loseItem(this.item(), amount);
        }
        depositItem(amount) {
            this._storage.removeItem(this.item(), amount);
            $gameParty.gainItem(this.item(), amount);
        }
        onItemCancel() {
            this._itemWindow.deselect();
            this._helpWindow.clear();
            if (this._displayCategories) {
                this._categoryWindow.activate();
            } else {
                this._itemWindow.setCategory('none');
                this._commandWindow.activate();
            }
        }
        onNumberOk() {
            SoundManager.playShop();
            const mode = this._itemWindow.mode();
            if (mode === 'add') {
                this.storeItem(this._numberWindow.number());
            } else if (mode === 'remove') {
                this.depositItem(this._numberWindow.number());
            }
            this.endNumberInput();
        }
        endNumberInput() {
            this._numberWindow.hide();
            this._itemWindow.refresh();
            this._infoWindow.refresh();
            this._itemWindow.activate();
        }
        onNumberCancel() {
            SoundManager.playCancel();
            this.endNumberInput();
        }
    }
})(WAYModuleLoader.getModule('WAY_StorageSystem'));
