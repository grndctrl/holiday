import { shaderMaterial, Plane } from '@react-three/drei';
import { useRef } from 'react';
import { extend, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Vector3 } from 'three';

const MagicMaterial = shaderMaterial(
  {
    flipped: true,
    time: 0,
    a: new Vector3(0.5, 0.5, 0.5),
    b: new Vector3(0.5, 0.5, 0.5),
    c: new Vector3(1.0, 1.0, 1.0),
  },
  `
  varying vec2 vUv;
  void main() {
    vUv=uv;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
  }
  `,
  `
  precision mediump float;

  #define PI 3.14159265359

  varying vec2 vUv;

  uniform bool flipped;
  uniform float time;

  // colors
  uniform vec3 a;
  uniform vec3 b;
  uniform vec3 c;

  // vhs effect
  const float range = 0.05;
  const float noiseQuality = 250.0;
  const float noiseIntensity = 0.0088;
  const float offsetIntensity = 0.02;
  const float colorOffsetIntensity = 1.3;

  float ring(vec2 coords, vec2 center, float radius, float thickness, float blur) {
    float calculatedRadius = length(coords - center);
    float innerRadius = radius - thickness;
    float blurPercent = min(1.0, max(0.0, blur)) * 0.5 * thickness;

    float inner =
        smoothstep(innerRadius - blurPercent, innerRadius + blurPercent, calculatedRadius);
    float outer = smoothstep(radius - blurPercent, radius + blurPercent, calculatedRadius);
  
    return inner - outer;
  }

  float rand(vec2 co)
  {
      return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
  }

  float verticalBar(float pos, float uvY, float offset)
  {
      float edge0 = (pos - range);
      float edge1 = (pos + range);

      float x = smoothstep(edge0, pos, uvY) * offset;
      x -= smoothstep(pos, edge1, uvY) * offset;
      return x;
  }

  void main() {
    // vhs effect
    vec2 uv = vUv;
    
    for (float i = 0.0; i < 0.71; i += 0.1313)
    {
        float d = mod(time * i, 1.7);
        float o = sin(1.0 - tan(time * i));
    	  o *= offsetIntensity;
        uv.x += verticalBar(d, uv.y, o);
    }
    
    float uvY = uv.y;
    uvY *= noiseQuality;
    uvY = float(int(uvY)) * (1.0 / noiseQuality);
    float noise = rand(vec2(time, uvY));
    uv.x += noise * noiseIntensity;

    vec2 offsetR = vec2(0.006 * sin(time), 0.0) * colorOffsetIntensity;
    vec2 offsetG = vec2(0.0073 * (cos(time * 0.97)), 0.0) * colorOffsetIntensity;
    
    // rings
    vec2 uvc = uv;
    uvc.x = uvc.x * 2.0 - 1.0;
    uvc.y = uvc.y;
    if (flipped) {
      uvc.y = 1.0 - uvc.y;
    }
    vec4 fragColor = vec4(vec3(0.0), 1.0);

    float offset = 1.0;
    float offsetIncr = 0.5;
    float thickness = 0.25;
    int rings = 10;
    vec4 color = vec4(vec3(0.0), 0.5);

    for (int i = 0; i < rings; i++) {
      float radius = mod(time * offset, sqrt(2.0) + thickness);
      float blur = 0.5;
      float rR = ring(uvc + offsetR, vec2(0.0, 0.0), radius, thickness, blur);
      float rG = ring(uvc + offsetG, vec2(0.0, 0.0), radius, thickness, blur);
      float rB = ring(uvc, vec2(0.0, 0.0), radius, thickness, blur);
      color = vec4(vec3(a), 1.0);
      fragColor += color * vec4(rR, rG, rB, 0.001);
  
      offset *= offsetIncr;
    }
    offset = 1.7;
    thickness = 0.25;

    for (int i = 0; i < rings; i++) {
      float radius = mod(time * offset + offset, sqrt(2.0) + thickness);
      float blur = 1.0;
      float rR = ring(uvc + offsetR, vec2(0.0, 0.0), radius, thickness, blur);
      float rG = ring(uvc + offsetG, vec2(0.0, 0.0), radius, thickness, blur);
      float rB = ring(uvc, vec2(0.0, 0.0), radius, thickness, blur);
      color = vec4(vec3(b), 1.0);
      fragColor += color * vec4(rR, rG, rB, 0.001);
  
      offset *= offsetIncr;
    }

    for (int i = 0; i < rings; i++) {
      thickness = 0.125;
      float blur = 0.1;
      float r = ring(uvc, vec2(0.0, 0.0), 0.45 * (sin(time + offset) + 1.0), thickness, blur);
  
      fragColor -= vec4(0.3333, 0.1137, 0.2039, 0.048) * r;
  
      offset += offsetIncr;
    }

    // thickness = thickness / offsetIncr;
    // radius = mod(time * offset, sqrt(2.0) + thickness);
    // blur = blur / offsetIncr;
    // rR = ring(uvc + offsetR, vec2(0.0, 0.0), radius, thickness, blur);
    // rG = ring(uvc + offsetG, vec2(0.0, 0.0), radius, thickness, blur);
    // rB = ring(uvc, vec2(0.0, 0.0), radius, thickness, blur);
    // color = vec4(vec3(b), 0.5);
    // fragColor += color * vec4(rR, rG, rB, 1.0);

    // offset *= offsetIncr;
    // thickness = thickness / offsetIncr;
    // radius = mod(time * offset, sqrt(2.0) + thickness);
    // blur = blur / offsetIncr;
    // r = ring(uv, vec2(0.0, 0.0), radius, thickness, blur);
    // color = vec4(vec3(c), 0.5);
    // fragColor += color * r;
 
    gl_FragColor = fragColor;
  }
  `
);

extend({ MagicMaterial });

interface ShaderPlaneProps {
  ticker: number;
  flipped: boolean;
  position: THREE.Vector3;
  rotation: THREE.Vector3;
  speed: number;
  a: THREE.Color;
  b: THREE.Color;
  c: THREE.Color;
}

export default function ShaderPlane({ ticker, flipped, position, rotation, speed, a, b, c }: ShaderPlaneProps) {
  const { viewport } = useThree();
  const ref = useRef(null);

  useFrame((_, delta) => {
    // @ts-ignore
    ref.current.time += delta * speed;
  });

  return (
    <Plane position={position} args={[1.8, 0.9]} rotation={[rotation.x, rotation.y, rotation.z]}>
      {/* @ts-ignore */}
      <magicMaterial
        ref={ref}
        flipped={flipped}
        speed={speed}
        a={[a.r, a.g, a.b]}
        b={[b.r, b.g, b.b]}
        c={[c.r, c.g, c.b]}
      />
    </Plane>
  );
}
