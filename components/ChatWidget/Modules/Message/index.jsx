import React from 'react'
import styles from './index.module.scss'

export default function Message({message,active,welcome=false}) {
  if(welcome){
    return(
      <div className={styles.welcomeMsg}>Welcome. You can start this chat.</div>
    )
  }
  return (
    <div className={styles.messageBox+" "+(active && styles.active)}>
        <div className={styles.message}>{message?.message}</div>
    </div>
  )
}
