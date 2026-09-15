const CLUB = {
  name: "Web Dev Club",
  email: "club@example.edu",
  discord: "#",
  founded: "20XX",
  meeting: "Day, time and location — confirm before launch"
};

const events = [
  {title:"Intro to Git & GitHub", type:"Workshop", date:"2026-09-24", time:"TBD", location:"TBD", desc:"A beginner-friendly session on version control, repositories and collaboration."},
  {title:"Build Night", type:"Social", date:"2026-10-01", time:"TBD", location:"TBD", desc:"Bring an idea, pair up and build together."},
  {title:"Web Project Showcase", type:"Guest Talk", date:"2026-10-15", time:"TBD", location:"TBD", desc:"Members share projects, lessons learned and demos."}
];

const projects = [
  {name:"Club Portal", category:"web app", status:"In Progress", tech:["HTML","CSS","JavaScript"], desc:"A central home for club information, events and resources."},
  {name:"Campus Events Hub", category:"web app", status:"Completed", tech:["React","JavaScript"], desc:"A searchable interface for discovering student events."},
  {name:"Study Buddy", category:"tool", status:"Completed", tech:["Python","JavaScript"], desc:"A lightweight tool for organizing study sessions and tasks."},
  {name:"Open Source Starter", category:"open-source", status:"In Progress", tech:["Git","HTML","CSS"], desc:"A beginner-friendly contribution path for new developers."}
];

const posts = [
  {title:"Welcome to the Web Dev Club", category:"Announcements", date:"2026-09-15", author:"Club Team", read:"3 min", desc:"What the club is building, learning and planning this term."},
  {title:"What We Learned From Our First Build Night", category:"Event Recaps", date:"2026-09-10", author:"Club Team", read:"5 min", desc:"A recap of ideas, challenges and lessons from collaborative building."},
  {title:"A Beginner's Path Into Web Development", category:"Tutorials", date:"2026-09-05", author:"Club Team", read:"7 min", desc:"A practical starting sequence: HTML, CSS, JavaScript, Git and a first project."}
];

function initNav(){
  const toggle=document.querySelector(".mobile-toggle");
  const links=document.querySelector(".nav-links");
  if(toggle) toggle.addEventListener("click",()=>links.classList.toggle("open"));
  const page=document.body.dataset.page;
  document.querySelectorAll(".nav-links a").forEach(a=>{
    if(a.dataset.page===page) a.classList.add("active");
  });
  const year=document.querySelector("[data-year]");
  if(year) year.textContent=new Date().getFullYear();
}
function renderHome(){
  const e=document.querySelector("#home-events");
  if(e) e.innerHTML=events.slice(0,1).map(eventCard).join("");
  const p=document.querySelector("#home-projects");
  if(p) p.innerHTML=projects.slice(0,3).map(projectCard).join("");
}
function eventCard(e){
  return `<article class="card"><div class="meta">${e.type} · ${e.date}</div><h3>${e.title}</h3><p>${e.desc}</p><div class="meta">${e.time} · ${e.location}</div><div style="margin-top:16px"><a class="btn secondary" href="#">RSVP / Add to calendar</a></div></article>`;
}
function projectCard(p){
  return `<article class="card project-card" data-tech="${p.tech.join(",").toLowerCase()}" data-category="${p.category}" data-status="${p.status.toLowerCase()}"><div class="project-thumb">PROJECT PREVIEW</div><h3>${p.name}</h3><p>${p.desc}</p><div class="tags">${p.tech.map(t=>`<span class="tag">${t}</span>`).join("")}</div><div class="meta">${p.status} · ${p.category}</div></article>`;
}
function postCard(p){
  return `<article class="card"><div class="post-thumb">${p.category.toUpperCase()}</div><div class="meta">${p.date} · ${p.read} · ${p.author}</div><h3>${p.title}</h3><p>${p.desc}</p><a class="link" href="#">Read more →</a></article>`;
}
function initFilters(selector, cardsSelector){
  document.querySelectorAll(selector).forEach(button=>{
    button.addEventListener("click",()=>{
      document.querySelectorAll(selector).forEach(b=>b.classList.remove("active"));
      button.classList.add("active");
      const value=button.dataset.filter;
      document.querySelectorAll(cardsSelector).forEach(card=>{
        const hay=(card.dataset.tech||"")+" "+(card.dataset.category||"")+" "+(card.dataset.status||"");
        card.classList.toggle("hidden", value!=="all" && !hay.includes(value.toLowerCase()));
      });
    });
  });
}
function renderCollections(){
  const eg=document.querySelector("#events-grid");
  if(eg) eg.innerHTML=events.map(eventCard).join("");
  const pg=document.querySelector("#projects-grid");
  if(pg) pg.innerHTML=projects.map(projectCard).join("");
  const bg=document.querySelector("#blog-grid");
  if(bg) bg.innerHTML=posts.map(postCard).join("");
}
document.addEventListener("DOMContentLoaded",()=>{
  initNav(); renderHome(); renderCollections();
  initFilters(".project-filter",".project-card");
  initFilters(".event-filter","#events-grid .card");
  const form=document.querySelector("#join-form");
  if(form) form.addEventListener("submit",e=>{e.preventDefault();document.querySelector("#form-status").textContent="Thanks! This demo form is ready to connect to your chosen signup service.";});
});
