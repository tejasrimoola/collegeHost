// JavaScript to handle form submission and display contact information
document.getElementById('contactForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission behavior
  
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
  
    // Validate inputs (Optional)
    if (!name || !email || !message) {
      alert('Please fill out all fields.');
      return;
    }
  
    // Create a list item with the submitted data
    const infoList = document.getElementById('infoList');
    const listItem = document.createElement('li');
    listItem.innerHTML = `<strong>Name:</strong> ${name} <br>
                          <strong>Email:</strong> ${email} <br>
                          <strong>Message:</strong> ${message}`;
    infoList.appendChild(listItem);
  
    // Clear the form after submission
    document.getElementById('contactForm').reset();
  
    // Optionally, store the data in local storage
    const submittedData = JSON.parse(localStorage.getItem('contactData')) || [];
    submittedData.push({ name, email, message });
    localStorage.setItem('contactData', JSON.stringify(submittedData));
  });
  