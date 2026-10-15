(() => {
const ACCESS_CODE="galaxy2026";
const SONG_KEY="galaxySongs";
const PHOTO_KEY="galaxyPhotos";

const $=id=>document.getElementById(id);
function init(){
  const loginScreen=$("loginScreen"), site=$("site"), loginBtn=$("loginBtn"), code=$("accessCode"), msg=$("loginMsg");
  if(localStorage.getItem("galaxyAccess")==="yes"){loginScreen.classList.add("hidden");site.classList.remove("hidden");}
  loginBtn.addEventListener("click",login);
  code.addEventListener("keydown",e=>{if(e.key==="Enter")login();});
  document.querySelectorAll("[data-page]").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.page)));
  $("addSong").addEventListener("click",addSong);
  $("postPhoto").addEventListener("click",addPhoto);
  $("photoFile").addEventListener("change",previewPhoto);
  renderSongs(); renderPhotos();

  function login(){
    if(code.value===ACCESS_CODE){
      localStorage.setItem("galaxyAccess","yes");
      loginScreen.classList.add("hidden"); site.classList.remove("hidden"); msg.textContent="";
    }else msg.textContent="접속 코드가 맞지 않습니다.";
  }
}
function showPage(id){
  document.querySelectorAll(".page").forEach(p=>p.classList.add("hidden"));
  $(id).classList.remove("hidden"); window.scrollTo({top:0,behavior:"smooth"});
}
function get(key){try{return JSON.parse(localStorage.getItem(key)||"[]")}catch{return[]}}
function save(key,data){localStorage.setItem(key,JSON.stringify(data))}
function addSong(){
  const title=$("songTitle").value.trim(), url=$("songUrl").value.trim();
  if(!title){alert("노래 제목을 입력해주세요.");return}
  const arr=get(SONG_KEY); arr.unshift({id:Date.now(),title,url}); save(SONG_KEY,arr);
  $("songTitle").value="";$("songUrl").value="";renderSongs();
}
function renderSongs(){
  const box=$("songList"),arr=get(SONG_KEY);box.innerHTML="";
  if(!arr.length){box.innerHTML="<p>아직 추천된 노래가 없습니다.</p>";return}
  arr.forEach(x=>{
    const el=document.createElement("div");el.className="post";
    el.innerHTML="<button class='delete' data-del-song='"+x.id+"'>삭제</button><h3>🎵 "+esc(x.title)+"</h3>";
    if(x.url)el.innerHTML+="<p><a href='"+escAttr(x.url)+"' target='_blank' rel='noopener' style='color:#aab8ff'>YouTube에서 열기</a></p>";
    box.appendChild(el);
  });
  box.querySelectorAll("[data-del-song]").forEach(b=>b.onclick=()=>{save(SONG_KEY,get(SONG_KEY).filter(x=>x.id!=b.dataset.delSong));renderSongs()});
}
function previewPhoto(){
  const f=$("photoFile").files[0],box=$("preview");box.innerHTML="";
  if(!f)return;
  const r=new FileReader();r.onload=e=>box.innerHTML="<img src='"+e.target.result+"' alt='미리보기'>";r.readAsDataURL(f);
}
function addPhoto(){
  const f=$("photoFile").files[0],text=$("photoText").value.trim();
  if(!f){alert("사진을 선택해주세요.");return}
  const r=new FileReader();r.onload=e=>{
    const arr=get(PHOTO_KEY);arr.unshift({id:Date.now(),src:e.target.result,text});save(PHOTO_KEY,arr);
    $("photoFile").value="";$("photoText").value="";$("preview").innerHTML="";renderPhotos();
  };r.readAsDataURL(f);
}
function renderPhotos(){
  const box=$("photoList"),arr=get(PHOTO_KEY);box.innerHTML="";
  if(!arr.length){box.innerHTML="<p>아직 사진이 없습니다.</p>";return}
  arr.forEach(x=>{
    const el=document.createElement("div");el.className="post";
    el.innerHTML="<button class='delete' data-del-photo='"+x.id+"'>삭제</button><img src='"+x.src+"' alt='공유 사진'><p>"+esc(x.text||"")+"</p>";
    box.appendChild(el);
  });
  box.querySelectorAll("[data-del-photo]").forEach(b=>b.onclick=()=>{save(PHOTO_KEY,get(PHOTO_KEY).filter(x=>x.id!=b.dataset.delPhoto));renderPhotos()});
}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function escAttr(s){return esc(s).replace(/javascript:/gi,"")}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();