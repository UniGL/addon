var testShader = 
`
attribute vec3 vertPosition;
attribute vec2 vertTexCoord;
attribute vec3 vertNormal = vec3(4);

varying vec2 fragTexCoord;
varying vec3 fragNormal;

uniform mat4 mWorld = mat4(2);
uniform mat4 mView = mat4(5);
uniform mat4 mProj;

void main()
{
  fragTexCoord = vertTexCoord;
  fragNormal = (mWorld * vec4(vertNormal, 1.0));
  console.log(fragNormal.toString());
  console.log((mWorld * mView).toString());
  mProj += mProj;
  mProj /= mProj;
  console.log(mProj.toString());
  if (fragTexCoord == vertNormal) {
    gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
    gl_Position = gl_Position + gl_Position;
    console.log(gl_Position.toString());
  }else {
    gl_Position = mProj;
    gl_Position = mProj - mView;
  }
  gl_Position = mProj - mView;
  console.log(gl_Position.toString());
}
main();
`

var Demo = function () {
  var Compiler = GLSL();
  console.log(testShader);
  compiled = Compiler.compile(testShader);
  console.log(compiled);
  //eval(compiled);
  alert('the page will add the compiled shader');
  script = document.createElement('div');
  script.textContent=compiled;
  document.documentElement.appendChild(script);
}

Demo();
