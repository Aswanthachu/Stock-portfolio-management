import React from 'react'
import { Link } from 'react-router-dom'
const Button = ({ text, onClick, className, link, newTab, icon, ariaLabel,state ,type}) => {
  return (
    <>
      {link ? <Link target={newTab ? '_blank' : ""} to={link ? link : '#'} state={{state}}  aria-label={ariaLabel} className={className} onClick={onClick}>{text}{icon}</Link>
        : <button aria-label={ariaLabel} className={className} onClick={onClick} type={type}>{text}{icon}</button>}


    </>

  )
}

export default Button