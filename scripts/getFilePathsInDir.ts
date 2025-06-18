import { join } from 'node:path'
import { readdir } from 'node:fs/promises'
import type { Dirent } from 'node:fs'

export const getFilePathsInDir = async (dirPath: string): Promise<string[]> => {
  const entries: Dirent[] = await readdir(dirPath, { withFileTypes: true })

  const promises: Promise<string | string[]>[] = entries.map((entry: Dirent) => {
    const childPath = join(dirPath, entry.name)
    return entry.isDirectory() ? getFilePathsInDir(childPath) : Promise.resolve(childPath)
  })

  const paths = await Promise.all(promises)
  return paths.flat()
}