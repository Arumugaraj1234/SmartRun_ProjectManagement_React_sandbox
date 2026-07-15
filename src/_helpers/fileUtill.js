// FileSizeChecker.js
import messageReturn from './messageReturn'

const checkFileSize = file => {
  const fileSizeKB = file.size / 1024

  if (fileSizeKB > 1024 * 100) {
    messageReturn(601)
    return false
  }
  return true
}

export default checkFileSize
