import React from "react";
import Notes from "./Notes.js";
import background from "../pexels-photo-6627401.jpeg"
import { useEffect } from "react";

const Home = (props) => {
useEffect(()=>{
  document.body.style.backgroundImage=`url(${background})`
  document.body.style.backgroundSize="100%"
  document.body.style.backgroundRepeat="none"
  
// eslint-disable-next-line
},[])
  return (
    <div>
      <Notes showAlert={props.showAlert}/>
    </div>
  );
};

export default Home;
