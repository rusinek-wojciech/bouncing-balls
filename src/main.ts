import './style.css'
import WebGL from 'three/examples/jsm/capabilities/WebGL'
import * as THREE from 'three'
import { createCamera } from './camera'
import { createScene } from './scene'
import { collisionBall, collisionBox } from './collision'

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
  const clock = new THREE.Clock()

  renderer.setAnimationLoop(() => {
    const dt = clock.getDelta()

    for (let i = 0; i < balls.length; i++) {
      collisionBox(balls[i], dt)
      for (let j = i + 1; j < balls.length; j++) {
        collisionBall(balls[i], balls[j], dt)
      }
    }

    balls.forEach((ball) => ball.setNextPosition(dt))
    renderer.render(scene, camera)
  })
}

function handleWebGLNotAvailable() {
  const h1 = document.createElement('h1')
  h1.appendChild(
    document.createTextNode('WebGL is not supported on this platform')
  )
  document.body.appendChild(h1)
}

window.addEventListener(
  'DOMContentLoaded',
  () => (WebGL.isWebGLAvailable() ? loadApp() : handleWebGLNotAvailable()),
  { once: true }
)
