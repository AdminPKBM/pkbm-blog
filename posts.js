// ================= CONFIG =================
const GITHUB_API = "https://api.github.com/repos/AdminPKBM/pkbm-blog/contents/artikel";
const BASE_PATH = "/artikel/"; // sesuaikan jika path berbeda
const JUMLAH_BACA_JUGA = 3;

// ================= FORMAT TITLE =================
function formatTitle(filename) {
    return filename
        .replace(".html", "")
        .replace(/-/g, " ")
        .replace(/\b\w/g, huruf => huruf.toUpperCase());
}

// ================= AMBIL DATA DARI GITHUB =================
async function getAllPosts() {
    try {
        const res = await fetch(GITHUB_API);
        const data = await res.json();

        return data
            .filter(item => item.name.endsWith(".html"))
            .map(item => ({
                title: formatTitle(item.name),
                url: BASE_PATH + item.name
            }));

    } catch (error) {
        console.error("Gagal ambil data GitHub:", error);
        return [];
    }
}

// ================= RANDOM POSTS =================
function getRandomPosts(posts, jumlah) {
    return [...posts]
        .sort(() => 0.5 - Math.random())
        .slice(0, jumlah);
}

// ================= GENERATE HTML =================
function createBacaJugaHTML(posts) {
    let html = `<div class="baca-juga">
        <strong>📌 Baca juga:</strong>
        <ul>`;

    posts.forEach(p => {
        html += `<li><a href="${p.url}">${p.title}</a></li>`;
    });

    html += `</ul></div>`;
    return html;
}

// ================= RENDER BACA JUGA =================
async function renderBacaJuga(targetId) {
    const container = document.getElementById(targetId);
    if (!container) return;

    const posts = await getAllPosts();
    if (!posts.length) return;

    const selected = getRandomPosts(posts, JUMLAH_BACA_JUGA);
    container.innerHTML = createBacaJugaHTML(selected);
}

// ================= AUTO INIT =================
function initAutoBacaJuga() {
    renderBacaJuga("baca-juga-tengah");
    renderBacaJuga("baca-juga-akhir");
}

// jalankan saat halaman siap
document.addEventListener("DOMContentLoaded", initAutoBacaJuga);
