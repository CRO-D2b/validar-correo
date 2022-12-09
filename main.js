const fs = require('fs')
const emailValidator = require('deep-email-validator')
const { parse } = require('csv-parse')

const CSVFILE = 'subscribed_members_export_60bf5ff8a1.csv'
const NEWFILENAME = 'export.csv'

const readCSV = (csv) => {
  let data = []
  console.log('File reading started')
  fs.createReadStream(csv)
    .pipe(
      parse({
        delimiter: ',',
        columns: true,
        ltrim: true,
      })
    )
    .on('data', (row) => {
      data.push(row)
    })
    .on('error', (error) => {
      console.log(error.message)
    })
    .on('end', () => {
      console.log('File reading finished')
    })

  return new Promise((res) =>
    setTimeout(() => {
      res(data)
    }, 2000)
  )
}

const writeCSV = (filename, content) => {
  console.log('Creating new file => ' + filename)
  fs.writeFile(filename, content, (err) => {
    if (err) throw err
  })
}

const appendCSV = (filename, content) => {
  fs.appendFile(filename, content, (err) => {
    if (err) throw err
  })
}

const isEmailValid = (e) => {
  return emailValidator.validate({ email: e, validateTypo: false })
}

const verifyEmails = async () => {
  let noValid = 0
  let valid = 0
  let data = await readCSV(CSVFILE)
  let columns = Object.keys(data[0])
  let csvContent = columns + '\n'
  let numberOfVerifications = 5000
  writeCSV(NEWFILENAME, csvContent)
  writeCSV('noValidEmails.csv', csvContent)
  console.log('Verifying emails')
  for (let i = 0; i < numberOfVerifications; i++) {
    isEmailValid(data[i]['Email Address']).then((res) => {
      if (res.valid) {
        appendCSV(NEWFILENAME, columns.map((column) => data[i][column]).join(',') + '\n')
        valid += 1
      } else {
        appendCSV('noValidEmails.csv', columns.map((column) => data[i][column]).join(',') + '\n')
        noValid += 1
      }
    })
    if (i === numberOfVerifications - 1) setTimeout(() => console.log('Writing file => ' + NEWFILENAME), 15000)
  }
}

verifyEmails()
