import { world, system } from "@minecraft/server";

world.afterEvents.itemUse.subscribe((event) => {
  const player = event.source;
  const itemStack = event.itemStack;

  if (!player || !itemStack || itemStack.typeId !== "wand:fire_wand") {
    return;
  }

  // Get head location and view direction
  const headLoc = player.getHeadLocation();
  const viewDir = player.getViewDirection();

  // Spawn small fireball slightly ahead
  const spawnLoc = {
    x: headLoc.x + viewDir.x * 0.5,
    y: headLoc.y + viewDir.y * 0.5,
    z: headLoc.z + viewDir.z * 0.5
  };

  const fireball = player.dimension.spawnEntity("minecraft:small_fireball", spawnLoc);

  // Set velocity (speed 2.0, slight upward bias for arc)
  const speed = 2.0;
  fireball.setVelocity({
    x: viewDir.x * speed,
    y: viewDir.y * speed + 0.1,
    z: viewDir.z * speed
  });

  // Fire charge use sound & particles
  player.playSound("item.fire_charge.use");
  player.dimension.spawnParticle("minecraft:large_smoke", spawnLoc);

  // Optional: flame trail (spawn multiple along direction)
  for (let i = 0; i < 5; i++) {
    system.runTimeout(() => {
      const trailLoc = {
        x: spawnLoc.x + viewDir.x * i * 0.3,
        y: spawnLoc.y + viewDir.y * i * 0.3,
        z: spawnLoc.z + viewDir.z * i * 0.3
      };
      player.dimension.spawnParticle("minecraft:flame_particle", trailLoc);
    }, i * 2);
  }
});