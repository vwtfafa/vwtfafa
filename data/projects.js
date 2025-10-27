// Projects data for Minecraft showcase
const projects = [
  {
    id: 'compasstrack',
    name: 'CompassTrack',
    type: 'plugin',
    description: 'Track players and locations with a simple compass interface',
    longDescription: 'CompassTrack is a lightweight Bukkit/Spigot plugin that allows players to track other players or set locations using a compass. Perfect for PvP servers or survival gameplay.',
    lastUpdated: '2023-10-20',
    status: 'active',
    links: {
      modrinth: 'https://modrinth.com/plugin/compasstrack',
      github: 'https://github.com/yourusername/compasstrack',
      download: '#'
    },
    tags: ['spigot', 'bukkit', 'pvp', '1.8-1.20']
  },
  {
    id: 'craft-attack-13',
    name: 'Craft Attack 13',
    type: 'modpack',
    description: 'The 13th season of the popular Craft Attack modpack series',
    longDescription: 'Craft Attack 13 is a carefully curated modpack featuring the best mods for an enhanced survival experience. Includes tech, magic, and adventure mods all balanced for optimal gameplay.',
    lastUpdated: '2023-10-15',
    status: 'active',
    links: {
      modrinth: 'https://modrinth.com/modpack/craft-attack-13',
      github: 'https://github.com/yourusername/craft-attack-13',
      download: '#'
    },
    tags: ['modpack', '1.19.2', 'fabric']
  },
  {
    id: 'lock-end',
    name: 'Lock-End',
    type: 'plugin',
    description: 'Secure your world border with customizable end portal locking',
    longDescription: 'Lock-End is a server plugin that allows you to control access to The End dimension. Perfect for RPG or progression-based servers where you want to gate content.',
    lastUpdated: '2023-09-28',
    status: 'active',
    links: {
      modrinth: 'https://modrinth.com/plugin/lock-end',
      github: 'https://github.com/yourusername/lock-end',
      download: '#'
    },
    tags: ['spigot', 'bukkit', 'rpg', '1.16-1.20']
  },
  {
    id: 'simple-backpack',
    name: 'Simple Backpack',
    type: 'plugin',
    description: 'Lightweight backpack plugin with minimal configuration',
    longDescription: 'Simple Backpack adds configurable backpacks to your server without the bloat. Features include multiple backpack sizes, permissions, and economy support.',
    lastUpdated: '2023-10-10',
    status: 'active',
    links: {
      modrinth: 'https://modrinth.com/plugin/simple-backpack',
      github: 'https://github.com/yourusername/simple-backpack',
      download: '#'
    },
    tags: ['spigot', 'bukkit', 'utility', '1.8-1.20']
  },
  {
    id: 'streamertools',
    name: 'StreamerTools',
    type: 'mod',
    description: 'Essential tools for Minecraft streamers and content creators',
    longDescription: 'StreamerTools is a Fabric mod that adds various quality-of-life features for streamers, including customizable HUD elements, quick commands, and stream integration features.',
    lastUpdated: '2023-10-25',
    status: 'active',
    links: {
      modrinth: 'https://modrinth.com/mod/streamertools',
      github: 'https://github.com/yourusername/streamertools',
      download: '#'
    },
    tags: ['fabric', 'qol', '1.19+']
  }
];

// Function to update project status based on last updated date
function updateProjectStatus() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  projects.forEach(project => {
    const lastUpdated = new Date(project.lastUpdated);
    if (lastUpdated < thirtyDaysAgo && project.status !== 'archived') {
      project.status = 'unsupported';
    }
  });
}

// Initialize project statuses
updateProjectStatus();

export default projects;
