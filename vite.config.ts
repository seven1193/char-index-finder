import { defineConfig, type Plugin  } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'
import path from 'path'

function removeGitignorePlugin(): Plugin {
  return {
    name: 'remove-dist-data-gitignore',
    closeBundle() {
      const gitignorePath = path.resolve(__dirname, 'dist/data/.gitignore')
      if (fs.existsSync(gitignorePath)) {
        fs.unlinkSync(gitignorePath)
        console.log('🧹 Removed dist/data/.gitignore')
      }
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: '/char-index-finder/',
  plugins: [vue(), removeGitignorePlugin()],
})
