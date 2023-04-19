import { createCamera } from './camera'
import './style.css'

import * as THREE from 'three'

function createAquarium() {
  const a = 10
  const b = 20
  const height = 0.5
  const thickness = 0.2
  const z = 1

  const boostedA = a + 2 * thickness
  const xPosWall = a / 2 + thickness / 2
  const yPosWall = b / 2 + thickness / 2

  const floorMaterial = new THREE.MeshStandardMaterial({
    color: 'teal',
  })
  const wallMaterial = new THREE.MeshStandardMaterial({
    color: 'red',
  })
  const aquarium = new THREE.Mesh()

  const floor = new THREE.Mesh(new THREE.BoxGeometry(a, z, b), floorMaterial)
  floor.castShadow = true
  floor.receiveShadow = true
  aquarium.add(floor)

  const wallNorth = new THREE.Mesh(
    new THREE.BoxGeometry(thickness, height + z, b),
    wallMaterial
  )
  wallNorth.position.set(xPosWall, floor.position.z + height / 2, 0)
  wallNorth.castShadow = true
  wallNorth.receiveShadow = true
  aquarium.add(wallNorth)

  const wallSouth = new THREE.Mesh(
    new THREE.BoxGeometry(thickness, height + z, b),
    wallMaterial
  )
  wallSouth.position.set(-xPosWall, floor.position.z + height / 2, 0)
  wallSouth.castShadow = true
  wallSouth.receiveShadow = true
  aquarium.add(wallSouth)

  const wallWest = new THREE.Mesh(
    new THREE.BoxGeometry(boostedA, height + z, thickness),
    wallMaterial
  )
  wallWest.position.set(0, floor.position.z + height / 2, yPosWall)
  wallWest.castShadow = true
  wallWest.receiveShadow = true
  aquarium.add(wallWest)

  const wallEast = new THREE.Mesh(
    new THREE.BoxGeometry(boostedA, height + z, thickness),
    wallMaterial
  )
  wallEast.position.set(0, floor.position.z + height / 2, -yPosWall)
  wallEast.castShadow = true
  wallEast.receiveShadow = true
  aquarium.add(wallEast)

  return aquarium
}

function createRenderer() {
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)

  document.body.appendChild(renderer.domElement)

  return renderer
}

function createScene() {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color('skyblue')

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0)
  directionalLight.position.set(5, 10, 5)
  directionalLight.target.position.set(0, 1, 0)
  directionalLight.castShadow = true
  directionalLight.shadow.bias = -0.001
  directionalLight.shadow.mapSize.width = 2048
  directionalLight.shadow.mapSize.height = 2048
  directionalLight.shadow.camera.near = 0.1
  directionalLight.shadow.camera.far = 500.0
  directionalLight.shadow.camera.near = 0.5
  directionalLight.shadow.camera.far = 500.0
  directionalLight.shadow.camera.left = 100
  directionalLight.shadow.camera.right = -100
  directionalLight.shadow.camera.top = 100
  directionalLight.shadow.camera.bottom = -100
  scene.add(directionalLight)

  const ambientLight = new THREE.AmbientLight(0x101010, 1.5)
  scene.add(ambientLight)

  const aquarium = createAquarium()
  scene.add(aquarium)

  return scene
}

function initialize() {
  const renderer = createRenderer()
  const camera = createCamera(renderer)
  const scene = createScene()
  const clock = new THREE.Clock()

  const balls: THREE.Mesh[] = []

  function spawnBall() {
    const radius = 0.5

    const ball = new THREE.Mesh(
      new THREE.SphereGeometry(radius),
      new THREE.MeshStandardMaterial({ color: 0x808080 })
    )
    const x = Math.random() * 8 - 4
    const y = Math.random() * 18 - 9

    ball.position.set(x, 1.0, y)
    ball.quaternion.set(0, 0, 0, 1)
    ball.castShadow = true
    ball.receiveShadow = true

    balls.push(ball)
    scene.add(ball)
  }

  let count = 0
  const maxCount = 30

  function render(deltaTime: number) {
    if (count < maxCount) {
      ++count
      spawnBall()
    }

    balls.forEach((ball) => {
      // ball.translateX(0.01)
    })
  }

  renderer.setAnimationLoop(() => {
    const deltaTime = clock.getDelta()
    render(deltaTime)
    renderer.render(scene, camera)
  })
}

window.addEventListener('DOMContentLoaded', () => initialize(), {
  once: true,
})
