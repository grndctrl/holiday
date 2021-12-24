import ShaderPlane from './ShaderPlane';
import { useControls } from 'leva';
import { Vector3 } from 'three';
import MagicBox from './MagicBox';
import { Box, Plane } from '@react-three/drei';

const Scene = () => {
  return (
    <>
      <MagicBox />
      {/* <ShaderPlane
        speed={speed}
        a={new Vector3(a[0], a[1], a[2])}
        b={new Vector3(b[0], b[1], b[2])}
        c={new Vector3(c[0], c[1], c[2])}
      /> */}
      <Plane receiveShadow args={[10, 10]} position={[0, -0.5, 0]} rotation={[Math.PI * -0.5, 0, 0]}>
        <shadowMaterial transparent opacity={0.6} />
        {/* <meshStandardMaterial /> */}
      </Plane>
    </>
  );
};

export default Scene;
