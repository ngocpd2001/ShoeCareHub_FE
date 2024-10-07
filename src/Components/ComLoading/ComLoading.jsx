import React , { useState, useEffect }from 'react';
import { Spin } from "antd";
import './ComLoadingStyle.css'; 
import loadingImg from "../ComLoading/loadingImg.png";

const ComLoading = React.forwardRef(
  (
    {
      delay = 0,
      indicator = loadingImg,//display image
      color = 'white',//text color
      fontSize="24px",//text size
      size = 'large',//spin size
      spinning = true,
      tip = 'Loading...',//Display text
      imgWidth = "200px",
      imgHeight = "200px",
      ...props
    },
    ref
  ) => {
    const [dots, setDots] = useState('');
  
    useEffect(() => {
      const interval = setInterval(() => {
        setDots((prevDots) => (prevDots.length < 3 ? prevDots + '.' : ''));
      }, 500);
  
      return () => clearInterval(interval);
    }, []);
    return (
      <>
        <Spin
          ref={ref}
          delay={delay}
          indicator ={<img style={{ width:imgWidth,
            height:imgHeight, marginBottom:"50px"}} src={indicator} alt="Loading" className="spin-image" />}
          
          size={size}
          spinning={spinning}
          tip={<h1 style={{fontSize: fontSize, color: color}}>{tip+ dots}</h1>}
          fullscreen
          {...props}
        >
          
        </Spin>

      </>
    )
  }
);

export default ComLoading;
