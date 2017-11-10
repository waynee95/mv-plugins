/* globals WAY, WAYModuleLoader, Yanfly */
// ============================================================================
// WAY_YEP_SkillCore.js
// ============================================================================
/*:
@plugindesc v1.0.1 Addon to Yanfly's Skill Core Plugin. <WAY_YEP_SkillCore>
@author waynee95

@help
==============================================================================
 ■ Notetags
==============================================================================

-- Actor Notetag:
<Hide SType: x>
<Hide SType: x, x, x>
<Hide SType: x to y>
This will hide the skillTypes in the Actor Command Window.

-- Skill Notetag:
<Custom HP Cost Text Eval>
if (user.hp >= 0.2 * user.mhp) {
*    text = "\\fs[20]" + "\\c[18]" + 3 + "%" + "\\i[162]";
} else {
*    text = "\\fs[20]" + "\\c[18]" + cost + "\\i[162]";
}
</Custom HP Cost Text Eval>
This will override the normal HP Cost Text for that skill. You can use any text code,
you want. However, you need to add a second \ before every text code. The 'cost' variable
refers to the actual skill hp cost.

<Custom MP Cost Text Eval>
if (user.mp >= 0.2 * user.mmp) {
*    text = "\\fs[20]" + "\\c[23]" + 3 + "%" + "\\i[160]";
} else {
*    text = "\\fs[20]" + "\\c[23]" + cost + "\\i[160]";
}
</Custom MP Cost Text Eval>
This will override the normal MP Cost Text for that skill. You can use any text code,
you want. However, you need to add a second \ before every text code. The 'cost' variable
refers to the actual skill mp cost.

<Custom TP Cost Text Eval>
if (user.tp >= 0.2 * user.maxTp()) {
*    text = "\\fs[20]" + "\\c[29]" + 3 + "%" + "\\i[164]";
} else {
*    text = "\\fs[20]" + "\\c[29]" + cost + "\\i[164]";
}
</Custom TP Cost Text Eval>
This will override the normal TP Cost Text for that skill. You can use any text code,
you want. However, you need to add a second \ before every text code. The 'cost' variable
refers to the actual skill mp cost.

===============================================================================
 ■ Terms of Use
===============================================================================
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
    WAYModuleLoader.registerPlugin('WAY_YEP_SkillCore', '1.0.1', 'waynee95');
}

($ => {
    const { getMultiLineNotetag, getNotetag, toArray, trim, difference } = WAY.Util;

    WAY.EventEmitter.on('load-actor-notetags', actor => {
        actor.hiddenSTypes = getNotetag(actor.note, 'Hide SType', [], toArray);
    });

    WAY.EventEmitter.on('load-skill-notetags', skill => {
        skill.customHpCostTextEval = getMultiLineNotetag(
            skill.note,
            'Custom HP Cost Text Eval',
            '',
            trim
        );
        skill.customMpCostTextEval = getMultiLineNotetag(
            skill.note,
            'Custom MP Cost Text Eval',
            '',
            trim
        );
        skill.customTpCostTextEval = getMultiLineNotetag(
            skill.note,
            'Custom TP Cost Text Eval',
            '',
            trim
        );
    });

    ((Window_ActorCommand, alias) => {
        alias.Window_ActorCommand_addSkillCommands = Window_ActorCommand.addSkillCommands;
        Window_ActorCommand.addSkillCommands = function() {
            const { hiddenSTypes } = this._actor.actor();
            let skillTypes = this._actor.addedSkillTypes();
            skillTypes = difference(skillTypes, hiddenSTypes);

            skillTypes.sort((a, b) => a - b);
            skillTypes.forEach(stypeId => {
                const name = $dataSystem.skillTypes[stypeId];
                this.addCommand(name, 'skill', true, stypeId);
            });
        };
    })(Window_ActorCommand.prototype, $.alias);

    ((Window_SkillList, alias) => {
        Window_SkillList.drawCustomCostText = function(text, wx, wy, dw) {
            const width = this.textWidthEx(text);
            this.drawTextEx(text, wx - width + dw, wy);
            const returnWidth = dw - width - Yanfly.Param.SCCCostPadding;
            this.resetFontSettings();
            return returnWidth;
        };

        const customCostTextEval = function(skill, cost, code, a) {
            const text = '';
            const user = a;
            const subject = a;
            const s = $gameSwitches._data;
            const v = $gameVariables._data;
            const p = $gameParty;
            try {
                eval(code);
            } catch (e) {
                throw e;
            }
            return text;
        };

        alias.Window_SkillList_drawHpCost = Window_SkillList.drawHpCost;
        Window_SkillList.drawHpCost = function(skill, wx, wy, dw) {
            const cost = this._actor.skillHpCost(skill);
            const code = skill.customHpCostTextEval;
            if (cost > 0 && code !== '') {
                const text = customCostTextEval(skill, cost, code, this._actor);
                return this.drawCustomCostText(text, wx, wy, dw);
            }

            return alias.Window_SkillList_drawHpCost.call(this, skill, wx, wy, dw);
        };

        alias.Window_SkillList_drawMpCost = Window_SkillList.drawMpCost;
        Window_SkillList.drawMpCost = function(skill, wx, wy, dw) {
            const cost = this._actor.skillMpCost(skill);
            const code = skill.customMpCostTextEval;
            if (cost > 0 && code !== '') {
                const text = customCostTextEval(skill, cost, code, this._actor);
                return this.drawCustomCostText(text, wx, wy, dw);
            }

            return alias.Window_SkillList_drawMpCost.call(this, skill, wx, wy, dw);
        };

        alias.Window_SkillList_drawTpCost = Window_SkillList.drawTpCost;
        Window_SkillList.drawTpCost = function(skill, wx, wy, dw) {
            const cost = this._actor.skillTpCost(skill);
            const code = skill.customTpCostTextEval;
            if (cost > 0 && code !== '') {
                const text = customCostTextEval(skill, cost, code, this._actor);
                return this.drawCustomCostText(text, wx, wy, dw);
            }

            return alias.Window_SkillList_drawTpCost.call(this, skill, wx, wy, dw);
        };
    })(Window_SkillList.prototype, $.alias);
})(WAYModuleLoader.getModule('WAY_YEP_SkillCore'));
