#!/usr/bin/env node
const path = require('path')
const fs = require('fs')
const exec = require('child_process').exec
const copyFolder = require('fs-extra').copySync
// 当前执行的路径
const CURRENT_PATH = process.cwd()
// 仓库名称
const REPO_NAME = CURRENT_PATH.split('/').reverse()[0]

// 进入用户文件夹的命令
const CD_COMMAND = CURRENT_PATH === __dirname ? '' : `cd ${CURRENT_PATH} && `

// 需要剔除的关键词
const EXCLUDE_PATTERN = [
    'package-lock.json',
    'yarn.lock',
    // 忽略图片与办公软件等
    /ico|jpe?g|png|gif|webp|mp4|xlsx?|docx?|pptx?/
]

// 文件后缀映射
const EXT_MAP = {
    '.': '_anonymous'
}

// 文件夹节点id
let _uid = 0

function isFile (path) {
    return fs.lstatSync(path).isFile()
}

function isFolder (path) {
    return fs.lstatSync(path).isDirectory()
}

function isString (str) {
    return Object.prototype.toString.call(str).toLowerCase() === '[object string]'
}

function isRegExp (p) {
    return Object.prototype.toString.call(p).toLowerCase() === '[object regexp]'
}

/**
 *  @desc  删除文件夹
 *  @param  {String}  path  需要删除文件夹的路径
 */
function rmdir (path) {
  if (path[path.length - 1] !== '/') path = path + '/'

  let allFile = fs.readdirSync(path)

  allFile.forEach(file => {
    file = path + file

    if (isFile(file)) {
      fs.unlinkSync(file)
    } else {
      rmdir(file + '/')
    }
  })

  // 删除当前文件夹
  fs.rmdirSync(path)
}

function count (fileFormat) {
    return new Promise((resolve, reject) => {
        exec(`cat ${fileFormat} | wc -l`, (err, data) => {
            if (err) {
                reject(err)
            } else {
                let lineNum = parseInt(data.trim())

                if (isNaN(lineNum)) {
                    reject('load line numer error', data)
                } else {
                    resolve(lineNum)
                }
            }
        })
    })
}

// 统计文件的 git 提交行数
function countGitContribution (fileName) {
    // command line
    // git ls-files | while read f; do git blame --line-porcelain $f | grep '^author '; done | sort -f | uniq -ic | sort -n
    return new Promise((resolve, reject) => {
        exec(`${CD_COMMAND}git ls-files ${fileName} | while read f; do git blame --line-porcelain $f | grep '^author '; done | sort -f | uniq -ic | sort -n`, function (err, data) {
            if (err) {
                reject(err)
                return
            }

            let line = data.split('\n').filter(item => item).map(item => item.trim())

            line = line.map(item => {
                let detail = item.split('author')
                let line
                let author

                // 部分文件没有对应的 author ，例如 图片，字体图标等
                if (detail.length < 2) {
                    line = 0
                    author = null
                } else {
                    line = parseInt(detail[0].trim())
                    author = detail[1].trim()
                }

                return {
                    line,
                    author
                }
            }).sort((a, b) => b.line - a.line)

            resolve(line)
        })
    })
}

// 统计文件夹下直接文件的数量
async function countFolder (path, fileType) {
    let data = {}

    // 当前文件夹的文件类型
    for (let i = 0; i < fileType.length; i++) {
        let type = fileType[i]

        data[type] = await count(`${path}*.${type}`)
    }

    return data
}

/**
 *  @desc  获取文件的后缀
 *  @params  {String}  file  文件名称
 *
 *  @return  {String}  文件后缀
 */
function getFileExt (file) {
    // 以 . 开头的文件
    if (file[0] === '.') {
        return file[0]
    }
    let tmp = file.split('.')

    return tmp[tmp.length - 1]
}

/**
 *  @desc  判断文件是否符合统计范围
 *  @params  {String} file  文件名称，不包含路径
 *  @params  {Array}  fileType  统计的文件类型
 *
 *  @return  {Boolean}  判断文件是否有效
 */
function isValidFile (file, fileType) {
    // 跳过当前文件统计
    if (skipFile(file)) return false

    let ext = getFileExt(file)
    // 匹配所有的文件
    if (fileType[0] === '*') return true

    return fileType.indexOf(ext) > -1
}

/**
 *  @desc  判断文件/文件夹是否在 git 跟踪下
 *  @params  {String}  file  文件/文件夹的路径
 *
 *  @return  {Promise}
 */
function isGitTrack (file) {
    return new Promise((resolve, reject) => {
        exec(`${CD_COMMAND}git ls-files ${file}`, (err, data) => {
            if (err) {
                reject(err)
                return
            }

            if (!data) {
                // TODO need to write log
                // console.log(`${file} file is not track`)
            }

            resolve(!!data)
        })
    })
}

/**
 *  @desc  判断文件是否需要跳过
 *  @params  {String}  file  文件/文件夹的路径
 *
 *  @return  {Boolean}
 */
function skipFile (file) {
    return EXCLUDE_PATTERN.some(pattern => {
        // 通过字符串忽略文件路径
        if (isString(pattern)) {
            return file.includes(pattern)
        }

        return isRegExp(pattern) && pattern.test(file)
    })
}

/**
 *  @desc  合并两个 contribution 数组
 *  @params  {Array}  target  合并目标的数组
 *  @params  {Array}  source  需要合并的数组
 */
function mergeContribution (target, source) {
    // 没有需要合并的数组
    if (!source.length) return target

    let newAuthor = []

    // 保留所有文件贡献数量
    source.forEach(item => {
        let i

        for (i = 0; i < target.length; i++) {
            // 作者相同，则合并贡献代码行数
            if (target[i].author === item.author) {
                target[i].line += item.line
                break
            }
        }

        // 没有找到匹配的作者
        if (i === target.length) {
            newAuthor.push({
                author: item.author,
                line: item.line
            })
        }
    })
    // 只保留根目录的贡献数量
    // while (source.length) {
    //     let item = source.splice(0, 1)[0]
    //     let i

    //     for (i = 0; i < target.length; i++) {
    //         // 作者相同，则合并贡献代码行数
    //         if (target[i].author === item.author) {
    //             target[i].line += item.line
    //             break
    //         }
    //     }

    //     // 没有找到匹配的作者
    //     if (i === target.length) {
    //         newAuthor.push(item)
    //     }
    // }

    return target.concat(newAuthor)
}

/**
 *  @desc 递归统计文件夹
 *  @params  {String} path 需要统计的源路径
 *  @params  {String} folderName 文件夹的名称
 *  @params  {Array}  fileType  统计的文件类型
 */
async function countProject (path, folderName, fileType = ['*']) {
    // 判断当前文件夹是否在git跟踪
    if (!await isGitTrack(path)) {
        return
    }

    // 是否需要跳过该路径
    if (skipFile(path)) {
        return
    }

    // 当前文件夹的数据结构
    let thisData = {
        id: _uid++,
        name: folderName,
        path,
        // 这行代码是统计文件夹下所有文件的行数，文件夹下可能包括部分文件不在 git 跟踪；所以不准确
        // code: await countFolder(path, fileType),
        code: {},
        line: 0,
        children: [],
        file: [],
        contribution: []
    }

    // 深度优先遍历子文件夹
    let allFile = fs.readdirSync(path)
    let folderList = []

    for (let i = 0; i < allFile.length; i++) {
        let fileName = allFile[i]
        let file = path + fileName

        if (isFolder(file)) {
            let folderData = await countProject(file + '/', fileName, fileType)

            if (folderData) {
                thisData.children.push(folderData)
            }

            continue
        }

        // 统计单个文件的代码行数，需要文件符合规范；并且需要在 git 的跟踪下
        if (isValidFile(fileName, fileType) && await isGitTrack(file)) {
            let fileDetail = {
                name: fileName,
                path: file,
                line: 0,
                // line: await count(file),
                type: getFileExt(fileName),
                contribution: await countGitContribution(file)
            }

            fileDetail.line = fileDetail.contribution.reduce((base, item) => {
                return base + item.line
            }, 0)
            thisData.file.push(fileDetail)
        }
    }

    let line = 0 // 该文件夹包含子文件夹与文件的代码行数
    let code = {} // 该文件夹包含文件类型分类的代码数量
    let contribution = []

    // 对该文件夹对应的文件进行遍历
    thisData.file.forEach(item => {
        let type = EXT_MAP[item.type] || item.type

        item.id = _uid++
        // 统计具体文件数量类型
        code[type] = (code[type] || 0) + item.line
        // 统计行数
        line += item.line
        // 统计贡献代码数量
        contribution = mergeContribution(contribution, item.contribution)
    })
    // 对子文件夹进行遍历
    thisData.children.forEach(item => {
        // 遍历子文件夹的所有文件类型
        for (let type in item.code) {
            code[type] = code[type] || 0
            code[type] += item.code[type]
        }

        // 统计行数
        line += item.line
        // 统计贡献代码数量
        contribution = mergeContribution(contribution, item.contribution)
    })

    thisData.code = code
    thisData.line = line
    thisData.contribution = contribution

    return thisData
}

console.time('count')
console.log('analyzing...')
// countProject('./', ['vue', 'js', 'scss', 'css', '.']).then(data => {
countProject(CURRENT_PATH + '/', REPO_NAME, ['*']).then(data => {
    let json = 'window._source = ' + JSON.stringify(data, null, 2)
    let file = '_source.js'
    let targetPath = CURRENT_PATH + '/commit-analyze/'

    // 判断是否存在，存在则删除
    if (fs.existsSync(targetPath)) {
       rmdir(targetPath)
    }

    // 复制 html 等文件
    copyFolder(path.resolve(__dirname + '/../build'), targetPath)

    // 写入统计文件
    fs.writeFile(targetPath + file, json, 'utf-8', (err, data) => {
        if (err) {
            throw new Error('write file error', err)
        }

        console.timeEnd('count')
        console.log('succesful!')
    })
})

