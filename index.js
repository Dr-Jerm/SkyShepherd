webpackJsonp([0,2],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(THREE) {'use strict';
	
	var _Scene = __webpack_require__(2);
	
	var _Scene2 = _interopRequireDefault(_Scene);
	
	var _Scene3 = __webpack_require__(17);
	
	var _Scene4 = _interopRequireDefault(_Scene3);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/* global WEBVR */
	/* global THREE */
	if (WEBVR.isAvailable() === false) {
	  // document.body.appendChild(WEBVR.getMessage());
	}
	
	var scene = void 0;
	var webGLRenderer = void 0;
	var vrRenderer = void 0;
	var renderer = void 0;
	
	var init = function init() {
	  var container = document.createElement('div');
	  document.body.appendChild(container);
	
	  webGLRenderer = new THREE.WebGLRenderer({ antialias: true });
	  webGLRenderer.setPixelRatio(window.devicePixelRatio);
	  webGLRenderer.setSize(window.innerWidth, window.innerHeight);
	  webGLRenderer.shadowMap.enabled = true;
	  webGLRenderer.gammaInput = true;
	  webGLRenderer.gammaOutput = true;
	  container.appendChild(webGLRenderer.domElement);
	  if (WEBVR.isAvailable() === true) {
	    vrRenderer = new THREE.VREffect(webGLRenderer);
	    document.body.appendChild(WEBVR.getButton(vrRenderer));
	    renderer = vrRenderer;
	    scene = new _Scene2.default(renderer);
	  } else {
	    renderer = webGLRenderer;
	    scene = new _Scene4.default(renderer);
	  }
	
	  window.addEventListener('resize', onWindowResize, false);
	};
	
	var time = void 0;
	var delta = 0;
	var tick = function tick() {
	  if (WEBVR.isAvailable() === true) {
	    vrRenderer.requestAnimationFrame(tick);
	  } else {
	    window.requestAnimationFrame(tick);
	  }
	  var now = new Date().getTime();
	  delta = (now - (time || now)) / 1000;
	  time = now;
	
	  if (delta > 0) {
	    scene.tick(delta);
	  }
	
	  renderer.render(scene, scene.camera);
	};
	
	var onWindowResize = function onWindowResize() {
	  scene.camera.aspect = window.innerWidth / window.innerHeight;
	  scene.camera.updateProjectionMatrix();
	  renderer.setSize(window.innerWidth, window.innerHeight);
	};
	
	init();
	tick();
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(THREE) {'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _cannon = __webpack_require__(3);
	
	var _cannon2 = _interopRequireDefault(_cannon);
	
	var _vrController = __webpack_require__(4);
	
	var _vrController2 = _interopRequireDefault(_vrController);
	
	var _Game = __webpack_require__(5);
	
	var _Game2 = _interopRequireDefault(_Game);
	
	var _Skybox = __webpack_require__(10);
	
	var _Skybox2 = _interopRequireDefault(_Skybox);
	
	var _GroundPlane = __webpack_require__(11);
	
	var _GroundPlane2 = _interopRequireDefault(_GroundPlane);
	
	var _Pen = __webpack_require__(12);
	
	var _Pen2 = _interopRequireDefault(_Pen);
	
	var _Sheep = __webpack_require__(8);
	
	var _Sheep2 = _interopRequireDefault(_Sheep);
	
	var _DynamicSign = __webpack_require__(13);
	
	var _DynamicSign2 = _interopRequireDefault(_DynamicSign);
	
	var _Sign = __webpack_require__(28);
	
	var _Sign2 = _interopRequireDefault(_Sign);
	
	var _RipplePlane = __webpack_require__(14);
	
	var _RipplePlane2 = _interopRequireDefault(_RipplePlane);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* global WEBVR */
	/* global THREE */
	
	
	var Scene1 = function (_THREE$Scene) {
	  _inherits(Scene1, _THREE$Scene);
	
	  function Scene1(renderer) {
	    _classCallCheck(this, Scene1);
	
	    var _this = _possibleConstructorReturn(this, (Scene1.__proto__ || Object.getPrototypeOf(Scene1)).call(this));
	
	    _this.controls;
	
	    _this.tickingActors = [];
	
	    var controller1 = void 0;
	    var controller2 = void 0;
	
	    _this.world = new _cannon2.default.World();
	    _this.world.gravity.set(0, -4.9, 0);
	    _this.world.broadphase = new _cannon2.default.NaiveBroadphase();
	    _this.world.solver.iterations = 10;
	
	    var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 10000);
	    var listener = new THREE.AudioListener();
	    camera.add(listener);
	
	    _this.add(camera);
	
	    _this.add(new THREE.HemisphereLight(0x808080, 0x606060));
	    var light = new THREE.DirectionalLight(0xffffff);
	    light.position.set(0, 6, 0);
	    light.rotation.set(2, 2, 5.0);
	
	    // light.castShadow = true;
	    // // light.shadow.camera.zoom = 4;
	    // // light.shadow.camera.top = 2;
	    // // light.shadow.camera.bottom = -2;
	    // // light.shadow.camera.right = 2;
	    // // light.shadow.camera.left = -2;
	
	    // // light.shadow.mapSize.set(4096, 4096);
	    _this.add(light);
	
	    _this.camera = camera;
	
	    _this.controls = new THREE.VRControls(camera);
	    _this.controls.standing = true;
	
	    controller1 = new _vrController2.default(0, _this.controls);
	    _this.tickingActors.push(controller1);
	    _this.add(controller1);
	    controller2 = new _vrController2.default(1, _this.controls);
	    _this.add(controller2);
	    _this.tickingActors.push(controller2);
	
	    window.game = new _Game2.default(_this, _this.world);
	    _this.tickingActors.push(window.game);
	
	    var skybox = new _Skybox2.default(_this, _this.world);
	
	    // let sheep = new Sheep();
	    // this.add(sheep.object3D);
	    _this.groundPlane = new _GroundPlane2.default(_this, _this.world);
	    _this.groundPlane.object3D.position.set(0, 1.7, 0);
	    _this.groundPlane.body.position.set(0, 1.7, 0);
	
	    _this.ripplePlane = new _RipplePlane2.default(_this, _this.world);
	    _this.tickingActors.push(_this.ripplePlane);
	    _this.ripplePlane.object3D.position.set(0, 2.2, 0);
	    _this.ripplePlane.object3D.scale.set(0.06, 0.06, 0.06);
	
	    _this.pen = new _Pen2.default(_this, _this.world, new THREE.Vector3(0, 2.18, 0));
	
	    _this.scoreSign = new _DynamicSign2.default(_this, _this.world);
	    _this.scoreSign.object3D.position.set(-2.2, 0, -5);
	    _this.scoreSign.object3D.rotation.y = 0.3;
	    _this.scoreSign.setMessage("Score");
	    _this.scoreSign.setNumber(0);
	    _this.tickingActors.push(_this.scoreSign);
	    _this.scoreSign.visible = false;
	
	    _this.timeSign = new _DynamicSign2.default(_this, _this.world);
	    _this.timeSign.object3D.position.set(2.5, 0, -5);
	    _this.timeSign.object3D.rotation.y = -0.2;
	    _this.timeSign.setMessage("Time");
	    _this.timeSign.setNumber(window.game.timeRemaining);
	    _this.tickingActors.push(_this.timeSign);
	    _this.timeSign.visible = false;
	
	    _this.signs = [];
	    var sign_count = 8;
	    for (var i = 0; i < 6; i++) {
	      _this.signs[i] = new _Sign2.default(_this, _this.world, i);
	      var angle = -i * 2 * Math.PI / sign_count - Math.PI / 2;
	      _this.signs[i].object3D.position.x = 8 * Math.cos(i * 2 * Math.PI / sign_count);
	      _this.signs[i].object3D.position.z = 8 * Math.sin(i * 2 * Math.PI / sign_count);
	
	      _this.signs[i].object3D.rotation.y = angle;
	    }
	
	    _this.numSheep = 30;
	    for (var i = 0; i < _this.numSheep; i++) {
	      var sheep = new _Sheep2.default(_this, _this.world);
	      sheep.object3D.position.y = 2.23;
	      _this.tickingActors.push(sheep);
	    }
	
	    _this.bPause = false;
	
	    document.body.onkeyup = function (e) {
	      if (e.keyCode == 32) {
	        console.log("I pressed spacebar");
	        for (var _i = 0; _i < this.tickingActors.length; _i++) {
	          if (this.tickingActors[_i].object3D.name == "Sheep") {
	            this.tickingActors[_i].physicsEnabled = !this.tickingActors[_i].physicsEnabled;
	          }
	        }
	      }
	    };
	    return _this;
	  }
	
	  _createClass(Scene1, [{
	    key: 'beginGame',
	    value: function beginGame() {
	      for (var key in this.signs) {
	        var sign = this.signs[key];
	        sign.object3D.visible = false;
	      }
	      this.scoreSign.object3D.visible = true;
	      this.timeSign.object3D.visible = true;
	    }
	  }, {
	    key: 'tick',
	    value: function tick(delta) {
	      // this.world.step(delta);
	      this.world.step(1 / 60);
	      this.controls.update();
	      tickActors(this.tickingActors, delta);
	    }
	  }]);
	
	  return Scene1;
	}(THREE.Scene);
	
	var tickActors = function tickActors(actors, delta) {
	  for (var i = 0; i < actors.length; i++) {
	    if (actors[i].tick) {
	      actors[i].tick(delta);
	    }
	  }
	};
	
	module.exports = Scene1;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 3 */,
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(THREE) {"use strict";
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/* global WEBVR */
	/* global THREE */
	
	var Controller = function (_THREE$ViveController) {
	  _inherits(Controller, _THREE$ViveController);
	
	  function Controller(index, controls) {
	    _classCallCheck(this, Controller);
	
	    var _this = _possibleConstructorReturn(this, (Controller.__proto__ || Object.getPrototypeOf(Controller)).call(this, index));
	
	    _this.index = index;
	    _this.showViveControllers = false;
	    _this.lastPosition = new THREE.Vector3();
	    _this.velocity = new THREE.Vector3();
	    _this.isAboveGround = false;
	    _this.isBelowGround = true;
	    var self = _this;
	
	    _this.onTriggerDown = function (event) {
	      console.log("triggerDown " + _this.index);
	      // var worldLocation = this.getWorldPosition();
	      // window.game.impact(worldLocation, this.velocity.length(), this.index ? "right" : "left");
	    };
	    _this.onTriggerUp = function (event) {
	      console.log("triggerUp " + _this.index);
	    };
	
	    _this.standingMatrix = controls.getStandingMatrix();
	    _this.addEventListener('triggerdown', _this.onTriggerDown);
	    _this.addEventListener('triggerup', _this.onTriggerUp);
	
	    if (_this.showViveControllers) {
	      var loader = new THREE.OBJLoader();
	      loader.setPath('./models/obj/vive-controller/');
	
	      loader.load('vr_controller_vive_1_5.obj', function (object) {
	        var loader = new THREE.TextureLoader();
	        loader.setPath('./models/obj/vive-controller/');
	
	        var controller = object.children[0];
	        controller.material.map = loader.load('onepointfive_texture.png');
	        controller.material.specularMap = loader.load('onepointfive_spec.png');
	
	        self.add(object.clone());
	      });
	    } else {
	      var loader1 = new THREE.OBJLoader();
	      loader1.setPath('./models/obj/fist/');
	
	      loader1.load('fist.obj', function (object) {
	        var loader1 = new THREE.TextureLoader();
	        loader1.setPath('./models/obj/fist/');
	
	        var controller = object.children[0];
	        controller.material.map = loader1.load('fistDiffuse.png');
	        controller.material.side = THREE.DoubleSide;
	
	        var mesh = object.clone();
	        mesh.position.set(0, 0, 0.2);
	        mesh.rotation.set(-Math.PI / 2, Math.PI, 0);
	        mesh.scale.set(0.1, 0.1, 0.1);
	        if (self.index == 1) {
	          mesh.scale.x = mesh.scale.y * -1;
	        }
	        self.add(mesh);
	      });
	    }
	    return _this;
	  }
	
	  _createClass(Controller, [{
	    key: "tick",
	    value: function tick(delta) {
	      this.update();
	
	      var _currentPosition = this.position;
	      var _diff = _currentPosition.clone().sub(this.lastPosition);
	      this.velocity = _diff.multiplyScalar(delta);
	
	      this.lastPosition = this.position.clone();
	
	      this.checkWentBelowGround();
	    }
	  }, {
	    key: "getWorldPosition",
	    value: function getWorldPosition() {
	      var matrix = this.matrixWorld;
	      return new THREE.Vector3().setFromMatrixPosition(matrix);
	    }
	  }, {
	    key: "checkWentBelowGround",
	    value: function checkWentBelowGround() {
	      var raycaster = new THREE.Raycaster();
	      var worldLocation = this.getWorldPosition();
	      raycaster.set(worldLocation, new THREE.Vector3(0, -1, 0));
	      var _ground = window.game.scene.ripplePlane.object3D;
	      var _intersects = raycaster.intersectObject(_ground, true);
	      if (_intersects.length == 0) {
	        this.isBelowGround = true;
	
	        if (this.isAboveGround) {
	          var _worldLocation = this.getWorldPosition();
	          window.game.impact(_worldLocation, this.velocity.length(), this.index ? "right" : "left");
	          console.log("Just went below ground");
	        }
	        this.isAboveGround = false;
	      } else {
	        this.isAboveGround = true;
	        this.isBelowGround = false;
	      }
	    }
	  }]);
	
	  return Controller;
	}(THREE.ViveController);
	
	var transformPoint = function transformPoint(vector) {
	  vector.x = (vector.x + 1.0) / 2.0;
	  vector.y = vector.y / 2.0;
	  vector.z = (vector.z + 1.0) / 2.0;
	  return vector;
	};
	
	module.exports = Controller;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(THREE) {'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _cannon = __webpack_require__(3);
	
	var _cannon2 = _interopRequireDefault(_cannon);
	
	var _MathHelpers = __webpack_require__(6);
	
	var _MathHelpers2 = _interopRequireDefault(_MathHelpers);
	
	var _Actor2 = __webpack_require__(7);
	
	var _Actor3 = _interopRequireDefault(_Actor2);
	
	var _Sheep = __webpack_require__(8);
	
	var _Sheep2 = _interopRequireDefault(_Sheep);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* global THREE */
	
	
	var Game = function (_Actor) {
	  _inherits(Game, _Actor);
	
	  function Game(scene, world) {
	    _classCallCheck(this, Game);
	
	    var _this = _possibleConstructorReturn(this, (Game.__proto__ || Object.getPrototypeOf(Game)).call(this, scene, world));
	
	    _this.scene = scene;
	    _this.world = world;
	
	    _this.score = 0;
	    _this.timeRemaining = 60;
	
	    _this.gameStart = false;
	    _this.gameOver = false;
	
	    _this.initialized = false;
	    _this.initializedTime = 2.0;
	    _this.initializedCount = 0;
	
	    _this.impactConfig = {
	      scalar: 2000.0,
	      yBaseForce: 8000.0,
	      maxRange: 2,
	      forceThreshold: 1.0
	    };
	
	    return _this;
	  }
	
	  _createClass(Game, [{
	    key: 'impact',
	    value: function impact(vector3ImpactLocation, floatScale, hand) {
	      // floatScale = Math.min(floatScale, 0.0015);
	      vector3ImpactLocation.y = 0;
	
	      if (!this.initialized) return;
	
	      if (!this.gameStart) {
	        this.scene.beginGame();
	        this.gameStart = true;
	      }
	
	      var tickables = this.scene.tickingActors;
	      for (var i = 0; i < tickables.length; i++) {
	        var ticker = tickables[i];
	        if (!ticker instanceof _Sheep2.default || !ticker.body) continue;
	
	        var _objectPos = new THREE.Vector3(ticker.body.position.x, 0, ticker.body.position.z); //vec3
	        var _diff = _objectPos.clone().sub(vector3ImpactLocation);
	
	        if (_diff.length() > this.impactConfig.maxRange) continue;
	
	        var _distanceScale = Math.abs(_diff.length() / this.impactConfig.maxRange - 1) * floatScale;
	        // _distanceScale = 1/(Math.pow(_distanceScale, 2));
	
	        //let _force = _diff.clone().normalize().multiplyScalar(_distanceScale).multiplyScalar(this.impactConfig.scalar);
	        // Scale forward force
	        var _force = _diff.clone().normalize().multiplyScalar(_distanceScale).multiplyScalar(this.impactConfig.scalar);
	
	        // Set and scale height
	        _force.y = this.impactConfig.yBaseForce * _distanceScale;
	        console.log("FORCE: ", _force);
	
	        //console.log(_force.length())
	        if (_force.length() < this.impactConfig.forceThreshold) continue;
	
	        //let force = new CANNON.Vec3(_force.x,Math.abs(_force.y) * this.impactConfig.yScalar,_force.z);
	        var force = new _cannon2.default.Vec3(_force.x, _force.y, _force.z);
	        if (ticker instanceof _Sheep2.default) {
	          ticker.bump(force, vector3ImpactLocation);
	        }
	      }
	
	      if (this.scene.ripplePlane) {
	        var impact_amt = 1.0 - 1.0 / (Math.abs(floatScale * 1000) + 1);
	        this.scene.ripplePlane.acceptPunch(vector3ImpactLocation, hand, impact_amt);
	      }
	    }
	  }, {
	    key: 'incrementScore',
	    value: function incrementScore() {
	      if (!this.gameOver) {
	        this.score++;
	        this.scene.scoreSign.setNumber(this.score);
	      }
	    }
	  }, {
	    key: 'updateTime',
	    value: function updateTime(delta) {
	      if (!this.gameStart) return;
	      this.timeRemaining -= delta;
	      this.timeRemaining = Math.max(0, this.timeRemaining);
	      var _secondsRemaining = Math.floor(this.timeRemaining);
	      this.scene.timeSign.setNumber(_secondsRemaining);
	
	      if (this.timeRemaining <= 0) {
	        if (!this.gameOver) {
	          this.gameOver = true;
	          this.scene.timeSign.setMessage("Restarting");
	          this.timeRemaining = 10;
	        } else {
	          // let refresh = function () {
	          //   window.location.reload(false); 
	          // }
	          // setTimeout(refresh, 0);
	        }
	      }
	    }
	  }, {
	    key: 'tick',
	    value: function tick(delta) {
	      _get(Game.prototype.__proto__ || Object.getPrototypeOf(Game.prototype), 'tick', this).call(this, delta);
	      this.updateTime(delta);
	
	      this.initializedCount += delta;
	      if (this.initializedCount >= this.initializedTime) {
	        this.initialized = true;
	      }
	    }
	  }]);
	
	  return Game;
	}(_Actor3.default);
	
	module.exports = Game;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(THREE) {'use strict';
	
	var _cannon = __webpack_require__(3);
	
	var _cannon2 = _interopRequireDefault(_cannon);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var MathHelpers = {}; /* global THREE */
	
	
	MathHelpers.threeVec3ToCannonVec3 = function (threeVec3) {
	  return new _cannon2.default.Vec3(threeVec3.x, threeVec3.y, threeVec3.z);
	};
	
	MathHelpers.cannonVec3ToThreeVec3 = function (cannonVec3) {
	  return new THREE.Vector3(cannonVec3.x, cannonVec3.y, cannonVec3.z);
	};
	
	module.exports = MathHelpers;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(THREE) {"use strict";
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/* global THREE */
	
	var Actor = function () {
	  function Actor(scene, world) {
	    _classCallCheck(this, Actor);
	
	    this.ticks = false;
	
	    // THREE.js
	    this.geometry = null;
	    this.material = null;
	    this.mesh = null;
	    this.object3D = new THREE.Object3D();
	    this.object3D.name = this.constructor.name;
	    // Cannon.js
	    this.physicsEnabled = false;
	    this.mass = null;
	    this.body = null;
	    this.shape = null;
	
	    this.hackyYOffset = 0;
	
	    // debug lines
	    this.lines = [];
	  }
	
	  _createClass(Actor, [{
	    key: "tick",
	    value: function tick(delta) {
	      this.clearLines();
	      this.syncCollisionBodyAndRenderable();
	    }
	  }, {
	    key: "destroy",
	    value: function destroy() {
	      delete this;
	    }
	  }, {
	    key: "beginPlay",
	    value: function beginPlay() {}
	  }, {
	    key: "randRange",
	    value: function randRange(min, max) {
	      return Math.floor(Math.random() * (max - min + 1) + min);
	    }
	  }, {
	    key: "randFloatRange",
	    value: function randFloatRange(min, max) {
	      return Math.random() * (max - min + 1) + min;
	    }
	  }, {
	    key: "getPosition",
	    value: function getPosition() {
	      return this.object3D.position.clone();
	    }
	  }, {
	    key: "getForwardVector",
	    value: function getForwardVector() {
	      var _currentPos = this.object3D.position.clone();
	      var _currentRot = this.object3D.rotation.clone();
	
	      var _originVect = new THREE.Vector3(1, 0, 0);
	
	      var _fwdX = _originVect.x * Math.cos(_currentRot.y);
	      var _fwdZ = _originVect.x * Math.sin(_currentRot.y);
	
	      var forwardVect = new THREE.Vector3(_fwdX, 0, -_fwdZ);
	
	      return forwardVect;
	    }
	  }, {
	    key: "syncCollisionBodyAndRenderable",
	    value: function syncCollisionBodyAndRenderable() {
	      if (!this.body) return;
	
	      if (this.physicsEnabled) {
	        this.object3D.position.copy(this.body.position);
	        this.object3D.position.y = this.object3D.position.y - this.hackyYOffset;
	        this.object3D.quaternion.copy(this.body.quaternion);
	      } else if (!this.physicsEnabled) {
	        this.body.position.copy(this.object3D.position);
	        this.body.quaternion.copy(this.object3D.quaternion);
	      }
	    }
	  }, {
	    key: "clearLines",
	    value: function clearLines() {
	      for (var i = 0; i < this.lines.length; i++) {
	        this.scene.remove(this.lines[i]);
	      }
	    }
	  }, {
	    key: "draweLine",
	    value: function draweLine(start, end, color) {
	      var material = new THREE.LineBasicMaterial({
	        color: color
	      });
	
	      var geometry = new THREE.Geometry();
	      geometry.vertices.push(start, end);
	
	      var _line = new THREE.Line(geometry, material);
	      this.lines[this.lines.length] = _line;
	      this.scene.add(_line);
	    }
	  }, {
	    key: "clamp",
	    value: function clamp(val, min, max) {
	      return Math.min(Math.max(min, val), max);
	    }
	  }]);
	
	  return Actor;
	}();
	
	module.exports = Actor;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(THREE) {'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _Actor2 = __webpack_require__(7);
	
	var _Actor3 = _interopRequireDefault(_Actor2);
	
	var _cannon = __webpack_require__(3);
	
	var _cannon2 = _interopRequireDefault(_cannon);
	
	var _FSM = __webpack_require__(9);
	
	var _FSM2 = _interopRequireDefault(_FSM);
	
	var _MathHelpers = __webpack_require__(6);
	
	var _MathHelpers2 = _interopRequireDefault(_MathHelpers);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* global THREE */
	
	
	var Sheep = function (_Actor) {
	  _inherits(Sheep, _Actor);
	
	  function Sheep(scene, world) {
	    _classCallCheck(this, Sheep);
	
	    var _this = _possibleConstructorReturn(this, (Sheep.__proto__ || Object.getPrototypeOf(Sheep)).call(this, scene, world));
	
	    _this.ticks = true;
	    //this.object3D.scale.set(0.1,0.1,0.1);
	
	    // this.hackyYOffset = 0.56;
	    _this.lastPosition = new THREE.Vector3();
	    _this.landedTimer = 0.0;
	    _this.landedMax = 2.0;
	
	    _this.physicsEnabled = false;
	    _this.totalScale = 0.075;
	    _this.physicsScale = new THREE.Vector3(1.0, 0.7, 0.5);
	
	    var self = _this;
	    _this.scene = scene;
	
	    var loader = new THREE.OBJLoader();
	    loader.setPath('./models/obj/sheep-v2/');
	
	    var textures = ['sheepDiffuse.png', 'sheepDiffuseBlack.png', 'sheepDiffuseBW.png', 'sheepDiffuseWhite.png', 'sheepDiffuseZombie.png'];
	    var texIndex = _this.randRange(0, textures.length - 1);
	
	    loader.load('sheep.obj', function (object) {
	      var loader = new THREE.TextureLoader();
	      loader.setPath('./models/obj/sheep-v2/');
	
	      var sheepMesh = object.children[0];
	      sheepMesh.material.map = loader.load(textures[texIndex]);
	      /*
	      sheepMesh.material.specularMap = loader.load(
	        'sheepSpecularMap.png'
	      );
	      */
	      var mesh = object.clone();
	      mesh.castShadow = true;
	      mesh.receiveShadow = true;
	      mesh.position.set(0, -0.3 * self.totalScale, 0);
	      mesh.scale.set(self.totalScale, self.totalScale, self.totalScale);
	      // mesh.rotation.set(-Math.PI/2, Math.PI,0);
	      self.object3D.add(mesh);
	    });
	
	    _this.shape = new _cannon2.default.Box(new _cannon2.default.Vec3(_this.physicsScale.x * _this.totalScale / 2, _this.physicsScale.y * _this.totalScale / 2, _this.physicsScale.z * _this.totalScale / 2));
	    var collisionMesh = new THREE.Mesh(new THREE.BoxGeometry(_this.physicsScale.x * _this.totalScale, _this.physicsScale.y * _this.totalScale, _this.physicsScale.z * _this.totalScale), new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true }));
	    // this.object3D.add(collisionMesh);
	    _this.mass = 5;
	    _this.body = new _cannon2.default.Body({
	      mass: _this.mass
	    });
	    _this.body.addShape(_this.shape);
	
	    _this.pen = scene.pen;
	    _this.bIsInPen = false;
	
	    _this.object3D.position.x = _this.getRandStart();
	    _this.object3D.position.y = 2.8;
	    _this.object3D.position.z = _this.getRandStart();
	
	    console.log(_this.object3D.position);
	
	    _this.wanderRange = 0.2;
	
	    _this.velocity = new THREE.Vector3(0, 0, 0);
	
	    _this.brain = new _FSM2.default();
	    _this.brain.setState(_this.wander.bind(_this));
	
	    _this.grazeTimer = 0;
	    _this.newDestTimer = 0;
	    _this.limitInState = _this.randFloatRange(2, 5);
	    _this.nextDestTimeRange = _this.randFloatRange(2, 5);
	
	    _this.destinationRange = 0.2;
	
	    _this.accel = 0.005;
	    _this.speed = 0;
	
	    _this.maxSpeed = 0.075;
	    _this.rotationRate = 1;
	
	    _this.targetPos = _this.getNewTargetPos(_this.wanderRange, _this.wanderRange);
	
	    _this.raycaster = new THREE.Raycaster();
	
	    scene.add(_this.object3D);
	    world.addBody(_this.body);
	
	    _this.scene = scene;
	    return _this;
	  }
	
	  _createClass(Sheep, [{
	    key: 'getRandStart',
	    value: function getRandStart() {
	      var _randValue = Math.random();
	      if (_randValue <= this.pen.radius) {
	        return this.getRandStart();
	      } else if (Math.random() >= 0.5) {
	        return -_randValue;
	      } else {
	        return _randValue;
	      }
	    }
	  }, {
	    key: 'checkIsInPen',
	    value: function checkIsInPen() {
	      var _sheepPos = this.getPosition();
	      var _penPos = this.pen.getPosition();
	      var _dist = _penPos.sub(_sheepPos).length();
	      if (_dist < this.pen.radius) {
	        this.setPenned();
	        window.game.incrementScore();
	      }
	    }
	  }, {
	    key: 'tick',
	    value: function tick(delta) {
	      _get(Sheep.prototype.__proto__ || Object.getPrototypeOf(Sheep.prototype), 'tick', this).call(this, delta);
	
	      this.brain.tick(delta);
	      this.updateTransform(delta);
	
	      if (!this.bIsInPen) {
	        this.checkIsInPen();
	      }
	
	      var _currentBodyPos = _MathHelpers2.default.cannonVec3ToThreeVec3(this.body.position);
	      // walked off the edge
	      if (!this.physicsEnabled) {
	        _currentBodyPos.y = 0;
	        var _distToCenter = _currentBodyPos.sub(new THREE.Vector3(0, 0, 0)).length();
	        if (_distToCenter > 1.48) {
	          this.physicsEnabled = true;
	          this.body.velocity = new _cannon2.default.Vec3(0, 0, 0);
	          this.body.angularVelocity = new _cannon2.default.Vec3(0, 0, 0);
	        }
	      } else {
	        var _rayCastOrigin = _currentBodyPos.clone().add(new THREE.Vector3(0, 0.01, 0));
	        this.raycaster.set(_rayCastOrigin, new THREE.Vector3(0, -0.02, 0));
	
	        var _ground = window.game.scene.ripplePlane.object3D;
	        var _intersects = this.raycaster.intersectObject(_ground, true);
	        if (_intersects.length <= 0) {
	          var _currentHeight = this.body.position.clone().y;
	          // If we've fallen off the table, respawn
	          if (_currentHeight <= -2) {
	            this.body.position.x = this.getRandStart();
	            this.body.position.y = 5;
	            this.body.position.z = this.getRandStart();
	            this.body.velocity = new _cannon2.default.Vec3(0, -.1, 0);
	            this.body.angularVelocity = new _cannon2.default.Vec3(0, 0, 0);
	          }
	        } else {
	          this.checkIfLanded(delta);
	        }
	      }
	    }
	  }, {
	    key: 'checkIfLanded',
	    value: function checkIfLanded(delta) {
	      var _currentPosition = _MathHelpers2.default.cannonVec3ToThreeVec3(this.body.position);
	
	      var _diff = _currentPosition.clone().sub(this.lastPosition);
	
	      var velocity = _diff.length() * delta;
	
	      if (velocity < .05) {
	        this.landedTimer += delta;
	        if (this.landedTimer >= this.landedMax) {
	          this.physicsEnabled = false;
	          this.object3D.rotation.set(0, 0, 0);
	          this.body.velocity = new _cannon2.default.Vec3(0, 0, 0);
	          this.body.angularVelocity = new _cannon2.default.Vec3(0, 0, 0);
	          this.landedTimer = 0;
	        }
	      }
	      this.lastPosition = _MathHelpers2.default.cannonVec3ToThreeVec3(this.body.position);
	    }
	  }, {
	    key: 'bump',
	    value: function bump(forceVector, sourceVector) {
	      if (!this.bIsInPen) {
	        this.landedTimer = 0;
	        this.physicsEnabled = true;
	        this.body.applyImpulse(forceVector, this.body.position.clone());
	      }
	    }
	  }, {
	    key: 'wander',
	    value: function wander(delta) {
	      var _currentPos = this.getPosition();
	      var _targetPos = this.targetPos.clone();
	      var _distance = _targetPos.distanceTo(_currentPos);
	
	      this.newDestTimer += delta;
	      if (this.newDestTimer > this.nextDestTimeRange) {
	        this.targetPos = this.getNewTargetPos(this.wanderRange, this.wanderRange);
	        this.nextDestTimeRange = this.randFloatRange(2, 5);
	        this.newDestTimer = 0;
	      }
	
	      if (_distance <= this.destinationRange) {
	        this.speed = 0;
	        this.brain.setState(this.graze.bind(this));
	      }
	    }
	  }, {
	    key: 'graze',
	    value: function graze(delta) {
	      var _currentPos = this.getPosition();
	      var _targetPos = this.targetPos.clone();
	      // We're Grazing
	      var _distance = _targetPos.distanceTo(_currentPos);
	      if (_distance <= this.destinationRange) {
	        this.grazeTimer += delta;
	        this.speed = 0;
	      }
	
	      this.newDestTimer += delta;
	      if (this.newDestTimer > this.nextDestTimeRange) {
	        this.targetPos = this.getNewTargetPos(2, 2);
	        this.newDestTimer = 0;
	        this.nextDestTimeRange = this.randFloatRange(2, 6);
	      }
	
	      if (this.grazeTimer > this.limitInState) {
	        this.targetPos = this.getNewTargetPos(2, 2);
	        this.limitInState = this.randFloatRange(4, 8);
	        this.grazeTimer = 0;
	        this.brain.timeInState = 0;
	        this.speed = 0;
	      }
	    }
	  }, {
	    key: 'setPenned',
	    value: function setPenned() {
	      this.bIsInPen = true;
	      this.targetPos = this.getPenTargetPos();
	      this.newDestTimer = 0;
	      this.nextDestTimeRange = this.randFloatRange(2, 6);
	      this.brain.setState(this.penned.bind(this));
	      this.maxSpeed = this.maxSpeed / 2.0;
	    }
	  }, {
	    key: 'penned',
	    value: function penned(delta) {
	      this.newDestTimer += delta;
	      if (this.newDestTimer > this.nextDestTimeRange) {
	        this.newDestTimer = 0;
	        this.nextDestTimeRange = this.randFloatRange(2, 4);
	        this.targetPos = this.getPenTargetPos();
	      }
	    }
	  }, {
	    key: 'updateTransform',
	    value: function updateTransform(delta) {
	      var _targetPos = this.targetPos.clone();
	      var _currentPos = this.getPosition();
	
	      // Handle Position
	      var _fwdVect = this.getForwardVector();
	
	      // Handle Rotation
	      var _direction = _targetPos.clone().sub(_currentPos).normalize();
	      var _dotProd = _fwdVect.clone().dot(_direction);
	      var _theta = Math.acos(_dotProd);
	
	      // Get the destination angle
	      var _destDotProd = new THREE.Vector3(1, 0, 0).dot(_direction);
	      var _destTheta = Math.acos(_destDotProd);
	      if (_direction.z > 0) {
	        _destTheta = 2 * Math.PI - _destTheta;
	      }
	
	      // Ensure we do not use negative angles
	      if (this.object3D.rotation.y < 0) {
	        this.object3D.rotation.y += 2 * Math.PI;
	      }
	
	      // Ensure we do not cross over 2 pi radians
	      var _yaw = this.object3D.rotation.clone().y % (2 * Math.PI);
	
	      // Get whether to go clockwise or counter clockwise
	      var _angleDif = _yaw - _destTheta;
	      var _absDif = Math.abs(_angleDif);
	
	      var _finalRotRate = this.rotationRate;
	      if (this.brain.timeInState > 6) {
	        _finalRotRate = 2;
	      }
	
	      _finalRotRate = _finalRotRate * delta;
	      if (_angleDif > 0.0 && _absDif <= Math.PI) {
	        _finalRotRate *= -1;
	      } else if (_angleDif < 0.0 && _absDif > Math.PI) {
	        _finalRotRate *= -1;
	      }
	
	      if (_theta > 0.01) {
	        this.object3D.rotation.y += _finalRotRate;
	      }
	
	      // Update Position
	      var _distance = _targetPos.distanceTo(_currentPos);
	      var _velocity = new THREE.Vector3(0, 0, 0);
	      if (_distance > this.destinationRange) {
	        this.speed += this.accel;
	      }
	
	      this.speed = this.clamp(this.speed, 0, this.maxSpeed);
	      _velocity = _fwdVect.clone().multiplyScalar(this.speed);
	      _velocity.multiplyScalar(delta);
	
	      this.object3D.position.add(_velocity);
	    }
	
	    // Return the next target position
	
	  }, {
	    key: 'getNewTargetPos',
	    value: function getNewTargetPos(x, z) {
	      var _currentPos = this.getPosition();
	      var _penPos = this.pen.getPosition();
	
	      var _difference = _penPos.clone().sub(_currentPos);
	      var _distance = _difference.length();
	      if (_distance >= 0.7) {
	        var randX = this.randFloatRange(-x, x);
	        var randZ = this.randFloatRange(-z, z);
	        var offset = new THREE.Vector3(randX, 0, randZ);
	        var _currentPos = this.getPosition();
	        var newTarget = _currentPos.add(offset);
	        return newTarget;
	      } else {
	        var _penDir = _difference.normalize().multiplyScalar(-1);
	        var randX = this.randFloatRange(0, z);
	        var randZ = this.randFloatRange(0, z);
	        var _cPerpVect = new THREE.Vector3(_penDir.z, 0, -_penDir.x).multiplyScalar(randX);
	        var _ccPerpVect = new THREE.Vector3(-_penDir.z, 0, _penDir.x).multiplyScalar(randZ);
	
	        var _newDir = _penDir.add(_cPerpVect).add(_ccPerpVect);
	        var newTarget = _currentPos.add(_newDir);
	        return newTarget;
	      }
	    }
	
	    // Return the next target position
	
	  }, {
	    key: 'getPenTargetPos',
	    value: function getPenTargetPos() {
	      var _penPos = this.pen.getPosition();
	      var _rad = this.pen.radius * 0.5;
	      var randX = this.randFloatRange(-_rad, _rad);
	      var randZ = this.randFloatRange(-_rad, _rad);
	      var offset = new THREE.Vector3(randX, 0, randZ);
	      var newTarget = _penPos; //.add(offset);
	
	      return newTarget;
	    }
	
	    // Draw forward and destination lines
	
	  }, {
	    key: 'drawDebugLines',
	    value: function drawDebugLines() {
	      var _targetPos = this.targetPos.clone();
	      var _currentPos = this.getPosition();
	
	      var _fwdVect = this.getForwardVector();
	      _fwdVect.add(_currentPos);
	
	      this.draweLine(_currentPos, _targetPos, 0x00ff00);
	      this.draweLine(_currentPos, _fwdVect, 0x0000ff);
	    }
	  }]);
	
	  return Sheep;
	}(_Actor3.default);
	
	module.exports = Sheep;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/* global THREE */
	
	var FSM = function () {
	  function FSM() {
	    _classCallCheck(this, FSM);
	
	    this.activeState;
	    this.timeInState;
	  }
	
	  _createClass(FSM, [{
	    key: "setState",
	    value: function setState(state) {
	      this.activeState = state;
	      this.timeInState = 0;
	    }
	  }, {
	    key: "tick",
	    value: function tick(delta) {
	      if (this.activeState != null) {
	        this.activeState(delta);
	        this.timeInState += delta;
	      }
	    }
	  }]);
	
	  return FSM;
	}();
	
	module.exports = FSM;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(THREE) {'use strict';
	
	var _Actor2 = __webpack_require__(7);
	
	var _Actor3 = _interopRequireDefault(_Actor2);
	
	var _cannon = __webpack_require__(3);
	
	var _cannon2 = _interopRequireDefault(_cannon);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* global THREE */
	
	
	var Sheep = function (_Actor) {
	  _inherits(Sheep, _Actor);
	
	  function Sheep(scene, world) {
	    _classCallCheck(this, Sheep);
	
	    var _this = _possibleConstructorReturn(this, (Sheep.__proto__ || Object.getPrototypeOf(Sheep)).call(this, scene, world));
	
	    var self = _this;
	
	    var loader = new THREE.OBJLoader();
	    loader.setPath('./models/obj/skybox/');
	
	    loader.load('skysphere.obj', function (object) {
	      var loader = new THREE.TextureLoader();
	      loader.setPath('./models/obj/skybox/');
	
	      var skybox = object.children[0];
	      skybox.material.map = loader.load('skyboxDiffuse.png');
	
	      self.object3D.add(skybox.clone());
	    });
	
	    scene.add(_this.object3D);
	    return _this;
	  }
	
	  return Sheep;
	}(_Actor3.default);
	
	module.exports = Sheep;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(THREE) {'use strict';
	
	var _Actor2 = __webpack_require__(7);
	
	var _Actor3 = _interopRequireDefault(_Actor2);
	
	var _cannon = __webpack_require__(3);
	
	var _cannon2 = _interopRequireDefault(_cannon);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* global THREE */
	
	
	var GroundPlane = function (_Actor) {
	  _inherits(GroundPlane, _Actor);
	
	  function GroundPlane(scene, world) {
	    _classCallCheck(this, GroundPlane);
	
	    var _this = _possibleConstructorReturn(this, (GroundPlane.__proto__ || Object.getPrototypeOf(GroundPlane)).call(this, scene, world));
	
	    _this.physicsScale = {
	      x: 2.1,
	      y: 1,
	      z: 2.1
	    };
	    _this.shape = new _cannon2.default.Box(new _cannon2.default.Vec3(_this.physicsScale.x / 2, _this.physicsScale.y / 2, _this.physicsScale.z / 2));
	    // this.shape = new CANNON.Cylinder(this.physicsScale.x/2,this.physicsScale.z/2,this.physicsScale.y, 8);
	
	    var collisionMesh = new THREE.Mesh(new THREE.BoxGeometry(_this.physicsScale.x, _this.physicsScale.y, _this.physicsScale.z), new THREE.CylinderGeometry(_this.physicsScale.x / 2, _this.physicsScale.z / 2, _this.physicsScale.y), new THREE.MeshStandardMaterial({ color: 0x777777, roughness: 1.0, metalness: 0, wireframe: false }));
	    collisionMesh.receiveShadow = true;
	    //this.object3D.add(collisionMesh);
	    _this.mass = 0;
	    _this.body = new _cannon2.default.Body({
	      mass: _this.mass
	    });
	    _this.body.addShape(_this.shape);
	    // this.body.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0),Math.PI/2);
	    world.addBody(_this.body);
	    scene.add(_this.object3D);
	    return _this;
	  }
	
	  return GroundPlane;
	}(_Actor3.default);
	
	module.exports = GroundPlane;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(THREE) {'use strict';
	
	var _Actor2 = __webpack_require__(7);
	
	var _Actor3 = _interopRequireDefault(_Actor2);
	
	var _cannon = __webpack_require__(3);
	
	var _cannon2 = _interopRequireDefault(_cannon);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* global THREE */
	
	
	var Pen = function (_Actor) {
		_inherits(Pen, _Actor);
	
		function Pen(scene, world, center) {
			_classCallCheck(this, Pen);
	
			var _this = _possibleConstructorReturn(this, (Pen.__proto__ || Object.getPrototypeOf(Pen)).call(this, scene, world));
	
			_this.scene = scene;
			var self = _this;
	
			var loader = new THREE.OBJLoader();
			loader.setPath('./models/obj/fence/');
	
			loader.load('fence_v2.obj', function (object) {
				var loader = new THREE.TextureLoader();
				loader.setPath('./models/obj/fence/');
	
				var penMesh1 = object.children[0];
				var penMesh2 = object.children[1];
				var penMesh3 = object.children[2];
				self.object3D.add(penMesh1);
				self.object3D.add(penMesh2);
				self.object3D.add(penMesh3);
	
				penMesh1.material.map = loader.load('fenceDiffuse.png');
				penMesh1.material.specularMap = loader.load('fenceSpecular.png');
				penMesh1.castShadow = true;
				penMesh1.receiveShadow = true;
	
				penMesh2.material.map = loader.load('fenceDiffuse.png');
				penMesh2.material.specularMap = loader.load('fenceSpecular.png');
				penMesh2.castShadow = true;
				penMesh2.receiveShadow = true;
	
				penMesh3.material.map = loader.load('fenceDiffuse.png');
				penMesh3.material.specularMap = loader.load('fenceSpecular.png');
				penMesh3.castShadow = true;
				penMesh3.receiveShadow = true;
				/*
	   			let collisionMesh = new THREE.Mesh(
	   			      new THREE.SphereGeometry( self.radius, 6, 6 ),
	   			      new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true } )
	   			    );
	   			self.object3D.add(collisionMesh);
	   			*/
			});
	
			_this.object3D.position.set(center.x, center.y, center.z);
			var _scale = 0.05;
			_this.object3D.scale.set(_scale, _scale, _scale);
			_this.radius = 6 * _scale;
	
			//this.body.addShape(this.shape);
			//world.addBody(this.body);
	
			scene.add(_this.object3D);
	
			console.log(center);
	
			return _this;
		}
	
		return Pen;
	}(_Actor3.default);
	
	module.exports = Pen;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(THREE) {'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _Actor2 = __webpack_require__(7);
	
	var _Actor3 = _interopRequireDefault(_Actor2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* global THREE */
	
	
	var DynamicSign = function (_Actor) {
	  _inherits(DynamicSign, _Actor);
	
	  function DynamicSign(scene, world, texture_idx) {
	    _classCallCheck(this, DynamicSign);
	
	    var _this = _possibleConstructorReturn(this, (DynamicSign.__proto__ || Object.getPrototypeOf(DynamicSign)).call(this, scene, world));
	
	    console.log("before loader load");
	    var self = _this;
	
	    console.log(self.object3D);
	
	    scene.add(_this.object3D);
	    _this.width = window.innerWidth, _this.height = window.innerHeight / 2;
	    _this.size = 256;
	
	    _this.canvas = document.createElement('canvas');
	    _this.canvas.width = 128;
	    _this.canvas.height = 128;
	    _this.message = "Sheep Left";
	    _this.number = "0";
	    _this.ctx = _this.canvas.getContext('2d');
	
	    var loader = new THREE.OBJLoader();
	    loader.setPath('./models/obj/sign/');
	
	    loader.load('sign.obj', function (object) {
	      var loader = new THREE.TextureLoader();
	      loader.setPath('./models/obj/sign/');
	
	      var signMesh = object.children[0];
	
	      signMesh.material.materials[0].map = loader.load('wood_Base_Color.png');
	
	      self.texture = new THREE.Texture(self.canvas);
	      signMesh.material.materials[1].map = self.texture;
	      self.texture.needsUpdate = true;
	
	      self.object3D.add(signMesh.clone());
	      self.object3D.scale.set(10, 10, 10);
	    });
	    return _this;
	  }
	
	  _createClass(DynamicSign, [{
	    key: 'changeCanvas',
	    value: function changeCanvas() {
	      this.ctx.font = '18pt Arial';
	      this.ctx.fillStyle = 'red';
	      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	      this.ctx.fillStyle = 'white';
	      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	      this.ctx.fillStyle = 'black';
	      this.ctx.textAlign = "center";
	      this.ctx.textBaseline = "middle";
	      this.ctx.fillText(this.message, this.canvas.width / 2, this.canvas.height / 3);
	      this.ctx.font = '40pt Arial';
	      this.ctx.fillText(this.number, this.canvas.width / 2, this.canvas.height / 1.5);
	    }
	  }, {
	    key: 'setMessage',
	    value: function setMessage(value) {
	      this.message = value;
	      if (this.texture) {
	        this.texture.needsUpdate = true;
	      }
	    }
	  }, {
	    key: 'setNumber',
	    value: function setNumber(value) {
	      this.number = value;
	      this.changeCanvas();
	      if (this.texture) {
	        this.texture.needsUpdate = true;
	      }
	    }
	  }, {
	    key: 'tick',
	    value: function tick(delta) {
	      _get(DynamicSign.prototype.__proto__ || Object.getPrototypeOf(DynamicSign.prototype), 'tick', this).call(this, delta);
	
	      this.changeCanvas();
	    }
	  }]);
	
	  return DynamicSign;
	}(_Actor3.default);
	
	module.exports = DynamicSign;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(THREE) {'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _Actor2 = __webpack_require__(7);
	
	var _Actor3 = _interopRequireDefault(_Actor2);
	
	var _cannon = __webpack_require__(3);
	
	var _cannon2 = _interopRequireDefault(_cannon);
	
	var _waves = __webpack_require__(15);
	
	var _waves2 = _interopRequireDefault(_waves);
	
	var _waves3 = __webpack_require__(16);
	
	var _waves4 = _interopRequireDefault(_waves3);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* global THREE */
	
	
	var RipplePlane = function (_Actor) {
	  _inherits(RipplePlane, _Actor);
	
	  function RipplePlane(scene, world) {
	    _classCallCheck(this, RipplePlane);
	
	    var _this = _possibleConstructorReturn(this, (RipplePlane.__proto__ || Object.getPrototypeOf(RipplePlane)).call(this, scene, world));
	
	    _this.WIDTH = 64;
	    _this.NUM_TEXELS = _this.WIDTH * _this.WIDTH;
	    _this.BOUNDS = 10;
	    _this.BOUNDS_HALF = _this.BOUNDS * 0.5;
	    _this.timeLeft = 0;
	
	    _this.geometry = new THREE.PlaneBufferGeometry(_this.BOUNDS, _this.BOUNDS, _this.WIDTH - 1, _this.WIDTH - 1);
	
	    _this.maxRippleSize = 400.0;
	
	    _this.material = new THREE.ShaderMaterial({
	      uniforms: {
	        rippleOriginLeft: { type: '2fv', value: new THREE.Vector2(1000, 1000) },
	        rippleOriginRight: { type: '2fv', value: new THREE.Vector2(1000, 1000) },
	        timeLeft: { type: 'f', value: 0 },
	        timeRight: { type: 'f', value: 0 },
	        rippleSizeLeft: { type: 'f', value: _this.maxRippleSize },
	        rippleSizeRight: { type: 'f', value: _this.maxRippleSize },
	        falloff: { type: 'f', value: 10.0 }
	      },
	      vertexShader: _waves2.default,
	      fragmentShader: _waves4.default
	
	    });
	
	    var loader = new THREE.OBJLoader();
	    loader.setPath('./models/obj/island/');
	    var self = _this;
	
	    loader.load('island_2.obj', function (object) {
	      var island = object.children[0];
	      island.geometry.computeFaceNormals();
	      island.geometry.computeVertexNormals();
	      island.material = self.material;
	
	      self.object3D.add(island.clone());
	      scene.add(self.object3D);
	      //self.object3D.scale.set(0.1, 0.1, 0.1);
	    });
	
	    /*
	        this.object3D = new THREE.Mesh(
	          this.geometry, 
	          this.material
	        );
	    
	       this.object3D.rotation.x = -Math.PI / 2;
	       this.object3D.matrixAutoUpdate = false;
	       this.object3D.updateMatrix();
	    
	        scene.add(this.object3D);
	    */
	    return _this;
	  }
	
	  _createClass(RipplePlane, [{
	    key: 'acceptPunch',
	    value: function acceptPunch(punch_location, hand, power) {
	      punch_location = punch_location.clone().multiplyScalar(0.3);
	      punch_location = new THREE.Vector2(punch_location.x, -punch_location.z);
	      // punch_location = new THREE.Vector2(0,0);
	      console.log(punch_location);
	
	      if (hand == "left") {
	        this.material.uniforms["rippleOriginLeft"] = {
	          type: '2fv',
	          value: punch_location
	        };
	        this.material.uniforms["rippleSizeLeft"] = {
	          type: 'f',
	          value: this.maxRippleSize * power
	        };
	        this.timeLeft = 0;
	      } else {
	        this.material.uniforms["rippleOriginRight"] = {
	          type: '2fv',
	          value: punch_location
	        };
	        this.material.uniforms["rippleSizeRight"] = {
	          type: 'f',
	          value: this.maxRippleSize * power
	        };
	        this.timeRight = 0;
	      }
	    }
	  }, {
	    key: 'tick',
	    value: function tick(delta) {
	      this.timeLeft += delta / 2;
	      this.timeRight += delta / 2;
	      this.material.uniforms.timeLeft = {
	        type: 'f',
	        value: this.timeLeft
	      };
	      this.material.uniforms.timeRight = {
	        type: 'f',
	        value: this.timeRight
	      };
	      _get(RipplePlane.prototype.__proto__ || Object.getPrototypeOf(RipplePlane.prototype), 'tick', this).call(this, delta);
	    }
	  }]);
	
	  return RipplePlane;
	}(_Actor3.default);
	
	module.exports = RipplePlane;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = "varying vec2 vUv;\r\nvarying float noise;\r\nvarying vec3 fNormal;\r\nvarying vec4 vColor;\r\n\r\nuniform vec2 rippleOriginLeft;\r\nuniform vec2 rippleOriginRight;\r\nuniform float rippleSizeLeft;\r\nuniform float rippleSizeRight;\r\nuniform float falloff;\r\n\r\nuniform float timeLeft;\r\nuniform float timeRight;\r\n\r\nvoid main() {\r\n  fNormal = normal;\r\n  vUv = uv;\r\n  noise = 0.0;\r\n  \r\n  vec2 distLeft = ((rippleOriginLeft + 0.5) - uv); \r\n  float distLeftSquare = distLeft.x * distLeft.x + distLeft.y * distLeft.y;\r\n  vec3 newPosition = position;\r\n  float radiusLeftOutside = timeLeft;\r\n  float radiusLeftInside = timeLeft - 0.09;\r\n  float falloffLeft = falloff * (1.0 + distLeftSquare);\r\n\r\n  vec2 distRight = ((rippleOriginRight + 0.5) - uv); \r\n  float distRightSquare = distRight.x * distRight.x + distRight.y * distRight.y;\r\n  float radiusRightOutside = timeRight;\r\n  float radiusRightInside = timeRight - 0.09;\r\n  float falloffRight = falloff * (1.0 + distRightSquare);\r\n\r\n  vColor = vec4(0.3, 0.5, 0.0, 1.0);\r\n  vec4 colorLeft = vec4(0.0);\r\n  vec4 colorRight = vec4(0.0);\r\n\r\n  vec3 offsetLeft = vec3(0.0, 0.0, 0.0);\r\n  vec3 offsetRight = vec3(0.0, 0.0, 0.0);\r\n\r\n  if ( distLeftSquare < radiusLeftOutside * radiusLeftOutside &&\r\n       distLeftSquare > radiusLeftInside * radiusLeftInside) {\r\n\r\n    offsetLeft = vec3(0.0, rippleSizeLeft / (falloffLeft * falloffLeft), 0.0);\r\n    colorLeft = vec4(30.0/vec3(falloffLeft * falloffLeft), 0.0);\r\n  }\r\n  if (distRightSquare < radiusRightOutside * radiusRightOutside &&\r\n      distRightSquare > radiusRightInside * radiusRightInside) {\r\n\r\n    offsetRight = vec3(0.0, rippleSizeRight / (falloffRight * falloffRight), 0.0);\r\n    colorRight = vec4(30.0/vec3(falloffRight * falloffRight), 0.0);\r\n  }\r\n\r\n  vColor = vColor + colorRight + colorLeft;\r\n\r\n  newPosition = newPosition + offsetLeft + offsetRight;\r\n\r\n  gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );\r\n}\r\n\r\n"

/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = "varying vec2 vUv;\r\nvarying float noise;\r\nvarying vec3 fNormal;\r\nvarying vec4 vColor;\r\n\r\nuniform vec2 rippleOrigin;\r\nuniform float rippleSize;\r\n\r\nvoid main() {\r\n  vec3 light = vec3(1.0, 1.0, 1.0);\r\n  float dProd = max(0.0, dot(fNormal, light));\r\n\r\n  gl_FragColor = vec4(\r\n    vColor.x * dProd,\r\n    vColor.y * dProd,\r\n    vColor.z * dProd, \r\n    vColor.w\r\n  );\r\n\r\n}\r\n"

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(THREE) {'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _cannon = __webpack_require__(3);
	
	var _cannon2 = _interopRequireDefault(_cannon);
	
	var _Sheep = __webpack_require__(8);
	
	var _Sheep2 = _interopRequireDefault(_Sheep);
	
	var _Game = __webpack_require__(5);
	
	var _Game2 = _interopRequireDefault(_Game);
	
	var _Skybox = __webpack_require__(10);
	
	var _Skybox2 = _interopRequireDefault(_Skybox);
	
	var _GroundPlane = __webpack_require__(11);
	
	var _GroundPlane2 = _interopRequireDefault(_GroundPlane);
	
	var _Physics = __webpack_require__(18);
	
	var _Physics2 = _interopRequireDefault(_Physics);
	
	var _Pen = __webpack_require__(12);
	
	var _Pen2 = _interopRequireDefault(_Pen);
	
	var _DynamicSign = __webpack_require__(13);
	
	var _DynamicSign2 = _interopRequireDefault(_DynamicSign);
	
	var _Sign = __webpack_require__(28);
	
	var _Sign2 = _interopRequireDefault(_Sign);
	
	var _RipplePlane = __webpack_require__(14);
	
	var _RipplePlane2 = _interopRequireDefault(_RipplePlane);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* global WEBVR */
	/* global THREE */
	
	var Scene2 = function (_THREE$Scene) {
	    _inherits(Scene2, _THREE$Scene);
	
	    function Scene2(renderer) {
	        _classCallCheck(this, Scene2);
	
	        var _this = _possibleConstructorReturn(this, (Scene2.__proto__ || Object.getPrototypeOf(Scene2)).call(this));
	
	        _this.controls;
	
	        renderer.setClearColor(0xf0f0f0, 1);
	
	        _this.world = new _cannon2.default.World();
	        _this.world.gravity.set(0, -4.9, 0);
	        _this.world.broadphase = new _cannon2.default.NaiveBroadphase();
	        _this.world.solver.iterations = 10;
	
	        var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 10000);
	        var listener = new THREE.AudioListener();
	        camera.add(listener);
	        camera.position.y = 10;
	        //camera.rotation.x = 10;
	        _this.controls = new THREE.OrbitControls(camera, renderer.domElement);
	        _this.controls.enableZoom = true;
	        _this.controls.enableDamping = true;
	        _this.controls.dampingFactor = 0.25;
	
	        _this.tickingActors = [];
	
	        _this.add(camera);
	        _this.camera = camera;
	
	        _this.add(new THREE.HemisphereLight(0x808080, 0x606060));
	        var light = new THREE.DirectionalLight(0xffffff);
	        light.position.set(0, 6, 0);
	
	        light.castShadow = true;
	        light.shadow.camera.top = 2;
	        light.shadow.camera.bottom = -2;
	        light.shadow.camera.right = 2;
	        light.shadow.camera.left = -2;
	
	        light.shadow.mapSize.set(4096, 4096);
	        _this.add(light);
	
	        window.game = new _Game2.default(_this, _this.world);
	        _this.tickingActors.push(window.game);
	
	        _this.raycaster = new THREE.Raycaster();
	        _this.mouse = new THREE.Vector2();
	
	        var skybox = new _Skybox2.default(_this, _this.world);
	
	        _this.groundPlane = new _GroundPlane2.default(_this, _this.world);
	        _this.groundPlane.object3D.position.set(0, 1.7, 0);
	        _this.groundPlane.body.position.set(0, 1.7, 0);
	
	        _this.ripplePlane = new _RipplePlane2.default(_this, _this.world);
	        _this.tickingActors.push(_this.ripplePlane);
	        _this.ripplePlane.object3D.position.set(0, 2.2, 0);
	        _this.ripplePlane.object3D.scale.set(0.06, 0.06, 0.06);
	
	        _this.pen = new _Pen2.default(_this, _this.world, new THREE.Vector3(0, 2.18, 0));
	
	        _this.scoreSign = new _DynamicSign2.default(_this, _this.world);
	        _this.scoreSign.object3D.position.set(-2.2, 0, -5);
	        _this.scoreSign.object3D.rotation.y = 0.3;
	        _this.scoreSign.setMessage("Score");
	        _this.scoreSign.setNumber(0);
	        _this.tickingActors.push(_this.scoreSign);
	        _this.scoreSign.object3D.visible = false;
	
	        _this.timeSign = new _DynamicSign2.default(_this, _this.world);
	        _this.timeSign.object3D.position.set(2.5, 0, -5);
	        _this.timeSign.object3D.rotation.y = -0.2;
	        _this.timeSign.setMessage("Time");
	        _this.timeSign.setNumber(window.game.timeRemaining);
	        _this.tickingActors.push(_this.timeSign);
	        _this.timeSign.object3D.visible = false;
	
	        _this.freezeFrameTimer = 0;
	        _this.freezeFrameTime = 0;
	
	        _this.signs = [];
	        var sign_count = 6;
	        for (var i = 0; i < sign_count; i++) {
	            _this.signs[i] = new _Sign2.default(_this, _this.world, i);
	            var angle = -i * 2 * Math.PI / sign_count - Math.PI / 2;
	            _this.signs[i].object3D.position.x = 8 * Math.cos(i * 2 * Math.PI / sign_count);
	            _this.signs[i].object3D.position.z = 8 * Math.sin(i * 2 * Math.PI / sign_count);
	
	            _this.signs[i].object3D.rotation.y = angle;
	        }
	
	        _this.numSheep = 100;
	        for (var i = 0; i < _this.numSheep; i++) {
	            var sheep = new _Sheep2.default(_this, _this.world);
	            sheep.object3D.position.y = 2.23;
	            _this.tickingActors.push(sheep);
	        }
	
	        _this.bPause = false;
	
	        document.body.onkeyup = function (e) {
	            if (e.keyCode == 32) {
	                console.log("I pressed spacebar");
	                _this.bPause = !_this.bPause;
	            } else if (e.keyCode == 87) {
	                for (var _i = 0; _i < _this.tickingActors.length; _i++) {
	                    if (_this.tickingActors[_i].object3D.name == "Sheep") {
	                        _this.tickingActors[_i].object3D.position.set(_curPos);
	                        _this.tickingActors[_i].physicsEnabled = !_this.tickingActors[_i].physicsEnabled;
	                    }
	                }
	            }
	        };
	
	        document.body.onmousemove = function (e) {
	
	            // calculate mouse position in normalized device coordinates
	            // (-1 to +1) for both components
	
	            _this.mouse.x = event.clientX / window.innerWidth * 2 - 1;
	            _this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	        };
	
	        document.body.onmousedown = function (e) {
	            if (e.button == 0) {
	                // update the picking ray with the camera and mouse position
	                _this.raycaster.setFromCamera(_this.mouse, _this.camera);
	
	                // calculate objects intersecting the picking ray
	                var _intersects = _this.raycaster.intersectObject(_this.ripplePlane.object3D, true);
	                if (_intersects.length > 0) {
	                    var _impactPoint = _intersects[0].point;
	                    window.game.impact(_impactPoint, 0.0008, "right");
	                }
	                //groundPlane
	            }
	        };
	        return _this;
	    }
	
	    _createClass(Scene2, [{
	        key: 'beginGame',
	        value: function beginGame() {
	            for (var key in this.signs) {
	                var sign = this.signs[key];
	                sign.object3D.visible = false;
	            }
	            this.scoreSign.object3D.visible = true;
	            this.timeSign.object3D.visible = true;
	        }
	    }, {
	        key: 'tick',
	        value: function tick(delta) {
	            if (!this.bPause) {
	                // this.world.step(delta);
	                this.world.step(1 / 60);
	                this.controls.update();
	                tickActors(this.tickingActors, delta);
	            }
	        }
	    }]);
	
	    return Scene2;
	}(THREE.Scene);
	
	var tickActors = function tickActors(actors, delta) {
	    for (var i = 0; i < actors.length; i++) {
	        if (actors[i].tick) {
	            actors[i].tick(delta);
	        }
	    }
	};
	
	module.exports = Scene2;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(THREE) {'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _Actor2 = __webpack_require__(7);
	
	var _Actor3 = _interopRequireDefault(_Actor2);
	
	var _cannon = __webpack_require__(3);
	
	var _cannon2 = _interopRequireDefault(_cannon);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* global THREE */
	
	
	// import MathHelpers from '../utils/MathHelpers';
	
	
	var Physics = function (_Actor) {
	  _inherits(Physics, _Actor);
	
	  function Physics(scene, world) {
	    _classCallCheck(this, Physics);
	
	    var _this = _possibleConstructorReturn(this, (Physics.__proto__ || Object.getPrototypeOf(Physics)).call(this, scene, world));
	
	    _this.ticks = true;
	    _this.hackyYOffset = 0.56;
	
	    // this.object3D.scale.set(1.0, 1.0,1.0);
	    _this.physicsEnabled = false;
	    _this.totalScale = 0.15;
	    _this.physicsScale = new THREE.Vector3(1.0, 0.7, 0.5);
	
	    var self = _this;
	
	    var loader = new THREE.OBJLoader();
	    loader.setPath('./models/obj/sheep-v2/');
	
	    loader.load('sheep.obj', function (object) {
	      var loader = new THREE.TextureLoader();
	      loader.setPath('./models/obj/sheep-v2/');
	
	      var sheepMesh = object.children[0];
	      sheepMesh.material.map = loader.load('sheepDiffuse.png');
	      // mesh.material.specularMap = loader.load(
	      //   'sheepSpecularMap.png'
	      // );
	
	      var mesh = object.clone();
	      mesh.castShadow = true;
	      mesh.receiveShadow = true;
	      mesh.position.set(0, -0.3 * self.totalScale, 0);
	      mesh.scale.set(self.totalScale, self.totalScale, self.totalScale);
	      // mesh.rotation.set(-Math.PI/2, Math.PI,0);
	      self.object3D.add(mesh);
	      // self.object3D.position.set(0,2,0);
	    });
	
	    _this.shape = new _cannon2.default.Box(new _cannon2.default.Vec3(_this.physicsScale.x * _this.totalScale, _this.physicsScale.y * _this.totalScale, _this.physicsScale.z * _this.totalScale));
	    var collisionMesh = new THREE.Mesh(new THREE.BoxGeometry(_this.physicsScale.x * _this.totalScale, _this.physicsScale.y * _this.totalScale, _this.physicsScale.z * _this.totalScale), new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true }));
	    _this.object3D.add(collisionMesh);
	    _this.mass = 5;
	    _this.body = new _cannon2.default.Body({
	      mass: _this.mass
	    });
	    _this.body.addShape(_this.shape);
	    // this.body.angularVelocity.set(0,10,0);
	    // this.body.angularDamping = 0.5;
	
	
	    scene.add(_this.object3D);
	    world.addBody(_this.body);
	    return _this;
	  }
	
	  _createClass(Physics, [{
	    key: 'tick',
	    value: function tick(delta) {
	      _get(Physics.prototype.__proto__ || Object.getPrototypeOf(Physics.prototype), 'tick', this).call(this, delta);
	    }
	  }]);
	
	  return Physics;
	}(_Actor3.default);
	
	module.exports = Physics;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(THREE) {"use strict";
	
	var _Actor2 = __webpack_require__(7);
	
	var _Actor3 = _interopRequireDefault(_Actor2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* global THREE */
	
	
	var Sign = function (_Actor) {
	  _inherits(Sign, _Actor);
	
	  function Sign(scene, world, texture_idx) {
	    _classCallCheck(this, Sign);
	
	    var _this = _possibleConstructorReturn(this, (Sign.__proto__ || Object.getPrototypeOf(Sign)).call(this, scene, world));
	
	    var signTextures = ["controllers.png", "credits.png", "gamePlay.png", "gettingStarted.png", "splash1.png", "splash2.png"];
	
	    console.log("before loader load");
	    var self = _this;
	
	    console.log(self.object3D);
	
	    scene.add(_this.object3D);
	    _this.width = window.innerWidth, _this.height = window.innerHeight / 2;
	    _this.size = 256;
	
	    _this.canvas = document.createElement('canvas');
	    _this.canvas.width = 128;
	    _this.canvas.height = 128;
	    _this.ctx = _this.canvas.getContext('2d');
	
	    var loader = new THREE.OBJLoader();
	    loader.setPath('./models/obj/sign/');
	
	    loader.load('sign.obj', function (object) {
	      var loader = new THREE.TextureLoader();
	      loader.setPath('./models/obj/sign/');
	
	      var signMesh = object.children[0];
	
	      signMesh.material.materials[0].map = loader.load('wood_Base_Color.png');
	      signMesh.material.materials[1].map = loader.load(signTextures[texture_idx]);
	
	      self.object3D.add(signMesh.clone());
	      self.object3D.scale.set(10, 10, 10);
	    });
	
	    return _this;
	  }
	
	  return Sign;
	}(_Actor3.default);
	
	module.exports = Sign;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }
]);
//# sourceMappingURL=index.js.map