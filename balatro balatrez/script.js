const elements = [
  {symbol:"H",name:"Hydrogen",value:1,type:"gas"},
  {symbol:"O",name:"Oxygen",value:8,type:"gas"},
  {symbol:"Na",name:"Sodium",value:11,type:"metal"},
  {symbol:"Cl",name:"Chlorine",value:17,type:"halogen"},
  {symbol:"C",name:"Carbon",value:6,type:"nonmetal"},
  {symbol:"N",name:"Nitrogen",value:7,type:"gas"},
  {symbol:"Fe",name:"Iron",value:26,type:"metal"},
  {symbol:"He",name:"Helium",value:2,type:"noble"},
  {symbol:"Ne",name:"Neon",value:10,type:"noble"},
  {symbol:"K",name:"Potassium",value:19,type:"metal"}
];

const handDiv = document.getElementById("hand");
const playedDiv = document.getElementById("played-hand");
const scoreText = document.getElementById("score");
const playBtn = document.getElementById("play-btn");

let hand = [];
let selected = [];

let totalScore = 0;

let blind = 500;
let handsLeft = 4;

function randomCard(){
  return elements[Math.floor(Math.random()*elements.length)];
}

function generateHand(){

  hand = [];

  for(let i=0;i<8;i++){
    hand.push(randomCard());
  }

  renderHand();
}

function renderHand(){

  handDiv.innerHTML = "";

  hand.forEach((card,index)=>{

    const div = document.createElement("div");

    div.className = "card";

    if(selected.includes(index)){
      div.classList.add("selected");
    }

    div.innerHTML = `
      <div class="symbol">${card.symbol}</div>
      <div class="name">${card.name}</div>
      <div class="type">${card.type}</div>
    `;

    div.onclick = ()=>toggleCard(index);

    handDiv.appendChild(div);

  });

}

function toggleCard(index){

  if(selected.includes(index)){

    selected = selected.filter(i=>i!==index);

  }else{

    if(selected.length < 5){
      selected.push(index);
    }

  }

  renderHand();
}

function detectReaction(cards){

  const types = {};

  cards.forEach(c=>{

    types[c.type] = (types[c.type] || 0) + 1;

  });

  const counts = Object.values(types);

  if(counts.includes(5)){
    return {
      name:"REACCIÓN PERFECTA",
      mult:10
    };
  }

  if(counts.includes(4)){
    return {
      name:"COMPUESTO INESTABLE",
      mult:7
    };
  }

  if(counts.includes(3) && counts.includes(2)){
    return {
      name:"FUSIÓN COMPLEJA",
      mult:6
    };
  }

  if(counts.includes(3)){
    return {
      name:"REACCIÓN TRIPLE",
      mult:4
    };
  }

  if(counts.filter(c=>c===2).length >= 2){
    return {
      name:"DOBLE ENLACE",
      mult:3
    };
  }

  if(counts.includes(2)){
    return {
      name:"ENLACE SIMPLE",
      mult:2
    };
  }

  return {
    name:"REACCIÓN CAÓTICA",
    mult:1
  };

}

function createParticles(text){

  const particle = document.createElement("div");

  particle.innerText = text;

  particle.style.position = "absolute";
  particle.style.top = "40%";
  particle.style.left = "50%";
  particle.style.transform = "translate(-50%,-50%)";
  particle.style.fontSize = "40px";
  particle.style.color = "#00ffcc";
  particle.style.fontWeight = "bold";
  particle.style.textShadow = "0 0 20px #00ffcc";
  particle.style.animation = "pop 1s forwards";

  document.body.appendChild(particle);

  setTimeout(()=>{
    particle.remove();
  },1000);

}

function playHand(){

  if(selected.length === 0) return;

  if(handsLeft <= 0){
    alert("SIN MANOS");
    return;
  }

  playedDiv.innerHTML = "";

  const playedCards = [];

  let chips = 0;

  selected.forEach(index=>{

    const card = hand[index];

    playedCards.push(card);

    chips += card.value;

    const div = document.createElement("div");

    div.className = "card played";

    div.innerHTML = `
      <div class="symbol">${card.symbol}</div>
      <div class="name">${card.name}</div>
    `;

    playedDiv.appendChild(div);

  });

  const reaction = detectReaction(playedCards);

  const finalScore = chips * reaction.mult;

  totalScore += finalScore;

  scoreText.innerText = totalScore;

  createParticles(`+${finalScore}`);

  createParticles(reaction.name);

  handsLeft--;

  selected = [];

  if(totalScore >= blind){

    setTimeout(()=>{

      alert("BLIND SUPERADA");

      blind += 500;

      handsLeft = 4;

    },500);

  }

  generateHand();

}

playBtn.onclick = playHand;

generateHand();