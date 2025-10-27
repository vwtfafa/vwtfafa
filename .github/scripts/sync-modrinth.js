// Import required modules
import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fetch from 'node-fetch';

// Enable better error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const MODRINTH_USERNAME = 'vwtfafa'; // Your Modrinth username
const MODRINTH_API = 'https://api.modrinth.com/v2';
const PROJECTS_DIR = join(__dirname, '../../src/data');
const PROJECTS_FILE = join(PROJECTS_DIR, 'projects.js');

// Get project type from Modrinth project type
function getProjectType(projectType) {
  const types = {
    'mod': 'mod',
    'modpack': 'modpack',
    'plugin': 'plugin',
    'resourcepack': 'resourcepack'
  };
  return types[projectType] || 'other';
}

// Get project status based on last updated date
function getProjectStatus(lastUpdated) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const updatedDate = new Date(lastUpdated);
  return updatedDate > thirtyDaysAgo ? 'active' : 'unsupported';
}

// Format project data for our frontend
function formatProject(project) {
  return {
    id: project.slug || project.id,
    name: project.title,
    type: getProjectType(project.project_type),
    description: project.description,
    longDescription: project.description, // Modrinth doesn't provide a separate long description
    lastUpdated: project.updated || project.published,
    status: getProjectStatus(project.updated || project.published),
    links: {
      modrinth: `https://modrinth.com/${project.project_type}/${project.slug || project.id}`,
      github: project.source_url?.includes('github.com') ? project.source_url : null,
      download: project.downloads_url
    },
    tags: [
      ...(project.versions || []).slice(0, 2), // Show up to 2 Minecraft versions
      ...(project.categories || []).slice(0, 3) // Show up to 3 categories
    ].filter(Boolean)
  };
}

// Main function to sync projects
async function syncModrinthProjects() {
  try {
    console.log('Fetching projects from Modrinth...');
    
    // Get user ID from username
    const userRes = await fetch(`${MODRINTH_API}/user/${MODRINTH_USERNAME}`);
    if (!userRes.ok) {
      const errorText = await userRes.text();
      throw new Error(`Failed to fetch user: ${userRes.status} - ${errorText}`);
    }
    const user = await userRes.json();
    
    console.log(`Fetching projects for user: ${user.username} (${user.id})`);
    
    // Get user's projects with more detailed information
    const projectsRes = await fetch(`${MODRINTH_API}/user/${user.id}/projects`);
    if (!projectsRes.ok) {
      const errorText = await projectsRes.text();
      throw new Error(`Failed to fetch projects: ${projectsRes.status} - ${errorText}`);
    }
    
    const projectIds = await projectsRes.json();
    console.log('Raw project IDs:', projectIds);
    
    if (!Array.isArray(projectIds)) {
      throw new Error(`Expected an array of project IDs, got: ${JSON.stringify(projectIds)}`);
    }
    
    console.log(`Found ${projectIds.length} projects to sync`);
    
    if (projectIds.length === 0) {
      console.log('No projects found for this user');
      return;
    }
    
    // Get detailed project information
    const projects = [];
    
    for (const id of projectIds) {
      try {
        if (typeof id !== 'string') {
          console.error(`Skipping invalid project ID:`, id);
          continue;
        }
        
        console.log(`Fetching details for project ID: ${id}`);
        const projectRes = await fetch(`${MODRINTH_API}/project/${id}`);
        
        if (!projectRes.ok) {
          const errorText = await projectRes.text();
          console.error(`Failed to fetch project ${id}: ${projectRes.status} - ${errorText}`);
          continue;
        }
        
        const projectData = await projectRes.json();
        console.log(`Fetched project: ${projectData.title} (${projectData.id})`);
        projects.push(projectData);
      } catch (err) {
        console.error(`Error processing project ${id}:`, err);
      }
    }
    
    if (projects.length === 0) {
      console.log('No valid projects found to process');
      return;
    }
    
    // Format and sort projects
    const formattedProjects = projects
      .filter(project => {
        const isValid = project && project.id && project.title;
        if (!isValid) {
          console.log('Skipping invalid project:', project);
        }
        return isValid;
      })
      .map(project => {
        try {
          return formatProject(project);
        } catch (err) {
          console.error(`Error formatting project ${project.id}:`, err);
          return null;
        }
      })
      .filter(Boolean);
    
    // Sort by last updated (newest first)
    formattedProjects.sort((a, b) => 
      new Date(b.lastUpdated || 0) - new Date(a.lastUpdated || 0)
    );
    
    console.log(`Successfully processed ${formattedProjects.length} projects`);
    
    // Generate the projects.js file content
    const fileContent = `// Auto-generated by sync-modrinth.js
// Last updated: ${new Date().toISOString()}

const projects = ${JSON.stringify(formattedProjects, null, 2)};

export default projects;`;
    
    // Ensure the directory exists
    try {
      mkdirSync(PROJECTS_DIR, { recursive: true });
      console.log(`Created directory: ${PROJECTS_DIR}`);
    } catch (err) {
      console.error('Error creating projects directory:', err);
      process.exit(1);
    }
    
    // Write to file
    try {
      writeFileSync(PROJECTS_FILE, fileContent);
      console.log(`Successfully updated ${formattedProjects.length} projects in ${PROJECTS_FILE}`);
    } catch (err) {
      console.error('Error writing projects file:', err);
      process.exit(1);
    }
  } catch (error) {
    console.error('Error syncing Modrinth projects:', error);
    process.exit(1);
  }
}

// Run the sync
syncModrinthProjects();
