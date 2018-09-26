export const isOnlineCheck = async () => {
  const isOnlineFn = require("is-online");
  return await isOnlineFn();
};
