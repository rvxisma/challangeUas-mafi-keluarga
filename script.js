// Data awal family tree
let treeData = JSON.parse(localStorage.getItem("familyTree")) || {
  id: "root",
  role: "Anak",
  name: "Risma Nur Aisyatu Salma",
  image: "images/risma.jpg",
  children: [
    {
      id: "ayah",
      role: "Ayah",
      name: "Gozali Rahman",
      image: "images/ayah.jpg",
      children: []
    },
    {
      id: "ibu",
      role: "Ibu",
      name: "Iim Masripah",
      image: "images/ibu.jpg",
      children: []
    }
  ]
};

// Simpan tree ke localStorage
function saveTree() {
  localStorage.setItem("familyTree", JSON.stringify(treeData));
}

// Render tree ke layar
function renderTree(node, container) {
  container.innerHTML = "";
  const ul = document.createElement("ul");
  ul.className = "tree";
  container.appendChild(ul);

  function draw(n, parent) {
    const li = document.createElement("li");

    const img = document.createElement("img");
    img.src = n.image || "images/no-profile.jpg";
    img.className = "node-img";

    const span = document.createElement("span");
    span.textContent = n.role ? `${n.role}: ${n.name}` : n.name;

    const delBtn = document.createElement("button");
    delBtn.textContent = "Hapus";
    delBtn.onclick = () => {
      if (n.id === "root") return alert("Root tidak bisa dihapus");
      deleteNode(treeData, n.id);
      saveTree();
      renderTree(treeData, container);
    };

    li.appendChild(img);
    li.appendChild(span);
    li.appendChild(delBtn);
    parent.appendChild(li);

    if (n.children.length) {
      const childUl = document.createElement("ul");
      li.appendChild(childUl);
      n.children.forEach(c => draw(c, childUl));
    }
  }

  draw(node, ul);

  document.getElementById("info").textContent =
    `Total Node: ${countNodes(node)} | Kedalaman: ${getDepth(node)}`;
}

// Fungsi hapus node
function deleteNode(node, id) {
  for (let i = 0; i < node.children.length; i++) {
    if (node.children[i].id === id) {
      node.children.splice(i, 1);
      return true;
    } else {
      if (deleteNode(node.children[i], id)) return true;
    }
  }
  return false;
}

// Cari node berdasarkan ID
function findNodeById(node, id) {
  if (node.id === id) return node;
  for (let c of node.children) {
    const found = findNodeById(c, id);
    if (found) return found;
  }
  return null;
}

// Hitung jumlah node
function countNodes(node) {
  return 1 + node.children.reduce((a, c) => a + countNodes(c), 0);
}

// Hitung kedalaman tree
function getDepth(node) {
  if (!node.children.length) return 1;
  return 1 + Math.max(...node.children.map(getDepth));
}

// Reset tree ke awal
function resetTree() {
  localStorage.removeItem("familyTree");
  location.reload();
}

// Event listener saat halaman selesai load
document.addEventListener("DOMContentLoaded", () => {
  const treeDiv = document.getElementById("tree");
  renderTree(treeData, treeDiv);

  document.getElementById("familyForm").addEventListener("submit", e => {
    e.preventDefault();

    const role = document.getElementById("role").value.trim();
    const name = document.getElementById("name").value.trim();
    const parentId = document.getElementById("parent").value.trim();
    const file = document.getElementById("image").files[0];

    if (!file) return alert("Upload gambar wajib");
    if (!file.type.includes("jpeg")) return alert("File harus JPG");
    if (file.size > 100 * 1024) return alert("Max 100KB");

    const reader = new FileReader();
    reader.onload = ev => {
      const newNode = {
        id: Date.now().toString(),
        role,
        name,
        image: ev.target.result,
        children: []
      };

      if (parentId) {
        const parent = findNodeById(treeData, parentId);
        if (!parent) return alert("Parent tidak ditemukan");
        parent.children.push(newNode);
      } else {
        treeData.children.push(newNode);
      }

      saveTree();
      renderTree(treeData, treeDiv);
      e.target.reset();
    };
    reader.readAsDataURL(file);
  });
});

// Fungsi untuk navigasi antar section
function showPage(id) {
  document.querySelectorAll("main section").forEach(sec => {
    sec.classList.remove("active");
  });
  document.getElementById(id).classList.add("active");

  document.querySelectorAll("nav button").forEach(btn => {
    btn.classList.remove("active");
  });
  document.querySelector(`nav button[onclick="showPage('${id}')"]`).classList.add("active");
}
