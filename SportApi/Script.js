const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const leagueSelect = document.getElementById('leagueSelect');
const leagueButton = document.getElementById('leagueButton');
const resultsContainer = document.getElementById('results');
const savedTeamsContainer = document.getElementById('savedTeams');

const API_BASE_URL = 'https://www.thesportsdb.com/api/v1/json/3';

let savedTeams = [];

searchButton.addEventListener('click', searchTeamsByName);
leagueButton.addEventListener('click', searchTeamsByLeague);

function searchTeamsByName() {
    const teamName = searchInput.value.trim();
    
    if (!teamName) {
        showMessage(resultsContainer, 'Por favor ingresa un nombre de equipo');
        return;
    }
    
    showMessage(resultsContainer, 'Cargando...');
    
    fetch(`${API_BASE_URL}/searchteams.php?t=${encodeURIComponent(teamName)}`)
        .then(response => response.json())
        .then(data => {
            if (data.teams) {
                displayResults(data.teams);
            } else {
                showMessage(resultsContainer, 'No se encontraron equipos con ese nombre');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showMessage(resultsContainer, 'Error al conectar con la API');
        });
}

function searchTeamsByLeague() {
    const league = leagueSelect.value;
    
    if (!league) {
        showMessage(resultsContainer, 'Por favor selecciona una liga');
        return;
    }
    
    showMessage(resultsContainer, 'Cargando...');
    
    fetch(`${API_BASE_URL}/search_all_teams.php?l=${encodeURIComponent(league)}`)
        .then(response => response.json())
        .then(data => {
            if (data.teams) {
                displayResults(data.teams);
            } else {
                showMessage(resultsContainer, 'No se encontraron equipos en esa liga');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showMessage(resultsContainer, 'Error al conectar con la API');
        });
}

function displayResults(teams) {
    resultsContainer.innerHTML = '';
    
    teams.forEach(team => {
        const teamCard = document.createElement('div');
        teamCard.className = 'col-md-4 mb-3';
        
        // Suponiendo que las imágenes locales están basadas en el nombre del equipo (en minúsculas y con guiones)
        const teamImage = team.strTeam ? `resources/${team.strTeam.toLowerCase().replace(/\s+/g, '_')}_fc.png` : 'resources/default_image.jpg';
        
        teamCard.innerHTML = `
            <div class="card">
                <img src="${teamImage}" class="card-img-top" alt="Logo de ${team.strTeam}">
                <div class="card-body">
                    <h5 class="card-title">${team.strTeam}</h5>
                    <p class="card-text">Liga: ${team.strLeague}</p>
                    <p class="card-text">País: ${team.strCountry}</p>
                    <button class="btn btn-primary btn-save" data-id="${team.idTeam}">Guardar equipo</button>
                </div>
            </div>
        `;
        
        const saveButton = teamCard.querySelector('.btn-save');
        saveButton.addEventListener('click', function() {
            saveTeam(team);
        });
        
        resultsContainer.appendChild(teamCard);
    });
}




function saveTeam(team) {
    const teamExists = savedTeams.some(t => t.idTeam === team.idTeam);
    
    if (teamExists) {
        alert('Este equipo ya está guardado');
        return;
    }
    
    const teamToSave = {
        idTeam: team.idTeam,
        strTeam: team.strTeam,
        strLeague: team.strLeague,
        strCountry: team.strCountry
    };
    
    savedTeams.push(teamToSave);
    
    displaySavedTeams();
}

function displaySavedTeams() {
    savedTeamsContainer.innerHTML = '';
    
    if (savedTeams.length === 0) {
        showMessage(savedTeamsContainer, 'No hay equipos guardados');
        return;
    }
    
    savedTeams.forEach((team, index) => {
        const teamElement = document.createElement('div');
        teamElement.className = 'col-md-4 mb-3';
        
        teamElement.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${team.strTeam}</h5>
                    <p class="card-text">Liga: ${team.strLeague}</p>
                    <p class="card-text">País: ${team.strCountry}</p>
                    <button class="btn btn-danger btn-delete" data-index="${index}">Eliminar</button>
                </div>
            </div>
        `;
        
        const deleteButton = teamElement.querySelector('.btn-delete');
        deleteButton.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            removeTeam(index);
        });
        
        savedTeamsContainer.appendChild(teamElement);
    });
}

function removeTeam(index) {
    savedTeams.splice(index, 1);
    
    displaySavedTeams();
}

function showMessage(container, message) {
    container.innerHTML = `<p class="col-12 text-center">${message}</p>`;
}

displaySavedTeams();
