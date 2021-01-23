import * as THREE from 'three';
let BACK;
let COPLANAR;
let EPSILON;
let FRONT;
let SPANNING;
let Timelimit;
let returning;
let bind = function(fn, me) {
  return function() {
    return fn.apply(me, arguments);
  };
};
let slice = [].slice;
let extend = function(child, parent) {
  for (let key in parent) {
    if (hasProp.call(parent, key)) {
      child[key] = parent[key];
    }
  }
  function Ctor() {
    this.constructor = child;
  }
  Ctor.prototype = parent.prototype;
  child.prototype = new Ctor();
  child.__super__ = parent.prototype;
  return child;
};
let hasProp = {}.hasOwnProperty;
EPSILON = 1e-5;
COPLANAR = 0;
FRONT = 1;
BACK = 2;
SPANNING = 3;
returning = function(value, fn) {
  fn();
  return value;
};
Timelimit = (function() {
  function Timelimit(timeout, progress) {
    this.timeout = timeout;
    this.progress = progress;
    this.doTask = bind(this.doTask, this);
    this.finish = bind(this.finish, this);
    this.start = bind(this.start, this);
    this.check = bind(this.check, this);
  }
  Timelimit.prototype.check = function() {
    let elapsed;
    if (this.started == null) {
      return;
    }
    return returning((elapsed = Date.now() - this.started), (function(_this) {
      return function() {
        let ref, ref1, ref2;
        if ((ref = elapsed >= _this.timeout) != null ? ref : 2e308) {
          throw new Error('Timeout reached: ' + elapsed + '/' + _this.timeout + ', ' + ((ref1 = _this.tasks) != null ? ref1 : 0) + ' tasks unfinished ' + ((ref2 = _this.done) != null ? ref2 : 0) + ' finished.');
        }
      };
    })(this));
  };
  Timelimit.prototype.start = function() {
    if (this.started == null) {
      this.started = Date.now();
    }
    if (this.tasks == null) {
      this.tasks = 0;
    }
    if (this.total == null) {
      this.total = 0;
    }
    this.total += 1;
    this.tasks += 1;
    return this.check();
  };
  Timelimit.prototype.finish = function() {
    let elapsed;
    if ((this.tasks != null) && this.tasks < 1) {
      throw new Error('Finished more tasks than started');
    }
    this.tasks -= 1;
    elapsed = this.check();
    if (this.done == null) {
      this.done = 0;
    }
    this.done += 1;
    if (this.progress != null) {
      this.progress(this.done, this.total);
    }
    if (this.tasks === 0) {
      // 'Finished ' + this.done + ' tasks in ' + elapsed + '/' + this.timeout + ' ms';
      let result = this.started = this.done = this.total = void 0;
      return result;
    }
  };
  Timelimit.prototype.doTask = function(block) {
    let result;
    this.start();
    result = block();
    this.finish();
    return result;
  };
  return Timelimit;
})();
function ThreeBSP(treeIsh, matrix1, options) {
  let base;
  let ref;
  let ref1;
  let ref2;
  let ref3;
  this.matrix = matrix1;
  this.options = options != null ? options : {};
  this.intersect = bind(this.intersect, this);
  this.union = bind(this.union, this);
  this.subtract = bind(this.subtract, this);
  this.toGeometry = bind(this.toGeometry, this);
  this.toMesh = bind(this.toMesh, this);
  this.toTree = bind(this.toTree, this);
  this.withTimer = bind(this.withTimer, this);
  if ((this.matrix != null) && !(this.matrix instanceof THREE.Matrix4)) {
    this.options = this.matrix;
    this.matrix = void 0;
  }
  if (this.options == null) {
    this.options = {};
  }
  if (this.matrix == null) {
    this.matrix = new THREE.Matrix4();
  }
  if ((base = this.options).timer == null) {
    base.timer = new Timelimit((ref = (ref1 = this.options.timer) != null ? ref1.timeout : void 0) != null ? ref : this.options.timeout, (ref2 = (ref3 = this.options.timer) != null ? ref3.progress : void 0) != null ? ref2 : this.options.progress);
  }
  if (treeIsh !== undefined) {
    this.tree = this.toTree(treeIsh);
  }
}
ThreeBSP.prototype.withTimer = function(newTimer, block) {
  let oldTimer;
  oldTimer = this.options.timer;
  try {
    this.options.timer = newTimer;
    return block();
  } finally {
    this.options.timer = oldTimer;
  }
};
ThreeBSP.prototype.toTree = function(treeIsh) {
  let face, fn1, geometry, i, k, len, polygons, ref;
  if (treeIsh instanceof ThreeBSP.Node) {
    return treeIsh;
  }
  polygons = [];
  geometry = treeIsh instanceof THREE.Geometry ? treeIsh : treeIsh instanceof THREE.Mesh ? (treeIsh.updateMatrix(), this.matrix = treeIsh.matrix.clone(), treeIsh.geometry) : void 0;
  ref = geometry.faces;
  fn1 = (function(_this) {
    return function(face, i) {
      let faceVertexUvs, idx, l, len1, polygon, ref1, ref2, vIndex, vName, vertex;
      faceVertexUvs = (ref1 = geometry.faceVertexUvs) != null ? ref1[0][i] : void 0;
      if (faceVertexUvs == null) {
        faceVertexUvs = [new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2()];
      }
      polygon = new ThreeBSP.Polygon();
      ref2 = ['a', 'b', 'c', 'd'];
      for (vIndex = l = 0, len1 = ref2.length; l < len1; vIndex = ++l) {
        vName = ref2[vIndex];
        if ((idx = face[vName]) != null) {
          vertex = geometry.vertices[idx];
          vertex = new ThreeBSP.Vertex(vertex.x, vertex.y, vertex.z, face.vertexNormals[0], new THREE.Vector2(faceVertexUvs[vIndex].x, faceVertexUvs[vIndex].y));
          vertex.applyMatrix4(_this.matrix);
          polygon.vertices.push(vertex);
        }
      }
      return polygons.push(polygon.calculateProperties());
    };
  })(this);
  for (i = k = 0, len = ref.length; k < len; i = ++k) {
    face = ref[i];
    fn1(face, i);
  }
  return new ThreeBSP.Node(polygons, this.options);
};
ThreeBSP.prototype.toMesh = function(material) {
  if (material == null) {
    material = new THREE.MeshNormalMaterial();
  }
  return this.options.timer.doTask((function(_this) {
    return function() {
      let geometry;
      let mesh;
      geometry = _this.toGeometry();
      return returning((mesh = new THREE.Mesh(geometry, material)), function() {
        // mesh.position.getPositionFromMatrix(_this.matrix);
        mesh.position.setFromMatrixPosition(_this.matrix);
        return mesh.rotation.setFromRotationMatrix(_this.matrix);
      });
    };
  })(this));
};
ThreeBSP.prototype.toGeometry = function() {
  return this.options.timer.doTask((function(_this) {
    return function() {
      let geometry, matrix;
      matrix = new THREE.Matrix4().getInverse(_this.matrix);
      return returning((geometry = new THREE.Geometry()), function() {
        let k, len, polygon, ref, results;
        ref = _this.tree.allPolygons();
        results = [];
        for (k = 0, len = ref.length; k < len; k++) {
          polygon = ref[k];
          results.push(_this.options.timer.doTask(function() {
            let face, idx, l, polyVerts, ref1, results1, v, vertUvs, verts;
            polyVerts = (function() {
              let l, len1, ref1, results1;
              ref1 = polygon.vertices;
              results1 = [];
              for (l = 0, len1 = ref1.length; l < len1; l++) {
                v = ref1[l];
                results1.push(v.clone().applyMatrix4(matrix));
              }
              return results1;
            })();
            results1 = [];
            for (idx = l = 2, ref1 = polyVerts.length; 2 <= ref1 ? l < ref1 : l > ref1; idx = 2 <= ref1 ? ++l : --l) {
              verts = [polyVerts[0], polyVerts[idx - 1], polyVerts[idx]];
              vertUvs = (function() {
                let len1, m, ref2, ref3, results2;
                results2 = [];
                for (m = 0, len1 = verts.length; m < len1; m++) {
                  v = verts[m];
                  results2.push(new THREE.Vector2((ref2 = v.uv) != null ? ref2.x : void 0, (ref3 = v.uv) != null ? ref3.y : void 0));
                }
                return results2;
              })();
              face = (function(func, args, Ctor) {
                Ctor.prototype = func.prototype;
                let child = new Ctor;
                let result = func.apply(child, args);
                return Object(result) === result ? result : child;
              })(THREE.Face3, slice.call((function() {
                let len1, m, results2;
                results2 = [];
                for (m = 0, len1 = verts.length; m < len1; m++) {
                  v = verts[m];
                  results2.push(geometry.vertices.push(v) - 1);
                }
                return results2;
              })()).concat([polygon.normal.clone()]), function(){});
              geometry.faces.push(face);
              results1.push(geometry.faceVertexUvs[0].push(vertUvs));
            }
            return results1;
          }));
        }
        return results;
      });
    };
  })(this));
};
ThreeBSP.prototype.subtract = function(other) {
  return this.options.timer.doTask((function(_this) {
    return function() {
      return other.withTimer(_this.options.timer, function() {
        let ref;
        let them;
        let us;
        ref = [_this.tree.clone(), other.tree.clone()];
        us = ref[0];
        them = ref[1];
        us.invert().clipTo(them);
        them.clipTo(us).invert().clipTo(us).invert();
        return new ThreeBSP(us.build(them.allPolygons()).invert(), _this.matrix, _this.options);
      });
    };
  })(this));
};
ThreeBSP.prototype.union = function(other) {
  return this.options.timer.doTask((function(_this) {
    return function() {
      return other.withTimer(_this.options.timer, function() {
        let ref;
        let them;
        let us;
        ref = [_this.tree.clone(), other.tree.clone()];
        us = ref[0];
        them = ref[1];
        us.clipTo(them);
        them.clipTo(us).invert().clipTo(us).invert();
        return new ThreeBSP(us.build(them.allPolygons()), _this.matrix, _this.options);
      });
    };
  })(this));
};
ThreeBSP.prototype.intersect = function(other) {
  return this.options.timer.doTask((function(_this) {
    return function() {
      return other.withTimer(_this.options.timer, function() {
        let ref;
        let them;
        let us;
        ref = [_this.tree.clone(), other.tree.clone()];
        us = ref[0];
        them = ref[1];
        them.clipTo(us.invert()).invert().clipTo(us.clipTo(them));
        return new ThreeBSP(us.build(them.allPolygons()).invert(), _this.matrix, _this.options);
      });
    };
  })(this));
};
ThreeBSP.Vertex = (function(superClass) {
  extend(Vertex, superClass);
  function Vertex(x, y, z, normal, uv) {
    this.normal = normal != null ? normal : new THREE.Vector3();
    this.uv = uv != null ? uv : new THREE.Vector2();
    this.interpolate = bind(this.interpolate, this);
    this.lerp = bind(this.lerp, this);
    Vertex.__super__.constructor.call(this, x, y, z);
  }
  Vertex.prototype.clone = function() {
    return new ThreeBSP.Vertex(this.x, this.y, this.z, this.normal.clone(), this.uv.clone());
  };
  Vertex.prototype.lerp = function(v, alpha) {
    return returning(Vertex.__super__.lerp.apply(this, arguments), (function(_this) {
      return function() {
        _this.uv.add(v.uv.clone().sub(_this.uv).multiplyScalar(alpha));
        return _this.normal.lerp(v, alpha);
      };
    })(this));
  };
  Vertex.prototype.interpolate = function() {
    let args;
    let ref;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return (ref = this.clone()).lerp.apply(ref, args);
  };
  return Vertex;
})(THREE.Vector3);
ThreeBSP.Polygon = (function() {
  function Polygon(vertices, normal, w) {
    this.vertices = vertices != null ? vertices : [];
    this.normal = normal;
    this.w = w;
    this.subdivide = bind(this.subdivide, this);
    this.tessellate = bind(this.tessellate, this);
    this.classifySide = bind(this.classifySide, this);
    this.classifyVertex = bind(this.classifyVertex, this);
    this.invert = bind(this.invert, this);
    this.clone = bind(this.clone, this);
    this.calculateProperties = bind(this.calculateProperties, this);
    if (this.vertices.length) {
      this.calculateProperties();
    }
  }
  Polygon.prototype.calculateProperties = function() {
    return returning(this, (function(_this) {
      return function() {
        let a;
        let b;
        let c;
        let ref;
        ref = _this.vertices;
        a = ref[0];
        b = ref[1];
        c = ref[2];
        _this.normal = b.clone().sub(a).cross(c.clone().sub(a)).normalize();
        _this.w = _this.normal.clone().dot(a);
        return _this.w;
      };
    })(this));
  };
  Polygon.prototype.clone = function() {
    let v;
    return new ThreeBSP.Polygon((function() {
      let k;
      let len;
      let ref;
      let results;
      ref = this.vertices;
      results = [];
      for (k = 0, len = ref.length; k < len; k++) {
        v = ref[k];
        results.push(v.clone());
      }
      return results;
    }).call(this), this.normal.clone(), this.w);
  };
  Polygon.prototype.invert = function() {
    return returning(this, (function(_this) {
      return function() {
        _this.normal.multiplyScalar(-1);
        _this.w *= -1;
        return _this.vertices.reverse();
      };
    })(this));
  };
  Polygon.prototype.classifyVertex = function(vertex) {
    let side;
    side = this.normal.dot(vertex) - this.w;
    switch (false) {
      case !(side < -EPSILON):
        return BACK;
      case !(side > EPSILON):
        return FRONT;
      default:
        return COPLANAR;
    }
  };
  Polygon.prototype.classifySide = function(polygon) {
    let back;
    let front;
    let k;
    let len;
    let ref;
    let ref1;
    let tally;
    let v;
    ref = [0, 0];
    front = ref[0];
    back = ref[1];
    tally = (function(_this) {
      return function(v) {
        switch (_this.classifyVertex(v)) {
          case FRONT:
            let dataFront = front += 1;
            return dataFront;
          case BACK:
            let dataBack = back += 1;
            return dataBack;
        }
      };
    })(this);
    ref1 = polygon.vertices;
    for (k = 0, len = ref1.length; k < len; k++) {
      v = ref1[k];
      tally(v);
    }
    if (front > 0 && back === 0) {
      return FRONT;
    }
    if (front === 0 && back > 0) {
      return BACK;
    }
    if ((front === back && back === 0)) {
      return COPLANAR;
    }
    return SPANNING;
  };
  Polygon.prototype.tessellate = function(poly) {
    let b;
    let count;
    let f;
    let i;
    let j;
    let k;
    let len;
    let polys;
    let ref;
    let ref1;
    let ref2;
    let t;
    let ti;
    let tj;
    let v;
    let vi;
    let vj;
    ref = {
      f: [],
      b: [],
      count: poly.vertices.length
    };
    f = ref.f;
    b = ref.b;
    count = ref.count;
    if (this.classifySide(poly) !== SPANNING) {
      return [poly];
    }
    ref1 = poly.vertices;
    for (i = k = 0, len = ref1.length; k < len; i = ++k) {
      vi = ref1[i];
      vj = poly.vertices[(j = (i + 1) % count)];
      ref2 = (function() {
        let l;
        let len1;
        let ref2;
        let results;
        ref2 = [vi, vj];
        results = [];
        for (l = 0, len1 = ref2.length; l < len1; l++) {
          v = ref2[l];
          results.push(this.classifyVertex(v));
        }
        return results;
      }).call(this);
      ti = ref2[0];
      tj = ref2[1];
      if (ti !== BACK) {
        f.push(vi);
      }
      if (ti !== FRONT) {
        b.push(vi);
      }
      if ((ti | tj) === SPANNING) {
        t = (this.w - this.normal.dot(vi)) / this.normal.dot(vj.clone().sub(vi));
        v = vi.interpolate(vj, t);
        f.push(v);
        b.push(v);
      }
    }
    return returning((polys = []), (function(_this) {
      return function() {
        if (f.length >= 3) {
          polys.push(new ThreeBSP.Polygon(f));
        }
        if (b.length >= 3) {
          return polys.push(new ThreeBSP.Polygon(b));
        }
      };
    })(this));
  };
  Polygon.prototype.subdivide = function(polygon, coplanarFront, coplanarBack, front, back) {
    let k;
    let len;
    let poly;
    let ref;
    let results;
    let side;
    ref = this.tessellate(polygon);
    results = [];
    for (k = 0, len = ref.length; k < len; k++) {
      poly = ref[k];
      side = this.classifySide(poly);
      switch (side) {
        case FRONT:
          results.push(front.push(poly));
          break;
        case BACK:
          results.push(back.push(poly));
          break;
        case COPLANAR:
          if (this.normal.dot(poly.normal) > 0) {
            results.push(coplanarFront.push(poly));
          } else {
            results.push(coplanarBack.push(poly));
          }
          break;
        default:
          throw new Error('BUG: Polygon of classification ' + side + ' in subdivision"');
      }
    }
    return results;
  };
  return Polygon;
})();
ThreeBSP.Node = (function() {
  Node.prototype.clone = function() {
    let node;
    return returning((node = new ThreeBSP.Node(this.options)), (function(_this) {
      return function() {
        let ref;
        node.divider = (ref = _this.divider) != null ? ref.clone() : void 0;
        node.polygons = _this.options.timer.doTask(function() {
          let k, len, p, ref1, results;
          ref1 = _this.polygons;
          results = [];
          for (k = 0, len = ref1.length; k < len; k++) {
            p = ref1[k];
            results.push(p.clone());
          }
          return results;
        });
        node.front = _this.options.timer.doTask(function() {
          let ref1;
          return (ref1 = _this.front) != null ? ref1.clone() : void 0;
        });
        node.back = _this.options.timer.doTask(function() {
          let ref1;
          return (ref1 = _this.back) != null ? ref1.clone() : void 0;
        });
        return node.back;
      };
    })(this));
  };
  function Node(polygons, options) {
    this.options = options != null ? options : {};
    this.clipTo = bind(this.clipTo, this);
    this.clipPolygons = bind(this.clipPolygons, this);
    this.invert = bind(this.invert, this);
    this.allPolygons = bind(this.allPolygons, this);
    this.isConvex = bind(this.isConvex, this);
    this.build = bind(this.build, this);
    this.clone = bind(this.clone, this);
    if ((polygons != null) && !(polygons instanceof Array)) {
      this.options = polygons;
      polygons = void 0;
    }
    this.polygons = [];
    this.options.timer.doTask((function(_this) {
      return function() {
        if ((polygons != null) && polygons.length) {
          return _this.build(polygons);
        }
      };
    })(this));
  }
  Node.prototype.build = function(polygons) {
    return returning(this, (function(_this) {
      return function() {
        let polys, results, side, sides;
        sides = {
          front: [],
          back: []
        };
        if (_this.divider == null) {
          _this.divider = polygons[0].clone();
        }
        _this.options.timer.doTask(function() {
          let k, len, poly, results;
          results = [];
          for (k = 0, len = polygons.length; k < len; k++) {
            poly = polygons[k];
            results.push(_this.options.timer.doTask(function() {
              return _this.divider.subdivide(poly, _this.polygons, _this.polygons, sides.front, sides.back);
            }));
          }
          return results;
        });
        results = [];
        for (side in sides) {
          if (!hasProp.call(sides, side)) continue;
          polys = sides[side];
          if (polys.length) {
            if (_this[side] == null) {
              _this[side] = new ThreeBSP.Node(_this.options);
            }
            results.push(_this[side].build(polys));
          } else {
            results.push(void 0);
          }
        }
        return results;
      };
    })(this));
  };
  Node.prototype.isConvex = function(polys) {
    let inner, k, l, len, len1, outer;
    for (k = 0, len = polys.length; k < len; k++) {
      inner = polys[k];
      for (l = 0, len1 = polys.length; l < len1; l++) {
        outer = polys[l];
        if (inner !== outer && outer.classifySide(inner) !== BACK) {
          return false;
        }
      }
    }
    return true;
  };
  Node.prototype.allPolygons = function() {
    return this.options.timer.doTask((function(_this) {
      return function() {
        var ref, ref1;
        return _this.polygons.slice().concat(((ref1 = _this.front) != null ? ref1.allPolygons() : void 0) || []).concat(((ref = _this.back) != null ? ref.allPolygons() : void 0) || []);
      };
    })(this));
  };
  Node.prototype.invert = function() {
    return returning(this, (function(_this) {
      return function() {
        return _this.options.timer.doTask(function() {
          let flipper, k, l, len, len1, poly, ref, ref1, ref2;
          ref = _this.polygons;
          for (k = 0, len = ref.length; k < len; k++) {
            poly = ref[k];
            _this.options.timer.doTask(function() {
              return poly.invert();
            });
          }
          ref1 = [_this.divider, _this.front, _this.back];
          for (l = 0, len1 = ref1.length; l < len1; l++) {
            flipper = ref1[l];
            _this.options.timer.doTask(function() {
              return flipper != null ? flipper.invert() : void 0;
            });
          }
          return ref2 = [_this.back, _this.front], _this.front = ref2[0], _this.back = ref2[1], ref2;
        });
      };
    })(this));
  };
  Node.prototype.clipPolygons = function(polygons) {
    return this.options.timer.doTask((function(_this) {
      return function() {
        let back, front, k, len, poly;
        if (!_this.divider) {
          return polygons.slice();
        }
        front = [];
        back = [];
        for (k = 0, len = polygons.length; k < len; k++) {
          poly = polygons[k];
          _this.options.timer.doTask(function() {
            return _this.divider.subdivide(poly, front, back, front, back);
          });
        }
        if (_this.front) {
          front = _this.front.clipPolygons(front);
        }
        if (_this.back) {
          back = _this.back.clipPolygons(back);
        }
        if (_this.back) {
          return front.concat(back);
        } else {
          return front;
        }
      };
    })(this));
  };
  Node.prototype.clipTo = function(node) {
    return returning(this, (function(_this) {
      return function() {
        return _this.options.timer.doTask(function() {
          let ref, ref1;
          _this.polygons = node.clipPolygons(_this.polygons);
          if ((ref = _this.front) != null) {
            ref.clipTo(node);
          }
          return (ref1 = _this.back) != null ? ref1.clipTo(node) : void 0;
        });
      };
    })(this));
  };
  return Node;
})();
 
export default ThreeBSP;