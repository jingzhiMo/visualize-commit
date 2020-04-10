const { spawn } = require('child_process')

// 不需要统计的作者
const BLACK_LIST = [
  'dependabot[bot]'
]

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
        line = line.replace(/\n/, '')
        if (!line) return

        const match = line.match(pattern)
        const author = match[1]

        if (!author || BLACK_LIST.includes(author)) return

        authorCommitMsg[author] = authorCommitMsg[author] || []
        authorCommitMsg[author].push(match[2].slice(1))
      })
    })
    command.stderr.on('data', error => {
      reject(error)
    })
    command.on('close', code => {
      resolve(authorCommitMsg)
    })
  })
}


module.exports = {
  collectAuthorCommitMsg
}
