var vertexShaderText = [
  'precision mediump float;', '', 'attribute vec3 vertPosition;',
  'attribute vec3 vertColor;', 'varying vec3 fragColor;',
  'uniform mat4 mWorld;', 'uniform mat4 mView;', 'uniform mat4 mProj;', '',
  'void main()', '{', '  fragColor = vertColor;',
  '  gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);', '}'
].join('\n');

var fragmentShaderText = [
  'precision mediump float;', '', 'varying vec3 fragColor;', 'void main()', '{',
  '  gl_FragColor = vec4(fragColor, 1.0);', '}'
].join('\n');

//'gl_FragColor = vec4(wei_1 * r1 + wei_2 * r2 + wei_3 * r3, wei_1 * g1 + wei_2 * g2 + wei_3 * g3, wei_1 * b1 + wei_2 * b2 + wei_3 * b3, 1.0);'+
var CameraTest = function(type) {
  var ID = sender.getID();
  this.begin = function(canvas, cb, level) {
        var gl = getGL(canvas);
    // __texture_flag = 0;
    // __My_index_flag = 0;  
    // __PointBuffer = [];
    // __ColorBuffer = [];
    // __Tem_pointbuffer = [];
    // __Tem_colorbuffer = [];
    // __ActiveBuffer_vertex = [];
    // __ActiveBuffer_frag = [];
    // __ColorFlag = 1;  // 0代表不需要颜色，1代表需要颜色。
    // __Mworld_flag = 1;
    // __Mview_flag = 1;
    // __Mpro_flag = 1;
    // __Drawnumber = 1

    vetexID = 1;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.BACK);

    //
    // Create shaders
    //
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertCode);
    gl.shaderSource(fragmentShader, fragCod1e);

    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      console.error('ERROR compiling vertex shader!',
                    gl.getShaderInfoLog(vertexShader));
      return;
    }

    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      console.error('ERROR compiling fragment shader!',
                    gl.getShaderInfoLog(fragmentShader));
      return;
    }

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('ERROR linking program!', gl.getProgramInfoLog(program));
      return;
    }
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
      console.error('ERROR validating program!', gl.getProgramInfoLog(program));
      return;
    }

    //
    // Create buffer
    //
   
    var boxVertices = [
      // X, Y, Z           R, G, B
      // Top
      -1.0, 1.0, -1.0,   0.1, 0.1, 0.1,
      -1.0, 1.0, 1.0,    0.8, 0.5, 0.3,
      1.0, 1.0, 1.0,     0.2, 0.4, 0.7,
      1.0, 1.0, -1.0,    0.1, 1.0, 0.6,

      // Left
      -1.0,1.0,1.0,      0.75,0.25,0.5,
      -1.0,-1.0,1.0,     0.1,0.25,0.85,
      -1.0,-1.0,-1.0,    0.9,0.12,0.53,
      -1.0,1.0,-1.0,     0.3,0.4, 0.7,

      // Right
      1.0,1.0,1.0,       0.34,0.3,0.34,
      1.0,-1.0,1.0,      0.52,0.24,0.75,
      1.0,-1.0,-1.0,     0.1,0.26,0.75,
      1.0,1.0,-1.0,      0.9,0.95,0.75,

      // Front
      1.0,1.0,1.0,       0.4,0.0,0.7,
      1.0,-1.0,1.0,      0.98,0.0,0.54,
      -1.0,-1.0,1.0,     1.0,5.3,0.34,
      -1.0,1.0,1.0,      0.2,0.5,0.9,

      // Back
      1.0,1.0,-1.0,      0.34,0.3,0.34,
      1.0,-1.0,-1.0,     0.78,0.76,0.56,
      -1.0,-1.0,-1.0,    0.3,1.0,0.67,
      -1.0,1.0,-1.0,     0.1,1.0,0.2,

      // Bottom
      -1.0,-1.0,-1.0,    0.5,0.8,0.8,
      -1.0,-1.0,1.0,     0.3,0.7,0.1,
      1.0,-1.0,1.0,      0.6,0.6,0.5,
      1.0,-1.0,-1.0,     0.8,0.4,0.2,
    ];

  var boxIndices = [
      // Top
      0, 1, 2, 0, 2, 3,

      // Left
      5, 4, 6, 6, 4, 7,

      // Right
      8, 9, 10, 8, 10, 11,

      // Front
      13, 12, 14, 15, 14, 12,

      // Back
      16, 17, 18, 16, 18, 19,

      // Bottom
      21, 20, 22, 22, 20, 23
          ];

    var boxVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

    var boxIndexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices),
                  gl.STATIC_DRAW);


    //出现了这种特殊情况，需要加入这种特殊情况
    gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        positionAttribLocation, // Attribute location
        3,                      // Number of elements per attribute
        gl.FLOAT,               // Type of elements
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        0 // Offset from the beginning of a single vertex to this attribute
        );
    gl.vertexAttribPointer(
        colorAttribLocation, // Attribute location
        3,                   // Number of elements per attribute
        gl.FLOAT,            // Type of elements
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        3 * Float32Array.BYTES_PER_ELEMENT  // Offset from the beginning of a
                                            // single vertex to this attribute
        );
        console.log("Float32Array.BYTES_PER_ELEMENT",Float32Array.BYTES_PER_ELEMENT);

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);

    // Tell OpenGL state machine which program should be active.
    gl.useProgram(program);

    var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
    var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
    var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

    var worldMatrix = new Float32Array(16);
    var viewMatrix = new Float32Array(16);
    var projMatrix = new Float32Array(16);
    mat4.identity(worldMatrix);
    mat4.lookAt(viewMatrix, [2, 1, -5 ], [ 0, 0, 0 ], [ 0, 1, 0 ]);
    mat4.perspective(projMatrix, glMatrix.toRadian(45),
                     canvas.width / canvas.height, 0.1, 1000.0);
    //mat4.transpose(viewMatrix, viewMatrix);
    //mat4.transpose(projMatrix, projMatrix);
    // mat4.copy(__Mworld, worldMatrix);
    // mat4.copy(__Mview,viewMatrix);
    // mat4.copy(__Matrix0,projMatrix);
    // mat4.identity(worldMatrix);
    // mat4.identity(viewMatrix);
    // mat4.identity(projMatrix);
    //console.log("worldMatrix", worldMatrix);
    //console.log("viewMatrix", viewMatrix);
    //console.log("projMatrix", projMatrix);
    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

    var xRotationMatrix = new Float32Array(16);
    var yRotationMatrix = new Float32Array(16);

    //
    // Main render loop
    //
    var angle = 0;
    var count = 0;
    var ven, ren;
    var identityMatrix = new Float32Array(16);
    mat4.identity(identityMatrix);

    var count = 19;
    var angle = 0;
    var loop = function() {
      var frame = requestAnimationFrame(loop);
      angle = count++ / 20;
      mat4.rotate(yRotationMatrix, identityMatrix, angle, [ 0, 1, 0 ]);
      mat4.rotate(xRotationMatrix, identityMatrix, angle / 4, [ 1, 0, 0 ]);
      mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix);
      // mat4.copy(__Mworld, worldMatrix);
      // mat4.transpose(__Mworld, __Mworld);
      // mat4.transpose(__Mview, __Mview);
      // mat4.transpose(__Matrix0, __Matrix0);
      // mat4.mul(__Mview, __Mview, __Matrix0);
      //console.log("第一次计算", __Mview);
      // mat4.mul(__Mworld, __Mworld, __Mview);
      //console.log("传入的矩阵", __Mworld);
      /*
      console.log("第二次计算", __Mworld);
      mat4.copy(worldMatrix, __Mworld);
      console.log("转置之前", __Mworld);     
      mat4.transpose(worldMatrix, worldMatrix);
      mat4.identity(worldMatrix);
      console.log("最终结果", worldMatrix);
      */
      gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
      // __Matrix1 = my_m4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 256);
      //console.log("__Mworld", __Mworld);
      //console.log("__Mview", __Mview);
      //console.log("__Matrix0", __Matrix0);


      //console.log("aaaaaaaaaaaa");
      //    gl.clearColor(1.0, 1.0, 1.0, 1.0);
      gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
      gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);
      if (count == 20) {
                sender.getData(canvas, ID);
                cancelAnimationFrame(frame);
                cb(level);
      }
      
    };
    requestAnimationFrame(loop);
  };
};

