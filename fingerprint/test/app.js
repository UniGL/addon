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
	var canvas = document.getElementById('game-surface');
	var gl = canvas.getContext('webgl');

	if (!gl) {
		console.log('WebGL not supported, falling back on experimental-webgl');
		gl = canvas.getContext('experimental-webgl');
	}
  
  var Compiler = GLSL();
  console.log(testShader);
  compiled = Compiler.compile(testShader);
  console.log(compiled);

  compiled = set_values({'mWorld': [[1,2,3,4],[2,3,4,5],[3,4,5,6],[4,5,6,7]]}, compiled);

  console.log(compiled);
  eval(compiled);
}
