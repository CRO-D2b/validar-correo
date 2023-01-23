const emailValidator = require('deep-email-validator')

console.log(process.argv[2])

emailValidator.validate({ email: process.argv[2], validateTypo: false }).then((res) => console.log(res))
