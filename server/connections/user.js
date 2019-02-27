const facade = require("../database/facade");

module.exports = class User {
  constructor(id, name) {
    this._connections = [];

    this._id = id;
    this._name = name;

    this._contactList = [];
    this._connectionsIds = new Set();
  }

  async loadContactList() {
    this._contactList = await facade.contactListGet(this._id);
  }

  get contactList() {
    return this._contactList;
  }

  addConnectionId(connectionId) {
    this._connectionsIds.add(connectionId);
  }

  removeConnectionId(connectionId) {
    this._connectionsIds.delete(connectionId);
  }
}
