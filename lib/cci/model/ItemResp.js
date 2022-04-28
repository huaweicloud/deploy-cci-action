"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemResp = void 0;
class ItemResp {
    withProfile(spec) {
        this['spec'] = spec;
        return this;
    }
    get _spec() {
        return this['spec'];
    }
}
exports.ItemResp = ItemResp;
