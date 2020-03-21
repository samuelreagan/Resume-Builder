const dataFile = "sample-data.json";
const resume = {
  header: document.getElementById('header'),
  experience: document.getElementById('experience'),
  education: document.getElementById('education'),
  contact: document.getElementById('contact'),
  languages: document.getElementById('languages'),
  tools: document.getElementById('tools'),
  awards: document.getElementById('awards')
}

fetch(`http://localhost:5500/${dataFile}`)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    setResumeData(data);
  });

function setResumeData(data) {
  setPersonalData(data);
  setExperienceData(data);
  setEducationData(data);
  setLanguagesData(data);
  setToolsData(data);
  setAwardsData(data);
}

function setPersonalData(data) {
  document.title = `${data.personalInfo.name} - Resume`;
  header.textContent = data.personalInfo.name;

  resume.contact.appendChild(createInfoSection((div) => {
    for(let contact in data.personalInfo.contactInfo) {
      div.appendChild(createInfoHeader(contact.charAt(0).toUpperCase() + contact.slice(1)));
      const p = document.createElement('p');
      p.textContent = data.personalInfo.contactInfo[contact];
      div.appendChild(p);
    }
  }));
}

function setExperienceData(data) {
  data.experience.forEach((exp) => {
    resume.experience.appendChild(createArticle(exp));
  });
}

function setEducationData(data) {
  data.education.forEach((edu) => {
    resume.education.appendChild(createArticle(edu, false));
  });
}

function setToolsData(data) {
  if (data.tools && data.tools.length > 0) {
    resume.tools.appendChild(createUnorderedList(data.tools));
  }
}

function setLanguagesData(data) {
  resume.languages.appendChild(createInfoSection((div) => {
    for (let lang in data.languages) {
      div.appendChild(createInfoHeader(lang));
      div.appendChild(createUnorderedList(data.languages[lang]));
    }
  }));
}

function setAwardsData(data) {
  if (data.awards && data.awards.length > 0) {
    data.awards.forEach((award) => {
      resume.awards.appendChild(createInfoSection((div) => {
        div.appendChild(createInfoHeader(award.name));
        let awardLocation = document.createElement('p');
        awardLocation.setAttribute('class', 'location');
        awardLocation.textContent = `${award.event} - ${award.date} ${award.location}`;
        div.appendChild(awardLocation);
      }));
    });
  }
}

/*--- Helpers ---*/

function createInfoHeader(headerText) {
  let header = document.createElement('p');
  header.setAttribute('class', 'info-header');
  header.textContent = headerText;

  return header;
}

function createInfoSection(callback) {
  const div = document.createElement('div');
  callback(div);
  return div;
}

function createUnorderedList(items) {
  const ul = document.createElement('ul');
  items.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    ul.appendChild(li);
  });

  return ul;
}

function createArticle(data, isExperience = true) {
  const template = document.getElementById('article-template');
  const article = template.cloneNode(true);
  const tenureElement = article.getElementsByClassName('tenure')[0];

  article.id = '';
  article.classList.remove('template');

  tenureElement.setAttribute('class', (data.current == 'true') ? 'tenure current': 'tenure');
  tenureElement.textContent = data.tenure;
  article.getElementsByClassName('role')[0].textContent = (isExperience) ? data.role : data.degree;
  article.getElementsByClassName('location')[0].textContent = `${(isExperience) ? data.company : data.college} - ${data.location}`;

  if (data.descriptions && data.descriptions.length > 0) {
    let descriptions = article.getElementsByClassName('description')[0];
    descriptions.parentNode.replaceChild(createUnorderedList(data.descriptions), descriptions);
  }

  return article;
}