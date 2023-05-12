import React from 'react'
import p5 from 'p5'

const Sketch = ({ data }) => {
    const sketchRef = React.useRef(null)

    React.useEffect(() => {
        const sketch = new p5((p) => {
            p.setup = () => {
                const canvas = p.createCanvas(400, 400)
                canvas.parent(sketchRef.current)
            }

            p.draw = () => {
                p.background(0)
                p.fill(255)
                p.ellipse(p.width / 2, p.height / 2, 50, 50)
                console.log(data)
            }
        })

        return () => {
            sketch.remove()
        }
    }, [])

    return (
        <div className="hidden" ref={sketchRef}></div>
    )
}

export default Sketch
