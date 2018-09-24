import localforage from "localforage";
import { Promise } from "core-js";

const _localUserRef = localforage.createInstance({
  name: "offlineCurrentUser"
});

const _getItem = async itemName => {
  var obj = {};
  obj[itemName] = await _localUserRef.getItem(itemName);
  return obj;
};

export default {
  persiste: user => {
    _localUserRef.setItem("id", user.id);
    _localUserRef.setItem("username", user.username);
    _localUserRef.setItem("isAdmin", user.isAdmin);
    _localUserRef.setItem(
      "push_notifications_enable",
      user.push_notifications_enable
    );
  },
  getUser: async () => {
    const idItem = await _getItem("id");

    if (!idItem.id) return null;

    let user = await Promise.all([
      _getItem("username"),
      _getItem("isAdmin"),
      _getItem("push_notifications_enable")
    ]);

    console.log({ user });

    return Object.assign(
      { id: idItem.id },
      user.reduce((acc, item) => {
        var key = Object.keys(item)[0];
        acc[key] = item[key];
        return acc;
      }, {})
    );
  }
};
