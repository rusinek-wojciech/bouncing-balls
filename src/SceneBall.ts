import * as THREE from 'three'
import { from, random } from './utils'
import {
  A,
  B,
  BALL_RADIUS,
  C,
  ENERGY_LOSS_INDICATOR,
  HALF_A,
  HALF_B,
  HALF_C,
  BALL_MAX_SPEED,
  FORCE,
  BALL_MASS,
} from './config'

export class SceneBall {
  private _mesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>
  private _v: THREE.Vector3
  private _F: THREE.Vector3
  private _m: number

  private constructor(
    mesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>,
    v: THREE.Vector3,
    F: THREE.Vector3,
    m: number
  ) {
    this._mesh = mesh
    this._v = v
    this._F = F
    this._m = m
  }

  get position() {
    return this._mesh.position
  }

  get radius() {
    return this._mesh.geometry.parameters.radius
  }

  get mass() {
    return this._m
  }

  velocity(dt: number) {
    return from(this._F).divideScalar(this._m).multiplyScalar(dt).add(this._v)
  }

  next(dt: number) {
    const velocity = this.velocity(dt)
    this._v.copy(velocity)

    const nextPos = velocity.multiplyScalar(dt).add(this.position)
    this.position.copy(nextPos)
  }

  subVelocity(velocity: THREE.Vector3) {
    this._v.sub(velocity)
    this.energyLoss()
  }

  addVelocity(velocity: THREE.Vector3) {
    this._v.add(velocity)
    this.energyLoss()
  }

  energyLoss() {
    this._v.multiplyScalar(ENERGY_LOSS_INDICATOR)
  }

  collisionBox(dt: number) {
    const X = HALF_A - this.radius
    const Y = HALF_C - this.radius
    const Z = HALF_B - this.radius

    const nextPos = this.velocity(dt).multiplyScalar(dt).add(this.position)

    if (nextPos.x > X) {
      this._v.x = -this._v.x
      this.position.set(X, this.position.y, this.position.z)
      this.energyLoss()
    } else if (nextPos.x < -X) {
      this._v.x = -this._v.x
      this.position.set(-X, this.position.y, this.position.z)
      this.energyLoss()
    }
    if (nextPos.y > Y) {
      this._v.y = -this._v.y
      this.position.set(this.position.x, Y, this.position.z)
      this.energyLoss()
    } else if (nextPos.y < -Y) {
      this._v.y = -this._v.y
      this.position.set(this.position.x, -Y, this.position.z)
      this.energyLoss()
    }
    if (nextPos.z > Z) {
      this._v.z = -this._v.z
      this.position.set(this.position.x, this.position.y, Z)
      this.energyLoss()
    } else if (nextPos.z < -Z) {
      this._v.z = -this._v.z
      this.position.set(this.position.x, this.position.y, -Z)
      this.energyLoss()
    }
  }

  collisionBall(ball: SceneBall, dt: number) {
    const relativePos = from(this.position).sub(ball.position)
    const relativeVel = this.velocity(dt).sub(ball.velocity(dt))
    const displacement = from(relativeVel).multiplyScalar(dt)

    if (
      from(relativePos).add(displacement).length() <
      this.radius + ball.radius
    ) {
      const m = this.mass + ball.mass
      const m1 = (2 * ball.mass) / m
      const m2 = (2 * this.mass) / m

      const direction = relativePos.normalize()
      const dot = relativeVel.dot(direction)

      this.subVelocity(from(direction).multiplyScalar(m1 * dot))
      ball.addVelocity(from(direction).multiplyScalar(m2 * dot))
    }
  }

  static create(scene: THREE.Scene) {
    const position = new THREE.Vector3(
      random(A - BALL_RADIUS * 2),
      random(C - BALL_RADIUS * 2),
      random(B - BALL_RADIUS * 2)
    )
    const velocity = new THREE.Vector3(
      random(BALL_MAX_SPEED),
      random(BALL_MAX_SPEED),
      random(BALL_MAX_SPEED)
    )

    const geometry = new THREE.SphereGeometry(BALL_RADIUS)
    const material = new THREE.MeshStandardMaterial({
      color: `hsl(220, ${Math.random() * 100}%, ${Math.random() * 100}%)`,
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = true
    mesh.receiveShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    return new SceneBall(
      mesh,
      velocity,
      new THREE.Vector3(FORCE[0], FORCE[1], FORCE[2]),
      BALL_MASS
    )
  }
}
