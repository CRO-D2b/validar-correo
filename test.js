// import { validate } from 'deep-email-validator'

import EmailValidator from 'email-deep-validator'

const emailValidator = new EmailValidator()
const a = await emailValidator.verify('dog_fabian@hotmail.com')
console.log(a)

// const validation = async () => {
//   return validate({
//     email: 'fabianmorag0405@gmail.com',
//     validateTypo: false
//   })
// }

// export default validation
