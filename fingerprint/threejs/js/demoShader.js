manualChangeShader = function(shaderSource){
//console.log("in manualChangeShader");

/*==================================vertex=========================================*/
//bubble
if (shaderSource.replace("\n"," ").replace(/\s+/g, '') == `precision highp float;
precision highp int;
#define SHADER_NAME ShaderMaterial
#define GAMMA_FACTOR 2
#define FLIP_SIDED
#define NUM_CLIPPING_PLANES 0
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
#define TONE_MAPPING
#define saturate(a) clamp( a, 0.0, 1.0 )
uniform float toneMappingExposure;
uniform float toneMappingWhitePoint;
vec3 LinearToneMapping( vec3 color ) {
  return toneMappingExposure * color;
}
vec3 ReinhardToneMapping( vec3 color ) {
  color *= toneMappingExposure;
  return saturate( color / ( vec3( 1.0 ) + color ) );
}
#define Uncharted2Helper( x ) max( ( ( x * ( 0.15 * x + 0.10 * 0.50 ) + 0.20 * 0.02 ) / ( x * ( 0.15 * x + 0.50 ) + 0.20 * 0.30 ) ) - 0.02 / 0.30, vec3( 0.0 ) )
vec3 Uncharted2ToneMapping( vec3 color ) {
  color *= toneMappingExposure;
  return saturate( Uncharted2Helper( color ) / Uncharted2Helper( vec3( toneMappingWhitePoint ) ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
  color *= toneMappingExposure;
  color = max( vec3( 0.0 ), color - 0.004 );
  return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}

vec3 toneMapping( vec3 color ) { return LinearToneMapping( color ); }

vec4 LinearToLinear( in vec4 value ) {
  return value;
}
vec4 GammaToLinear( in vec4 value, in float gammaFactor ) {
  return vec4( pow( value.xyz, vec3( gammaFactor ) ), value.w );
}
vec4 LinearToGamma( in vec4 value, in float gammaFactor ) {
  return vec4( pow( value.xyz, vec3( 1.0 / gammaFactor ) ), value.w );
}
vec4 sRGBToLinear( in vec4 value ) {
  return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.w );
}
vec4 LinearTosRGB( in vec4 value ) {
  return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.w );
}
vec4 RGBEToLinear( in vec4 value ) {
  return vec4( value.rgb * exp2( value.a * 255.0 - 128.0 ), 1.0 );
}
vec4 LinearToRGBE( in vec4 value ) {
  float maxComponent = max( max( value.r, value.g ), value.b );
  float fExp = clamp( ceil( log2( maxComponent ) ), -128.0, 127.0 );
  return vec4( value.rgb / exp2( fExp ), ( fExp + 128.0 ) / 255.0 );
}
vec4 RGBMToLinear( in vec4 value, in float maxRange ) {
  return vec4( value.xyz * value.w * maxRange, 1.0 );
}
vec4 LinearToRGBM( in vec4 value, in float maxRange ) {
  float maxRGB = max( value.x, max( value.g, value.b ) );
  float M      = clamp( maxRGB / maxRange, 0.0, 1.0 );
  M            = ceil( M * 255.0 ) / 255.0;
  return vec4( value.rgb / ( M * maxRange ), M );
}
vec4 RGBDToLinear( in vec4 value, in float maxRange ) {
    return vec4( value.rgb * ( ( maxRange / 255.0 ) / value.a ), 1.0 );
}
vec4 LinearToRGBD( in vec4 value, in float maxRange ) {
    float maxRGB = max( value.x, max( value.g, value.b ) );
    float D      = max( maxRange / maxRGB, 1.0 );
    D            = min( floor( D ) / 255.0, 1.0 );
    return vec4( value.rgb * ( D * ( 255.0 / maxRange ) ), D );
}
const mat3 cLogLuvM = mat3( 0.2209, 0.3390, 0.4184, 0.1138, 0.6780, 0.7319, 0.0102, 0.1130, 0.2969 );
vec4 LinearToLogLuv( in vec4 value )  {
  vec3 Xp_Y_XYZp = value.rgb * cLogLuvM;
  Xp_Y_XYZp = max(Xp_Y_XYZp, vec3(1e-6, 1e-6, 1e-6));
  vec4 vResult;
  vResult.xy = Xp_Y_XYZp.xy / Xp_Y_XYZp.z;
  float Le = 2.0 * log2(Xp_Y_XYZp.y) + 127.0;
  vResult.w = fract(Le);
  vResult.z = (Le - (floor(vResult.w*255.0))/255.0)/255.0;
  return vResult;
}
const mat3 cLogLuvInverseM = mat3( 6.0014, -2.7008, -1.7996, -1.3320, 3.1029, -5.7721, 0.3008, -1.0882, 5.6268 );
vec4 LogLuvToLinear( in vec4 value ) {
  float Le = value.z * 255.0 + value.w;
  vec3 Xp_Y_XYZp;
  Xp_Y_XYZp.y = exp2((Le - 127.0) / 2.0);
  Xp_Y_XYZp.z = Xp_Y_XYZp.y / value.y;
  Xp_Y_XYZp.x = value.x * Xp_Y_XYZp.z;
  vec3 vRGB = Xp_Y_XYZp.rgb * cLogLuvInverseM;
  return vec4( max(vRGB, 0.0), 1.0 );
}

vec4 mapTexelToLinear( vec4 value ) { return LinearToLinear( value ); }
vec4 envMapTexelToLinear( vec4 value ) { return LinearToLinear( value ); }
vec4 emissiveMapTexelToLinear( vec4 value ) { return LinearToLinear( value ); }
vec4 linearToOutputTexel( vec4 value ) { return LinearToLinear( value ); }

uniform samplerCube tCube;
uniform float tFlip;
varying vec3 vWorldPosition;
#define PI 3.14159265359
#define PI2 6.28318530718
#define RECIPROCAL_PI 0.31830988618
#define RECIPROCAL_PI2 0.15915494
#define LOG2 1.442695
#define EPSILON 1e-6
#define saturate(a) clamp( a, 0.0, 1.0 )
#define whiteCompliment(a) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float average( const in vec3 color ) { return dot( color, vec3( 0.3333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract(sin(sn) * c);
}
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
struct GeometricContext {
	vec3 position;
	vec3 normal;
	vec3 viewDir;
};
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
vec3 projectOnPlane(in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {
	float distance = dot( planeNormal, point - pointOnPlane );
	return - distance * planeNormal + point;
}
float sideOfPlane( in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {
	return sign( dot( point - pointOnPlane, planeNormal ) );
}
vec3 linePlaneIntersect( in vec3 pointOnLine, in vec3 lineDirection, in vec3 pointOnPlane, in vec3 planeNormal ) {
	return lineDirection * ( dot( planeNormal, pointOnPlane - pointOnLine ) / dot( planeNormal, lineDirection ) ) + pointOnLine;
}

#ifdef USE_LOGDEPTHBUF
	uniform float logDepthBufFC;
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
	#endif
#endif

#if NUM_CLIPPING_PLANES > 0
	#if ! defined( PHYSICAL ) && ! defined( PHONG )
		varying vec3 vViewPosition;
	#endif
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif

void main() {
	#if NUM_CLIPPING_PLANES > 0
	for ( int i = 0; i < NUM_CLIPPING_PLANES; ++ i ) {
		vec4 plane = clippingPlanes[ i ];
		if ( dot( vViewPosition, plane.xyz ) > plane.w ) discard;
	}
#endif

	gl_FragColor = textureCube( tCube, vec3( tFlip * vWorldPosition.x, vWorldPosition.yz ) );
	#if defined(USE_LOGDEPTHBUF) && defined(USE_LOGDEPTHBUF_EXT)
	gl_FragDepthEXT = log2(vFragDepth) * logDepthBufFC * 0.5;
#endif
}`.replace("\n"," ").replace(/\s+/g, ''))
{
  // console.log("iiiiiiii");
  return `precision highp float;
  uniform samplerCube tCube;
  uniform float tFlip;
  varying vec3 vWorldPosition;
  void main() {
    gl_FragColor = textureCube( tCube, vec3( tFlip * vWorldPosition.x, vWorldPosition.yz ) );

  }`;
}

// var i = 0;
// console.log("i", i++);
// return shaderSource;
if (shaderSource.replace("\n"," ").replace(/\s+/g, '') == `precision highp float;
precision highp int;
#define SHADER_NAME ShaderMaterial
#define GAMMA_FACTOR 2
#define NUM_CLIPPING_PLANES 0
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
#define TONE_MAPPING
#define saturate(a) clamp( a, 0.0, 1.0 )
uniform float toneMappingExposure;
uniform float toneMappingWhitePoint;
vec3 LinearToneMapping( vec3 color ) {
  return toneMappingExposure * color;
}
vec3 ReinhardToneMapping( vec3 color ) {
  color *= toneMappingExposure;
  return saturate( color / ( vec3( 1.0 ) + color ) );
}
#define Uncharted2Helper( x ) max( ( ( x * ( 0.15 * x + 0.10 * 0.50 ) + 0.20 * 0.02 ) / ( x * ( 0.15 * x + 0.50 ) + 0.20 * 0.30 ) ) - 0.02 / 0.30, vec3( 0.0 ) )
vec3 Uncharted2ToneMapping( vec3 color ) {
  color *= toneMappingExposure;
  return saturate( Uncharted2Helper( color ) / Uncharted2Helper( vec3( toneMappingWhitePoint ) ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
  color *= toneMappingExposure;
  color = max( vec3( 0.0 ), color - 0.004 );
  return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}

vec3 toneMapping( vec3 color ) { return LinearToneMapping( color ); }

vec4 LinearToLinear( in vec4 value ) {
  return value;
}
vec4 GammaToLinear( in vec4 value, in float gammaFactor ) {
  return vec4( pow( value.xyz, vec3( gammaFactor ) ), value.w );
}
vec4 LinearToGamma( in vec4 value, in float gammaFactor ) {
  return vec4( pow( value.xyz, vec3( 1.0 / gammaFactor ) ), value.w );
}
vec4 sRGBToLinear( in vec4 value ) {
  return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.w );
}
vec4 LinearTosRGB( in vec4 value ) {
  return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.w );
}
vec4 RGBEToLinear( in vec4 value ) {
  return vec4( value.rgb * exp2( value.a * 255.0 - 128.0 ), 1.0 );
}
vec4 LinearToRGBE( in vec4 value ) {
  float maxComponent = max( max( value.r, value.g ), value.b );
  float fExp = clamp( ceil( log2( maxComponent ) ), -128.0, 127.0 );
  return vec4( value.rgb / exp2( fExp ), ( fExp + 128.0 ) / 255.0 );
}
vec4 RGBMToLinear( in vec4 value, in float maxRange ) {
  return vec4( value.xyz * value.w * maxRange, 1.0 );
}
vec4 LinearToRGBM( in vec4 value, in float maxRange ) {
  float maxRGB = max( value.x, max( value.g, value.b ) );
  float M      = clamp( maxRGB / maxRange, 0.0, 1.0 );
  M            = ceil( M * 255.0 ) / 255.0;
  return vec4( value.rgb / ( M * maxRange ), M );
}
vec4 RGBDToLinear( in vec4 value, in float maxRange ) {
    return vec4( value.rgb * ( ( maxRange / 255.0 ) / value.a ), 1.0 );
}
vec4 LinearToRGBD( in vec4 value, in float maxRange ) {
    float maxRGB = max( value.x, max( value.g, value.b ) );
    float D      = max( maxRange / maxRGB, 1.0 );
    D            = min( floor( D ) / 255.0, 1.0 );
    return vec4( value.rgb * ( D * ( 255.0 / maxRange ) ), D );
}
const mat3 cLogLuvM = mat3( 0.2209, 0.3390, 0.4184, 0.1138, 0.6780, 0.7319, 0.0102, 0.1130, 0.2969 );
vec4 LinearToLogLuv( in vec4 value )  {
  vec3 Xp_Y_XYZp = value.rgb * cLogLuvM;
  Xp_Y_XYZp = max(Xp_Y_XYZp, vec3(1e-6, 1e-6, 1e-6));
  vec4 vResult;
  vResult.xy = Xp_Y_XYZp.xy / Xp_Y_XYZp.z;
  float Le = 2.0 * log2(Xp_Y_XYZp.y) + 127.0;
  vResult.w = fract(Le);
  vResult.z = (Le - (floor(vResult.w*255.0))/255.0)/255.0;
  return vResult;
}
const mat3 cLogLuvInverseM = mat3( 6.0014, -2.7008, -1.7996, -1.3320, 3.1029, -5.7721, 0.3008, -1.0882, 5.6268 );
vec4 LogLuvToLinear( in vec4 value ) {
  float Le = value.z * 255.0 + value.w;
  vec3 Xp_Y_XYZp;
  Xp_Y_XYZp.y = exp2((Le - 127.0) / 2.0);
  Xp_Y_XYZp.z = Xp_Y_XYZp.y / value.y;
  Xp_Y_XYZp.x = value.x * Xp_Y_XYZp.z;
  vec3 vRGB = Xp_Y_XYZp.rgb * cLogLuvInverseM;
  return vec4( max(vRGB, 0.0), 1.0 );
}

vec4 mapTexelToLinear( vec4 value ) { return LinearToLinear( value ); }
vec4 envMapTexelToLinear( vec4 value ) { return LinearToLinear( value ); }
vec4 emissiveMapTexelToLinear( vec4 value ) { return LinearToLinear( value ); }
vec4 linearToOutputTexel( vec4 value ) { return LinearToLinear( value ); }

uniform samplerCube tCube;
varying vec3 vReflect;
varying vec3 vRefract[3];
varying float vReflectionFactor;
void main() {
vec4 reflectedColor = textureCube( tCube, vec3( -vReflect.x, vReflect.yz ) );
vec4 refractedColor = vec4( 1.0 );
refractedColor.r = textureCube( tCube, vec3( -vRefract[0].x, vRefract[0].yz ) ).r;
refractedColor.g = textureCube( tCube, vec3( -vRefract[1].x, vRefract[1].yz ) ).g;
refractedColor.b = textureCube( tCube, vec3( -vRefract[2].x, vRefract[2].yz ) ).b;
gl_FragColor = mix( refractedColor, reflectedColor, clamp( vReflectionFactor, 0.0, 1.0 ) );
}`.replace("\n"," ").replace(/\s+/g, ''))
{
  // console.log("iiiiiiii");
  return `precision highp float;
  uniform samplerCube tCube;
  varying vec3 vReflect;
  varying float vReflectionFactor;
  void main() {
  vec4 reflectedColor = textureCube( tCube, vec3( -vReflect.x, vReflect.yz ) );
  vec4 refractedColor = vec4( 0.5 );
  gl_FragColor = vec4(mix( refractedColor, reflectedColor, clamp( vReflectionFactor, 0.0, 1.0 )).xyz, 1.0 ) ;
  }`;
}

if (shaderSource.replace("\n"," ").replace(/\s+/g, '') == `precision highp float;
precision highp int;
#define SHADER_NAME ShaderMaterial
#define VERTEX_TEXTURES
#define GAMMA_FACTOR 2
#define MAX_BONES 251
#define FLIP_SIDED
#define NUM_CLIPPING_PLANES 0
uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat3 normalMatrix;
uniform vec3 cameraPosition;
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
#ifdef USE_COLOR
	attribute vec3 color;
#endif
#ifdef USE_MORPHTARGETS
	attribute vec3 morphTarget0;
	attribute vec3 morphTarget1;
	attribute vec3 morphTarget2;
	attribute vec3 morphTarget3;
	#ifdef USE_MORPHNORMALS
		attribute vec3 morphNormal0;
		attribute vec3 morphNormal1;
		attribute vec3 morphNormal2;
		attribute vec3 morphNormal3;
	#else
		attribute vec3 morphTarget4;
		attribute vec3 morphTarget5;
		attribute vec3 morphTarget6;
		attribute vec3 morphTarget7;
	#endif
#endif
#ifdef USE_SKINNING
	attribute vec4 skinIndex;
	attribute vec4 skinWeight;
#endif

varying vec3 vWorldPosition;
#define PI 3.14159265359
#define PI2 6.28318530718
#define RECIPROCAL_PI 0.31830988618
#define RECIPROCAL_PI2 0.15915494
#define LOG2 1.442695
#define EPSILON 1e-6
#define saturate(a) clamp( a, 0.0, 1.0 )
#define whiteCompliment(a) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float average( const in vec3 color ) { return dot( color, vec3( 0.3333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract(sin(sn) * c);
}
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
struct GeometricContext {
	vec3 position;
	vec3 normal;
	vec3 viewDir;
};
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
vec3 projectOnPlane(in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {
	float distance = dot( planeNormal, point - pointOnPlane );
	return - distance * planeNormal + point;
}
float sideOfPlane( in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {
	return sign( dot( point - pointOnPlane, planeNormal ) );
}
vec3 linePlaneIntersect( in vec3 pointOnLine, in vec3 lineDirection, in vec3 pointOnPlane, in vec3 planeNormal ) {
	return lineDirection * ( dot( planeNormal, pointOnPlane - pointOnLine ) / dot( planeNormal, lineDirection ) ) + pointOnLine;
}

#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
	#endif
	uniform float logDepthBufFC;
#endif
#if NUM_CLIPPING_PLANES > 0 && ! defined( PHYSICAL ) && ! defined( PHONG )
	varying vec3 vViewPosition;
#endif

void main() {
	vWorldPosition = transformDirection( position, modelMatrix );
	
vec3 transformed = vec3( position );

	#ifdef USE_SKINNING
	vec4 mvPosition = modelViewMatrix * skinned;
#else
	vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 );
#endif
gl_Position = projectionMatrix * mvPosition;

	#ifdef USE_LOGDEPTHBUF
	gl_Position.z = log2(max( EPSILON, gl_Position.w + 1.0 )) * logDepthBufFC;
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
	#else
		gl_Position.z = (gl_Position.z - 1.0) * gl_Position.w;
	#endif
#endif

	#if NUM_CLIPPING_PLANES > 0 && ! defined( PHYSICAL ) && ! defined( PHONG )
	vViewPosition = - mvPosition.xyz;
#endif

}`.replace("\n"," ").replace(/\s+/g, ''))
{
  // console.log("iiiiiiii");
  return `precision highp float;
  uniform mat4 modelMatrix;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform mat4 viewMatrix;
  attribute vec3 position;
  
  varying vec3 vWorldPosition;

  vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
    return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
  }
  
  void main() {
    vWorldPosition = transformDirection( position, modelMatrix );
    
  vec3 transformed = vec3( position );
  
  vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 );
  gl_Position = projectionMatrix * mvPosition;

  
  }`;
}

if (shaderSource.replace("\n"," ").replace(/\s+/g, '') == `precision highp float;
precision highp int;
#define SHADER_NAME ShaderMaterial
#define VERTEX_TEXTURES
#define GAMMA_FACTOR 2
#define MAX_BONES 251
#define NUM_CLIPPING_PLANES 0
uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat3 normalMatrix;
uniform vec3 cameraPosition;
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
#ifdef USE_COLOR
	attribute vec3 color;
#endif
#ifdef USE_MORPHTARGETS
	attribute vec3 morphTarget0;
	attribute vec3 morphTarget1;
	attribute vec3 morphTarget2;
	attribute vec3 morphTarget3;
	#ifdef USE_MORPHNORMALS
		attribute vec3 morphNormal0;
		attribute vec3 morphNormal1;
		attribute vec3 morphNormal2;
		attribute vec3 morphNormal3;
	#else
		attribute vec3 morphTarget4;
		attribute vec3 morphTarget5;
		attribute vec3 morphTarget6;
		attribute vec3 morphTarget7;
	#endif
#endif
#ifdef USE_SKINNING
	attribute vec4 skinIndex;
	attribute vec4 skinWeight;
#endif

uniform float mRefractionRatio;
uniform float mFresnelBias;
uniform float mFresnelScale;
uniform float mFresnelPower;
varying vec3 vReflect;
varying vec3 vRefract[3];
varying float vReflectionFactor;
void main() {
vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );
vec3 I = worldPosition.xyz - cameraPosition;
vReflect = reflect( I, worldNormal );
vRefract[0] = refract( normalize( I ), worldNormal, mRefractionRatio );
vRefract[1] = refract( normalize( I ), worldNormal, mRefractionRatio * 0.99 );
vRefract[2] = refract( normalize( I ), worldNormal, mRefractionRatio * 0.98 );
vReflectionFactor = mFresnelBias + mFresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), mFresnelPower );
gl_Position = projectionMatrix * mvPosition;
}`.replace("\n"," ").replace(/\s+/g, ''))
{
  // console.log("iiiiiiii");
  return `precision highp float;
  uniform mat4 modelMatrix;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform vec3 cameraPosition;
  attribute vec3 position;
  attribute vec3 normal;
  
  uniform float mFresnelBias;
  uniform float mFresnelScale;
  uniform float mFresnelPower;
  varying vec3 vReflect;
  varying float vReflectionFactor;
  void main() {
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
  vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );
  vec3 I = worldPosition.xyz - cameraPosition;
  vReflect = reflect( I, worldNormal );
  vReflectionFactor = mFresnelBias + mFresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), mFresnelPower );
  gl_Position = projectionMatrix * mvPosition;
  }`;
}

// @@@@@@@@@@@@@@@@@@flipping

if (shaderSource.replace("\n"," ").replace(/\s+/g, '') == `precision highp float;
precision highp int;
#define SHADER_NAME MeshDepthMaterial
#define VERTEX_TEXTURES
#define GAMMA_FACTOR 2
#define MAX_BONES 251
#define DOUBLE_SIDED
#define NUM_CLIPPING_PLANES 4
uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat3 normalMatrix;
uniform vec3 cameraPosition;
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
#ifdef USE_COLOR
	attribute vec3 color;
#endif
#ifdef USE_MORPHTARGETS
	attribute vec3 morphTarget0;
	attribute vec3 morphTarget1;
	attribute vec3 morphTarget2;
	attribute vec3 morphTarget3;
	#ifdef USE_MORPHNORMALS
		attribute vec3 morphNormal0;
		attribute vec3 morphNormal1;
		attribute vec3 morphNormal2;
		attribute vec3 morphNormal3;
	#else
		attribute vec3 morphTarget4;
		attribute vec3 morphTarget5;
		attribute vec3 morphTarget6;
		attribute vec3 morphTarget7;
	#endif
#endif
#ifdef USE_SKINNING
	attribute vec4 skinIndex;
	attribute vec4 skinWeight;
#endif

#define PI 3.14159265359
#define PI2 6.28318530718
#define RECIPROCAL_PI 0.31830988618
#define RECIPROCAL_PI2 0.15915494
#define LOG2 1.442695
#define EPSILON 1e-6
#define saturate(a) clamp( a, 0.0, 1.0 )
#define whiteCompliment(a) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float average( const in vec3 color ) { return dot( color, vec3( 0.3333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract(sin(sn) * c);
}
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
struct GeometricContext {
	vec3 position;
	vec3 normal;
	vec3 viewDir;
};
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
vec3 projectOnPlane(in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {
	float distance = dot( planeNormal, point - pointOnPlane );
	return - distance * planeNormal + point;
}
float sideOfPlane( in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {
	return sign( dot( point - pointOnPlane, planeNormal ) );
}
vec3 linePlaneIntersect( in vec3 pointOnLine, in vec3 lineDirection, in vec3 pointOnPlane, in vec3 planeNormal ) {
	return lineDirection * ( dot( planeNormal, pointOnPlane - pointOnLine ) / dot( planeNormal, lineDirection ) ) + pointOnLine;
}

#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP ) || defined( USE_ROUGHNESSMAP ) || defined( USE_METALNESSMAP )
	varying vec2 vUv;
	uniform vec4 offsetRepeat;
#endif

#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif

#ifdef USE_MORPHTARGETS
	#ifndef USE_MORPHNORMALS
	uniform float morphTargetInfluences[ 8 ];
	#else
	uniform float morphTargetInfluences[ 4 ];
	#endif
#endif
#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	#ifdef BONE_TEXTURE
		uniform sampler2D boneTexture;
		uniform int boneTextureWidth;
		uniform int boneTextureHeight;
		mat4 getBoneMatrix( const in float i ) {
			float j = i * 4.0;
			float x = mod( j, float( boneTextureWidth ) );
			float y = floor( j / float( boneTextureWidth ) );
			float dx = 1.0 / float( boneTextureWidth );
			float dy = 1.0 / float( boneTextureHeight );
			y = dy * ( y + 0.5 );
			vec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );
			vec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );
			vec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );
			vec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );
			mat4 bone = mat4( v1, v2, v3, v4 );
			return bone;
		}
	#else
		uniform mat4 boneMatrices[ MAX_BONES ];
		mat4 getBoneMatrix( const in float i ) {
			mat4 bone = boneMatrices[ int(i) ];
			return bone;
		}
	#endif
#endif

#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
	#endif
	uniform float logDepthBufFC;
#endif
#if NUM_CLIPPING_PLANES > 0 && ! defined( PHYSICAL ) && ! defined( PHONG )
	varying vec3 vViewPosition;
#endif

void main() {
	#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP ) || defined( USE_ROUGHNESSMAP ) || defined( USE_METALNESSMAP )
	vUv = uv * offsetRepeat.zw + offsetRepeat.xy;
#endif
	#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif
	
vec3 transformed = vec3( position );

	#ifdef USE_DISPLACEMENTMAP
	transformed += normal * ( texture2D( displacementMap, uv ).x * displacementScale + displacementBias );
#endif

	#ifdef USE_MORPHTARGETS
	transformed += ( morphTarget0 - position ) * morphTargetInfluences[ 0 ];
	transformed += ( morphTarget1 - position ) * morphTargetInfluences[ 1 ];
	transformed += ( morphTarget2 - position ) * morphTargetInfluences[ 2 ];
	transformed += ( morphTarget3 - position ) * morphTargetInfluences[ 3 ];
	#ifndef USE_MORPHNORMALS
	transformed += ( morphTarget4 - position ) * morphTargetInfluences[ 4 ];
	transformed += ( morphTarget5 - position ) * morphTargetInfluences[ 5 ];
	transformed += ( morphTarget6 - position ) * morphTargetInfluences[ 6 ];
	transformed += ( morphTarget7 - position ) * morphTargetInfluences[ 7 ];
	#endif
#endif

	#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	skinned  = bindMatrixInverse * skinned;
#endif

	#ifdef USE_SKINNING
	vec4 mvPosition = modelViewMatrix * skinned;
#else
	vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 );
#endif
gl_Position = projectionMatrix * mvPosition;

	#ifdef USE_LOGDEPTHBUF
	gl_Position.z = log2(max( EPSILON, gl_Position.w + 1.0 )) * logDepthBufFC;
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
	#else
		gl_Position.z = (gl_Position.z - 1.0) * gl_Position.w;
	#endif
#endif

	#if NUM_CLIPPING_PLANES > 0 && ! defined( PHYSICAL ) && ! defined( PHONG )
	vViewPosition = - mvPosition.xyz;
#endif

}`.replace("\n"," ").replace(/\s+/g, ''))
{
  // console.log("iiiiiiii");
  return ``;
}

if (shaderSource.replace("\n"," ").replace(/\s+/g, '') == `precision highp float;
precision highp int;
#define SHADER_NAME MeshDepthMaterial
#define GAMMA_FACTOR 2
#define DOUBLE_SIDED
#define NUM_CLIPPING_PLANES 4
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
#define TONE_MAPPING
#define saturate(a) clamp( a, 0.0, 1.0 )
uniform float toneMappingExposure;
uniform float toneMappingWhitePoint;
vec3 LinearToneMapping( vec3 color ) {
  return toneMappingExposure * color;
}
vec3 ReinhardToneMapping( vec3 color ) {
  color *= toneMappingExposure;
  return saturate( color / ( vec3( 1.0 ) + color ) );
}
#define Uncharted2Helper( x ) max( ( ( x * ( 0.15 * x + 0.10 * 0.50 ) + 0.20 * 0.02 ) / ( x * ( 0.15 * x + 0.50 ) + 0.20 * 0.30 ) ) - 0.02 / 0.30, vec3( 0.0 ) )
vec3 Uncharted2ToneMapping( vec3 color ) {
  color *= toneMappingExposure;
  return saturate( Uncharted2Helper( color ) / Uncharted2Helper( vec3( toneMappingWhitePoint ) ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
  color *= toneMappingExposure;
  color = max( vec3( 0.0 ), color - 0.004 );
  return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}

vec3 toneMapping( vec3 color ) { return LinearToneMapping( color ); }

vec4 LinearToLinear( in vec4 value ) {
  return value;
}
vec4 GammaToLinear( in vec4 value, in float gammaFactor ) {
  return vec4( pow( value.xyz, vec3( gammaFactor ) ), value.w );
}
vec4 LinearToGamma( in vec4 value, in float gammaFactor ) {
  return vec4( pow( value.xyz, vec3( 1.0 / gammaFactor ) ), value.w );
}
vec4 sRGBToLinear( in vec4 value ) {
  return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.w );
}
vec4 LinearTosRGB( in vec4 value ) {
  return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.w );
}
vec4 RGBEToLinear( in vec4 value ) {
  return vec4( value.rgb * exp2( value.a * 255.0 - 128.0 ), 1.0 );
}
vec4 LinearToRGBE( in vec4 value ) {
  float maxComponent = max( max( value.r, value.g ), value.b );
  float fExp = clamp( ceil( log2( maxComponent ) ), -128.0, 127.0 );
  return vec4( value.rgb / exp2( fExp ), ( fExp + 128.0 ) / 255.0 );
}
vec4 RGBMToLinear( in vec4 value, in float maxRange ) {
  return vec4( value.xyz * value.w * maxRange, 1.0 );
}
vec4 LinearToRGBM( in vec4 value, in float maxRange ) {
  float maxRGB = max( value.x, max( value.g, value.b ) );
  float M      = clamp( maxRGB / maxRange, 0.0, 1.0 );
  M            = ceil( M * 255.0 ) / 255.0;
  return vec4( value.rgb / ( M * maxRange ), M );
}
vec4 RGBDToLinear( in vec4 value, in float maxRange ) {
    return vec4( value.rgb * ( ( maxRange / 255.0 ) / value.a ), 1.0 );
}
vec4 LinearToRGBD( in vec4 value, in float maxRange ) {
    float maxRGB = max( value.x, max( value.g, value.b ) );
    float D      = max( maxRange / maxRGB, 1.0 );
    D            = min( floor( D ) / 255.0, 1.0 );
    return vec4( value.rgb * ( D * ( 255.0 / maxRange ) ), D );
}
const mat3 cLogLuvM = mat3( 0.2209, 0.3390, 0.4184, 0.1138, 0.6780, 0.7319, 0.0102, 0.1130, 0.2969 );
vec4 LinearToLogLuv( in vec4 value )  {
  vec3 Xp_Y_XYZp = value.rgb * cLogLuvM;
  Xp_Y_XYZp = max(Xp_Y_XYZp, vec3(1e-6, 1e-6, 1e-6));
  vec4 vResult;
  vResult.xy = Xp_Y_XYZp.xy / Xp_Y_XYZp.z;
  float Le = 2.0 * log2(Xp_Y_XYZp.y) + 127.0;
  vResult.w = fract(Le);
  vResult.z = (Le - (floor(vResult.w*255.0))/255.0)/255.0;
  return vResult;
}
const mat3 cLogLuvInverseM = mat3( 6.0014, -2.7008, -1.7996, -1.3320, 3.1029, -5.7721, 0.3008, -1.0882, 5.6268 );
vec4 LogLuvToLinear( in vec4 value ) {
  float Le = value.z * 255.0 + value.w;
  vec3 Xp_Y_XYZp;
  Xp_Y_XYZp.y = exp2((Le - 127.0) / 2.0);
  Xp_Y_XYZp.z = Xp_Y_XYZp.y / value.y;
  Xp_Y_XYZp.x = value.x * Xp_Y_XYZp.z;
  vec3 vRGB = Xp_Y_XYZp.rgb * cLogLuvInverseM;
  return vec4( max(vRGB, 0.0), 1.0 );
}

vec4 mapTexelToLinear( vec4 value ) { return LinearToLinear( value ); }
vec4 envMapTexelToLinear( vec4 value ) { return LinearToLinear( value ); }
vec4 emissiveMapTexelToLinear( vec4 value ) { return LinearToLinear( value ); }
vec4 linearToOutputTexel( vec4 value ) { return LinearToLinear( value ); }
#define DEPTH_PACKING 3201

#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#define PI 3.14159265359
#define PI2 6.28318530718
#define RECIPROCAL_PI 0.31830988618
#define RECIPROCAL_PI2 0.15915494
#define LOG2 1.442695
#define EPSILON 1e-6
#define saturate(a) clamp( a, 0.0, 1.0 )
#define whiteCompliment(a) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float average( const in vec3 color ) { return dot( color, vec3( 0.3333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract(sin(sn) * c);
}
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
struct GeometricContext {
	vec3 position;
	vec3 normal;
	vec3 viewDir;
};
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
vec3 projectOnPlane(in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {
	float distance = dot( planeNormal, point - pointOnPlane );
	return - distance * planeNormal + point;
}
float sideOfPlane( in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {
	return sign( dot( point - pointOnPlane, planeNormal ) );
}
vec3 linePlaneIntersect( in vec3 pointOnLine, in vec3 lineDirection, in vec3 pointOnPlane, in vec3 planeNormal ) {
	return lineDirection * ( dot( planeNormal, pointOnPlane - pointOnLine ) / dot( planeNormal, lineDirection ) ) + pointOnLine;
}

vec3 packNormalToRGB( const in vec3 normal ) {
  return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
  return 1.0 - 2.0 * rgb.xyz;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256.,  256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
  return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float linearClipZ, const in float near, const in float far ) {
  return linearClipZ * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
  return (( near + viewZ ) * far ) / (( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float invClipZ, const in float near, const in float far ) {
  return ( near * far ) / ( ( far - near ) * invClipZ - far );
}

#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP ) || defined( USE_ROUGHNESSMAP ) || defined( USE_METALNESSMAP )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif

#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif

#ifdef USE_LOGDEPTHBUF
	uniform float logDepthBufFC;
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
	#endif
#endif

#if NUM_CLIPPING_PLANES > 0
	#if ! defined( PHYSICAL ) && ! defined( PHONG )
		varying vec3 vViewPosition;
	#endif
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif

void main() {
	#if NUM_CLIPPING_PLANES > 0
	for ( int i = 0; i < NUM_CLIPPING_PLANES; ++ i ) {
		vec4 plane = clippingPlanes[ i ];
		if ( dot( vViewPosition, plane.xyz ) > plane.w ) discard;
	}
#endif

	vec4 diffuseColor = vec4( 1.0 );
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#ifdef USE_MAP
	vec4 texelColor = texture2D( map, vUv );
	texelColor = mapTexelToLinear( texelColor );
	diffuseColor *= texelColor;
#endif

	#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vUv ).g;
#endif

	#ifdef ALPHATEST
	if ( diffuseColor.a < ALPHATEST ) discard;
#endif

	#if defined(USE_LOGDEPTHBUF) && defined(USE_LOGDEPTHBUF_EXT)
	gl_FragDepthEXT = log2(vFragDepth) * logDepthBufFC * 0.5;
#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( gl_FragCoord.z ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( gl_FragCoord.z );
	#endif
}`.replace("\n"," ").replace(/\s+/g, ''))
{
  // console.log("iiiiiiii");
  return ``;
}

if (shaderSource.replace("\n"," ").replace(/\s+/g, '') == `precision highp float;
precision highp int;
#define SHADER_NAME MeshPhongMaterial
#define VERTEX_TEXTURES
#define GAMMA_FACTOR 2
#define MAX_BONES 251
#define DOUBLE_SIDED
#define NUM_CLIPPING_PLANES 9
uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat3 normalMatrix;
uniform vec3 cameraPosition;
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
#ifdef USE_COLOR
	attribute vec3 color;
#endif
#ifdef USE_MORPHTARGETS
	attribute vec3 morphTarget0;
	attribute vec3 morphTarget1;
	attribute vec3 morphTarget2;
	attribute vec3 morphTarget3;
	#ifdef USE_MORPHNORMALS
		attribute vec3 morphNormal0;
		attribute vec3 morphNormal1;
		attribute vec3 morphNormal2;
		attribute vec3 morphNormal3;
	#else
		attribute vec3 morphTarget4;
		attribute vec3 morphTarget5;
		attribute vec3 morphTarget6;
		attribute vec3 morphTarget7;
	#endif
#endif
#ifdef USE_SKINNING
	attribute vec4 skinIndex;
	attribute vec4 skinWeight;
#endif

#define PHONG
varying vec3 vViewPosition;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#define PI 3.14159265359
#define PI2 6.28318530718
#define RECIPROCAL_PI 0.31830988618
#define RECIPROCAL_PI2 0.15915494
#define LOG2 1.442695
#define EPSILON 1e-6
#define saturate(a) clamp( a, 0.0, 1.0 )
#define whiteCompliment(a) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float average( const in vec3 color ) { return dot( color, vec3( 0.3333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract(sin(sn) * c);
}
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
struct GeometricContext {
	vec3 position;
	vec3 normal;
	vec3 viewDir;
};
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
vec3 projectOnPlane(in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {
	float distance = dot( planeNormal, point - pointOnPlane );
	return - distance * planeNormal + point;
}
float sideOfPlane( in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {
	return sign( dot( point - pointOnPlane, planeNormal ) );
}
vec3 linePlaneIntersect( in vec3 pointOnLine, in vec3 lineDirection, in vec3 pointOnPlane, in vec3 planeNormal ) {
	return lineDirection * ( dot( planeNormal, pointOnPlane - pointOnLine ) / dot( planeNormal, lineDirection ) ) + pointOnLine;
}

#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP ) || defined( USE_ROUGHNESSMAP ) || defined( USE_METALNESSMAP )
	varying vec2 vUv;
	uniform vec4 offsetRepeat;
#endif

#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
	attribute vec2 uv2;
	varying vec2 vUv2;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif

#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG )
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif

#ifdef USE_COLOR
	varying vec3 vColor;
#endif
#ifdef USE_MORPHTARGETS
	#ifndef USE_MORPHNORMALS
	uniform float morphTargetInfluences[ 8 ];
	#else
	uniform float morphTargetInfluences[ 4 ];
	#endif
#endif
#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	#ifdef BONE_TEXTURE
		uniform sampler2D boneTexture;
		uniform int boneTextureWidth;
		uniform int boneTextureHeight;
		mat4 getBoneMatrix( const in float i ) {
			float j = i * 4.0;
			float x = mod( j, float( boneTextureWidth ) );
			float y = floor( j / float( boneTextureWidth ) );
			float dx = 1.0 / float( boneTextureWidth );
			float dy = 1.0 / float( boneTextureHeight );
			y = dy * ( y + 0.5 );
			vec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );
			vec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );
			vec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );
			vec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );
			mat4 bone = mat4( v1, v2, v3, v4 );
			return bone;
		}
	#else
		uniform mat4 boneMatrices[ MAX_BONES ];
		mat4 getBoneMatrix( const in float i ) {
			mat4 bone = boneMatrices[ int(i) ];
			return bone;
		}
	#endif
#endif

#ifdef USE_SHADOWMAP
	#if 1 > 0
		uniform mat4 directionalShadowMatrix[ 1 ];
		varying vec4 vDirectionalShadowCoord[ 1 ];
	#endif
	#if 1 > 0
		uniform mat4 spotShadowMatrix[ 1 ];
		varying vec4 vSpotShadowCoord[ 1 ];
	#endif
	#if 0 > 0
		uniform mat4 pointShadowMatrix[ 0 ];
		varying vec4 vPointShadowCoord[ 0 ];
	#endif
#endif

#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
	#endif
	uniform float logDepthBufFC;
#endif
#if NUM_CLIPPING_PLANES > 0 && ! defined( PHYSICAL ) && ! defined( PHONG )
	varying vec3 vViewPosition;
#endif

void main() {
	#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP ) || defined( USE_ROUGHNESSMAP ) || defined( USE_METALNESSMAP )
	vUv = uv * offsetRepeat.zw + offsetRepeat.xy;
#endif
	#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
	vUv2 = uv2;
#endif
	#ifdef USE_COLOR
	vColor.xyz = color.xyz;
#endif
	
vec3 objectNormal = vec3( normal );

	#ifdef USE_MORPHNORMALS
	objectNormal += ( morphNormal0 - normal ) * morphTargetInfluences[ 0 ];
	objectNormal += ( morphNormal1 - normal ) * morphTargetInfluences[ 1 ];
	objectNormal += ( morphNormal2 - normal ) * morphTargetInfluences[ 2 ];
	objectNormal += ( morphNormal3 - normal ) * morphTargetInfluences[ 3 ];
#endif

	#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif
	#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix  = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
#endif

	#ifdef FLIP_SIDED
	objectNormal = -objectNormal;
#endif
vec3 transformedNormal = normalMatrix * objectNormal;

#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
#endif
	
vec3 transformed = vec3( position );

	#ifdef USE_DISPLACEMENTMAP
	transformed += normal * ( texture2D( displacementMap, uv ).x * displacementScale + displacementBias );
#endif

	#ifdef USE_MORPHTARGETS
	transformed += ( morphTarget0 - position ) * morphTargetInfluences[ 0 ];
	transformed += ( morphTarget1 - position ) * morphTargetInfluences[ 1 ];
	transformed += ( morphTarget2 - position ) * morphTargetInfluences[ 2 ];
	transformed += ( morphTarget3 - position ) * morphTargetInfluences[ 3 ];
	#ifndef USE_MORPHNORMALS
	transformed += ( morphTarget4 - position ) * morphTargetInfluences[ 4 ];
	transformed += ( morphTarget5 - position ) * morphTargetInfluences[ 5 ];
	transformed += ( morphTarget6 - position ) * morphTargetInfluences[ 6 ];
	transformed += ( morphTarget7 - position ) * morphTargetInfluences[ 7 ];
	#endif
#endif

	#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	skinned  = bindMatrixInverse * skinned;
#endif

	#ifdef USE_SKINNING
	vec4 mvPosition = modelViewMatrix * skinned;
#else
	vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 );
#endif
gl_Position = projectionMatrix * mvPosition;

	#ifdef USE_LOGDEPTHBUF
	gl_Position.z = log2(max( EPSILON, gl_Position.w + 1.0 )) * logDepthBufFC;
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
	#else
		gl_Position.z = (gl_Position.z - 1.0) * gl_Position.w;
	#endif
#endif

	#if NUM_CLIPPING_PLANES > 0 && ! defined( PHYSICAL ) && ! defined( PHONG )
	vViewPosition = - mvPosition.xyz;
#endif

	vViewPosition = - mvPosition.xyz;
	#if defined( USE_ENVMAP ) || defined( PHONG ) || defined( PHYSICAL ) || defined( LAMBERT ) || defined ( USE_SHADOWMAP )
	#ifdef USE_SKINNING
		vec4 worldPosition = modelMatrix * skinned;
	#else
		vec4 worldPosition = modelMatrix * vec4( transformed, 1.0 );
	#endif
#endif

	#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG )
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif

	#ifdef USE_SHADOWMAP
	#if 1 > 0
	
		vDirectionalShadowCoord[ 0 ] = directionalShadowMatrix[ 0 ] * worldPosition;
	
	#endif
	#if 1 > 0
	
		vSpotShadowCoord[ 0 ] = spotShadowMatrix[ 0 ] * worldPosition;
	
	#endif
	#if 0 > 0
	
	#endif
#endif

}`.replace("\n"," ").replace(/\s+/g, ''))
{
  // console.log("iiiiiiii");
  return `precision highp float;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform mat3 normalMatrix;
  attribute vec3 position;
  attribute vec3 normal;
  varying vec3 vViewPosition;
    varying vec3 vNormal;
  
  void main() {
    
  vec3 objectNormal = vec3( normal );

  vec3 transformedNormal = normalMatrix * objectNormal;
  
    vNormal = normalize( transformedNormal );
    
  vec3 transformed = vec3( position );
  
    vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 );
  gl_Position = projectionMatrix * mvPosition;
  
  
    vViewPosition = - mvPosition.xyz;
  
  }`;
}

if (shaderSource.replace("\n"," ").replace(/\s+/g, '') == `precision highp float;
precision highp int;
#define SHADER_NAME MeshPhongMaterial
#define GAMMA_FACTOR 2
#define DOUBLE_SIDED
#define NUM_CLIPPING_PLANES 9
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
#define TONE_MAPPING
#define saturate(a) clamp( a, 0.0, 1.0 )
uniform float toneMappingExposure;
uniform float toneMappingWhitePoint;
vec3 LinearToneMapping( vec3 color ) {
  return toneMappingExposure * color;
}
vec3 ReinhardToneMapping( vec3 color ) {
  color *= toneMappingExposure;
  return saturate( color / ( vec3( 1.0 ) + color ) );
}
#define Uncharted2Helper( x ) max( ( ( x * ( 0.15 * x + 0.10 * 0.50 ) + 0.20 * 0.02 ) / ( x * ( 0.15 * x + 0.50 ) + 0.20 * 0.30 ) ) - 0.02 / 0.30, vec3( 0.0 ) )
vec3 Uncharted2ToneMapping( vec3 color ) {
  color *= toneMappingExposure;
  return saturate( Uncharted2Helper( color ) / Uncharted2Helper( vec3( toneMappingWhitePoint ) ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
  color *= toneMappingExposure;
  color = max( vec3( 0.0 ), color - 0.004 );
  return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}

vec3 toneMapping( vec3 color ) { return LinearToneMapping( color ); }

vec4 LinearToLinear( in vec4 value ) {
  return value;
}
vec4 GammaToLinear( in vec4 value, in float gammaFactor ) {
  return vec4( pow( value.xyz, vec3( gammaFactor ) ), value.w );
}
vec4 LinearToGamma( in vec4 value, in float gammaFactor ) {
  return vec4( pow( value.xyz, vec3( 1.0 / gammaFactor ) ), value.w );
}
vec4 sRGBToLinear( in vec4 value ) {
  return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.w );
}
vec4 LinearTosRGB( in vec4 value ) {
  return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.w );
}
vec4 RGBEToLinear( in vec4 value ) {
  return vec4( value.rgb * exp2( value.a * 255.0 - 128.0 ), 1.0 );
}
vec4 LinearToRGBE( in vec4 value ) {
  float maxComponent = max( max( value.r, value.g ), value.b );
  float fExp = clamp( ceil( log2( maxComponent ) ), -128.0, 127.0 );
  return vec4( value.rgb / exp2( fExp ), ( fExp + 128.0 ) / 255.0 );
}
vec4 RGBMToLinear( in vec4 value, in float maxRange ) {
  return vec4( value.xyz * value.w * maxRange, 1.0 );
}
vec4 LinearToRGBM( in vec4 value, in float maxRange ) {
  float maxRGB = max( value.x, max( value.g, value.b ) );
  float M      = clamp( maxRGB / maxRange, 0.0, 1.0 );
  M            = ceil( M * 255.0 ) / 255.0;
  return vec4( value.rgb / ( M * maxRange ), M );
}
vec4 RGBDToLinear( in vec4 value, in float maxRange ) {
    return vec4( value.rgb * ( ( maxRange / 255.0 ) / value.a ), 1.0 );
}
vec4 LinearToRGBD( in vec4 value, in float maxRange ) {
    float maxRGB = max( value.x, max( value.g, value.b ) );
    float D      = max( maxRange / maxRGB, 1.0 );
    D            = min( floor( D ) / 255.0, 1.0 );
    return vec4( value.rgb * ( D * ( 255.0 / maxRange ) ), D );
}
const mat3 cLogLuvM = mat3( 0.2209, 0.3390, 0.4184, 0.1138, 0.6780, 0.7319, 0.0102, 0.1130, 0.2969 );
vec4 LinearToLogLuv( in vec4 value )  {
  vec3 Xp_Y_XYZp = value.rgb * cLogLuvM;
  Xp_Y_XYZp = max(Xp_Y_XYZp, vec3(1e-6, 1e-6, 1e-6));
  vec4 vResult;
  vResult.xy = Xp_Y_XYZp.xy / Xp_Y_XYZp.z;
  float Le = 2.0 * log2(Xp_Y_XYZp.y) + 127.0;
  vResult.w = fract(Le);
  vResult.z = (Le - (floor(vResult.w*255.0))/255.0)/255.0;
  return vResult;
}
const mat3 cLogLuvInverseM = mat3( 6.0014, -2.7008, -1.7996, -1.3320, 3.1029, -5.7721, 0.3008, -1.0882, 5.6268 );
vec4 LogLuvToLinear( in vec4 value ) {
  float Le = value.z * 255.0 + value.w;
  vec3 Xp_Y_XYZp;
  Xp_Y_XYZp.y = exp2((Le - 127.0) / 2.0);
  Xp_Y_XYZp.z = Xp_Y_XYZp.y / value.y;
  Xp_Y_XYZp.x = value.x * Xp_Y_XYZp.z;
  vec3 vRGB = Xp_Y_XYZp.rgb * cLogLuvInverseM;
  return vec4( max(vRGB, 0.0), 1.0 );
}

vec4 mapTexelToLinear( vec4 value ) { return LinearToLinear( value ); }
vec4 envMapTexelToLinear( vec4 value ) { return LinearToLinear( value ); }
vec4 emissiveMapTexelToLinear( vec4 value ) { return LinearToLinear( value ); }
vec4 linearToOutputTexel( vec4 value ) { return LinearToLinear( value ); }

#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#define PI 3.14159265359
#define PI2 6.28318530718
#define RECIPROCAL_PI 0.31830988618
#define RECIPROCAL_PI2 0.15915494
#define LOG2 1.442695
#define EPSILON 1e-6
#define saturate(a) clamp( a, 0.0, 1.0 )
#define whiteCompliment(a) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float average( const in vec3 color ) { return dot( color, vec3( 0.3333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract(sin(sn) * c);
}
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
struct GeometricContext {
	vec3 position;
	vec3 normal;
	vec3 viewDir;
};
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
vec3 projectOnPlane(in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {
	float distance = dot( planeNormal, point - pointOnPlane );
	return - distance * planeNormal + point;
}
float sideOfPlane( in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {
	return sign( dot( point - pointOnPlane, planeNormal ) );
}
vec3 linePlaneIntersect( in vec3 pointOnLine, in vec3 lineDirection, in vec3 pointOnPlane, in vec3 planeNormal ) {
	return lineDirection * ( dot( planeNormal, pointOnPlane - pointOnLine ) / dot( planeNormal, lineDirection ) ) + pointOnLine;
}

vec3 packNormalToRGB( const in vec3 normal ) {
  return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
  return 1.0 - 2.0 * rgb.xyz;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256.,  256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
  return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float linearClipZ, const in float near, const in float far ) {
  return linearClipZ * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
  return (( near + viewZ ) * far ) / (( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float invClipZ, const in float near, const in float far ) {
  return ( near * far ) / ( ( far - near ) * invClipZ - far );
}

#ifdef USE_COLOR
	varying vec3 vColor;
#endif

#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP ) || defined( USE_ROUGHNESSMAP ) || defined( USE_METALNESSMAP )
	varying vec2 vUv;
#endif
#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
	varying vec2 vUv2;
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif

#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif

#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif
#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif
#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif

#if defined( USE_ENVMAP ) || defined( PHYSICAL )
	uniform float reflectivity;
	uniform float envMapIntenstiy;
#endif
#ifdef USE_ENVMAP
	#if ! defined( PHYSICAL ) && ( defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) )
		varying vec3 vWorldPosition;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	uniform float flipEnvMap;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( PHYSICAL )
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif

#ifdef USE_FOG
	uniform vec3 fogColor;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif
bool testLightInRange( const in float lightDistance, const in float cutoffDistance ) {
	return any( bvec2( cutoffDistance == 0.0, lightDistance < cutoffDistance ) );
}
float punctualLightIntensityToIrradianceFactor( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
		if( decayExponent > 0.0 ) {
#if defined ( PHYSICALLY_CORRECT_LIGHTS )
			float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
			float maxDistanceCutoffFactor = pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
			return distanceFalloff * maxDistanceCutoffFactor;
#else
			return pow( saturate( -lightDistance / cutoffDistance + 1.0 ), decayExponent );
#endif
		}
		return 1.0;
}
vec3 BRDF_Diffuse_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 specularColor, const in float dotLH ) {
	float fresnel = exp2( ( -5.55473 * dotLH - 6.98316 ) * dotLH );
	return ( 1.0 - specularColor ) * fresnel + specularColor;
}
float G_GGX_Smith( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gl = dotNL + sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	float gv = dotNV + sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	return 1.0 / ( gl * gv );
}
float G_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
vec3 BRDF_Specular_GGX( const in IncidentLight incidentLight, const in GeometricContext geometry, const in vec3 specularColor, const in float roughness ) {
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( incidentLight.direction + geometry.viewDir );
	float dotNL = saturate( dot( geometry.normal, incidentLight.direction ) );
	float dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );
	float dotNH = saturate( dot( geometry.normal, halfDir ) );
	float dotLH = saturate( dot( incidentLight.direction, halfDir ) );
	vec3 F = F_Schlick( specularColor, dotLH );
	float G = G_GGX_SmithCorrelated( alpha, dotNL, dotNV );
	float D = D_GGX( alpha, dotNH );
	return F * ( G * D );
}
vec3 BRDF_Specular_GGX_Environment( const in GeometricContext geometry, const in vec3 specularColor, const in float roughness ) {
	float dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 AB = vec2( -1.04, 1.04 ) * a004 + r.zw;
	return specularColor * AB.x + AB.y;
}
float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_Specular_BlinnPhong( const in IncidentLight incidentLight, const in GeometricContext geometry, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( incidentLight.direction + geometry.viewDir );
	float dotNH = saturate( dot( geometry.normal, halfDir ) );
	float dotLH = saturate( dot( incidentLight.direction, halfDir ) );
	vec3 F = F_Schlick( specularColor, dotLH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
}
float GGXRoughnessToBlinnExponent( const in float ggxRoughness ) {
	return ( 2.0 / pow2( ggxRoughness + 0.0001 ) - 2.0 );
}
float BlinnExponentToGGXRoughness( const in float blinnExponent ) {
	return sqrt( 2.0 / ( blinnExponent + 2.0 ) );
}

uniform vec3 ambientLightColor;
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	#ifndef PHYSICALLY_CORRECT_LIGHTS
		irradiance *= PI;
	#endif
	return irradiance;
}
#if 1 > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
		int shadow;
		float shadowBias;
		float shadowRadius;
		vec2 shadowMapSize;
	};
	uniform DirectionalLight directionalLights[ 1 ];
	void getDirectionalDirectLightIrradiance( const in DirectionalLight directionalLight, const in GeometricContext geometry, out IncidentLight directLight ) {
		directLight.color = directionalLight.color;
		directLight.direction = directionalLight.direction;
		directLight.visible = true;
	}
#endif
#if 0 > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
		int shadow;
		float shadowBias;
		float shadowRadius;
		vec2 shadowMapSize;
	};
	uniform PointLight pointLights[ 0 ];
	void getPointDirectLightIrradiance( const in PointLight pointLight, const in GeometricContext geometry, out IncidentLight directLight ) {
		vec3 lVector = pointLight.position - geometry.position;
		directLight.direction = normalize( lVector );
		float lightDistance = length( lVector );
		if ( testLightInRange( lightDistance, pointLight.distance ) ) {
			directLight.color = pointLight.color;
			directLight.color *= punctualLightIntensityToIrradianceFactor( lightDistance, pointLight.distance, pointLight.decay );
			directLight.visible = true;
		} else {
			directLight.color = vec3( 0.0 );
			directLight.visible = false;
		}
	}
#endif
#if 1 > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
		int shadow;
		float shadowBias;
		float shadowRadius;
		vec2 shadowMapSize;
	};
	uniform SpotLight spotLights[ 1 ];
	void getSpotDirectLightIrradiance( const in SpotLight spotLight, const in GeometricContext geometry, out IncidentLight directLight  ) {
		vec3 lVector = spotLight.position - geometry.position;
		directLight.direction = normalize( lVector );
		float lightDistance = length( lVector );
		float angleCos = dot( directLight.direction, spotLight.direction );
		if ( all( bvec2( angleCos > spotLight.coneCos, testLightInRange( lightDistance, spotLight.distance ) ) ) ) {
			float spotEffect = smoothstep( spotLight.coneCos, spotLight.penumbraCos, angleCos );
			directLight.color = spotLight.color;
			directLight.color *= spotEffect * punctualLightIntensityToIrradianceFactor( lightDistance, spotLight.distance, spotLight.decay );
			directLight.visible = true;
		} else {
			directLight.color = vec3( 0.0 );
			directLight.visible = false;
		}
	}
#endif
#if 0 > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ 0 ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in GeometricContext geometry ) {
		float dotNL = dot( geometry.normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		#ifndef PHYSICALLY_CORRECT_LIGHTS
			irradiance *= PI;
		#endif
		return irradiance;
	}
#endif
#if defined( USE_ENVMAP ) && defined( PHYSICAL )
	vec3 getLightProbeIndirectIrradiance( const in GeometricContext geometry, const in int maxMIPLevel ) {
		#ifdef DOUBLE_SIDED
	float flipNormal = ( float( gl_FrontFacing ) * 2.0 - 1.0 );
#else
	float flipNormal = 1.0;
#endif

		vec3 worldNormal = inverseTransformDirection( geometry.normal, viewMatrix );
		#ifdef ENVMAP_TYPE_CUBE
			vec3 queryVec = flipNormal * vec3( flipEnvMap * worldNormal.x, worldNormal.yz );
			#ifdef TEXTURE_LOD_EXT
				vec4 envMapColor = textureCubeLodEXT( envMap, queryVec, float( maxMIPLevel ) );
			#else
				vec4 envMapColor = textureCube( envMap, queryVec, float( maxMIPLevel ) );
			#endif
			envMapColor.rgb = envMapTexelToLinear( envMapColor ).rgb;
		#elif defined( ENVMAP_TYPE_CUBE_UV )
			vec3 queryVec = flipNormal * vec3( flipEnvMap * worldNormal.x, worldNormal.yz );
			vec4 envMapColor = textureCubeUV( queryVec, 1.0 );
		#else
			vec4 envMapColor = vec4( 0.0 );
		#endif
		return PI * envMapColor.rgb * envMapIntensity;
	}
	float getSpecularMIPLevel( const in float blinnShininessExponent, const in int maxMIPLevel ) {
		float maxMIPLevelScalar = float( maxMIPLevel );
		float desiredMIPLevel = maxMIPLevelScalar - 0.79248 - 0.5 * log2( pow2( blinnShininessExponent ) + 1.0 );
		return clamp( desiredMIPLevel, 0.0, maxMIPLevelScalar );
	}
	vec3 getLightProbeIndirectRadiance( const in GeometricContext geometry, const in float blinnShininessExponent, const in int maxMIPLevel ) {
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( -geometry.viewDir, geometry.normal );
		#else
			vec3 reflectVec = refract( -geometry.viewDir, geometry.normal, refractionRatio );
		#endif
		#ifdef DOUBLE_SIDED
	float flipNormal = ( float( gl_FrontFacing ) * 2.0 - 1.0 );
#else
	float flipNormal = 1.0;
#endif

		reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
		float specularMIPLevel = getSpecularMIPLevel( blinnShininessExponent, maxMIPLevel );
		#ifdef ENVMAP_TYPE_CUBE
			vec3 queryReflectVec = flipNormal * vec3( flipEnvMap * reflectVec.x, reflectVec.yz );
			#ifdef TEXTURE_LOD_EXT
				vec4 envMapColor = textureCubeLodEXT( envMap, queryReflectVec, specularMIPLevel );
			#else
				vec4 envMapColor = textureCube( envMap, queryReflectVec, specularMIPLevel );
			#endif
			envMapColor.rgb = envMapTexelToLinear( envMapColor ).rgb;
		#elif defined( ENVMAP_TYPE_CUBE_UV )
			vec3 queryReflectVec = flipNormal * vec3( flipEnvMap * reflectVec.x, reflectVec.yz );
			vec4 envMapColor = textureCubeUV(queryReflectVec, BlinnExponentToGGXRoughness(blinnShininessExponent));
		#elif defined( ENVMAP_TYPE_EQUIREC )
			vec2 sampleUV;
			sampleUV.y = saturate( flipNormal * reflectVec.y * 0.5 + 0.5 );
			sampleUV.x = atan( flipNormal * reflectVec.z, flipNormal * reflectVec.x ) * RECIPROCAL_PI2 + 0.5;
			#ifdef TEXTURE_LOD_EXT
				vec4 envMapColor = texture2DLodEXT( envMap, sampleUV, specularMIPLevel );
			#else
				vec4 envMapColor = texture2D( envMap, sampleUV, specularMIPLevel );
			#endif
			envMapColor.rgb = envMapTexelToLinear( envMapColor ).rgb;
		#elif defined( ENVMAP_TYPE_SPHERE )
			vec3 reflectView = flipNormal * normalize( ( viewMatrix * vec4( reflectVec, 0.0 ) ).xyz + vec3( 0.0,0.0,1.0 ) );
			#ifdef TEXTURE_LOD_EXT
				vec4 envMapColor = texture2DLodEXT( envMap, reflectView.xy * 0.5 + 0.5, specularMIPLevel );
			#else
				vec4 envMapColor = texture2D( envMap, reflectView.xy * 0.5 + 0.5, specularMIPLevel );
			#endif
			envMapColor.rgb = envMapTexelToLinear( envMapColor ).rgb;
		#endif
		return envMapColor.rgb * envMapIntensity;
	}
#endif

varying vec3 vViewPosition;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
struct BlinnPhongMaterial {
	vec3	diffuseColor;
	vec3	specularColor;
	float	specularShininess;
	float	specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in GeometricContext geometry, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometry.normal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifndef PHYSICALLY_CORRECT_LIGHTS
		irradiance *= PI;
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Diffuse_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_Specular_BlinnPhong( directLight, geometry, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in GeometricContext geometry, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Diffuse_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong
#define Material_LightProbeLOD( material )	(0)

#ifdef USE_SHADOWMAP
	#if 1 > 0
		uniform sampler2D directionalShadowMap[ 1 ];
		varying vec4 vDirectionalShadowCoord[ 1 ];
	#endif
	#if 1 > 0
		uniform sampler2D spotShadowMap[ 1 ];
		varying vec4 vSpotShadowCoord[ 1 ];
	#endif
	#if 0 > 0
		uniform sampler2D pointShadowMap[ 0 ];
		varying vec4 vPointShadowCoord[ 0 ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	float texture2DShadowLerp( sampler2D depths, vec2 size, vec2 uv, float compare ) {
		const vec2 offset = vec2( 0.0, 1.0 );
		vec2 texelSize = vec2( 1.0 ) / size;
		vec2 centroidUV = floor( uv * size + 0.5 ) / size;
		float lb = texture2DCompare( depths, centroidUV + texelSize * offset.xx, compare );
		float lt = texture2DCompare( depths, centroidUV + texelSize * offset.xy, compare );
		float rb = texture2DCompare( depths, centroidUV + texelSize * offset.yx, compare );
		float rt = texture2DCompare( depths, centroidUV + texelSize * offset.yy, compare );
		vec2 f = fract( uv * size + 0.5 );
		float a = mix( lb, lt, f.y );
		float b = mix( rb, rt, f.y );
		float c = mix( a, b, f.x );
		return c;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );
		bool inFrustum = all( inFrustumVec );
		bvec2 frustumTestVec = bvec2( inFrustum, shadowCoord.z <= 1.0 );
		bool frustumTest = all( frustumTestVec );
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			return (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			return (
				texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy, shadowCoord.z ) +
				texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return 1.0;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		float dp = ( length( lightToPosition ) - shadowBias ) / 1000.0;
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif

#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vUv );
		vec2 dSTdy = dFdy( vUv );
		float Hll = bumpScale * texture2D( bumpMap, vUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy ) {
		vec3 vSigmaX = dFdx( surf_pos );
		vec3 vSigmaY = dFdy( surf_pos );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 );
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif

#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
	vec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( vUv.st );
		vec2 st1 = dFdy( vUv.st );
		vec3 S = normalize( q0 * st1.t - q1 * st0.t );
		vec3 T = normalize( -q0 * st1.s + q1 * st0.s );
		vec3 N = normalize( surf_norm );
		vec3 mapN = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;
		mapN.xy = normalScale * mapN.xy;
		mat3 tsn = mat3( S, T, N );
		return normalize( tsn * mapN );
	}
#endif

#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif
#ifdef USE_LOGDEPTHBUF
	uniform float logDepthBufFC;
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
	#endif
#endif

#if NUM_CLIPPING_PLANES > 0
	#if ! defined( PHYSICAL ) && ! defined( PHONG )
		varying vec3 vViewPosition;
	#endif
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif

void main() {
	#if NUM_CLIPPING_PLANES > 0
	for ( int i = 0; i < NUM_CLIPPING_PLANES; ++ i ) {
		vec4 plane = clippingPlanes[ i ];
		if ( dot( vViewPosition, plane.xyz ) > plane.w ) discard;
	}
#endif

	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#if defined(USE_LOGDEPTHBUF) && defined(USE_LOGDEPTHBUF_EXT)
	gl_FragDepthEXT = log2(vFragDepth) * logDepthBufFC * 0.5;
#endif
	#ifdef USE_MAP
	vec4 texelColor = texture2D( map, vUv );
	texelColor = mapTexelToLinear( texelColor );
	diffuseColor *= texelColor;
#endif

	#ifdef USE_COLOR
	diffuseColor.rgb *= vColor;
#endif
	#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vUv ).g;
#endif

	#ifdef ALPHATEST
	if ( diffuseColor.a < ALPHATEST ) discard;
#endif

	float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif
	#ifdef DOUBLE_SIDED
	float flipNormal = ( float( gl_FrontFacing ) * 2.0 - 1.0 );
#else
	float flipNormal = 1.0;
#endif

	#ifdef FLAT_SHADED
	vec3 fdx = vec3( dFdx( vViewPosition.x ), dFdx( vViewPosition.y ), dFdx( vViewPosition.z ) );
	vec3 fdy = vec3( dFdy( vViewPosition.x ), dFdy( vViewPosition.y ), dFdy( vViewPosition.z ) );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal ) * flipNormal;
#endif
#ifdef USE_NORMALMAP
	normal = perturbNormal2Arb( -vViewPosition, normal );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( -vViewPosition, normal, dHdxy_fwd() );
#endif

	#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vUv );
	emissiveColor.rgb = emissiveMapTexelToLinear( emissiveColor ).rgb;
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif

	BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;

	
GeometricContext geometry;
geometry.position = - vViewPosition;
geometry.normal = normal;
geometry.viewDir = normalize( vViewPosition );
IncidentLight directLight;
#if ( 0 > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	
#endif
#if ( 1 > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	
		spotLight = spotLights[ 0 ];
		getSpotDirectLightIrradiance( spotLight, geometry, directLight );
		#ifdef USE_SHADOWMAP
		directLight.color *= all( bvec2( spotLight.shadow, directLight.visible ) ) ? getShadow( spotShadowMap[ 0 ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotShadowCoord[ 0 ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometry, material, reflectedLight );
	
#endif
#if ( 1 > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	
		directionalLight = directionalLights[ 0 ];
		getDirectionalDirectLightIrradiance( directionalLight, geometry, directLight );
		#ifdef USE_SHADOWMAP
		directLight.color *= all( bvec2( directionalLight.shadow, directLight.visible ) ) ? getShadow( directionalShadowMap[ 0 ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ 0 ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometry, material, reflectedLight );
	
#endif
#if defined( RE_IndirectDiffuse )
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#ifdef USE_LIGHTMAP
		vec3 lightMapIrradiance = texture2D( lightMap, vUv2 ).xyz * lightMapIntensity;
		#ifndef PHYSICALLY_CORRECT_LIGHTS
			lightMapIrradiance *= PI;
		#endif
		irradiance += lightMapIrradiance;
	#endif
	#if ( 0 > 0 )
		
	#endif
	#if defined( USE_ENVMAP ) && defined( PHYSICAL ) && defined( ENVMAP_TYPE_CUBE_UV )
	 	irradiance += getLightProbeIndirectIrradiance( geometry, 8 );
	#endif
	RE_IndirectDiffuse( irradiance, geometry, material, reflectedLight );
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	vec3 radiance = getLightProbeIndirectRadiance( geometry, Material_BlinnShininessExponent( material ), 8 );
	#ifndef STANDARD
		vec3 clearCoatRadiance = getLightProbeIndirectRadiance( geometry, Material_ClearCoat_BlinnShininessExponent( material ), 8 );
	#else
		vec3 clearCoatRadiance = vec3( 0.0 );
	#endif
		
	RE_IndirectSpecular( radiance, clearCoatRadiance, geometry, material, reflectedLight );
#endif

	#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vUv2 ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_ENVMAP ) && defined( PHYSICAL )
		float dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.specularRoughness );
	#endif
#endif

	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG )
		vec3 cameraToVertex = normalize( vWorldPosition - cameraPosition );
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToVertex, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, flipNormal * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#elif defined( ENVMAP_TYPE_EQUIREC )
		vec2 sampleUV;
		sampleUV.y = saturate( flipNormal * reflectVec.y * 0.5 + 0.5 );
		sampleUV.x = atan( flipNormal * reflectVec.z, flipNormal * reflectVec.x ) * RECIPROCAL_PI2 + 0.5;
		vec4 envColor = texture2D( envMap, sampleUV );
	#elif defined( ENVMAP_TYPE_SPHERE )
		vec3 reflectView = flipNormal * normalize( ( viewMatrix * vec4( reflectVec, 0.0 ) ).xyz + vec3( 0.0, 0.0, 1.0 ) );
		vec4 envColor = texture2D( envMap, reflectView.xy * 0.5 + 0.5 );
	#endif
	envColor = envMapTexelToLinear( envColor );
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif

	gl_FragColor = vec4( outgoingLight, diffuseColor.a );
	#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif

	#if defined( TONE_MAPPING )
  gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif

	  gl_FragColor = linearToOutputTexel( gl_FragColor );

	#ifdef USE_FOG
	#ifdef USE_LOGDEPTHBUF_EXT
		float depth = gl_FragDepthEXT / gl_FragCoord.w;
	#else
		float depth = gl_FragCoord.z / gl_FragCoord.w;
	#endif
	#ifdef FOG_EXP2
		float fogFactor = whiteCompliment( exp2( - fogDensity * fogDensity * depth * depth * LOG2 ) );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, depth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif

}
`.replace("\n"," ").replace(/\s+/g, ''))
{
  // console.log("iiiiiiii");
  return `precision highp float;
  #define NUM_CLIPPING_PLANES 9
  #define saturate(a) clamp( a, 0.0, 1.0 )
  uniform vec3 diffuse;
  uniform vec3 emissive;
  uniform float opacity;
  #define PI 3.14159265359
  #define RECIPROCAL_PI 0.31830988618
  struct IncidentLight {
    vec3 color;
    vec3 direction;
    bool visible;
  };
  struct ReflectedLight {
    vec3 directDiffuse;
    vec3 directSpecular;
    vec3 indirectDiffuse;
    vec3 indirectSpecular;
  };
 
  vec3 BRDF_Diffuse_Lambert( const in vec3 diffuseColor ) {
    return RECIPROCAL_PI * diffuseColor;
  }
    struct DirectionalLight {
      vec3 color;
    };

    struct SpotLight {
      vec3 position;
      vec3 color;
    };
    uniform SpotLight spotLights[ 1 ];
    void getSpotDirectLightIrradiance( const in SpotLight spotLight, const in GeometricContext geometry, out IncidentLight directLight  ) {
      vec3 lVector = spotLight.position - geometry.position;
      directLight.direction = normalize( lVector );
        directLight.color = spotLight.color;
      
    }
  varying vec3 vViewPosition;
    varying vec3 vNormal;
  struct BlinnPhongMaterial {
    vec3	diffuseColor;
  };
  void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in GeometricContext geometry, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
    float dotNL = saturate( dot( geometry.normal, directLight.direction ) );
    vec3 irradiance = dotNL * directLight.color;
      irradiance *= PI;
    reflectedLight.directDiffuse += irradiance * BRDF_Diffuse_Lambert( material.diffuseColor );
  }

  #define RE_Direct				RE_Direct_BlinnPhong
  
  
    uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
  
  void main() {
    for ( int i = 0; i < NUM_CLIPPING_PLANES; ++ i ) {
      vec4 plane = clippingPlanes[ i ];
      if ( dot( vViewPosition, plane.xyz ) > plane.w ) discard;
    }
  
    vec4 diffuseColor = vec4( diffuse, opacity );
    ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
    // vec3 totalEmissiveRadiance = emissive;
  
    float flipNormal = ( float( gl_FrontFacing ) * 2.0 - 1.0 );

    vec3 normal = normalize( vNormal ) * flipNormal;
  
  
    BlinnPhongMaterial material;
  material.diffuseColor = diffuseColor.rgb;
  GeometricContext geometry;
  geometry.position = - vViewPosition;
  geometry.normal = normal;
  IncidentLight directLight;
    SpotLight spotLight;
    
      spotLight = spotLights[ 0 ];
      getSpotDirectLightIrradiance( spotLight, geometry, directLight );
      RE_Direct( directLight, geometry, material, reflectedLight );
      
    vec3 outgoingLight = reflectedLight.directDiffuse;
  
    gl_FragColor = vec4( outgoingLight, 0.9 );
  
  }
  `;
}

if (shaderSource.replace("\n"," ").replace(/\s+/g, '') == `precision highp float;
precision highp int;
#define SHADER_NAME MeshPhongMaterial
#define VERTEX_TEXTURES
#define GAMMA_FACTOR 2
#define MAX_BONES 251
#define NUM_CLIPPING_PLANES 5
#define USE_SHADOWMAP
#define SHADOWMAP_TYPE_PCF
uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat3 normalMatrix;
uniform vec3 cameraPosition;
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
#ifdef USE_COLOR
	attribute vec3 color;
#endif
#ifdef USE_MORPHTARGETS
	attribute vec3 morphTarget0;
	attribute vec3 morphTarget1;
	attribute vec3 morphTarget2;
	attribute vec3 morphTarget3;
	#ifdef USE_MORPHNORMALS
		attribute vec3 morphNormal0;
		attribute vec3 morphNormal1;
		attribute vec3 morphNormal2;
		attribute vec3 morphNormal3;
	#else
		attribute vec3 morphTarget4;
		attribute vec3 morphTarget5;
		attribute vec3 morphTarget6;
		attribute vec3 morphTarget7;
	#endif
#endif
#ifdef USE_SKINNING
	attribute vec4 skinIndex;
	attribute vec4 skinWeight;
#endif

#define PHONG
varying vec3 vViewPosition;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#define PI 3.14159265359
#define PI2 6.28318530718
#define RECIPROCAL_PI 0.31830988618
#define RECIPROCAL_PI2 0.15915494
#define LOG2 1.442695
#define EPSILON 1e-6
#define saturate(a) clamp( a, 0.0, 1.0 )
#define whiteCompliment(a) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float average( const in vec3 color ) { return dot( color, vec3( 0.3333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract(sin(sn) * c);
}
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
struct GeometricContext {
	vec3 position;
	vec3 normal;
	vec3 viewDir;
};
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
vec3 projectOnPlane(in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {
	float distance = dot( planeNormal, point - pointOnPlane );
	return - distance * planeNormal + point;
}
float sideOfPlane( in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {
	return sign( dot( point - pointOnPlane, planeNormal ) );
}
vec3 linePlaneIntersect( in vec3 pointOnLine, in vec3 lineDirection, in vec3 pointOnPlane, in vec3 planeNormal ) {
	return lineDirection * ( dot( planeNormal, pointOnPlane - pointOnLine ) / dot( planeNormal, lineDirection ) ) + pointOnLine;
}

#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP ) || defined( USE_ROUGHNESSMAP ) || defined( USE_METALNESSMAP )
	varying vec2 vUv;
	uniform vec4 offsetRepeat;
#endif

#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
	attribute vec2 uv2;
	varying vec2 vUv2;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif

#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG )
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif

#ifdef USE_COLOR
	varying vec3 vColor;
#endif
#ifdef USE_MORPHTARGETS
	#ifndef USE_MORPHNORMALS
	uniform float morphTargetInfluences[ 8 ];
	#else
	uniform float morphTargetInfluences[ 4 ];
	#endif
#endif
#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	#ifdef BONE_TEXTURE
		uniform sampler2D boneTexture;
		uniform int boneTextureWidth;
		uniform int boneTextureHeight;
		mat4 getBoneMatrix( const in float i ) {
			float j = i * 4.0;
			float x = mod( j, float( boneTextureWidth ) );
			float y = floor( j / float( boneTextureWidth ) );
			float dx = 1.0 / float( boneTextureWidth );
			float dy = 1.0 / float( boneTextureHeight );
			y = dy * ( y + 0.5 );
			vec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );
			vec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );
			vec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );
			vec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );
			mat4 bone = mat4( v1, v2, v3, v4 );
			return bone;
		}
	#else
		uniform mat4 boneMatrices[ MAX_BONES ];
		mat4 getBoneMatrix( const in float i ) {
			mat4 bone = boneMatrices[ int(i) ];
			return bone;
		}
	#endif
#endif

#ifdef USE_SHADOWMAP
	#if 1 > 0
		uniform mat4 directionalShadowMatrix[ 1 ];
		varying vec4 vDirectionalShadowCoord[ 1 ];
	#endif
	#if 1 > 0
		uniform mat4 spotShadowMatrix[ 1 ];
		varying vec4 vSpotShadowCoord[ 1 ];
	#endif
	#if 0 > 0
		uniform mat4 pointShadowMatrix[ 0 ];
		varying vec4 vPointShadowCoord[ 0 ];
	#endif
#endif

#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
	#endif
	uniform float logDepthBufFC;
#endif
#if NUM_CLIPPING_PLANES > 0 && ! defined( PHYSICAL ) && ! defined( PHONG )
	varying vec3 vViewPosition;
#endif

void main() {
	#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP ) || defined( USE_ROUGHNESSMAP ) || defined( USE_METALNESSMAP )
	vUv = uv * offsetRepeat.zw + offsetRepeat.xy;
#endif
	#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
	vUv2 = uv2;
#endif
	#ifdef USE_COLOR
	vColor.xyz = color.xyz;
#endif
	
vec3 objectNormal = vec3( normal );

	#ifdef USE_MORPHNORMALS
	objectNormal += ( morphNormal0 - normal ) * morphTargetInfluences[ 0 ];
	objectNormal += ( morphNormal1 - normal ) * morphTargetInfluences[ 1 ];
	objectNormal += ( morphNormal2 - normal ) * morphTargetInfluences[ 2 ];
	objectNormal += ( morphNormal3 - normal ) * morphTargetInfluences[ 3 ];
#endif

	#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif
	#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix  = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
#endif

	#ifdef FLIP_SIDED
	objectNormal = -objectNormal;
#endif
vec3 transformedNormal = normalMatrix * objectNormal;

#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
#endif
	
vec3 transformed = vec3( position );

	#ifdef USE_DISPLACEMENTMAP
	transformed += normal * ( texture2D( displacementMap, uv ).x * displacementScale + displacementBias );
#endif

	#ifdef USE_MORPHTARGETS
	transformed += ( morphTarget0 - position ) * morphTargetInfluences[ 0 ];
	transformed += ( morphTarget1 - position ) * morphTargetInfluences[ 1 ];
	transformed += ( morphTarget2 - position ) * morphTargetInfluences[ 2 ];
	transformed += ( morphTarget3 - position ) * morphTargetInfluences[ 3 ];
	#ifndef USE_MORPHNORMALS
	transformed += ( morphTarget4 - position ) * morphTargetInfluences[ 4 ];
	transformed += ( morphTarget5 - position ) * morphTargetInfluences[ 5 ];
	transformed += ( morphTarget6 - position ) * morphTargetInfluences[ 6 ];
	transformed += ( morphTarget7 - position ) * morphTargetInfluences[ 7 ];
	#endif
#endif

	#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	skinned  = bindMatrixInverse * skinned;
#endif

	#ifdef USE_SKINNING
	vec4 mvPosition = modelViewMatrix * skinned;
#else
	vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 );
#endif
gl_Position = projectionMatrix * mvPosition;

	#ifdef USE_LOGDEPTHBUF
	gl_Position.z = log2(max( EPSILON, gl_Position.w + 1.0 )) * logDepthBufFC;
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
	#else
		gl_Position.z = (gl_Position.z - 1.0) * gl_Position.w;
	#endif
#endif

	#if NUM_CLIPPING_PLANES > 0 && ! defined( PHYSICAL ) && ! defined( PHONG )
	vViewPosition = - mvPosition.xyz;
#endif

	vViewPosition = - mvPosition.xyz;
	#if defined( USE_ENVMAP ) || defined( PHONG ) || defined( PHYSICAL ) || defined( LAMBERT ) || defined ( USE_SHADOWMAP )
	#ifdef USE_SKINNING
		vec4 worldPosition = modelMatrix * skinned;
	#else
		vec4 worldPosition = modelMatrix * vec4( transformed, 1.0 );
	#endif
#endif

	#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG )
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif

	#ifdef USE_SHADOWMAP
	#if 1 > 0
	
		vDirectionalShadowCoord[ 0 ] = directionalShadowMatrix[ 0 ] * worldPosition;
	
	#endif
	#if 1 > 0
	
		vSpotShadowCoord[ 0 ] = spotShadowMatrix[ 0 ] * worldPosition;
	
	#endif
	#if 0 > 0
	
	#endif
#endif

}`.replace("\n"," ").replace(/\s+/g, ''))
{
  // console.log("iiiiiiii");
  return ``;
}

if (shaderSource.replace("\n"," ").replace(/\s+/g, '') == `precision highp float;
precision highp int;
#define SHADER_NAME MeshPhongMaterial
#define GAMMA_FACTOR 2
#define NUM_CLIPPING_PLANES 5
#define USE_SHADOWMAP
#define SHADOWMAP_TYPE_PCF
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
#define TONE_MAPPING
#define saturate(a) clamp( a, 0.0, 1.0 )
uniform float toneMappingExposure;
uniform float toneMappingWhitePoint;
vec3 LinearToneMapping( vec3 color ) {
  return toneMappingExposure * color;
}
vec3 ReinhardToneMapping( vec3 color ) {
  color *= toneMappingExposure;
  return saturate( color / ( vec3( 1.0 ) + color ) );
}
#define Uncharted2Helper( x ) max( ( ( x * ( 0.15 * x + 0.10 * 0.50 ) + 0.20 * 0.02 ) / ( x * ( 0.15 * x + 0.50 ) + 0.20 * 0.30 ) ) - 0.02 / 0.30, vec3( 0.0 ) )
vec3 Uncharted2ToneMapping( vec3 color ) {
  color *= toneMappingExposure;
  return saturate( Uncharted2Helper( color ) / Uncharted2Helper( vec3( toneMappingWhitePoint ) ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
  color *= toneMappingExposure;
  color = max( vec3( 0.0 ), color - 0.004 );
  return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}

vec3 toneMapping( vec3 color ) { return LinearToneMapping( color ); }

vec4 LinearToLinear( in vec4 value ) {
  return value;
}
vec4 GammaToLinear( in vec4 value, in float gammaFactor ) {
  return vec4( pow( value.xyz, vec3( gammaFactor ) ), value.w );
}
vec4 LinearToGamma( in vec4 value, in float gammaFactor ) {
  return vec4( pow( value.xyz, vec3( 1.0 / gammaFactor ) ), value.w );
}
vec4 sRGBToLinear( in vec4 value ) {
  return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.w );
}
vec4 LinearTosRGB( in vec4 value ) {
  return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.w );
}
vec4 RGBEToLinear( in vec4 value ) {
  return vec4( value.rgb * exp2( value.a * 255.0 - 128.0 ), 1.0 );
}
vec4 LinearToRGBE( in vec4 value ) {
  float maxComponent = max( max( value.r, value.g ), value.b );
  float fExp = clamp( ceil( log2( maxComponent ) ), -128.0, 127.0 );
  return vec4( value.rgb / exp2( fExp ), ( fExp + 128.0 ) / 255.0 );
}
vec4 RGBMToLinear( in vec4 value, in float maxRange ) {
  return vec4( value.xyz * value.w * maxRange, 1.0 );
}
vec4 LinearToRGBM( in vec4 value, in float maxRange ) {
  float maxRGB = max( value.x, max( value.g, value.b ) );
  float M      = clamp( maxRGB / maxRange, 0.0, 1.0 );
  M            = ceil( M * 255.0 ) / 255.0;
  return vec4( value.rgb / ( M * maxRange ), M );
}
vec4 RGBDToLinear( in vec4 value, in float maxRange ) {
    return vec4( value.rgb * ( ( maxRange / 255.0 ) / value.a ), 1.0 );
}
vec4 LinearToRGBD( in vec4 value, in float maxRange ) {
    float maxRGB = max( value.x, max( value.g, value.b ) );
    float D      = max( maxRange / maxRGB, 1.0 );
    D            = min( floor( D ) / 255.0, 1.0 );
    return vec4( value.rgb * ( D * ( 255.0 / maxRange ) ), D );
}
const mat3 cLogLuvM = mat3( 0.2209, 0.3390, 0.4184, 0.1138, 0.6780, 0.7319, 0.0102, 0.1130, 0.2969 );
vec4 LinearToLogLuv( in vec4 value )  {
  vec3 Xp_Y_XYZp = value.rgb * cLogLuvM;
  Xp_Y_XYZp = max(Xp_Y_XYZp, vec3(1e-6, 1e-6, 1e-6));
  vec4 vResult;
  vResult.xy = Xp_Y_XYZp.xy / Xp_Y_XYZp.z;
  float Le = 2.0 * log2(Xp_Y_XYZp.y) + 127.0;
  vResult.w = fract(Le);
  vResult.z = (Le - (floor(vResult.w*255.0))/255.0)/255.0;
  return vResult;
}
const mat3 cLogLuvInverseM = mat3( 6.0014, -2.7008, -1.7996, -1.3320, 3.1029, -5.7721, 0.3008, -1.0882, 5.6268 );
vec4 LogLuvToLinear( in vec4 value ) {
  float Le = value.z * 255.0 + value.w;
  vec3 Xp_Y_XYZp;
  Xp_Y_XYZp.y = exp2((Le - 127.0) / 2.0);
  Xp_Y_XYZp.z = Xp_Y_XYZp.y / value.y;
  Xp_Y_XYZp.x = value.x * Xp_Y_XYZp.z;
  vec3 vRGB = Xp_Y_XYZp.rgb * cLogLuvInverseM;
  return vec4( max(vRGB, 0.0), 1.0 );
}

vec4 mapTexelToLinear( vec4 value ) { return LinearToLinear( value ); }
vec4 envMapTexelToLinear( vec4 value ) { return LinearToLinear( value ); }
vec4 emissiveMapTexelToLinear( vec4 value ) { return LinearToLinear( value ); }
vec4 linearToOutputTexel( vec4 value ) { return LinearToLinear( value ); }

#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#define PI 3.14159265359
#define PI2 6.28318530718
#define RECIPROCAL_PI 0.31830988618
#define RECIPROCAL_PI2 0.15915494
#define LOG2 1.442695
#define EPSILON 1e-6
#define saturate(a) clamp( a, 0.0, 1.0 )
#define whiteCompliment(a) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float average( const in vec3 color ) { return dot( color, vec3( 0.3333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract(sin(sn) * c);
}
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
struct GeometricContext {
	vec3 position;
	vec3 normal;
	vec3 viewDir;
};
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
vec3 projectOnPlane(in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {
	float distance = dot( planeNormal, point - pointOnPlane );
	return - distance * planeNormal + point;
}
float sideOfPlane( in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {
	return sign( dot( point - pointOnPlane, planeNormal ) );
}
vec3 linePlaneIntersect( in vec3 pointOnLine, in vec3 lineDirection, in vec3 pointOnPlane, in vec3 planeNormal ) {
	return lineDirection * ( dot( planeNormal, pointOnPlane - pointOnLine ) / dot( planeNormal, lineDirection ) ) + pointOnLine;
}

vec3 packNormalToRGB( const in vec3 normal ) {
  return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
  return 1.0 - 2.0 * rgb.xyz;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256.,  256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
  return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float linearClipZ, const in float near, const in float far ) {
  return linearClipZ * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
  return (( near + viewZ ) * far ) / (( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float invClipZ, const in float near, const in float far ) {
  return ( near * far ) / ( ( far - near ) * invClipZ - far );
}

#ifdef USE_COLOR
	varying vec3 vColor;
#endif

#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP ) || defined( USE_ROUGHNESSMAP ) || defined( USE_METALNESSMAP )
	varying vec2 vUv;
#endif
#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
	varying vec2 vUv2;
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif

#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif

#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif
#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif
#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif

#if defined( USE_ENVMAP ) || defined( PHYSICAL )
	uniform float reflectivity;
	uniform float envMapIntenstiy;
#endif
#ifdef USE_ENVMAP
	#if ! defined( PHYSICAL ) && ( defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) )
		varying vec3 vWorldPosition;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	uniform float flipEnvMap;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( PHYSICAL )
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif

#ifdef USE_FOG
	uniform vec3 fogColor;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif
bool testLightInRange( const in float lightDistance, const in float cutoffDistance ) {
	return any( bvec2( cutoffDistance == 0.0, lightDistance < cutoffDistance ) );
}
float punctualLightIntensityToIrradianceFactor( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
		if( decayExponent > 0.0 ) {
#if defined ( PHYSICALLY_CORRECT_LIGHTS )
			float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
			float maxDistanceCutoffFactor = pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
			return distanceFalloff * maxDistanceCutoffFactor;
#else
			return pow( saturate( -lightDistance / cutoffDistance + 1.0 ), decayExponent );
#endif
		}
		return 1.0;
}
vec3 BRDF_Diffuse_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 specularColor, const in float dotLH ) {
	float fresnel = exp2( ( -5.55473 * dotLH - 6.98316 ) * dotLH );
	return ( 1.0 - specularColor ) * fresnel + specularColor;
}
float G_GGX_Smith( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gl = dotNL + sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	float gv = dotNV + sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	return 1.0 / ( gl * gv );
}
float G_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
vec3 BRDF_Specular_GGX( const in IncidentLight incidentLight, const in GeometricContext geometry, const in vec3 specularColor, const in float roughness ) {
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( incidentLight.direction + geometry.viewDir );
	float dotNL = saturate( dot( geometry.normal, incidentLight.direction ) );
	float dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );
	float dotNH = saturate( dot( geometry.normal, halfDir ) );
	float dotLH = saturate( dot( incidentLight.direction, halfDir ) );
	vec3 F = F_Schlick( specularColor, dotLH );
	float G = G_GGX_SmithCorrelated( alpha, dotNL, dotNV );
	float D = D_GGX( alpha, dotNH );
	return F * ( G * D );
}
vec3 BRDF_Specular_GGX_Environment( const in GeometricContext geometry, const in vec3 specularColor, const in float roughness ) {
	float dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 AB = vec2( -1.04, 1.04 ) * a004 + r.zw;
	return specularColor * AB.x + AB.y;
}
float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_Specular_BlinnPhong( const in IncidentLight incidentLight, const in GeometricContext geometry, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( incidentLight.direction + geometry.viewDir );
	float dotNH = saturate( dot( geometry.normal, halfDir ) );
	float dotLH = saturate( dot( incidentLight.direction, halfDir ) );
	vec3 F = F_Schlick( specularColor, dotLH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
}
float GGXRoughnessToBlinnExponent( const in float ggxRoughness ) {
	return ( 2.0 / pow2( ggxRoughness + 0.0001 ) - 2.0 );
}
float BlinnExponentToGGXRoughness( const in float blinnExponent ) {
	return sqrt( 2.0 / ( blinnExponent + 2.0 ) );
}

uniform vec3 ambientLightColor;
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	#ifndef PHYSICALLY_CORRECT_LIGHTS
		irradiance *= PI;
	#endif
	return irradiance;
}
#if 1 > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
		int shadow;
		float shadowBias;
		float shadowRadius;
		vec2 shadowMapSize;
	};
	uniform DirectionalLight directionalLights[ 1 ];
	void getDirectionalDirectLightIrradiance( const in DirectionalLight directionalLight, const in GeometricContext geometry, out IncidentLight directLight ) {
		directLight.color = directionalLight.color;
		directLight.direction = directionalLight.direction;
		directLight.visible = true;
	}
#endif
#if 0 > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
		int shadow;
		float shadowBias;
		float shadowRadius;
		vec2 shadowMapSize;
	};
	uniform PointLight pointLights[ 0 ];
	void getPointDirectLightIrradiance( const in PointLight pointLight, const in GeometricContext geometry, out IncidentLight directLight ) {
		vec3 lVector = pointLight.position - geometry.position;
		directLight.direction = normalize( lVector );
		float lightDistance = length( lVector );
		if ( testLightInRange( lightDistance, pointLight.distance ) ) {
			directLight.color = pointLight.color;
			directLight.color *= punctualLightIntensityToIrradianceFactor( lightDistance, pointLight.distance, pointLight.decay );
			directLight.visible = true;
		} else {
			directLight.color = vec3( 0.0 );
			directLight.visible = false;
		}
	}
#endif
#if 1 > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
		int shadow;
		float shadowBias;
		float shadowRadius;
		vec2 shadowMapSize;
	};
	uniform SpotLight spotLights[ 1 ];
	void getSpotDirectLightIrradiance( const in SpotLight spotLight, const in GeometricContext geometry, out IncidentLight directLight  ) {
		vec3 lVector = spotLight.position - geometry.position;
		directLight.direction = normalize( lVector );
		float lightDistance = length( lVector );
		float angleCos = dot( directLight.direction, spotLight.direction );
		if ( all( bvec2( angleCos > spotLight.coneCos, testLightInRange( lightDistance, spotLight.distance ) ) ) ) {
			float spotEffect = smoothstep( spotLight.coneCos, spotLight.penumbraCos, angleCos );
			directLight.color = spotLight.color;
			directLight.color *= spotEffect * punctualLightIntensityToIrradianceFactor( lightDistance, spotLight.distance, spotLight.decay );
			directLight.visible = true;
		} else {
			directLight.color = vec3( 0.0 );
			directLight.visible = false;
		}
	}
#endif
#if 0 > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ 0 ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in GeometricContext geometry ) {
		float dotNL = dot( geometry.normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		#ifndef PHYSICALLY_CORRECT_LIGHTS
			irradiance *= PI;
		#endif
		return irradiance;
	}
#endif
#if defined( USE_ENVMAP ) && defined( PHYSICAL )
	vec3 getLightProbeIndirectIrradiance( const in GeometricContext geometry, const in int maxMIPLevel ) {
		#ifdef DOUBLE_SIDED
	float flipNormal = ( float( gl_FrontFacing ) * 2.0 - 1.0 );
#else
	float flipNormal = 1.0;
#endif

		vec3 worldNormal = inverseTransformDirection( geometry.normal, viewMatrix );
		#ifdef ENVMAP_TYPE_CUBE
			vec3 queryVec = flipNormal * vec3( flipEnvMap * worldNormal.x, worldNormal.yz );
			#ifdef TEXTURE_LOD_EXT
				vec4 envMapColor = textureCubeLodEXT( envMap, queryVec, float( maxMIPLevel ) );
			#else
				vec4 envMapColor = textureCube( envMap, queryVec, float( maxMIPLevel ) );
			#endif
			envMapColor.rgb = envMapTexelToLinear( envMapColor ).rgb;
		#elif defined( ENVMAP_TYPE_CUBE_UV )
			vec3 queryVec = flipNormal * vec3( flipEnvMap * worldNormal.x, worldNormal.yz );
			vec4 envMapColor = textureCubeUV( queryVec, 1.0 );
		#else
			vec4 envMapColor = vec4( 0.0 );
		#endif
		return PI * envMapColor.rgb * envMapIntensity;
	}
	float getSpecularMIPLevel( const in float blinnShininessExponent, const in int maxMIPLevel ) {
		float maxMIPLevelScalar = float( maxMIPLevel );
		float desiredMIPLevel = maxMIPLevelScalar - 0.79248 - 0.5 * log2( pow2( blinnShininessExponent ) + 1.0 );
		return clamp( desiredMIPLevel, 0.0, maxMIPLevelScalar );
	}
	vec3 getLightProbeIndirectRadiance( const in GeometricContext geometry, const in float blinnShininessExponent, const in int maxMIPLevel ) {
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( -geometry.viewDir, geometry.normal );
		#else
			vec3 reflectVec = refract( -geometry.viewDir, geometry.normal, refractionRatio );
		#endif
		#ifdef DOUBLE_SIDED
	float flipNormal = ( float( gl_FrontFacing ) * 2.0 - 1.0 );
#else
	float flipNormal = 1.0;
#endif

		reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
		float specularMIPLevel = getSpecularMIPLevel( blinnShininessExponent, maxMIPLevel );
		#ifdef ENVMAP_TYPE_CUBE
			vec3 queryReflectVec = flipNormal * vec3( flipEnvMap * reflectVec.x, reflectVec.yz );
			#ifdef TEXTURE_LOD_EXT
				vec4 envMapColor = textureCubeLodEXT( envMap, queryReflectVec, specularMIPLevel );
			#else
				vec4 envMapColor = textureCube( envMap, queryReflectVec, specularMIPLevel );
			#endif
			envMapColor.rgb = envMapTexelToLinear( envMapColor ).rgb;
		#elif defined( ENVMAP_TYPE_CUBE_UV )
			vec3 queryReflectVec = flipNormal * vec3( flipEnvMap * reflectVec.x, reflectVec.yz );
			vec4 envMapColor = textureCubeUV(queryReflectVec, BlinnExponentToGGXRoughness(blinnShininessExponent));
		#elif defined( ENVMAP_TYPE_EQUIREC )
			vec2 sampleUV;
			sampleUV.y = saturate( flipNormal * reflectVec.y * 0.5 + 0.5 );
			sampleUV.x = atan( flipNormal * reflectVec.z, flipNormal * reflectVec.x ) * RECIPROCAL_PI2 + 0.5;
			#ifdef TEXTURE_LOD_EXT
				vec4 envMapColor = texture2DLodEXT( envMap, sampleUV, specularMIPLevel );
			#else
				vec4 envMapColor = texture2D( envMap, sampleUV, specularMIPLevel );
			#endif
			envMapColor.rgb = envMapTexelToLinear( envMapColor ).rgb;
		#elif defined( ENVMAP_TYPE_SPHERE )
			vec3 reflectView = flipNormal * normalize( ( viewMatrix * vec4( reflectVec, 0.0 ) ).xyz + vec3( 0.0,0.0,1.0 ) );
			#ifdef TEXTURE_LOD_EXT
				vec4 envMapColor = texture2DLodEXT( envMap, reflectView.xy * 0.5 + 0.5, specularMIPLevel );
			#else
				vec4 envMapColor = texture2D( envMap, reflectView.xy * 0.5 + 0.5, specularMIPLevel );
			#endif
			envMapColor.rgb = envMapTexelToLinear( envMapColor ).rgb;
		#endif
		return envMapColor.rgb * envMapIntensity;
	}
#endif

varying vec3 vViewPosition;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
struct BlinnPhongMaterial {
	vec3	diffuseColor;
	vec3	specularColor;
	float	specularShininess;
	float	specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in GeometricContext geometry, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometry.normal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifndef PHYSICALLY_CORRECT_LIGHTS
		irradiance *= PI;
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Diffuse_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_Specular_BlinnPhong( directLight, geometry, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in GeometricContext geometry, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Diffuse_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong
#define Material_LightProbeLOD( material )	(0)

#ifdef USE_SHADOWMAP
	#if 1 > 0
		uniform sampler2D directionalShadowMap[ 1 ];
		varying vec4 vDirectionalShadowCoord[ 1 ];
	#endif
	#if 1 > 0
		uniform sampler2D spotShadowMap[ 1 ];
		varying vec4 vSpotShadowCoord[ 1 ];
	#endif
	#if 0 > 0
		uniform sampler2D pointShadowMap[ 0 ];
		varying vec4 vPointShadowCoord[ 0 ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	float texture2DShadowLerp( sampler2D depths, vec2 size, vec2 uv, float compare ) {
		const vec2 offset = vec2( 0.0, 1.0 );
		vec2 texelSize = vec2( 1.0 ) / size;
		vec2 centroidUV = floor( uv * size + 0.5 ) / size;
		float lb = texture2DCompare( depths, centroidUV + texelSize * offset.xx, compare );
		float lt = texture2DCompare( depths, centroidUV + texelSize * offset.xy, compare );
		float rb = texture2DCompare( depths, centroidUV + texelSize * offset.yx, compare );
		float rt = texture2DCompare( depths, centroidUV + texelSize * offset.yy, compare );
		vec2 f = fract( uv * size + 0.5 );
		float a = mix( lb, lt, f.y );
		float b = mix( rb, rt, f.y );
		float c = mix( a, b, f.x );
		return c;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );
		bool inFrustum = all( inFrustumVec );
		bvec2 frustumTestVec = bvec2( inFrustum, shadowCoord.z <= 1.0 );
		bool frustumTest = all( frustumTestVec );
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			return (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			return (
				texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy, shadowCoord.z ) +
				texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return 1.0;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		float dp = ( length( lightToPosition ) - shadowBias ) / 1000.0;
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif

#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vUv );
		vec2 dSTdy = dFdy( vUv );
		float Hll = bumpScale * texture2D( bumpMap, vUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy ) {
		vec3 vSigmaX = dFdx( surf_pos );
		vec3 vSigmaY = dFdy( surf_pos );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 );
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif

#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
	vec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( vUv.st );
		vec2 st1 = dFdy( vUv.st );
		vec3 S = normalize( q0 * st1.t - q1 * st0.t );
		vec3 T = normalize( -q0 * st1.s + q1 * st0.s );
		vec3 N = normalize( surf_norm );
		vec3 mapN = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;
		mapN.xy = normalScale * mapN.xy;
		mat3 tsn = mat3( S, T, N );
		return normalize( tsn * mapN );
	}
#endif

#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif
#ifdef USE_LOGDEPTHBUF
	uniform float logDepthBufFC;
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
	#endif
#endif

#if NUM_CLIPPING_PLANES > 0
	#if ! defined( PHYSICAL ) && ! defined( PHONG )
		varying vec3 vViewPosition;
	#endif
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif

void main() {
	#if NUM_CLIPPING_PLANES > 0
	for ( int i = 0; i < NUM_CLIPPING_PLANES; ++ i ) {
		vec4 plane = clippingPlanes[ i ];
		if ( dot( vViewPosition, plane.xyz ) > plane.w ) discard;
	}
#endif

	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#if defined(USE_LOGDEPTHBUF) && defined(USE_LOGDEPTHBUF_EXT)
	gl_FragDepthEXT = log2(vFragDepth) * logDepthBufFC * 0.5;
#endif
	#ifdef USE_MAP
	vec4 texelColor = texture2D( map, vUv );
	texelColor = mapTexelToLinear( texelColor );
	diffuseColor *= texelColor;
#endif

	#ifdef USE_COLOR
	diffuseColor.rgb *= vColor;
#endif
	#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vUv ).g;
#endif

	#ifdef ALPHATEST
	if ( diffuseColor.a < ALPHATEST ) discard;
#endif

	float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif
	#ifdef DOUBLE_SIDED
	float flipNormal = ( float( gl_FrontFacing ) * 2.0 - 1.0 );
#else
	float flipNormal = 1.0;
#endif

	#ifdef FLAT_SHADED
	vec3 fdx = vec3( dFdx( vViewPosition.x ), dFdx( vViewPosition.y ), dFdx( vViewPosition.z ) );
	vec3 fdy = vec3( dFdy( vViewPosition.x ), dFdy( vViewPosition.y ), dFdy( vViewPosition.z ) );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal ) * flipNormal;
#endif
#ifdef USE_NORMALMAP
	normal = perturbNormal2Arb( -vViewPosition, normal );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( -vViewPosition, normal, dHdxy_fwd() );
#endif

	#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vUv );
	emissiveColor.rgb = emissiveMapTexelToLinear( emissiveColor ).rgb;
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif

	BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;

	
GeometricContext geometry;
geometry.position = - vViewPosition;
geometry.normal = normal;
geometry.viewDir = normalize( vViewPosition );
IncidentLight directLight;
#if ( 0 > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	
#endif
#if ( 1 > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	
		spotLight = spotLights[ 0 ];
		getSpotDirectLightIrradiance( spotLight, geometry, directLight );
		#ifdef USE_SHADOWMAP
		directLight.color *= all( bvec2( spotLight.shadow, directLight.visible ) ) ? getShadow( spotShadowMap[ 0 ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotShadowCoord[ 0 ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometry, material, reflectedLight );
	
#endif
#if ( 1 > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	
		directionalLight = directionalLights[ 0 ];
		getDirectionalDirectLightIrradiance( directionalLight, geometry, directLight );
		#ifdef USE_SHADOWMAP
		directLight.color *= all( bvec2( directionalLight.shadow, directLight.visible ) ) ? getShadow( directionalShadowMap[ 0 ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ 0 ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometry, material, reflectedLight );
	
#endif
#if defined( RE_IndirectDiffuse )
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#ifdef USE_LIGHTMAP
		vec3 lightMapIrradiance = texture2D( lightMap, vUv2 ).xyz * lightMapIntensity;
		#ifndef PHYSICALLY_CORRECT_LIGHTS
			lightMapIrradiance *= PI;
		#endif
		irradiance += lightMapIrradiance;
	#endif
	#if ( 0 > 0 )
		
	#endif
	#if defined( USE_ENVMAP ) && defined( PHYSICAL ) && defined( ENVMAP_TYPE_CUBE_UV )
	 	irradiance += getLightProbeIndirectIrradiance( geometry, 8 );
	#endif
	RE_IndirectDiffuse( irradiance, geometry, material, reflectedLight );
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	vec3 radiance = getLightProbeIndirectRadiance( geometry, Material_BlinnShininessExponent( material ), 8 );
	#ifndef STANDARD
		vec3 clearCoatRadiance = getLightProbeIndirectRadiance( geometry, Material_ClearCoat_BlinnShininessExponent( material ), 8 );
	#else
		vec3 clearCoatRadiance = vec3( 0.0 );
	#endif
		
	RE_IndirectSpecular( radiance, clearCoatRadiance, geometry, material, reflectedLight );
#endif

	#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vUv2 ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_ENVMAP ) && defined( PHYSICAL )
		float dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.specularRoughness );
	#endif
#endif

	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG )
		vec3 cameraToVertex = normalize( vWorldPosition - cameraPosition );
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToVertex, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, flipNormal * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#elif defined( ENVMAP_TYPE_EQUIREC )
		vec2 sampleUV;
		sampleUV.y = saturate( flipNormal * reflectVec.y * 0.5 + 0.5 );
		sampleUV.x = atan( flipNormal * reflectVec.z, flipNormal * reflectVec.x ) * RECIPROCAL_PI2 + 0.5;
		vec4 envColor = texture2D( envMap, sampleUV );
	#elif defined( ENVMAP_TYPE_SPHERE )
		vec3 reflectView = flipNormal * normalize( ( viewMatrix * vec4( reflectVec, 0.0 ) ).xyz + vec3( 0.0, 0.0, 1.0 ) );
		vec4 envColor = texture2D( envMap, reflectView.xy * 0.5 + 0.5 );
	#endif
	envColor = envMapTexelToLinear( envColor );
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif

	gl_FragColor = vec4( outgoingLight, diffuseColor.a );
	#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif

	#if defined( TONE_MAPPING )
  gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif

	  gl_FragColor = linearToOutputTexel( gl_FragColor );

	#ifdef USE_FOG
	#ifdef USE_LOGDEPTHBUF_EXT
		float depth = gl_FragDepthEXT / gl_FragCoord.w;
	#else
		float depth = gl_FragCoord.z / gl_FragCoord.w;
	#endif
	#ifdef FOG_EXP2
		float fogFactor = whiteCompliment( exp2( - fogDensity * fogDensity * depth * depth * LOG2 ) );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, depth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif

}`.replace("\n"," ").replace(/\s+/g, ''))
{
  // console.log("iiiiiiii");
  return ``;
}
if (shaderSource.replace("\n"," ").replace(/\s+/g, '') == `precision highp float;
precision highp int;
#define SHADER_NAME MeshBasicMaterial
#define VERTEX_TEXTURES
#define GAMMA_FACTOR 2
#define MAX_BONES 251
#define DOUBLE_SIDED
#define NUM_CLIPPING_PLANES 8
uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat3 normalMatrix;
uniform vec3 cameraPosition;
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
#ifdef USE_COLOR
	attribute vec3 color;
#endif
#ifdef USE_MORPHTARGETS
	attribute vec3 morphTarget0;
	attribute vec3 morphTarget1;
	attribute vec3 morphTarget2;
	attribute vec3 morphTarget3;
	#ifdef USE_MORPHNORMALS
		attribute vec3 morphNormal0;
		attribute vec3 morphNormal1;
		attribute vec3 morphNormal2;
		attribute vec3 morphNormal3;
	#else
		attribute vec3 morphTarget4;
		attribute vec3 morphTarget5;
		attribute vec3 morphTarget6;
		attribute vec3 morphTarget7;
	#endif
#endif
#ifdef USE_SKINNING
	attribute vec4 skinIndex;
	attribute vec4 skinWeight;
#endif

#define PI 3.14159265359
#define PI2 6.28318530718
#define RECIPROCAL_PI 0.31830988618
#define RECIPROCAL_PI2 0.15915494
#define LOG2 1.442695
#define EPSILON 1e-6
#define saturate(a) clamp( a, 0.0, 1.0 )
#define whiteCompliment(a) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float average( const in vec3 color ) { return dot( color, vec3( 0.3333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract(sin(sn) * c);
}
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
struct GeometricContext {
	vec3 position;
	vec3 normal;
	vec3 viewDir;
};
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
vec3 projectOnPlane(in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {
	float distance = dot( planeNormal, point - pointOnPlane );
	return - distance * planeNormal + point;
}
float sideOfPlane( in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {
	return sign( dot( point - pointOnPlane, planeNormal ) );
}
vec3 linePlaneIntersect( in vec3 pointOnLine, in vec3 lineDirection, in vec3 pointOnPlane, in vec3 planeNormal ) {
	return lineDirection * ( dot( planeNormal, pointOnPlane - pointOnLine ) / dot( planeNormal, lineDirection ) ) + pointOnLine;
}

#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP ) || defined( USE_ROUGHNESSMAP ) || defined( USE_METALNESSMAP )
	varying vec2 vUv;
	uniform vec4 offsetRepeat;
#endif

#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
	attribute vec2 uv2;
	varying vec2 vUv2;
#endif
#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG )
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif

#ifdef USE_COLOR
	varying vec3 vColor;
#endif
#ifdef USE_MORPHTARGETS
	#ifndef USE_MORPHNORMALS
	uniform float morphTargetInfluences[ 8 ];
	#else
	uniform float morphTargetInfluences[ 4 ];
	#endif
#endif
#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	#ifdef BONE_TEXTURE
		uniform sampler2D boneTexture;
		uniform int boneTextureWidth;
		uniform int boneTextureHeight;
		mat4 getBoneMatrix( const in float i ) {
			float j = i * 4.0;
			float x = mod( j, float( boneTextureWidth ) );
			float y = floor( j / float( boneTextureWidth ) );
			float dx = 1.0 / float( boneTextureWidth );
			float dy = 1.0 / float( boneTextureHeight );
			y = dy * ( y + 0.5 );
			vec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );
			vec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );
			vec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );
			vec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );
			mat4 bone = mat4( v1, v2, v3, v4 );
			return bone;
		}
	#else
		uniform mat4 boneMatrices[ MAX_BONES ];
		mat4 getBoneMatrix( const in float i ) {
			mat4 bone = boneMatrices[ int(i) ];
			return bone;
		}
	#endif
#endif

#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
	#endif
	uniform float logDepthBufFC;
#endif
#if NUM_CLIPPING_PLANES > 0 && ! defined( PHYSICAL ) && ! defined( PHONG )
	varying vec3 vViewPosition;
#endif

void main() {
	#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP ) || defined( USE_ROUGHNESSMAP ) || defined( USE_METALNESSMAP )
	vUv = uv * offsetRepeat.zw + offsetRepeat.xy;
#endif
	#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
	vUv2 = uv2;
#endif
	#ifdef USE_COLOR
	vColor.xyz = color.xyz;
#endif
	#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif
	#ifdef USE_ENVMAP
	
vec3 objectNormal = vec3( normal );

	#ifdef USE_MORPHNORMALS
	objectNormal += ( morphNormal0 - normal ) * morphTargetInfluences[ 0 ];
	objectNormal += ( morphNormal1 - normal ) * morphTargetInfluences[ 1 ];
	objectNormal += ( morphNormal2 - normal ) * morphTargetInfluences[ 2 ];
	objectNormal += ( morphNormal3 - normal ) * morphTargetInfluences[ 3 ];
#endif

	#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix  = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
#endif

	#ifdef FLIP_SIDED
	objectNormal = -objectNormal;
#endif
vec3 transformedNormal = normalMatrix * objectNormal;

	#endif
	
vec3 transformed = vec3( position );

	#ifdef USE_MORPHTARGETS
	transformed += ( morphTarget0 - position ) * morphTargetInfluences[ 0 ];
	transformed += ( morphTarget1 - position ) * morphTargetInfluences[ 1 ];
	transformed += ( morphTarget2 - position ) * morphTargetInfluences[ 2 ];
	transformed += ( morphTarget3 - position ) * morphTargetInfluences[ 3 ];
	#ifndef USE_MORPHNORMALS
	transformed += ( morphTarget4 - position ) * morphTargetInfluences[ 4 ];
	transformed += ( morphTarget5 - position ) * morphTargetInfluences[ 5 ];
	transformed += ( morphTarget6 - position ) * morphTargetInfluences[ 6 ];
	transformed += ( morphTarget7 - position ) * morphTargetInfluences[ 7 ];
	#endif
#endif

	#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	skinned  = bindMatrixInverse * skinned;
#endif

	#ifdef USE_SKINNING
	vec4 mvPosition = modelViewMatrix * skinned;
#else
	vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 );
#endif
gl_Position = projectionMatrix * mvPosition;

	#ifdef USE_LOGDEPTHBUF
	gl_Position.z = log2(max( EPSILON, gl_Position.w + 1.0 )) * logDepthBufFC;
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
	#else
		gl_Position.z = (gl_Position.z - 1.0) * gl_Position.w;
	#endif
#endif

	#if defined( USE_ENVMAP ) || defined( PHONG ) || defined( PHYSICAL ) || defined( LAMBERT ) || defined ( USE_SHADOWMAP )
	#ifdef USE_SKINNING
		vec4 worldPosition = modelMatrix * skinned;
	#else
		vec4 worldPosition = modelMatrix * vec4( transformed, 1.0 );
	#endif
#endif

	#if NUM_CLIPPING_PLANES > 0 && ! defined( PHYSICAL ) && ! defined( PHONG )
	vViewPosition = - mvPosition.xyz;
#endif

	#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG )
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif

}`.replace("\n"," ").replace(/\s+/g, ''))
{
  // console.log("iiiiiiii");
  return `precision highp float;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform mat4 viewMatrix;
  uniform mat3 normalMatrix;
  attribute vec3 position;
  attribute vec3 normal;
  
    varying vec3 vViewPosition;
  
  void main() {
  vec3 objectNormal = vec3( normal );
  
  vec3 transformedNormal = normalMatrix * objectNormal;

    
  vec3 transformed = vec3( position );
    vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 );
  gl_Position = projectionMatrix * mvPosition;
  
    vViewPosition = - mvPosition.xyz;
  
  }`;
}

if (shaderSource.replace("\n"," ").replace(/\s+/g, '') == `precision highp float;
precision highp int;
#define SHADER_NAME MeshBasicMaterial
#define GAMMA_FACTOR 2
#define DOUBLE_SIDED
#define NUM_CLIPPING_PLANES 8
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
#define TONE_MAPPING
#define saturate(a) clamp( a, 0.0, 1.0 )
uniform float toneMappingExposure;
uniform float toneMappingWhitePoint;
vec3 LinearToneMapping( vec3 color ) {
  return toneMappingExposure * color;
}
vec3 ReinhardToneMapping( vec3 color ) {
  color *= toneMappingExposure;
  return saturate( color / ( vec3( 1.0 ) + color ) );
}
#define Uncharted2Helper( x ) max( ( ( x * ( 0.15 * x + 0.10 * 0.50 ) + 0.20 * 0.02 ) / ( x * ( 0.15 * x + 0.50 ) + 0.20 * 0.30 ) ) - 0.02 / 0.30, vec3( 0.0 ) )
vec3 Uncharted2ToneMapping( vec3 color ) {
  color *= toneMappingExposure;
  return saturate( Uncharted2Helper( color ) / Uncharted2Helper( vec3( toneMappingWhitePoint ) ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
  color *= toneMappingExposure;
  color = max( vec3( 0.0 ), color - 0.004 );
  return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}

vec3 toneMapping( vec3 color ) { return LinearToneMapping( color ); }

vec4 LinearToLinear( in vec4 value ) {
  return value;
}
vec4 GammaToLinear( in vec4 value, in float gammaFactor ) {
  return vec4( pow( value.xyz, vec3( gammaFactor ) ), value.w );
}
vec4 LinearToGamma( in vec4 value, in float gammaFactor ) {
  return vec4( pow( value.xyz, vec3( 1.0 / gammaFactor ) ), value.w );
}
vec4 sRGBToLinear( in vec4 value ) {
  return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.w );
}
vec4 LinearTosRGB( in vec4 value ) {
  return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.w );
}
vec4 RGBEToLinear( in vec4 value ) {
  return vec4( value.rgb * exp2( value.a * 255.0 - 128.0 ), 1.0 );
}
vec4 LinearToRGBE( in vec4 value ) {
  float maxComponent = max( max( value.r, value.g ), value.b );
  float fExp = clamp( ceil( log2( maxComponent ) ), -128.0, 127.0 );
  return vec4( value.rgb / exp2( fExp ), ( fExp + 128.0 ) / 255.0 );
}
vec4 RGBMToLinear( in vec4 value, in float maxRange ) {
  return vec4( value.xyz * value.w * maxRange, 1.0 );
}
vec4 LinearToRGBM( in vec4 value, in float maxRange ) {
  float maxRGB = max( value.x, max( value.g, value.b ) );
  float M      = clamp( maxRGB / maxRange, 0.0, 1.0 );
  M            = ceil( M * 255.0 ) / 255.0;
  return vec4( value.rgb / ( M * maxRange ), M );
}
vec4 RGBDToLinear( in vec4 value, in float maxRange ) {
    return vec4( value.rgb * ( ( maxRange / 255.0 ) / value.a ), 1.0 );
}
vec4 LinearToRGBD( in vec4 value, in float maxRange ) {
    float maxRGB = max( value.x, max( value.g, value.b ) );
    float D      = max( maxRange / maxRGB, 1.0 );
    D            = min( floor( D ) / 255.0, 1.0 );
    return vec4( value.rgb * ( D * ( 255.0 / maxRange ) ), D );
}
const mat3 cLogLuvM = mat3( 0.2209, 0.3390, 0.4184, 0.1138, 0.6780, 0.7319, 0.0102, 0.1130, 0.2969 );
vec4 LinearToLogLuv( in vec4 value )  {
  vec3 Xp_Y_XYZp = value.rgb * cLogLuvM;
  Xp_Y_XYZp = max(Xp_Y_XYZp, vec3(1e-6, 1e-6, 1e-6));
  vec4 vResult;
  vResult.xy = Xp_Y_XYZp.xy / Xp_Y_XYZp.z;
  float Le = 2.0 * log2(Xp_Y_XYZp.y) + 127.0;
  vResult.w = fract(Le);
  vResult.z = (Le - (floor(vResult.w*255.0))/255.0)/255.0;
  return vResult;
}
const mat3 cLogLuvInverseM = mat3( 6.0014, -2.7008, -1.7996, -1.3320, 3.1029, -5.7721, 0.3008, -1.0882, 5.6268 );
vec4 LogLuvToLinear( in vec4 value ) {
  float Le = value.z * 255.0 + value.w;
  vec3 Xp_Y_XYZp;
  Xp_Y_XYZp.y = exp2((Le - 127.0) / 2.0);
  Xp_Y_XYZp.z = Xp_Y_XYZp.y / value.y;
  Xp_Y_XYZp.x = value.x * Xp_Y_XYZp.z;
  vec3 vRGB = Xp_Y_XYZp.rgb * cLogLuvInverseM;
  return vec4( max(vRGB, 0.0), 1.0 );
}

vec4 mapTexelToLinear( vec4 value ) { return LinearToLinear( value ); }
vec4 envMapTexelToLinear( vec4 value ) { return LinearToLinear( value ); }
vec4 emissiveMapTexelToLinear( vec4 value ) { return LinearToLinear( value ); }
vec4 linearToOutputTexel( vec4 value ) { return LinearToLinear( value ); }

uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#define PI 3.14159265359
#define PI2 6.28318530718
#define RECIPROCAL_PI 0.31830988618
#define RECIPROCAL_PI2 0.15915494
#define LOG2 1.442695
#define EPSILON 1e-6
#define saturate(a) clamp( a, 0.0, 1.0 )
#define whiteCompliment(a) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float average( const in vec3 color ) { return dot( color, vec3( 0.3333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract(sin(sn) * c);
}
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
struct GeometricContext {
	vec3 position;
	vec3 normal;
	vec3 viewDir;
};
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
vec3 projectOnPlane(in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {
	float distance = dot( planeNormal, point - pointOnPlane );
	return - distance * planeNormal + point;
}
float sideOfPlane( in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {
	return sign( dot( point - pointOnPlane, planeNormal ) );
}
vec3 linePlaneIntersect( in vec3 pointOnLine, in vec3 lineDirection, in vec3 pointOnPlane, in vec3 planeNormal ) {
	return lineDirection * ( dot( planeNormal, pointOnPlane - pointOnLine ) / dot( planeNormal, lineDirection ) ) + pointOnLine;
}

#ifdef USE_COLOR
	varying vec3 vColor;
#endif

#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP ) || defined( USE_ROUGHNESSMAP ) || defined( USE_METALNESSMAP )
	varying vec2 vUv;
#endif
#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
	varying vec2 vUv2;
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif

#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif

#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif
#if defined( USE_ENVMAP ) || defined( PHYSICAL )
	uniform float reflectivity;
	uniform float envMapIntenstiy;
#endif
#ifdef USE_ENVMAP
	#if ! defined( PHYSICAL ) && ( defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) )
		varying vec3 vWorldPosition;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	uniform float flipEnvMap;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( PHYSICAL )
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif

#ifdef USE_FOG
	uniform vec3 fogColor;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif
#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif
#ifdef USE_LOGDEPTHBUF
	uniform float logDepthBufFC;
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
	#endif
#endif

#if NUM_CLIPPING_PLANES > 0
	#if ! defined( PHYSICAL ) && ! defined( PHONG )
		varying vec3 vViewPosition;
	#endif
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif

void main() {
	#if NUM_CLIPPING_PLANES > 0
	for ( int i = 0; i < NUM_CLIPPING_PLANES; ++ i ) {
		vec4 plane = clippingPlanes[ i ];
		if ( dot( vViewPosition, plane.xyz ) > plane.w ) discard;
	}
#endif

	vec4 diffuseColor = vec4( diffuse, opacity );
	#if defined(USE_LOGDEPTHBUF) && defined(USE_LOGDEPTHBUF_EXT)
	gl_FragDepthEXT = log2(vFragDepth) * logDepthBufFC * 0.5;
#endif
	#ifdef USE_MAP
	vec4 texelColor = texture2D( map, vUv );
	texelColor = mapTexelToLinear( texelColor );
	diffuseColor *= texelColor;
#endif

	#ifdef USE_COLOR
	diffuseColor.rgb *= vColor;
#endif
	#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vUv ).g;
#endif

	#ifdef ALPHATEST
	if ( diffuseColor.a < ALPHATEST ) discard;
#endif

	float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif
	ReflectedLight reflectedLight;
	reflectedLight.directDiffuse = vec3( 0.0 );
	reflectedLight.directSpecular = vec3( 0.0 );
	reflectedLight.indirectDiffuse = diffuseColor.rgb;
	reflectedLight.indirectSpecular = vec3( 0.0 );
	#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vUv2 ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_ENVMAP ) && defined( PHYSICAL )
		float dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.specularRoughness );
	#endif
#endif

	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#ifdef DOUBLE_SIDED
	float flipNormal = ( float( gl_FrontFacing ) * 2.0 - 1.0 );
#else
	float flipNormal = 1.0;
#endif

	#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG )
		vec3 cameraToVertex = normalize( vWorldPosition - cameraPosition );
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToVertex, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, flipNormal * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#elif defined( ENVMAP_TYPE_EQUIREC )
		vec2 sampleUV;
		sampleUV.y = saturate( flipNormal * reflectVec.y * 0.5 + 0.5 );
		sampleUV.x = atan( flipNormal * reflectVec.z, flipNormal * reflectVec.x ) * RECIPROCAL_PI2 + 0.5;
		vec4 envColor = texture2D( envMap, sampleUV );
	#elif defined( ENVMAP_TYPE_SPHERE )
		vec3 reflectView = flipNormal * normalize( ( viewMatrix * vec4( reflectVec, 0.0 ) ).xyz + vec3( 0.0, 0.0, 1.0 ) );
		vec4 envColor = texture2D( envMap, reflectView.xy * 0.5 + 0.5 );
	#endif
	envColor = envMapTexelToLinear( envColor );
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif

	gl_FragColor = vec4( outgoingLight, diffuseColor.a );
	#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif

	#if defined( TONE_MAPPING )
  gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif

	  gl_FragColor = linearToOutputTexel( gl_FragColor );

	#ifdef USE_FOG
	#ifdef USE_LOGDEPTHBUF_EXT
		float depth = gl_FragDepthEXT / gl_FragCoord.w;
	#else
		float depth = gl_FragCoord.z / gl_FragCoord.w;
	#endif
	#ifdef FOG_EXP2
		float fogFactor = whiteCompliment( exp2( - fogDensity * fogDensity * depth * depth * LOG2 ) );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, depth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif

}
`.replace("\n"," ").replace(/\s+/g, ''))
{
  // console.log("iiiiiiii");
  return `precision highp float;
  #define NUM_CLIPPING_PLANES 8
  uniform mat4 viewMatrix;
  vec4 LinearToLinear( in vec4 value ) {
    return value;
  }

  vec4 linearToOutputTexel( vec4 value ) { return LinearToLinear( value ); }
  
  uniform vec3 diffuse;
  uniform float opacity;
  struct ReflectedLight {
    vec3 directDiffuse;
    vec3 directSpecular;
    vec3 indirectDiffuse;
    vec3 indirectSpecular;
  };
      varying vec3 vViewPosition;
    uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
  
  void main() {
    for ( int i = 0; i < NUM_CLIPPING_PLANES; ++ i ) {
      vec4 plane = clippingPlanes[ i ];
      if ( dot( vViewPosition, plane.xyz ) > plane.w ) discard;
    }
  
    vec4 diffuseColor = vec4( diffuse, opacity );
  
    ReflectedLight reflectedLight;
    reflectedLight.indirectDiffuse = diffuseColor.rgb;
  
    vec3 outgoingLight = reflectedLight.indirectDiffuse;
  
    gl_FragColor = vec4( outgoingLight, 0.2 );
  
      gl_FragColor = linearToOutputTexel( gl_FragColor );
  
  }
  `;
}

// if (shaderSource.replace("\n"," ").replace(/\s+/g, '') == ``.replace("\n"," ").replace(/\s+/g, ''))
// {
//   // console.log("iiiiiiii");
//   return ``;
// }


// else{
  // return shaderSource;
// }



//line
if (shaderSource == `attribute vec3 coordinates;void main(void) { gl_Position = vec4(coordinates, 1.0);}`){
vetexID = 0;
return ` attribute vec2 coordinates;
void main(void) {
gl_Position =  vec4(coordinates, 0.0, 1.0);
gl_PointSize = 1.0;
}`;
}



//cube & camera
if (shaderSource == `precision mediump float;

attribute vec3 vertPosition;
attribute vec3 vertColor;
varying vec3 fragColor;
uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;

void main()
{
  fragColor = vertColor;
  gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
}`){
vetexID = 1;
return ` attribute vec2 vertPosition;
void main(void) {
gl_Position =  vec4(vertPosition, 0.0, 1.0);
gl_PointSize = 1.0;
}`;
}


//texture
if (shaderSource == `precision mediump float;

attribute vec3 vertPosition;
attribute vec2 vertTexCoord;
varying vec2 fragTexCoord;
uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;

void main()
{
  fragTexCoord = vertTexCoord;
  gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
}`){
vetexID = 2;
return ` attribute vec2 vertPosition;
void main(void) {
gl_Position =  vec4(vertPosition, 0.0, 1.0);
gl_PointSize = 1.0;
}`;
}



/*==================================fragment=========================================*/
//line
if (shaderSource == `void main(void) {gl_FragColor = vec4(1, 1, 1, 1.0);}`){
  return ` precision mediump float;
  uniform ivec3 line_point[600];
  int division(int a, int b);
  int D_abs(int a, int b);
  int mod(int a, int b); 
  uniform sampler2D backtexture;
  struct txt_coord{
      int x, y;
    };
  vec4 col_transfer(ivec4 color); 
  ivec4 D_texture2D(sampler2D sampler,txt_coord t); 
  ivec4 cal_color(vec4 color0, vec4 color1, vec4 color2, vec4 color3, int wei_x, int wei_y); 
  void main(void) {
  int x0, y0 , x1, y1, x2, y2, k, b, y ;
  x0 = int(gl_FragCoord.x) ; 
  y0 = int(gl_FragCoord.y) ; 
  txt_coord fragTexCoord;
  fragTexCoord.x = x0;
  fragTexCoord.y = y0;
  //gl_FragColor = col_transfer( D_texture2D(backtexture, fragTexCoord));
  gl_FragColor = texture2D(backtexture,vec2( (gl_FragCoord.x)/256.0  ,  (gl_FragCoord.y )/256.0 ) ); 
  //gl_FragColor = vec4 (1.0, 0.0, 0.0, 1.0 );
  for (int i = 0 ; i < 600; i += 2){
      x1 = division( (line_point[i][0] + 1000) * 32 , 250);  
      y1 = division( (line_point[i][1] + 1000) * 32 , 250);  
      x2 = division( (line_point[i + 1][0] + 1000) * 32 , 250);  
      y2 = division( (line_point[i + 1][1] + 1000) * 32 , 250);   
      if ((x0 == x1) && (y0 == y1))
          gl_FragColor = vec4(0.9, 0.9, 0.9, 1.0);
      else{
          if (D_abs(x1,x2) > D_abs(y1,y2)){
              k = division ( (y1 - y2) * 1000, (x1 - x2));
              b = y1 * 1000 - k * x1;
              if (x1 > x2){
                  x1 = x1 + x2;
                  x2 = x1 - x2;
                  x1 = x1 - x2;
              }
              for (int j = 0; j < 255; j++)
                  if ((j > x1) && (j < x2) && (x0 == j) && (y0 == division(k * x0 + b, 1000))  )
                      gl_FragColor = vec4(0.9, 0.9, 0.9, 1.0);
          }else{
              k = division ( (x1 - x2) * 1000, (y1 - y2));
              b = x1 * 1000 - k * y1;
              if (y1 > y2){
                  y1 = y1 + y2;
                  y2 = y1 - y2;
                  y1 = y1 - y2;
              }
              for (int j = 0; j < 255; j++)
                  if ((j > y1) && (j < y2) && (y0 == j) && (x0 == division(k * y0 + b, 1000))  )
                      gl_FragColor = vec4(0.9, 0.9, 0.9, 1.0);
          
          }
          
      }
  
  }
  }
  int division(int a, int b){
      int n = a / b;
      if ( (n - 2) * b >= a )
        return (n - 3);
      else if ( (n - 1) * b >= a )
        return (n - 2);
      else if ( b * n >= a )
        return (n - 1);
      else if ( (n + 1) * b >= a )
        return n ;
      else
        return (n + 1);
    }
  int D_abs(int a, int b){
      if (a > b)
          return a - b;
      else
          return b - a;
    }
    ivec4 D_texture2D(sampler2D sampler,txt_coord t){
      int tx0, ty0, wei_x, wei_y;
      vec4 color0, color1, color2, color3;
      tx0 = division ( t.x, 1000);
      ty0 = division ( t.y, 1000);
      color0 = texture2D(sampler, vec2 ( float(tx0    )/ 255.0 , float(ty0     )/ 255.0));
      color1 = texture2D(sampler, vec2 ( float(tx0 + 1)/ 255.0 , float(ty0     )/ 255.0));
      color2 = texture2D(sampler, vec2 ( float(tx0    )/ 255.0 , float(ty0  + 1)/ 255.0));
      color3 = texture2D(sampler, vec2 ( float(tx0 + 1)/ 255.0 , float(ty0  + 1)/ 255.0));
    
      wei_x = mod (t.x, 1000);
      wei_y = mod (t.y, 1000);
      return cal_color(color0, color1, color2, color3, wei_x, wei_y);
    }
    
    ivec4 cal_color(vec4 color0, vec4 color1, vec4 color2, vec4 color3, int wei_x, int wei_y){
      int r, g, b;
      r = division( int(color0[0] * 255.0) * (1000 - wei_x) * (1000 - wei_y) + int(color1[0] * 255.0) * wei_x * (1000 - wei_y) + int(color2[0] * 255.0) * (1000 - wei_x) * wei_y + int(color3[0] * 255.0) * wei_x * wei_y, 1000000);
      g = division( int(color0[1] * 255.0) * (1000 - wei_x) * (1000 - wei_y) + int(color1[1] * 255.0) * wei_x * (1000 - wei_y) + int(color2[1] * 255.0) * (1000 - wei_x) * wei_y + int(color3[1] * 255.0) * wei_x * wei_y, 1000000);
      b = division( int(color0[2] * 255.0) * (1000 - wei_x) * (1000 - wei_y) + int(color1[2] * 255.0) * wei_x * (1000 - wei_y) + int(color2[2] * 255.0) * (1000 - wei_x) * wei_y + int(color3[2] * 255.0) * wei_x * wei_y, 1000000);
      return ivec4( r, g, b, 100 );
    }
  vec4 col_transfer( ivec4 c){
      return vec4 (  float(c[0])/255.0, float(c[1])/255.0, float(c[2])/255.0, float(c[3])/ 100.0);
  }
  int mod(int a, int b){
      int n = a / b;
      if ( (n - 2) * b >= a )
        return a - (n - 3) * b;
      else if ( (n - 1) * b >= a )
        return a - (n - 2) * b;
      else if ( b * n >= a )
        return a - (n - 1) * b;
      else if ( (n + 1) * b >= a )
        return a - n * b;
      else
        return a - (n + 1) * b;
    }`;
  }


//cube & camera 
if (shaderSource == `precision mediump float;

varying vec3 fragColor;
void main()
{
  gl_FragColor = vec4(fragColor, 1.0);
}`){
return `
precision mediump float;
#define uniformNumber 336
uniform ivec3 tri_point[333];
uniform ivec3 tri_color[333];
uniform int tri_number;
struct tri_p {
  int x0, y0, x1, y1, z1, x2, y2, z2, x3,  y3, z3;
};
struct txt_p {
  int x1, y1, x2, y2, x3,  y3;
};
struct col_p {
  int r1, g1, b1, r2, g2, b2, r3, g3, b3;
};
struct col{
  int r, g, b;
};
struct txt_coord{
  int x, y;
};
#define init tri_p tri; col_p colorrgb; ivec3 colrgb; int z; z = -512;gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);int z0; 
#define assign tri.x0 = int(gl_FragCoord.x); tri.y0 = int(gl_FragCoord.y); tri.x1 = tri_point[i][0]; tri.y1 = tri_point[i][1]; tri.z1 = tri_point[i][2]; tri.x2 = tri_point[i+1][0]; tri.y2 = tri_point[i+1][1]; tri.z2 = tri_point[i+1][2]; tri.x3 = tri_point[i+2][0]; tri.y3 = tri_point[i+2][1]; tri.z3 = tri_point[i+2][2];    colorrgb.r1 = tri_color[i][0]; colorrgb.g1 = tri_color[i][1]; colorrgb.b1 = tri_color[i][2]; colorrgb.r2 = tri_color[i+1][0]; colorrgb.g2 = tri_color[i+1][1]; colorrgb.b2 = tri_color[i+1][2]; colorrgb.r3 = tri_color[i+2][0]; colorrgb.g3 = tri_color[i+2][1]; colorrgb.b3 = tri_color[i+2][2];
#define changePosition tri = changevalue(tri); 
#define cal_Zbuffer z0 = cal_z(tri);
#define pixel_on_triangle ( i < (tri_number * 3) ) && (judge(tri) == 1)
#define draw_pixel (z0 >= -512) && (z0 <= 512) && (z0 > z)
#define renew_Zbuffer z = z0; colrgb = calCoord(colorrgb, tri);
int judge(tri_p t);
int f_judge(tri_p t);
int PinAB(int tx0, int ty0, int tx1, int ty1, int tx2, int ty2);   
int f_PinAB(float tx0, float ty0, float tx1, float ty1, float tx2, float ty2);
int cal_z(tri_p tri);
int division(int a, int b);  
int mod(int a, int b);  
int isqrt(int a);
int D_dot(ivec3 x, ivec3 y);
int D_max(int a, int b);
int D_multiple(int a, int b);
ivec3 D_multiple(ivec3 x, int b);
ivec3 D_multiple(ivec3 x, ivec3 y);
ivec3 D_division(ivec3 x, int y);
int D_division(int x, int y);
tri_p changevalue(tri_p tri);
int  wei_1, wei_2, wei_3;
txt_coord calCoord(txt_p f, tri_p t);
ivec3 calCoord(col_p f, tri_p t);
ivec4 D_texture2D(sampler2D sampler,txt_coord t); 
ivec4 cal_color(vec4 color0, vec4 color1, vec4 color2, vec4 color3, int wei_x, int wei_y); 
ivec3 D_normalize(ivec3 a);
vec4 col_transfer(ivec4 color); 
vec4 col_transfer(ivec3 color, int a); 
// r,g,b 0 - 255   a 0 - 100                 
void main()
{
  init;
  for (int i = 0; i < uniformNumber; i+= 3){
    assign;
    changePosition;
    if ( pixel_on_triangle ){
        cal_Zbuffer;
      if ( draw_pixel ){
        renew_Zbuffer;
        gl_FragColor = vec4 (col_transfer( colrgb, 100));
      } 
    }
  } 
}
int judge(tri_p t) {
    if (( PinAB(t.x0 - t.x1, t.y0 - t.y1, t.x2 - t.x1, t.y2 - t.y1, t.x3 - t.x1, t.y3 - t.y1)+ PinAB(t.x0 - t.x2, t.y0 - t.y2, t.x3 - t.x2, t.y3 - t.y2, t.x1 - t.x2, t.y1 - t.y2) 
    + PinAB(t.x0 - t.x3, t.y0 - t.y3, t.x2 - t.x3, t.y2 - t.y3, t.x1 - t.x3, t.y1 - t.y3) == 3)  )
      {return 1;}
    else
      {return 0;}
}
int PinAB(int tx0, int ty0, int tx1, int ty1, int tx2, int ty2){ 
int kb, kc; kb = tx0*ty1 - tx1*ty0; kc = tx0*ty2 - tx2*ty0;
if  ( ((0 >= kb ) && (0 <= kc )) || ((0  <= kb ) && (0 >= kc)) ) 
  return 1;
  return 0;
}
int f_judge(tri_p t){
  if ( f_PinAB( float(t.x0 - t.x1), float(t.y0 - t.y1), float(t.x2 - t.x1), float(t.y2 - t.y1), float(t.x3 - t.x1), float(t.y3 - t.y1))
     + f_PinAB( float(t.x0 - t.x2), float(t.y0 - t.y2), float(t.x3 - t.x2), float(t.y3 - t.y2), float(t.x1 - t.x2), float(t.y1 - t.y2)) 
     + f_PinAB( float(t.x0 - t.x3), float(t.y0 - t.y3), float(t.x2 - t.x3), float(t.y2 - t.y3), float(t.x1 - t.x3), float(t.y1 - t.y3))
    == 3){return 1;}
  else{return 0;}
}
int f_PinAB(float tx0, float ty0, float tx1, float ty1, float tx2, float ty2){ 
  float kb, kc; kb = tx0*ty1 - tx1*ty0; kc = tx0*ty2 - tx2*ty0;
  if  ( ((0.0001 > kb) && (-0.0001 < kc)) || ((-0.0001 < kb) && (0.0001 > kc)) ) {return 1;} return 0; 
}
int cal_z(tri_p t){
  int A, B, C , D , K;
  A = (t.y3 - t.y1)*(t.z3 - t.z1) - (t.z2 - t.z1)*(t.y3 - t.y1);
  B = (t.x3 - t.x1)*(t.z2 - t.z1) - (t.x2 - t.x1)*(t.z3 - t.z1);
  C = (t.x2 - t.x1)*(t.y3 - t.y1) - (t.x3 - t.x1)*(t.y2 - t.y1);
  D = -1 * (A * t.x1 + B * t.y1 + C * t.z1);
  return (-1 *  division( (A * t.x0 + B * t.y0 + D) , C));
}
int division(int a, int b){
  int n = a / b;
  if ( (n - 2) * b >= a )
    return (n - 3);
  else if ( (n - 1) * b >= a )
    return (n - 2);
  else if ( b * n >= a )
    return (n - 1);
  else if ( (n + 1) * b >= a )
    return n ;
  else
    return (n + 1);
}
int mod(int a, int b){
  int n = a / b;
  if ( (n - 2) * b >= a )
    return a - (n - 3) * b;
  else if ( (n - 1) * b >= a )
    return a - (n - 2) * b;
  else if ( b * n >= a )
    return a - (n - 1) * b;
  else if ( (n + 1) * b >= a )
    return a - n * b;
  else
    return a - (n + 1) * b;
}
txt_coord calCoord(txt_p f, tri_p t){
  txt_coord tt;
  int bcs1, bcs2, bcs3, cs1, cs2, cs3;
  bcs1 = (t.x0 * t.y2 + t.x2 * t.y3 + t.x3 * t.y0) - (t.x3 * t.y2 + t.x2 * t.y0 + t.x0 * t.y3);
  cs1 =  (t.x1 * t.y2 + t.x2 * t.y3 + t.x3 * t.y1) - (t.x3 * t.y2 + t.x2 * t.y1 + t.x1 * t.y3);
  wei_1 = division(bcs1 * 1000, cs1);
  bcs2 = (t.x1 * t.y0 + t.x0 * t.y3 + t.x3 * t.y1) - (t.x3 * t.y0 + t.x0 * t.y1 + t.x1 * t.y3);
  cs2 =  (t.x1 * t.y2 + t.x2 * t.y3 + t.x3 * t.y1) - (t.x3 * t.y2 + t.x2 * t.y1 + t.x1 * t.y3);
  wei_2 = division(bcs2 * 1000, cs2);
  bcs3 = (t.x1 * t.y2 + t.x2 * t.y0 + t.x0 * t.y1) - (t.x0 * t.y2 + t.x2 * t.y1 + t.x1 * t.y0);
  cs3 =  (t.x1 * t.y2 + t.x2 * t.y3 + t.x3 * t.y1) - (t.x3 * t.y2 + t.x2 * t.y1 + t.x1 * t.y3);
  wei_3 = division(bcs3 * 1000, cs3);
  // 在这里还是256000这样一个系数
  f.x1 = division( f.x1 * 51, 200);
  f.y1 = division( f.y1 * 51, 200);
  f.x2 = division( f.x2 * 51, 200);
  f.y2 = division( f.y2 * 51, 200);
  f.x3 = division( f.x3 * 51, 200);
  f.y3 = division( f.y3 * 51, 200); 
  tt.x = wei_1 * f.x1 + wei_2 * f.x2 + wei_3 * f.x3;
  tt.y = wei_1 * f.y1 + wei_2 * f.y2 + wei_3 * f.y3;
  return tt;
}
ivec3 calCoord(col_p f, tri_p t){
  col tt;
  int bcs1, bcs2, bcs3, cs1, cs2, cs3;
  bcs1 = (t.x0 * t.y2 + t.x2 * t.y3 + t.x3 * t.y0) - (t.x3 * t.y2 + t.x2 * t.y0 + t.x0 * t.y3);
  cs1 =  (t.x1 * t.y2 + t.x2 * t.y3 + t.x3 * t.y1) - (t.x3 * t.y2 + t.x2 * t.y1 + t.x1 * t.y3);
  wei_1 = division(bcs1 * 1000, cs1);
  bcs2 = (t.x1 * t.y0 + t.x0 * t.y3 + t.x3 * t.y1) - (t.x3 * t.y0 + t.x0 * t.y1 + t.x1 * t.y3);
  cs2 =  (t.x1 * t.y2 + t.x2 * t.y3 + t.x3 * t.y1) - (t.x3 * t.y2 + t.x2 * t.y1 + t.x1 * t.y3);
  wei_2 = division(bcs2 * 1000, cs2);
  bcs3 = (t.x1 * t.y2 + t.x2 * t.y0 + t.x0 * t.y1) - (t.x0 * t.y2 + t.x2 * t.y1 + t.x1 * t.y0);
  cs3 =  (t.x1 * t.y2 + t.x2 * t.y3 + t.x3 * t.y1) - (t.x3 * t.y2 + t.x2 * t.y1 + t.x1 * t.y3);
  wei_3 = division(bcs3 * 1000, cs3);
  // 在这里还是256000这样一个系数
  f.r1 = division( f.r1 * 51, 200);
  f.g1 = division( f.g1 * 51, 200);
  f.b1 = division( f.b1 * 51, 200);
  f.r2 = division( f.r2 * 51, 200);
  f.g2 = division( f.g2 * 51, 200);
  f.b2 = division( f.b2 * 51, 200);
  f.r3 = division( f.r3 * 51, 200);
  f.g3 = division( f.g3 * 51, 200);
  f.b3 = division( f.b3 * 51, 200);
  tt.r = division( wei_1 * f.r1 + wei_2 * f.r2 + wei_3 * f.r3, 1000);
  tt.g = division( wei_1 * f.g1 + wei_2 * f.g2 + wei_3 * f.g3, 1000);
  tt.b = division( wei_1 * f.b1 + wei_2 * f.b2 + wei_3 * f.b3, 1000);
  return ivec3(tt.r, tt.g, tt.b);
}
ivec4 D_texture2D(sampler2D sampler,txt_coord t){
  int tx0, ty0, wei_x, wei_y;
  vec4 color0, color1, color2, color3;
  tx0 = division ( t.x, 1000);
  ty0 = division ( t.y, 1000);
  color0 = texture2D(sampler, vec2 ( float(tx0    )/ 255.0 , float(ty0     )/ 255.0));
  color1 = texture2D(sampler, vec2 ( float(tx0 + 1)/ 255.0 , float(ty0     )/ 255.0));
  color2 = texture2D(sampler, vec2 ( float(tx0    )/ 255.0 , float(ty0  + 1)/ 255.0));
  color3 = texture2D(sampler, vec2 ( float(tx0 + 1)/ 255.0 , float(ty0  + 1)/ 255.0));
  wei_x = mod (t.x, 1000);
  wei_y = mod (t.y, 1000);
  return cal_color(color0, color1, color2, color3, wei_x, wei_y);
}
ivec4 cal_color(vec4 color0, vec4 color1, vec4 color2, vec4 color3, int wei_x, int wei_y){
  int r, g, b;
  r = division( int(color0[0] * 255.0) * (1000 - wei_x) * (1000 - wei_y) + int(color1[0] * 255.0) * wei_x * (1000 - wei_y) + int(color2[0] * 255.0) * (1000 - wei_x) * wei_y + int(color3[0] * 255.0) * wei_x * wei_y, 1000000);
  g = division( int(color0[1] * 255.0) * (1000 - wei_x) * (1000 - wei_y) + int(color1[1] * 255.0) * wei_x * (1000 - wei_y) + int(color2[1] * 255.0) * (1000 - wei_x) * wei_y + int(color3[1] * 255.0) * wei_x * wei_y, 1000000);
  b = division( int(color0[2] * 255.0) * (1000 - wei_x) * (1000 - wei_y) + int(color1[2] * 255.0) * wei_x * (1000 - wei_y) + int(color2[2] * 255.0) * (1000 - wei_x) * wei_y + int(color3[2] * 255.0) * wei_x * wei_y, 1000000);
  return ivec4( r, g, b, 100 );
}
vec4 col_transfer( ivec4 c){
  return vec4 (  float(c[0])/255.0, float(c[1])/255.0, float(c[2])/255.0, float(c[3])/ 100.0);
}
vec4 col_transfer(ivec3 c, int a){
  return vec4 (  float(c[0])/255.0, float(c[1])/255.0, float(c[2])/255.0, float(a)/ 100.0);
}
ivec3 D_normalize(ivec3 a){
  int rate = isqrt (division(100000000, a[0] * a[0] + a[1] * a[1] + a[2] * a[2])) ;
  return ivec3(division(a[0] * rate, 10), division(a[1] * rate,10), division(a[2] * rate,10));
}
int isqrt(int a){
  for (int i = 0; i < 1000; i++)
    if (i * i >= a)
      return i;
}
ivec3 D_multiple(ivec3 x, int b)
{
  return ivec3(division(x[0] * b,1000), division(x[1] * b,1000), division(x[2] * b,1000));
}
ivec3 D_multiple(ivec3 x, ivec3 y)
{
  return ivec3(division(x[0] * y[0],1000), division(x[1] * y[1],1000), division(x[2] * y[2],1000));
}
ivec3 D_division(ivec3 x, int y)
{
  return ivec3(division(x[0],y), division(x[1],y), division(x[2],y));
}
int D_max(int a, int b)
{
  if (a > b)
    return a;
  else
    return b;
}
int D_dot(ivec3 x, ivec3 y)
{
  int sum = 0;
  for (int i = 0; i < 3; i++)
  {
    sum += x[i] * y[i];
  }
  return division(sum, 1000);
}
tri_p changevalue(tri_p t)
{
  t.x1 = division( (t.x1 + 1000) * 32, 250);
  t.y1 = division( (t.y1 + 1000) * 32, 250);
  t.z1 = division( (t.z1 + 1000) * 32, 250);
  t.x2 = division( (t.x2 + 1000) * 32, 250);
  t.y2 = division( (t.y2 + 1000) * 32, 250);
  t.z2 = division( (t.z2 + 1000) * 32, 250);
  t.x3 = division( (t.x3 + 1000) * 32, 250);
  t.y3 = division( (t.y3 + 1000) * 32, 250);
  t.z3 = division( (t.z3 + 1000) * 32, 250);
  return t;
}
`;}


//texture
if (shaderSource == `precision mediump float;

varying vec2 fragTexCoord;
uniform sampler2D sampler;

void main()
{
  gl_FragColor = texture2D(sampler, fragTexCoord);
}`){
return ` precision mediump float;
#define uniformNumber 336
uniform ivec3 tri_point[333];
uniform ivec2 text_point[333];
uniform int tri_number;
uniform sampler2D sampler;
struct tri_p {
  int x0, y0, x1, y1, z1, x2, y2, z2, x3,  y3, z3;
};
struct txt_p {
  int x1, y1, x2, y2, x3,  y3;
};
struct txt_coord{
  int x, y;
};

#define init tri_p tri; txt_p texcoord; int z; z = -512;gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);int z0; txt_coord fragTexCoord;
#define assign tri.x0 = int(gl_FragCoord.x); tri.y0 = int(gl_FragCoord.y); tri.x1 = tri_point[i][0]; tri.y1 = tri_point[i][1]; tri.z1 = tri_point[i][2]; tri.x2 = tri_point[i+1][0]; tri.y2 = tri_point[i+1][1]; tri.z2 = tri_point[i+1][2]; tri.x3 = tri_point[i+2][0]; tri.y3 = tri_point[i+2][1]; tri.z3 = tri_point[i+2][2];texcoord.x1 = text_point[i][0]; texcoord.y1 = text_point[i][1];texcoord.x2 = text_point[i+1][0]; texcoord.y2 = text_point[i+1][1];texcoord.x3 = text_point[i+2][0]; texcoord.y3 = text_point[i+2][1];
#define changePosition tri = changevalue(tri); 
#define cal_Zbuffer z0 = cal_z(tri);
#define pixel_on_triangle ( i < (tri_number * 3) ) && (judge(tri) == 1)
#define draw_pixel (z0 >= -512) && (z0 <= 512) && (z0 > z)
#define renew_Zbuffer z = z0; fragTexCoord = calCoord(texcoord, tri);
int judge(tri_p t);
int f_judge(tri_p t);
int PinAB(int tx0, int ty0, int tx1, int ty1, int tx2, int ty2);   
int f_PinAB(float tx0, float ty0, float tx1, float ty1, float tx2, float ty2);
int cal_z(tri_p tri);
int division(int a, int b);  
int mod(int a, int b);  
int isqrt(int a);
int D_dot(ivec3 x, ivec3 y);
int D_max(int a, int b);
int D_multiple(int a, int b);
ivec3 D_multiple(ivec3 x, int b);
ivec3 D_multiple(ivec3 x, ivec3 y);
ivec3 D_division(ivec3 x, int y);
int D_division(int x, int y);
tri_p changevalue(tri_p tri);
int  wei_1, wei_2, wei_3;


txt_coord calCoord(txt_p f, tri_p t);
ivec4 D_texture2D(sampler2D sampler,txt_coord t); 
ivec4 cal_color(vec4 color0, vec4 color1, vec4 color2, vec4 color3, int wei_x, int wei_y); 
ivec3 D_normalize(ivec3 a);
vec4 col_transfer(ivec4 color); 
vec4 col_transfer(ivec3 color, int a);    
// r,g,b 0 - 255   a 0 - 100                 
void main()
{
  init;
  for (int i = 0; i < uniformNumber; i+= 3){
    assign;
    //changePosition;
    if ( pixel_on_triangle ){
        cal_Zbuffer;
      if ( draw_pixel ){
        renew_Zbuffer;
        gl_FragColor = col_transfer( D_texture2D(sampler, fragTexCoord));
      } 
    }
  } 
}

int judge(tri_p t) {
    if (( PinAB(t.x0 - t.x1, t.y0 - t.y1, t.x2 - t.x1, t.y2 - t.y1, t.x3 - t.x1, t.y3 - t.y1)+ PinAB(t.x0 - t.x2, t.y0 - t.y2, t.x3 - t.x2, t.y3 - t.y2, t.x1 - t.x2, t.y1 - t.y2) 
    + PinAB(t.x0 - t.x3, t.y0 - t.y3, t.x2 - t.x3, t.y2 - t.y3, t.x1 - t.x3, t.y1 - t.y3) == 3)  )
      {return 1;}
    else
      {return 0;}
}

int PinAB(int tx0, int ty0, int tx1, int ty1, int tx2, int ty2){ 
int kb, kc; kb = tx0*ty1 - tx1*ty0; kc = tx0*ty2 - tx2*ty0;
if  ( ((0 >= kb ) && (0 <= kc )) || ((0  <= kb ) && (0 >= kc)) ) 
  return 1;
  return 0;
}

int f_judge(tri_p t){
  if ( f_PinAB( float(t.x0 - t.x1), float(t.y0 - t.y1), float(t.x2 - t.x1), float(t.y2 - t.y1), float(t.x3 - t.x1), float(t.y3 - t.y1))
     + f_PinAB( float(t.x0 - t.x2), float(t.y0 - t.y2), float(t.x3 - t.x2), float(t.y3 - t.y2), float(t.x1 - t.x2), float(t.y1 - t.y2)) 
     + f_PinAB( float(t.x0 - t.x3), float(t.y0 - t.y3), float(t.x2 - t.x3), float(t.y2 - t.y3), float(t.x1 - t.x3), float(t.y1 - t.y3))
    == 3){return 1;}
  else{return 0;}
}

int f_PinAB(float tx0, float ty0, float tx1, float ty1, float tx2, float ty2){ 
  float kb, kc; kb = tx0*ty1 - tx1*ty0; kc = tx0*ty2 - tx2*ty0;
  if  ( ((0.0001 > kb) && (-0.0001 < kc)) || ((-0.0001 < kb) && (0.0001 > kc)) ) {return 1;} return 0; 
}

int cal_z(tri_p t){
  int A, B, C , D , K;
  A = (t.y3 - t.y1)*(t.z3 - t.z1) - (t.z2 - t.z1)*(t.y3 - t.y1);
  B = (t.x3 - t.x1)*(t.z2 - t.z1) - (t.x2 - t.x1)*(t.z3 - t.z1);
  C = (t.x2 - t.x1)*(t.y3 - t.y1) - (t.x3 - t.x1)*(t.y2 - t.y1);
  D = -1 * (A * t.x1 + B * t.y1 + C * t.z1);
  return (-1 *  division( (A * t.x0 + B * t.y0 + D) , C));
}

int division(int a, int b){
  int n = a / b;
  if ( (n - 2) * b >= a )
    return (n - 3);
  else if ( (n - 1) * b >= a )
    return (n - 2);
  else if ( b * n >= a )
    return (n - 1);
  else if ( (n + 1) * b >= a )
    return n ;
  else
    return (n + 1);
}

int mod(int a, int b){
  int n = a / b;
  if ( (n - 2) * b >= a )
    return a - (n - 3) * b;
  else if ( (n - 1) * b >= a )
    return a - (n - 2) * b;
  else if ( b * n >= a )
    return a - (n - 1) * b;
  else if ( (n + 1) * b >= a )
    return a - n * b;
  else
    return a - (n + 1) * b;
}

txt_coord calCoord(txt_p f, tri_p t){
  txt_coord tt;
  int bcs1, bcs2, bcs3, cs1, cs2, cs3;
  bcs1 = (t.x0 * t.y2 + t.x2 * t.y3 + t.x3 * t.y0) - (t.x3 * t.y2 + t.x2 * t.y0 + t.x0 * t.y3);
  cs1 =  (t.x1 * t.y2 + t.x2 * t.y3 + t.x3 * t.y1) - (t.x3 * t.y2 + t.x2 * t.y1 + t.x1 * t.y3);
  wei_1 = division(bcs1 * 1000, cs1);

  bcs2 = (t.x1 * t.y0 + t.x0 * t.y3 + t.x3 * t.y1) - (t.x3 * t.y0 + t.x0 * t.y1 + t.x1 * t.y3);
  cs2 =  (t.x1 * t.y2 + t.x2 * t.y3 + t.x3 * t.y1) - (t.x3 * t.y2 + t.x2 * t.y1 + t.x1 * t.y3);
  wei_2 = division(bcs2 * 1000, cs2);

  bcs3 = (t.x1 * t.y2 + t.x2 * t.y0 + t.x0 * t.y1) - (t.x0 * t.y2 + t.x2 * t.y1 + t.x1 * t.y0);
  cs3 =  (t.x1 * t.y2 + t.x2 * t.y3 + t.x3 * t.y1) - (t.x3 * t.y2 + t.x2 * t.y1 + t.x1 * t.y3);
  wei_3 = division(bcs3 * 1000, cs3);
  // 在这里还是256000这样一个系数

  f.x1 = division( f.x1 * 51, 200);
  f.y1 = division( f.y1 * 51, 200);
  f.x2 = division( f.x2 * 51, 200);
  f.y2 = division( f.y2 * 51, 200);
  f.x3 = division( f.x3 * 51, 200);
  f.y3 = division( f.y3 * 51, 200); 

  tt.x = wei_1 * f.x1 + wei_2 * f.x2 + wei_3 * f.x3;
  tt.y = wei_1 * f.y1 + wei_2 * f.y2 + wei_3 * f.y3;
  return tt;
}


ivec4 D_texture2D(sampler2D sampler,txt_coord t){
  int tx0, ty0, wei_x, wei_y;
  vec4 color0, color1, color2, color3;
  tx0 = division ( t.x, 1000);
  ty0 = division ( t.y, 1000);
  color0 = texture2D(sampler, vec2 ( float(tx0    )/ 255.0 , float(ty0     )/ 255.0));
  color1 = texture2D(sampler, vec2 ( float(tx0 + 1)/ 255.0 , float(ty0     )/ 255.0));
  color2 = texture2D(sampler, vec2 ( float(tx0    )/ 255.0 , float(ty0  + 1)/ 255.0));
  color3 = texture2D(sampler, vec2 ( float(tx0 + 1)/ 255.0 , float(ty0  + 1)/ 255.0));

  wei_x = mod (t.x, 1000);
  wei_y = mod (t.y, 1000);
  return cal_color(color0, color1, color2, color3, wei_x, wei_y);
}

ivec4 cal_color(vec4 color0, vec4 color1, vec4 color2, vec4 color3, int wei_x, int wei_y){
  int r, g, b;
  r = division( int(color0[0] * 255.0) * (1000 - wei_x) * (1000 - wei_y) + int(color1[0] * 255.0) * wei_x * (1000 - wei_y) + int(color2[0] * 255.0) * (1000 - wei_x) * wei_y + int(color3[0] * 255.0) * wei_x * wei_y, 1000000);
  g = division( int(color0[1] * 255.0) * (1000 - wei_x) * (1000 - wei_y) + int(color1[1] * 255.0) * wei_x * (1000 - wei_y) + int(color2[1] * 255.0) * (1000 - wei_x) * wei_y + int(color3[1] * 255.0) * wei_x * wei_y, 1000000);
  b = division( int(color0[2] * 255.0) * (1000 - wei_x) * (1000 - wei_y) + int(color1[2] * 255.0) * wei_x * (1000 - wei_y) + int(color2[2] * 255.0) * (1000 - wei_x) * wei_y + int(color3[2] * 255.0) * wei_x * wei_y, 1000000);
  return ivec4( r, g, b, 100 );
}

vec4 col_transfer( ivec4 c){
  return vec4 (  float(c[0])/255.0, float(c[1])/255.0, float(c[2])/255.0, float(c[3])/ 100.0);
}

vec4 col_transfer(ivec3 c, int a){
  return vec4 (  float(c[0])/255.0, float(c[1])/255.0, float(c[2])/255.0, float(a)/ 100.0);
}

ivec3 D_normalize(ivec3 a){
  int rate = isqrt (division(100000, D_multiple(a[0],a[0]) + D_multiple(a[1],a[1]) + D_multiple(a[2],a[2]))) ;
  return ivec3(division(a[0] * rate, 10), division(a[1] * rate,10), division(a[2] * rate,10));
}

int isqrt(int a){
  for (int i = 0; i < 1000; i++)
    if (i * i >= a)
      return i;
}

int D_multiple(int a, int b)
{
  if (division(b, 1000) > 100)
	{
		return a * division(b, 1000);
	}	
  else if (division(a, 1000) > 100)
	{
		return b * division(a, 1000);
	}	
	else
	{
		return division(a * b, 1000);
	}
}


ivec3 D_multiple(ivec3 x, int b)
{
  return ivec3(D_multiple(x[0] ,b), D_multiple(x[1] ,b), D_multiple(x[2] ,b));
}

ivec3 D_multiple(ivec3 x, ivec3 y)
{
  return ivec3(D_multiple(x[0] ,y[0]), D_multiple(x[1] ,y[1]), D_multiple(x[2] ,y[2]));
}

ivec3 D_division(ivec3 x, int y)
{
  return ivec3(division(x[0],y), division(x[1],y), division(x[2],y));
}

int D_max(int a, int b)
{
  if (a > b)
    return a;
  else
    return b;
}

int D_dot(ivec3 x, ivec3 y)
{
  int sum = 0;
  for (int i = 0; i < 3; i++)
  {
    sum += D_multiple(x[i], y[i]);
  }
  return sum;
}

tri_p changevalue(tri_p t)
{
  t.x1 = division( (t.x1 + 1000) * 32, 250);
  t.y1 = division( (t.y1 + 1000) * 32, 250);
  t.z1 = division( (t.z1 + 1000) * 32, 250);
  t.x2 = division( (t.x2 + 1000) * 32, 250);
  t.y2 = division( (t.y2 + 1000) * 32, 250);
  t.z2 = division( (t.z2 + 1000) * 32, 250);
  t.x3 = division( (t.x3 + 1000) * 32, 250);
  t.y3 = division( (t.y3 + 1000) * 32, 250);
  t.z3 = division( (t.z3 + 1000) * 32, 250);
  return t;
}
`;
}







console.log("我什么都没有进入");



}