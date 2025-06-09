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
let benYedderMarkers = []; // Tableau pour stocker les marqueurs BenYedder

// 🏪 Base de données des boutiques BenYedder
const benYedderLocations = [
  {
    name: "BenYedder Tunis El Jazira",
    address: "12, Rue El Jazira – Tunis",
    lat: 36.7978819,
    lng: 10.1756948,
    phone: "(+216) 71 325 076",
    hours: "Lun-Sam: 06:00-18:00, Dim: 06:00-14:00"
  },
  {
    name: "BenYedder La Marsa",
    address: "11, Place Moncef Bey – La Marsa",
    lat: 36.8320055,
    lng: 10.1870393,
    phone: "(+216) 71 743 591",
    hours: "Lun-Sam: 06:00-20:00, Dim: 06:00-14:00"
  },
  {
    name: "BenYedder Le Kram",
    address: "Angle Av. Habib Bourguiba N°288 et Rue Legha – 2015 Le Kram",
    lat: 36.8390837,
    lng: 10.3160264,
    phone: "(+216) 71 720 274",
    hours: "Lun-Sam: 06:00-19:00, Dim: 07:00-14:00"
  },
  {
    name: "BenYedder Alain Savary",
    address: "71, Rue Alain Savary, Cité El khadhra – Tunis",
    lat: 36.8320055,
    lng: 10.189228,
    phone: "(+216) 71 770 212",
    hours: "Lun-Ven: 06:00-18:30, Sam: 06:30-15:00, Dim: Fermé"
  },
  {
    name: "BenYedder Sousse",
    address: "Rue Khaled Ibn El Walid – Sousse",
    lat: 35.8295862,
    lng: 10.6416061,
    phone: "(+216) 73 225 440",
    hours: "Lun-Sam: 08:00-18:00, Dim: Fermé"
  },
  {
    name: "BenYedder Djerba Houmt Souk",
    address: "161, Avenue Habib Bourguiba – Houmt Souk – 4180",
    lat: 33.8759995,
    lng: 10.8583331,
    phone: "(+216) 75 650 166",
    hours: "Lun-Sam: 06:30-20:00, Dim: 06:30-13:30"
  },
  {
    name: "BenYedder Jendouba",
    address: "GP 6 Chorfa 1 – Jendouba",
    lat: 36.5094497,
    lng: 8.7993139,
    phone: "(+216) 78 612 882",
    hours: "Lun-Ven: 07:30-13:00, 14:00-17:00, Sam: 07:30-13:00, Dim: Fermé"
  },
  {
    name: "BenYedder Bizerte",
    address: "45 avenue habib bourguiba Bizerte 7000",
    lat: 37.2700208,
    lng: 9.8667422,
    phone: "N/A",
    hours: "Lun-Sam: 05:00-20:00, Dim: Fermé"
  },
  {
    name: "BenYedder Djerba Midoun",
    address: "Rue 13 Août Jerba Midoun",
    lat: 33.8072,
    lng: 10.9925,
    phone: "(+216) 75 730 011",
    hours: "Lun-Sam: 08:00-12:30, 14:30-18:00, Dim: Fermé"
  },
  {
    name: "BenYedder Midoun 2",
    address: "rue salah ben youssef",
    lat: 33.8100,
    lng: 10.9950,
    phone: "(+216) 70 011 100",
    hours: "Lun-Sam: 06:00-22:00, Dim: 06:00-13:00"
  },
  // 🏬 STANDS CAFÉ DU JOUR DANS LES GMS
  {
    name: "Stand BenYedder - Carrefour La Marsa",
    address: "Carrefour La Marsa, La Marsa",
    lat: 36.8789,
    lng: 10.3247,
    phone: "N/A",
    hours: "Selon horaires Carrefour",
    type: "stand"
  },
  {
    name: "Stand BenYedder - Géant Tunis City",
    address: "Géant Tunis City, Ariana",
    lat: 36.8625,
    lng: 10.1958,
    phone: "N/A",
    hours: "Selon horaires Géant",
    type: "stand"
  },
  {
    name: "Stand BenYedder - Géant Azur City",
    address: "Géant Azur City, Raoued",
    lat: 36.8956,
    lng: 10.1847,
    phone: "N/A",
    hours: "Selon horaires Géant",
    type: "stand"
  },
  {
    name: "Stand BenYedder - MG La Marsa",
    address: "Magasin Général La Marsa",
    lat: 36.8789,
    lng: 10.3200,
    phone: "N/A",
    hours: "Selon horaires MG",
    type: "stand"
  },
  {
    name: "Stand BenYedder - MG Ezzaouour",
    address: "Magasin Général Ezzaouour",
    lat: 36.8456,
    lng: 10.3123,
    phone: "N/A",
    hours: "Selon horaires MG",
    type: "stand"
  },
  {
    name: "Stand BenYedder - MG Mourouej 5",
    address: "Magasin Général Mourouej 5",
    lat: 36.8234,
    lng: 10.2567,
    phone: "N/A",
    hours: "Selon horaires MG",
    type: "stand"
  },
  {
    name: "Stand BenYedder - MG Cité Mahrajène",
    address: "Magasin Général Cité Mahrajène",
    lat: 36.8345,
    lng: 10.2234,
    phone: "N/A",
    hours: "Selon horaires MG",
    type: "stand"
  },
  {
    name: "Stand BenYedder - Monoprix Jardin El Menzah",
    address: "Monoprix Jardin El Menzah",
    lat: 36.8567,
    lng: 10.1789,
    phone: "N/A",
    hours: "Selon horaires Monoprix",
    type: "stand"
  },
  {
    name: "Stand BenYedder - MG Ibn Khaldoun",
    address: "Magasin Général Ibn Khaldoun",
    lat: 36.8123,
    lng: 10.1456,
    phone: "N/A",
    hours: "Selon horaires MG",
    type: "stand"
  },
  {
    name: "Stand BenYedder - Carrefour Mourouej 5",
    address: "Carrefour Mourouej 5",
    lat: 36.8234,
    lng: 10.2600,
    phone: "N/A",
    hours: "Selon horaires Carrefour",
    type: "stand"
  },
  {
    name: "Stand BenYedder - Monoprix Menzel Bourguiba",
    address: "Monoprix Menzel Bourguiba",
    lat: 37.1567,
    lng: 9.7845,
    phone: "N/A",
    hours: "Selon horaires Monoprix",
    type: "stand"
  },
  {
    name: "Stand BenYedder - Carrefour Mall Of Sousse",
    address: "Carrefour Mall Of Sousse",
    lat: 35.8234,
    lng: 10.6345,
    phone: "N/A",
    hours: "Selon horaires Carrefour",
    type: "stand"
  },
  {
    name: "Stand BenYedder - MG Sahloul",
    address: "Magasin Général Sahloul, Sousse",
    lat: 35.8456,
    lng: 10.6123,
    phone: "N/A",
    hours: "Selon horaires MG",
    type: "stand"
  },
  {
    name: "Stand BenYedder - MG Monastir",
    address: "Magasin Général Monastir",
    lat: 35.7667,
    lng: 10.8267,
    phone: "N/A",
    hours: "Selon horaires MG",
    type: "stand"
  },
  {
    name: "Stand BenYedder - MG Kairouan",
    address: "Magasin Général Kairouan",
    lat: 35.6781,
    lng: 10.0967,
    phone: "N/A",
    hours: "Selon horaires MG",
    type: "stand"
  },
  {
    name: "Stand BenYedder - Géant Bouriga Mall Djerba",
    address: "Géant Bouriga Mall Djerba",
    lat: 33.8567,
    lng: 10.8456,
    phone: "N/A",
    hours: "Selon horaires Géant",
    type: "stand"
  }
];




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
      },
      error => {
        alert("Impossible d'obtenir votre position : " + error.message);
      }
    );
  } else {
    alert("La géolocalisation n'est pas prise en charge par votre navigateur.");
  }
}


getUserLocation();

// Afficher automatiquement les boutiques BenYedder au chargement
showBenYedderLocations();

// 🔍 Gestion des suggestions de recherche
const destinationInput = document.getElementById('destinationInput');
const searchSuggestions = document.getElementById('searchSuggestions');

destinationInput.addEventListener('input', function() {
  const query = this.value.trim().toLowerCase();

  if (query.length < 2) {
    hideSuggestions();
    return;
  }

  if (isBenYedderSearch(query)) {
    showBenYedderSuggestions();
  } else {
    hideSuggestions();
  }
});

destinationInput.addEventListener('blur', function() {
  // Délai pour permettre le clic sur les suggestions
  setTimeout(() => {
    hideSuggestions();
  }, 200);
});

destinationInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    hideSuggestions();
    document.getElementById('searchBtn').click();
  }
});

function showBenYedderSuggestions() {
  if (!userMarker) {
    searchSuggestions.innerHTML = `
      <div class="suggestion-item">
        <span class="suggestion-icon">⚠️</span>
        <span class="suggestion-text">Activez la géolocalisation pour trouver le point le plus proche</span>
      </div>
    `;
    searchSuggestions.style.display = 'block';
    return;
  }

  const userPos = userMarker.getLatLng();

  // Calculer les distances et trier par proximité
  const storesWithDistance = benYedderLocations.map(location => ({
    ...location,
    distance: calculateDistance(userPos.lat, userPos.lng, location.lat, location.lng)
  })).sort((a, b) => a.distance - b.distance);

  searchSuggestions.innerHTML = '';

  // Ajouter la suggestion "plus proche"
  const nearestSuggestion = document.createElement('div');
  nearestSuggestion.className = 'suggestion-item';
  nearestSuggestion.innerHTML = `
    <span class="suggestion-icon">☕</span>
    <span class="suggestion-text">BenYedder le plus proche</span>
    <span class="suggestion-distance">${storesWithDistance[0].distance.toFixed(1)} km</span>
  `;
  nearestSuggestion.addEventListener('click', () => {
    destinationInput.value = 'BenYedder le plus proche';
    hideSuggestions();
    document.getElementById('searchBtn').click();
  });
  searchSuggestions.appendChild(nearestSuggestion);

  // Ajouter les 3 boutiques les plus proches
  storesWithDistance.slice(0, 3).forEach(store => {
    const suggestionItem = document.createElement('div');
    suggestionItem.className = 'suggestion-item';
    suggestionItem.innerHTML = `
      <span class="suggestion-icon">🏪</span>
      <span class="suggestion-text">${store.name}</span>
      <span class="suggestion-distance">${store.distance.toFixed(1)} km</span>
    `;
    suggestionItem.addEventListener('click', () => {
      destinationInput.value = store.name;
      hideSuggestions();
      navigateToBenYedder(store.lat, store.lng, store.name);
    });
    searchSuggestions.appendChild(suggestionItem);
  });

  searchSuggestions.style.display = 'block';
}

function hideSuggestions() {
  searchSuggestions.style.display = 'none';
}

// 🏪 Fonctions pour gérer les boutiques BenYedder
function createBenYedderIcon(location) {
  const isStand = location.type === 'stand';
  const iconHtml = isStand
    ? '<i class="fas fa-shopping-cart" style="color: #FF6B35; font-size: 18px;"></i>'
    : '<i class="fas fa-coffee" style="color: #8B4513; font-size: 20px;"></i>';

  return L.divIcon({
    html: iconHtml,
    iconSize: [30, 30],
    className: 'custom-div-icon'
  });
}

function showBenYedderLocations(filter = 'all') {
  // Effacer les marqueurs existants
  clearBenYedderMarkers();

  let locationsToShow = benYedderLocations;

  if (filter === 'boutiques') {
    locationsToShow = benYedderLocations.filter(location => location.type !== 'stand');
  } else if (filter === 'stands') {
    locationsToShow = benYedderLocations.filter(location => location.type === 'stand');
  }

  locationsToShow.forEach(location => {
    const marker = L.marker([location.lat, location.lng], {
      icon: createBenYedderIcon(location)
    }).addTo(map);

    const isStand = location.type === 'stand';
    const icon = isStand ? '🛒' : '☕';
    const typeText = isStand ? 'Stand Café du Jour' : 'Boutique';
    const buttonColor = isStand ? '#FF6B35' : '#8B4513';

    const popupContent = `
      <div style="min-width: 250px;">
        <h3 style="color: ${buttonColor}; margin: 0 0 10px 0;">${icon} ${location.name}</h3>
        <p style="margin: 5px 0; font-size: 0.9em; color: #666;"><strong>Type:</strong> ${typeText}</p>
        <p style="margin: 5px 0;"><strong>📍 Adresse:</strong><br>${location.address}</p>
        <p style="margin: 5px 0;"><strong>📞 Téléphone:</strong> ${location.phone}</p>
        <p style="margin: 5px 0;"><strong>🕒 Horaires:</strong><br>${location.hours}</p>
        <button onclick="navigateToBenYedder(${location.lat}, ${location.lng}, '${location.name}')"
                style="background: ${buttonColor}; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; margin-top: 10px;">
          🧭 Naviguer vers ce ${isStand ? 'stand' : 'boutique'}
        </button>
      </div>
    `;

    marker.bindPopup(popupContent);
    benYedderMarkers.push(marker);
  });

  // Afficher la liste dans le panneau latéral
  updateBenYedderList(filter);
}

function updateBenYedderList(filter = 'all') {
  const benYedderListElement = document.getElementById('benYedderList');
  if (!benYedderListElement) return;

  benYedderListElement.innerHTML = '';

  let locationsToShow = benYedderLocations;

  if (filter === 'boutiques') {
    locationsToShow = benYedderLocations.filter(location => location.type !== 'stand');
  } else if (filter === 'stands') {
    locationsToShow = benYedderLocations.filter(location => location.type === 'stand');
  }

  locationsToShow.forEach((location, index) => {
    const isStand = location.type === 'stand';
    const icon = isStand ? '🛒' : '☕';
    const bgColor = isStand ? '#fff5f0' : '#f8fafc';
    const borderColor = isStand ? '#ffccb3' : '#e0e7ff';
    const textColor = isStand ? '#FF6B35' : '#8B4513';
    const buttonColor = isStand ? '#FF6B35' : '#8B4513';

    const locationElement = document.createElement('div');
    locationElement.className = 'benyedder-item';
    locationElement.innerHTML = `
      <div style="background: ${bgColor}; margin-bottom: 8px; padding: 12px; border-radius: 10px; border: 1px solid ${borderColor}; cursor: pointer; transition: all 0.3s ease;">
        <h4 style="margin: 0 0 5px 0; color: ${textColor}; font-size: 0.9rem;">${icon} ${location.name}</h4>
        <p style="margin: 2px 0; font-size: 0.75rem; color: #888;">${isStand ? 'Stand Café du Jour' : 'Boutique'}</p>
        <p style="margin: 2px 0; font-size: 0.8rem; color: #666;">📍 ${location.address}</p>
        <p style="margin: 2px 0; font-size: 0.8rem; color: #666;">📞 ${location.phone}</p>
        <button onclick="navigateToBenYedder(${location.lat}, ${location.lng}, '${location.name}')"
                style="background: ${buttonColor}; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; margin-top: 5px; font-size: 0.8rem;">
          🧭 Y aller
        </button>
      </div>
    `;

    locationElement.addEventListener('click', () => {
      map.setView([location.lat, location.lng], 15);
      benYedderMarkers[index].openPopup();
    });

    benYedderListElement.appendChild(locationElement);
  });
}

function clearBenYedderMarkers() {
  benYedderMarkers.forEach(marker => {
    map.removeLayer(marker);
  });
  benYedderMarkers = [];

  // Effacer aussi la liste dans le panneau latéral
  const benYedderListElement = document.getElementById('benYedderList');
  if (benYedderListElement) {
    benYedderListElement.innerHTML = '';
  }
}

function navigateToBenYedder(lat, lng, name) {
  if (!userMarker) {
    alert("Veuillez attendre que votre position soit détectée ou activer la géolocalisation.");
    return;
  }

  const destinationLatLng = [lat, lng];

  // Supprimer l'ancien itinéraire s'il existe
  if (routeControl) {
    map.removeControl(routeControl);
  }

  // Créer un nouvel itinéraire
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

  });

  map.setView(destinationLatLng, 15);
  enregistrerRecherche(name);
}

document.getElementById('refreshLocationBtn')?.addEventListener('click', getUserLocation);


// 🔍 Fonction pour calculer la distance entre deux points
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance en km
}

// 🏪 Fonction pour trouver la boutique BenYedder la plus proche
function findNearestBenYedder() {
  if (!userMarker) {
    alert("Veuillez attendre que votre position soit détectée ou activer la géolocalisation.");
    return null;
  }

  const userPos = userMarker.getLatLng();
  let nearestStore = null;
  let minDistance = Infinity;

  benYedderLocations.forEach(location => {
    const distance = calculateDistance(userPos.lat, userPos.lng, location.lat, location.lng);
    if (distance < minDistance) {
      minDistance = distance;
      nearestStore = { ...location, distance };
    }
  });

  return nearestStore;
}

// 🔍 Fonction pour vérifier si la recherche concerne BenYedder
function isBenYedderSearch(query) {
  const benYedderKeywords = [
    'benyedder', 'ben yedder', 'ben-yedder', 'café ben yedder', 'cafés ben yedder',
    'cafe ben yedder', 'cafes ben yedder', 'coffee ben yedder', 'بن يدر',
    'مقهى بن يدر', 'قهوة بن يدر'
  ];

  const normalizedQuery = query.toLowerCase().trim();
  return benYedderKeywords.some(keyword => normalizedQuery.includes(keyword));
}

document.getElementById('searchBtn').addEventListener('click', () => {
  const query = document.getElementById('destinationInput').value.trim();
  if (!query) return;

  if (!userMarker) {
    alert("Veuillez attendre que votre position soit détectée ou activer la géolocalisation.");
    return;
  }

  // 🏪 Vérifier si c'est une recherche BenYedder
  if (isBenYedderSearch(query)) {
    const nearestStore = findNearestBenYedder();
    if (nearestStore) {
      alert(`Point BenYedder le plus proche trouvé : ${nearestStore.name}, à ${nearestStore.distance.toFixed(1)} kilomètres de votre position.`);

      // Mettre en évidence la boutique la plus proche
      showBenYedderLocations();

      // Naviguer vers la boutique la plus proche
      setTimeout(() => {
        navigateToBenYedder(nearestStore.lat, nearestStore.lng, nearestStore.name);
      }, 1000);

      enregistrerRecherche(`BenYedder le plus proche - ${nearestStore.name}`);
      return;
    }
  }

  // 🗺️ Recherche normale avec l'API de géocodage
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

        });

        map.setView(destinationLatLng, 13);
        enregistrerRecherche(query);
      } else {
        alert("Destination introuvable.");
      }
    })
    .catch(error => {
      console.error("Erreur API :", error);
      alert("Erreur lors de la recherche.");
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






// 🏪 Événements pour les boutons BenYedder
document.getElementById('showBenYedderBtn')?.addEventListener('click', () => {
  showBenYedderLocations('all');
});

document.getElementById('showBoutiquesBtn')?.addEventListener('click', () => {
  showBenYedderLocations('boutiques');
});

document.getElementById('showStandsBtn')?.addEventListener('click', () => {
  showBenYedderLocations('stands');
});

document.getElementById('hideBenYedderBtn')?.addEventListener('click', () => {
  clearBenYedderMarkers();
});