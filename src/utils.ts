import * as THREE from 'three'

export const random = (max: number) => (Math.random() - 0.5) * max
export const from = (v: THREE.Vector3 = new THREE.Vector3()) =>
  new THREE.Vector3().copy(v)
