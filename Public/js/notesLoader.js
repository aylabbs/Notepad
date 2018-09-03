document.getElementById('form').addEventListener('submit', submitForm);1
document.getElementById('search').addEventListener('keyup', filterResults);

function submitForm(e) {
  e.preventDefault();
  var formdata = 'title=' + document.getElementById('title').value + '&value=' + document.getElementById('value').value;
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/notesxhr', true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = function() {
    if(xhr.readyState == 4 && xhr.status == 200) {
      document.getElementById('title').value = '';
      document.getElementById('value').value = '';
      renderNotes(null);
      document.getElementById('resmessage').innerHTML = '<h4>' + xhr.responseText + '</h4>';
    }
  }
  xhr.send(formdata);

};


function filterResults() {
  var searchQuery = document.getElementById('search').value.toLowerCase();
  renderNotes(searchQuery);
};


function renderNotes(option) {
  document.getElementById('resmessage').innerHTML = '';
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/notesxhr', true);
  xhr.onreadystatechange = function() {
    if(xhr.readyState == 4 && xhr.status == 200) {
      var notesArray = JSON.parse(xhr.responseText).notes;
      if (option) {
        console.log('Got an option');
        console.log(typeof notesArray[0].title);
        notesArray = notesArray.filter(n => {
          console.log('Checking ' + n.title);
          var check = (n.title.toLowerCase().search(option) > -1) || (n.value.toLowerCase().search(option) > -1) ;
          console.log(check);
          return check;
      })};
      if (notesArray.length !==  0) {
        var allNotes = '<div class="row" id="noteList" >';
        notesArray.forEach(note => {
          allNotes += `<div class="col s3 m3" id="div${note._id}">
            <div class="card blue-grey darken-1">
              <div class="card-content white-text">
                <span class="card-title wrap-text"><i>Title: </i>${note.title}</span>
                <p class="wrap-text"><i>note: </i>${note.value}</p>
              </div>
              <div class="card-action">
                <a href="" class="edititem" id="${note._id}">Edit</a>
                <a href="" class="deleteitem" id="${note._id}">Delete</a>
              </div>
            </div>
            </div>`

        });
        allNotes += '</div>';
        document.getElementById('notes').innerHTML = allNotes;
        document.getElementById('noteList').addEventListener('click', editItem);
      } else {
        document.getElementById('notes').innerHTML = '';
      };




    }
  };
  xhr.send();

};

function deleteItem(editId) {
  var route = '/notes/' + editId + '?_method=DELETE';
  var xhr = new XMLHttpRequest();
  xhr.open('POST', route, true);
  xhr.onreadystatechange = function() {
    if(xhr.readyState == 4 && xhr.status == 200) {
      var div = document.getElementById('div' + editId);
      div.parentNode.removeChild(div);
      document.getElementById('resmessage').innerHTML = '<h4>' + xhr.responseText + '</h4>';
    }
  };
  xhr.send();
};

function editItem(e) {
  e.preventDefault();
  var editId = e.target.getAttribute('id');
  if (e.target.classList.contains("deleteitem")) {
    deleteItem(editId);

  } else if (e.target.classList.contains("edititem")) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/notes/'+editId, true);
    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4 && xhr.status == 200) {
        console.log(xhr.responseText);
        var note = JSON.parse(xhr.responseText);
        document.getElementById('div' + editId).innerHTML = `<div class="card">
          <div class="card-content white-text">
            <span class="card-title"><label for="title">Title</label>
            <input type="text" name="title" id="title${note._id}" placeholder="My Title" value=${note.title}></span>
            <p><label for="value">Note</label>
            <input type="text" name="value" id="value${note._id}" placeholder="My Note" value=${note.value}></p>
          </div>
          <div class="card-action">
            <a href="" class="edithandle" id="${note._id}">Edit</a>
            <a href="" class="deleteitem" id="${note._id}">Delete</a>
          </div>
        </div>`
      }
      };
      xhr.send();
  } else if (e.target.classList.contains("edithandle")) {
    var newTitle = document.getElementById('title' + editId).value;
    var newValue = document.getElementById('value' + editId).value;
    if ((newTitle !== '') || (newValue !== '') ) {
      var formdata = 'title=' + newTitle + '&value=' + newValue;
      var xhr = new XMLHttpRequest();
      var route = '/notes/' + editId + '?_method=PUT';
      xhr.open('POST', route, true);
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
          document.getElementById('div' + editId).innerHTML = `<div class="card blue-grey darken-1">
              <div class="card-content white-text">
                <span class="card-title wrap-text"><i>Title: </i>${newTitle}</span>
                <p class="wrap-text"><i>note: </i>${newValue}</p>
              </div>
              <div class="card-action">
                <a href="" class="edititem" id="${editId}">Edit</a>
                <a href="" class="deleteitem" id="${editId}">Delete</a>
              </div>
            </div>`

          document.getElementById('resmessage').innerHTML = '<h4>' + xhr.responseText + '</h4>';
        }

      };
      xhr.send(formdata);
    } else {
      deleteItem(editId);
    }

};
};
renderNotes(null);
