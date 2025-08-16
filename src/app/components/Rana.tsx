'use client'
import { throttle } from "lodash"
import SmartImage from "./SmartImage"

export function Rana() {
    const playVoice = throttle(() => {
        const audio = new Audio('Omoshireonna.m4a')
        audio.play()
    })
    return (
        <SmartImage src={"/rana.png"} width={1024} height={1024} alt={"Rána"} onClick={playVoice} />
    )
}