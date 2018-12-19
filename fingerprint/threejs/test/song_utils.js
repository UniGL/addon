var handle_gl_Position = function (gl_Position) {
  gl_Position = gl_Position.map(x => 
      [
      Math.floor((x[0] / x[3] + 1) * 128),
      Math.floor((x[1] / x[3] + 1) * 128),
      - Math.floor((x[2] / x[3] + 1) * 128)
      ]);
  //gl_Position = math.flatten(gl_Position);
  return gl_Position;
}
// var my_multiple = function(a, b) {
//   a = math.matrix(a);
//   b = math.matrix(b);
//   return math.multiply(b, a);
// }
map1 = new Map;

map2 = new Map;

var my_multiple = function(a, b) { 
  //if (!a || !b) return a;
  
  if (map1.get(a)!=undefined) {
    out = map2.get(b); 
    if (out!=undefined) 
      return out;
  } 
  
  map1.set(a,b);
  if (a.length==16 && b.length==16) {
   out = new Float32Array(16);
   mat4.multiply(out, a, b);
   map2.set(b,out); 
   return out;
  }

  if (a.length == 4 && b.length == 16) {

   out = new Float32Array(4);

   vec4.transformMat4(out, a, b);

   map2.set(b,out); 

   return out;

  } 

  if (b.length == 4 && a.length == 16) {
   out = new Float32Array(4);
   vec4.transformMat4(out, b, a);
   map2.set(b,out); 
   return out;
  } 
}



var my_add = function(a, b) {
  a = math.matrix(a);
  b = math.matrix(b);
  return math.add(a, b);
}

var my_divide = function(a, b) {
  a = math.matrix(a);
  b = math.matrix(b);
  return math.divide(a, b);
}

var my_subtract = function(a, b) {
  a = math.matrix(a);
  b = math.matrix(b);
  return math.subtract(a, b);
}

// all values have to be assigned once
var set_values = function(values, js_str, num_attrs) {
  js_str_lines = js_str.split('\n');
  js_str_lines.unshift('var gl_Position = [0, 0, 0, 0];');
  var var_re = RegExp('^var ([a-zA-Z$_][a-zA-Z0-9$_]*) = (.*);');
  var res = "";
  // update the attr value and uniform value
  for (var line in js_str_lines) {
    cur_line = js_str_lines[line];
    res_line = cur_line;
    if (cur_line.match(var_re)) {
      val = var_re.exec(cur_line);
      if (val[1] in values) {
        res_line = res_line.replace(val[2], JSON.stringify(values[val[1]]));
      } else {
        var cur_val = (val[2] + ',').repeat(num_attrs).slice(0, -1);
        res_line = res_line.replace(val[2], `[${cur_val}]`);
      }
    }
    res += res_line + '\n';
  }
  
  return res;
}
