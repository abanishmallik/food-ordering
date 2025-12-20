function myFun(){
    let searchVal = document.getElementById("inp").value.toUpperCase() ;
    let table = document.getElementsByTagName("table")
    let tr = document.getElementsByTagName("tr");

    let front = document.querySelector(".main")

    for(let i=0; i<tr.length; i++){
        let td = tr[i].getElementsByTagName("td")[0];
        if(td){
            let text = td.innerText;
            if(text.toLocaleUpperCase().indexOf(searchVal) > -1){
                tr[i].style.display="";
                front.style.display="none"
            }else{
                tr[i].style.display="none"
            }
        }
    }

    if(searchVal == ""){
        front.style.display="flex"
    }
    console.log(searchVal);
}



function nav(){
    let nav = document.querySelector(".nav");
    nav.style.display="block"
    let login = document.querySelector(".login");
    login.style.display="none";

}

function login(){
    let login = document.querySelector(".login");
    login.style.display="block";
    alert("Click on 'OK' button to login");

    let nav = document.querySelector(".nav");
    nav.style.display="none"
    

}

// Foodweb.js - add site interactivity: search, cart, login modal, nav toggle, reviews carousel, slider auto-rotate

// Search/filter functionality
function myFun() {
  const q = document.getElementById('inp').value.trim().toLowerCase();
  const items = document.querySelectorAll('.card, .blog');
  items.forEach(item => {
    const text = (item.getAttribute('data-search') || item.textContent).toLowerCase();
    if (!q || text.includes(q)) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  });
}

// Simple cart implementation using localStorage
const CART_KEY = 'foodlab_cart_v1';
function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) { return []; }
}
function saveCart(cart) { localStorage.setItem(CART_KEY, JSON.stringify(cart)); updateCartCount(); }
function updateCartCount() {
  const countEl = document.getElementById('cart-count');
  if (!countEl) return;
  const cart = getCart();
  const totalQty = cart.reduce((s,i) => s + (i.qty||1), 0);
  countEl.textContent = totalQty;
}

function addToCart(btn) {
  const name = btn.dataset.name;
  const price = parseFloat(btn.dataset.price) || 0;
  const cart = getCart();
  const existing = cart.find(i=>i.name===name);
  if (existing) { existing.qty = (existing.qty||1) + 1; }
  else { cart.push({name,price,qty:1}); }
  saveCart(cart);
  // simple feedback
  btn.textContent = 'Added ✓';
  setTimeout(()=> btn.textContent = 'Order Now',1200);
}

function openCart() {
  const cart = getCart();
  if (cart.length===0) {
    alert('Your cart is empty');
    return;
  }
  // build simple cart summary
  const lines = cart.map(i=>`${i.name} x${i.qty} — ₹${(i.price*i.qty).toFixed(2)}`);
  const total = cart.reduce((s,i)=> s + i.price*i.qty, 0);
  if (confirm(lines.join('\n') + `\n\nTotal: ₹${total.toFixed(2)}\n\nCheckout?`)) {
    // clear cart to simulate checkout
    localStorage.removeItem(CART_KEY);
    updateCartCount();
    alert('Thank you! Order placed (demo)');
  }
}

// Nav toggle for mobile
function nav() {
  const main = document.getElementById('main-nav');
  if (!main) return;
  main.style.display = main.style.display === 'block' ? 'none' : 'block';
}

// Login modal behavior
function login() {
  const modal = document.getElementById('loginModal');
  if (!modal) return;
  modal.style.display = 'block';
  modal.setAttribute('aria-hidden','false');
  document.getElementById('login-name').focus();
}
function closeLogin() {
  const modal = document.getElementById('loginModal');
  if (!modal) return;
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden','true');
}

// Hook login submit (demo)
document.addEventListener('DOMContentLoaded', ()=>{
  const btn = document.getElementById('login-submit');
  if (btn) btn.addEventListener('click', ()=>{
    const name = document.getElementById('login-name').value.trim();
    if (!name) { alert('Please enter name'); return; }
    localStorage.setItem('foodlab_user', name);
    closeLogin();
    alert('Welcome, ' + name + ' (demo)');
  });

  updateCartCount();

  // bind keyboard escape to close modal
  document.addEventListener('keydown', (e)=>{
    if (e.key==='Escape') closeLogin();
  });

  // reviews carousel
  window.reviewIndex = 0;
  const reviews = document.querySelectorAll('.review .customer');
  function showReview(i){
    reviews.forEach((r,idx)=> r.classList.toggle('active', idx===i));
  }
  if (reviews.length) showReview(0);
  window.pre = function(){ window.reviewIndex = (window.reviewIndex -1 + reviews.length) % reviews.length; showReview(window.reviewIndex); };
  window.next = function(){ window.reviewIndex = (window.reviewIndex +1) % reviews.length; showReview(window.reviewIndex); };

  // auto rotate hero slider radios every 4s
  const radios = ['r1','r2','r3','r4','r5'].map(id=>document.getElementById(id)).filter(Boolean);
  let slideIndex = 0;
  if (radios.length) setInterval(()=>{
    radios[slideIndex].checked = true;
    slideIndex = (slideIndex + 1) % radios.length;
  }, 4000);
});

// Place beverage images (mango.jpg, coldcoffee.jpg, lemonsoda.jpg, mojito.jpg, hotchoc.jpg) in your project folder for them to display correctly.
(function(){

  function buildBeverageCard(b){
    const div = document.createElement('div');
    div.className = 'card';
    div.setAttribute('data-search', b.search);
    div.setAttribute('role','article');
    div.innerHTML = `
      <p>${b.name}</p>
      <button onclick="addToCart(this)" data-name="${b.name}" data-price="${b.price}">Order Now</button>
    `;
    return div;
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    const btn = document.getElementById('explore-btn');
    const section = document.getElementById('beverage-section');
    const list = document.getElementById('beverage-list');
    if (!btn || !section || !list) return;

    let populated = false;
    btn.addEventListener('click', ()=>{
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      section.style.display = expanded ? 'none' : 'block';
      if (!populated) {
        beverages.forEach(b => list.appendChild(buildBeverageCard(b)));
        populated = true;
      }
      // smooth scroll into view
      if (!expanded) section.scrollIntoView({behavior:'smooth'});
    });
  });
})();
