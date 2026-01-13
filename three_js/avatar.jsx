import { Canvas } from "@react-three/fiber";
import { useGLTF, Float } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";
import gsap from "gsap";

// --------------------------------------------------------
// Optimized Boy Component
// --------------------------------------------------------
function Boy(props) {
    const group = useRef();
    const [isIntroAnimationDone, setIsIntroAnimationDone] = useState(false);

    // Load the model ONCE
    const { scene, materials } = useGLTF("/models/boy-transformed.glb");

    // Clone the entire scene properly to preserve skeleton hierarchy
    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);

    // Get nodes from cloned scene
    const nodes = useMemo(() => {
        const nodeMap = {};
        clone.traverse((child) => {
            if (child.isMesh || child.isBone) {
                nodeMap[child.name] = child;
            }
        });
        // Debug: Log available nodes
        console.log("Available nodes:", Object.keys(nodeMap));
        return nodeMap;
    }, [clone]);

    // Intro Animation - only runs once
    useEffect(() => {
        if (!group.current || !nodes.Hips) return;

        const tl = gsap.timeline({
            onComplete: () => setIsIntroAnimationDone(true)
        });

        tl.from(group.current.rotation, {
            y: Math.PI,
            duration: 1.5,
            ease: "power2.out",
        });
    }, [nodes]);

    // Waving Hand Animation - DISABLED
    // useEffect(() => {
    //     if (!isIntroAnimationDone || !nodes.RightHand || !nodes.RightShoulder || !nodes.RightArm || !nodes.RightForeArm || !nodes.Hips) return;

    //     console.log("Starting wave animation with bones:", {
    //         shoulder: nodes.RightShoulder,
    //         arm: nodes.RightArm,
    //         forearm: nodes.RightForeArm,
    //         hand: nodes.RightHand
    //     });

    //     // Wait a moment after intro, then wave
    //     const waveDelay = setTimeout(() => {
    //         const tl = gsap.timeline({ repeat: 2 }); // Wave 3 times total

    //         // Subtle body lean for natural movement
    //         tl.to(nodes.Hips.rotation, {
    //             z: -0.08, // Slight lean toward waving side
    //             duration: 0.5,
    //             ease: "power2.out"
    //         }, 0);

    //         // Lift arm at 45-degree angle (not straight up!)
    //         tl.to(nodes.RightShoulder.rotation, {
    //             x: -0.3,  // Much less forward lift (was -0.8)
    //             y: 0.0,   // No side rotation
    //             z: 1.2,   // Main lift - outward to the side (increased from 0.5)
    //             duration: 0.5,
    //             ease: "power2.out"
    //         }, 0);

    //         // Bend the forearm naturally
    //         tl.to(nodes.RightForeArm.rotation, {
    //             x: -1.3,  // Nice elbow bend (increased from -1.0)
    //             y: 0.2,   // Slight rotation for natural look
    //             duration: 0.5,
    //             ease: "power2.out"
    //         }, 0);

    //         // Slight wrist adjustment for natural hand position
    //         tl.to(nodes.RightHand.rotation, {
    //             x: 0.1,  // Slight tilt
    //             duration: 0.5,
    //             ease: "power2.out"
    //         }, 0);

    //         // Wave the hand back and forth - smoother and smaller
    //         tl.to(nodes.RightHand.rotation, {
    //             z: 0.4, // Gentle wave right
    //             duration: 0.3,
    //             ease: "sine.inOut"
    //         }, 0.5)
    //             .to(nodes.RightHand.rotation, {
    //                 z: -0.4, // Gentle wave left
    //                 duration: 0.3,
    //                 ease: "sine.inOut"
    //             })
    //             .to(nodes.RightHand.rotation, {
    //                 z: 0.4, // Wave right again
    //                 duration: 0.3,
    //                 ease: "sine.inOut"
    //             })
    //             .to(nodes.RightHand.rotation, {
    //                 x: 0.1,
    //                 z: 0, // Return to neutral
    //                 duration: 0.3,
    //                 ease: "sine.inOut"
    //             });

    //         // Return hand to neutral
    //         tl.to(nodes.RightHand.rotation, {
    //             x: 0,
    //             duration: 0.5,
    //             ease: "power2.in"
    //         }, "+=0.05");

    //         // Lower forearm
    //         tl.to(nodes.RightForeArm.rotation, {
    //             x: 0,
    //             y: 0,
    //             duration: 0.5,
    //             ease: "power2.in"
    //         }, "-=0.3");

    //         // Lower shoulder - return to rest position
    //         tl.to(nodes.RightShoulder.rotation, {
    //             x: 0,
    //             y: 0,
    //             z: 0,
    //             duration: 0.5,
    //             ease: "power2.in"
    //         }, "-=0.4");

    //         // Return body to neutral
    //         tl.to(nodes.Hips.rotation, {
    //             z: 0,
    //             duration: 0.5,
    //             ease: "power2.in"
    //         }, "-=0.3");

    //     }, 500); // Start 500ms after intro completes

    //     return () => clearTimeout(waveDelay);
    // }, [isIntroAnimationDone, nodes]);

    // Optimized Mouse Tracking with RAF and lerp - HEAD ONLY
    useEffect(() => {
        if (!isIntroAnimationDone || !group.current) return;

        let rafId;
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;
        let headBone = null;

        // Find the head bone once
        headBone = nodes.Head; // Use the bone, not the mesh

        if (!headBone) {
            console.warn("Head bone not found!");
            return;
        }

        console.log("Head bone found:", headBone);

        const handleMouseMove = (event) => {
            // Normalize mouse position to -1 to 1 range
            targetX = (event.clientX / window.innerWidth) * 2 - 1;
            targetY = -(event.clientY / window.innerHeight) * 2 + 1;
        };

        const animate = () => {
            // Smooth lerp for better performance
            mouseX += (targetX - mouseX) * 0.1;
            mouseY += (targetY - mouseY) * 0.1;

            if (headBone) {
                // Head follows cursor - constrained for natural movement
                headBone.rotation.y = mouseX * 0.6; // Left/Right
                headBone.rotation.x = -mouseY * 0.4; // Up/Down (negative for natural look)
                headBone.rotation.z = mouseX * 0.1; // Slight tilt for realism
            }

            rafId = requestAnimationFrame(animate);
        };

        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        rafId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(rafId);
        };
    }, [isIntroAnimationDone, nodes]);

    if (!nodes.Hips) return null;

    return (
        <group {...props} ref={group} dispose={null}>
            <primitive object={nodes.Hips} />

            {/* Hair */}
            {nodes.Wolf3D_Hair && (
                <skinnedMesh
                    geometry={nodes.Wolf3D_Hair.geometry}
                    material={materials.Wolf3D_Hair}
                    skeleton={nodes.Wolf3D_Hair.skeleton}
                />
            )}

            {/* Glasses */}
            {nodes.Wolf3D_Glasses && (
                <skinnedMesh
                    geometry={nodes.Wolf3D_Glasses.geometry}
                    material={materials.Wolf3D_Glasses}
                    skeleton={nodes.Wolf3D_Glasses.skeleton}
                />
            )}

            {/* Outfit Bottom */}
            {nodes.Wolf3D_Outfit_Bottom && (
                <skinnedMesh
                    geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
                    material={materials.Wolf3D_Outfit_Bottom}
                    skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
                />
            )}

            {/* Outfit Footwear */}
            {nodes.Wolf3D_Outfit_Footwear && (
                <skinnedMesh
                    geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
                    material={materials.Wolf3D_Outfit_Footwear}
                    skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
                />
            )}

            {/* Outfit Top */}
            {nodes.Wolf3D_Outfit_Top && (
                <skinnedMesh
                    geometry={nodes.Wolf3D_Outfit_Top.geometry}
                    material={materials.Wolf3D_Outfit_Top}
                    skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
                />
            )}

            {/* Eye Left */}
            {nodes.EyeLeft && (
                <skinnedMesh
                    name="EyeLeft"
                    geometry={nodes.EyeLeft.geometry}
                    material={materials.Wolf3D_Eye}
                    skeleton={nodes.EyeLeft.skeleton}
                    morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
                    morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
                />
            )}

            {/* Eye Right */}
            {nodes.EyeRight && (
                <skinnedMesh
                    name="EyeRight"
                    geometry={nodes.EyeRight.geometry}
                    material={materials.Wolf3D_Eye}
                    skeleton={nodes.EyeRight.skeleton}
                    morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
                    morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
                />
            )}

            {/* Head */}
            {nodes.Wolf3D_Head && (
                <skinnedMesh
                    name="Wolf3D_Head"
                    geometry={nodes.Wolf3D_Head.geometry}
                    material={materials.Wolf3D_Skin}
                    skeleton={nodes.Wolf3D_Head.skeleton}
                    morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
                    morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
                />
            )}

            {/* Teeth */}
            {nodes.Wolf3D_Teeth && (
                <skinnedMesh
                    name="Wolf3D_Teeth"
                    geometry={nodes.Wolf3D_Teeth.geometry}
                    material={materials.Wolf3D_Teeth}
                    skeleton={nodes.Wolf3D_Teeth.skeleton}
                    morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
                    morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
                />
            )}
        </group>
    );
}

// Preload the model for faster initial load
useGLTF.preload("/models/boy-transformed.glb");

// --------------------------------------------------------
// Main Scene Component with Performance Optimizations
// --------------------------------------------------------
export default function AvatarScene() {
    const [responsiveSettings, setResponsiveSettings] = useState({
        cameraPosition: [0, 0.3, 3.5],
        cameraFov: 45,
        avatarScale: 1.8,
        avatarY: -2.2
    });

    // Responsive adjustments based on screen size
    useEffect(() => {
        const updateResponsiveSettings = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const isMobile = width < 768;
            const isTablet = width >= 768 && width < 1024;

            if (isMobile) {
                // Mobile: Show only upper half body, positioned lower
                setResponsiveSettings({
                    cameraPosition: [0, 0.8, 2.5],   // Higher camera angle, closer
                    cameraFov: 50,                   // Wider FOV
                    avatarScale: 2.2,                // Larger scale
                    avatarY: -3.4                    // 20% lower (show even less body)
                });
            } else if (isTablet) {
                // Tablet: Medium settings
                setResponsiveSettings({
                    cameraPosition: [0, 0.5, 3.0],
                    cameraFov: 47,
                    avatarScale: 2.0,
                    avatarY: -2.4
                });
            } else {
                // Desktop: Original settings
                setResponsiveSettings({
                    cameraPosition: [0, 0.3, 3.5],
                    cameraFov: 45,
                    avatarScale: 1.8,
                    avatarY: -2.2
                });
            }
        };

        updateResponsiveSettings();
        window.addEventListener('resize', updateResponsiveSettings);
        return () => window.removeEventListener('resize', updateResponsiveSettings);
    }, []);

    return (
        <div style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>
            <Canvas
                camera={{
                    position: responsiveSettings.cameraPosition,
                    fov: responsiveSettings.cameraFov
                }}
                dpr={[1, 2]} // Limit pixel ratio for performance
                performance={{ min: 0.5 }} // Allow framerate to drop if needed
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance"
                }}
                style={{ pointerEvents: 'none' }}
            >
                {/* Optimized Lighting */}
                <ambientLight intensity={0.8} />
                <directionalLight
                    position={[-2, 2, 3]}
                    intensity={2}
                    color="#FF28D5"
                    castShadow={false}
                />
                <directionalLight
                    position={[2, 2, 3]}
                    intensity={2}
                    color="#1C34FF"
                    castShadow={false}
                />

                {/* Optimized Float Effect */}
                <Float
                    speed={1.5}
                    rotationIntensity={0.3}
                    floatIntensity={0.4}
                >
                    <group position={[0, responsiveSettings.avatarY, 0]}>
                        <Boy scale={responsiveSettings.avatarScale} />
                    </group>
                </Float>
            </Canvas>
        </div>
    );
}