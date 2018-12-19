class MatrixCalculator {
  /**
   * @constructs MatrixCalculator()
   * @param 
   */

  constructor(filename, callBackFunc, imports) {
    // the bufferMap is used to store the matID and bufferMap
    this.bufferMap = {};

    imports = imports || {};
    imports.env = imports.env || {};
    imports.env.memoryBase = imports.env.memoryBase || 0;
    imports.env.tableBase = imports.env.tableBase || 0;
    if (!imports.env.memory) {
      // the number of pages, 64K per page
      imports.env.memory = new WebAssembly.Memory({ initial: 512 });
    }
    if (!imports.env.table) {
      imports.env.table = new WebAssembly.Table({ initial: 0, 
        element: 'anyfunc' });
    }

    this.imports = imports;
    this.SIZE = 65536;
    this.instance = null;
    var wasmInstance = this.loadWebAssembly(filename, imports);
    wasmInstance.then(instance => {this.instance = instance;
      this.opMatrixPtr = instance.exports.__Z14getOpMatrixPtrv();
      this.opMatrix = new Float32Array(this.imports.env.memory.buffer, this.opMatrixPtr, 16);
      this.resPtr = instance.exports.__Z9getResPtrv();
      this.res = new Float32Array(this.imports.env.memory.buffer, this.resPtr, this.SIZE);
      callBackFunc(this)});
  }

  loadWebAssembly(filename, imports) {
    return fetch(filename)
      .then(response => response.arrayBuffer())
      .then(buffer => WebAssembly.compile(buffer))
      .then(module => {
        return new WebAssembly.Instance(module, imports);
      });
  }

  loadMatrix(matID, matVal) {
    var matLength = matVal.length;
    var bufferPtr = this.instance.exports.__Z10loadMatrixii(matID, matLength);
    this.bufferMap[matID] = new Float32Array(this.imports.env.memory.buffer, bufferPtr, matLength);
    this.bufferMap[matID].set(matVal);
  }

  doMatMul(matID, opMatrix) {
    this.opMatrix.set(opMatrix); 
    var resLength = this.instance.exports.__Z6matMuliii(matID, this.bufferMap[matID].length, opMatrix.length);
    return resLength;
  }
}

// var matrixCalculator = new MatrixCalculator('./webassembly/matrix.wasm', runCal); 

// function runCal() {
//   // var instance = matrixCalculator.instance;
//   // var imports = matrixCalculator.imports;

//   // var mat1 = [];
//   // for (var i = 0;i < 65536;++ i) mat1.push(i);
//   // var mat2 = [];
//   // for (var i = 0;i < 30;++ i) mat2.push(i);

//   // matrixCalculator.loadMatrix(0, mat1);
//   // matrixCalculator.loadMatrix(1, mat2);

//   // var opMatrix = [];
//   // for (var i = 0;i < 16;++ i) opMatrix.push(i);

//   // var t0 = performance.now();
//   // var resLength = matrixCalculator.doMatMul(0, opMatrix);

//   // var t1 = performance.now();
//   // console.log('time in ms: ', t1 - t0);
//   // console.log('res', matrixCalculator.res);

//   // var opMatrix = [];
//   // for (var i = 0;i < 9;++ i) opMatrix.push(i);
//   // var resLength = matrixCalculator.doMatMul(1, opMatrix);
//   // console.log('res', matrixCalculator.res);
// }


