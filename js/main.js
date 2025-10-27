// Load Minecraft Projects Component
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load Minecraft Projects
        const projectsResponse = await fetch('components/minecraft-projects.html');
        if (!projectsResponse.ok) throw new Error('Projects component not found');
        const projectsHTML = await projectsResponse.text();
        document.getElementById('minecraft-projects').innerHTML = projectsHTML;

        // Load and execute the projects module
        const script = document.createElement('script');
        script.type = 'module';
        script.textContent = `
            import projects from '../data/projects.js';
            
            function renderProjects() {
                const container = document.getElementById('projects-container');
                
                if (!projects || projects.length === 0) {
                    container.innerHTML = `
                        <div class="col-span-3 text-center py-12">
                            <p class="text-gray-400">No projects found. Check back soon for updates!</p>
                        </div>
                    `;
                    return;
                }

                container.innerHTML = projects.map(project => `
                    <div class="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition-all hover:scale-105 hover:shadow-2xl border-l-4 ${
                        project.status === 'active' ? 'border-green-500' : 
                        project.status === 'unsupported' ? 'border-yellow-500' : 'border-red-500'
                    }">
                        <div class="p-6">
                            <div class="flex justify-between items-start">
                                <h3 class="text-xl font-bold text-white">${project.name}</h3>
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    project.status === 'active' ? 'bg-green-100 text-green-800' : 
                                    project.status === 'unsupported' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                }">
                                    ${project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                                </span>
                            </div>
                            
                            <p class="mt-2 text-gray-300">${project.description}</p>
                            
                            <div class="mt-4 flex flex-wrap gap-2">
                                ${project.tags.map(tag => `
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-200">
                                        ${tag}
                                    </span>
                                `).join('')}
                            </div>
                            
                            <div class="mt-6 flex flex-wrap gap-3">
                                ${project.links.modrinth ? `
                                    <a href="${project.links.modrinth}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                                        View on Modrinth
                                    </a>
                                ` : ''}
                                
                                ${project.links.github ? `
                                    <a href="${project.links.github}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-white bg-gray-700 hover:bg-gray-600">
                                        Source Code
                                    </a>
                                ` : ''}
                                
                                ${project.links.download ? `
                                    <a href="${project.links.download}" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                                        Download
                                    </a>
                                ` : ''}
                            </div>
                            
                            <div class="mt-4 text-xs text-gray-400">
                                Last updated: ${new Date(project.lastUpdated).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                `).join('');
            }

            // Initial render
            renderProjects();
        `;
        document.body.appendChild(script);

        // Register service worker for PWA functionality
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/service-worker.js')
                    .then(registration => {
                        console.log('ServiceWorker registration successful with scope: ', registration.scope);
                    })
                    .catch(error => {
                        console.log('ServiceWorker registration failed: ', error);
                    });
            });
        }
    } catch (error) {
        console.error('Error initializing application:', error);
    }
});
