function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.program-section');
    sections.forEach((section) => section.classList.add('hidden'));
  
    // Show the selected section
    const sectionToShow = document.getElementById(sectionId);
    sectionToShow.classList.remove('hidden');
  
    // Hide academics grid
    document.querySelector('.academics').classList.add('hidden');
  }
  
  function goBack() {
    // Show academics grid
    document.querySelector('.academics').classList.remove('hidden');
  
    // Hide all program sections
    const sections = document.querySelectorAll('.program-section');
    sections.forEach((section) => section.classList.add('hidden'));
  }
  