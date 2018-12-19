manualChangeShader = function(shaderSource){
//console.log("in manualChangeShader");

/*==================================vertex=========================================*/
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
if (shaderSource.replace("\n"," ").replace(/\s+/g, '') == `precision mediump float;

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
}`.replace("\n"," ").replace(/\s+/g, '')){
vetexID = 2;
return ` attribute vec2 vertPosition;
void main(void) {
gl_Position =  vec4(vertPosition, 0.0, 1.0);
gl_PointSize = 1.0;
}`;
}

//simple light
if (shaderSource.replace("\n"," ").replace(/\s+/g, '') == `precision mediump float;

attribute vec3 vertPosition;
attribute vec2 vertTexCoord;
attribute vec3 vertNormal;

varying vec2 fragTexCoord;
varying vec3 fragNormal;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;

void main()
{
  fragTexCoord = vertTexCoord;
  fragNormal = (mWorld * vec4(vertNormal, 0.0)).xyz;

  gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
}`.replace("\n"," ").replace(/\s+/g, '')){
vetexID = 3;
return ` attribute vec2 vertPosition;
void main(void) {
gl_Position =  vec4(vertPosition, 0.0, 1.0);
gl_PointSize = 1.0;
}`;
}



//simple light , two texture more light
if (shaderSource.replace("\n"," ").replace(/\s+/g, '') == `precision mediump float;

attribute vec3 vertPosition;
attribute vec2 vertTexCoord;
attribute vec3 vertNormal;

varying vec2 fragTexCoord;
varying vec3 fragNormal;
varying vec4 vPosition;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;

void main()
{
    vPosition = mView * vec4(vertPosition, 1.0);
    fragTexCoord = vertTexCoord;
    fragNormal = (mWorld * vec4(vertNormal, 0.0)).xyz;

    gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
}
`.replace("\n"," ").replace(/\s+/g, '')){
vetexID = 4;
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
if (shaderSource.replace("\n"," ").replace(/\s+/g, '') == `precision mediump float;

varying vec2 fragTexCoord;
uniform sampler2D sampler;

void main()
{
  gl_FragColor = texture2D(sampler, fragTexCoord);
}`.replace("\n"," ").replace(/\s+/g, '')){
return `precision mediump float;
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

//simple light
if (shaderSource.replace("\n"," ").replace(/\s+/g, '') == `precision mediump float;

struct DirectionalLight
{
	vec3 direction;
	vec3 color;
};

varying vec2 fragTexCoord;
varying vec3 fragNormal;

uniform vec3 ambientLightIntensity;
uniform DirectionalLight sun;
uniform sampler2D sampler;

void main()
{
	vec3 surfaceNormal = normalize(fragNormal);
	vec3 normSunDir = normalize(sun.direction);
	vec4 texel = texture2D(sampler, fragTexCoord);

	vec3 lightIntensity = ambientLightIntensity +
		sun.color * max(dot(fragNormal, normSunDir), 0.0);

	gl_FragColor = vec4(texel.rgb * lightIntensity, texel.a);
}`.replace("\n"," ").replace(/\s+/g, '')){
return ` precision mediump float;
struct DirectionalLight
{
	ivec3 direction;
	ivec3 color;
};
#define uniformNumber 336
uniform ivec3 tri_point[333];
uniform ivec2 text_point[333];
uniform ivec3 nor_point[333];
uniform int tri_number;
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


uniform ivec3 ambientLightIntensity;
uniform DirectionalLight sun;
uniform sampler2D sampler;


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
        ivec3 surfaceNormal = ivec3 ( D_multiple(wei_1 , nor_point[i][0]) +  D_multiple(wei_2 , nor_point[i+1][0]) +  D_multiple(wei_3 , nor_point[i+2][0])   ,  D_multiple(wei_1 , nor_point[i][1]) +  D_multiple(wei_2 , nor_point[i+1][1]) +  D_multiple(wei_3 , nor_point[i+2][1]) ,  D_multiple(wei_1 , nor_point[i][2]) +  D_multiple(wei_2 , nor_point[i+1][2]) +  D_multiple(wei_3 , nor_point[i+2][2])   );
        ivec3 normSunDir = D_normalize(sun.direction);
        ivec4 texel = D_texture2D(sampler, fragTexCoord);
        ivec3 lightIntensity = ambientLightIntensity + D_multiple(sun.color, D_max(D_dot(surfaceNormal, normSunDir), 0));
        gl_FragColor =vec4(col_transfer( D_multiple(texel.rgb , lightIntensity), texel.a));
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

//simple light
if (shaderSource.replace("\n"," ").replace(/\s+/g, '') == `precision mediump float;

struct DirectionalLight
{
	vec3 direction;
	vec3 diffuse;
	vec3 specular;
};

varying vec2 fragTexCoord;
varying vec3 fragNormal;
varying vec4 vPosition;

uniform vec3 ambientLightIntensity;
uniform DirectionalLight sun;
uniform sampler2D sampler;

void main()
{
    vec3 lightDirection = normalize(sun.direction - vPosition.xyz);
    vec3 normSunDir = normalize(sun.direction);
    vec3 surfaceNormal = normalize(fragNormal);
    vec4 texel = texture2D(sampler, fragTexCoord);

    float specularLightWeighting = 0.0;
    vec3 eyeDirection = normalize(-vPosition.xyz);
    vec3 reflectionDirection = reflect(-lightDirection, surfaceNormal);
    specularLightWeighting = pow(max(dot(reflectionDirection, eyeDirection), 0.0), 16.0);

    float diffuseLightWeighting = max(dot(surfaceNormal, sun.direction), 0.0);

    vec3 lightIntensity = ambientLightIntensity +
        sun.specular * specularLightWeighting + 
        sun.diffuse * diffuseLightWeighting;

	gl_FragColor = vec4(texel.rgb * lightIntensity, texel.a);
}

`.replace("\n"," ").replace(/\s+/g, '')){
return ` precision mediump float;

struct DirectionalLight
{
	ivec3 direction;
	ivec3 diffuse;
	ivec3 specular;
};
#define uniformNumber 228
uniform ivec3 tri_point[225];
uniform ivec2 text_point[225];
uniform ivec3 nor_point[225];
uniform ivec4 vPositionVary[225];
uniform int tri_number;
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


txt_coord calCoord(txt_p f, tri_p t);
ivec4 D_texture2D(sampler2D sampler,txt_coord t); 
ivec4 cal_color(vec4 color0, vec4 color1, vec4 color2, vec4 color3, int wei_x, int wei_y); 
ivec3 D_normalize(ivec3 a);
vec4 col_transfer(ivec4 color); 
vec4 col_transfer(ivec3 color, int a);   
vec3 col_transfer(ivec3 color);
ivec3 D_reflect(ivec3 x, ivec3 y);  
int D_pow(int a, int b); 
// r,g,b 0 - 255   a 0 - 100   

uniform ivec3 ambientLightIntensity;
uniform DirectionalLight sun;
uniform sampler2D sampler;
int  wei_1, wei_2, wei_3;

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
        ivec3 fragNormal = ivec3 ( D_multiple( wei_1 , nor_point[i][0]) + D_multiple(wei_2 , nor_point[i+1][0]) + D_multiple(wei_3 , nor_point[i+2][0])   ,           D_multiple(wei_1 , nor_point[i][1]) + D_multiple(wei_2 , nor_point[i+1][1]) + D_multiple(wei_3 , nor_point[i+2][1]) ,             D_multiple(wei_1 , nor_point[i][2]) + D_multiple(wei_2 , nor_point[i+1][2]) + D_multiple(wei_3 , nor_point[i+2][2])    );
		  	ivec4 vPosition = ivec4 ( D_multiple(wei_1 , vPositionVary[i][0]) + D_multiple(wei_2 , vPositionVary[i+1][0]) + D_multiple(wei_3 , vPositionVary[i+2][0])   , D_multiple(wei_1 , vPositionVary[i][1]) + D_multiple(wei_2 , vPositionVary[i+1][1]) + D_multiple(wei_3 , vPositionVary[i+2][1]) , D_multiple(wei_1 , vPositionVary[i][2]) + D_multiple(wei_2 , vPositionVary[i+1][2]) + D_multiple(wei_3 , vPositionVary[i+2][2]),  D_multiple(wei_1 , vPositionVary[i][3]) + D_multiple(wei_2 , vPositionVary[i+1][3]) + D_multiple(wei_3 , vPositionVary[i+2][3])    );
        ivec3 lightDirection = D_normalize(sun.direction - vPosition.xyz);
        ivec3 normSunDir = D_normalize(sun.direction);
        ivec3 surfaceNormal = D_normalize(fragNormal);
        ivec4 texel = D_texture2D(sampler, fragTexCoord);

        int specularLightWeighting = 0;
        ivec3 eyeDirection = D_normalize(-vPosition.xyz);
        ivec3 reflectionDirection = D_reflect(-lightDirection, surfaceNormal);
        specularLightWeighting = D_pow(D_max(D_dot(reflectionDirection, eyeDirection), 0), 16);

        int diffuseLightWeighting = D_max(D_dot(surfaceNormal, sun.direction), 0);

        ivec3 lightIntensity = ambientLightIntensity +
                D_multiple(sun.specular , specularLightWeighting)  + 
                D_multiple(sun.diffuse , diffuseLightWeighting);
                

        gl_FragColor = vec4(col_transfer(D_multiple(texel.rgb , lightIntensity)) , 1.0);
        //gl_FragColor = col_transfer( texel);


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

vec3 col_transfer(ivec3 c){
  return vec3 (  float(c[0])/255.0, float(c[1])/255.0, float(c[2])/255.0);
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

//I - 2.0 * dot(N, I) * N
ivec3 D_reflect(ivec3 x, ivec3 y)
{
	return ivec3(x[0] - 2 * D_multiple(D_dot(x,y),y[0]),x[1] - 2 * D_multiple(D_dot(x,y),y[1]), x[2] - 2 * D_multiple(D_dot(x,y),y[2]));
}

int D_pow(int a, int b)
{
    int ans = 1;
    for (int i = 0; i < 16; i++) {
        ans = D_multiple(ans, a);
    }
    return ans;
}
`;
}


//two texture more light
if (shaderSource.replace("\n"," ").replace(/\s+/g, '') == `precision mediump float;

struct DirectionalLight
{
	vec3 direction;
	vec3 diffuse;
	vec3 specular;
};

varying vec2 fragTexCoord;
varying vec3 fragNormal;
varying vec4 vPosition;

uniform vec3 ambientLightIntensity;
uniform DirectionalLight sun;
uniform sampler2D image0;
uniform sampler2D image1;

void main()
{
    vec3 lightDirection = normalize(sun.direction - vPosition.xyz);
    vec3 normSunDir = normalize(sun.direction);
    vec3 surfaceNormal = normalize(fragNormal);
    vec4 texel0 = texture2D(image0, fragTexCoord);
    vec4 texel1 = texture2D(image1, fragTexCoord);

    float specularLightWeighting = 0.0;
    vec3 eyeDirection = normalize(-vPosition.xyz);
    vec3 reflectionDirection = reflect(-lightDirection, surfaceNormal);
    specularLightWeighting = pow(max(dot(reflectionDirection, eyeDirection), 0.0), 16.0);

    float diffuseLightWeighting = max(dot(surfaceNormal, sun.direction), 0.0);

    vec3 lightIntensity = ambientLightIntensity +
        sun.specular * specularLightWeighting + 
        sun.diffuse * diffuseLightWeighting;

	gl_FragColor = vec4(texel0.rgb * texel1.rgb * lightIntensity, texel0.a* texel1.a);
}
`.replace("\n"," ").replace(/\s+/g, '')){
  return ` precision mediump float;

  struct DirectionalLight
  {
    ivec3 direction;
    ivec3 diffuse;
    ivec3 specular;
  };
  #define uniformNumber 228
  uniform ivec3 tri_point[225];
  uniform ivec2 text_point[225];
  uniform ivec3 nor_point[225];
  uniform ivec4 vPositionVary[225];
  uniform int tri_number;
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
  
  
  txt_coord calCoord(txt_p f, tri_p t);
  ivec4 D_texture2D(sampler2D sampler,txt_coord t); 
  ivec4 cal_color(vec4 color0, vec4 color1, vec4 color2, vec4 color3, int wei_x, int wei_y); 
  ivec3 D_normalize(ivec3 a);
  vec4 col_transfer(ivec4 color); 
  vec4 col_transfer(ivec3 color, int a);   
  vec3 col_transfer(ivec3 color);
  ivec3 D_reflect(ivec3 x, ivec3 y);  
  int D_pow(int a, int b); 
  // r,g,b 0 - 255   a 0 - 100   
  
  uniform ivec3 ambientLightIntensity;
  uniform DirectionalLight sun;
  uniform sampler2D sampler;
  int  wei_1, wei_2, wei_3;
  uniform sampler2D image0;
  uniform sampler2D image1;
  
          
  
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
          ivec3 fragNormal = ivec3 ( D_multiple( wei_1 , nor_point[i][0]) + D_multiple(wei_2 , nor_point[i+1][0]) + D_multiple(wei_3 , nor_point[i+2][0])   ,           D_multiple(wei_1 , nor_point[i][1]) + D_multiple(wei_2 , nor_point[i+1][1]) + D_multiple(wei_3 , nor_point[i+2][1]) ,             D_multiple(wei_1 , nor_point[i][2]) + D_multiple(wei_2 , nor_point[i+1][2]) + D_multiple(wei_3 , nor_point[i+2][2])    );
          ivec4 vPosition = ivec4 ( D_multiple(wei_1 , vPositionVary[i][0]) + D_multiple(wei_2 , vPositionVary[i+1][0]) + D_multiple(wei_3 , vPositionVary[i+2][0])   , D_multiple(wei_1 , vPositionVary[i][1]) + D_multiple(wei_2 , vPositionVary[i+1][1]) + D_multiple(wei_3 , vPositionVary[i+2][1]) , D_multiple(wei_1 , vPositionVary[i][2]) + D_multiple(wei_2 , vPositionVary[i+1][2]) + D_multiple(wei_3 , vPositionVary[i+2][2]),  D_multiple(wei_1 , vPositionVary[i][3]) + D_multiple(wei_2 , vPositionVary[i+1][3]) + D_multiple(wei_3 , vPositionVary[i+2][3])    );
          ivec3 lightDirection = D_normalize(sun.direction - vPosition.xyz);
          ivec3 normSunDir = D_normalize(sun.direction);
          ivec3 surfaceNormal = D_normalize(fragNormal);
          ivec4 texel0 = D_texture2D(image0, fragTexCoord);
          ivec4 texel1 = D_texture2D(image1, fragTexCoord);
  
          int specularLightWeighting = 0;
          ivec3 eyeDirection = D_normalize(-vPosition.xyz);
          ivec3 reflectionDirection = D_reflect(-lightDirection, surfaceNormal);
          specularLightWeighting = D_pow(D_max(D_dot(reflectionDirection, eyeDirection), 0), 16);
  
          int diffuseLightWeighting = D_max(D_dot(surfaceNormal, sun.direction), 0);
  
          ivec3 lightIntensity = ambientLightIntensity +
                  D_multiple(sun.specular , specularLightWeighting)  + 
                  D_multiple(sun.diffuse , diffuseLightWeighting);
                  
  
          gl_FragColor = vec4(col_transfer(D_multiple( D_division (texel0.rgb * texel1.rgb, 255)  , lightIntensity)) , 1.0);
          //gl_FragColor = col_transfer( texel1);
  
  
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
  
  vec3 col_transfer(ivec3 c){
    return vec3 (  float(c[0])/255.0, float(c[1])/255.0, float(c[2])/255.0);
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
  
  //I - 2.0 * dot(N, I) * N
  ivec3 D_reflect(ivec3 x, ivec3 y)
  {
    return ivec3(x[0] - 2 * D_multiple(D_dot(x,y),y[0]),x[1] - 2 * D_multiple(D_dot(x,y),y[1]), x[2] - 2 * D_multiple(D_dot(x,y),y[2]));
  }
  
  int D_pow(int a, int b)
  {
      int ans = 1;
      for (int i = 0; i < 16; i++) {
          ans = D_multiple(ans, a);
      }
      return ans;
  }
  
  `;
  }


  
//two texture more light
if (shaderSource.replace("\n"," ").replace(/\s+/g, '') == `precision mediump float;

struct DirectionalLight
{
	vec3 direction;
	vec3 diffuse;
	vec3 specular;
};

varying vec2 fragTexCoord;
varying vec3 fragNormal;
varying vec4 vPosition;

uniform vec3 ambientLightIntensity;
uniform DirectionalLight sun;
uniform sampler2D sampler;

uniform float uAlpha;

void main()
{
    vec3 lightDirection = normalize(sun.direction - vPosition.xyz);
    vec3 normSunDir = normalize(sun.direction);
    vec3 surfaceNormal = normalize(fragNormal);
    vec4 texel = texture2D(sampler, fragTexCoord);

    float specularLightWeighting = 0.0;
    vec3 eyeDirection = normalize(-vPosition.xyz);
    vec3 reflectionDirection = reflect(-lightDirection, surfaceNormal);
    specularLightWeighting = pow(max(dot(reflectionDirection, eyeDirection), 0.0), 16.0);

    float diffuseLightWeighting = max(dot(surfaceNormal, sun.direction), 0.0);

    vec3 lightIntensity = ambientLightIntensity +
        sun.specular * specularLightWeighting + 
        sun.diffuse * diffuseLightWeighting;

	gl_FragColor = vec4(texel.rgb * lightIntensity, texel.a * uAlpha);
}

`.replace("\n"," ").replace(/\s+/g, '')){
  return ` precision mediump float;

  struct DirectionalLight
  {
    ivec3 direction;
    ivec3 diffuse;
    ivec3 specular;
  };
  #define uniformNumber 228
  uniform ivec3 tri_point[225];
  uniform ivec2 text_point[225];
  uniform ivec3 nor_point[225];
  uniform ivec4 vPositionVary[225];
  uniform int tri_number;
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
  #define draw_pixel (z0 >= -512) && (z0 <= 512) && (z0 > bot)
  #define renew_Zbuffer fragTexCoord = calCoord(texcoord, tri);
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
  
  
  txt_coord calCoord(txt_p f, tri_p t);
  ivec4 D_texture2D(sampler2D sampler,txt_coord t); 
  ivec4 cal_color(vec4 color0, vec4 color1, vec4 color2, vec4 color3, int wei_x, int wei_y); 
  ivec3 D_normalize(ivec3 a);
  vec4 col_transfer(ivec4 color); 
  vec4 col_transfer(ivec3 color, int a);   
  vec3 col_transfer(ivec3 color);
  ivec3 D_reflect(ivec3 x, ivec3 y);  
  int D_pow(int a, int b); 
  // r,g,b 0 - 255   a 0 - 100   
  
  uniform ivec3 ambientLightIntensity;
  uniform DirectionalLight sun;
  uniform sampler2D sampler;
  int  wei_1, wei_2, wei_3;
  ivec4 result[80];
  int zbuffer[80];
  int z1, z2, z3;
  int j;
  ivec4 result1, result2, result3;
  int bot , top;
  ivec4 resultbot, resulttop;
  
  void main()
  {
    bot = -512;
    top = -512;
    resultbot = ivec4(0 ,0 ,0 ,0);
    resulttop = ivec4(0 ,0 ,0 ,0);
    init;
    for (int i = 0; i < uniformNumber; i+= 3){
      assign;
      //changePosition;
      if ( pixel_on_triangle ){
          cal_Zbuffer;
        if ( draw_pixel ){
          renew_Zbuffer;
          ivec3 fragNormal = ivec3 ( D_multiple( wei_1 , nor_point[i][0]) + D_multiple(wei_2 , nor_point[i+1][0]) + D_multiple(wei_3 , nor_point[i+2][0])   ,           D_multiple(wei_1 , nor_point[i][1]) + D_multiple(wei_2 , nor_point[i+1][1]) + D_multiple(wei_3 , nor_point[i+2][1]) ,             D_multiple(wei_1 , nor_point[i][2]) + D_multiple(wei_2 , nor_point[i+1][2]) + D_multiple(wei_3 , nor_point[i+2][2])    );
          ivec4 vPosition = ivec4 ( D_multiple(wei_1 , vPositionVary[i][0]) + D_multiple(wei_2 , vPositionVary[i+1][0]) + D_multiple(wei_3 , vPositionVary[i+2][0])   , D_multiple(wei_1 , vPositionVary[i][1]) + D_multiple(wei_2 , vPositionVary[i+1][1]) + D_multiple(wei_3 , vPositionVary[i+2][1]) , D_multiple(wei_1 , vPositionVary[i][2]) + D_multiple(wei_2 , vPositionVary[i+1][2]) + D_multiple(wei_3 , vPositionVary[i+2][2]),  D_multiple(wei_1 , vPositionVary[i][3]) + D_multiple(wei_2 , vPositionVary[i+1][3]) + D_multiple(wei_3 , vPositionVary[i+2][3])    );
          ivec3 lightDirection = D_normalize(sun.direction - vPosition.xyz);
          ivec3 normSunDir = D_normalize(sun.direction);
          ivec3 surfaceNormal = D_normalize(fragNormal);
          ivec4 texel = D_texture2D(sampler, fragTexCoord);
  
          int specularLightWeighting = 0;
          ivec3 eyeDirection = D_normalize(-vPosition.xyz);
          ivec3 reflectionDirection = D_reflect(-lightDirection, surfaceNormal);
          specularLightWeighting = D_pow(D_max(D_dot(reflectionDirection, eyeDirection), 0), 16);
  
          int diffuseLightWeighting = D_max(D_dot(surfaceNormal, sun.direction), 0);
  
          ivec3 lightIntensity = ambientLightIntensity +
                  D_multiple(sun.specular , specularLightWeighting)  + 
                  D_multiple(sun.diffuse , diffuseLightWeighting);
                  
          if (z0 > top){
            bot = top;
            resultbot = resulttop;
            top = z0;
            resulttop = ivec4(D_multiple(texel.rgb , lightIntensity), 1);
          }else{
            bot = z0;
            resultbot = ivec4(D_multiple(texel.rgb , lightIntensity), 1);
          }
        } 
      }
    }
    gl_FragColor = vec4 ( col_transfer(D_multiple(resulttop.xyz , 900) + D_multiple(resultbot.xyz , 900) ), 1.0 );
    
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
  
  vec3 col_transfer(ivec3 c){
    return vec3 (  float(c[0])/255.0, float(c[1])/255.0, float(c[2])/255.0);
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
  
  //I - 2.0 * dot(N, I) * N
  ivec3 D_reflect(ivec3 x, ivec3 y)
  {
    return ivec3(x[0] - 2 * D_multiple(D_dot(x,y),y[0]),x[1] - 2 * D_multiple(D_dot(x,y),y[1]), x[2] - 2 * D_multiple(D_dot(x,y),y[2]));
  }
  
  int D_pow(int a, int b)
  {
      int ans = 1;
      for (int i = 0; i < 16; i++) {
          ans = D_multiple(ans, a);
      }
      return ans;
  }
  `;
  }

  return shaderSource;


  








console.log("我什么都没有进入");



}


manualChangeShaderTre = function(shaderSource){
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
  return shaderSource;
  // return `precision highp float;
  // uniform samplerCube tCube;
  // uniform float tFlip;
  // varying vec3 vWorldPosition;
  // void main() {
  //   gl_FragColor = textureCube( tCube, vec3( tFlip * vWorldPosition.x, vWorldPosition.yz ) );

  // }`;
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
  return shaderSource;
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
  return shaderSource;
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
  return shaderSource;
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


  return shaderSource;
}