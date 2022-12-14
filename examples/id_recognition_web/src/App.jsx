import React, { useEffect, useRef, useState } from 'react'
import "./index.css"
import { blurARGB, dilate, invertColors} from "./filters.js"
import Tesseract, { createWorker } from 'tesseract.js'

const width = 500
const height = 500
const MIN_CONFIDENCE = 40

export default function App() {
    const reading = useRef(false)
    const worker = createWorker({
        // logger: m => console.log(m),
    })
    const convertImageToText = async () => {
        reading.current = true
        await worker.load();
        await worker.loadLanguage("eng");
        await worker.initialize("eng");
        await worker.setParameters({
            tessedit_char_whitelist: 'ABCDEFGHIJLKMNOPQRSTUVWXYZabcdefghijlkmnopqrstuvwxyz0123456789. ',
          });
        const {data} = await worker.recognize(myCanvas.current);
        setResult(data.confidence >= MIN_CONFIDENCE ? data : null);
        console.log(data)
        reading.current = false
      };
    const [treshVal, setTreshVal] = useState(.5)
    const myVideo = useRef()
    const myCanvas = useRef()
    const myCtx = useRef()
    const myBar = useRef()
    const config = useRef({
        invert: true,
        dilate: true,
        blur: true
    })
    const [play, setPlay] = useState(true)

    const [result, setResult] = useState(null)

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
            myCtx.current = myCanvas.current.getContext("2d",  {willReadFrequently:true})
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
    async function draw() {
        // if (myVideo.current?.paused) return false
        if (myCanvas.current) {
            myCtx.current.clearRect(0,0,width,height)
            myCtx.current.drawImage(myVideo.current,0,0,width,height)
            const processedImage = myCtx.current.getImageData(0,0,width,height)
            
            if (config.current.blur) blurARGB(processedImage.data, myCanvas.current, 1);
            if (config.current.dilate) dilate(processedImage.data, myCanvas.current);
            if (config.current.invert) invertColors(processedImage.data);
            if (myBar.current.value > 0) thresholdFilter(processedImage.data, myBar.current.value);
            myCtx.current.putImageData(processedImage,0,0)
            myCtx.current.stroke()
            // if (!reading.current) convertImageToText(myCanvas.current) // non-blocking
            await convertImageToText(myCanvas.current) // blocking

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
                <span className="play-pause" onClick={() => setPlay(curr => !curr)}>{play? "??????":"??????"}</span>
                <div style={{display:"flex", flexDirection:"column"}}>
                    <label htmlFor="threshold">Threshold ({treshVal})</label>
                    <input ref={myBar} type="range" id="threshold" value={treshVal} onChange={e => setTreshVal(parseFloat(e.target.value))} min="0" max="1" step=".05"/>
                    {
                        Object.keys(config.current).map(el => (
                        <span key={el}>
                        <label htmlFor={el}>{el}</label>
                        <input id={el} type="checkbox" name={el} defaultChecked={config.current[el]} onChange={e => config.current[e.target.name] = e.target.checked}/>
                        </span>
                        ))
                    }
                </div>
            </section>
            {result ? <section style={{display:"flex", gap:"2px", flexDirection:"column"}}>
                <span>
                    <b>Result:</b>
                    <code>{result.text}</code>
                </span>

                <span>
                    <b>Confidence:</b>
                    <code>{result.confidence}%</code>
                </span>
                {
                    result.symbols.map((b,i)=> {
                    let {x0, x1, y0, y1} = b.bbox
                    const canvasRect = myCanvas.current.getBoundingClientRect()
                    const w = x1 - x0;
                    const h = y1 - y0;
                    x0 += canvasRect.left
                    y0 += canvasRect.top
                        return<div key={i} className='box' style={{left:x0, top: y0, width:w, height: h}}></div>
                    })
                }
            </section> : null}

        </div>
    )
}
