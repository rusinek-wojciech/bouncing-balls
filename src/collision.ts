import * as THREE from 'three'
import { ENERGY_LOSS_INDICATOR, HALF_A, HALF_B, HALF_C } from './config'
import { SceneBall } from './types'

const nextPosition = new THREE.Vector3()
const relativePosition = new THREE.Vector3()
const relativeSpeed = new THREE.Vector3()

export function collisionBox(b: SceneBall) {
  const { mesh, speed } = b
  nextPosition.copy(mesh.position).add(speed)

  const dx = HALF_A - mesh.geometry.parameters.radius
  if (nextPosition.x > dx || nextPosition.x < -dx) {
    b.speed.multiplyScalar(ENERGY_LOSS_INDICATOR)
    speed.x = -speed.x
  }

  const dy = HALF_C - mesh.geometry.parameters.radius
  if (nextPosition.y > dy || nextPosition.y < -dy) {
    b.speed.multiplyScalar(ENERGY_LOSS_INDICATOR)
    speed.y = -speed.y
  }

  const dz = HALF_B - mesh.geometry.parameters.radius
  if (nextPosition.z > dz || nextPosition.z < -dz) {
    b.speed.multiplyScalar(ENERGY_LOSS_INDICATOR)
    speed.z = -speed.z
  }
}

export function collisionBall(b1: SceneBall, b2: SceneBall) {
  relativePosition.copy(b1.mesh.position).sub(b2.mesh.position)
  relativeSpeed.copy(b1.speed).sub(b2.speed)
  nextPosition.copy(relativePosition).add(relativeSpeed)

  if (
    nextPosition.length() <
    b1.mesh.geometry.parameters.radius + b2.mesh.geometry.parameters.radius
  ) {
    relativePosition.normalize()

    const dot = relativeSpeed.dot(relativePosition)
    relativePosition.multiplyScalar(dot * ENERGY_LOSS_INDICATOR)
    b1.speed.sub(relativePosition)
    b2.speed.add(relativePosition)
  }
}
