import { getFilePathsInDir } from './getFilePathsInDir'
import { readFile } from 'node:fs/promises'
import { extname, relative } from 'node:path'

const svgToSymbol = (svg: string, id: string): string =>
  svg.replace('<svg', `<symbol id="${id}"`).replace('</svg>', '</symbol>')

const svgExtension = '.svg'

export const getSVGSymbolsString = async (pathToIconsDir: string): Promise<string> => {
  const paths: string[] = await getFilePathsInDir(pathToIconsDir)

  const promises: Promise<string>[] = paths
    .filter((filePath: string) => extname(filePath).toLowerCase() === svgExtension)
    .map(async (filePath: string) => {
      const content: string = await readFile(filePath, { encoding: 'utf8' })
      const relativePath = relative(pathToIconsDir, filePath)
      const name = relativePath.slice(0, -svgExtension.length)
      return svgToSymbol(content, name)
    })

  const symbols: string[] = await Promise.all(promises)
  return symbols.join('\n')
}

