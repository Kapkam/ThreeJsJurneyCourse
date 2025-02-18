import * as THREE from 'three'

/**
 * Textures
*/
const textureLoader = new THREE.TextureLoader()

// Floor
export const floorAlphaTexture = textureLoader.load('./floor/alpha.webp')
// Textures A
export const floorColorTexture = textureLoader.load('./floor/rocky_terrain_1k/rocky_terrain_diff_1k.webp')
export const floorARMTexture = textureLoader.load('./floor/rocky_terrain_1k/rocky_terrain_arm_1k.webp')
export const floorNormalTexture = textureLoader.load('./floor/rocky_terrain_1k/rocky_terrain_nor_gl_1k.webp')
export const floorDisplacementTexture = textureLoader.load('./floor/rocky_terrain_1k/rocky_terrain_disp_1k.webp')

// Textures B
// export const floorColorTexture = textureLoader.load('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.webp')
// export const floorARMTexture = textureLoader.load('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.webp')
// export const floorNormalTexture = textureLoader.load('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.webp')
// export const floorDisplacementTexture = textureLoader.load('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.webp')

// SRGB (only for color textures)
floorColorTexture.encoding = THREE.sRGBEncoding

// Repeat textures
floorColorTexture.repeat.set(8, 8)
floorColorTexture.wrapS = THREE.RepeatWrapping
floorColorTexture.wrapT = THREE.RepeatWrapping

floorARMTexture.repeat.set(8, 8)
floorARMTexture.wrapS = THREE.RepeatWrapping
floorARMTexture.wrapT = THREE.RepeatWrapping

floorNormalTexture.repeat.set(8, 8)
floorNormalTexture.wrapS = THREE.RepeatWrapping
floorNormalTexture.wrapT = THREE.RepeatWrapping

floorDisplacementTexture.repeat.set(8, 8)
floorDisplacementTexture.wrapS = THREE.RepeatWrapping
floorDisplacementTexture.wrapT = THREE.RepeatWrapping

// Wall
// Texture A
// export const wallColorTexture = textureLoader.load('./wall/wood_trunk_wall_1k/wood_trunk_wall_diff_1k.jpg')
// export const wallARMTexture = textureLoader.load('./wall/wood_trunk_wall_1k/wood_trunk_wall_arm_1k.jpg')
// export const wallNormalTexture = textureLoader.load('./wall/wood_trunk_wall_1k/wood_trunk_wall_nor_gl_1k.jpg')
// export const wallDisplacementTexture = textureLoader.load('./wall/wood_trunk_wall_1k/wood_trunk_wall_disp_1k.jpg')

// Texture B
export const wallColorTexture = textureLoader.load('./wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.webp')
export const wallARMTexture = textureLoader.load('./wall/castle_brick_broken_06_1k/castle_brick_broken_06_arm_1k.webp')
export const wallNormalTexture = textureLoader.load('./wall/castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.webp')
export const wallDisplacementTexture = textureLoader.load('./wall/castle_brick_broken_06_1k/castle_brick_broken_06_disp_1k.webp')

// SRGB (only for color textures)
wallColorTexture.encoding = THREE.sRGBEncoding

// Roof
// Texture A
// export const roofColorTexture = textureLoader.load('./roof/clay_roof_tiles_1k/clay_roof_tiles_diff_1k.jpg')
// export const roofARMTexture = textureLoader.load('./roof/clay_roof_tiles_1k/clay_roof_tiles_arm_1k.jpg')
// export const roofNormalTexture = textureLoader.load('./roof/clay_roof_tiles_1k/clay_roof_tiles_nor_gl_1k.jpg')
// export const roofDisplacementTexture = textureLoader.load('./roof/clay_roof_tiles_1k/clay_roof_tiles_disp_1k.jpg')

// Texture B
export const roofColorTexture = textureLoader.load('./roof/roof_slates_02_1k/roof_slates_02_diff_1k.webp')
export const roofARMTexture = textureLoader.load('./roof/roof_slates_02_1k/roof_slates_02_arm_1k.webp')
export const roofNormalTexture = textureLoader.load('./roof/roof_slates_02_1k/roof_slates_02_nor_gl_1k.webp')
export const roofDisplacementTexture = textureLoader.load('./roof/roof_slates_02_1k/roof_slates_02_disp_1k.webp')

// SRGB (only for color textures)
roofColorTexture.encoding = THREE.sRGBEncoding

// Repeat textures
roofColorTexture.repeat.set(3, 1)
roofColorTexture.wrapS = THREE.RepeatWrapping

roofARMTexture.repeat.set(3, 1)
roofARMTexture.wrapS = THREE.RepeatWrapping

roofNormalTexture.repeat.set(3, 1)
roofNormalTexture.wrapS = THREE.RepeatWrapping

roofDisplacementTexture.repeat.set(3, 1)
roofDisplacementTexture.wrapS = THREE.RepeatWrapping

// Bush
export const bushColorTexture = textureLoader.load('./bush/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.webp')
export const bushARMTexture = textureLoader.load('./bush/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.webp')
export const bushNormalTexture = textureLoader.load('./bush/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.webp')

// SRGB (only for color textures)
bushColorTexture.colorSpace = THREE.SRGBColorSpace

// Graves
export const graveColorTexture = textureLoader.load('./grave/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.webp')
export const graveARMTexture = textureLoader.load('./grave/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.webp')
export const graveNormalTexture = textureLoader.load('./grave/plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.webp')

// SRGB (only for color textures)
graveColorTexture.encoding = THREE.sRGBEncoding

// Repeat textures
graveColorTexture.repeat.set(.3, .4)
graveARMTexture.repeat.set(.3, .4)
graveNormalTexture.repeat.set(.3, .4)

// Door
export const doorColorTexture = textureLoader.load('./door/color.webp')
export const doorAlphaTexture = textureLoader.load('./door/alpha.webp')
export const doorAmbientOcclusionTexture = textureLoader.load('./door/ambientOcclusion.webp')
export const doorHeightTexture = textureLoader.load('./door/height.webp')
export const doorNormalTexture = textureLoader.load('./door/normal.webp')
export const doorMetalnessTexture = textureLoader.load('./door/metalness.webp')
export const doorRoughnessTexture = textureLoader.load('./door/roughness.webp')

doorColorTexture.colorSpace = THREE.SRGBColorSpace