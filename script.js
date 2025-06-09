// 📍 Fonds de carte
const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
});

// 🗺️ Initialisation de la carte
const map = L.map('map', {
  center: [36.8, 10.2],
  zoom: 7,
  layers: [osm]
});

let userMarker; 
let routeControl; 


let recognition;
let isVoiceActive = false;
const synth = window.speechSynthesis; 
const voiceBtn = document.getElementById("voiceBtn");

function updateDateTime() {
  const dateTimeElement = document.getElementById("currentDateTime");
  const now = new Date();
  

 const options = {
  timeZone: "Africa/Tunis", 
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false
};

  
  const formattedDateTime = now.toLocaleString("fr-FR", options);
  dateTimeElement.textContent = formattedDateTime;
}

setInterval(updateDateTime, 1000);
updateDateTime(); 


const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = 'fr-FR';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    const command = event.results[0][0].transcript.trim().toLowerCase();
    document.getElementById('destinationInput').value = command;
    document.getElementById('searchBtn').click(); 
    toggleVoiceMode(false); 
  };

  recognition.onerror = (event) => {
    console.error('Erreur de reconnaissance vocale:', event.error);
    speak("Désolé, je n'ai pas compris. Essayez à nouveau.");
    toggleVoiceMode(false);
  };

  recognition.onend = () => {
    if (isVoiceActive) {
      recognition.start(); 
    }
  };
} else {
  voiceBtn.style.display = 'none'; 
  alert("La reconnaissance vocale n'est pas prise en charge par votre navigateur. Veuillez utiliser Google Chrome ou Microsoft Edge.");
}


function toggleVoiceMode(active) {
  if (!recognition) return; 
  voiceBtn.classList.toggle('active', active);
  if (active) {
    recognition.start();
    speak("Mode vocal activé. Dites une destination.");
  } else {
    recognition.stop();
  }
}

function speak(text) {
  if (synth.speaking) {
    synth.cancel(); 
    console.log('Synthèse vocale annulée pour lancer un nouveau message.');
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'fr-FR';
  utterance.volume = 1;
  utterance.rate = 1;
  utterance.pitch = 1;
  synth.speak(utterance);
}


function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        const userLatLng = [latitude, longitude];

        if (userMarker) {
          map.removeLayer(userMarker); 
        }
        userMarker = L.marker(userLatLng).addTo(map)
          .bindPopup("Votre position actuelle").openPopup();
        map.setView(userLatLng, 13); 
        speak("Votre position a été trouvée. Latitude : " + latitude.toFixed(4) + ", Longitude : " + longitude.toFixed(4));
      },
      error => {
        alert("Impossible d'obtenir votre position : " + error.message);
        speak("Impossible d'obtenir votre position. Activez le GPS ou entrez une destination manuellement.");
      }
    );
  } else {
    alert("La géolocalisation n'est pas prise en charge par votre navigateur.");
    speak("La géolocalisation n'est pas prise en charge. Veuillez entrer une destination manuellement.");
  }
}


getUserLocation();


document.getElementById('refreshLocationBtn')?.addEventListener('click', getUserLocation);


document.getElementById('searchBtn').addEventListener('click', () => {
  const query = document.getElementById('destinationInput').value.trim();
  if (!query) return;

  if (!userMarker) {
    alert("Veuillez attendre que votre position soit détectée ou activer la géolocalisation.");
    speak("Veuillez attendre que votre position soit détectée ou activer la géolocalisation.");
    return;
  }

  fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)},Tunisie&key=ef31600cb3d74df4b9e89ed402d32cd6`)
    .then(response => response.json())
    .then(data => {
      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        const destinationLatLng = [lat, lng];

        
        if (routeControl) {
          map.removeControl(routeControl);
        }

       
        routeControl = L.Routing.control({
          waypoints: [
            userMarker.getLatLng(), 
            L.latLng(destinationLatLng) 
          ],
          routeWhileDragging: false,
          showAlternatives: false,
          language: 'fr',
          show: true 
        }).addTo(map);

        routeControl.on('routesfound', function(e) {
          const instructions = e.routes[0].instructions;
          const directionsContent = document.getElementById('directionsContent');
          directionsContent.innerHTML = '';

          instructions.forEach((instruction, index) => {
            const instructionElement = document.createElement('p');
            instructionElement.textContent = `${index + 1}. ${instruction.text}`;
            directionsContent.appendChild(instructionElement);
          });

          const instructionsText = instructions.map(i => i.text).join('. ');
          speak(`Itinéraire calculé vers ${query}. ${instructionsText}`);
        });

        map.setView(destinationLatLng, 13);
        enregistrerRecherche(query);
      } else {
        alert("Destination introuvable.");
        speak("Destination introuvable. Essayez une autre destination.");
      }
    })
    .catch(error => {
      console.error("Erreur API :", error);
      alert("Erreur lors de la recherche.");
      speak("Erreur lors de la recherche. Veuillez réessayer.");
    });
});

function enregistrerRecherche(ville) {
  let historique = JSON.parse(localStorage.getItem('historiqueRecherches')) || [];
  if (!historique.includes(ville)) {
    historique.push(ville);
    localStorage.setItem('historiqueRecherches', JSON.stringify(historique));
    afficherHistorique();
  }
}

function afficherHistorique() {
  const liste = document.getElementById('historyList');
  liste.innerHTML = '';
  const historique = JSON.parse(localStorage.getItem('historiqueRecherches')) || [];
  historique.forEach(ville => {
    const li = document.createElement('li');
    li.textContent = ville;
    li.classList.add('history-item');
    li.addEventListener('click', () => {
      document.getElementById('destinationInput').value = ville;
      document.getElementById('searchBtn').click();
    });
    liste.appendChild(li);
  });
}

afficherHistorique();

document.getElementById('clearHistoryBtn').addEventListener('click', () => {
  localStorage.removeItem('historiqueRecherches');
  afficherHistorique();
});

map.on('click', function(e) {
  const lat = e.latlng.lat;
  const lng = e.latlng.lng;
  const marker = L.marker([lat, lng]).addTo(map)
    .bindPopup(`Point ajouté manuellement<br>Latitude: ${lat.toFixed(4)}<br>Longitude: ${lng.toFixed(4)}`)
    .openPopup();
  let pointsManuels = JSON.parse(localStorage.getItem('pointsManuels')) || [];
  pointsManuels.push({ lat, lng });
  localStorage.setItem('pointsManuels', JSON.stringify(pointsManuels));
  speak(`Point ajouté manuellement à la latitude ${lat.toFixed(4)} et longitude ${lng.toFixed(4)}.`);
});


const pointsManuels = JSON.parse(localStorage.getItem('pointsManuels')) || [];
pointsManuels.forEach(pt => {
  L.marker([pt.lat, pt.lng]).addTo(map)
    .bindPopup(`Point manuel sauvegardé<br>Latitude: ${pt.lat.toFixed(4)}<br>Longitude: ${pt.lng.toFixed(4)}`);
});


document.getElementById('clearManualPointsBtn').addEventListener('click', () => {
  localStorage.removeItem('pointsManuels');
  location.reload();
  speak("Points manuels effacés.");
});


document.getElementById("voiceBtn").onclick = () => {
  toggleVoiceMode(!isVoiceActive);
};


const stopVoiceBtn = document.getElementById("stopVoiceBtn");
if (stopVoiceBtn) {
  stopVoiceBtn.onclick = () => {
    toggleVoiceMode(false);
    speak("Mode vocal désactivé.");
  };
} else {
  console.error("Le bouton 'stopVoiceBtn' n'a pas été trouvé dans le DOM. Vérifiez votre HTML.");
}