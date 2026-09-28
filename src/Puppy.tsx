import "@/src/css/Puppy.css"
import BasicDraw from "@/src/components/draw/BasicDraw";

// hellooooo

export default function Puppy() {
  return (
    <div>
      <h1>hello and welcome to pico chat !!</h1>
      <BasicDraw
        className="basic-draw-canvas"
        width={800}
        height={450}
        strokeWidth={2}
      />
    </div>
  )
}
