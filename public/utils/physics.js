const physics = {
    gravity: 0.001,
    moveAccel: 0.001, // velocity change per tick
    airControl: 0.25,
    friction: 0.1, // percent slowed per tick
    airRes: 0.01, // percent slowed per tick
    speedCap: 0.025,
    jumpVelocity: 0.05,
}

const settings = {
    startingBlocks: 12,
    generateDist: 12,
    blockSpeed: 0.025, // ratio of appearing blocks
    blockGenTickRate: 15,
    blockChance: 0.8,
    blockMarginError: 0.00001,
}
