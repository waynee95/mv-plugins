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
    const { getNotetag, toArray, toBool, toInt, negate, piper } = WAY.Util;
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
            if (typeof $dataStorage[storageId] !== 'object') {
                return null;
            }
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
        open(storageId = this._lastActive) {
            if (!this.current()) {
                return;
            }
            SceneManager.push(Scene_Storage);
        }
    }

    class StorageSystem {
        constructor(storageId) {
            const storage = $dataStorage[storageId];
            this.storageId = storageId;
            this.title = storage.titleText;
            this.allowedTypes = storage.allowedTypes;
            this.maxCapacity = storage.maxCapacity;
            this.stackSize = storage.stackSize !== 'none' ? toInt(storage.stackSize) : 'none';
            this.clear();
        }
        changeMaxCapacity(capacity) {
            this.maxCapacity = capacity;
        }
        getCapacity() {
            let sum = 0;
            if (this._stackSize === 'none') {
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
            if (this._stackSize === 'none') {
                return this.maxCapacity() - this.capacity();
            } else if (this.numItems(item) > 0 || this.maxCapacity() - this.capacity() > 0) {
                return this._stackSize - this.numItems(item);
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
})(WAYModuleLoader.getModule('WAY_StorageSystem'));
