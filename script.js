const branches = {
  CAP: {
    title: "Civil Air Patrol Incident Alert",
    terms: ["squadron", "sortie", "wing staff", "ICP"],
  },
  "Texas Wing": {
    title: "Texas Wing Incident Alert",
    terms: ["county responders", "group command", "state mission", "ELT"],
  },
  FEMA: {
    title: "FEMA Operational Dispatch",
    terms: ["EOC", "resource request", "federal support", "task force"],
  },
  "Coast Guard": {
    title: "USCG Mission Alert",
    terms: ["sector command", "SAR pattern", "cutter", "air station"],
  },
  "Air Force Rescue": {
    title: "Air Force Rescue Tasking",
    terms: ["AFRCC", "CSAR", "rescue package", "aerial coordination"],
  },
  "Sheriff SAR": {
    title: "Sheriff SAR Dispatch",
    terms: ["deputies", "mutual aid", "incident command", "K9 team"],
  },
  "Budget volunteer SAR": {
    title: "Volunteer SAR Callout",
    terms: ["donated fuel", "ham radio", "boots on ground", "borrowed UAV"],
  },
};

const categories = {
  "Aviation Emergencies": {
    types: [
      "ELT activation",
      "Overdue aircraft",
      "Missing student pilot",
      "Runway incursion",
      "Emergency beacon offshore",
      "Medevac coordination",
      "Drone interference",
      "Lost glider",
      "Weather diversion",
    ],
    complications: [
      "intermittent radio contact",
      "icing reported at target altitude",
      "night operations with low ceiling",
      "fuel state for subject aircraft is unknown",
      "cross-border coordination delay",
    ],
    assets: [
      "1 Cessna 182, 1 Ground Team",
      "2 Aircrews, 1 Drone Team",
      "1 Helo support request pending",
      "1 ARCHER sortie, 1 mission base cell",
    ],
  },
  "Search & Rescue": {
    types: [
      "Lost hiker",
      "Dementia wanderer",
      "Missing child",
      "Overdue hunter",
      "Flood evacuation",
      "Collapsed cave response",
      "Stranded kayaker",
      "Wildfire spotting",
    ],
    complications: [
      "cell coverage dead zone",
      "fading tracks after rainfall",
      "multiple unverified sightings",
      "volunteer convergence traffic",
      "sunset in less than 50 minutes",
    ],
    assets: [
      "2 Ground Teams, 1 K9, 1 UTV",
      "1 Aircrew, 2 Ground Teams",
      "Sheriff deputies + volunteer SAR strike team",
      "Drone overwatch + medical standby",
    ],
  },
  "Disaster Relief": {
    types: [
      "Tornado damage assessment",
      "Hurricane aerial imagery",
      "Wildfire reconnaissance",
      "Earthquake comms outage",
      "Supply transport",
      "Shelter coordination",
    ],
    complications: [
      "FAA TFR active near response corridor",
      "fuel shortages at regional airports",
      "comms channels overloaded",
      "roads blocked by debris",
      "incoming weather front in 2 hours",
    ],
    assets: [
      "2 Aircrews, 1 comms trailer",
      "Ground convoy + portable repeater",
      "IMT liaison + aerial imagery package",
      "1 high-wing aircraft + shelter support team",
    ],
  },
  "CAP Chaos": {
    types: [
      "Cadet locked inside van trailer",
      "Missing squadron coffee urn",
      "Sortie paperwork filed in Comic Sans",
      "Group Commander ETA 20 minutes",
      "Projector incompatible with briefing laptop",
      "ELT turns out to be gym treadmill",
    ],
    complications: [
      "everyone swears they followed the checklist",
      "the only key is in someone else's flight suit",
      "the comms plan was printed double-sided upside-down",
      "operations section is arguing over snack accountability",
      "meme escalation risk now critical",
    ],
    assets: [
      "1 stressed mission staff, 3 clipboards",
      "2 cadets, 1 very confused senior member",
      "coffee substitute and raw determination",
      "borrowed projector + emergency extension cord",
    ],
  },
};

const terrains = ["swamps", "desert", "mountains", "suburban grid", "forests", "abandoned industrial area", "rural farmland"];
const weathers = ["Clear / 10 mi visibility", "Thunderstorms / 2 mi visibility", "Low overcast / 3 mi visibility", "Windy / turbulence moderate", "Fog pockets / 1 mi visibility"];
const objectivesPool = ["Locate beacon or subject", "Coordinate with local responders", "Establish ICP", "Maintain crew safety and accountability", "Provide status updates every 20 minutes", "Document mission timeline"];
const actionChoices = ["Deploy aircrew", "Launch ground team", "Wait for weather", "Coordinate with sheriff", "Request AFRCC support"];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildTime() {
  const hh = String(Math.floor(Math.random() * 24)).padStart(2, "0");
  const mm = String(Math.floor(Math.random() * 60)).padStart(2, "0");
  return `${hh}${mm} Local`;
}

function calculateRisk(weather, complication, missionType) {
  let score = 0;
  if (weather.includes("Thunderstorms") || weather.includes("Fog")) score += 2;
  if (complication.includes("night") || complication.includes("fuel") || complication.includes("overloaded")) score += 2;
  if (missionType.toLowerCase().includes("missing") || missionType.toLowerCase().includes("wildfire")) score += 1;

  if (score <= 1) return "🟢 Low";
  if (score <= 3) return "🟡 Moderate";
  if (score <= 5) return "🔴 Severe";
  return "☠️ Good luck";
}

function generateMission() {
  const branch = branchSelect.value;
  const mode = modeSelect.value;
  const profile = categories[mode];
  const org = branches[branch];

  const missionType = pick(profile.types);
  const weather = pick(weathers);
  const complication = pick(profile.complications);
  const assets = pick(profile.assets);
  const location = `${pick(terrains)} near ${pick(["Abilene", "Galveston", "Tucson", "Boise", "Orlando", "Knoxville", "Reno"])}`;
  const note = `${pick(org.terms)} reports possible escalation if not resolved quickly.`;

  missionTitle.textContent = org.title.toUpperCase();
  time.textContent = buildTime();
  missionTypeEl.textContent = missionType;
  locationEl.textContent = location;
  weatherEl.textContent = weather;
  assetsEl.textContent = assets;
  complicationEl.textContent = complication;
  notesEl.textContent = note;
  riskEl.textContent = calculateRisk(weather, complication, missionType);

  objectivesEl.innerHTML = "";
  [...objectivesPool].sort(() => Math.random() - 0.5).slice(0, 3).forEach((goal) => {
    const li = document.createElement("li");
    li.textContent = goal;
    objectivesEl.appendChild(li);
  });

  missionCard.classList.remove("hidden");
  outcome.textContent = "";
}

function resolveAction(action) {
  const responses = {
    "Deploy aircrew": [
      "Aircrew launched, but visibility is deteriorating. Fuel reserve planning is now critical.",
      "Aircrew on scene confirms heat signature near treeline; ground support requested.",
    ],
    "Launch ground team": [
      "Ground team reports difficult access roads and requests alternate ingress route.",
      "Ground team made contact with witnesses who heard an impact 2 miles east.",
    ],
    "Wait for weather": [
      "Weather improves slightly, but daylight window is shrinking fast.",
      "Storm track shifted; delay reduced air option risk but increased survivor exposure risk.",
    ],
    "Coordinate with sheriff": [
      "Sheriff dispatch provides updated coordinates and assigns traffic control to your ICP.",
      "County responders agree to unified command; comms plan updated successfully.",
    ],
    "Request AFRCC support": [
      "AFRCC acknowledges request and asks for latest beacon triangulation.",
      "Additional federal coordination initiated; expect 30-minute response lag.",
    ],
  };

  outcome.textContent = pick(responses[action]);
}

const branchSelect = document.getElementById("branch");
const modeSelect = document.getElementById("mode");
const generateBtn = document.getElementById("generateBtn");
const missionCard = document.getElementById("missionCard");
const missionTitle = document.getElementById("missionTitle");
const missionTypeEl = document.getElementById("missionType");
const locationEl = document.getElementById("location");
const weatherEl = document.getElementById("weather");
const assetsEl = document.getElementById("assets");
const complicationEl = document.getElementById("complication");
const notesEl = document.getElementById("notes");
const objectivesEl = document.getElementById("objectives");
const riskEl = document.getElementById("risk");
const outcome = document.getElementById("outcome");
const actionsEl = document.getElementById("actions");

Object.keys(branches).forEach((name) => {
  const option = document.createElement("option");
  option.value = name;
  option.textContent = name;
  branchSelect.appendChild(option);
});

Object.keys(categories).forEach((name) => {
  const option = document.createElement("option");
  option.value = name;
  option.textContent = name;
  modeSelect.appendChild(option);
});

actionChoices.forEach((choice) => {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = choice;
  btn.addEventListener("click", () => resolveAction(choice));
  actionsEl.appendChild(btn);
});

generateBtn.addEventListener("click", generateMission);
