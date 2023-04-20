import './style.css'
import WebGL from 'three/examples/jsm/capabilities/WebGL'
import { loadApp } from './app'

window.addEventListener(
  'DOMContentLoaded',
  () => {
    WebGL.isWebGLAvailable()
      ? loadApp()
      : console.error('WebGL is not available')
  },
  { once: true }
)
