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

var _get = function () {
    function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } }

    return get;
}();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
        map = _WAY$Util.map,
        piper = _WAY$Util.piper,
        tryEval = _WAY$Util.tryEval;
    var TitleWindow = WAY.Window.TitleWindow;


    var $dataStorage = $.parameters.storages;

    var parseNotetags = function parseNotetags(obj) {
        obj.cannotStore = getNotetag(obj.note, 'Cannot Store', null, toBool);
        obj.storeOnlyIn = getNotetag(obj.note, 'Store Only In', [], toArray);
    };

    WAY.EventEmitter.on('load-item-notetags', parseNotetags);
    WAY.EventEmitter.on('load-weapon-notetags', parseNotetags);
    WAY.EventEmitter.on('load-armor-notetags', parseNotetags);

    var getContainer = function getContainer(num) {
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

    var getItemCategory = function getItemCategory(item) {
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
                function open(storageId) {
                    if (storageId) {
                        this._lastActive = storageId;
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

            this._storageId = storageId;
            this.clear();
        }

        _createClass(StorageSystem, [{
            key: 'storageId',
            value: function () {
                function storageId() {
                    return this._storageId;
                }

                return storageId;
            }()
        }, {
            key: 'title',
            value: function () {
                function title() {
                    return $dataStorage[this._storageId].title;
                }

                return title;
            }()
        }, {
            key: 'allowedTypes',
            value: function () {
                function allowedTypes() {
                    return $dataStorage[this._storageId].allowedTypes;
                }

                return allowedTypes;
            }()
        }, {
            key: 'maxCapacity',
            value: function () {
                function maxCapacity() {
                    return $dataStorage[this._storageId].maxCapacity;
                }

                return maxCapacity;
            }()
        }, {
            key: 'stackSize',
            value: function () {
                function stackSize() {
                    var stackSize = $dataStorage[this._storageId].stackSize;

                    return stackSize !== 'none' ? toInt(stackSize) : 'none';
                }

                return stackSize;
            }()
        }, {
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
                    if (this.stackSize() === 'none') {
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
                    if (this.stackSize() === 'none') {
                        return this.maxCapacity() - this.capacity();
                    } else if (this.numItems(item) > 0 || this.maxCapacity() - this.capacity() > 0) {
                        return this.stackSize() - this.numItems(item);
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

    var StorageCommadWindow = function () {
        function StorageCommadWindow() {
            _classCallCheck(this, StorageCommadWindow);
        }

        return StorageCommadWindow;
    }();

    var StorageCategoryWindow = function () {
        function StorageCategoryWindow() {
            _classCallCheck(this, StorageCategoryWindow);
        }

        return StorageCategoryWindow;
    }();

    var StorageInfoWindow = function () {
        function StorageInfoWindow() {
            _classCallCheck(this, StorageInfoWindow);
        }

        return StorageInfoWindow;
    }();

    var StorageNumberWindow = function () {
        function StorageNumberWindow() {
            _classCallCheck(this, StorageNumberWindow);
        }

        return StorageNumberWindow;
    }();

    var StorageListWindow = function () {
        function StorageListWindow() {
            _classCallCheck(this, StorageListWindow);
        }

        return StorageListWindow;
    }();

    var SceneStorage = function (_Scene_MenuBase) {
        _inherits(SceneStorage, _Scene_MenuBase);

        function SceneStorage() {
            _classCallCheck(this, SceneStorage);

            var _this2 = _possibleConstructorReturn(this, (SceneStorage.__proto__ || Object.getPrototypeOf(SceneStorage)).call(this));

            _this2._storage = $gameStorageSystems.current();
            return _this2;
        }

        _createClass(SceneStorage, [{
            key: 'setup',
            value: function () {
                function setup() {
                    var _$gameStorageSystems$ = $gameStorageSystems.current().data(),
                        background = _$gameStorageSystems$.background,
                        displayCategories = _$gameStorageSystems$.displayCategories,
                        help = _$gameStorageSystems$.help,
                        title = _$gameStorageSystems$.title,
                        command = _$gameStorageSystems$.command,
                        category = _$gameStorageSystems$.category,
                        info = _$gameStorageSystems$.info,
                        item = _$gameStorageSystems$.item,
                        number = _$gameStorageSystems$.number;

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

                return setup;
            }()
        }, {
            key: 'createBackground',
            value: function () {
                function createBackground() {
                    if (this._background !== '') {
                        this._backgroundSprite = new Sprite();
                        this._backgroundSprite.bitmap = ImageManager.loadPicture(this._background);
                        this.addChild(this._backgroundSprite);
                    }
                }

                return createBackground;
            }()
        }, {
            key: 'create',
            value: function () {
                function create() {
                    _get(SceneStorage.prototype.__proto__ || Object.getPrototypeOf(SceneStorage.prototype), 'create', this).call(this);
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

                return create;
            }()
        }, {
            key: 'createHelpWindow',
            value: function () {
                function createHelpWindow() {
                    this._helpWindow = new Window_Help();
                    this.addWindow(this._helpWindow);

                    var _map = map(this._helpData, tryEval),
                        x = _map.x,
                        y = _map.y,
                        width = _map.width,
                        height = _map.height;

                    this._helpWindow.x = x;
                    this._helpWindow.y = y;
                    this._helpWindow.width = width;
                    this._helpWindow.height = height;
                }

                return createHelpWindow;
            }()
        }, {
            key: 'createTitleWindow',
            value: function () {
                function createTitleWindow() {
                    var _map2 = map(this._titleData, tryEval),
                        x = _map2.x,
                        y = _map2.y,
                        width = _map2.width,
                        height = _map2.height;

                    this._titleWindow = new TitleWindow(x, y, width, height);
                    this.addWindow(this._titleWindow);
                }

                return createTitleWindow;
            }()
        }, {
            key: 'setCommandHandlers',
            value: function () {
                function setCommandHandlers() {
                    if (this._displayCategories) {
                        this._commandWindow.setHandler('add', this.onCommandOk.bind(this));
                        this._commandWindow.setHandler('remove', this.onCommandOk.bind(this));
                    } else {
                        this._commandWindow.setHandler('add', this.onCategoryOk.bind(this));
                        this._commandWindow.setHandler('remove', this.onCategoryOk.bind(this));
                    }
                    this._commandWindow.setHandler('cancel', this.popScene.bind(this));
                }

                return setCommandHandlers;
            }()
        }, {
            key: 'createCommandWindow',
            value: function () {
                function createCommandWindow() {
                    var _map3 = map(this._commandData, tryEval),
                        x = _map3.x,
                        y = _map3.y;

                    this._commandWindow = new StorageCommadWindow(x, y);
                    this.setCommandHandlers();
                    this.addWindow(this._commandWindow);
                }

                return createCommandWindow;
            }()
        }, {
            key: 'setCategoryHandlers',
            value: function () {
                function setCategoryHandlers() {
                    this._categoryWindow.setHandler('ok', this.onCategoryOk.bind(this));
                    this._categoryWindow.setHandler('cancel', this.onCategoryCancel.bind(this));
                }

                return setCategoryHandlers;
            }()
        }, {
            key: 'createCategoryWindow',
            value: function () {
                function createCategoryWindow() {
                    var _map4 = map(tryEval, this._categoryData),
                        x = _map4.x,
                        y = _map4.y;

                    this._categoryWindow = new StorageCategoryWindow(x, y);
                    this.setCategoryHandlers();
                    this._categoryWindow.deactivate();
                    this._categoryWindow.hide();
                    this.addWindow(this._categoryWindow);
                }

                return createCategoryWindow;
            }()
        }, {
            key: 'createInfoWindow',
            value: function () {
                function createInfoWindow() {
                    var _map5 = map(this._infoData, tryEval),
                        x = _map5.x,
                        y = _map5.y,
                        width = _map5.width;

                    this._infoWindow = new StorageInfoWindow(x, y, width, 80);
                    this.addWindow(this._infoWindow);
                }

                return createInfoWindow;
            }()
        }, {
            key: 'setListHandlers',
            value: function () {
                function setListHandlers() {
                    this._itemWindow.setHelpWindow(this._helpWindow);
                    if (this._displayCategories) {
                        this._categoryWindow.setItemWindow(this._itemWindow);
                    }
                    this._itemWindow.setHandler('ok', this.onItemOk.bind(this));
                    this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
                }

                return setListHandlers;
            }()
        }, {
            key: 'createItemWindow',
            value: function () {
                function createItemWindow() {
                    var _map6 = map(this._itemData, tryEval),
                        x = _map6.x,
                        y = _map6.y,
                        width = _map6.width,
                        height = _map6.height;

                    this._itemWindow = new StorageListWindow(x, y, width, height);
                    this.setListHandlers();
                    this.addWindow(this._itemWindow);
                }

                return createItemWindow;
            }()
        }, {
            key: 'setNumberHandlers',
            value: function () {
                function setNumberHandlers() {
                    this._numberWindow.setHandler('ok', this.onNumberOk.bind(this));
                    this._numberWindow.setHandler('cancel', this.onNumberCancel.bind(this));
                }

                return setNumberHandlers;
            }()
        }, {
            key: 'createNumberWindow',
            value: function () {
                function createNumberWindow() {
                    var _map7 = map(this._numberData, tryEval),
                        x = _map7.x,
                        y = _map7.y,
                        width = _map7.width,
                        height = _map7.height;

                    this._numberWindow = new StorageNumberWindow(x, y, width, height);
                    this.setNumberHandlers();
                    this._numberWindow.hide();
                    this.addWindow(this._numberWindow);
                }

                return createNumberWindow;
            }()
        }, {
            key: 'activateItemWindow',
            value: function () {
                function activateItemWindow() {
                    this._infoWindow.refresh();
                    this._itemWindow.refresh();
                    this._itemWindow.activate();
                }

                return activateItemWindow;
            }()
        }, {
            key: 'item',
            value: function () {
                function item() {
                    return this._itemWindow.item();
                }

                return item;
            }()
        }, {
            key: 'onCommandOk',
            value: function () {
                function onCommandOk() {
                    this._itemWindow.setMode(this._commandWindow.currentSymbol());
                    this._commandWindow.deactivate();
                    this._commandWindow.hide();
                    this._categoryWindow.activate();
                    this._categoryWindow.select(0);
                    this._categoryWindow.show();
                }

                return onCommandOk;
            }()
        }, {
            key: 'onCategoryOk',
            value: function () {
                function onCategoryOk() {
                    this._itemWindow.activate();
                    this._itemWindow.selectLast();
                    if (!this._displayCategories) {
                        this._itemWindow.setMode(this._commandWindow.currentSymbol());
                        this._itemWindow.setCategory('AllItems');
                        this._itemWindow.refresh();
                    }
                }

                return onCategoryOk;
            }()
        }, {
            key: 'onCategoryCancel',
            value: function () {
                function onCategoryCancel() {
                    this._categoryWindow.deselect();
                    this._categoryWindow.deactivate();
                    this._categoryWindow.hide();
                    this._commandWindow.show();
                    this._commandWindow.activate();
                }

                return onCategoryCancel;
            }()
        }, {
            key: 'onItemOk',
            value: function () {
                function onItemOk() {
                    this._item = this._itemWindow.item();
                    this._itemWindow.deactivate();
                    this._numberWindow.setup(this._item, this._itemWindow.mode());
                    this._numberWindow.show();
                    this._numberWindow.activate();
                }

                return onItemOk;
            }()
        }, {
            key: 'storeItem',
            value: function () {
                function storeItem(amount) {
                    this._storage.addItem(this.item(), amount);
                    $gameParty.loseItem(this.item(), amount);
                }

                return storeItem;
            }()
        }, {
            key: 'depositItem',
            value: function () {
                function depositItem(amount) {
                    this._storage.removeItem(this.item(), amount);
                    $gameParty.gainItem(this.item(), amount);
                }

                return depositItem;
            }()
        }, {
            key: 'onItemCancel',
            value: function () {
                function onItemCancel() {
                    this._itemWindow.deselect();
                    this._helpWindow.clear();
                    if (this._displayCategories) {
                        this._categoryWindow.activate();
                    } else {
                        this._itemWindow.setCategory('none');
                        this._commandWindow.activate();
                    }
                }

                return onItemCancel;
            }()
        }, {
            key: 'onNumberOk',
            value: function () {
                function onNumberOk() {
                    SoundManager.playShop();
                    var mode = this._itemWindow.mode();
                    if (mode === 'add') {
                        this.storeItem(this._numberWindow.number());
                    } else if (mode === 'remove') {
                        this.depositItem(this._numberWindow.number());
                    }
                    this.endNumberInput();
                }

                return onNumberOk;
            }()
        }, {
            key: 'endNumberInput',
            value: function () {
                function endNumberInput() {
                    this._numberWindow.hide();
                    this._itemWindow.refresh();
                    this._infoWindow.refresh();
                    this._itemWindow.activate();
                }

                return endNumberInput;
            }()
        }, {
            key: 'onNumberCancel',
            value: function () {
                function onNumberCancel() {
                    SoundManager.playCancel();
                    this.endNumberInput();
                }

                return onNumberCancel;
            }()
        }]);

        return SceneStorage;
    }(Scene_MenuBase);
})(WAYModuleLoader.getModule('WAY_StorageSystem'));