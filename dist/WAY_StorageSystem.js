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

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

var $gameStorageSystems = {};

(function ($) {
    var _WAY$Util = WAY.Util,
        getNotetag = _WAY$Util.getNotetag,
        toArray = _WAY$Util.toArray,
        toBool = _WAY$Util.toBool,
        toInt = _WAY$Util.toInt,
        negate = _WAY$Util.negate,
        piper = _WAY$Util.piper;

    var $dataStorage = $.parameters.storages;

    var parseNotetags = function () {
        function parseNotetags(obj) {
            obj.cannotStore = getNotetag(obj.note, 'Cannot Store', null, toBool);
            obj.storeOnlyIn = getNotetag(obj.note, 'Store Only In', [], toArray);
        }

        return parseNotetags;
    }();

    WAY.EventEmitter.on('load-item-notetags', parseNotetags);
    WAY.EventEmitter.on('load-weapon-notetags', parseNotetags);
    WAY.EventEmitter.on('load-armor-notetags', parseNotetags);

    var getContainer = function () {
        function getContainer(num) {
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
        }

        return getContainer;
    }();

    var getItemCategory = function () {
        function getItemCategory(item) {
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
        }

        return getItemCategory;
    }();

    PluginManager.addCommand('StorageSystem', {
        open: function () {
            function open() {
                var storageId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : $gameStorageSystems._lastActive;

                $gameStorageSystems.open(storageId);
            }

            return open;
        }(),
        addItem: function () {
            function addItem(storageId, itemType, itemId, quantity) {
                $gameStorageSystems.storage(toInt(storageId)).addItem(getContainer(itemType)[itemId], toInt(quantity));
            }

            return addItem;
        }(),
        removeItem: function () {
            function removeItem(storageId, itemType, itemId, quantity) {
                $gameStorageSystems.storage(toInt(storageId)).rempveItem(getContainer(itemType)[itemId], piper(toInt, negate)(quantity));
            }

            return removeItem;
        }(),
        clear: function () {
            function clear(storageId) {
                $gameStorageSystems.storage(toInt(storageId)).clear();
            }

            return clear;
        }(),
        setMaxCapacity: function () {
            function setMaxCapacity(storageId, capacity) {
                $gameStorageSystems.storage(toInt(storageId)).changeMaxCapacity(toInt(capacity));
            }

            return setMaxCapacity;
        }()
    });

    var StorageSystemManager = function () {
        function StorageSystemManager() {
            _classCallCheck(this, StorageSystemManager);

            this._data = [];
            this._lastActive = 0;
        }

        _createClass(StorageSystemManager, [{
            key: 'get',
            value: function () {
                function get(storageId) {
                    if (_typeof($dataStorage[storageId]) !== 'object') {
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

                return get;
            }()
        }, {
            key: 'current',
            value: function () {
                function current() {
                    return this.get(this._lastActive);
                }

                return current;
            }()
        }, {
            key: 'open',
            value: function () {
                function open() {
                    var storageId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._lastActive;

                    if (!this.current()) {
                        return;
                    }
                    SceneManager.push(Scene_Storage);
                }

                return open;
            }()
        }]);

        return StorageSystemManager;
    }();

    var StorageSystem = function () {
        function StorageSystem(storageId) {
            _classCallCheck(this, StorageSystem);

            var storage = $dataStorage[storageId];
            this.storageId = storageId;
            this.title = storage.titleText;
            this.allowedTypes = storage.allowedTypes;
            this.maxCapacity = storage.maxCapacity;
            this.stackSize = storage.stackSize !== 'none' ? toInt(storage.stackSize) : 'none';
            this.clear();
        }

        _createClass(StorageSystem, [{
            key: 'changeMaxCapacity',
            value: function () {
                function changeMaxCapacity(capacity) {
                    this.maxCapacity = capacity;
                }

                return changeMaxCapacity;
            }()
        }, {
            key: 'getCapacity',
            value: function () {
                function getCapacity() {
                    var _this = this;

                    var sum = 0;
                    if (this._stackSize === 'none') {
                        sum = this.getAllItems().map(function (item) {
                            return _this.numItems(item);
                        }).reduce(function (total, current) {
                            return total + current;
                        }, 0);
                    } else {
                        sum = this.allItems().length;
                    }
                    return sum;
                }

                return getCapacity;
            }()
        }, {
            key: 'getItems',
            value: function () {
                function getItems() {
                    return Object.keys(this._items).map(function (id) {
                        return $dataItems[id];
                    });
                }

                return getItems;
            }()
        }, {
            key: 'getWeapons',
            value: function () {
                function getWeapons() {
                    return Object.keys(this._weapons).map(function (id) {
                        return $dataWeapons[id];
                    });
                }

                return getWeapons;
            }()
        }, {
            key: 'getArmor',
            value: function () {
                function getArmor() {
                    return Object.keys(this._armors).map(function (id) {
                        return $dataArmors[id];
                    });
                }

                return getArmor;
            }()
        }, {
            key: 'getEquipItems',
            value: function () {
                function getEquipItems() {
                    return this.getWeapons().concat(this.getArmor());
                }

                return getEquipItems;
            }()
        }, {
            key: 'getAllItems',
            value: function () {
                function getAllItems() {
                    return this.getItems().concat(this.getEquipItems());
                }

                return getAllItems;
            }()
        }, {
            key: 'isEmpty',
            value: function () {
                function isEmpty() {
                    return this.getAllItems().length === 0;
                }

                return isEmpty;
            }()
        }, {
            key: 'addItem',
            value: function () {
                function addItem(item, amount) {
                    var container = this.itemContainer(item);
                    if (container) {
                        var currentAmount = this.numItems(item);
                        var newAmount = currentAmount + amount;
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

                return addItem;
            }()
        }, {
            key: 'removeItem',
            value: function () {
                function removeItem(item) {
                    var amount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.numItems(item);

                    this.addItem(item, -amount);
                }

                return removeItem;
            }()
        }, {
            key: 'clear',
            value: function () {
                function clear() {
                    this._items = {};
                    this._weapons = {};
                    this._armors = {};
                }

                return clear;
            }()
        }, {
            key: 'isTypeAllowed',
            value: function () {
                function isTypeAllowed(type) {
                    return type && this._allowedTypes.contains(type.toLowerCase());
                }

                return isTypeAllowed;
            }()
        }, {
            key: 'numItems',
            value: function () {
                function numItems(item) {
                    var container = this.itemContainer(item);
                    return container ? container[item.id] || 0 : 0;
                }

                return numItems;
            }()
        }, {
            key: 'maxItems',
            value: function () {
                function maxItems(item) {
                    if (this._stackSize === 'none') {
                        return this.maxCapacity() - this.capacity();
                    } else if (this.numItems(item) > 0 || this.maxCapacity() - this.capacity() > 0) {
                        return this._stackSize - this.numItems(item);
                    } else if (this.maxCapacity() - this.capacity() < 0) {
                        return 0;
                    }
                    return 0;
                }

                return maxItems;
            }()
        }, {
            key: 'itemContainer',
            value: function () {
                function itemContainer(item) {
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

                return itemContainer;
            }()
        }]);

        return StorageSystem;
    }();
})(WAYModuleLoader.getModule('WAY_StorageSystem'));