import React, { useEffect, useRef, useState } from 'react'
import "./index.css"
import { blurARGB, dilate, invertColors} from "./filters.js"
import Tesseract, { createWorker } from 'tesseract.js'

const width = 500
const height = 500


export default function App() {
    const reading = useRef(false)
    const worker = createWorker({
        logger: m => console.log(m),
    })
    const convertImageToText = async () => {
        reading.current = true
        await worker.load();
        await worker.loadLanguage("eng");
        await worker.initialize("eng");
        const {
          data: { text },
        } = await worker.recognize(myCanvas.current);
        setResult(text);
        reading.current = false
      };

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
            setupVideo();
            draw()
        }
    }, [])

    useEffect(() => {
        if (play) {
            myVideo.current.play()
            // draw()
            return
        }
        myVideo.current.pause()
        // if (myCanvas.current) convertImageToText(myCanvas.current)

    }, [play])
    function draw() {
        // if (myVideo.current?.paused) return false
        if (myCanvas.current) {
            const ctx = myCanvas.current.getContext("2d",  {willReadFrequently:true})
            ctx.clearRect(0,0,width,height)
            ctx.drawImage(myVideo.current,0,0,width,height)
            // ctx.rect(width/4, height/4, width/2, height/2)
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
            if (!reading.current) convertImageToText(myCanvas.current)

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
                <video  ref={myVideo} width={width} height={height} autoPlay={true}></video>
                <canvas ref={myCanvas} width={width} height={height}></canvas>  
            </section>
            <section className="button-panel">
                <span className="play-pause" onClick={() => setPlay(curr => !curr)}>{play? "⏸️":"▶️"}</span>
                <div style={{display:"flex", flexDirection:"column"}}>
                    <label htmlFor="threshold">Threshold ({treshVal})</label>
                    <input ref={myBar} type="range" id="threshold" value={treshVal} onChange={e => setTreshVal(parseFloat(e.target.value))} min="0" max="1" step=".05"/>
                    {
                        Object.keys(config.current).map(el => (
                        <span key={el}>
                        <label htmlFor={el}>{el}</label>
                        <input id={el} type="checkbox" name={el} defaultChecked={config.current[el]} onChange={e => config.current[e.target.name] = e.target.checked}/>
                        </span>
                        )
                    )
                    }
                </div>
            </section>
            <section>
                Result: <code>{result}</code>
            </section>
        </div>
    )
}
