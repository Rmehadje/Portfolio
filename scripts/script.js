const username = "Rmehadje"; // Correct username case
const token = process.env.GITHUBTOKEN; // Replace with your actual token

fetch(`https://api.github.com/users/${username}/repos`, {
  headers: {
    Authorization: `token ${token}`
  }
})
.then(response => {
  // Check for any errors
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
})
.then(repos => {
  repos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Sort repos by creation date
  const projectsContainer = document.getElementById('projects-container');
  let currentOpenCard = null; // Track currently open card
  
  const readmePromises = repos.map(repo => {
    // Skip repositories that match the username exactly
    if (repo.name.toLowerCase() === username.toLowerCase()) {
      return null;
    }

    // Fetch README for each repo
    return fetch(`https://api.github.com/repos/${username}/${repo.name}/readme`, {
      headers: {
        Authorization: `token ${token}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error fetching README for ${repo.name}: ${response.status}`);
      }
      return response.json();
    })
    .then(readme => {
      const readmeContent = atob(readme.content);

      let description = readmeContent;
      if (repo.name === "Cub3D") {
        description = readmeContent
          .split('\n')
          .filter(line => line.trim() !== '')
          .map(line => line.replace(/\*/g, ''))
          .slice(2, 3)
          .join(' ');
      } else if (repo.name === "Push_Swap") {
        description = readmeContent
          .split('\n')
          .filter(line => line.trim() !== '')
          .map(line => line.replace(/\*/g, ''))
          .slice(2, 3)
          .join('<br>');
      } else if (repo.name === "Printf") {
        description = readmeContent
          .split('\n')
          .filter(line => line.trim() !== '') 
          .slice(1, 8)
          .join('<br>');
      } else {
        description = readmeContent
          .split('\n')
          .filter(line => line.trim() !== '') 
          .map(line => line.replace(/\*/g, '')) 
          .slice(1, 2)
          .join(' ');
      }

      return { repo, description };
    })
    .catch(error => {
      console.error(error);
      return null;
    });
  });

  // Wait for all readmePromises to resolve
  Promise.all(readmePromises).then(projects => {
    projects.forEach(project => {
      if (project) {
        const { repo, description } = project;
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';

        // Add click event listener for toggling description
        projectCard.addEventListener('click', (event) => {
          // Check if the clicked element is not the project title
          if (!event.target.classList.contains('project-title')) {
            const descriptionElement = projectCard.querySelector('.project-description');
            const isOpen = descriptionElement.classList.contains('show');

            // Close currently open card if it's not the same as the clicked one
            if (currentOpenCard && currentOpenCard !== projectCard) {
              const currentDescriptionElement = currentOpenCard.querySelector('.project-description');
              currentDescriptionElement.classList.remove('show'); // Close old card
            }

            // Toggle the clicked card's description
            if (!isOpen) {
              descriptionElement.classList.add('show'); // Open clicked card
              currentOpenCard = projectCard; // Update current open card
            } else {
              descriptionElement.classList.remove('show'); // Close clicked card
              currentOpenCard = null; // Reset current open card
            }
          }
        });

        // Set inner HTML of the project card
        projectCard.innerHTML = `
          <div class="project-header">
            <a class="project-title" href="${repo.html_url}" target="_blank">${repo.name}</a>
          </div>
          <p class="project-description">${description || 'No description available'}</p>
        `;

        // Append project card to the container
        projectsContainer.appendChild(projectCard);
      }
    });
  });
})
.catch(error => {
  console.error('Error fetching repositories:', error);
});

// window.onload = function() {
//   window.scrollTo(0, 0); // This ensures the page stays at the top
// };
const dropdownButton = document.getElementById('dropdown-btn');
const dropdownContent = document.querySelector('dropdown-content');

dropdownButton.addEventListener('click', function () {
    dropdownContent.classList.toggle('show'); // Toggle the 'show' class
});

const apikey = process.env.APIKEY;
const templatekey = process.env.TEMPLATEID;
const serviceid = process.env.SERVICEID;


emailjs.init(apikey);

document.getElementById('contactForm').addEventListener('submit', function (e){
  e.preventDefault();

  const name = document.getElementById('name').value;
  const message = document.getElementById('message').value;

  const templateParams = {
   to_name: name,
    message: message,
  };

  emailjs.send(serviceid, templatekey, name, message);
});


// Get modal element
const modal = document.getElementById("contactModal");

// Get open modal button
const openModalButton = document.getElementById("openModal");

// Get close button
const closeButton = document.getElementsByClassName("close")[0];

// Listen for open click
openModalButton.onclick = function() {
  modal.style.display = "flex";
  textarea.style.resize = "none";
}

// Listen for close click
closeButton.onclick = function() {
    modal.style.display = "none";
}

// Listen for outside click
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
window.onkeydown = function(event) {
  if (event.key === "Escape")
      modal.style.display = "none";
}

// Handle form submission
// document.getElementById("contactForm").onsubmit = function(event) {
//     event.preventDefault(); // Prevent default form submission
//     const name = document.getElementById("name").value;
//     const message = document.getElementById("message").value;

//     modal.style.display = "none";
//     const tmp = {
//       to_name: name,
//       message: message,
//     };
//     emailjs.send('service_tq67dn6', 'template_pnnb66e', tmp);
//     // Clear the form
//     this.reset();
// }
