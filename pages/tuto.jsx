import React, { useRef, useState } from 'react'

export default function tuto() {

    // const [value,setValue] = useState("")
    const inputRef = useRef()
    console.log("Render")
    const handleSubmit = () =>{
        console.log("Submit value",inputRef?.current?.value)
    }
  return (
    <div style={{
        padding:"3rem"
    }}>
        <input 
            ref={inputRef}
            type="text" 
            placeholder="Enter text here"
            // onChange={(e)=>{setValue(e?.target?.value)}}
        />
        <input 
            type={"submit"}
            value="Submit"

            onClick={handleSubmit}
        />
    </div>
  )
}
