class App {
  constructor() {
    this.notes = [];
    this.labels = [];
    this.results = [];
    this.title = '';
    this.text = '';
    this.label = '';
    this.id = '';

    this.$placeholder = document.querySelector('#placeholder');
    this.$form = document.querySelector('#form');
    this.$notes = document.querySelector('#notes');
    this.$labels = document.querySelector('#labels');
    this.$noteTitle = document.querySelector('#note-title');
    this.$labelText = document.querySelector('#label-text');
    this.$noteText = document.querySelector('#note-text');
    this.$searchText = document.querySelector('#search-text');
    this.$searchButton = document.querySelector('#search-button');
    this.$formButtons = document.querySelector('#form-buttons');
    this.$formCloseButton = document.querySelector('#form-close-button');
    this.$formThemeButton = document.querySelector('#form-theme-button');
    this.$modal = document.querySelector('.modal');
    this.$modalTitle = document.querySelector('.modal-title');
    this.$modalText = document.querySelector('.modal-text');
    this.$modalLabelText = document.querySelector('.modal-label-text');
    this.$dropDown = document.querySelector('.dropbtn');
    this.$addBtn = document.querySelector('.addbtn');
    this.$modalCloseButton = document.querySelector('.modal-close-button');
    this.addEventListeners();
  }
  
  
  addEventListeners() {

    this.$dropDown.addEventListener('click', (event) => {
      event.preventDefault();
      document.getElementById("myDropdown").classList.toggle("show");
    })

    this.$searchButton.addEventListener('click', (event) => {
      console.log(this.$searchText.value);
      this.results = this.notes.filter((note) => {
       return note['title'] === this.$searchText.value || note['text'] === this.$searchText.value
      })
      console.log(this.results);
      this.displayResults();
    });
    
    this.$addBtn.addEventListener('click', (event) => {
      document.getElementById("myDropdown").classList.toggle("show");
      const label = this.$labelText.value;
      if (label) {
        this.addLabel(label);
      }
    });

    document.body.addEventListener('click', (event) => {
      if (!event.target.closest('.dropbtn')) {
        console.log('dd');
        this.handleFormClick(event);
        this.selectNote(event);
        this.openModal(event);
      }
    });
    
    this.$formCloseButton.addEventListener('click', (event) => {
      event.stopPropagation();
      this.closeForm();
    });

    this.$form.addEventListener('submit', (event) => {
      event.preventDefault();
      const title = this.$noteTitle.value;
      const text = this.$noteText.value;
      const color = this.$noteText.style.backgroundColor;
      const hasNote = title || text;
      if (hasNote) {
        this.addNote({ title, text, color });
      }
    });

    this.$formThemeButton.addEventListener('click', (event) => {
      let color =this.getRandomColor();
      this.$noteTitle.style.backgroundColor = color;
      this.$noteText.style.backgroundColor = color;
      this.$form.style.backgroundColor = color;
    });

    this.$modalCloseButton.addEventListener('click', (event) => {
      this.closeModal(event);
    });
  }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  handleFormClick(event) {
    const isFormClicked = this.$form.contains(event.target);

    const title = this.$noteTitle.value;
    const text = this.$noteText.value;
    const color = this.$noteText.style.backgroundColor;
    const hasNote = title || text;

    if (isFormClicked) {
      this.openForm();
    } else if (hasNote) {
      this.addNote({ title, text, color });
    } else {
      this.closeForm();
    }
  }

  openForm() {
    this.$form.classList.add('form-open');
    this.$noteTitle.style.display = 'block';
    this.$formButtons.style.display = 'block';
    this.$formThemeButton.style.display = 'block';
  }

  closeForm() {
    this.$form.classList.remove('form-open');
    this.$noteTitle.style.backgroundColor = '#fff';
    this.$noteText.style.backgroundColor = '#fff';
    this.$form.style.backgroundColor = '#fff';
    this.$noteTitle.style.display = 'none';
    this.$formButtons.style.display = 'none';
    this.$noteTitle.value = '';
    this.$noteText.value = '';
    this.labels = [];
    this.displayLabels();
  }

  openModal(event) {
    if (event.target.closest('.note')) {
      this.$modal.classList.toggle('open-modal');
      this.$modalTitle.value = this.title;
      this.$modalText.value = this.text;
      this.$modalLabelText.value = this.label;
    }
  }

  closeModal(event) {
    this.editNote();
    this.$modal.classList.toggle('open-modal');
  }

  addNote({ title, text, color }) {
    const newNote = {
      title,
      text,
      color: color,
      label: this.labels,
      id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1,
    };
    this.notes = [...this.notes, newNote];
    this.labels = [];
    this.displayNotes();
    this.closeForm();
  }

  addLabel(label) {
    const newLabel = label;
    this.labels = [...this.labels, newLabel];
    this.displayLabels();
  }
  
  editNote() {
    const title = this.$modalTitle.value;
    const text = this.$modalText.value;
    this.notes = this.notes.map((note) =>
    note.id === Number(this.id) ? { ...note, title, text } : note
    );
    this.displayNotes();
  }

  selectNote(event) {
    const $selectedNote = event.target.closest('.note');
    if (!$selectedNote) return;
    const [$noteTitle, $noteText, $labelText] = $selectedNote.children;
    this.title = $noteTitle.innerText;
    this.text = $noteText.innerText;
    this.label = $labelText.innerText;
    this.id = $selectedNote.dataset.id;
  }

  displayNotes() {
    const hasNotes = this.notes.length > 0;
    if(this.searchResults?.length > 0) {
      return;
    }
    this.$placeholder.style.display = hasNotes ? 'none' : 'flex';

    this.$notes.innerHTML = this.notes
      .map(
        (note) => `
        <div style="background: ${note.color};" class="note" data-id="${
          note.id
        }">
          <div class="note-title">${note.title}</div>
          <div class="note-text">${note.text}</div>
          <div class="${note.label[1]}">${note.label[0] || ""}</div>
          <div class="${note.label[1]}">${note.label[1] || ""}</div>
          <div class="${note.label[2]}">${note.label[2] || ""}</div>
        </div>
     `
      )
      .join('');
  }

  displayResults() {
    this.displayNotes();
    this.searchResults=[];
    this.$notes.innerHTML = this.results
      .map(
        (note) => `
        <div class="note-title">Results</div>
        <div style="background: ${note.color};" class="note" data-id="${
          note.id
        }">
          <div class="note-title">${note.title}</div>
          <div class="note-text">${note.text}</div>
          <div class="${note.label[1]}">${note.label[0] || ""}</div>
          <div class="${note.label[1]}">${note.label[1] || ""}</div>
          <div class="${note.label[2]}">${note.label[2] || ""}</div>
        </div>
     `
      )
      .join('');
  }

  displayLabels() {
    this.$labels.innerHTML = this.labels
      .map(
        (label) =>`
        <div class="label-text">
          <div id="label-text">${label}</div>
        </div>
     `
      )
      .join('');
  }
}

new App();
