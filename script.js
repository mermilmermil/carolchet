const nameSectionForm = document.getElementById("text-name-form")
const nameSectionInput = document.getElementById("text-name-input")
const cardDiv = document.getElementById("all-projects")
let allProjects = JSON.parse(localStorage.getItem('items')) || [
  {name: "Test",
    showform: true,
    sections: [
      {
        name: "Test Section",
        row: ["something", "else", "whatever"],
        index: 0,
        showSection: true,
      }
    ],}
];

function deleteProject (li) {
  allProjects.splice(li, 1)
  updateProjects()
  console.log(allProjects)

}

function deleteSection (li, curr) {
  allProjects[li].sections.splice(curr, 1)
  console.log(allProjects)
  updateProjects()

}

function addSection(li, e) {
  e.preventDefault()
  const nameInput = document.getElementById(`name-of-section-${li}`)
  const rowInfoInput = document.getElementById(`row-textarea-${li}`)
  const eForm = document.getElementById(`row-form-${li}`)
  
  const eProject = allProjects[li]

  eProject.sections.push({
    name: nameInput.value,
    row: sortSection(rowInfoInput.value),
    index: 0,
    showSection: true,
  })
  console.log(eProject)
  eProject.showform = false
  updateProjects()

}

function addSectionFunction(li) {
  allProjects[li].showform = true
  updateProjects()
}

function updateSections(li, i) {
  const eProject = allProjects[li]

  return eProject.sections.map((e, i) => {
    return `
      <li class="list-group-item">
          
          <h5 class="card-title">${e.name}</h5>
            <button class="btn btn-danger col-0.5" onclick="deleteSection(${li}, ${i})"><i class="fa-solid fa-trash"></i></button>
            <button class="btn btn-success col-0.5" style="display: ${!e.showSection? "flexbox": "none"}" onclick='collSection(${li}, ${i})'><i class="fa-solid fa-plus"></i></button>
          <ul class="list-group list-group-flush">
          <li class="list-group-item" style="display: ${e.showSection? "block": "none"}">
            <span id="span-${li}-${i}">${e.row.length > 1? e.row[e.index] : e.row}</span> <br>
            <button class="btn btn-primary" onclick="prevRow(${li}, ${i})">Previous</button>
            <button class="btn btn-primary" onclick="nextRow(${li}, ${i})">Next</button>
            <button class="btn btn-primary" onclick="showEntireSection(${li}, ${i})">Show entire Section</button>
            <button class="btn-primary btn" onclick="collSection(${li}, ${i})">Collapse Section</button>
          </li>
        </ul>
        </li>
    `
  }).join('')
  
}

function updateProjects () {
  cardDiv.innerHTML = allProjects.map((e, i) => {
      return `
      <div class="card m-3" id="project-div-${i}">
        <div class="card-header">
          <h5>${e.name}</h5> 
          <button class="btn btn-danger" onclick='deleteProject(${i})'><i class="fa-solid fa-trash"></i></button>
          <button class="btn btn-success" onclick='addSectionFunction(${i})'><i class="fa-solid fa-plus"></i></button>
        </div>
        <form id="row-form-${i}" style="display: ${e.showform? "block": "none"}">
          <div class="m-3">
            <label for="name-of-section" class="form-label">Name of Section</label>
            <input type="text" class="form-control" id="name-of-section-${i}">
            
          </div>
          
          <div class="form-floating m-3">
            <textarea class="form-control" placeholder="Leave a comment here" id="row-textarea-${i}" style="height: 100px"></textarea>
            <label for="floatingTextarea2">Row Information</label>
          </div>
          <button type="submit" class="btn btn-primary m-3">Submit</button>
        </form>
        <ul class="list-group list-group-flush" id="${i}-row-list">
          ${e.sections? updateSections(i, e.index): ''}
        </ul>
      </div>

      `
  }).join('')

  allProjects.forEach((_, i) => {
    const form = document.getElementById(`row-form-${i}`)
    form.addEventListener('submit', (e) => addSection(i, e)) // Attach submit event to each form
  })  

  localStorage.setItem('items', JSON.stringify(allProjects));
}

function sortSection(e) {
  const multiSections = e.split("\n")
  console.log(multiSections)
  return multiSections
}

function nextRow(li, sectionNum) {
  const rowList = allProjects[li].sections[sectionNum]
  const newIndex = (rowList.index + 1 >= rowList.row.length) ? rowList.index: rowList.index + 1
  console.log(newIndex)
  rowList.index = newIndex 
  
  updateProjects()
}

function prevRow(li, sectionNum) {
  const rowList = allProjects[li].sections[sectionNum]
  const newIndex = (rowList.index - 1 < 0) ? rowList.index: rowList.index - 1
  console.log(newIndex)
  rowList.index = newIndex 
  
  updateProjects()
}

function collSection(li, sectionNum) {
  const rowList = allProjects[li].sections[sectionNum]
  rowList.showSection = !rowList.showSection
  updateProjects()
}

function showEntireSection(li, sectionNum) {
  // Get the section rowList
  const rowList = allProjects[li].sections[sectionNum];

  // Create the HTML for the entire section content
  const updatedHTML = rowList.row.join('<br>'); 

  // Directly update the existing span without calling `updateProjects()`
  const rowHTML = document.getElementById(`span-${li}-${sectionNum}`);

  if (rowHTML) {
    rowHTML.innerHTML = updatedHTML; // Update the inner HTML
  } else {
    console.error(`Element with id span-${li}-${sectionNum} not found`);
  }
}

nameSectionForm.addEventListener("submit", (e)=>{
  e.preventDefault()
  allProjects.push({
    name: nameSectionInput.value,
    showform: true,
    sections: [],
  })
  console.log(allProjects)
  updateProjects()
})

updateProjects()
