precision highp float;

varying vec2 vTexCoord;

uniform sampler2D from;
uniform sampler2D to;
uniform float progress;
uniform vec2 resolution;

// gl-transitions-specific uniforms go here
uniform float strength;

vec4 getFromColor(vec2 uv) {
  return texture2D(from, uv);
}

vec4 getToColor(vec2 uv) {
  return texture2D(to, uv);
}

// paste gl-transitions here
// (just make sure its uniform list above matches what it needs)

vec4 transition (vec2 uv) {
  vec4 coordTo = getToColor(uv);
  vec4 coordFrom = getFromColor(uv);

  return mix(
    getFromColor(mix(uv, coordTo.rg, progress)),
    getToColor(mix(coordFrom.rg, uv, progress)),
    progress
  );
}


void main() {
  vec2 uv = vTexCoord;

  // If the transition looks vertically flipped, uncomment this line:
  // uv.y = 1.0 - uv.y;

  gl_FragColor = transition(uv);
}
