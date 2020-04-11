const { spawn } = require('child_process')
const nodejieba = require('nodejieba')

// 不需要统计的作者
const BLACK_LIST = [
  'dependabot[bot]'
]

// 特殊字符
const specialStringPattern = /[~!@#$%^&*()_\-+=`\[\]{}|\\;:'",<.>\/?～！@¥（）——「」【】、；：‘“”’《》，。？]+/g
// 英文字符
const enPattern = /\w+/g
// 非英文字符
const notEnPattern = /[^a-zA-Z]+/g

/**
 * @description 把 commit 信息进行拆解
 * @param {string} msg
 * @returns {Map}
 */
const splitCommitMsg = msg => {
  const data = new Map()
  msg = msg.replace(specialStringPattern, ' ')
  // 对英文单词进行分割
  const en = msg.replace(notEnPattern, ' ').trim().split(' ')
  const notEn = msg.replace(enPattern, ' ').trim()
  const word = nodejieba.cut(notEn)

  en.forEach(item => {
    if (!item) return
    data.set(item, data.get(item) + 1 || 1)
  })
  word.forEach(item => {
    if (!item.trim()) return

    data.set(item, data.get(item) + 1 || 1)
  })

  console.log('===========', msg)
  console.log('en', en)
  console.log('word', word)

  return data
}

/**
 * @description 合并两个关键词的对象
 */
const mergeSplitData = (baseData, addData) => {
  baseData = baseData || new Map()

  for (let [key, value] of addData) {
    const baseValue = baseData.get(key) || 0
    baseData.set(key, baseValue + addData.get(key))
  }

  return baseData
}

const collectAuthorCommitMsg = async () => {
  const command = spawn(
    `git`,
    [
      'log',
      `--pretty=%an,%B<vsz />`,
      `--no-merges`
    ],
    {
      cwd: "./"
    }
  )

  const authorCommitMsg = {}

  return new Promise((resolve, reject) => {
    command.stdout.on('data', data => {
      const originData = data.toString()

      const lineData = originData.split('<vsz />')
      const pattern = /([^,]+)(.*)/

      lineData.forEach(line => {
        line = line.replace(/[\n\r\f]+/, '')
        if (!line) return

        const match = line.match(pattern)
        const author = match[1]

        if (!author || BLACK_LIST.includes(author)) return

        authorCommitMsg[author] = mergeSplitData(authorCommitMsg[author], splitCommitMsg(match[2].slice(1)))
      })
    })
    command.stderr.on('data', error => {
      reject(error)
    })
    command.on('close', code => {
      console.log(authorCommitMsg)
      resolve(authorCommitMsg)
    })
  })
}


module.exports = {
  collectAuthorCommitMsg
}
