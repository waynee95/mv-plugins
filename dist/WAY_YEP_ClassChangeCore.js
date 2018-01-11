/* globals WAY, WAYModuleLoader, Scene_Class */
// ===========================================================================
// WAY_YEP_ClassChangeCore.js
// ===========================================================================
/*:
@plugindesc v1.1.0 Addon to Yanfly's Class Change Core Plugin. <WAY_YEP_ClassChangeCore>
@author waynee95

@param classChangeCooldown
@text Class Change Cooldown
@type number
@default 1

@param classChangeCommand
@text Class Change Command Name
@type text
@default Change Class

@help
==============================================================================
 ■ Plugin Dependencies
==============================================================================
This plugin requires YEP BattleEngineCore, YEP ClassChangeCore and WAY Core.

==============================================================================
 ■ Terms of Use
==============================================================================
Credit must be given to: waynee95
Please don't share my plugins anywhere, except if you have my permissions.

My plugins may be used in commercial and non-commercial products.

==============================================================================
 ■ Contact Information
==============================================================================
Forum Link: https://forums.rpgmakerweb.com/index.php?members/waynee95.88436/
Website: http://waynee95.me/
Discord Name: waynee95#4261
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
    WAYModuleLoader.registerPlugin('WAY_YEP_ClassChangeCore', '1.1.0', 'waynee95', {
        name: 'WAY_Core',
        version: '>= 2.0.0'
    });
}

(function ($) {
    var _$$parameters = $.parameters,
        classChangeCommand = _$$parameters.classChangeCommand,
        classChangeCooldown = _$$parameters.classChangeCooldown;


    var bypassBattleStart = false;

    var savedBattleBgm = null;
    var savedBattleBgs = null;

    var clearBGM = function clearBGM() {
        savedBattleBgm = null;
        savedBattleBgs = null;
    };

    //=============================================================================
    // BattleManager
    //=============================================================================
    $.alias.BattleManager_startBattle = BattleManager.startBattle;
    BattleManager.startBattle = function () {
        if (!bypassBattleStart) {
            $.alias.BattleManager_startBattle.call(this);
        } else {
            this.refreshAllMembers();
        }
        bypassBattleStart = false;
        this._bypassMoveToStartLocation = false;
    };

    $.alias.BattleManager_playBattleBgm = BattleManager.playBattleBgm;
    BattleManager.playBattleBgm = function () {
        var restartBgm = true;
        if (savedBattleBgm) {
            AudioManager.playBgm(savedBattleBgm);
            restartBgm = false;
        }
        if (savedBattleBgs) {
            AudioManager.playBgs(savedBattleBgs);
            restartBgm = false;
        }
        if (restartBgm) {
            $.alias.BattleManager_playBattleBgm.call(this);
        }
        clearBGM();
    };

    //=============================================================================
    // Game_Unit
    //=============================================================================
    $.alias.Game_Unit_onBattleStart = Game_Unit.prototype.onBattleStart;
    Game_Unit.prototype.onBattleStart = function () {
        if (!bypassBattleStart) {
            $.alias.Game_Unit_onBattleStart.call(this);
        }
    };

    $.alias.Game_Unit_onBattleEnd = Game_Unit.prototype.onBattleEnd;
    Game_Unit.prototype.onBattleEnd = function () {
        if (!bypassBattleStart) {
            $.alias.Game_Unit_onBattleEnd.call(this);
        }
    };

    //=============================================================================
    // Window_ActorCommand
    //=============================================================================
    $.alias.Window_ActorCommand_makeCommandList = Window_ActorCommand.prototype.makeCommandList;
    Window_ActorCommand.prototype.makeCommandList = function () {
        $.alias.Window_ActorCommand_makeCommandList.call(this);
        if (this._actor && this._actor.isActor()) {
            this.addClassChangeCommand();
        }
    };

    Window_ActorCommand.prototype.addClassChangeCommand = function () {
        var enabled = this._actor.canChangeClass();
        this.addCommand(classChangeCommand, 'class', enabled);
    };

    //=============================================================================
    // Scene_Battle
    //=============================================================================
    $.alias.Scene_Battle_createActorCommandWindow = Scene_Battle.prototype.createActorCommandWindow;
    Scene_Battle.prototype.createActorCommandWindow = function () {
        $.alias.Scene_Battle_createActorCommandWindow.call(this);
        var commandWindow = this._actorCommandWindow;
        commandWindow.setHandler('class', this.commandChangeClass.bind(this));
    };

    Scene_Battle.prototype.commandChangeClass = function () {
        BattleManager._bypassMoveToStartLocation = true;
        $gameParty.setMenuActor(BattleManager.actor());
        BattleManager._savedActor = BattleManager.actor();
        BattleManager.actor().setClassChangeCooldown(1);
        $gameParty.setMenuActor(BattleManager.actor());
        savedBattleBgm = AudioManager.saveBgm();
        savedBattleBgs = AudioManager.saveBgs();
        SceneManager.push(Scene_Class);
        BattleManager._phase = 'input';
        bypassBattleStart = true;
    };

    //=============================================================================
    // Game_Battler
    //=============================================================================
    $.alias.Game_Battler_onBattleStart = Game_Battler.prototype.onBattleStart;
    Game_Battler.prototype.onBattleStart = function () {
        $.alias.Game_Battler_onBattleStart.call(this);
        this._classChangeCooldown = 0;
    };

    $.alias.Game_Battler_onBattleEnd = Game_Battler.prototype.onBattleEnd;
    Game_Battler.prototype.onBattleEnd = function () {
        $.alias.Game_Battler_onBattleEnd.call(this);
        this._classChangeCooldown = 0;
    };

    $.alias.Game_Battler_regenerateAll = Game_Battler.prototype.regenerateAll;
    Game_Battler.prototype.regenerateAll = function () {
        $.alias.Game_Battler_regenerateAll.call(this);
        if (this.isActor()) this.updateClassChangeCooldown();
    };

    //=============================================================================
    // Game_Actor
    //=============================================================================
    Game_Actor.prototype.setClassChangeCooldown = function (value) {
        this._classChangeCooldown += value;
        this._classChangeCooldown.clamp(0, classChangeCooldown);
    };

    Game_Actor.prototype.updateClassChangeCooldown = function () {
        this._classChangeCooldown = this._classChangeCooldown || 0;
        this._classChangeCooldown -= 1;
    };
})(WAYModuleLoader.getModule('WAY_YEP_ClassChangeCore'));