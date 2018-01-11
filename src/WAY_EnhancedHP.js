/* globals WAY, WAYModuleLoader, Window_VisualHPGauge */
// ============================================================================
// WAY_EnhancedHP.js
// ============================================================================
/*:
@plugindesc v0.0.0 Use JavaScript Code in textboxes. <WAY_EnhancedHP>
@author waynee95

@param enhancedHpDisplayText
@text Enhanced HP Display Text
@default ??

@param enhancedHpGaugeColor1
@text Enhanced HP Gauge Color 1
@default 30

@param enhancedHpGaugeColor2
@text Enhanced HP Gauge Color 2
@default 31

@param enhancedHpGaugeDropspeed
@text HP Gauge Drop Speed
@type number
@default 30

@help
>>> Disclaimer: This is still an alpha version!

==============================================================================
 ■ Plugin Dependencies  
==============================================================================
YEP Battle Engine Core
YEP  Map Status Window
YEP Visual Gauges 
FSDK HP Color
WAY Core

Make sure you have all plugins from above installed!
Then place this plugin somewhere below all of them!

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
    WAYModuleLoader.registerPlugin('WAY_EnhancedHP', '0.0.0', 'waynee95', {
        name: 'WAY_Core',
        version: '>= 1.9.1'
    });
}

($ => {
    const { getNotetag, toInt, fillArray } = WAY.Util;
    const { enhancedHpDisplayText,
        enhancedHpGaugeColor1,
        enhancedHpGaugeColor2,
        enhancedHpGaugeDropspeed } = $.parameters;

    const parseNotetags = obj => {
        obj.enhancedHp = getNotetag(obj.note, 'Enhanced HP', 0, toInt);
    };

    WAY.EventEmitter.on('load-actor-notetags', parseNotetags);
    WAY.EventEmitter.on('load-enemy-notetags', parseNotetags);

    WAY.EventEmitter.on('load-class-notetags', parseNotetags);
    WAY.EventEmitter.on('load-armor-notetags', parseNotetags);
    WAY.EventEmitter.on('load-weapon-notetags', parseNotetags);
    WAY.EventEmitter.on('load-state-notetags', parseNotetags);

    const onlyNotNull = e => e !== null || e !== undefined;
    const toenhancedHp = obj => obj ? obj.enhancedHp : 0;
    const toSum = (acc, val) => acc + val;

    $.alias.Game_Actor_initialize = Game_Actor.prototype.initialize;
    Game_Actor.prototype.initialize = function (actorId) {
        $.alias.Game_Actor_initialize.call(this, actorId);
        this._enhancedHp = this.enhancedHpMax();
    };

    $.alias.Game_Enemy_initialize = Game_Enemy.prototype.initialize;
    Game_Enemy.prototype.initialize = function (enemyId, x, y) {
        $.alias.Game_Enemy_initialize.call(this, enemyId, x, y);
        this._enhancedHp = this.enhancedHpMax();
    };

    Game_Battler.prototype.enhancedHp = function () {
        return this._enhancedHp;
    };

    Game_Battler.prototype.enhancedHpMax = function () {
        return this.states().map(toenhancedHp).reduce(toSum, 0);
    };

    Game_Battler.prototype.gainEnhancedHp = function (value) {
        this._enhancedHp += value;
    };

    Game_Actor.prototype.enhancedHpMax = function () {
        let enhancedHp = Game_Battler.prototype.enhancedHpMax.call(this);
        enhancedHp += this.equips().filter(onlyNotNull).map(toenhancedHp).reduce(toSum, 0);
        enhancedHp += this.currentClass().enhancedHp || 0;
        enhancedHp += this.actor().enhancedHp || 0;
        return enhancedHp;
    };

    Game_Enemy.prototype.enhancedHpMax = function () {
        return this.enemy().enhancedHp + Game_Battler.prototype.enhancedHpMax.call(this);
    };

    Window_Base.prototype.drawActorenhancedHp = function (actor, x, y, width = 186) {
        const color1 = this.textColor(enhancedHpGaugeColor1);
        const color2 = this.textColor(enhancedHpGaugeColor2);
        this.drawGauge(x, y, width, width, color1, color2);
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.hpA, x, y, 44);
        this.drawText(enhancedHpDisplayText, x, y, width, 'right');
    };

    Window_BattleStatus.prototype.initialize = function () {
        const width = this.windowWidth();
        const height = this.windowHeight();
        this._dropSpeed = fillArray(0, $gameParty.battleMembers().length);
        this._currentHpValue = [];
        this._displayedValue = [];
        Window_Selectable.prototype.initialize.call(this,
            Graphics.boxWidth - width, Graphics.boxHeight - height, width, height);
        this.refresh();
        this.openness = 0;
    };

    Window_BattleStatus.prototype.needsRefresh = function () {
        return $gameParty.battleMembers()
            .some((actor, index) => this._displayedValue[index] !== actor.hp);
    };

    $.alias.Window_BattleStatus_refresh = Window_BattleStatus.prototype.refresh;
    Window_BattleStatus.prototype.refresh = function () {
        $gameParty.battleMembers().forEach((actor, index) => {
            this._displayedValue[index] = this._displayedValue[index] || actor.hp;
            this._currentHpValue[index] = this._currentHpValue[index] || actor.hp;
            if (this._currentHpValue[index] !== actor.hp) {
                this._currentHpValue[index] = actor.hp;
                const difference = Math.abs(this._displayedValue[index] - actor.hp);
                this._dropSpeed[index] = Math.ceil(difference / enhancedHpGaugeDropspeed);
            }
            if (this._displayedValue[index] > this._currentHpValue[index]) {
                this._displayedValue[index] = Math.max(this._displayedValue[index]
                    - this._dropSpeed[index], this._currentHpValue[index]);
            } else if (this._displayedValue[index] < this._currentHpValue[index]) {
                this._displayedValue[index] = Math.min(this._displayedValue[index]
                    + this._dropSpeed[index], this._currentHpValue[index]);
            }
        });
        $.alias.Window_BattleStatus_refresh.call(this);
    };

    Window_BattleStatus.prototype.drawActorHp = function (actor, x, y, width = 186) {
        this.setGaugeSections(Yanfly.Param.SectionGaugesHp);
        if ($gameParty.inBattle() && actor.enhancedHp() > 1) {
            this.drawActorenhancedHp(actor, x, y, width);
        } else {
            const index = $gameParty.battleMembers().indexOf(actor);
            const rate = this._displayedValue[index] / actor.mhp;
            if (Imported.YEP_AbsorptionBarrier && actor.barrierPoints() > 0) {
                this.drawBarrierGauge(actor, x, y, width);
            } else {
                this.drawGauge(x, y, width, rate, this.hpbarColorPicker1(actor), this.hpbarColorPicker2(actor));
            }
            this.changeTextColor(this.systemColor());
            this.drawText(TextManager.hpA, x, y, 44);
            this.drawCurrentAndMax(this._displayedValue[index], actor.mhp,
                x, y, width, this.hpColor(actor), this.normalColor());
        }
        this.clearGaugeSections();
    };

    $.alias.Scene_Battle_update = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function () {
        $.alias.Scene_Battle_update.call(this);
        if (this._statusWindow.needsRefresh()) this._statusWindow.refresh();
    };

    $.alias.Window_VisualHPGauge_drawActorHp = Window_VisualHPGauge.prototype.drawActorHp;
    Window_VisualHPGauge.prototype.drawActorHp = function (actor, x, y, width) {
        if ($gameParty.inBattle() && actor.enhancedHp() > 1) {
            this.drawActorenhancedHp(actor, x, y, width);
        } else {
            $.alias.Window_VisualHPGauge_drawActorHp.call(this, actor, x, y, width);
        }
    };

})(WAYModuleLoader.getModule('WAY_EnhancedHP'));
