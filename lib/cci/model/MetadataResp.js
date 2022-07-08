"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataResp = void 0;
class MetadataResp {
    withName(name) {
        this['name'] = name;
        return this;
    }
    set _name(name) {
        this['name'] = name;
    }
    get _name() {
        return this['name'];
    }
    withUid(uid) {
        this['uid'] = uid;
        return this;
    }
    set _uid(uid) {
        this['uid'] = uid;
    }
    get _uid() {
        return this['uid'];
    }
}
exports.MetadataResp = MetadataResp;
