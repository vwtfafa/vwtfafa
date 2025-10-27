// Import projects data
import projects from '../data/projects.js';

// Global variables
let allProjects = [];
let currentFilter = 'all';
let currentTypeFilter = 'all';

// DOM Elements
const projectsContainer = document.getElementById('projects-container');
const modal = document.getElementById('project-modal');

// Initialize the projects page
function initProjects() {
    // Make projects available globally for filtering
    allProjects = [...projects];
    
    // Initial render
    renderProjects();
    
    // Add event listeners for modals
    document.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// Get Modrinth CDN URL for project icon
function getProjectIcon(projectId, iconUrl) {
    if (iconUrl) {
        // If we have a direct icon URL, use it
        return iconUrl;
    }
    // Fallback to Modrinth's CDN pattern
    return `https://cdn.modrinth.com/data/${projectId}/icon.png`;
}

// Render projects based on current filters
function renderProjects() {
    if (!allProjects || allProjects.length === 0) {
        projectsContainer.innerHTML = `
            <div class="col-span-3 text-center py-12">
                <p class="text-gray-400">No projects found. Check back soon for updates!</p>
            </div>
        `;
        return;
    }
    
    // Filter projects
    let filteredProjects = allProjects.filter(project => {
        const statusMatch = currentFilter === 'all' || project.status === currentFilter;
        const typeMatch = currentTypeFilter === 'all' || project.type === currentTypeFilter;
        return statusMatch && typeMatch;
    });
    
    if (filteredProjects.length === 0) {
        projectsContainer.innerHTML = `
            <div class="col-span-3 text-center py-12">
                <p class="text-gray-400">No projects match the current filters.</p>
            </div>
        `;
        return;
    }
    
    // Render projects
    projectsContainer.innerHTML = filteredProjects.map(project => `
        <div class="project-card relative bg-gray-800 rounded-lg overflow-hidden shadow-lg border-l-4 ${
            project.status === 'active' ? 'border-green-500' : 
            project.status === 'unsupported' ? 'border-yellow-500' : 'border-red-500'
        }">
            <div class="p-6">
                <!-- Status Badge -->
                <span class="status-badge status-${project.status}">
                    ${project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
                
                <!-- Type Badge -->
                    ${project.type.charAt(0).toUpperCase() + project.type.slice(1)}
                </span>
                
                <!-- Project Info -->
                <div class="text-center pt-2">
                    <h3 class="text-lg font-bold text-white mb-2 truncate">${project.name}</h3>
                    <p class="text-gray-300 text-sm mb-4 line-clamp-2">${project.description || 'No description available.'}</p>
                    <div class="flex justify-between items-center">
                        <div class="flex items-center text-sm text-gray-400">
                            <i class="fas fa-calendar-alt mr-1"></i>
                            ${project.lastUpdated ? new Date(project.lastUpdated).toLocaleDateString() : 'N/A'}
                        </div>
                        <div class="flex space-x-2">
                            ${project.source_url ? `
                            <a href="${project.source_url}" 
                               target="_blank" 
                               rel="noopener noreferrer"
                               class="p-2 text-gray-300 hover:text-white"
                               title="Source Code">
                                <i class="fab fa-github"></i>
                            </a>
                            ` : ''}
                            <button onclick="showProjectDetails('${project.id}')" 
                                    class="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm">
                                Details
                            </button>
                        </div>
                    </div>
                </div>
                    Updated: ${new Date(project.lastUpdated).toLocaleDateString()}
                </div>
            </div>
        </div>
    `).join('');
}

// Show project details in modal
function showProjectDetails(projectId) {
    const project = allProjects.find(p => p.id === projectId);
    if (!project) return;
    
    const modal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    
    // Get project icon URL
    const iconUrl = getProjectIcon(project.id, project.icon_url);
    const status = project.status || 'inactive';
    const type = project.type || 'mod';
    
    // Status badge styles
    const statusStyles = {
        'active': 'bg-green-500',
        'maintenance': 'bg-yellow-500',
        'inactive': 'bg-gray-500',
        'abandoned': 'bg-red-500',
        'draft': 'bg-blue-500'
    };
    
    // Set modal title
    modalTitle.textContent = project.name;
    
    // Create modal content
    modalContent.innerHTML = `
        <div class="space-y-6">
            <!-- Header with icon and basic info -->
            <div class="flex items-start space-x-4">
                ${iconUrl ? `
                <img src="${iconUrl}" 
                     alt="${project.name}" 
                     class="w-16 h-16 rounded-lg object-cover"
                     onerror="this.onerror=null; this.src='https://cdn.modrinth.com/placeholder.svg';">
                ` : `
                <div class="w-16 h-16 rounded-lg bg-gray-700 flex items-center justify-center">
                    <i class="fas fa-cube text-2xl text-gray-500"></i>
                </div>
                `}
                
                <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-1">
                        <span class="px-2 py-1 text-xs rounded-full ${statusStyles[status] || 'bg-gray-500'}">
                            ${status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                        <span class="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded-full">
                            ${type.charAt(0).toUpperCase() + type.slice(1)}
                        </span>
                    </div>
                    <p class="text-sm text-gray-400">
                        Last updated: ${project.lastUpdated ? new Date(project.lastUpdated).toLocaleDateString() : 'N/A'}
                    </p>
                </div>
            </div>
            
            <!-- Description -->
            <div>
                <h3 class="text-lg font-semibold text-white mb-2">Description</h3>
                <p class="text-gray-300 whitespace-pre-line">${project.longDescription || project.description || 'No description available.'}</p>
            </div>
            
            <!-- Stats -->
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                ${project.downloads ? `
                <div class="bg-gray-800 p-4 rounded-lg">
                    <p class="text-sm text-gray-400">Downloads</p>
                    <p class="text-xl font-bold text-white">${project.downloads.toLocaleString()}</p>
                </div>
                ` : ''}
                
                ${project.followers ? `
                <div class="bg-gray-800 p-4 rounded-lg">
                    <p class="text-sm text-gray-400">Followers</p>
                    <p class="text-xl font-bold text-white">${project.followers.toLocaleString()}</p>
                </div>
                ` : ''}
                
                ${project.versions ? `
                <div class="bg-gray-800 p-4 rounded-lg">
                    <p class="text-sm text-gray-400">Versions</p>
                    <p class="text-xl font-bold text-white">${project.versions.length}</p>
                </div>
                ` : ''}
            </div>
            
            <!-- Links -->
            <div class="space-y-3">
                <h3 class="text-lg font-semibold text-white">Links</h3>
                <div class="flex flex-wrap gap-2">
                    <a href="https://modrinth.com/${type}/${project.id}" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       class="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors">
                        <i class="fas fa-external-link-alt mr-2"></i> View on Modrinth
                    </a>
                    
                    ${project.source_url ? `
                    <a href="${project.source_url}" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       class="inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors">
                        <i class="fab fa-github mr-2"></i> Source Code
                    </a>
                    ` : ''}
                    
                    ${project.issues_url ? `
                    <a href="${project.issues_url}" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       class="inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors">
                        <i class="fas fa-bug mr-2"></i> Report Issue
                    </a>
                    ` : ''}
                    
                    ${project.wiki_url ? `
                    <a href="${project.wiki_url}" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       class="inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors">
                        <i class="fas fa-book mr-2"></i> Wiki
                    </a>
                    ` : ''}
                </div>
            </div>
            
            <!-- Versions -->
            ${project.versions && project.versions.length > 0 ? `
            <div class="space-y-3">
                <h3 class="text-lg font-semibold text-white">Latest Versions</h3>
                <div class="bg-gray-800 rounded-lg overflow-hidden">
                    <table class="min-w-full divide-y divide-gray-700">
                        <thead class="bg-gray-700">
                            <tr>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Version</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Minecraft</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Downloads</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-700">
                            ${project.versions.slice(0, 5).map(version => {
                                // Extract Minecraft versions from game_versions array
                                const minecraftVersions = version.game_versions ? version.game_versions.join(', ') : 'N/A';
                                const firstVersion = version.game_versions && version.game_versions.length > 0 
                                    ? version.game_versions[0] + 
                                      (version.game_versions.length > 1 ? ` +${version.game_versions.length - 1}` : '')
                                    : 'N/A';
                                
                                return `
                                <tr>
                                    <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">
                                        ${version.version_number}
                                    </td>
                                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-300" title="${minecraftVersions}">
                                        ${firstVersion}
                                    </td>
                                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                                        <span class="px-2 py-1 text-xs rounded-full ${
                                            version.version_type === 'release' ? 'bg-green-500' : 
                                            version.version_type === 'beta' ? 'bg-yellow-500' : 'bg-blue-500'
                                        }">
                                            ${version.version_type}
                                        </span>
                                    </td>
                                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                                        ${version.date_published ? new Date(version.date_published).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                                        ${version.downloads ? version.downloads.toLocaleString() : 'N/A'}
                                    </td>
                                </tr>`;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
                ${project.versions.length > 5 ? `
                <div class="text-right">
                    <a href="https://modrinth.com/${type}/${project.id}/versions" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       class="text-sm text-indigo-400 hover:text-indigo-300">
                        View all ${project.versions.length} versions <i class="fas fa-arrow-right ml-1"></i>
                    </a>
                </div>
                ` : ''}
            </div>
            ` : ''}
        </div>
    `;
    
    // Show modal
    document.body.style.overflow = 'hidden';
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
}

// Close modal
window.closeModal = function() {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

// Filter projects by status
window.filterProjects = function(status) {
    currentFilter = status;
    renderProjects();
    
    // Update active filter button
    document.querySelectorAll('#projects button').forEach(btn => {
        if (btn.textContent.toLowerCase().includes(status) || 
            (status === 'all' && btn.textContent.toLowerCase().includes('all'))) {
            btn.classList.remove('bg-gray-700');
            btn.classList.add('bg-indigo-600');
        } else {
            btn.classList.remove('bg-indigo-600');
            btn.classList.add('bg-gray-700');
        }
    });
}

// Filter projects by type
function filterByType(type) {
    currentTypeFilter = type;
    renderProjects();
    
    // Update active type button
    document.querySelectorAll('#projects-container ~ div ~ div button').forEach(btn => {
        btn.classList.remove('bg-indigo-600', 'text-white');
        btn.classList.add('bg-gray-700', 'text-gray-200');
    });
    
    const activeBtn = document.querySelector(`button[onclick="filterByType('${type}')"]`);
    if (activeBtn) {
        activeBtn.classList.remove('bg-gray-700', 'text-gray-200');
        activeBtn.classList.add('bg-indigo-600', 'text-white');
    }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProjects);
} else {
    initProjects();
}

// Make functions available globally
window.showProjectDetails = showProjectDetails;
window.closeModal = closeModal;
window.filterProjects = filterProjects;
window.filterByType = filterByType;
