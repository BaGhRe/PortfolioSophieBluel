fetch('http://localhost:5678/api/works')
  .then(response => response.json())
  .then(projects => {

    const gallery = document.querySelector('.gallery');

    gallery.innerHTML = '' ;

    projects.forEach(project => {
      const figure = document.createElement('figure');
      const img = document.createElement('img');
      const figcaption = document.createElement('figcaption');

      img.src = project.imageUrl;
      img.alt = project.title;
      img.crossOrigin = 'anonymous'
      figcaption.textContent = project.title;

      figure.appendChild(img);
      figure.appendChild(figcaption);
      gallery.appendChild(figure);
      
    });

  });