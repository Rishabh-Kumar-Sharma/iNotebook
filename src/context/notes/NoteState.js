import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
    const s1={
        "name":"Rishabh",
        "class":"12A"
    }
    const [state,setState]=useState(s1);
const update=()=>{
    setTimeout(()=>{
        setState({
            "name":"Rish@bh",
            "class":"12B"
        })
    },1000)
}
  return <NoteContext.Provider value={{state,update}}>
    {props.children}
    </NoteContext.Provider>;
};

export default NoteState;