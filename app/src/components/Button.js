import React from 'react'

export default function Button ({children, title, ...props}) {
  return <button
    className='b--none bg-navy'
    {...props}>
    {children}
    <span className='below'>{title}</span>
  </button>
}
