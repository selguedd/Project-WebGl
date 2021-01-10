uniform vec3 color;
uniform float light_dir;
uniform vec3 light_color;

varying vec3 world_normal;
varying float cam_dist;

varying vec2 vUv;
uniform sampler2D texture;

void main() { 
  vec3 light_vec = vec3(20.0 * sin(light_dir), 10, 20.0 * cos(light_dir)); 
  float light = 0.5 + dot(world_normal, normalize(light_vec)) / 2.0;
  vec3 full_color = (light_color * light);
  float fog_intensity = smoothstep(0.0, 10000.0, cam_dist);
  vec3 fog_color = full_color * (1.0 - fog_intensity) + vec3(0.1, 0.1, 0.1) * fog_intensity;
  vec4 texture_applied = texture2D(texture, vUv);
  gl_FragColor = texture_applied ;
}