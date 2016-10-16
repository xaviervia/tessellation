import uuid from 'uuid'
import {APP_SETUP} from 'actions'

export default (push) => {
  push({
    type: APP_SETUP,
    payload: {
      id: uuid.v4()
    }
  })
}
