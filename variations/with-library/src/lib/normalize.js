const {floor} = Math

export default (target) => (max, value) => floor((value / max) * target)
