import './style.css'
import WebGL from 'three/examples/jsm/capabilities/WebGL'
import * as THREE from 'three'
import { createCamera } from './camera'
import { createScene } from './scene'
import { collisionBox, collisionBall } from './collision'

function createRenderer() {
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)

  document.body.appendChild(renderer.domElement)

  return renderer
}

function loadApp() {
  const renderer = createRenderer()
  const camera = createCamera(renderer)
  const { scene, balls } = createScene()

  renderer.setAnimationLoop(() => {
    for (let i = 0; i < balls.length; i++) {
      const ball = balls[i]
      collisionBox(ball)

      for (let j = i + 1; j < balls.length; j++) {
        collisionBall(ball, balls[j])
      }
      ball.mesh.position.add(ball.speed)
    }

    renderer.render(scene, camera)
  })
}

window.addEventListener(
  'DOMContentLoaded',
  () => {
    WebGL.isWebGLAvailable()
      ? loadApp()
      : console.error('WebGL is not available')
  },
  { once: true }
)
