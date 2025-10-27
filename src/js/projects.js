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
                <span class="type-badge type-${project.type}">
                    ${project.type.charAt(0).toUpperCase() + project.type.slice(1)}
                </span>
                
                <!-- Project Info -->
                <div class="text-center pt-2">
                    <h3 class="text-xl font-bold text-white mb-2">${project.name}</h3>
                    <p class="text-gray-300 text-sm h-12 overflow-hidden">${project.description}</p>
                </div>
                
                <!-- Tags -->
                <div class="mt-4 flex flex-wrap justify-center gap-2">
                    ${project.tags.slice(0, 3).map(tag => `
                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-200">
                            ${tag}
                        </span>
                    `).join('')}
                    ${project.tags.length > 3 ? '<span class="text-xs text-gray-500">+' + (project.tags.length - 3) + ' more</span>' : ''}
                </div>
                
                <!-- Action Buttons -->
                <div class="mt-6 flex flex-wrap justify-center gap-2">
                    <button onclick="showProjectDetails('${project.id}')" class="flex-1 px-3 py-1.5 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                        View Details
                    </button>
                    ${project.links.modrinth ? `
                        <a href="${project.links.modrinth}" target="_blank" rel="noopener noreferrer" class="flex-1 px-3 py-1.5 text-center text-sm font-medium rounded-md text-white bg-gray-700 hover:bg-gray-600">
                            Modrinth
                        </a>
                    ` : ''}
                </div>
                
                <div class="mt-3 text-xs text-center text-gray-400">
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
    
    // Update modal content
    document.getElementById('modal-title').textContent = project.name;
    document.getElementById('modal-description').textContent = project.description;
    document.getElementById('modal-long-description').textContent = project.longDescription || project.description;
    document.getElementById('modal-updated').textContent = new Date(project.lastUpdated).toLocaleDateString();
    
    // Update type badge
    const typeBadge = document.getElementById('modal-type');
    typeBadge.textContent = project.type.charAt(0).toUpperCase() + project.type.slice(1);
    typeBadge.className = 'inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ' + `type-${project.type}`;
    
    // Update tags
    const tagsContainer = document.getElementById('modal-tags');
    tagsContainer.innerHTML = project.tags.map(tag => `
        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-200">
            ${tag}
        </span>
    `).join('');
    
    // Update links
    const linksContainer = document.getElementById('modal-links');
    linksContainer.innerHTML = '';
    
    if (project.links.modrinth) {
        linksContainer.innerHTML += `
            <a href="${project.links.modrinth}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                <i class="fab fa-modrinth mr-2"></i> View on Modrinth
            </a>
        `;
    }
    
    if (project.links.github) {
        linksContainer.innerHTML += `
            <a href="${project.links.github}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-white bg-gray-700 hover:bg-gray-600">
                <i class="fab fa-github mr-2"></i> Source Code
            </a>
        `;
    }
    
    if (project.links.download) {
        linksContainer.innerHTML += `
            <a href="${project.links.download}" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                <i class="fas fa-download mr-2"></i> Download
            </a>
        `;
    }
    
    // Show modal
    document.body.style.overflow = 'hidden';
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
}

// Close modal
function closeModal() {
    document.body.style.overflow = 'auto';
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
}

// Filter projects by status
function filterProjects(status) {
    currentFilter = status;
    renderProjects();
    
    // Update active filter button
    document.querySelectorAll('#projects-container ~ div button').forEach(btn => {
        btn.classList.remove('bg-indigo-600', 'text-white');
        btn.classList.add('bg-gray-700', 'text-gray-200');
    });
    
    const activeBtn = document.querySelector(`button[onclick="filterProjects('${status}')"]`);
    if (activeBtn) {
        activeBtn.classList.remove('bg-gray-700', 'text-gray-200');
        activeBtn.classList.add('bg-indigo-600', 'text-white');
    }
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
