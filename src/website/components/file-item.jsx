import React  from "react";
import './style.css'

export const LinkItem = (props) => {

  const { link, title } = props

  return <div>
    <h1 className="title" onClick={()=>{window.open(link)}}>{title}</h1>
  </div>

}