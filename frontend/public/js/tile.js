// import * as THREE from 'three'

///////////// orbit

;(THREE.OrbitControls = function (e, t) {
  var n, o, a, i, r
  ;(this.object = e),
    (this.domElement = void 0 !== t ? t : document),
    (this.enabled = !0),
    (this.target = new THREE.Vector3()),
    (this.minDistance = 0),
    (this.maxDistance = 1 / 0),
    (this.minZoom = 0),
    (this.maxZoom = 1 / 0),
    (this.minPolarAngle = 0),
    (this.maxPolarAngle = Math.PI),
    (this.minAzimuthAngle = -1 / 0),
    (this.maxAzimuthAngle = 1 / 0),
    (this.enableDamping = !1),
    (this.dampingFactor = 0.25),
    (this.enableZoom = !0),
    (this.zoomSpeed = 1),
    (this.enableRotate = !0),
    (this.rotateSpeed = 1),
    (this.enablePan = !0),
    (this.panSpeed = 1),
    (this.screenSpacePanning = !1),
    (this.keyPanSpeed = 7),
    (this.autoRotate = !1),
    (this.autoRotateSpeed = 2),
    (this.enableKeys = !0),
    (this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 }),
    (this.mouseButtons = {
      LEFT: THREE.MOUSE.LEFT,
      MIDDLE: THREE.MOUSE.MIDDLE,
      RIGHT: THREE.MOUSE.RIGHT,
    }),
    (this.target0 = this.target.clone()),
    (this.position0 = this.object.position.clone()),
    (this.zoom0 = this.object.zoom),
    (this.getPolarAngle = function () {
      return h.phi
    }),
    (this.getAzimuthalAngle = function () {
      return h.theta
    }),
    (this.saveState = function () {
      s.target0.copy(s.target),
        s.position0.copy(s.object.position),
        (s.zoom0 = s.object.zoom)
    }),
    (this.reset = function () {
      s.target.copy(s.target0),
        s.object.position.copy(s.position0),
        (s.object.zoom = s.zoom0),
        s.object.updateProjectionMatrix(),
        s.dispatchEvent(c),
        s.update(),
        (d = u.NONE)
    }),
    (this.update =
      ((n = new THREE.Vector3()),
      (o = new THREE.Quaternion().setFromUnitVectors(
        e.up,
        new THREE.Vector3(0, 1, 0)
      )),
      (a = o.clone().inverse()),
      (i = new THREE.Vector3()),
      (r = new THREE.Quaternion()),
      function () {
        var e = s.object.position
        return (
          n.copy(e).sub(s.target),
          n.applyQuaternion(o),
          h.setFromVector3(n),
          s.autoRotate &&
            d === u.NONE &&
            M(((2 * Math.PI) / 60 / 60) * s.autoRotateSpeed),
          (h.theta += E.theta),
          (h.phi += E.phi),
          (h.theta = Math.max(
            s.minAzimuthAngle,
            Math.min(s.maxAzimuthAngle, h.theta)
          )),
          (h.phi = Math.max(s.minPolarAngle, Math.min(s.maxPolarAngle, h.phi))),
          h.makeSafe(),
          (h.radius *= b),
          (h.radius = Math.max(
            s.minDistance,
            Math.min(s.maxDistance, h.radius)
          )),
          s.target.add(f),
          n.setFromSpherical(h),
          n.applyQuaternion(a),
          e.copy(s.target).add(n),
          s.object.lookAt(s.target),
          !0 === s.enableDamping
            ? ((E.theta *= 1 - s.dampingFactor),
              (E.phi *= 1 - s.dampingFactor),
              f.multiplyScalar(1 - s.dampingFactor))
            : (E.set(0, 0, 0), f.set(0, 0, 0)),
          (b = 1),
          !!(
            g ||
            i.distanceToSquared(s.object.position) > p ||
            8 * (1 - r.dot(s.object.quaternion)) > p
          ) &&
            (s.dispatchEvent(c),
            i.copy(s.object.position),
            r.copy(s.object.quaternion),
            (g = !1),
            !0)
        )
      })),
    (this.dispose = function () {
      s.domElement.removeEventListener('contextmenu', _, !1),
        s.domElement.removeEventListener('mousedown', U, !1),
        s.domElement.removeEventListener('wheel', z, !1),
        s.domElement.removeEventListener('touchstart', I, !1),
        s.domElement.removeEventListener('touchend', K, !1),
        s.domElement.removeEventListener('touchmove', X, !1),
        document.removeEventListener('mousemove', Y, !1),
        document.removeEventListener('mouseup', Z, !1),
        window.removeEventListener('keydown', F, !1)
    })
  var s = this,
    c = { type: 'change' },
    l = { type: 'start' },
    m = { type: 'end' },
    u = {
      NONE: -1,
      ROTATE: 0,
      DOLLY: 1,
      PAN: 2,
      TOUCH_ROTATE: 3,
      TOUCH_DOLLY_PAN: 4,
    },
    d = u.NONE,
    p = 1e-6,
    h = new THREE.Spherical(),
    E = new THREE.Spherical(),
    b = 1,
    f = new THREE.Vector3(),
    g = !1,
    T = new THREE.Vector2(),
    v = new THREE.Vector2(),
    y = new THREE.Vector2(),
    R = new THREE.Vector2(),
    O = new THREE.Vector2(),
    H = new THREE.Vector2(),
    w = new THREE.Vector2(),
    P = new THREE.Vector2(),
    j = new THREE.Vector2()
  function L() {
    return Math.pow(0.95, s.zoomSpeed)
  }
  function M(e) {
    E.theta -= e
  }
  function C(e) {
    E.phi -= e
  }
  var N,
    S =
      ((N = new THREE.Vector3()),
      function (e, t) {
        N.setFromMatrixColumn(t, 0), N.multiplyScalar(-e), f.add(N)
      }),
    A = (function () {
      var e = new THREE.Vector3()
      return function (t, n) {
        !0 === s.screenSpacePanning
          ? e.setFromMatrixColumn(n, 1)
          : (e.setFromMatrixColumn(n, 0), e.crossVectors(s.object.up, e)),
          e.multiplyScalar(t),
          f.add(e)
      }
    })(),
    D = (function () {
      var e = new THREE.Vector3()
      return function (t, n) {
        var o = s.domElement === document ? s.domElement.body : s.domElement
        if (s.object.isPerspectiveCamera) {
          var a = s.object.position
          e.copy(a).sub(s.target)
          var i = e.length()
          ;(i *= Math.tan(((s.object.fov / 2) * Math.PI) / 180)),
            S((2 * t * i) / o.clientHeight, s.object.matrix),
            A((2 * n * i) / o.clientHeight, s.object.matrix)
        } else
          s.object.isOrthographicCamera
            ? (S(
                (t * (s.object.right - s.object.left)) /
                  s.object.zoom /
                  o.clientWidth,
                s.object.matrix
              ),
              A(
                (n * (s.object.top - s.object.bottom)) /
                  s.object.zoom /
                  o.clientHeight,
                s.object.matrix
              ))
            : (console.warn(
                'WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.'
              ),
              (s.enablePan = !1))
      }
    })()
  function x(e) {
    s.object.isPerspectiveCamera
      ? (b /= e)
      : s.object.isOrthographicCamera
      ? ((s.object.zoom = Math.max(
          s.minZoom,
          Math.min(s.maxZoom, s.object.zoom * e)
        )),
        s.object.updateProjectionMatrix(),
        (g = !0))
      : (console.warn(
          'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.'
        ),
        (s.enableZoom = !1))
  }
  function k(e) {
    s.object.isPerspectiveCamera
      ? (b *= e)
      : s.object.isOrthographicCamera
      ? ((s.object.zoom = Math.max(
          s.minZoom,
          Math.min(s.maxZoom, s.object.zoom / e)
        )),
        s.object.updateProjectionMatrix(),
        (g = !0))
      : (console.warn(
          'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.'
        ),
        (s.enableZoom = !1))
  }
  function V(e) {
    R.set(e.clientX, e.clientY)
  }
  function U(e) {
    if (!1 !== s.enabled) {
      switch (
        (e.preventDefault(),
        s.domElement.focus ? s.domElement.focus() : window.focus(),
        e.button)
      ) {
        case s.mouseButtons.LEFT:
          if (e.ctrlKey || e.metaKey || e.shiftKey) {
            if (!1 === s.enablePan) return
            V(e), (d = u.PAN)
          } else {
            if (!1 === s.enableRotate) return
            !(function (e) {
              T.set(e.clientX, e.clientY)
            })(e),
              (d = u.ROTATE)
          }
          break
        case s.mouseButtons.MIDDLE:
          if (!1 === s.enableZoom) return
          !(function (e) {
            w.set(e.clientX, e.clientY)
          })(e),
            (d = u.DOLLY)
          break
        case s.mouseButtons.RIGHT:
          if (!1 === s.enablePan) return
          V(e), (d = u.PAN)
      }
      d !== u.NONE &&
        (document.addEventListener('mousemove', Y, !1),
        document.addEventListener('mouseup', Z, !1),
        s.dispatchEvent(l))
    }
  }
  function Y(e) {
    if (!1 !== s.enabled)
      switch ((e.preventDefault(), d)) {
        case u.ROTATE:
          if (!1 === s.enableRotate) return
          !(function (e) {
            v.set(e.clientX, e.clientY),
              y.subVectors(v, T).multiplyScalar(s.rotateSpeed)
            var t = s.domElement === document ? s.domElement.body : s.domElement
            M((2 * Math.PI * y.x) / t.clientHeight),
              C((2 * Math.PI * y.y) / t.clientHeight),
              T.copy(v),
              s.update()
          })(e)
          break
        case u.DOLLY:
          if (!1 === s.enableZoom) return
          !(function (e) {
            P.set(e.clientX, e.clientY),
              j.subVectors(P, w),
              j.y > 0 ? x(L()) : j.y < 0 && k(L()),
              w.copy(P),
              s.update()
          })(e)
          break
        case u.PAN:
          if (!1 === s.enablePan) return
          !(function (e) {
            O.set(e.clientX, e.clientY),
              H.subVectors(O, R).multiplyScalar(s.panSpeed),
              D(H.x, H.y),
              R.copy(O),
              s.update()
          })(e)
      }
  }
  function Z(e) {
    !1 !== s.enabled &&
      (document.removeEventListener('mousemove', Y, !1),
      document.removeEventListener('mouseup', Z, !1),
      s.dispatchEvent(m),
      (d = u.NONE))
  }
  function z(e) {
    !1 === s.enabled ||
      !1 === s.enableZoom ||
      (d !== u.NONE && d !== u.ROTATE) ||
      (e.preventDefault(),
      e.stopPropagation(),
      s.dispatchEvent(l),
      (function (e) {
        e.deltaY < 0 ? k(L()) : e.deltaY > 0 && x(L()), s.update()
      })(e),
      s.dispatchEvent(m))
  }
  function F(e) {
    !1 !== s.enabled &&
      !1 !== s.enableKeys &&
      !1 !== s.enablePan &&
      (function (e) {
        var t = !1
        switch (e.keyCode) {
          case s.keys.UP:
            D(0, s.keyPanSpeed), (t = !0)
            break
          case s.keys.BOTTOM:
            D(0, -s.keyPanSpeed), (t = !0)
            break
          case s.keys.LEFT:
            D(s.keyPanSpeed, 0), (t = !0)
            break
          case s.keys.RIGHT:
            D(-s.keyPanSpeed, 0), (t = !0)
        }
        t && (e.preventDefault(), s.update())
      })(e)
  }
  function I(e) {
    if (!1 !== s.enabled) {
      switch ((e.preventDefault(), e.touches.length)) {
        case 1:
          if (!1 === s.enableRotate) return
          !(function (e) {
            T.set(e.touches[0].pageX, e.touches[0].pageY)
          })(e),
            (d = u.TOUCH_ROTATE)
          break
        case 2:
          if (!1 === s.enableZoom && !1 === s.enablePan) return
          !(function (e) {
            if (s.enableZoom) {
              var t = e.touches[0].pageX - e.touches[1].pageX,
                n = e.touches[0].pageY - e.touches[1].pageY,
                o = Math.sqrt(t * t + n * n)
              w.set(0, o)
            }
            if (s.enablePan) {
              var a = 0.5 * (e.touches[0].pageX + e.touches[1].pageX),
                i = 0.5 * (e.touches[0].pageY + e.touches[1].pageY)
              R.set(a, i)
            }
          })(e),
            (d = u.TOUCH_DOLLY_PAN)
          break
        default:
          d = u.NONE
      }
      d !== u.NONE && s.dispatchEvent(l)
    }
  }
  function X(e) {
    if (!1 !== s.enabled)
      switch ((e.preventDefault(), e.stopPropagation(), e.touches.length)) {
        case 1:
          if (!1 === s.enableRotate) return
          if (d !== u.TOUCH_ROTATE) return
          !(function (e) {
            v.set(e.touches[0].pageX, e.touches[0].pageY),
              y.subVectors(v, T).multiplyScalar(s.rotateSpeed)
            var t = s.domElement === document ? s.domElement.body : s.domElement
            M((2 * Math.PI * y.x) / t.clientHeight),
              C((2 * Math.PI * y.y) / t.clientHeight),
              T.copy(v),
              s.update()
          })(e)
          break
        case 2:
          if (!1 === s.enableZoom && !1 === s.enablePan) return
          if (d !== u.TOUCH_DOLLY_PAN) return
          !(function (e) {
            if (s.enableZoom) {
              var t = e.touches[0].pageX - e.touches[1].pageX,
                n = e.touches[0].pageY - e.touches[1].pageY,
                o = Math.sqrt(t * t + n * n)
              P.set(0, o),
                j.set(0, Math.pow(P.y / w.y, s.zoomSpeed)),
                x(j.y),
                w.copy(P)
            }
            if (s.enablePan) {
              var a = 0.5 * (e.touches[0].pageX + e.touches[1].pageX),
                i = 0.5 * (e.touches[0].pageY + e.touches[1].pageY)
              O.set(a, i),
                H.subVectors(O, R).multiplyScalar(s.panSpeed),
                D(H.x, H.y),
                R.copy(O)
            }
            s.update()
          })(e)
          break
        default:
          d = u.NONE
      }
  }
  function K(e) {
    !1 !== s.enabled && (s.dispatchEvent(m), (d = u.NONE))
  }
  function _(e) {
    !1 !== s.enabled && e.preventDefault()
  }
  s.domElement.addEventListener('contextmenu', _, !1),
    s.domElement.addEventListener('mousedown', U, !1),
    s.domElement.addEventListener('wheel', z, !1),
    s.domElement.addEventListener('touchstart', I, !1),
    s.domElement.addEventListener('touchend', K, !1),
    s.domElement.addEventListener('touchmove', X, !1),
    window.addEventListener('keydown', F, !1),
    this.update()
}),
  (THREE.OrbitControls.prototype = Object.create(
    THREE.EventDispatcher.prototype
  )),
  (THREE.OrbitControls.prototype.constructor = THREE.OrbitControls),
  Object.defineProperties(THREE.OrbitControls.prototype, {
    center: {
      get: function () {
        return (
          console.warn(
            'THREE.OrbitControls: .center has been renamed to .target'
          ),
          this.target
        )
      },
    },
    noZoom: {
      get: function () {
        return (
          console.warn(
            'THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead.'
          ),
          !this.enableZoom
        )
      },
      set: function (e) {
        console.warn(
          'THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead.'
        ),
          (this.enableZoom = !e)
      },
    },
    noRotate: {
      get: function () {
        return (
          console.warn(
            'THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead.'
          ),
          !this.enableRotate
        )
      },
      set: function (e) {
        console.warn(
          'THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead.'
        ),
          (this.enableRotate = !e)
      },
    },
    noPan: {
      get: function () {
        return (
          console.warn(
            'THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead.'
          ),
          !this.enablePan
        )
      },
      set: function (e) {
        console.warn(
          'THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead.'
        ),
          (this.enablePan = !e)
      },
    },
    noKeys: {
      get: function () {
        return (
          console.warn(
            'THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead.'
          ),
          !this.enableKeys
        )
      },
      set: function (e) {
        console.warn(
          'THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead.'
        ),
          (this.enableKeys = !e)
      },
    },
    staticMoving: {
      get: function () {
        return (
          console.warn(
            'THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead.'
          ),
          !this.enableDamping
        )
      },
      set: function (e) {
        console.warn(
          'THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead.'
        ),
          (this.enableDamping = !e)
      },
    },
    dynamicDampingFactor: {
      get: function () {
        return (
          console.warn(
            'THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead.'
          ),
          this.dampingFactor
        )
      },
      set: function (e) {
        console.warn(
          'THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead.'
        ),
          (this.dampingFactor = e)
      },
    },
  })

////////

/////////// cloth
/*
 * Cloth Simulation using a relaxed constraints solver
 */

// Suggested Readings

// Advanced Character Physics by Thomas Jakobsen Character
// http://freespace.virgin.net/hugo.elias/models/m_cloth.htm
// http://en.wikipedia.org/wiki/Cloth_modeling
// http://cg.alexandra.dk/tag/spring-mass-system/
// Real-time Cloth Animation http://www.darwin3d.com/gamedev/articles/col0599.pdf

//var DAMPING = 0.0278;
var DAMPING = 0.01378
var DRAG = 1 - DAMPING // 1
var MASS = 0.2
var restDistance = 10

var xSegs = 150
var ySegs = 50

const clothFunction = plane(restDistance * xSegs, restDistance * ySegs)

const cloth = new Cloth(xSegs, ySegs)

var GRAVITY = 981 * 1.4
var gravity = new THREE.Vector3(0, -GRAVITY, 0).multiplyScalar(MASS)

var TIMESTEP = 24 / 1000 // 18
var TIMESTEP_SQ = TIMESTEP * TIMESTEP

var pins = []

var wind = true
var windStrength = 20

const windForce = new THREE.Vector3(0, 0, 0)

var ballPosition = new THREE.Vector3(0, -45, 0)
var ballSize = 100 //40

var tmpForce = new THREE.Vector3()
var lastTime

var sphere
function createSphere() {}

function plane(width, height) {
  return function (u, v, target) {
    var x = (u - 0.5) * width
    var y = (v + 0.5) * height
    var z = 0

    target.set(x, y, z)
  }
}

function Particle(x, y, z, mass) {
  this.position = new THREE.Vector3()
  this.previous = new THREE.Vector3()
  this.original = new THREE.Vector3()
  this.a = new THREE.Vector3(0, 0, 0) // acceleration
  this.mass = mass
  this.invMass = 1 / mass
  this.tmp = new THREE.Vector3()
  this.tmp2 = new THREE.Vector3()

  // init

  clothFunction(x, y, this.position) // position
  clothFunction(x, y, this.previous) // previous
  clothFunction(x, y, this.original)
}

// Force -> Acceleration

Particle.prototype.addForce = function (force) {
  this.a.add(this.tmp2.copy(force).multiplyScalar(this.invMass))
}

Particle.prototype.lockToOriginal = function (increase) {
  this.position.copy(this.original)
  this.previous.copy(this.original)

  this.position.multiplyScalar(1.3)
  this.previous.multiplyScalar(1.3)

  //  this.position.multiplyScalar(1)
  //  this.previous.multiplyScalar(1)

  /*  
      if (increase) {
        this.position.y = 0 
        this.previous.y = 0 
      } else {
    */
  this.position.z = this.original.y
  this.previous.z = this.original.y
  this.position.y = 0
  this.previous.y = 0
}
Particle.prototype.pinToBottom = function () {
  this.position.copy(this.original)
  this.previous.copy(this.original)

  this.position.y = -900
  this.previous.y = -900
}

// Performs Verlet integration

Particle.prototype.integrate = function (timesq) {
  var newPos = this.tmp.subVectors(this.position, this.previous)
  newPos.multiplyScalar(DRAG).add(this.position)
  newPos.add(this.a.multiplyScalar(timesq))

  this.tmp = this.previous
  this.previous = this.position
  this.position = newPos

  this.a.set(0, 0, 0)
}

var diff = new THREE.Vector3()

function repelParticles(p1, p2, distance) {
  diff.subVectors(p2.position, p1.position)
  var currentDist = diff.length()
  if (currentDist == 0) return // prevents division by 0
  if (currentDist < distance) {
    var correction = diff.multiplyScalar((currentDist - distance) / currentDist)
    var correctionHalf = correction.multiplyScalar(0.5)
    p1.position.add(correctionHalf)
    p2.position.sub(correctionHalf)
  }
}

function satisfyConstraints(p1, p2, distance) {
  diff.subVectors(p2.position, p1.position)
  var currentDist = diff.length()
  if (currentDist === 0) return // prevents division by 0
  var correction = diff.multiplyScalar(1 - distance / currentDist)
  var correctionHalf = correction.multiplyScalar(0.5)
  p1.position.add(correctionHalf)
  p2.position.sub(correctionHalf)
}

function Cloth(w, h) {
  w = w || 10
  h = h || 10
  this.w = w
  this.h = h

  var particles = []
  var constraints = []

  var u, v

  // Create particles
  for (v = 0; v <= h; v++) {
    for (u = 0; u <= w; u++) {
      particles.push(new Particle(u / w, v / h, 0, MASS))
    }
  }

  // Structural

  for (v = 0; v < h; v++) {
    for (u = 0; u < w; u++) {
      constraints.push([
        particles[index(u, v)],
        particles[index(u, v + 1)],
        restDistance,
      ])

      constraints.push([
        particles[index(u, v)],
        particles[index(u + 1, v)],
        restDistance,
      ])
    }
  }

  for (u = w, v = 0; v < h; v++) {
    constraints.push([
      particles[index(u, v)],
      particles[index(u, v + 1)],
      restDistance,
    ])
  }

  for (v = h, u = 0; u < w; u++) {
    constraints.push([
      particles[index(u, v)],
      particles[index(u + 1, v)],
      restDistance,
    ])
  }

  // While many systems use shear and bend springs,
  // the relaxed constraints model seems to be just fine
  // using structural springs.
  // Shear
  //  var diagonalDist = Math.sqrt(restDistance * restDistance * 2);
  //   for (v=0;v<h;v++) {
  //    for (u=0;u<w;u++) {

  //      constraints.push([
  //        particles[index(u, v)],
  //        particles[index(u+1, v+1)],
  //        diagonalDist
  //      ]);

  //      constraints.push([
  //        particles[index(u+1, v)],
  //        particles[index(u, v+1)],
  //        diagonalDist
  //      ]);

  //    }
  //   }

  this.particles = particles
  this.constraints = constraints

  function index(u, v) {
    return u + v * (w + 1)
  }

  this.index = index
}

var avoidClothSelfIntersection = true
const simulate = (
  time,
  clothGeometry,
  pins,
  windForce,
  mousex,
  mousey,
  windStrength
) => {
  if (!lastTime) {
    lastTime = time
    return
  }

  var p_i, i, il, particles, particle, pt, constraints, constraint

  // Aerodynamics forces

  if (wind) {
    var indx
    var normal = new THREE.Vector3()

    var indices = clothGeometry.index
    var normals = clothGeometry.attributes.normal

    particles = cloth.particles

    for (i = 0, il = indices.count; i < il; i += 3) {
      for (let j = 0; j < 3; j++) {
        indx = indices.getX(i + j)
        normal.fromBufferAttribute(normals, indx)
        tmpForce.copy(normal).normalize().multiplyScalar(normal.dot(windForce))
        particles[indx].addForce(tmpForce)
      }
    }
  }

  for (particles = cloth.particles, i = 0, il = particles.length; i < il; i++) {
    particle = particles[i]
    particle.addForce(gravity)

    particle.integrate(TIMESTEP_SQ)
  }

  // Start Constraints

  constraints = cloth.constraints
  il = constraints.length

  for (i = 0; i < il; i++) {
    constraint = constraints[i]
    satisfyConstraints(constraint[0], constraint[1], constraint[2])
  }

  // Ball Constraints
  /*
        ballPosition.z = - Math.sin( Date.now() / 600 ) * 20; //+ 40;
        ballPosition.x = Math.cos( Date.now() / 400 ) * 20;
    
        sphere.position.x = ballPosition.x
        sphere.position.z = ballPosition.z
    
      if (sphere.length && sphere.visible ) {
        for ( particles = cloth.particles, i = 0, il = particles.length; i < il; i ++ ) {
    
          particle = particles[ i ];
          var pos = particle.position;
          diff.subVectors( pos, ballPosition );
          if ( diff.length() < ballSize ) {
    
            // collided
            diff.normalize().multiplyScalar( ballSize );
            pos.copy( ballPosition ).add( diff );
    
          }
    
        }
    
      }
    */

  // Floor Constraints

  for (particles = cloth.particles, i = 0, il = particles.length; i < il; i++) {
    particle = particles[i]
    let pos = particle.position
    if (pos.y < -1000) {
      pos.y = -1000
    } else if (pos.y > 150) {
      //pos.y = 150
    }

    //if (pos.x < -720) {
    // pos.x = -720
    //}
  }

  // Pin Constraints

  for (i = 0, il = xSegs - 1; i < il; i++) {
    // var o = pins[i]
    var p = particles[i]
    p.lockToOriginal()

    var d = particles[particles.length - i]
    if (d) d.pinToBottom()
  }
}

/////////////

// var OrbitControls = require('three-orbit-controls')(THREE)
const container = document.getElementById('main')

class Moon {
  constructor() {
    this.bum = 'yo'
    this.mousex = 0
    this.mousey = 0
    this.running = true
  }

  init() {
    try {
      this.setupRenderer()
    } catch (err) {
      throw err
    }
    this.setupScene()
    this.setupCamera()
    this.setupLight()
    this.setupCloth()
    this.setupEventListeners()

    // this.controls = new OrbitControls(this.camera)
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: false,
      preserveDrawingBuffer: false,
      alpha: false,
      powerPreference: 'high-performance',
      failIfMajorPerformanceCaveat: true,
    })
    //    this.renderer.setPixelRatio(window.devicePixelRatio / 3)
    const minPixelRatio = 1
    const divisibleBy = window.innerWidth >= 700 ? 1.5 : 2.6
    const pixelRatio = window.devicePixelRatio / divisibleBy

    //    this.renderer.setPixelRatio(window.devicePixelRatio / 3)
    this.renderer.setPixelRatio(pixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)

    container.appendChild(this.renderer.domElement)

    this.renderer.gammaInput = true
    this.renderer.gammaFactor = 2.4
    this.renderer.gammaOutput = true
    this.renderer.shadowMap.enabled = true
  }

  setupScene() {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0xf8f6f1)
  }

  setupCamera() {
    this.camera = new THREE.PerspectiveCamera(
      14,
      window.innerWidth / window.innerHeight,
      1,
      5000
    )
    this.camera.position.set(-120, -400, 2050)
  }

  setupLight() {
    //    this.scene.add( new THREE.AmbientLight(0x706c60, 1))
    let distance = 300
    this.light0 = new THREE.DirectionalLight(0xe6e2dc, 1)
    //   this.light0 = new THREE.SpotLight(0xffffff, 1)
    this.light0.position.set(0, 0, 800)
    this.light0.position.multiplyScalar(3)
    this.light0.castShadow = true
    var light = new THREE.HemisphereLight(0xffffff, 0x000000, 2)

    this.scene.add(light)
    var helper = new THREE.HemisphereLightHelper(light, 5)

    //this.scene.add( helper );

    this.light1 = new THREE.SpotLight(0xff0000, 1)
    this.light1.position.set(-30, -700, 900)
    this.light1.castShadow = true

    //    this.scene.add(this.light1)
    this.scene.add(this.light0)
  }

  setupCloth() {
    this.pinsFormation = []
    this.pins = [1]

    this.pinsFormation.push(this.pins)

    this.loader = new THREE.TextureLoader()
    const base64Image =

    this.clothTexture = this.loader.load(base64Image, (tex) => {
      // this.clothTexture = this.loader.load('./tile3x.jpg', tex => {
    })

    this.clothTexture.wrapS = THREE.RepeatWrapping
    this.clothTexture.wrapT = THREE.RepeatWrapping
    this.clothTexture.repeat.set(6.5, 6.5)

    // this.clothTexture.anisotropy = 16

    this.clothMaterial = new THREE.MeshStandardMaterial({
      //this.clothMaterial = new THREE.MeshLambertMaterial({
      //      color: 0xf3efe8,
      //      wireframe: true,
      //      color: 0xe6e2dc,
      color: 0xc7c4be,
      map: this.clothTexture,
      roughness: 0.8,
      metalness: 0.5,
      side: THREE.BackSide,
      //  emissive: 0xffffff,
      //  emissiveIntensity: 0.1
    })

    this.clothMaterial.color.convertSRGBToLinear()

    this.clothGeometry = new THREE.ParametricBufferGeometry(
      clothFunction,
      cloth.w,
      cloth.h
    )

    this.clothMesh = new THREE.Mesh(this.clothGeometry, this.clothMaterial)
    this.clothMesh.position.set(0, 0, 0)
    //    this.clothMesh.ex = 0.8
    // this.clothMesh.rotation.x = 2
    // this.clothMesh.rotation.y = 1.6

    // this.camera.lookAt(this.clothMesh.position)

    //    this.clothMesh.castShadow = true
    //    this.clothMesh.receiveShadow = true
    this.scene.add(this.clothMesh)

    // this.clothMesh.customDepthMaterial = new THREE.MeshDepthMaterial({
    //   depthPacking: THREE.RGBADepthPacking,
    //   map: this.clothTexture,
    //   alphaTest: 0.5
    // })
  }

  setupSphere() {
    let geo = new THREE.SphereBufferGeometry(10, 100, 100)
    let mat = new THREE.MeshBasicMaterial({ color: 0xff0000 })
    let sphere = new THREE.Mesh(geo, mat)
    this.sphere = sphere
    this.scene.add(this.sphere)
  }

  setupEventListeners() {
    let that = this

    window.addEventListener('resize', (e) => {
      this.camera.aspect = window.innerWidth / window.innerHeight

      const divisibleBy = window.innerWidth >= 700 ? 1.5 : 2.6
      const pixelRatio = window.devicePixelRatio / divisibleBy

      //    this.renderer.setPixelRatio(window.devicePixelRatio / 3)
      this.renderer.setPixelRatio(pixelRatio)
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(window.innerWidth, window.innerHeight)
    })

    window.addEventListener('mousemove', (e) => {
      const mousePos = this.onMouseMove(e)
      that.mousex = mousePos.x
      that.mousey = mousePos.y
    })
  }

  onMousePress(e) {
    this.mousePressed = true
  }

  onMouseRelease(e) {}

  onMouseMove(e) {
    let mousex = (e.clientX / window.innerWidth) * 2 - 1
    let mousey = (e.clientY / window.innerHeight) * -2 + 1
    return {
      x: mousex,
      y: mousey,
    }
  }

  update() {
    let time = Date.now()
    let windStrength = Math.cos(time / 10000) * 10 + 60

    //////// adjust wind force, 4 Chris
    // windowForce.set(x, y, z) -> these affect the wind direction in their coordinates
    // mousex is normalized, the left part of the screen = -1, center = 0, right side = 1
    // x and z are affected by mouse position
    // Increase (x) multiplier (example * 0.3) to have more drastic wind adjustment on x axis
    //
    // Also look for DAMPING variable which affects how light the fabric is and how much movement.
    // Lower number = lighter,
    // Higher number = heavier
    //
    // windForce.multiplyScalar(windStrength) below
    // This function multiplies the windForce(x, y, z) by cosine function that
    // changes from -1 to 1 to simulate movement.
    /////////
    windForce.set(
      -(-this.mousex) * 4.2,
      Math.cos(time / 3000) * -this.mousex,
      this.mousey * 0.8
    )

    windForce.normalize()
    windForce.multiplyScalar(windStrength)
    simulate(
      time,
      this.clothGeometry,
      this.pins,
      windForce,
      this.mousey,
      this.mousex,
      windStrength
    )

    this.render()
  }

  render() {
    let p = cloth.particles

    let il = p.length
    for (let i = 0; i < il; i++) {
      let v = p[i].position
      this.clothGeometry.attributes.position.setXYZ(i, v.x, v.y, v.z)
    }

    this.clothGeometry.attributes.position.needsUpdate = true

    this.clothGeometry.verticesNeedUpdate = true
    //    this.clothGeometry.computeFaceNormals()
    this.clothGeometry.computeVertexNormals()

    //   this.clothMesh.rotation.y = this.mousex * 2

    // this.controls.update()
    this.renderer.render(this.scene, this.camera)
  }
}

function setupMoon() {
  const x = new Moon()
  x.init()
  render()

  setTimeout(() => {
    document.querySelector('canvas').classList.add('active')
  }, 2200)

  function render() {
    window.requestAnimationFrame(render)
    x.update()
  }

  window.stopRendering = function () {
    window.cancelAnimationFrame(render)
  }
}

setupMoon()