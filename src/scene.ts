import * as THREE from 'three'

/**
 * configuration
 */
const BALL_RADIUS = 0.5
const BALLS_COUNT = 5

const A = 10
const B = 20
const C = 5

const WALL_THICKNESS = 0.4
const MAX_BALL_SPEED = 0.25

/**
 * do not change
 */
const X_WALL_POSITION = A / 2 + WALL_THICKNESS / 2
const Y_WALL_POSITION = C / 2 + WALL_THICKNESS / 2
const Z_WALL_POSITION = B / 2 + WALL_THICKNESS / 2

const A_WITHOUT_BALL = A - BALL_RADIUS * 2
const B_WITHOUT_BALL = B - BALL_RADIUS * 2
const C_WITHOUT_BALL = C - BALL_RADIUS * 2

const HALF_A_WITHOUT_BALL = A_WITHOUT_BALL / 2
const HALF_B_WITHOUT_BALL = B_WITHOUT_BALL / 2
const HALF_C_WITHOUT_BALL = C_WITHOUT_BALL / 2

interface SceneBall {
  mesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>
  speed: THREE.Vector3
  mass: number
}

const balls: SceneBall[] = []

const random = (max: number) => (Math.random() - 0.5) * max

export function createScene() {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color('skyblue')

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0)
  directionalLight.position.set(0.33, 1, 0.66)
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
  const ambientLight = new THREE.AmbientLight(0x101010, 1.5)
  scene.add(ambientLight)

  const aquarium = createAquarium()
  scene.add(aquarium)

  const ballGeometry = new THREE.SphereGeometry(BALL_RADIUS)
  const ballMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 })

  for (let i = 0; i < BALLS_COUNT; i++) {
    const ball = new THREE.Mesh(ballGeometry, ballMaterial)
    ball.position.set(
      random(A_WITHOUT_BALL),
      random(C_WITHOUT_BALL),
      random(B_WITHOUT_BALL)
    )
    ball.castShadow = true
    ball.receiveShadow = true
    scene.add(ball)
    balls.push({
      mesh: ball,
      speed: new THREE.Vector3(
        random(MAX_BALL_SPEED),
        random(MAX_BALL_SPEED),
        random(MAX_BALL_SPEED)
      ),
      mass: 1,
    })
  }

  return { scene, balls }
}

function createAquarium() {
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

  const aquarium = new THREE.Mesh()

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

  const box = (
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
    aquarium.add(mesh)
  }

  box(CB, X_WALL_POSITION, 0, 0, true)
  box(CB, -X_WALL_POSITION, 0, 0, true)
  box(AC, 0, 0, Z_WALL_POSITION, true)
  box(AC, 0, 0, -Z_WALL_POSITION, true)
  box(AB, 0, Y_WALL_POSITION, 0, true)
  box(AB, 0, -Y_WALL_POSITION, 0, true)

  box(B_, X_WALL_POSITION, Y_WALL_POSITION, 0)
  box(B_, X_WALL_POSITION, -Y_WALL_POSITION, 0)
  box(B_, -X_WALL_POSITION, Y_WALL_POSITION, 0)
  box(B_, -X_WALL_POSITION, -Y_WALL_POSITION, 0)

  box(A_, 0, Y_WALL_POSITION, Z_WALL_POSITION)
  box(A_, 0, Y_WALL_POSITION, -Z_WALL_POSITION)
  box(A_, 0, -Y_WALL_POSITION, Z_WALL_POSITION)
  box(A_, 0, -Y_WALL_POSITION, -Z_WALL_POSITION)

  box(C_, X_WALL_POSITION, 0, Z_WALL_POSITION)
  box(C_, X_WALL_POSITION, 0, -Z_WALL_POSITION)
  box(C_, -X_WALL_POSITION, 0, Z_WALL_POSITION)
  box(C_, -X_WALL_POSITION, 0, -Z_WALL_POSITION)

  return aquarium
}

export function collisionWall(ball: SceneBall) {
  const { mesh, speed } = ball

  if (mesh.position.x + speed.x > HALF_A_WITHOUT_BALL) {
    speed.x = -speed.x
  }
  if (mesh.position.x + speed.x < -HALF_A_WITHOUT_BALL) {
    speed.x = -speed.x
  }

  if (mesh.position.y + speed.y > HALF_C_WITHOUT_BALL) {
    speed.y = -speed.y
  }
  if (mesh.position.y + speed.y < -HALF_C_WITHOUT_BALL) {
    speed.y = -speed.y
  }

  if (mesh.position.z + speed.z > HALF_B_WITHOUT_BALL) {
    speed.z = -speed.z
  }
  if (mesh.position.z + speed.z < -HALF_B_WITHOUT_BALL) {
    speed.z = -speed.z
  }
}

const HALF_PI = Math.PI / 2

export function collisionBall(ball1: SceneBall, ball2: SceneBall) {
  const dx = ball2.mesh.position.x - ball1.mesh.position.x
  const dy = ball2.mesh.position.y - ball1.mesh.position.y
  const dz = ball2.mesh.position.z - ball1.mesh.position.z

  const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)

  const radiuses =
    ball1.mesh.geometry.parameters.radius +
    ball2.mesh.geometry.parameters.radius

  if (distance < radiuses) {
    const angle1 = Math.atan2(dz, dx)
    const angle1_ = Math.atan2(dx, dz)
    const angle2 = Math.atan2(dy, dx)
    const angle3 = Math.atan2(dz, dy)

    const v1 = Math.sqrt(
      ball1.speed.x * ball1.speed.x +
        ball1.speed.y * ball1.speed.y +
        ball1.speed.z * ball1.speed.z
    )
    const v2 = Math.sqrt(
      ball2.speed.x * ball2.speed.x +
        ball2.speed.y * ball2.speed.y +
        ball2.speed.z * ball2.speed.z
    )

    ball1.speed.x = Math.cos(angle1 + HALF_PI) * v1
    ball1.speed.y = ball1.speed.y
    ball1.speed.z = Math.sin(angle1 + HALF_PI) * v1

    ball2.speed.x = Math.cos(angle1) * v2
    ball2.speed.y = ball2.speed.y
    ball2.speed.z = Math.sin(angle1) * v2
  }
}
