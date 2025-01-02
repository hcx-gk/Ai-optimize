const { dialog } = require('electron')
const fs = require('fs')
const path = require('path')

// 注册 IPC 处理程序
function registerIpcHandlers(ipcMain) {
  // 显示保存对话框
  ipcMain.handle('show-save-dialog', async (event, options) => {
    return dialog.showSaveDialog(options)
  })

  // 保存优化后的项目
  ipcMain.handle('save-optimized-project', async (event, { sourcePath, targetPath }) => {
    try {
      // 确保源文件存在
      if (!fs.existsSync(sourcePath)) {
        throw new Error('优化后的项目文件不存在')
      }

      // 复制文件到目标路径
      await fs.promises.copyFile(sourcePath, targetPath)

      // 如果是压缩文件，可能需要在复制后删除源文件
      if (path.extname(sourcePath) === '.zip') {
        await fs.promises.unlink(sourcePath)
      }

      return { success: true }
    } catch (error) {
      console.error('保存项目失败:', error)
      throw error
    }
  })
}

module.exports = {
  registerIpcHandlers
}
