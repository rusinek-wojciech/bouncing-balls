import * as THREE from 'three'
import { from } from './utils'

export class SceneBall {
  private _mesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>
  private _v: THREE.Vector3
  private _F: THREE.Vector3
  private _m: number

  private constructor(
    mesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>,
    v: THREE.Vector3 = new THREE.Vector3(0, 0, 0),
    F: THREE.Vector3 = new THREE.Vector3(0, 0, 0),
    m: number = 1
  ) {
    this._mesh = mesh
    this._v = v
    this._F = F
    this._m = m
  }

  public static create(
    scene: THREE.Scene,
    position: THREE.Vector3,
    velocity: THREE.Vector3,
    radius: number
  ) {
    const geometry = new THREE.SphereGeometry(radius)
    const material = new THREE.MeshStandardMaterial({
      color: `hsl(220, ${Math.random() * 100}%, ${Math.random() * 100}%)`,
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = true
    mesh.receiveShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    return new SceneBall(mesh, velocity)
  }

  get position() {
    return this._mesh.position
  }

  velocity(dt: number) {
    return from(this._F).divideScalar(this._m).multiplyScalar(dt).add(this._v)
  }

  nextPosition(dt: number) {
    return this.velocity(dt).multiplyScalar(dt).add(this.position)
  }

  setNextPosition(dt: number) {
    this._mesh.position.copy(this.nextPosition(dt))
  }

  bounceX(loss: number = 1.0) {
    this._v.multiplyScalar(loss)
    this._v.x = -this._v.x
  }

  bounceY(loss: number = 1.0) {
    this._v.multiplyScalar(loss)
    this._v.y = -this._v.y
  }

  bounceZ(loss: number = 1.0) {
    this._v.multiplyScalar(loss)
    this._v.z = -this._v.z
  }

  get radius() {
    return this._mesh.geometry.parameters.radius
  }

  get v() {
    return this._v
  }

  subVelocity(velocity: THREE.Vector3) {
    this._v.sub(velocity)
  }

  addVelocity(velocity: THREE.Vector3) {
    this._v.add(velocity)
  }

  get m() {
    return this._m
  }
}
