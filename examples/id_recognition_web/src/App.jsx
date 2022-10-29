import React, { useEffect, useRef, useState } from 'react'
import {createWorker} from "tesseract.js"


const vWidth = "320"
const vHeight = "240"

export default function App() {
    const [value, setValue] = useState(0)
    const camera_stream = useRef(null)
    const video = useRef(null)

    const worker = useRef(createWorker({
        // logger: m => console.log(m),
    }));

    useEffect(() => {
        (async () => {
            camera_stream.current = await navigator.mediaDevices.getUserMedia({video:true})
            video.current.srcObject = camera_stream.current
        })();
        (async () => {
            await worker.current.load()
            await worker.current.loadLanguage()
            await worker.current.initialize("eng")
            video.current.requestVideoFrameCallback(readFromVideo)
        })();

    },[])

    const readFromVideo = async (now, frame) => {
        if (video && video.current && video.current.readyState === video.current.HAVE_ENOUGH_DATA) {
            // canvas
            const canvas = document.createElement("canvas");
            canvas.width = vWidth;
            canvas.height =vHeight;

            const image = video.current;
            // source 
            const sx = (0 / 2) / 2;
            const sy = vHeight - video.current.height;
            const sWidth = video.current.width * 2;
            const sHeight =video.current.height * 2;
            // destination
            const dx = 0;
            const dy = 0;
            const dWidth = video.current.width;
            const dHeight =video.current.height;

            canvas.getContext("2d")
            .drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
            // tesseract
            const { data: { text } } = await worker.current.recognize(canvas);
            console.log(text)
        }
        video.current.requestVideoFrameCallback(readFromVideo)
    }

    const recognize = async () => {
        const {data: {text} } = await worker.current.recognize(blob)
        console.log(text);
        await worker.current.terminate()
    }

  return (
    <div>
        <video ref={video} width={vWidth} height={vHeight} autoPlay></video>
    </div>
  )
}
