import { ENERGY_LOSS_INDICATOR, HALF_A, HALF_B, HALF_C } from './config'
import { SceneBall } from './SceneBall'
import { from } from './utils'

export function collisionBox(ball: SceneBall, dt: number) {
  const X = HALF_A - ball.radius
  const Y = HALF_C - ball.radius
  const Z = HALF_B - ball.radius

  const nextPos = ball.nextPosition(dt)

  if (nextPos.x > X || nextPos.x < -X) {
    ball.bounceX(ENERGY_LOSS_INDICATOR)
  }
  if (nextPos.y > Y || nextPos.y < -Y) {
    ball.bounceY(ENERGY_LOSS_INDICATOR)
  }
  if (nextPos.z > Z || nextPos.z < -Z) {
    ball.bounceZ(ENERGY_LOSS_INDICATOR)
  }
}

export function collisionBall(b1: SceneBall, b2: SceneBall, dt: number) {
  const relativePos = from(b1.position).sub(b2.position)
  const relativeVel = b1.velocity(dt).sub(b2.velocity(dt))
  const displacement = from(relativeVel).multiplyScalar(dt)

  if (from(relativePos).add(displacement).length() < b1.radius + b2.radius) {
    const m = b1.m + b2.m
    const m1 = (2 * b2.m) / m
    const m2 = (2 * b1.m) / m

    const direction = relativePos.normalize()
    const dot = relativeVel.dot(direction)

    b1.subVelocity(
      from(direction).multiplyScalar(m1 * dot * ENERGY_LOSS_INDICATOR)
    )
    b2.addVelocity(
      from(direction).multiplyScalar(m2 * dot * ENERGY_LOSS_INDICATOR)
    )
  }
}
