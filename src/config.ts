/**
 * area configuration
 */
export const BALL_RADIUS = 0.5
export const BALLS_COUNT = 30

export const A = 10
export const C = 8
export const B = 20

export const WALL_THICKNESS = 0.4
export const MAX_BALL_SPEED = 7.5

export const ENERGY_LOSS = 0.05

/**
 * camera configuration
 */
export const FOV = 60
export const NEAR = 1.0
export const FAR = 1000.0
export const CAMERA_POSITION = [20, 0, 0] as const
export const ORBIT_TARGET = [0, 0, 0] as const

/**
 * do not change
 */
export const HALF_A = A / 2
export const HALF_C = C / 2
export const HALF_B = B / 2
export const HALF_WALL_THICKNESS = WALL_THICKNESS / 2

export const X_WALL_POSITION = HALF_A + HALF_WALL_THICKNESS
export const Y_WALL_POSITION = HALF_C + HALF_WALL_THICKNESS
export const Z_WALL_POSITION = HALF_B + HALF_WALL_THICKNESS

export const ENERGY_LOSS_INDICATOR = 1 - ENERGY_LOSS
