import { Link } from "react-router";
import "@/src/css/Puppy.css";
import BasicDraw from "@/src/components/draw/BasicDraw";

// hellooooo

export default function Puppy() {
  return (
    <div>
      <h1>hello and welcome to pico chat !!</h1>
      <nav>
        <ul>
          <li>
            <Link to="profile">click for joy</Link>
          </li>
          <li>
            <Link to="profile">click for agony</Link>
          </li>
        </ul>
      </nav>
      <BasicDraw
        className="basic-draw-canvas"
        width={800}
        height={450}
        strokeWidth={2}
      />
    </div>
  )
}
