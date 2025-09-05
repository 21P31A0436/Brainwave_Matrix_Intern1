// ShopSwift JS
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

const products = [
  {
    id: 1,
    name: "Aero Running Shoes",
    category: "Footwear",
    price: 2399,
    rating: 4.5,
    desc: "Breathable mesh upper, cushioned sole. Perfect for daily runs & gym.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Classic Denim Jacket",
    category: "Fashion",
    price: 1999,
    rating: 4.2,
    desc: "Timeless medium-wash denim with inner pockets and sturdy stitching.",
    image: "https://images-na.ssl-images-amazon.com/images/I/A1aK3vkRkzL.jpg"
  },
  {
    id: 3,
    name: "Quartz Analog Watch",
    category: "Accessories",
    price: 1499,
    rating: 4.1,
    desc: "Minimal dial, stainless strap, 3 ATM water resistance — everyday essential.",
    image: "https://tse3.mm.bing.net/th/id/OIP.f2y9N9F9yRABQUOau5BB5wAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
  },
  {
    id: 4,
    name: "Noise-cancel Headphones",
    category: "Electronics",
    price: 3499,
    rating: 4.7,
    desc: "Over-ear comfort with immersive sound and active noise cancellation.",
    image: "https://techstory.in/wp-content/uploads/2020/02/01LW4049122-HeroSquare-f670a23de42e4206b42e87a61fe486fe.jpg"
  },
  {
    id: 5,
    name: "Smartphone Tripod",
    category: "Electronics",
    price: 899,
    rating: 4.0,
    desc: "Compact aluminum build with Bluetooth shutter for stable shots.",
    image: "https://tse2.mm.bing.net/th/id/OIP.NrxOBmRj-qW2fdwpLB_qcAHaIg?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
  },
  {
    id: 6,
    name: "Café Ceramic Mug",
    category: "Home",
    price: 349,
    rating: 4.3,
    desc: "12oz matte ceramic mug that keeps your brew warmer for longer.",
    image: "https://tse4.mm.bing.net/th/id/OIP.rBMzN4FGnCz51Eigy7j0tgHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
  },
  {
    id: 7,
    name: "Essential Backpack",
    category: "Fashion",
    price: 1299,
    rating: 4.4,
    desc: "Multi-compartment 20L backpack with padded laptop sleeve.",
    image: "https://cottonon.com/on/demandware.static/-/Sites-catalog-master-typo/default/dw1b0e0451/1685735/1685735-02-1.jpg"
  },
  {
    id: 8,
    name: "Trail Sneakers",
    category: "Footwear",
    price: 2899,
    rating: 4.6,
    desc: "Grippy outsole and reinforced toe — built for rough terrain.",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 9,
    name: "LED Desk Lamp",
    category: "Home",
    price: 749,
    rating: 4.1,
    desc: "Adjustable arm and warm/cool modes for perfect late-night sessions.",
    image: "https://tse2.mm.bing.net/th/id/OIP.MvVRj0uk88zCTwXvX_eALQHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
  },
  {
    id: 10,
    name: "Bluetooth Speaker",
    category: "Electronics",
    price: 1699,
    rating: 4.4,
    desc: "Pocket-sized with punchy bass and 10-hour battery life.",
    image: "https://tse3.mm.bing.net/th/id/OIP.cIODM7P8nqrl-anEEnxXoAHaFE?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
  }
];

const state = {
  query: "",
  category: "all",
  sort: "popular",
  cart: load("cart", []),
  theme: load("theme", prefersDark() ? "dark" : "light")
};

function prefersDark(){ return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches; }
function save(key, value){ localStorage.setItem(key, JSON.stringify(value)); }
function load(key, fallback){ try{ return JSON.parse(localStorage.getItem(key)) ?? fallback; }catch{ return fallback; } }

function formatCurrency(n){ return `₹${n.toLocaleString('en-IN')}`; }
function starRating(r){
  const full = Math.floor(r);
  const half = r - full >= 0.5;
  let out = '';
  for(let i=0;i<full;i++) out += '★';
  if(half) out += '☆';
  while(out.length < 5) out += '·';
  return out;
}

function init(){
  // Year
  $("#year").textContent = new Date().getFullYear();

  // Theme
  applyTheme(state.theme);
  $("#themeToggle").addEventListener("click", () => {
    state.theme = (state.theme === "dark" ? "light" : "dark");
    applyTheme(state.theme);
    save("theme", state.theme);
  });

  // Populate categories
  const cats = Array.from(new Set(products.map(p => p.category))).sort();
  const catSel = $("#categoryFilter");
  cats.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    catSel.appendChild(opt);
  });

  // Inputs
  $("#searchInput").addEventListener("input", e => { state.query = e.target.value.trim().toLowerCase(); render(); });
  $("#categoryFilter").addEventListener("change", e => { state.category = e.target.value; render(); });
  $("#sortSelect").addEventListener("change", e => { state.sort = e.target.value; render(); });

  // Cart open/close
  $("#cartButton").addEventListener("click", openCart);
  $("#closeCart").addEventListener("click", closeCart);
  $("#overlay").addEventListener("click", closeCart);

  render();
  renderCart();
}

function applyTheme(theme){
  if(theme === "light"){
    document.documentElement.classList.add("light");
    $(".icon", $("#themeToggle"))?.replaceChildren(document.createTextNode("☀️"));
  }else{
    document.documentElement.classList.remove("light");
    $(".icon", $("#themeToggle"))?.replaceChildren(document.createTextNode("🌙"));
  }
}

function filteredProducts(){
  let list = products.filter(p => {
    const inCat = (state.category === "all" || p.category === state.category);
    const inQuery = !state.query || (p.name.toLowerCase().includes(state.query) || p.desc.toLowerCase().includes(state.query));
    return inCat && inQuery;
  });
  switch(state.sort){
    case "price-asc": list.sort((a,b)=>a.price-b.price); break;
    case "price-desc": list.sort((a,b)=>b.price-a.price); break;
    case "name-asc": list.sort((a,b)=>a.name.localeCompare(b.name)); break;
    default: list.sort((a,b)=>b.rating-a.rating);
  }
  return list;
}

function render(){
  const grid = $("#products");
  grid.innerHTML = "";
  const list = filteredProducts();
  if(list.length === 0){
    grid.innerHTML = `<p style="color:var(--muted);text-align:center">No products match your search.</p>`;
    return;
  }
  list.forEach(p => grid.appendChild(productCard(p)));
}

function productCard(p){
  const card = document.createElement("article");
  card.className = "card";
  card.innerHTML = `
    <img src="${p.image}" alt="${p.name}"/>
    <div class="body">
      <h3>${p.name}</h3>
      <div class="rating" title="${p.rating.toFixed(1)} / 5">${starRating(p.rating)}</div>
      <div class="muted">${p.category}</div>
      <div class="price-row">
        <strong>${formatCurrency(p.price)}</strong>
        <button class="add">Add</button>
      </div>
    </div>
  `;
  card.querySelector(".add").addEventListener("click", ()=> addToCart(p.id));
  card.querySelector("img").addEventListener("click", ()=> openProductModal(p));
  card.querySelector("h3").addEventListener("click", ()=> openProductModal(p));
  card.style.cursor = "pointer";
  return card;
}

function openProductModal(p){
  const dialog = $("#productModal");
  $("#modalImage").src = p.image;
  $("#modalImage").alt = p.name;
  $("#modalTitle").textContent = p.name;
  $("#modalDesc").textContent = p.desc;
  $("#modalPrice").textContent = formatCurrency(p.price);
  $("#modalRating").textContent = starRating(p.rating);
  const handler = ()=> addToCart(p.id);
  $("#modalAdd").onclick = handler;
  dialog.showModal();
}

function addToCart(id){
  const item = state.cart.find(c => c.id === id);
  if(item){ item.qty += 1; }
  else{ state.cart.push({ id, qty: 1 }); }
  save("cart", state.cart);
  bump("#cartCount");
  renderCart();
}

function bump(sel){
  const el = $(sel);
  if(!el) return;
  el.animate([{ transform:"scale(1)" },{ transform:"scale(1.15)"},{ transform:"scale(1)" }], { duration: 260 });
}

function openCart(){
  $("#cartPanel").classList.add("open");
  $("#overlay").hidden = false;
}

function closeCart(){
  $("#cartPanel").classList.remove("open");
  $("#overlay").hidden = true;
}

function removeFromCart(id){
  state.cart = state.cart.filter(c => c.id !== id);
  save("cart", state.cart);
  renderCart();
}

function setQty(id, delta){
  const item = state.cart.find(c => c.id === id);
  if(!item) return;
  item.qty = Math.max(1, item.qty + delta);
  save("cart", state.cart);
  renderCart();
}

function renderCart(){
  $("#cartItems").innerHTML = "";
  let subtotal = 0;
  state.cart.forEach(c => {
    const p = products.find(p => p.id === c.id);
    if(!p) return;
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <img src="${p.image}" alt="${p.name}"/>
      <div>
        <strong>${p.name}</strong>
        <div class="muted">${formatCurrency(p.price)}</div>
        <div class="qty">
          <button aria-label="Decrease" class="dec">−</button>
          <span>${c.qty}</span>
          <button aria-label="Increase" class="inc">+</button>
          <button class="remove" aria-label="Remove">Remove</button>
        </div>
      </div>
      <div><strong>${formatCurrency(p.price * c.qty)}</strong></div>
    `;
    row.querySelector(".dec").addEventListener("click", ()=> setQty(p.id, -1));
    row.querySelector(".inc").addEventListener("click", ()=> setQty(p.id, 1));
    row.querySelector(".remove").addEventListener("click", ()=> removeFromCart(p.id));
    $("#cartItems").appendChild(row);
    subtotal += p.price * c.qty;
  });
  $("#cartSubtotal").textContent = formatCurrency(subtotal);
  $("#cartCount").textContent = state.cart.reduce((a,c)=>a+c.qty,0);
}

$("#checkoutBtn")?.addEventListener("click", ()=>{
  alert("This is a demo checkout. In a real app, you would collect shipping & payment details here.");
});

document.addEventListener("DOMContentLoaded", init);
