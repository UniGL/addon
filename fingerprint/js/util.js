// Load a text resource from a file over the network

/*=============map部分===============================开头============================================*/
  //建立program的map
  var Program_data = function(){
    this.activeFlag = undefined //这个program是否被激活
      this.programName = undefined; //program的名字
    this.vertexSource = undefined; //vetex的source
    this.fragSource = undefined //frag的source
    this.shaderJsID = undefined; //Js code 执行的ID
      this.attriData = [];  //重新建立一个新的Attri_data object的array
    this.uniformData = []; //重新建立一个新的Uniform_data object的array
    this.varyingData = []; //重新建立一个新的Varying_data object的array
    }
    var ProgramDataMap = [];
    
    var Shader_data = function(){
    this.shaderTpye = undefined; //35633为vetex 35632为frag
    this.shaderName = undefined; //shader的实际赋值
    this.shaderSource = undefined; //shader的源代码（这块是直接用来修改的）
    this.shaderJsID = undefined; //Js code 执行的ID
    }
    var ShaderDataMap = [];
    
    //建立buffer的map
    var Buffer_data = function(){
    this.bufferName = undefined;  //bindBuffer 时候使用的名字  
    this.bufferType = undefined;  //依照这个来判断是array还是element_array
    this.bufferData = undefined;  //存储buffer本身的数值
    this.activeFlag = undefined;  //ARRAY_BUFFER绑定状态
    this.activeElement = undefined;  //ELEMENT_ARRAY_BUFFER绑定状态
    
    }
    var BufferDataMap = [];
    
    // 建立attribute的map
    var Attri_data = function(){
    this.programName = undefined; //这个位置是在哪一个program的
    this.shaderName = undefined;  //在glsl代码中对应的attribute的变量名
    this.attriEleNum = undefined;  //记录attribute最终要变成vec2还是vc3
    this.uniformData = []; //这个是记录最终生成的数值，直接通过uniform传入的
    }
    var AttriDataMap = [];
    
    //建立random number program 和 shadername对应关系的map
    var Attribute_loc = function(){
    this.randomNumber = undefined;  //这块记录的就是随机产生的位置数字
    this.shaderName = undefined;    //在glsl代码中对应的attribute的变量名
    this.programName = undefined;   //这个位置是在哪一个program的 
    }
    var AttributeLocMap = [];
    
    
    //两个uniform的map
    //存储uniform的数据
    //这块的uniform类行vec2，vec3，vec4为2，3，4，matrix2，3，4为12，13，14
    var Uniform_data = function(){
    this.programName = undefined; //这个位置是在哪一个program的
    this.shaderName = undefined;  //在glsl代码中对应的uniform的变量名
    this.uniformNum = undefined;  //这个uniform是vec2，vec3，vec4
    this.uniformType = undefined;  //这个类型是int 0 还是 float 1
    this.uniformData = undefined;  // 这个uniform的数据
    this.uniformActive = undefined;  //这个uniform是否要被输入到shader
    }
    var UniformDataMap = [];
    
    
    //储存uniform的location
    var Uniform_loc = function(){
    this.randomNumber = undefined;  //这块记录的就是随机产生的位置数字
    this.shaderName = undefined;    //在glsl代码中对应的attribute的变量名
    this.programName = undefined;   //这个位置是在哪一个program的 
    }
    var UniformLocMap = [];
    
    // 建立varying的map
    var Varying_data = function(){
    this.shaderName = undefined;  //在glsl代码中对应的varying的变量名
    this.varyEleNum = undefined;  //记录varying最终要变成vec2还是vc3
    this.uniformData = []; //这个是记录最终生成的数值，直接通过uniform传入的
    }

    var vetexID;
    var ori_shaderSource;
    var Compiler = GLSL();
    // var Compiler_wasm = GLSL_wasm();
    var ll;
    var tt;
    var compiled;
    var compiled_wasm;
    
    var matrixCalculator = new MatrixCalculator('./wasm/matrix.wasm', runCal);  
    /*==========================map部分======================================结尾*/
function runCal(){
rewrite = function(gl, canvas){
  // console.log("version 5");
  ProgramDataMap = [];
  ShaderDataMap = [];
  BufferDataMap = [];
  AttriDataMap = [];
  AttributeLocMap = [];
  UniformDataMap = [];
  UniformLocMap = [];
  /*~~~~~~~~~~~~~~~~~~~~ program 部分 和 shader 部分 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  //重新定义createShader
  gl.my_createShader = gl.__proto__.createShader;
  gl.createShader = function (shaderTpye){
    // console.log("test");
    var newData = new Shader_data;
    newData.shaderTpye = shaderTpye;
    newData.shaderName = gl.my_createShader(shaderTpye);
    ShaderDataMap.push(newData);
    return newData.shaderName;
  }
  
  gl.my_shaderSource = gl.__proto__.shaderSource;
  gl.shaderSource = function(shaderName,shaderSource){

    ori_shaderSource = shaderSource;
    shaderSource = ChangeShader(shaderSource);
    gl.my_shaderSource(shaderName,shaderSource);

    //console.log(ShaderDataMap);

    for (var i = 0; i < ShaderDataMap.length; i++){
      if (ShaderDataMap[i].shaderName == shaderName){
        ShaderDataMap[i].shaderSource = shaderSource;
          if (ShaderDataMap[i].shaderTpye == 35633){
            ShaderDataMap[i].shaderJsID = vetexID;
            if ( (vetexID >= 2) && (vetexID <= 4)  ){
              // console.log(ori_shaderSource);
              compiled = Compiler.compile(ori_shaderSource,0);
              // console.log(compiled);
              eval(compiled);  
            }else if (vetexID >= 5){
              // console.log("eval wasm");
              compiled_wasm = Compiler.compile(ori_shaderSource,1);
              // console.log(compiled_wasm);
              // console.log("******************");
            }
          }  
        return;
      }
    }
  }
  
  gl.my_createProgram = gl.__proto__.createProgram;
  gl.createProgram = function (){
    var newData = new Program_data;
    newData.programName = gl.my_createProgram();
    ProgramDataMap.push(newData);
    return newData.programName;
  }
  
  gl.my_attachShader = gl.__proto__.attachShader;
  gl.attachShader = function (programName, shaderName){
    //要先实现原本的功能，要不后面都一直报错
    gl.my_attachShader(programName, shaderName);
    var shaderData = new Shader_data;
    shaderData = getShaderSource(shaderName);
    //console.log("shaderData",shaderData);
    for (var i = 0; i < ProgramDataMap.length; i++){
    if (ProgramDataMap[i].programName == programName){
      if (shaderData.shaderTpye == 35633){
      //console.log("shaderData.shaderSource -->-->",shaderData.shaderSource);
      ProgramDataMap[i].vertexSource = shaderData.shaderSource;
      ProgramDataMap[i].shaderJsID = shaderData.shaderJsID;
      } 
      else
      ProgramDataMap[i].fragSource = shaderData.shaderSource; 
      //console.log(shaderData.shaderSource);
      ProgramDataMap[i].activeFlag = 0;
      return;
    }
    }
  }
  
  getShaderSource = function(shaderName){
    for (var i = 0; i < ShaderDataMap.length; i++){
    if (ShaderDataMap[i].shaderName == shaderName)
      return (ShaderDataMap[i]);
    }
  }

  gl.my_useProgram =  gl.__proto__.useProgram;
  gl.useProgram = function (programName){     
    //这块执行原函数，只需要知道使用了哪一个program就可以了
    gl.my_useProgram(programName);
    for (var i = 0; i < ProgramDataMap.length; i++)
    //console/log("我们运行了useProgram");
    if (ProgramDataMap[i].programName == programName){
      //console.log("我们激活了program的状态");
      ProgramDataMap[i].activeFlag = 1;
    } 
    else
      ProgramDataMap[i].activeFlag = 0;
    
    

  }

  /*^^^^^^^^^^^^program 部分 和 shader 部分 ^^^^^^^^^^^^^^^^^^^^^^^^*/

  /*~~~~~~~~~~~~~~~~~~~~ buffer 部分 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  //bindbuffer 用于激活  而且bind的buffer有两种形式
  //gl.ARRAY_BUFFER 34962
  //gl.ELEMENT_ARRAY_BUFFER 34963
  gl.my_bindBuffer = gl.__proto__.bindBuffer;
  gl.bindBuffer = function (bufferType, bufferName){
    //console.log("bufferName",bufferName);
    //bindbuffernum ++;
    initBufferMap(bufferType); // 重新把之前所有active的buffer状态归位inactive
    addBufferMap(bufferType, bufferName);  //判断是否拥有这条buffer，如果没有的话就直接加入这个buffer
    activeBufferMap(bufferType, bufferName); //激活当前的buffer
  
  
    //这块还是需要让原始代码运行
    // *******************************这块在去掉另外一套系统后，应该可以删除
    gl.my_bindBuffer(bufferType, bufferName);
  }
    /*------------用在bindbuffer 的几个函数-------------*/   
  // 重新把之前所有active的buffer状态归位inactive
  initBufferMap = function(bufferType){

    if (bufferType == 34963){
      for (i = 0; i < BufferDataMap.length; i++)
        BufferDataMap[i].activeElement = 0;
    }
    else{
      for (i = 0; i < BufferDataMap.length; i++)
        BufferDataMap[i].activeFlag = 0;  

    }
  }
  
  //判断是否拥有这条buffer，如果没有的话就直接加入这个buffer
  addBufferMap = function(bufferType, bufferName){
    //如果出现了重复的buffer，要在原始基础上直接赋值
    for (i = 0; i < BufferDataMap.length; i++){
      if (BufferDataMap[i].bufferName == bufferName)
        return;
    }
    var newData = new Buffer_data();
    newData.bufferType = bufferType;
    newData.bufferName = bufferName;
    BufferDataMap.push(newData);
    return;
  }
  
  //激活当前的buffer
  activeBufferMap = function(bufferType, bufferName){
    for (i = 0; i < BufferDataMap.length; i++)
    if (BufferDataMap[i].bufferName == bufferName){
      if (bufferType == 34962)
        BufferDataMap[i].activeFlag = 1;
      else
        BufferDataMap[i].activeElement = 1;
      return;
    }
  }
  /*----------------------------------------------------*/
  //重新定义bufferData
  gl.my_glbufferData = gl.__proto__.bufferData;
  gl.bufferData = function (bufferType, bufferData, c){
    if (bufferType == 34962){
      for (i = 0; i < BufferDataMap.length; i++){
        if (BufferDataMap[i].activeFlag == 1)
          BufferDataMap[i].bufferData = bufferData;
      }
    }else{
      for (i = 0; i < BufferDataMap.length; i++){
        if (BufferDataMap[i].activeElement == 1)
          BufferDataMap[i].bufferData = bufferData;
      }
    }
  } 
  
  /*^^^^^^^^^^^^^^^^^^^^^^buffer 部分 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/



  /*~~~~~~~~~~~~~~~~~~~~ attribute 部分 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

  /*------------gl.getAttribLocation------开头-------------*/
  //重新定义getAttribLocation
  //这块需要建立一个新的map，记录随机产生的数字和其对应关系的
  gl.my_getAttribLocation = gl.__proto__.getAttribLocation;
  gl.getAttribLocation = function (programName, shaderName){
    for (i = 0; i < AttributeLocMap.length; i++){
    if ((AttributeLocMap[i].programName == programName) && (AttributeLocMap[i].shaderName == shaderName))
      return AttributeLocMap[i].randomNumber;
    } 
    var newData = new Attribute_loc;
    newData.randomNumber = creatNumber(); // 通过creatNumber得到一个确定的函数
    newData.programName = programName;
    newData.shaderName = shaderName;
    AttributeLocMap.push(newData);
    return newData.randomNumber;   //将位置的数值返回以方便在gl.vertexAttribPointer中将两个map进行关连
  
  }
  
  
  //用getAttribLocation的函数
  var __Locnumber = 100; //初始化函数
  //单独建立函数的原因是在单个program的时候，单一__Locnumber是可行的，我担心在three.js多program和多attribute的情况下，可能会出问题，先暂时写成这样，调试的时候再做修改。
  creatNumber = function(){
    __Locnumber++;
    return __Locnumber;
  }
  /*--------------------------------------------------------*/ 




  gl.my_vertexAttribPointer = gl.__proto__.vertexAttribPointer;
  gl.vertexAttribPointer = function (positionAttributeLocation, size, type, normalize, stride, offset){
  
    //先提取getAttribLocation能获得的glsl部分的信息
    var ShaderData = new Attribute_loc;
    ShaderData = getShaderData(positionAttributeLocation);
  
    //提取bufferdata中的信息
    var BufferData = new Buffer_data;
    BufferData = getBufferData();
 
    //在这里生成一个新的attribute条目
    // 这个版本需要考虑重复赋值这种情况
    addAttriMap(ShaderData,BufferData,size,stride/4,offset/4);
  }
  
  /*------------gl.vertexAttribPointer------开头-------------*/
  //用在vertexAttribPointer中的函数
  //提取getAttribLocation能获得的glsl部分的信息
  var getShaderData = function(positionAttributeLocation){
    for (var i = 0; i < AttributeLocMap.length; i++){
    if (AttributeLocMap[i].randomNumber == positionAttributeLocation)
      return AttributeLocMap[i];
    }
  
  }
  
  //提取bufferdata中的信息
  var getBufferData = function(){
    for (var i = 0; i < BufferDataMap.length; i++){
    if (BufferDataMap[i].activeFlag == 1)
      return BufferDataMap[i];
    }
  }
  
  //考虑了attribute会被重复赋值的情况。
  //需要判断是否需要重组bufferdata
  var addAttriMap = function( ShaderData = new Attribute_loc,BufferData = new Buffer_data,size,stride,offset){
    //这是一种特殊情况
    if (stride == 0)
    stride = size;
    var newAttri = new Attri_data;
    //var temData = [];
    newAttri.shaderName = ShaderData.shaderName;
    newAttri.programName = ShaderData.programName;
    for (var i = 0; i < AttriDataMap.length; i++){
    if ( (newAttri.shaderName == AttriDataMap[i].shaderName) && (newAttri.programName == AttriDataMap[i].programName) ){
      AttriDataMap[i].attriEleNum = size;
      for (var i = 0; i * stride < BufferData.bufferData.length; i++){
        for (var j = i * stride + offset; j < i * stride + offset + size; j++)
          AttriDataMap[i].uniformData = AttriDataMap[i].uniformData.concat(BufferData.bufferData[j]);
      }
      return;
    }
    }
    newAttri.attriEleNum = size;
    for (var i = 0; i * stride < BufferData.bufferData.length; i++){
      for (var j = i * stride + offset; j < i * stride + offset + size; j++)
        newAttri.uniformData = newAttri.uniformData.concat(BufferData.bufferData[j]);
    }
    //console.log("newAttri",newAttri);
  
    // 将attribute加入map
    AttriDataMap.push(newAttri);
  }
  
  /*----------------------------------------------------------------------*/ 
  

/*^^^^^^^^^^^^^^^^^^^^^^^^attribute 部分^^^^^^^^^^^^^^^^^^^^^^^^*/

/*~~~~~~~~~~~~~~~~~~~~~ uniform 部分 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//my_getUniformLocation
  //这块需要建立一个新的map，记录随机产生的数字和其对应关系的
  gl.my_getUniformLocation = gl.__proto__.getUniformLocation;
  gl.getUniformLocation = function (programName, shaderName){
    // 如果出现了重复的，就直接返回原始值
    for (i = 0; i < UniformLocMap.length;i++){
    if ((UniformLocMap[i].programName == programName) && (UniformLocMap[i].shaderName == shaderName))
      return UniformLocMap[i].randomNumber;
    }
  
    var newData = new Uniform_loc;
    newData.randomNumber = creatNumber();
    newData.programName = programName;
    newData.shaderName = shaderName;
    UniformLocMap.push(newData);
  
  
    //开启map状态
    return newData.randomNumber;   
  
  }
  
  //进入uniform 赋值区域  需要重新定义大量函数， 放在一起定义就好了
  //这个类型是int 0 还是 float 1
  //传入loc，data，type, num
  //个数是1的情况
  gl.my_uniform1i = gl.__proto__.uniform1i;
  gl.uniform1i = function (uniformLoc, uniformData){
    AddUniformMap(uniformLoc, uniformData, 0, 1);
  }
  
  gl.my_uniform1iv = gl.__proto__.uniform1iv;
  gl.uniform1iv = function (uniformLoc, uniformData){
    AddUniformMap(uniformLoc, uniformData, 0, 1);
  }
  
  gl.my_uniform1f = gl.__proto__.uniform1f;
  gl.uniform1f = function (uniformLoc, uniformData){
    AddUniformMap(uniformLoc, uniformData, 1, 1);
  }
  
  gl.my_uniform1fv = gl.__proto__.uniform1fv;
  gl.uniform1fv = function (uniformLoc, uniformData){
    AddUniformMap(uniformLoc, uniformData, 1, 1);
  }
  
  //个数是2的情况
  gl.my_uniform2i = gl.__proto__.uniform2i;
  gl.uniform2i = function (uniformLoc, uniformData0, uniformData1){
    var uniformData = [uniformData0, uniformData1];
    AddUniformMap(uniformLoc, uniformData, 0, 2);
  }
  
  gl.my_uniform2iv = gl.__proto__.uniform2iv;
  gl.uniform2iv = function (uniformLoc, uniformData){
    AddUniformMap(uniformLoc, uniformData, 0, 2);
  }
  
  gl.my_uniform2f = gl.__proto__.uniform2f;
  gl.uniform2f = function (uniformLoc,  uniformData0, uniformData1){
    var uniformData = [uniformData0, uniformData1];
    AddUniformMap(uniformLoc, uniformData, 1, 2);
  }
  
  gl.my_uniform2fv = gl.__proto__.uniform2fv;
  gl.uniform2fv = function (uniformLoc, uniformData){
    AddUniformMap(uniformLoc, uniformData, 1, 2);
  }
  
  //个数是3的情况
  gl.my_uniform3i = gl.__proto__.uniform3i;
  gl.uniform3i = function (uniformLoc, uniformData0, uniformData1, uniformData2){
    var uniformData = [uniformData0, uniformData1, uniformData2];
    AddUniformMap(uniformLoc, uniformData, 0, 3);
  }
//    var __testnumber = 0;
  gl.my_uniform3iv = gl.__proto__.uniform3iv;
  gl.uniform3iv = function (uniformLoc, uniformData){
    AddUniformMap(uniformLoc, uniformData, 0, 3);
  //   console.log("__testnumber",__testnumber++);
  //   console.log("fdsfdsfsdfdsfds");
  }
  
  gl.my_uniform3f = gl.__proto__.uniform3f;
  gl.uniform3f = function (uniformLoc,  uniformData0, uniformData1, uniformData2){
    var uniformData = [uniformData0, uniformData1, uniformData2];
    AddUniformMap(uniformLoc, uniformData, 1, 3);
  }
  
  gl.my_uniform3fv = gl.__proto__.niform3fv;
  gl.niform3fv = function (uniformLoc, uniformData){
    AddUniformMap(uniformLoc, uniformData, 1, 3);
  }
  
  //个数是4的情况
  gl.my_uniform4i = gl.__proto__.uniform4i;
  gl.uniform4i = function (uniformLoc, uniformData0, uniformData1, uniformData2,uniformData3){
    var uniformData = [uniformData0, uniformData1, uniformData2, ,uniformData3];
    AddUniformMap(uniformLoc, uniformData, 0, 4);
  }
  
  gl.my_uniform4iv = gl.__proto__.uniform4iv;
  gl.uniform4iv = function (uniformLoc, uniformData){
    AddUniformMap(uniformLoc, uniformData, 0, 4);
  }
  
  gl.my_uniform4f = gl.__proto__.uniform4f;
  gl.uniform4f = function (uniformLoc,  uniformData0, uniformData1, uniformData2, uniformData3){
    var uniformData = [uniformData0, uniformData1, uniformData2, ,uniformData3];
    AddUniformMap(uniformLoc, uniformData, 1, 4);
  }
  
  gl.my_uniform4fv = gl.__proto__.uniform4fv;
  gl.uniform4fv = function (uniformLoc, uniformData){
    AddUniformMap(uniformLoc, uniformData, 1, 4);
  }
  
  //matrix 
  //在这里不考虑2*3， 2*4， 3*4 这几种情况
  gl.my_uniformMatrix2fv = gl.__proto__.uniformMatrix2fv;
  gl.uniformMatrix2fv = function (uniformLoc,transpose, uniformData){
    AddUniformMap(uniformLoc, uniformData, 1, 12);
  }
  
  gl.my_uniformMatrix3fv = gl.__proto__.uniformMatrix3fv;
  gl.uniformMatrix3fv = function (uniformLoc,transpose, uniformData){
    AddUniformMap(uniformLoc, uniformData, 1, 13);
  }
  
  gl.my_uniformMatrix4fv = gl.__proto__.uniformMatrix4fv;
  gl.uniformMatrix4fv = function (uniformLoc,transpose, uniformData){
    AddUniformMap(uniformLoc, uniformData, 1, 14);
  }
  
  
  /*------------gl.uniformXX和gl.uniformMatrix4XX------开头-------------*/
  //需要考虑重复赋值的情况
  var AddUniformMap = function(uniformLoc, uniformData, type, size){
    var newUniform = new Uniform_data;
    var newUniformLoc = new Uniform_loc;
    newUniformLoc = getUniformLoc(uniformLoc);
    newUniform.programName = newUniformLoc.programName;
    newUniform.shaderName = newUniformLoc.shaderName;
    for (var i = 0; i < UniformDataMap.length; i++){
    if ((newUniform.programName == UniformDataMap[i].programName) && (newUniform.shaderName == UniformDataMap[i].shaderName)){
      UniformDataMap[i].uniformNum = size;
      UniformDataMap[i].uniformType = type;
      UniformDataMap[i].uniformData = uniformData;
      UniformDataMap[i].uniformActive = 1;   // 这个是在后面和shader互动的时候使用的
      return;
    }
    }
    newUniform.uniformNum = size;
    newUniform.uniformType = type;
    newUniform.uniformData = uniformData;
    newUniform.uniformActive = 1;   // 这个是在后面和shader互动的时候使用的
    UniformDataMap.push(newUniform);
  }
  
  var getUniformLoc = function(randomNumber){
    for (var i = 0; i < UniformLocMap.length; i++)
    if (randomNumber == UniformLocMap[i].randomNumber)
      return UniformLocMap[i];
  }
  
  /*---------------------------------------------------------------*/ 
  

/*^^^^^^^^^^^^^^^^^^^^^^^^uniform 部分^^^^^^^^^^^^^^^^^^^^^^^^^^^*/




/*~~~~~~~~~~~~~~~~~~~~~~~texture 部分 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//强制要求是 gl.NEAREST
gl.my_texParameteri = gl.__proto__.texParameteri;
gl.my_texParameteri = function(a , b, c){
  gl.my_texParameteri(a, b, gl.NEAREST); 
}





/*^^^^^^^^^^^^^^^^^^^^^^^^texture 部分^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/


/*~~~~~~~~~~~~~~~~~~~~~~~ draw 部分 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//attribute的数据将要在这里重复形成最新的数据
gl.my_drawElements = gl.__proto__.drawElements;
gl.drawElements = function(mode, count, type, offset){
  var elementArray = [];
  var activeProgram;
  var activeProgramNum;
  activeProgram = getactiveProgram();
  activeProgramNum = getactiveProgramNum();
  // var t0 = performance.now();
  elementArray = getElementArray(count,offset);
  // var t1 = performance.now();
  // console.log('prepare for drawarrays', t1 - t0);
  for (var i = 0; i < AttriDataMap.length; i++){
    var newData = new Attri_data;
    if( AttriDataMap[i].programName == activeProgram){
      newData.programName = AttriDataMap[i].programName;
      newData.shaderName = AttriDataMap[i].shaderName;
      newData.attriEleNum = AttriDataMap[i].attriEleNum;
      newData.uniformData = AttriDataMap[i].uniformData;

      newData.uniformData = [];
      for (var j = 0; j < elementArray.length; j++){
        for (var k = elementArray[j] * newData.attriEleNum; k <  (elementArray[j] + 1) * newData.attriEleNum; k++)
          newData.uniformData.push(AttriDataMap[i].uniformData[k]);
      }
      ProgramDataMap[activeProgramNum].attriData.push(newData);
    }
  }
  gl.drawArrays(mode, 0 , count);
}

getactiveProgram = function(){
  for (var i = 0; i < ProgramDataMap.length; i++)
    if (ProgramDataMap[i].activeFlag == 1)
      return ProgramDataMap[i].programName;
}

getactiveProgramNum = function(){
  for (var i = 0; i < ProgramDataMap.length; i++)
    if (ProgramDataMap[i].activeFlag == 1)
      return i;
}

getElementArray = function(count,offset){
  var elementArray = [];
  var returnArray = [];
  for (var i = 0; i < BufferDataMap.length; i++)
    if (BufferDataMap[i].activeElement == 1)
      elementArray = BufferDataMap[i].bufferData;
  return elementArray.slice(offset, offset + count);
}







/*^^^^^^^^^^^^^^^^^^^^^^^^draw 部分^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
//mode
  //gl.POINTS 0
  //gl.LINES 1
  //gl.LINE_LOOP 2
  //gl.LINE_STRIP 3
  //gl.TRIANGLES 4
  var varyingmap = [];
  gl.my_drawArrays = gl.__proto__.drawArrays;
  gl.drawArrays = function(mode, first, count){



    // var mat1 = [];
    // for (var i = 0;i < 65536;++ i) mat1.push(i/10.0);
    // var mat2 = [];
    // for (var i = 0;i < 30;++ i) mat2.push(i);
  
    // matrixCalculator.loadMatrix(0, mat1);
    // matrixCalculator.loadMatrix(1, mat2);
  
    // var opMatrix = [];
    // for (var i = 0;i < 16;++ i) opMatrix.push(i/32.0);
  
    // var t0 = performance.now();
    // var resLength = matrixCalculator.doMatMul(0, opMatrix);
  
    // var t1 = performance.now();
    // console.log('time in ms: ', t1 - t0);
    // console.log('res', matrixCalculator.res);
  
    // var opMatrix = [];
    // for (var i = 0;i < 9;++ i) opMatrix.push(i);
    // var resLength = matrixCalculator.doMatMul(1, opMatrix);
    // console.log('res', matrixCalculator.res);
  




    // var test_fuc = gl.useProgram(-999);
    // console.log("test result");
    // console.log(test_fuc);

    //var startdraw = performance.now();
    //console.log("in drawArrays", performance.now());
    var activeProgram;
    var activeProgramNum;
    activeProgram = getactiveProgram();
    activeProgramNum = getactiveProgramNum();
    //没有进入gl.element直接进入这个gl.drawelement
    //加入attribute的部分
    // console.log("BufferDataMap",BufferDataMap);
    // console.log("AttriDataMap",AttriDataMap);
    if (ProgramDataMap[activeProgramNum].attriData.length == 0){
      for (var i = 0; i < AttriDataMap.length; i++)
        if( AttriDataMap[i].programName == activeProgram){
          var newData = new Attri_data;
          newData.programName = AttriDataMap[i].programName;
          newData.shaderName = AttriDataMap[i].shaderName;
          newData.attriEleNum = AttriDataMap[i].attriEleNum;
          newData.uniformData = [];
          // console.log("start",newData.attriEleNum * first);
          // console.log("end",newData.attriEleNum * (first + count));
          //在这里面添加first和count
          for(var j = newData.attriEleNum * first; j < newData.attriEleNum * (first + count); j++)
            newData.uniformData = newData.uniformData.concat(AttriDataMap[i].uniformData[j]);
          ProgramDataMap[activeProgramNum].attriData.push(newData);
        }

    }

    //加入uniform的部分
    for(var i = 0; i < UniformDataMap.length; i++){
      if (UniformDataMap[i].programName == activeProgram){
        var newData = new Uniform_data;
        newData.programName = UniformDataMap[i].programName;
        newData.shaderName = UniformDataMap[i].shaderName;
        newData.uniformNum = UniformDataMap[i].uniformNum;
        newData.uniformType = UniformDataMap[i].uniformType;
        newData.uniformActive = UniformDataMap[i].uniformActive;
        newData.uniformData = [];
        for (var idx in UniformDataMap[i].uniformData)
          newData.uniformData.push(UniformDataMap[i].uniformData[idx]);
        ProgramDataMap[activeProgramNum].uniformData.push(newData);
      }
    } 




     // line 部分   
    if (ProgramDataMap[activeProgramNum].shaderJsID == 0){
    

      /*------------------readpixel部分--------------------------------------*/
      //console.log("before readpixel", performance.now());
      var testNumber = 1;
      var start = performance.now();
      if (testNumber == 1){
        var maxTextureUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
        // var pixels = new Uint8Array(canvas.width * canvas.height * 4);
        // gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        // var backtexture = textureFromPixelArray(gl, pixels, gl.RGBA, canvas.width, canvas.height);
        // function textureFromPixelArray(gl, dataArray, type, width, height) {
        //   var texture = gl.createTexture();
        //   gl.bindTexture(gl.TEXTURE_2D, texture);
        //   //确保不会翻转
        //   gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        //   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvas.width, canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, dataArray);
        //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //   return texture;
        // }
        var backtexture = textureFromPixelArray(gl, gl.RGBA, canvas.width, canvas.height);
        function textureFromPixelArray(gl, type, width, height) {
            var texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            //确保不会翻转
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, gl.canvas);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            return texture;
          }
      }
      var end = performance.now();
      // console.log("read pixel", end - start);
      /*------------------readpixel部分--------------------------------------*/
  
      
      var tem = [];
      var coordinates = [];
      var __VertexPositionAttributeLocation1;
      
      // console.log("ProgramDataMap", ProgramDataMap);
      //attribute 读取阶段
      for (var i = 0; i < ProgramDataMap[activeProgramNum].attriData.length; i++){
        if (ProgramDataMap[activeProgramNum].attriData[i].shaderName == "coordinates")
          coordinates = ProgramDataMap[activeProgramNum].attriData[i].uniformData;          
      }
      //console.log("coordinates",coordinates);
      
      //这种情况下要考虑mode的样子，先把数据传输进来
      // console.log("mode",mode);
      //console.log("coordinates",coordinates);
      // 我现在先按照test的来画，去判断双draw的部分
      
      //这块coordinates出了问题，但是我不确定是不是对的，等会在处理
  
      // testNumber = 1;
      // if (testNumber == 1){
      if (mode == 3){
        // tem.length = 0;
        for (var i = 0; i <  coordinates.length/3 - 1; i++){
          tem = tem.concat(coordinates[3 * i]);
          tem = tem.concat(coordinates[3 * i + 1]);
          tem = tem.concat(coordinates[3 * i + 2]);
          tem = tem.concat(coordinates[3 * i + 3]);
          tem = tem.concat(coordinates[3 * i + 4]);
          tem = tem.concat(coordinates[3 * i + 5]);
        }
      }
      // for (var i = 0; i < 1500;i++)
      //    tem = tem.concat(0);
      if (mode == 1){
        // tem.length = 0;
        for (var i = 0; i <  coordinates.length/3; i++){
          tem = tem.concat(coordinates[3 * i]);
          tem = tem.concat(coordinates[3 * i + 1]);
          tem = tem.concat(coordinates[3 * i + 2]);
        }
         for (var i = 0; i < 1500;i++)
           tem = tem.concat(0);
      }
      
      //  console.log("coordinates",coordinates);
      //  console.log("tem",tem);
      var newData1 = new Varying_data;
      newData1.shaderName = "line_point";
      newData1.varyEleNum = 3;
      // newData1.uniformData.length = 0;
      newData1.uniformData = tem;
      // console.log("asaadxasdscdsvsfdbvfdsbgf",newData1.uniformData);
      for (var i =0; i < newData1.uniformData.length; i++)
        if (i % 3 != 2)
          newData1.uniformData[i] = Math.round(newData1.uniformData[i] * 1000);
        else
          newData1.uniformData[i] = -1 * Math.round(newData1.uniformData[i] * 1000);
      ProgramDataMap[activeProgramNum].varyingData.push(newData1);
      //关于那一条斜线的数据，可以认为处理掉，无所谓的
      //console.log("ProgramDataMap", ProgramDataMap);
  
      //清除上一个的数据
      //gl.clearColor(0.0, 0.0, 1.0, 1.0);
      //gl.clear(gl.COLOR_BUFFER_BIT);
  
      var canvas_buffer = [-1.0, -1.0, 
        1.0, -1.0, 
        -1.0,  1.0, 
        -1.0,  1.0,
        1.0, -1.0, 
        1.0,  1.0]; 
      var new_vertex_buffer = gl.createBuffer();
      gl.my_bindBuffer(gl.ARRAY_BUFFER, new_vertex_buffer);
      gl.my_glbufferData(gl.ARRAY_BUFFER, new Float32Array(canvas_buffer), gl.STATIC_DRAW);
      __VertexPositionAttributeLocation1 = gl.my_getAttribLocation(activeProgram, 'coordinates');
      gl.my_vertexAttribPointer(__VertexPositionAttributeLocation1, 2 ,gl.FLOAT, gl.FALSE, 2 * Float32Array.BYTES_PER_ELEMENT , 0); 
      gl.enableVertexAttribArray(__VertexPositionAttributeLocation1); 
      gl.my_useProgram(activeProgram);
      var traingles_vex_loc = gl.my_getUniformLocation(activeProgram, "line_point");
      gl.my_uniform3iv(traingles_vex_loc, ProgramDataMap[activeProgramNum].varyingData[0].uniformData);
      // console.log("ProgramDataMap[activeProgramNum].varyingData[0].uniformData",ProgramDataMap[activeProgramNum].varyingData[0].uniformData);
      //console.log("开始draw");
  
      // console.log("测试1");
       gl.clearColor(0, 0, 0, 1.0);
       gl.enable(gl.DEPTH_TEST);
       gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
      gl.my_drawArrays(gl.TRIANGLES, 0, 6);
      // console.log("画了");
        
  
    }//vetexID == 0
    

    //这是cube camera测试的
    if (ProgramDataMap[activeProgramNum].shaderJsID == 1){
      // console.log("begin work");
      var mWorld = new Float32Array(16);
      var mWorld_fs = new Float32Array(16);
      var mView_fs = new Float32Array(16);
      var mView = new Float32Array(16);
      var mProj = new Float32Array(16);
      var vertPosition = [];
      var vertColor = [];
      var varyingmap = [];
      var __VertexPositionAttributeLocation1;
      //attribute 读取阶段
      for (var i = 0; i < ProgramDataMap[activeProgramNum].attriData.length; i++){
        if (ProgramDataMap[activeProgramNum].attriData[i].shaderName == "vertPosition")
          vertPosition = ProgramDataMap[activeProgramNum].attriData[i].uniformData;         
        if (ProgramDataMap[activeProgramNum].attriData[i].shaderName == "vertColor")
          vertColor = ProgramDataMap[activeProgramNum].attriData[i].uniformData;
      }

      // console.log("vertColor",vertColor);
      //uniform 读取阶段
      for (var i = 0; i < ProgramDataMap[activeProgramNum].uniformData.length; i++){
        if (ProgramDataMap[activeProgramNum].uniformData[i].shaderName == "mWorld")
          mWorld = ProgramDataMap[activeProgramNum].uniformData[i].uniformData;         
        if (ProgramDataMap[activeProgramNum].uniformData[i].shaderName == "mView")
          mView = ProgramDataMap[activeProgramNum].uniformData[i].uniformData;
        if (ProgramDataMap[activeProgramNum].uniformData[i].shaderName == "mProj")
          mProj = ProgramDataMap[activeProgramNum].uniformData[i].uniformData;
      }
  
      //进入vetex计算部分
      mat4.copy(mWorld_fs, mWorld);
      mat4.copy(mView_fs, mView);
      mat4.transpose(mWorld, mWorld);
      mat4.transpose(mView, mView);
      mat4.transpose(mProj, mProj);
      mat4.mul(mView, mView, mProj);
      mat4.mul(mWorld, mWorld, mView);
  
      //进入计算阶段
      //手工去完成自动化的那部分
      
      var newData1 = new Varying_data;
      newData1.shaderName = "tri_point";
      newData1.varyEleNum = 3;
      newData1.uniformData = my_m4.vec_max_mul(vertPosition, mWorld);
      for (var i =0; i < newData1.uniformData.length; i++)
        if (i % 3 != 2)
          newData1.uniformData[i] = Math.round(newData1.uniformData[i] * 1000);
        else
          newData1.uniformData[i] = -1 * Math.round(newData1.uniformData[i] * 1000);
      ProgramDataMap[activeProgramNum].varyingData.push(newData1);
  
      var newData2 = new Varying_data;
      newData2.shaderName = "tri_color";
      newData2.varyEleNum = 3;
      for (var i = 0; i < vertColor.length; i++){
        newData2.uniformData = newData2.uniformData.concat(vertColor[i]);
        newData2.uniformData[i] = Math.round(((newData2.uniformData[i] )) * 1000);
      } 
      ProgramDataMap[activeProgramNum].varyingData.push(newData2);

  
  
      var index_num = ProgramDataMap[activeProgramNum].varyingData[0].uniformData.length / 3;
        var x0, y0, x1, y1, z1, x2, y2, z2, x3,  y3, z3;
        var tem_varying = []; //创建临时的varying二维数组去储存所有的数据
        var tem = [];
        for(j = 0; j < ProgramDataMap[activeProgramNum].varyingData.length; j++)
          tem_varying.push(tem);
        for (var i = 0; i < index_num; i+= 3){
          x1 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i * 3];
          y1 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i * 3 + 1];
          z1 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i * 3 + 2];
          x2 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i * 3 + 3];
          y2 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i * 3 + 4];
          z2 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i * 3 + 5];
          x3 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i * 3 + 6];
          y3 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i * 3 + 7];
          z3 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i * 3 + 8];
          if (((x2 - x1)*(y3 - y1) - (x3 - x1)*(y2 - y1)) > 0.0){
            for(j = 0; j < ProgramDataMap[activeProgramNum].varyingData.length; j++){
              for (k = 0; k < 3 * ProgramDataMap[activeProgramNum].varyingData[j].varyEleNum; k++)
                tem_varying[j] = tem_varying[j].concat(ProgramDataMap[activeProgramNum].varyingData[j].uniformData[i * ProgramDataMap[activeProgramNum].varyingData[j].varyEleNum + k]);  
            }
          }
        }
        
        
        //把数值赋给了ProgramDataMap
        for (var i = 0; i < ProgramDataMap[activeProgramNum].varyingData.length; i++){
          ProgramDataMap[activeProgramNum].varyingData[i].uniformData = [];
          for(var j = 0; j < tem_varying[i].length; j++)
            ProgramDataMap[activeProgramNum].varyingData[i].uniformData = ProgramDataMap[activeProgramNum].varyingData[i].uniformData.concat(tem_varying[i][j]);
        }
  
  
      var canvas_buffer = [-1.0, -1.0, 
        1.0, -1.0, 
        -1.0,  1.0, 
        -1.0,  1.0,
        1.0, -1.0, 
        1.0,  1.0]; 
      var new_vertex_buffer = gl.createBuffer();
      gl.my_bindBuffer(gl.ARRAY_BUFFER, new_vertex_buffer);
      gl.my_glbufferData(gl.ARRAY_BUFFER, new Float32Array(canvas_buffer), gl.STATIC_DRAW);
      __VertexPositionAttributeLocation1 = gl.my_getAttribLocation(activeProgram, 'vertPosition');
      gl.my_vertexAttribPointer(__VertexPositionAttributeLocation1, 2 ,gl.FLOAT, gl.FALSE, 2 * Float32Array.BYTES_PER_ELEMENT , 0); 
      gl.enableVertexAttribArray(__VertexPositionAttributeLocation1); 
      gl.my_useProgram(activeProgram);
      var traingles_vex_loc = gl.my_getUniformLocation(activeProgram, "tri_point");
      var traingles_fra_loc = gl.my_getUniformLocation(activeProgram, "tri_color");
      var traingles_num_loc = gl.my_getUniformLocation(activeProgram, "tri_number");
      // console.log(traingles_vex_loc);
      // console.log(traingles_fra_loc);
      // console.log(gl.my_getUniformLocation(activeProgram, "tri_numberdsds"));
      gl.my_uniform1i(traingles_num_loc, ProgramDataMap[activeProgramNum].varyingData[0].uniformData.length/3);
      gl.my_uniform3iv(traingles_vex_loc, ProgramDataMap[activeProgramNum].varyingData[0].uniformData);
      gl.my_uniform3iv(traingles_fra_loc, ProgramDataMap[activeProgramNum].varyingData[1].uniformData);
      // console.log("开始画了");
      
      // console.log("ProgramDataMap",ProgramDataMap);
      gl.my_drawArrays(gl.TRIANGLES, 0, 6);  
    }





    if (ProgramDataMap[activeProgramNum].shaderJsID == 2){
      // console.log(ProgramDataMap);

      //读取数据
      //attribute 读取
      //vec3 vec2
      var vertPosition = [];
      var vertTexCoord = [];
      for (i = 0; i < ProgramDataMap[activeProgramNum].attriData.length; i++){
        if (ProgramDataMap[activeProgramNum].attriData[i].shaderName == 'vertPosition'){
          var number = ProgramDataMap[activeProgramNum].attriData[i].attriEleNum;
          var tem =  ProgramDataMap[activeProgramNum].attriData[i].uniformData;
          for (j = 0; j < tem.length / number; j++){
            if (number == 3)
              vertPosition.push( [tem[j*3], tem[j*3+1], tem[j*3+2]]);
            else
            vertPosition.push( [tem[j*2], tem[j*2+1]]);
          }
        }
      }

      for (i = 0; i < ProgramDataMap[activeProgramNum].attriData.length; i++){
        if (ProgramDataMap[activeProgramNum].attriData[i].shaderName == 'vertTexCoord'){
          var number = ProgramDataMap[activeProgramNum].attriData[i].attriEleNum;
          var tem =  ProgramDataMap[activeProgramNum].attriData[i].uniformData;
          for (j = 0; j < tem.length / number; j++){
            if (number == 3)
              vertTexCoord.push( [tem[j*3], tem[j*3+1], tem[j*3+2]]);
            else
              vertTexCoord.push( [tem[j*2], tem[j*2+1]]);
          }
        }
      }

      //uniform 读取
      var mWorld = [];
      var mView = [];
      var mProj = [];
      for (var i in ProgramDataMap[activeProgramNum].uniformData){
        if (ProgramDataMap[activeProgramNum].uniformData[i].shaderName == 'mWorld') 
          mWorld = ProgramDataMap[activeProgramNum].uniformData[i].uniformData;
        if (ProgramDataMap[activeProgramNum].uniformData[i].shaderName == 'mView')
          mView = ProgramDataMap[activeProgramNum].uniformData[i].uniformData;
        if (ProgramDataMap[activeProgramNum].uniformData[i].shaderName == 'mProj')
          mProj = ProgramDataMap[activeProgramNum].uniformData[i].uniformData;
      }

      //vertex shader 运行
      var fragTexCoord = [];
      var gl_Position = [];
      ll = ProgramDataMap[activeProgramNum].attriData[0].uniformData.length / 3;
      var Mt = [];
      Mt = my_multiple( my_multiple( mProj, mView ), mWorld );


      eval(compiled);
      //执行eval 的 vertex shader部分
      eval_main();
      // for (var bigI = 0;bigI < ll;++ bigI) { 
      //   fragTexCoord[bigI] = vertTexCoord[bigI];
      //   gl_Position[bigI] = my_multiple( my_multiple( my_multiple( mProj, mView ), mWorld ), new Float32Array([vertPosition[bigI][0], vertPosition[bigI][1], vertPosition[bigI][2], 1] ));
      // }



      //放进varying数据
      var newData1 = new Varying_data;
      newData1.shaderName = "tri_point";
      newData1.varyEleNum = 3;
      newData1.uniformData = handle_gl_Position(gl_Position);
      ProgramDataMap[activeProgramNum].varyingData.push(newData1);

    
      var t0 = performance.now();
      var newData2 = new Varying_data;
      newData2.shaderName = "text_point";
      newData2.varyEleNum = 2;
      newData2.uniformData = fragTexCoord.map(x => x.map(y => Math.floor(y * 1000)))
      ProgramDataMap[activeProgramNum].varyingData.push(newData2);

      //判断是否是正面
      var t0 = performance.now();
      var index_num = ProgramDataMap[activeProgramNum].varyingData[0].uniformData.length;
      var x0, y0, x1, y1, z1, x2, y2, z2, x3,  y3, z3;
      var tem_varying = []; //创建临时的varying二维数组去储存所有的数据
      for(j = 0; j < ProgramDataMap[activeProgramNum].varyingData.length; j++)
        tem_varying.push([]);
      for (var i = 0; i < index_num; i += 3){
        x1 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i][0];
        y1 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i][1];
        z1 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i][2];
        x2 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i + 1][0];
        y2 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i + 1][1];
        z2 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i + 1][2];
        x3 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i + 2][0];
        y3 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i + 2][1];
        z3 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i + 2][2];
        if (((x2 - x1)*(y3 - y1) - (x3 - x1)*(y2 - y1)) > 0.0){
        for(j = 0; j < ProgramDataMap[activeProgramNum].varyingData.length; j++){
          for (k = 0; k < 3; k++)
          tem_varying[j].push(ProgramDataMap[activeProgramNum].varyingData[j].uniformData[i + k]);
        }
        }
      }
      for (var idx in tem_varying)
        tem_varying[idx] = math.flatten(tem_varying[idx]);

    

      devide_draw(0, 255, tem_varying, gl);
    }










    if (ProgramDataMap[activeProgramNum].shaderJsID == 3){
      // console.log(ProgramDataMap);

      //读取数据
      //attribute 读取
      //vec3 vec2
      var vertPosition = [];
      var vertTexCoord = [];
      var vertNormal = [];
      for (i = 0; i < ProgramDataMap[activeProgramNum].attriData.length; i++){
        if (ProgramDataMap[activeProgramNum].attriData[i].shaderName == 'vertPosition'){
          var number = ProgramDataMap[activeProgramNum].attriData[i].attriEleNum;
          var tem =  ProgramDataMap[activeProgramNum].attriData[i].uniformData;
          for (j = 0; j < tem.length / number; j++){
            if (number == 3)
              vertPosition.push( [tem[j*3], tem[j*3+1], tem[j*3+2]]);
            else
            vertPosition.push( [tem[j*2], tem[j*2+1]]);
          }
        }
      }

      for (i = 0; i < ProgramDataMap[activeProgramNum].attriData.length; i++){
        if (ProgramDataMap[activeProgramNum].attriData[i].shaderName == 'vertTexCoord'){
          var number = ProgramDataMap[activeProgramNum].attriData[i].attriEleNum;
          var tem =  ProgramDataMap[activeProgramNum].attriData[i].uniformData;
          for (j = 0; j < tem.length / number; j++){
            if (number == 3)
              vertTexCoord.push( [tem[j*3], tem[j*3+1], tem[j*3+2]]);
            else
              vertTexCoord.push( [tem[j*2], tem[j*2+1]]);
          }
        }
      }

      for (i = 0; i < ProgramDataMap[activeProgramNum].attriData.length; i++){
        if (ProgramDataMap[activeProgramNum].attriData[i].shaderName == 'vertNormal'){
          var number = ProgramDataMap[activeProgramNum].attriData[i].attriEleNum;
          var tem =  ProgramDataMap[activeProgramNum].attriData[i].uniformData;
          for (j = 0; j < tem.length / number; j++){
            if (number == 3)
              vertNormal.push( [tem[j*3], tem[j*3+1], tem[j*3+2]]);
            else
              vertNormal.push( [tem[j*2], tem[j*2+1]]);
          }
        }
      }

      //uniform 读取
      var mWorld = [];
      var mView = [];
      var mProj = [];
      for (var i in ProgramDataMap[activeProgramNum].uniformData){
        if (ProgramDataMap[activeProgramNum].uniformData[i].shaderName == 'mWorld') 
          mWorld = ProgramDataMap[activeProgramNum].uniformData[i].uniformData;
        if (ProgramDataMap[activeProgramNum].uniformData[i].shaderName == 'mView')
          mView = ProgramDataMap[activeProgramNum].uniformData[i].uniformData;
        if (ProgramDataMap[activeProgramNum].uniformData[i].shaderName == 'mProj')
          mProj = ProgramDataMap[activeProgramNum].uniformData[i].uniformData;
      }

      //vertex shader 运行
      var fragTexCoord = [];
      var gl_Position = [];
      var fragNormal = [];
      var Mt = [];
      Mt = my_multiple( my_multiple( mProj, mView ), mWorld );
      var tt = [];
      ll = ProgramDataMap[activeProgramNum].attriData[0].uniformData.length / 3;
      // for (var bigI = 0,  ll = ProgramDataMap[activeProgramNum].attriData[0].uniformData.length / 3 ;bigI <  ll; ++bigI ) { 
      //   fragTexCoord[bigI] = vertTexCoord[bigI];
      //   tt = my_multiple( mWorld, new Float32Array([vertNormal[bigI][0], vertNormal[bigI][1], vertNormal[bigI][2], 0]));
      //   fragNormal[bigI] = [tt[0],tt[1],tt[2]];
      //   gl_Position[bigI] = my_multiple( Mt, new Float32Array([vertPosition[bigI][0], vertPosition[bigI][1], vertPosition[bigI][2], 1] ));
      // }

      eval(compiled);
      //执行vertex shader
      eval_main();
      

      //放进varying数据
      var newData1 = new Varying_data;
      newData1.shaderName = "tri_point";
      newData1.varyEleNum = 3;
      newData1.uniformData = handle_gl_Position(gl_Position);
      ProgramDataMap[activeProgramNum].varyingData.push(newData1);

    
      var t0 = performance.now();
      var newData2 = new Varying_data;
      newData2.shaderName = "text_point";
      newData2.varyEleNum = 2;
      newData2.uniformData = fragTexCoord.map(x => x.map(y => Math.floor(y * 1000)))
      ProgramDataMap[activeProgramNum].varyingData.push(newData2);

      var newData3 = new Varying_data;
      newData3.shaderName = "nor_point";
      newData3.varyEleNum = 3;
      // fragNormal = math.flatten(fragNormal);
      // console.log(fragNormal);
      newData3.uniformData = fragNormal.map(x => x.map(y => Math.floor(y * 1000)))
          ProgramDataMap[activeProgramNum].varyingData.push(newData3);

      //判断是否是正面
      var t0 = performance.now();
      var index_num = ProgramDataMap[activeProgramNum].varyingData[0].uniformData.length;
      var x0, y0, x1, y1, z1, x2, y2, z2, x3,  y3, z3;
      var tem_varying = []; //创建临时的varying二维数组去储存所有的数据
      for(j = 0; j < ProgramDataMap[activeProgramNum].varyingData.length; j++)
        tem_varying.push([]);
      for (var i = 0; i < index_num; i += 3){
        x1 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i][0];
        y1 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i][1];
        z1 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i][2];
        x2 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i + 1][0];
        y2 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i + 1][1];
        z2 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i + 1][2];
        x3 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i + 2][0];
        y3 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i + 2][1];
        z3 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i + 2][2];
        if (((x2 - x1)*(y3 - y1) - (x3 - x1)*(y2 - y1)) > 0.0){
        for(j = 0; j < ProgramDataMap[activeProgramNum].varyingData.length; j++){
          for (k = 0; k < 3; k++)
          tem_varying[j].push(ProgramDataMap[activeProgramNum].varyingData[j].uniformData[i + k]);
        }
        }
      }
      for (var idx in tem_varying)
        tem_varying[idx] = math.flatten(tem_varying[idx]);

    

      devide_draw(0, 255, tem_varying, gl);
    }




    if (ProgramDataMap[activeProgramNum].shaderJsID == 4){
      // console.log(ProgramDataMap);

      //读取数据
      //attribute 读取
      //vec3 vec2
      var vertPosition = [];
      var vertTexCoord = [];
      var vertNormal = [];
      for (i = 0; i < ProgramDataMap[activeProgramNum].attriData.length; i++){
        if (ProgramDataMap[activeProgramNum].attriData[i].shaderName == 'vertPosition'){
          var number = ProgramDataMap[activeProgramNum].attriData[i].attriEleNum;
          var tem =  ProgramDataMap[activeProgramNum].attriData[i].uniformData;
          for (j = 0; j < tem.length / number; j++){
            if (number == 3)
              vertPosition.push( [tem[j*3], tem[j*3+1], tem[j*3+2]]);
            else
            vertPosition.push( [tem[j*2], tem[j*2+1]]);
          }
        }
      }

      for (i = 0; i < ProgramDataMap[activeProgramNum].attriData.length; i++){
        if (ProgramDataMap[activeProgramNum].attriData[i].shaderName == 'vertTexCoord'){
          var number = ProgramDataMap[activeProgramNum].attriData[i].attriEleNum;
          var tem =  ProgramDataMap[activeProgramNum].attriData[i].uniformData;
          for (j = 0; j < tem.length / number; j++){
            if (number == 3)
              vertTexCoord.push( [tem[j*3], tem[j*3+1], tem[j*3+2]]);
            else
              vertTexCoord.push( [tem[j*2], tem[j*2+1]]);
          }
        }
      }

      for (i = 0; i < ProgramDataMap[activeProgramNum].attriData.length; i++){
        if (ProgramDataMap[activeProgramNum].attriData[i].shaderName == 'vertNormal'){
          var number = ProgramDataMap[activeProgramNum].attriData[i].attriEleNum;
          var tem =  ProgramDataMap[activeProgramNum].attriData[i].uniformData;
          for (j = 0; j < tem.length / number; j++){
            if (number == 3)
              vertNormal.push( [tem[j*3], tem[j*3+1], tem[j*3+2]]);
            else
              vertNormal.push( [tem[j*2], tem[j*2+1]]);
          }
        }
      }

      //uniform 读取
      var mWorld = [];
      var mView = [];
      var mProj = [];
      for (var i in ProgramDataMap[activeProgramNum].uniformData){
        if (ProgramDataMap[activeProgramNum].uniformData[i].shaderName == 'mWorld') 
          mWorld = ProgramDataMap[activeProgramNum].uniformData[i].uniformData;
        if (ProgramDataMap[activeProgramNum].uniformData[i].shaderName == 'mView')
          mView = ProgramDataMap[activeProgramNum].uniformData[i].uniformData;
        if (ProgramDataMap[activeProgramNum].uniformData[i].shaderName == 'mProj')
          mProj = ProgramDataMap[activeProgramNum].uniformData[i].uniformData;
      }

      //vertex shader 运行
      var fragTexCoord = [];
      var gl_Position = [];
      var fragNormal = [];
      var vPosition = [];
      var Mt = [];
      Mt = my_multiple( my_multiple( mProj, mView ), mWorld );
      var tt = [];
      var ll = ProgramDataMap[activeProgramNum].attriData[0].uniformData.length / 3 ;
      // for (var bigI = 0,  ll = ProgramDataMap[activeProgramNum].attriData[0].uniformData.length / 3 ;bigI <  ll; ++bigI ) { 
      //   vPosition[bigI] = my_multiple( mView, new Float32Array([vertPosition[bigI][0], vertPosition[bigI][1], vertPosition[bigI][2], 1]) );
      //   fragTexCoord[bigI] = vertTexCoord[bigI];
      //   tt = my_multiple( mWorld, new Float32Array([vertNormal[bigI][0], vertNormal[bigI][1], vertNormal[bigI][2], 0]));
      //   fragNormal[bigI] = [tt[0],tt[1],tt[2]];
      //   gl_Position[bigI] = my_multiple( Mt, new Float32Array([vertPosition[bigI][0], vertPosition[bigI][1], vertPosition[bigI][2], 1] ));
      // }
      eval(compiled);
      //执行vertex shader部分
      eval_main();

      //放进varying数据
      var newData1 = new Varying_data;
      newData1.shaderName = "tri_point";
      newData1.varyEleNum = 3;
      newData1.uniformData = handle_gl_Position(gl_Position);
      ProgramDataMap[activeProgramNum].varyingData.push(newData1);

    
      var t0 = performance.now();
      var newData2 = new Varying_data;
      newData2.shaderName = "text_point";
      newData2.varyEleNum = 2;
      newData2.uniformData = fragTexCoord.map(x => x.map(y => Math.floor(y * 1000)))
      ProgramDataMap[activeProgramNum].varyingData.push(newData2);

      var newData3 = new Varying_data;
      newData3.shaderName = "nor_point";
      newData3.varyEleNum = 3;
      // fragNormal = math.flatten(fragNormal);
      // console.log(fragNormal);
      newData3.uniformData = fragNormal.map(x => x.map(y => Math.floor(y * 1000)))
          ProgramDataMap[activeProgramNum].varyingData.push(newData3);

      var newData4 = new Varying_data;
      newData4.shaderName = "vPosition";
      newData4.varyEleNum = 4;
      newData4.uniformData = fragTexCoord.map(x => x.map(y => Math.floor(y * 1000)))
      ProgramDataMap[activeProgramNum].varyingData.push(newData4);

      //判断是否是正面
      var t0 = performance.now();
      var index_num = ProgramDataMap[activeProgramNum].varyingData[0].uniformData.length;
      var x0, y0, x1, y1, z1, x2, y2, z2, x3,  y3, z3;
      var tem_varying = []; //创建临时的varying二维数组去储存所有的数据
      for(j = 0; j < ProgramDataMap[activeProgramNum].varyingData.length; j++)
        tem_varying.push([]);
      for (var i = 0; i < index_num; i += 3){
        x1 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i][0];
        y1 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i][1];
        z1 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i][2];
        x2 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i + 1][0];
        y2 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i + 1][1];
        z2 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i + 1][2];
        x3 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i + 2][0];
        y3 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i + 2][1];
        z3 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i + 2][2];
        if (((x2 - x1)*(y3 - y1) - (x3 - x1)*(y2 - y1)) > 0.0){
        for(j = 0; j < ProgramDataMap[activeProgramNum].varyingData.length; j++){
          for (k = 0; k < 3; k++)
          tem_varying[j].push(ProgramDataMap[activeProgramNum].varyingData[j].uniformData[i + k]);
        }
        }
      }
      for (var idx in tem_varying)
        tem_varying[idx] = math.flatten(tem_varying[idx]);

    

      devide_draw(0, 255, tem_varying, gl);
    }





    if (ProgramDataMap[activeProgramNum].shaderJsID == 5){
      // console.log(ProgramDataMap);

      //读取数据
      //attribute 读取
      //vec3 vec2
      var vertPosition = [];
      var vertTexCoord = [];
      for (i = 0; i < ProgramDataMap[activeProgramNum].attriData.length; i++){
        if (ProgramDataMap[activeProgramNum].attriData[i].shaderName == 'vertPosition')
          vertPosition =  ProgramDataMap[activeProgramNum].attriData[i].uniformData;
        if (ProgramDataMap[activeProgramNum].attriData[i].shaderName == 'vertTexCoord'){
          vertTexCoord =  ProgramDataMap[activeProgramNum].attriData[i].uniformData;
      }

      //uniform 读取
      var mWorld = [];
      var mView = [];
      var mProj = [];
      for (var i in ProgramDataMap[activeProgramNum].uniformData){
        if (ProgramDataMap[activeProgramNum].uniformData[i].shaderName == 'mWorld') 
          mWorld = ProgramDataMap[activeProgramNum].uniformData[i].uniformData;
        if (ProgramDataMap[activeProgramNum].uniformData[i].shaderName == 'mView')
          mView = ProgramDataMap[activeProgramNum].uniformData[i].uniformData;
        if (ProgramDataMap[activeProgramNum].uniformData[i].shaderName == 'mProj')
          mProj = ProgramDataMap[activeProgramNum].uniformData[i].uniformData;
      }

      //vertex shader 运行
      var fragTexCoord = [];
      var gl_Position = [];
      ll = ProgramDataMap[activeProgramNum].attriData[0].uniformData.length / 3;
      var Mt = [];
      Mt = my_multiple( my_multiple( mProj, mView ), mWorld );


      eval(compiled);
      //执行eval 的 vertex shader部分
      eval_main();
      // wasm part
      // matrixCalculator.loadMatrix(0, vertPosition);
      // matrixCalculator.loadMatrix(1, vertTexCoord);
      // fragTexCoord = vertTexCoord;
      // var resLength = matrixCalculator.doMatMul (0,  ( my_multiple( my_multiple( mProj, mView ), mWorld );
      // var gl_Position =  matrixCalculator.res;



      //放进varying数据
      var newData1 = new Varying_data;
      newData1.shaderName = "tri_point";
      newData1.varyEleNum = 3;
      newData1.uniformData = handle_gl_Position(gl_Position);
      ProgramDataMap[activeProgramNum].varyingData.push(newData1);

    
      var t0 = performance.now();
      var newData2 = new Varying_data;
      newData2.shaderName = "text_point";
      newData2.varyEleNum = 2;
      newData2.uniformData = fragTexCoord.map(x => x.map(y => Math.floor(y * 1000)))
      ProgramDataMap[activeProgramNum].varyingData.push(newData2);

      //判断是否是正面
      var t0 = performance.now();
      var index_num = ProgramDataMap[activeProgramNum].varyingData[0].uniformData.length;
      var x0, y0, x1, y1, z1, x2, y2, z2, x3,  y3, z3;
      var tem_varying = []; //创建临时的varying二维数组去储存所有的数据
      for(j = 0; j < ProgramDataMap[activeProgramNum].varyingData.length; j++)
        tem_varying.push([]);
      for (var i = 0; i < index_num; i += 9){
        x1 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i];
        y1 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i + 1];
        z1 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i + 2];
        x2 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i + 3];
        y2 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i + 4];
        z2 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i + 5];
        x3 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i + 6];
        y3 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i + 7];
        z3 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i + 8];
        if (((x2 - x1)*(y3 - y1) - (x3 - x1)*(y2 - y1)) > 0.0){
        for(j = 0; j < ProgramDataMap[activeProgramNum].varyingData.length; j++){
          for (k = 0; k < 3; k++)
          tem_varying[j].push(ProgramDataMap[activeProgramNum].varyingData[j].uniformData[i + k]);
        }
        }
      }
      for (var idx in tem_varying)
        tem_varying[idx] = math.flatten(tem_varying[idx]);

    

      devide_draw(0, 255, tem_varying, gl);
    }




    //数据清除
    ProgramDataMap[activeProgramNum].attriData = [];
    ProgramDataMap[activeProgramNum].uniformData = [];
    ProgramDataMap[activeProgramNum].varyingData = [];



  }



  if (ProgramDataMap[activeProgramNum].shaderJsID == 6){
    // console.log(ProgramDataMap);

    //读取数据
    //attribute 读取
    //vec3 vec2
    var vertPosition = [];
    var vertTexCoord = [];
    for (i = 0; i < ProgramDataMap[activeProgramNum].attriData.length; i++){
      if (ProgramDataMap[activeProgramNum].attriData[i].shaderName == 'vertPosition')
        vertPosition =  ProgramDataMap[activeProgramNum].attriData[i].uniformData;
      if (ProgramDataMap[activeProgramNum].attriData[i].shaderName == 'vertTexCoord'){
        vertTexCoord =  ProgramDataMap[activeProgramNum].attriData[i].uniformData;
    }

    //uniform 读取
    var mWorld = [];
    var mView = [];
    var mProj = [];
    for (var i in ProgramDataMap[activeProgramNum].uniformData){
      if (ProgramDataMap[activeProgramNum].uniformData[i].shaderName == 'mWorld') 
        mWorld = ProgramDataMap[activeProgramNum].uniformData[i].uniformData;
      if (ProgramDataMap[activeProgramNum].uniformData[i].shaderName == 'mView')
        mView = ProgramDataMap[activeProgramNum].uniformData[i].uniformData;
      if (ProgramDataMap[activeProgramNum].uniformData[i].shaderName == 'mProj')
        mProj = ProgramDataMap[activeProgramNum].uniformData[i].uniformData;
    }

    //vertex shader 运行
    var fragTexCoord = [];
    var gl_Position = [];
    ll = ProgramDataMap[activeProgramNum].attriData[0].uniformData.length / 3;
    var Mt = [];
    Mt = my_multiple( my_multiple( mProj, mView ), mWorld );


    eval(compiled);
    //执行eval 的 vertex shader部分
    eval_main();
    // wasm part
    // matrixCalculator.loadMatrix(0, vertPosition);
    // matrixCalculator.loadMatrix(1, vertTexCoord);
    // matrixCalculator.loadMatrix(2, vertNormal);
    // fragTexCoord = vertTexCoord;
    // var resLength = matrixCalculator.doMatMul (2, mWorld);
    // fragNormal = matrixCalculator.res;
    // var resLength = matrixCalculator.doMatMul (0, my_multiple( my_multiple( my_multiple( mProj, mView ), mWorld ));
    // gl_Position = matrixCalculator.res;


    //放进varying数据
    var newData1 = new Varying_data;
    newData1.shaderName = "tri_point";
    newData1.varyEleNum = 3;
    newData1.uniformData = handle_gl_Position(gl_Position);
    ProgramDataMap[activeProgramNum].varyingData.push(newData1);

  
    var t0 = performance.now();
    var newData2 = new Varying_data;
    newData2.shaderName = "text_point";
    newData2.varyEleNum = 2;
    newData2.uniformData = fragTexCoord.map(x => x.map(y => Math.floor(y * 1000)))
    ProgramDataMap[activeProgramNum].varyingData.push(newData2);

    var newData3 = new Varying_data;
    newData3.shaderName = "nor_point";
    newData3.varyEleNum = 3;
    // fragNormal = math.flatten(fragNormal);
    // console.log(fragNormal);
    newData3.uniformData = fragNormal.map(x => x.map(y => Math.floor(y * 1000)))
        ProgramDataMap[activeProgramNum].varyingData.push(newData3);

    var newData4 = new Varying_data;
    newData4.shaderName = "vPosition";
    newData4.varyEleNum = 4;
    newData4.uniformData = fragTexCoord.map(x => x.map(y => Math.floor(y * 1000)))
    ProgramDataMap[activeProgramNum].varyingData.push(newData4);



    //判断是否是正面
    var t0 = performance.now();
    var index_num = ProgramDataMap[activeProgramNum].varyingData[0].uniformData.length;
    var x0, y0, x1, y1, z1, x2, y2, z2, x3,  y3, z3;
    var tem_varying = []; //创建临时的varying二维数组去储存所有的数据
    for(j = 0; j < ProgramDataMap[activeProgramNum].varyingData.length; j++)
      tem_varying.push([]);
    for (var i = 0; i < index_num; i += 9){
      x1 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i];
      y1 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i + 1];
      z1 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i + 2];
      x2 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i + 3];
      y2 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i + 4];
      z2 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i + 5];
      x3 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i + 6];
      y3 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i + 7];
      z3 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i + 8];
      if (((x2 - x1)*(y3 - y1) - (x3 - x1)*(y2 - y1)) > 0.0){
      for(j = 0; j < ProgramDataMap[activeProgramNum].varyingData.length; j++){
        for (k = 0; k < 3; k++)
        tem_varying[j].push(ProgramDataMap[activeProgramNum].varyingData[j].uniformData[i + k]);
      }
      }
    }
    for (var idx in tem_varying)
      tem_varying[idx] = math.flatten(tem_varying[idx]);

  

    devide_draw(0, 255, tem_varying, gl);
  }
}




  //数据清除
  ProgramDataMap[activeProgramNum].attriData = [];
  ProgramDataMap[activeProgramNum].uniformData = [];
  ProgramDataMap[activeProgramNum].varyingData = [];



}


    /*-------------------------draw array--------------------------------------*/
  
    var uniform_number  = 75;
  
    function devide_draw(left, right, tem_varying, gl){
    
      var tem = [];
      var left_varying = [];
      var right_varying = [];
      var tri_number = tem_varying[0].length / 9;
      var mid = Math.floor((left + right) / 2);
      var left_number = 0;
      var right_number = 0;
      var __Program;
      var activeProgramNum;
      var __VertexPositionAttributeLocation1;
      __Program = getactiveProgram();
      activeProgramNum = getactiveProgramNum();
      var canvas_left;
      var canvas_mid;
      var canvas_right;
    
    
      for (var i = 0; i < tem_varying.length; i++){
      left_varying.push([]);
      right_varying.push([]);
      }
      for (var i = 0; i < tri_number; i++){
      if (!((tem_varying[0][i * 9] >= mid) && (tem_varying[0][i * 9 + 3] >= mid) && (tem_varying[0][i * 9 + 6] >= mid))){
        left_number ++;
        //后加入同一化的代码
        for (var j = 0; j < tem_varying.length; j++){
        for (var k = 0; k < 3 * ProgramDataMap[activeProgramNum].varyingData[j].varyEleNum; k++)
          left_varying[j].push(tem_varying[j][i * 3 * ProgramDataMap[activeProgramNum].varyingData[j].varyEleNum + k]);
        }
    
      }   
      if (!((tem_varying[0][i * 9] <= mid) && (tem_varying[0][i * 9 + 3] <= mid) && (tem_varying[0][i * 9 + 6] <= mid))){
        right_number ++;
        //后加入的代码
        for (var j = 0; j < tem_varying.length; j++){
        for (var k = 0; k < 3 * ProgramDataMap[activeProgramNum].varyingData[j].varyEleNum; k++)
          right_varying[j].push(tem_varying[j][i * 3 * ProgramDataMap[activeProgramNum].varyingData[j].varyEleNum + k]);
        }     
      }
      }
    
      if (left_number <= uniform_number){
      if (left_number > 0){
    
        var right_canvas_buffer = [
        left * 2 / 255 - 1.0,     -1.0, 
        mid * 2 / 255 - 1.0,      -1.0, 
        left * 2 / 255 - 1.0,      1.0, 
        left * 2 / 255 - 1.0,      1.0,
        mid * 2 / 255 - 1.0,      -1.0, 
        mid * 2 / 255 - 1.0,       1.0]; 
        // console.log("left",left, "right", mid);
    
        var new_vertex_buffer = gl.createBuffer();
        gl.my_bindBuffer(gl.ARRAY_BUFFER, new_vertex_buffer);
        gl.my_glbufferData(gl.ARRAY_BUFFER, new Float32Array(right_canvas_buffer), gl.STATIC_DRAW);
        __VertexPositionAttributeLocation1 = gl.my_getAttribLocation(__Program, 'vertPosition');
    
        gl.my_vertexAttribPointer(__VertexPositionAttributeLocation1, 2 ,gl.FLOAT, gl.FALSE, 2 * Float32Array.BYTES_PER_ELEMENT , 0); 
        gl.enableVertexAttribArray(__VertexPositionAttributeLocation1); 
        gl.my_useProgram(__Program);
        var traingles_num_loc = gl.my_getUniformLocation(__Program, "tri_number");
        gl.my_uniform1i(traingles_num_loc, left_number);
        transUniform(__Program);
        //要实现自动化的代码
        var loc_array = [];
        for(var i = 0; i < ProgramDataMap[activeProgramNum].varyingData.length; i++){
        loc_array[i] = gl.my_getUniformLocation(__Program, ProgramDataMap[activeProgramNum].varyingData[i].shaderName);
        if (ProgramDataMap[activeProgramNum].varyingData[i].varyEleNum == 2)
          gl.my_uniform2iv(loc_array[i], left_varying[i]);
        else if (ProgramDataMap[activeProgramNum].varyingData[i].varyEleNum == 3){
          gl.my_uniform3iv(loc_array[i], left_varying[i]);
        //   console.log("left_varying",i,left_varying[i]);
        }
        else if (ProgramDataMap[activeProgramNum].varyingData[i].varyEleNum == 4)
          gl.my_uniform4iv(loc_array[i], left_varying[i]);
        else
          console.log("暂时还没有写这种情况");
        }
        //console.log("left");
        //console.log("left_varying",left_varying);
        gl.my_drawArrays(gl.TRIANGLES, 0, 6);
      }
      }
      else{
      if (mid == right){
    
        devide_draw_height(left, right, 0, 255, tem_varying , gl);
        return;
      } 
      devide_draw(left, mid, left_varying, gl);
      }
    
      if (right_number <= uniform_number){
      if (right_number > 0){
        var right_canvas_buffer = [
        mid * 2 / 255 - 1.0, -1.0, 
        right * 2 / 255 - 1.0, -1.0, 
        mid * 2 / 255 - 1.0,  1.0, 
        mid * 2 / 255 - 1.0,  1.0,
        right * 2 / 255 - 1.0, -1.0, 
        right * 2 / 255 - 1.0,  1.0]; 
        // console.log("left",mid, "right", right);
        var new_vertex_buffer = gl.createBuffer();
        gl.my_bindBuffer(gl.ARRAY_BUFFER, new_vertex_buffer);
        gl.my_glbufferData(gl.ARRAY_BUFFER, new Float32Array(right_canvas_buffer), gl.STATIC_DRAW);
        __VertexPositionAttributeLocation1 = gl.my_getAttribLocation(__Program, 'vertPosition');
        gl.my_vertexAttribPointer(__VertexPositionAttributeLocation1, 2 ,gl.FLOAT, gl.FALSE, 2 * Float32Array.BYTES_PER_ELEMENT , 0); 
        gl.enableVertexAttribArray(__VertexPositionAttributeLocation1);   
        gl.my_useProgram(__Program);
        var traingles_num_loc = gl.my_getUniformLocation(__Program, "tri_number");
        gl.my_uniform1i(traingles_num_loc, right_number);
        transUniform(__Program);
        //要实现自动化的代码
        var loc_array = [];
        for(var i = 0; i < ProgramDataMap[activeProgramNum].varyingData.length; i++){
        loc_array[i] = gl.my_getUniformLocation(__Program, ProgramDataMap[activeProgramNum].varyingData[i].shaderName);
        if (ProgramDataMap[activeProgramNum].varyingData[i].varyEleNum == 2)
          gl.my_uniform2iv(loc_array[i], right_varying[i]);
        else if (ProgramDataMap[activeProgramNum].varyingData[i].varyEleNum == 3){
          gl.my_uniform3iv(loc_array[i], right_varying[i]);
        //   console.log("right_varying",i,  right_varying[i]);
        }
    
        else if (ProgramDataMap[activeProgramNum].varyingData[i].varyEleNum == 4)
          gl.my_uniform4iv(loc_array[i], right_varying[i]);
        else 
          console.log("暂时还没有写这种情况");
        }
    
        gl.my_drawArrays(gl.TRIANGLES, 0, 6);
      }
      }
      else{
      if (mid == left){
    
        devide_draw_height(left, right, 0, 255, tem_varying, gl);
    
        return;
      } 
      devide_draw(mid, right, right_varying, gl);
      }
      return;
    }
    
    
    
    
    function devide_draw_height(left, right, bot, top, tem_varying, gl){
      var canvas_left;
      var canvas_mid;
      var canvas_right;
      var canvas_bot;
      var canvas_top;
      var tem = [];
      var bot_varying = [];
      var top_varying = [];
      var tri_number = tem_varying[0].length / 9;
      var mid = Math.floor((bot + top) / 2);
      var bot_number = 0;
      var top_number = 0;
      var __Program;
      var activeProgramNum;
      var __VertexPositionAttributeLocation1;
      __Program = getactiveProgram();
      activeProgramNum = getactiveProgramNum();
    
    
      //console.log("中间点", mid);
      for (var i = 0; i < tem_varying.length; i++){
      bot_varying.push(tem);
      top_varying.push(tem);
      }
      for (var i = 0; i < tri_number; i++){
      if (!((tem_varying[0][i * 9 + 1] >= mid) && (tem_varying[0][i * 9 + 4] >= mid) && (tem_varying[0][i * 9 + 7] >= mid))){
        bot_number ++;
        //后加入同一化的代码
        for (var j = 0; j < tem_varying.length; j++){
        for (var k = 0; k < 3 * ProgramDataMap[activeProgramNum].varyingData[j].varyEleNum; k++)
          bot_varying[j] = bot_varying[j].concat(tem_varying[j][i * 3 * ProgramDataMap[activeProgramNum].varyingData[j].varyEleNum + k]);
        } 
      }   
      if (!((tem_varying[0][i * 9 + 1] <= mid) && (tem_varying[0][i * 9 + 4] <= mid) && (tem_varying[0][i * 9 + 7] <= mid))){
    
        top_number ++;
        //后加入同一化的代码
        for (var j = 0; j < tem_varying.length; j++){
        for (var k = 0; k < 3 * ProgramDataMap[activeProgramNum].varyingData[j].varyEleNum; k++)
          top_varying[j] = top_varying[j].concat(tem_varying[j][i * 3 * ProgramDataMap[activeProgramNum].varyingData[j].varyEleNum + k]);
        }
      }
      }
      if (bot_number <= uniform_number){
    
      if (bot_number > 0){
        var right_canvas_buffer = [
        left * 2 / 255 - 1.0,   bot * 2 / 255 -1.0, 
        right * 2 / 255 - 1.0,    bot * 2 / 255 -1.0, 
        left * 2 / 255 - 1.0,    mid * 2 / 255 -1.0, 
        left * 2 / 255 - 1.0,    mid * 2 / 255 -1.0,
        right * 2 / 255 - 1.0,    bot * 2 / 255 -1.0, 
        right * 2 / 255 - 1.0,    mid * 2 / 255 -1.0]; 
    
        var new_vertex_buffer = gl.createBuffer();
        gl.my_bindBuffer(gl.ARRAY_BUFFER, new_vertex_buffer);
        gl.my_glbufferData(gl.ARRAY_BUFFER, new Float32Array(right_canvas_buffer), gl.STATIC_DRAW);
        __VertexPositionAttributeLocation1 = gl.my_getAttribLocation(__Program, 'vertPosition');
        gl.my_vertexAttribPointer(__VertexPositionAttributeLocation1, 2 ,gl.FLOAT, gl.FALSE, 2 * Float32Array.BYTES_PER_ELEMENT , 0); 
        gl.enableVertexAttribArray(__VertexPositionAttributeLocation1);   
        gl.my_useProgram(__Program);
        var traingles_num_loc = gl.my_getUniformLocation(__Program, "tri_number");
        gl.my_uniform1i(traingles_num_loc, bot_number);
        transUniform(__Program);
        //要实现自动化的代码
        var loc_array = [];
        for(var i = 0; i < ProgramDataMap[activeProgramNum].varyingData.length; i++){
        loc_array[i] = gl.my_getUniformLocation(__Program, ProgramDataMap[activeProgramNum].varyingData[i].shaderName);
        if (ProgramDataMap[activeProgramNum].varyingData[i].varyEleNum == 2)
          gl.my_uniform2iv(loc_array[i], bot_varying[i]);
        else if (ProgramDataMap[activeProgramNum].varyingData[i].varyEleNum == 3){
          gl.my_uniform3iv(loc_array[i], bot_varying[i]);
        //   console.log("bot_varying",i,bot_varying[i]);
        }
    
        else if (ProgramDataMap[activeProgramNum].varyingData[i].varyEleNum == 4)
          gl.my_uniform4iv(loc_array[i], bot_varying[i]);
        else 
          console.log("暂时还没有写这种情况");
        }
    
        gl.my_drawArrays(gl.TRIANGLES, 0, 6);
      }
      }
      else{
      if (mid == top){
    
        return;
      } 
      devide_draw_height(left, right, bot, mid, bot_varying, gl);
      } 
    
      if (top_number <= uniform_number){
    
      if (top_number > 0){
        var right_canvas_buffer = [
        left * 2 / 255 - 1.0, mid * 2 / 255 -1.0, 
        right * 2 / 255 - 1.0,  mid * 2 / 255 -1.0, 
        left * 2 / 255 - 1.0,  top * 2 / 255 -1.0, 
        left * 2 / 255 - 1.0,  top * 2 / 255 -1.0,
        right * 2 / 255 - 1.0,  mid * 2 / 255 -1.0, 
        right * 2 / 255 - 1.0,  top * 2 / 255 -1.0]; 
    
    
        var new_vertex_buffer = gl.createBuffer();
        gl.my_bindBuffer(gl.ARRAY_BUFFER, new_vertex_buffer);
        gl.my_glbufferData(gl.ARRAY_BUFFER, new Float32Array(right_canvas_buffer), gl.STATIC_DRAW);
        __VertexPositionAttributeLocation1 = gl.my_getAttribLocation(__Program, 'vertPosition');
        gl.my_vertexAttribPointer(__VertexPositionAttributeLocation1, 2 ,gl.FLOAT, gl.FALSE, 2 * Float32Array.BYTES_PER_ELEMENT , 0); 
        gl.enableVertexAttribArray(__VertexPositionAttributeLocation1);   
        gl.my_useProgram(__Program);
        var traingles_num_loc = gl.my_getUniformLocation(__Program, "tri_number");
        gl.my_uniform1i(traingles_num_loc, top_number);
        transUniform(__Program);
        //要实现自动化的代码
        var loc_array = [];
        for(var i = 0; i < ProgramDataMap[activeProgramNum].varyingData.length; i++){
        loc_array[i] = gl.my_getUniformLocation(__Program, ProgramDataMap[activeProgramNum].varyingData[i].shaderName);
        if (ProgramDataMap[activeProgramNum].varyingData[i].varyEleNum == 2)
          gl.my_uniform2iv(loc_array[i], top_varying[i]);
        else if (ProgramDataMap[activeProgramNum].varyingData[i].varyEleNum == 3){
          gl.my_uniform3iv(loc_array[i], top_varying[i]);
        //   console.log("top_varying",i,top_varying[i]);
        }
    
        else if (ProgramDataMap[activeProgramNum].varyingData[i].varyEleNum == 4)
          gl.my_uniform4iv(loc_array[i], top_varying[i]);
        else 
          console.log("暂时还没有写这种情况");
        }
        gl.my_drawArrays(gl.TRIANGLES, 0, 6);
      }
      }
      else{
      if (mid == left){
        //console.log("left", left, "right", right, "bot", bot, "top", top, "number", top_number);
        return;
      } 
      devide_draw_height(left, right, mid, top, top_varying, gl);
      }
      return;
    }
    
    transUniform = function(__Program){
      for (var i = 0; i < ProgramDataMap.length; i++){
      if (ProgramDataMap[i].activeFlag == 1){
        for (var j = 0; j < ProgramDataMap[i].uniformData.length; j++){
        var loc = gl.my_getUniformLocation(__Program, ProgramDataMap[i].uniformData[j].shaderName);
        if (loc != null){ 
          var multiple = 1000;
          gl.my_uniform3i(loc, ProgramDataMap[i].uniformData[j].uniformData[0] * multiple, ProgramDataMap[i].uniformData[j].uniformData[1] * multiple, ProgramDataMap[i].uniformData[j].uniformData[2] * multiple);
        }
        }
      }
      }
    }
    
    





  return gl;
}
}


//计算矩阵的库
var my_m4 = {
  
  projection: function(width, height, depth) {
    // Note: This matrix flips the Y axis so 0 is at the top.
    return [
    2 / width, 0, 0, 0,
    0, -2 / height, 0, 0,
    0, 0, 2 / depth, 0,
    -1, 1, 0, 1,
    ];
  },
  
  vec_max_mul: function(a,b){
    var result = [];
    // 这个系数是我确定的，这个之后再确认
    var number = 0.1 * 1.5;
    var b00 = b[0 * 4 + 0];
    var b01 = b[0 * 4 + 1];
    var b02 = b[0 * 4 + 2];
    var b03 = b[0 * 4 + 3];
    var b10 = b[1 * 4 + 0];
    var b11 = b[1 * 4 + 1];
    var b12 = b[1 * 4 + 2];
    var b13 = b[1 * 4 + 3];
    var b20 = b[2 * 4 + 0];
    var b21 = b[2 * 4 + 1];
    var b22 = b[2 * 4 + 2];
    var b23 = b[2 * 4 + 3];
    var b30 = b[3 * 4 + 0];
    var b31 = b[3 * 4 + 1];
    var b32 = b[3 * 4 + 2];
    var b33 = b[3 * 4 + 3];
    //console.log(b00,b01,b02);
    for (var i = 0; i < a.length; i += 3){
      var w = a[i] * b30 + a[i+1] * b31 + a[i+2] * b32 + b33;
      result = result.concat((a[i] * b00 + a[i+1] * b01 + a[i+2] * b02 + b03) / w);
      result = result.concat((a[i] * b10 + a[i+1] * b11 + a[i+2] * b12 + b13) / w);
      result = result.concat((a[i] * b20 + a[i+1] * b21 + a[i+2] * b22 + b23) / w);
    }
    //console.log("result", result);
    return result;
  
  },
  
  multiply: function(a, b) {
    var a00 = a[0 * 4 + 0];
    var a01 = a[0 * 4 + 1];
    var a02 = a[0 * 4 + 2];
    var a03 = a[0 * 4 + 3];
    var a10 = a[1 * 4 + 0];
    var a11 = a[1 * 4 + 1];
    var a12 = a[1 * 4 + 2];
    var a13 = a[1 * 4 + 3];
    var a20 = a[2 * 4 + 0];
    var a21 = a[2 * 4 + 1];
    var a22 = a[2 * 4 + 2];
    var a23 = a[2 * 4 + 3];
    var a30 = a[3 * 4 + 0];
    var a31 = a[3 * 4 + 1];
    var a32 = a[3 * 4 + 2];
    var a33 = a[3 * 4 + 3];
    var b00 = b[0 * 4 + 0];
    var b01 = b[0 * 4 + 1];
    var b02 = b[0 * 4 + 2];
    var b03 = b[0 * 4 + 3];
    var b10 = b[1 * 4 + 0];
    var b11 = b[1 * 4 + 1];
    var b12 = b[1 * 4 + 2];
    var b13 = b[1 * 4 + 3];
    var b20 = b[2 * 4 + 0];
    var b21 = b[2 * 4 + 1];
    var b22 = b[2 * 4 + 2];
    var b23 = b[2 * 4 + 3];
    var b30 = b[3 * 4 + 0];
    var b31 = b[3 * 4 + 1];
    var b32 = b[3 * 4 + 2];
    var b33 = b[3 * 4 + 3];
    return [
    b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
    b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
    b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
    b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
    b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
    b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
    b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
    b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
    b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
    b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
    b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
    b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
    b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
    b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
    b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
    b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
    ];
  }
  };

  catchShader = function(gl, canvas){
    // gl.my_shaderSource = gl.__proto__.shaderSource;
    // gl.shaderSource = function(shaderName,shaderSource){
    //   gl.my_shaderSource(shaderName,shaderSource);
    //   console.log("*************************************************************");
    //   console.log(shaderSource);
    // }

    // gl.my_activeTexture = gl.__proto__.activeTexture;
    // gl.activeTexture = function(a){
    //   gl.my_activeTexture(a);
    //   console.log("texture",a);

    // }

  //   gl.my_glbufferData = gl.__proto__.bufferData;
  //   gl.bufferData = function (bufferType, bufferData, c){
  //     gl.my_glbufferData(bufferType, bufferData, c);
  //     console.log(bufferType, bufferData);
  //   }


    gl.my_useProgram =  gl.__proto__.useProgram;
    gl.useProgram = function (programName){
      gl.my_useProgram(programName);
      // console.log("use program");
      var t1 = performance.now()
      while(performance.now() - t1 < 100);
    }

  //   gl.my_drawArrays = gl.__proto__.drawArrays;
  //   gl.drawArrays = function(mode, first, count){
  //     gl.my_drawArrays(mode, first, count);
  //     console.log("my_drawArrays",mode);
  //   }

  //   gl.my_drawElements = gl.__proto__.drawElements;
  // gl.drawElements = function(mode, count, type, offset){
  //   gl.my_drawElements(mode, count, type, offset);
  //   console.log("drawElements", mode);
  // }

  // gl.my_drawArrays = gl.__proto__.drawArrays;
  // gl.drawArrays = function(mode, first, count){
  //   var t1 = performance.now()
  //   while(performance.now() - t1 < 10);
  //   gl.my_drawArrays(mode, first, count);
  // }

    


  // gl.my_shaderSource = gl.__proto__.shaderSource;
  // gl.shaderSource = function(shaderName,shaderSource){

    /*============================demo===================================*/
    //正式使用时候的
    //shaderSource = manualChangeShader(shaderSource);
    // console.log(shaderSource);
    // gl.my_shaderSource(shaderName,shaderSource);
    //测试时使用的
    // console.log(shaderSource);
    //shaderSource = manualChangeShader(shaderSource);

  
  // }

    
    return gl;

  }
  
  

getCanvas = function(canvasName) {
    var canvas = $('#' + canvasName);
    if(!canvas[0]){
        $('#test_canvas').append("<canvas id='" + canvasName + "' width='256' height='256'></canvas>");
    }
    return canvas = $('#' + canvasName)[0];
}

getGLAA = function(canvas) {
  var gl = null;
  for (var i = 0; i < 4; ++i) {
    gl = canvas.getContext(
        [ "webgl", "experimental-webgl", "moz-webgl", "webkit-3d" ][i], {
          antialias : false,
          preserveDrawingBuffer : true,
          willReadFrequently : false,
          depth: true
        });
    if (gl)
      break;
  }

  if (!gl) {
    alert('Your browser does not support WebGL');
  }
  gl = rewrite(gl,canvas);
  //gl = catchShader(gl, canvas);
  return gl;
}

getGL = function(canvas) {
  var gl = null;
  for (var i = 0; i < 4; ++i) {
    gl = canvas.getContext(
        [ "webgl", "experimental-webgl", "moz-webgl", "webkit-3d" ][i], {
          antialias : false,
          preserveDrawingBuffer : true,
          willReadFrequently : false,
          depth: true
        });
    if (gl)
      break;
  }

  if (!gl) {
    alert('Your browser does not support WebGL');
  }
   gl = rewrite(gl,canvas);
   //gl = catchShader(gl, canvas);
  return gl;
}

computeKernelWeight = function(kernel) {
  var weight = kernel.reduce(function(prev, curr) { return prev + curr; });
  return weight <= 0 ? 1 : weight;
}

var loadTextResource = function(url, callback, caller) {
  var request = new XMLHttpRequest();
  request.open('GET', url + '?please-dont-cache=' + Math.random(), true);
  request.onload = function() {
    if (request.status < 200 || request.status > 299) {
      callback('Error: HTTP Status ' + request.status + ' on resource ' + url);
    } else {
      callback(null, request.responseText, caller);
    }
  };
  request.send();
};

var loadImage = function(url, callback, caller) {
  var image = new Image();
  image.onload = function() { callback(null, image, caller); };
  image.src = url;
};

var loadJSONResource = function(url, callback, caller) {
  loadTextResource(url, function(err, result, caller) {
    if (err) {
      callback(err);
    } else {
      try {
        callback(null, JSON.parse(result), caller);
      } catch (e) {
        callback(e);
      }
    }
  }, caller);
};
