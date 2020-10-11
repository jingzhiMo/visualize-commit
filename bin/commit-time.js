const { spawn } = require('child_process')
const { BLACK_LIST } = require('../src/const')

// 统计每个 commit 的时间
const collectTime = (cwd) => {
  const command = spawn(
    `git`,
    // <vsz /> 是用于唯一标识分行的分隔符
    [
      'log',
      `--pretty=%an,%at`,
      `--no-merges`
    ],
    {
      cwd: cwd.slice(0, -1)
    }
  )

  const authorObject = {
    'all': []
  }

  return new Promise((resolve, reject) => {
    command.stdout.on('data', data => {
      const lineData = [...data.toString().replace(/[\r\f]+/, '').matchAll(/([^,]+),(\d+)\n/g)]

      lineData.forEach(line => {
        const [, author, time] = line

        if (!author || BLACK_LIST.includes(author)) return

        authorObject[author] = authorObject[author] || []
        authorObject[author].push(time)
        authorObject.all.push(time)
      })
    })
    command.stderr.on('data', error => {
      reject(error)
    })
    command.on('close', code => {
      const result = []

      Object.keys(authorObject).forEach(author => {
        result.push({
          author,
          time: authorObject[author]
        })
      })
      resolve(result)
    })
  })
}

module.exports = collectTime
