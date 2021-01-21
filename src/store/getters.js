const getters = {
  website: state => state.common.website,
  isLock: state => state.user.isLock,
  lockPasswd: state => state.user.lockPasswd,
  isFullScren: state => state.common.isFullScren,
  browserHeaderTitle: state => state.user.browserHeaderTitle,
  errorLogs: state => state.errorLog.logs
}
export default getters
