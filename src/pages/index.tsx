import type { NextPage } from 'next';
import Head from 'next/head';
import { Canvas } from '@react-three/fiber';
import Scene from '../components/Scene';
import { OrbitControls, softShadows, PerspectiveCamera } from '@react-three/drei';
import { useRef } from 'react';
import { Vector3 } from 'three';
import { useStore } from '../helpers/store';
import { animated, useSpring } from '@react-spring/web';
import Block from '../components/Block';
import Logo from '../components/Logo';

softShadows();

const Home: NextPage = () => {
  const camera = useRef<THREE.Camera | null>(null);
  const { isOpen, isActive } = useStore();
  const lightStyle = useSpring({ opacity: isOpen ? 0.9 : 0.0 });
  const textStyle21 = useSpring({ opacity: isActive ? 0.0 : 1.0, height: '50vh' });
  const textStyle22 = useSpring({ opacity: isOpen ? 1.0 : 0.0, height: '30vh' });

  return (
    <div className="">
      <Head>
        <title>Best wishes from GRND CTRL</title>
        <meta name="description" content="2021 - 2022" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="relative w-full h-screen bg-gradient-to-t from-gray-900 via-gray-400 to-gray-100">
        <animated.div className="absolute inset-0 bg-black" style={lightStyle}></animated.div>
        <animated.div className="absolute top-0 left-0 flex items-center justify-center w-screen" style={textStyle21}>
          <div className="flex pt-20">
            <div className="flex flex-col h-full">
              <Block />
            </div>
            <div className="px-6 text-xl text-black uppercase border-current">
              <div className="-mt-2 text-4xl font-bold tracking-tight">Thanks,</div>
              for the all the <br />
              shared memories
              <br />
              of 2021!
            </div>
          </div>
        </animated.div>
        <animated.div className="absolute top-0 right-0 flex justify-end text-right" style={textStyle21}>
          <div className="w-1/6 m-4">
            <Logo />
          </div>
        </animated.div>
        <animated.div className="absolute top-0 left-0 flex items-center justify-center w-screen" style={textStyle22}>
          <div className="flex">
            {/* <div className="flex flex-col justify-end h-full mt-[6px] text-white">
              <Block />
            </div> */}
            <div className="px-6 text-xl text-white uppercase">
              warp-speed to more
              <br /> opportunities in
              <br />
              <div className="text-6xl font-bold">2022</div>
              {/* <div
                className="px-6 mt-4 text-6xl font-bold tracking-tight text-center border-l-4 border-r-4 border-white"
                style={{ height: '0.8em', lineHeight: '0.75em' }}
              >
                2022
              </div> */}
            </div>
            <div className="flex flex-col justify-end h-[16.45vh] text-white">
              <Block />
            </div>
          </div>
        </animated.div>

        <Canvas shadows>
          <PerspectiveCamera ref={camera} makeDefault rotation={[Math.PI * -0.125, 0, 0]} position={[0, 3, 5]} />
          {/* <OrbitControls /> */}
          <Scene />
        </Canvas>
      </main>
    </div>
  );
};

export default Home;
