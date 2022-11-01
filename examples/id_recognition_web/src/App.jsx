import React, { useEffect, useRef, useState } from 'react'
import "./index.css"
import { blurARGB, dilate, invertColors} from "./filters.js"
const width = 500
const height = 500

export default function App() {

    const [treshVal, setTreshVal] = useState(.5)
    const myVideo = useRef()
    const myCanvas = useRef()
    const myBar = useRef()
    const config = useRef({
        invert: true,
        dilate: true,
        blur: true
    })
    const [play, setPlay] = useState(true)

    const [result, setResult] = useState("")

    const setupVideo = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({video:{width, height, facingMode:"user"}, audio:false})
            myVideo.current.srcObject = mediaStream
            myVideo.current.play()
        } catch {
            alert("Something went wrong :C")
        }
    }

    useEffect(() =>  {
        if (myVideo.current) {
            setupVideo()
            draw()
        }
    }, [])

    useEffect(() => {
        if (play) {
            myVideo.current.play()
            return
        }
        myVideo.current.pause()
    }, [play])

    function draw() {
        if (myCanvas.current) {
            const ctx = myCanvas.current.getContext("2d")
            ctx.clearRect(0,0,width,height)
            ctx.drawImage(myVideo.current,0,0,width,height)
            ctx.rect(width/4, height/4, width/2, height/2)
            const processedImage = ctx.getImageData(0,0,width,height)
            
            if (config.current.blur) blurARGB(processedImage.data, myCanvas.current, 1);
            if (config.current.dilate) dilate(processedImage.data, myCanvas.current);
            if (config.current.invert) invertColors(processedImage.data);
            if (myBar.current.value > 0) thresholdFilter(processedImage.data, myBar.current.value);
            ctx.putImageData(processedImage,0,0)
            // for (let i = 1; i<20; i++) {
            //     ctx.rect(width/4, height/4, width/i, height/i)
            // }

            ctx.stroke()
        }
        requestAnimationFrame(draw)
    }

    function thresholdFilter(pixels, level) {
        level = level ?? .5

        const thresh = Math.floor(level * 255)
        for (let i = 0; i < pixels.length ; i+=4) {
            const r = pixels[i]
            const g = pixels[i+1]
            const b = pixels[i+2]
            const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            let val = 0;
            if (gray >= thresh) {
                val = 255;
            }
            pixels[i] = pixels[i + 1] = pixels[i + 2] = val;
        }
    }

    return (
        <div id="container">
            <section>
                <video  ref={myVideo} width={width} height={height}></video>
                <canvas ref={myCanvas} width={width} height={height}></canvas>  
            </section>
            <section class="button-panel">
                <span className="play-pause" onClick={() => setPlay(curr => !curr)}>{play? "⏸️":"▶️"}</span>
                <div style={{display:"flex", flexDirection:"column"}}>
                    <label htmlFor="threshold">Threshold ({treshVal})</label>
                    <input ref={myBar} type="range" id="threshold" defaultValue=".5" value={treshVal} onChange={e => setTreshVal(parseFloat(e.target.value))} min="0" max="1" step=".05"/>
                    {
                        Object.keys(config.current).map(el => (
                        <span>
                        <label htmlFor={el}>{el}</label>
                        <input id={el} key={el} type="checkbox" name={el} defaultChecked={config.current[el]} onChange={e => config.current[e.target.name] = e.target.checked}/>
                        </span>
                        )
                    )
                    }
                </div>
            </section>
            <section>
                Result: {result}
            </section>
        </div>
    )
}
