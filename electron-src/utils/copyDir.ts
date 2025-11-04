import fs from 'fs'
import path from 'path'
export const copyDir = (src: string, dest: string) => {
	try {
		// コピー先ディレクトリが存在しない場合、作成する
		fs.mkdirSync(dest, { recursive: true })

		// コピー元のファイル・ディレクトリ一覧を取得する
		const files = fs.readdirSync(src, { withFileTypes: true })

		// 各エントリに対してコピー操作を実行する
		for (const file of files) {
			const srcPath = path.join(src, file.name)
			const destPath = path.join(dest, file.name)

			if (file.isDirectory()) {
				// ディレクトリの場合、再帰的にコピーする
				copyDir(srcPath, destPath)
			} else {
				// ファイルの場合、単純にコピーする
				fs.copyFileSync(srcPath, destPath)
			}
		}
	} catch (error) {
		console.error(`Error while copying directory: ${error}`)
	}
}
