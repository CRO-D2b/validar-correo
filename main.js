const fs = require('fs')
const emailValidator = require('deep-email-validator')

const CSV_FILE = process.argv[2]
const VALIDATED_FILE_NAME = 'validatedEmails.csv'
const NO_VALID_FILE_NAME = 'noValidEmails.csv'

const readCSV = (csv) => {
  return fs
    .readFileSync(csv, { encoding: 'utf-8' })
    .split('\n')
    .map((row) => row.split(','))
}

const writeCSV = (filename, content) => {
  console.log('New file created => ' + filename)
  fs.writeFileSync(filename, content, (err) => {
    if (err) throw err
  })
}

const appendCSV = (filename, content) => {
  fs.appendFileSync(filename, content, (err) => {
    if (err) throw err
  })
}

const isEmailValid = async (e) => {
  let answer = await emailValidator.validate({ email: e, validateTypo: false })
  return { email: e, validation: answer }
}

const verifyEmails = async (numberOfVerifications) => {
  console.log('Reading file...')
  let data = readCSV(CSV_FILE)
  console.log('File reading finished')
  let columns = data[0]
  let validCsvContent = columns + '\n'
  let noValidCsvContent = columns + '\n'
  let emailAddress = 0

  console.log('Verifying emails...')
  let validations = []
  for (i = 1; i <= numberOfVerifications; i++) {
    validations.push(isEmailValid(data[i][emailAddress]))
  }
  let count = 0
  validations.forEach((promise) =>
    promise.then(() => {
      process.stdout.write('                   \r')
      process.stdout.write('Progress: ' + (++count * 100) / numberOfVerifications + '%\r')
    })
  )
  let resolvedPromises = await Promise.allSettled(validations)
  console.log('Progress: 100.0%\nEmail verification finished')

  console.log('Writing files....')
  writeCSV(VALIDATED_FILE_NAME, validCsvContent)
  writeCSV(NO_VALID_FILE_NAME, noValidCsvContent)
  resolvedPromises.forEach((i) =>
    i['value']['validation']['valid']
      ? appendCSV(VALIDATED_FILE_NAME, data.find((row) => row[emailAddress] === i['value']['email']) + '\n')
      : appendCSV(NO_VALID_FILE_NAME, data.find((row) => row[emailAddress] === i['value']['email']) + '\n')
  )
  console.log('Process finished')
}

verifyEmails(1000)
