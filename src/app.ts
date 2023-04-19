import { createRenderer } from './renderer'
import { createCamera } from './camera'
import { collisionWallBall, createScene } from './scene'

export function loadApp() {
  const renderer = createRenderer()
  const camera = createCamera(renderer)
  const { scene, balls } = createScene()

  function render() {
    for (let i = 0; i < balls.length; i++) {
      const ball = balls[i]
      collisionWallBall(ball)
    }
  }

  renderer.setAnimationLoop(() => {
    render()
    renderer.render(scene, camera)
  })
}
