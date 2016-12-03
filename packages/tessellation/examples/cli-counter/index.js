const createApp = require('tessellation/createApp').default
const chalk = require('chalk')

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD':
      return Object.assign({}, state, {
        value: state.value + 1
      })

    default:
      return state
  }
}

const initialState = {value: 0}

const effects = [
  (push) => {
    process.stdin.on('data', () => {
      push({
        type: 'ADD'
      })
    })

    return (state) => {
      console.log('The counter value is:', chalk.red(state.value))
      console.log(chalk.gray(`Press ${chalk.white('ENTER')} to increase it`))
    }
  }
]

createApp(reducer, initialState, effects)
