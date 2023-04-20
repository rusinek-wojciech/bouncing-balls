import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FOV, NEAR, FAR, CAMERA_POSITION, ORBIT_TARGET } from './config'

const aspect = () => window.innerWidth / window.innerHeight

export function createCamera(renderer: THREE.WebGLRenderer) {
  const camera = new THREE.PerspectiveCamera(FOV, aspect(), NEAR, FAR)
  camera.position.set(...CAMERA_POSITION)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(...ORBIT_TARGET)
  controls.update()

  window.addEventListener(
    'resize',
    () => {
      camera.aspect = aspect()
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    },
    { once: true }
  )

  return camera
}
