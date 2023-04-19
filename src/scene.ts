import * as THREE from 'three'

/**
 * configuration
 */
const BALL_RADIUS = 0.5
const BALLS_COUNT = 10
const A = 10
const B = 20
const WALL_HEIGHT = 1.1
const WALL_THICKNESS = 1
const MAX_SPEED = 0.25

/**
 * do not change
 */
const EXTENDED_A = A + 2 * WALL_THICKNESS
const X_WALL_POSITION = A / 2 + WALL_THICKNESS / 2
const Y_WALL_POSITION = B / 2 + WALL_THICKNESS / 2
const Z_WALL_POSITION = WALL_HEIGHT / 2
const A_WITHOUT_BALL = A - BALL_RADIUS * 2
const B_WITHOUT_BALL = B - BALL_RADIUS * 2
const HALF_A_WITHOUT_BALL = A_WITHOUT_BALL / 2
const HALF_B_WITHOUT_BALL = B_WITHOUT_BALL / 2

interface SceneBall {
  mesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>
  rb: {
    x: number
    y: number
  }
}

const balls: SceneBall[] = []

export function createScene() {
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

  const ballGeometry = new THREE.SphereGeometry(BALL_RADIUS)
  const ballMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 })

  for (let i = 0; i < BALLS_COUNT; i++) {
    const ball = new THREE.Mesh(ballGeometry, ballMaterial)

    const x = (Math.random() - 0.5) * A_WITHOUT_BALL
    const y = (Math.random() - 0.5) * B_WITHOUT_BALL

    ball.position.set(x, BALL_RADIUS, y)
    ball.quaternion.set(0, 0, 0, 1)
    ball.castShadow = true
    ball.receiveShadow = true
    scene.add(ball)
    balls.push({
      mesh: ball,
      rb: {
        x: (Math.random() - 0.5) * MAX_SPEED,
        y: (Math.random() - 0.5) * MAX_SPEED,
      },
    })
  }

  return { scene, balls }
}

function createAquarium() {
  const material = new THREE.MeshStandardMaterial({
    color: 'teal',
  })
  const aquarium = new THREE.Mesh()

  const floorGeometry = new THREE.BoxGeometry(A, 0, B)
  const wallGeometry = new THREE.BoxGeometry(WALL_THICKNESS, WALL_HEIGHT, B)
  const extendedWallGeometry = new THREE.BoxGeometry(
    EXTENDED_A,
    WALL_HEIGHT,
    WALL_THICKNESS
  )
  floorGeometry.computeVertexNormals()

  const floor = new THREE.Mesh(floorGeometry, material)
  floor.castShadow = true
  floor.receiveShadow = true
  aquarium.add(floor)

  const w1 = new THREE.Mesh(wallGeometry, material)
  w1.position.set(X_WALL_POSITION, Z_WALL_POSITION, 0)
  w1.castShadow = true
  w1.receiveShadow = true

  const w2 = new THREE.Mesh(wallGeometry, material)
  w2.position.set(-X_WALL_POSITION, Z_WALL_POSITION, 0)
  w2.castShadow = true
  w2.receiveShadow = true

  const w3 = new THREE.Mesh(extendedWallGeometry, material)
  w3.position.set(0, Z_WALL_POSITION, Y_WALL_POSITION)
  w3.castShadow = true
  w3.receiveShadow = true

  const w4 = new THREE.Mesh(extendedWallGeometry, material)
  w4.position.set(0, Z_WALL_POSITION, -Y_WALL_POSITION)
  w4.castShadow = true
  w4.receiveShadow = true

  aquarium.add(w1)
  aquarium.add(w2)
  aquarium.add(w3)
  aquarium.add(w4)
  return aquarium
}

export function collisionWallBall(ball: SceneBall) {
  const { mesh, rb } = ball

  const x = mesh.position.x + rb.x
  const y = mesh.position.z + rb.y

  if (x > HALF_A_WITHOUT_BALL) {
    rb.x = -rb.x
  }

  if (x < -HALF_A_WITHOUT_BALL) {
    rb.x = -rb.x
  }

  if (y > HALF_B_WITHOUT_BALL) {
    rb.y = -rb.y
  }

  if (y < -HALF_B_WITHOUT_BALL) {
    rb.y = -rb.y
  }

  mesh.translateX(rb.x)
  mesh.translateZ(rb.y)
}
