import * as THREE from 'three'
import {
  A,
  B,
  BALLS_COUNT,
  BALL_RADIUS,
  C,
  MAX_BALL_SPEED,
  WALL_THICKNESS,
  X_WALL_POSITION,
  Y_WALL_POSITION,
  Z_WALL_POSITION,
} from './config'
import { SceneBall } from './types'

const random = (max: number) => (Math.random() - 0.5) * max

export function createScene() {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x87ceeb)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0)
  directionalLight.position.set(0.33, 0.66, 0.1)
  directionalLight.target.position.set(0, 0, 0)
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
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  const box = createBox()
  scene.add(box)

  const balls: SceneBall[] = []
  for (let i = 0; i < BALLS_COUNT; i++) {
    const ball = createBall()
    balls.push(ball)
    scene.add(ball.mesh)
  }
  return { scene, balls }
}

function createBall() {
  const geometry = new THREE.SphereGeometry(BALL_RADIUS)
  const position = new THREE.Vector3(
    random(A - geometry.parameters.radius * 2),
    random(C - geometry.parameters.radius * 2),
    random(B - geometry.parameters.radius * 2)
  )
  const speed = new THREE.Vector3(
    random(MAX_BALL_SPEED),
    random(MAX_BALL_SPEED),
    random(MAX_BALL_SPEED)
  )
  const material = new THREE.MeshStandardMaterial({
    color: `hsl(220, ${Math.random() * 100}%, ${Math.random() * 100}%)`,
  })
  const ball = new THREE.Mesh(geometry, material)
  ball.castShadow = true
  ball.receiveShadow = true
  ball.position.copy(position)
  return { mesh: ball, speed }
}

function createBox() {
  const solidMaterial = new THREE.MeshStandardMaterial({
    color: 'teal',
  })
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    roughness: 0.05,
    transmission: 0.9,
    thickness: 0.1,
    color: 'white',
    transparent: true,
  })

  const box = new THREE.Mesh()
  const AB = new THREE.BoxGeometry(A, WALL_THICKNESS, B)
  const CB = new THREE.BoxGeometry(WALL_THICKNESS, C, B)
  const AC = new THREE.BoxGeometry(A, C, WALL_THICKNESS)
  const A_ = new THREE.BoxGeometry(A, WALL_THICKNESS, WALL_THICKNESS)
  const B_ = new THREE.BoxGeometry(WALL_THICKNESS, WALL_THICKNESS, B)
  const C_ = new THREE.BoxGeometry(
    WALL_THICKNESS,
    C + 2 * WALL_THICKNESS,
    WALL_THICKNESS
  )

  AB.computeVertexNormals()
  CB.computeVertexNormals()
  AC.computeVertexNormals()
  A_.computeVertexNormals()
  B_.computeVertexNormals()
  C_.computeVertexNormals()

  const createElem = (
    geometry: THREE.BoxGeometry,
    x: number,
    y: number,
    z: number,
    isGlass = false
  ) => {
    const mesh = new THREE.Mesh(
      geometry,
      isGlass ? glassMaterial : solidMaterial
    )
    mesh.position.set(x, y, z)
    mesh.castShadow = true
    mesh.receiveShadow = true
    box.add(mesh)
  }

  createElem(CB, X_WALL_POSITION, 0, 0, true)
  createElem(CB, -X_WALL_POSITION, 0, 0, true)
  createElem(AC, 0, 0, Z_WALL_POSITION, true)
  createElem(AC, 0, 0, -Z_WALL_POSITION, true)
  createElem(AB, 0, Y_WALL_POSITION, 0, true)
  createElem(AB, 0, -Y_WALL_POSITION, 0, true)

  createElem(B_, X_WALL_POSITION, Y_WALL_POSITION, 0)
  createElem(B_, X_WALL_POSITION, -Y_WALL_POSITION, 0)
  createElem(B_, -X_WALL_POSITION, Y_WALL_POSITION, 0)
  createElem(B_, -X_WALL_POSITION, -Y_WALL_POSITION, 0)

  createElem(A_, 0, Y_WALL_POSITION, Z_WALL_POSITION)
  createElem(A_, 0, Y_WALL_POSITION, -Z_WALL_POSITION)
  createElem(A_, 0, -Y_WALL_POSITION, Z_WALL_POSITION)
  createElem(A_, 0, -Y_WALL_POSITION, -Z_WALL_POSITION)

  createElem(C_, X_WALL_POSITION, 0, Z_WALL_POSITION)
  createElem(C_, X_WALL_POSITION, 0, -Z_WALL_POSITION)
  createElem(C_, -X_WALL_POSITION, 0, Z_WALL_POSITION)
  createElem(C_, -X_WALL_POSITION, 0, -Z_WALL_POSITION)

  return box
}
