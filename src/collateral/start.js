export default (push) => {
  window.addEventListener('DOMContentLoaded', () => push({
    type: '@@START'
  }))
}
