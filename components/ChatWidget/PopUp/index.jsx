import React, { useRef, useState ,useEffect, useCallback} from 'react'
import styles from './index.module.scss'
import Image from 'next/legacy/image'
import Message from '../Modules/Message'
import socketIOClient from "socket.io-client";
import {
    initiateSocketConnection,
    disconnectSocket,
    sendMessage,
    subscribeToMessages,
    onNewUsers,
    joinRoom
} from "../../../utils/socket.io.utils";

const CHAT_ROOM = 'myRandomChatRoomId';
const SENDER = {
    id: 124,
    name: "JOHN Doe"
};
const ENDPOINT = "http://localhost:8088";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkxIiwibmFtZSI6IlllbGxvdyBHcmVlbiIsImlhdCI6MTUxNjIzOTAzM30.miy3yKVFOY5fZ69YyXV8kdggXtUqV-HIKUFSnd1mn1Q"

export default function PopUp() {

    const outsideRef = useRef()
    const iconref = useRef()

    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if ((outsideRef.current && !outsideRef.current.contains(event.target)) && (iconref.current && !iconref.current.contains(event.target))) {
                console.log(true)
                close(false)
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [outsideRef,iconref]);


    const messageRef = useRef()
    const containerRef = useRef()

    const [opened,close] = useState(false)
    const [chatId,setChatId] = useState(false)
    const [user,setUser] = useState(false)
    const [messages,setMessage] = useState([])

    useEffect(()=>{  
        scrollToMyRef()
    },[messages,opened])

    // useEffect(() => {
    //     if (chatId && opened) {
    //       initiateSocketConnection(chatId);
    //       subscribeToMessages((err, data) => {
    //         setMessages(prev => [...prev, data]);
    //       });
    //       return () => {
    //         disconnectSocket();
    //       }
    //     }
    // }, [chatId]);
    
    useEffect(()=>{
        if(!user && opened){
            setUser(SENDER)
        }
    },[opened])

    useEffect(() => {
        if (user && opened) {
            setMessage([])
            initiateSocketConnection(token);
            joinRoom({name : user?.id, user},(err, data) => {
                setMessage(prev => [...prev, data]);
            });
            subscribeToMessages((err, data) => {
                console.log(data);
                setMessage(prev => [...prev, data]);
            });
            return () => {
                disconnectSocket();
            }
        }
    }, [user,opened]);
    

    // useEffect(() => {
    //     if(chatId){
    //         const socket = socketIOClient(ENDPOINT);
    //         socket.on("init", data => {
    //           setMessage(prvChat=>[...prvChat,data]);
    //         });
    //     }
    // }, [chatId]);

    console.log("Data",opened)

    const  scrollToMyRef = () => {
        if(containerRef.current){
            const scroll =
              containerRef.current.scrollHeight -
              containerRef.current.clientHeight;
            containerRef.current.scrollTo(0, scroll);
        }
    };

    const send = () =>{
        if(messageRef?.current?.value !== null){
          
            const message = messageRef?.current?.textContent;
            sendMessage({message, roomName: user?.id}, cb => {
                // callback is acknowledgement from server
                setMessage(prev => [...prev, {
                    message,
                    sender : {
                        ...user
                    }
                }]);
                // clear the input after the message is sent
                messageRef.current.textContent  = '';
            });
            return
        }
        return
    }

    const handleSendOnClick = () =>{
        if(messageRef?.current?.value){
            send()
            return
        }
        return
    }

    const handleSendOnKeyPress = (event) =>{
        if(event.key === 'Enter'){
            event.preventDefault()

            if(event.ctrlKey){   
                const message = messageRef.current.innerHTML
                messageRef.current.innerHTML = message + "</br>"       
                return true
            }else {
                send()
                messageRef.current.innerHTML = ''       
                return true
            }
        }
        return true
    }
  

    return (
        <>
            {opened ? (
                <div className={styles.pop_up} ref={outsideRef} >
                    <div className={styles.pop_up_top}>
                        <div className={styles.top_left}>
                            <Image
                                src={"/icons/default_avatar.jpg"}
                                width={40}
                                height={40}
                                alt="avatar"
                                />
                            <div className={styles.user_info}>
                                <div className={styles.user_name}>{user?.name}</div>
                                <div className={styles.user_status}>
                                    <div></div>
                                    <div>En ligne</div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.pop_up_close} onClick={(e)=>{close(false)}}>
                            <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M6 6L18 18" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    <div className={styles.pop_up_content}>
                        <div ref={containerRef} className={styles.pop_up_content_messages}>
                            <Message welcome={true}/>
                            {messages && messages?.map((m,i)=>{
                                return(
                                    <div key={i}>
                                        <Message message={m} active={m?.sender?.id === user?.id}/>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className={styles.pop_up_bottom}>
                        <span contentEditable={true} onKeyDown={(e)=>{handleSendOnKeyPress(e)}}   placeholder={"Message"} ref={messageRef}  className={styles.textArea} >

                        </span>
                        <svg  onClick={handleSendOnClick} width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none"><path fill="#000000" fillRule="evenodd" d="M2.345 2.245a1 1 0 0 1 1.102-.14l18 9a1 1 0 0 1 0 1.79l-18 9a1 1 0 0 1-1.396-1.211L4.613 13H10a1 1 0 1 0 0-2H4.613L2.05 3.316a1 1 0 0 1 .294-1.071z" clipRule="evenodd"/></svg>
                    </div>
                    
                </div>
            ):<></>}
            <div ref={iconref} className={styles.pop_up_icon} onClick={(e)=>{e.preventDefault();close(!opened)}}>
                <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style={{width:24,heigth:24}} ><g ><path d="M15.36,9.96c0,1.09-0.67,1.67-1.31,2.24c-0.53,0.47-1.03,0.9-1.16,1.6L12.85,14h-1.75l0.03-0.28 c0.14-1.17,0.8-1.76,1.47-2.27c0.52-0.4,1.01-0.77,1.01-1.49c0-0.51-0.23-0.97-0.63-1.29c-0.4-0.31-0.92-0.42-1.42-0.29 c-0.59,0.15-1.05,0.67-1.19,1.34L10.32,10H8.57l0.06-0.42c0.2-1.4,1.15-2.53,2.42-2.87c1.05-0.29,2.14-0.08,2.98,0.57 C14.88,7.92,15.36,8.9,15.36,9.96z M12,18c0.55,0,1-0.45,1-1s-0.45-1-1-1s-1,0.45-1,1S11.45,18,12,18z M12,3c-4.96,0-9,4.04-9,9 s4.04,9,9,9s9-4.04,9-9S16.96,3,12,3 M12,2c5.52,0,10,4.48,10,10s-4.48,10-10,10S2,17.52,2,12S6.48,2,12,2L12,2z"></path></g></svg>
            </div>
        </>
    )
}
