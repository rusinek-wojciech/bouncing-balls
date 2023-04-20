import { createRenderer } from './renderer'
import { createCamera } from './camera'
import { collisionBall, collisionWall, createScene } from './scene'

export function loadApp() {
  const renderer = createRenderer()
  const camera = createCamera(renderer)
  const { scene, balls } = createScene()

  renderer.setAnimationLoop(() => {
    for (let i = 0; i < balls.length; i++) {
      const ball = balls[i]
      collisionWall(ball)

      for (let j = i + 1; j < balls.length; j++) {
        collisionBall(ball, balls[j])
      }

      ball.mesh.translateX(ball.speed.x)
      ball.mesh.translateY(ball.speed.y)
      ball.mesh.translateZ(ball.speed.z)
    }

    renderer.render(scene, camera)
  })
}
