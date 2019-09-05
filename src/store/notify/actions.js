import { Notify } from 'quasar'

export function displayMessage (commit, { message, position = 'top-right', type = 'positive' }) {
  Notify.create({
    message: message,
    position: position,
    color: type
  })
}
