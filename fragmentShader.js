export default /* glsl */ `

uniform float u_time;
uniform vec2 u_randomisePosition;
varying vec2 vUv;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {
  vec2 pos = vUv * 2.0 - 1.0;
  float noise = sin(pos.y * 10.0 + u_time * 0.2) * 0.5 + 0.5;
  float shape = smoothstep(0.1, 0.5, noise * (1.0 - length(pos)));

  vec3 color1 = vec3(5.0 / 255.0, 0.0, 30.0 / 255.0);
  vec3 color2 = vec3(0.0, 0.0, 0.1);
  vec3 color = mix(color2, color1, shape);

  gl_FragColor = vec4(color, 1.0);
      }
`;