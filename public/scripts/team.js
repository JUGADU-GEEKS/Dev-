// Team members data
const teamMembers = [
    {
        name: "Kunal Sharma",
        image: "../public/images/kunal.png",
        github: "https://github.com/KunnuSherry",
        linkedin: "https://www.linkedin.com/in/kunal-sharma-8b9787334/"
    },
    {
      name: "Dhruv Sharma",
      image: "../public/images/dhruv.jpg",
      github: "https://github.com/dhruv0050",
      linkedin: "https://www.linkedin.com/in/dhruv-sharma-331379154/"
    },
    {
        name: "Sangya Ojha",
        image: "../public/images/sangya.png",
        github: "https://github.com/sangya-25",
        linkedin: "https://www.linkedin.com/in/sangya-ojha-7a58a22a3/"
    },
    {
      name: "Devang Singh",
      image: "../public/images/devang.jpg",
      github: "https://github.com/devang9890",
      linkedin: "https://www.linkedin.com/in/devang-singh-258476284/"
    },
    {
      name: "Aashi Goel",
      image: "../public/images/aashi.png",
      github: "https://github.com/Aashi-25",
      linkedin: "https://www.linkedin.com/in/aashi-goel-041512295/"
    }
  ];
  
  // Function to create a team member card
  function createTeamMemberCard(member) {
    const card = document.createElement('div');
    card.className = 'team-card';
    
    // Create the team member image with circular crop
    const imageContainer = document.createElement('div');
    imageContainer.className = 'image-container';
    
    const image = document.createElement('img');
    image.src = member.image;
    image.alt = member.name;
    imageContainer.appendChild(image);
    
    // Create the name element
    const name = document.createElement('h3');
    name.className = 'member-name';
    name.textContent = member.name;
    
    // Create the social links container
    const socialLinks = document.createElement('div');
    socialLinks.className = 'social-links';
    
    // Create GitHub link
    const githubLink = document.createElement('a');
    githubLink.href = member.github;
    githubLink.target = '_blank';
    githubLink.rel = 'noopener noreferrer';
    githubLink.className = 'social-link github';
    githubLink.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
      </svg>
    `;
    
    // Create LinkedIn link
    const linkedinLink = document.createElement('a');
    linkedinLink.href = member.linkedin;
    linkedinLink.target = '_blank';
    linkedinLink.rel = 'noopener noreferrer';
    linkedinLink.className = 'social-link linkedin';
    linkedinLink.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
      </svg>
    `;
    
    // Append all elements to the card
    socialLinks.appendChild(githubLink);
    socialLinks.appendChild(linkedinLink);
    
    card.appendChild(imageContainer);
    card.appendChild(name);
    card.appendChild(socialLinks);
    
    return card;
  }
  
  // Function to initialize the team section
  function initTeamSection() {
    const teamGrid = document.querySelector('.team-grid');
    
    // Create and append each team member card
    teamMembers.forEach(member => {
      const card = createTeamMemberCard(member);
      teamGrid.appendChild(card);
    });
    
    // Add hover effects to cards
    const cards = document.querySelectorAll('.team-card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.classList.add('hover');
      });
      
      card.addEventListener('mouseleave', function() {
        this.classList.remove('hover');
      });
    });
  }
  
  // Initialize when the DOM is fully loaded
  document.addEventListener('DOMContentLoaded', initTeamSection);
  