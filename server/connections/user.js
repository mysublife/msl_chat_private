const facade = require("../database/facade");

module.exports = class User {
  constructor(id, name) {
    this._connections = [];

    this._id = id;
    this._name = name;

    this._contactList = []; // Array of objects {"id":xxx, "name":"xxx"}
    this._contactListIds = []; // Array of contact Ids to search faster
    this._connectionsIds = new Set();
  }

  async loadContactList() {
    this._contactList = await facade.contactListGet(this._id);
    this._contactListIds = this._contactList.map(obj => obj.id);
  }

  get contactList() {
    return this._contactList;
  }

  hasContact(userId) {
    return this._contactListIds.includes(userId);
  }

  addConnectionId(connectionId) {
    this._connectionsIds.add(connectionId);
  }

  removeConnectionId(connectionId) {
    this._connectionsIds.delete(connectionId);
  }
}
