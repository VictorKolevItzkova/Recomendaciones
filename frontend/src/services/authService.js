let logoutHandler = () => {}

export const setLogoutHandler = (handler) => {
  logoutHandler = handler
}

export const triggerLogout = () => {
  logoutHandler()
}