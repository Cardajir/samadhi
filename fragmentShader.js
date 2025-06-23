export default /* glsl */ `

uniform float u_time;
uniform vec2 u_resolution;
varying vec2 vUv;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv = uv * 2.0 - 1.0; // Center UVs

    // Background color (deep blue/black)
    vec3 color = vec3(0.05, 0.05, 0.15);

    // Add several blurred blobs
    float t = u_time * 0.1;
    float glow = 0.0;

    // Blob 1
    vec2 pos1 = vec2(sin(t) * 0.4, cos(t) * 0.5);
    glow += 0.3 / (length(uv - pos1) * 8.0 + 0.2);

    // Blob 2
    vec2 pos2 = vec2(-0.5 + cos(t * 1.3) * 0.3, 0.5 + sin(t * 1.1) * 0.2);
    glow += 0.2 / (length(uv - pos2) * 7.0 + 0.2);

    // Blob 3
    vec2 pos3 = vec2(0.5 + sin(t * 0.7) * 0.2, -0.5 + cos(t * 0.9) * 0.3);
    glow += 0.25 / (length(uv - pos3) * 9.0 + 0.2);

    // Blob 4
    vec2 pos4 = vec2(-0.3, -0.7 + sin(t * 0.5) * 0.2);
    glow += 0.15 / (length(uv - pos4) * 6.0 + 0.2);

    // Colorize the glow (purple/blue)
    color += glow * vec3(0.2, 0.1, 0.5);

    gl_FragColor = vec4(color, 1.0);
}
`;
