import localforage from "localforage";
import { Promise } from "core-js";

const _localUserRef = localforage.createInstance({
  name: "offlineCurrentUser"
});

const _getItem = async itemKey => {
  const itemValue = await _localUserRef.getItem(itemKey);
  let obj = {};
  obj[itemKey] = itemValue;
  return obj;
};

export default {
  persiste: user => {
    for (let prop in user) {
      _localUserRef.setItem(prop, user[prop]);
    }
  },
  getUser: async () => {
    const user = await _getItem("id");

    if (!user.id) return null;

    let userDataArray = await Promise.all([
      _getItem("address"),
      _getItem("city"),
      _getItem("district"),
      _getItem("email"),
      _getItem("estate"),
      _getItem("number"),
      _getItem("phoneNumber"),
      _getItem("phoneNumberTwo"),
      _getItem("postalCode"),
      _getItem("name"),
      _getItem("surname"),
      _getItem("username"),
      _getItem("isAdmin"),
      _getItem("push_notifications_enable"),
      _getItem("coverPictureUrl"),
      _getItem("profilePictureUrl")
    ]);

    return Object.assign(
      { id: user.id },
      userDataArray.reduce((acc, item) => {
        var key = Object.keys(item)[0];
        acc[key] = item[key];
        return acc;
      }, {})
    );
  },
  clearData: () => {
    _localUserRef.clear();
  }
};
