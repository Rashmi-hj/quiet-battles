
/* =====================================
   QUIET BATTLES - ADMIN DASHBOARD
   Spring Boot + MySQL Integration
===================================== */

const API_BASE_URL = "https://quiet-battles-backend.onrender.com/api";

// Store records fetched from the backend
let seriesRecords = [];
let chapterRecords = [];
let productRecords = [];

let editingRecordId = null;
let editingRecordType = null;

// Form elements
const seriesForm = document.getElementById("seriesForm");
const chapterForm = document.getElementById("chapterForm");
const productForm = document.getElementById("productForm");

const forms = {
    series: seriesForm,
    chapters: chapterForm,
    products: productForm
};

// =====================================
// API COMMUNICATION
// =====================================

async function apiRequest(endpoint, options = {}) {

    const response = await fetch(API_BASE_URL + endpoint, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        }
    });

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            errorText || `Request failed with status ${response.status}`
        );
    }

    if (response.status === 204) {
        return null;
    }

    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
        return response.json();
    }

    return null;
}

// =====================================
// GENERATE SLUG
// =====================================

function generateSlug(value) {

    return value
        .toLowerCase()
        .trim()
        .replace(/™/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

// =====================================
// FETCH DATABASE RECORDS
// =====================================

async function loadSeries() {
    seriesRecords = await apiRequest("/series");
}

async function loadChapters() {
    chapterRecords = await apiRequest("/chapters");
}

async function loadProducts() {
    productRecords = await apiRequest("/products");
}

// =====================================
// POPULATE DROPDOWNS
// =====================================

function populateSeriesDropdown(selectedId = "") {

    const dropdown = document.getElementById("chapterSeries");

    dropdown.replaceChildren();

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select a Series";

    dropdown.appendChild(defaultOption);

    seriesRecords.forEach(function (series) {

        const option = document.createElement("option");

        option.value = series.id;
        option.textContent = series.title;

        dropdown.appendChild(option);
    });

    dropdown.value = selectedId ? String(selectedId) : "";
}

function populateChapterDropdown(selectedId = "") {

    const dropdown = document.getElementById("productChapter");

    dropdown.replaceChildren();

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select a Chapter";

    dropdown.appendChild(defaultOption);

    chapterRecords.forEach(function (chapter) {

        const option = document.createElement("option");

        option.value = chapter.id;
        option.textContent =
            `Chapter ${chapter.chapterNumber} - ${chapter.title}`;

        dropdown.appendChild(option);
    });

    dropdown.value = selectedId ? String(selectedId) : "";
}

// =====================================
// DASHBOARD STATISTICS
// =====================================

function updateStatistics() {

    document.getElementById("totalSeries").textContent =
        seriesRecords.length;

    document.getElementById("totalChapters").textContent =
        chapterRecords.length;

    document.getElementById("totalProducts").textContent =
        productRecords.length;
}

// =====================================
// RENDER LISTS
// =====================================

function renderList(type, containerId, records) {

    const container = document.getElementById(containerId);

    container.replaceChildren();

    if (!records || records.length === 0) {

        const emptyMessage = document.createElement("p");

        emptyMessage.className = "admin-empty";
        emptyMessage.textContent =
            "No records available. Add your first record.";

        container.appendChild(emptyMessage);

        return;
    }

    records.forEach(function (record) {

        const item = document.createElement("div");
        item.className = "admin-item";

        const information = document.createElement("div");

        const heading = document.createElement("h3");

        if (type === "products") {
            heading.textContent = record.name;
        } else {
            heading.textContent = record.title;
        }

        const description = document.createElement("p");

        if (type === "series") {

            description.textContent =
                `${record.description || "No description"} | ${record.status}`;

        } else if (type === "chapters") {

            description.textContent =
                `Chapter ${record.chapterNumber} | ${record.seriesTitle || "No Series"} | ${record.status}`;

        } else {

            description.textContent =
                `₹${Number(record.price).toFixed(2)} | Stock: ${record.stock} | ${record.status}`;
        }

        information.appendChild(heading);
        information.appendChild(description);

        // Display image when available
        const imageUrl = type === "series"
            ? record.coverImage
            : type === "chapters"
                ? record.coverImage
                : record.image;

        if (imageUrl) {

            const image = document.createElement("img");

            image.src = imageUrl;
            image.alt = heading.textContent;
            image.loading = "lazy";

            image.style.width = "65px";
            image.style.height = "65px";
            image.style.objectFit = "cover";

            image.onerror = function () {
                image.style.display = "none";
            };

            information.appendChild(image);
        }

        const actions = document.createElement("div");
        actions.className = "admin-item-actions";

        const editButton = document.createElement("button");

        editButton.type = "button";
        editButton.textContent = "EDIT";

        editButton.addEventListener("click", function () {
            editRecord(type, record.id);
        });

        const deleteButton = document.createElement("button");

        deleteButton.type = "button";
        deleteButton.textContent = "DELETE";
        deleteButton.className = "delete-button";

        deleteButton.addEventListener("click", function () {
            deleteRecord(type, record.id);
        });

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);

        item.appendChild(information);
        item.appendChild(actions);

        container.appendChild(item);
    });
}

// =====================================
// RENDER DASHBOARD
// =====================================

function renderDashboard() {

    renderList("series", "seriesList", seriesRecords);

    renderList("chapters", "chapterList", chapterRecords);

    renderList("products", "productList", productRecords);

    updateStatistics();

    populateSeriesDropdown();
    populateChapterDropdown();
}

// =====================================
// REFRESH DATABASE DATA
// =====================================

async function refreshDashboard() {

    try {

        await Promise.all([
            loadSeries(),
            loadChapters(),
            loadProducts()
        ]);

        renderDashboard();

    } catch (error) {

        console.error("Dashboard loading error:", error);

        alert("Unable to load dashboard data. Please check whether Spring Boot is running.");

    }
}

// =====================================
// TAB SWITCHING
// =====================================

const adminTabs = document.querySelectorAll(".admin-tab");

const managementSections =
    document.querySelectorAll(".management-section");

adminTabs.forEach(function (tab) {

    tab.addEventListener("click", function () {

        const selectedSection = tab.dataset.section;

        adminTabs.forEach(function (item) {
            item.classList.remove("active");
        });

        managementSections.forEach(function (section) {
            section.classList.remove("active");
        });

        tab.classList.add("active");

        document.getElementById(selectedSection)
            .classList.add("active");
    });
});

// =====================================
// OPEN FORM
// =====================================

function openForm(type) {

    editingRecordId = null;
    editingRecordType = type;

    const form = forms[type];

    form.reset();

    form.classList.remove("hidden");

    const titleIds = {
        series: "seriesFormTitle",
        chapters: "chapterFormTitle",
        products: "productFormTitle"
    };

    document.getElementById(titleIds[type]).textContent =
        "ADD NEW " + type.toUpperCase().replace("CHAPTERS", "CHAPTER");

    if (type === "chapters") {
        populateSeriesDropdown();
    }

    if (type === "products") {
        populateChapterDropdown();
    }

    form.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// Add buttons
document.getElementById("addSeriesButton")
    .addEventListener("click", function () {
        openForm("series");
    });

document.getElementById("addChapterButton")
    .addEventListener("click", function () {
        openForm("chapters");
    });

document.getElementById("addProductButton")
    .addEventListener("click", function () {
        openForm("products");
    });

// =====================================
// CLOSE FORM
// =====================================

function closeForm(type) {

    forms[type].reset();

    forms[type].classList.add("hidden");

    editingRecordId = null;
    editingRecordType = null;
}

document.getElementById("cancelSeries")
    .addEventListener("click", function () {
        closeForm("series");
    });

document.getElementById("cancelChapter")
    .addEventListener("click", function () {
        closeForm("chapters");
    });

document.getElementById("cancelProduct")
    .addEventListener("click", function () {
        closeForm("products");
    });

// =====================================
// EDIT RECORD
// =====================================

function editRecord(type, id) {

    const records = {
        series: seriesRecords,
        chapters: chapterRecords,
        products: productRecords
    };

    const record = records[type].find(function (item) {
        return item.id === id;
    });

    if (!record) return;

    openForm(type);

    editingRecordId = id;
    editingRecordType = type;

    if (type === "series") {

        document.getElementById("seriesTitle").value =
            record.title || "";

        document.getElementById("seriesDescription").value =
            record.description || "";

        document.getElementById("seriesImage").value =
            record.coverImage || "";

        document.getElementById("seriesStatus").value =
            record.status || "DRAFT";

        document.getElementById("seriesFormTitle").textContent =
            "EDIT SERIES";
    }

    if (type === "chapters") {

        document.getElementById("chapterTitle").value =
            record.title || "";

        document.getElementById("chapterNumber").value =
            record.chapterNumber || "";

        document.getElementById("chapterIntro").value =
            record.intro || "";

        document.getElementById("chapterDescription").value =
            record.storyContent || "";

        document.getElementById("chapterImage").value =
            record.coverImage || "";

        document.getElementById("chapterStatus").value =
            record.status || "DRAFT";

        populateSeriesDropdown(record.seriesId);

        document.getElementById("chapterFormTitle").textContent =
            "EDIT CHAPTER";
    }

    if (type === "products") {

        document.getElementById("productName").value =
            record.name || "";

        document.getElementById("productPrice").value =
            record.price || "";

        document.getElementById("productDescription").value =
            record.description || "";

        document.getElementById("productImage").value =
            record.image || "";

        document.getElementById("productStock").value =
            record.stock ?? 0;

        document.getElementById("productSizes").value =
            (record.sizes || []).join(", ");

        document.getElementById("productStatus").value =
            record.status || "DRAFT";

        populateChapterDropdown(record.chapterId);

        document.getElementById("productFormTitle").textContent =
            "EDIT PRODUCT";
    }
}

// =====================================
// DELETE RECORD
// =====================================

async function deleteRecord(type, id) {

    const records = {
        series: seriesRecords,
        chapters: chapterRecords,
        products: productRecords
    };

    const record = records[type].find(function (item) {
        return item.id === id;
    });

    if (!record) return;

    const recordName = type === "products"
        ? record.name
        : record.title;

    const confirmed = confirm(
        `Are you sure you want to delete "${recordName}"?`
    );

    if (!confirmed) return;

    try {

        await apiRequest(`/${type}/${id}`, {
            method: "DELETE"
        });

        alert("Record deleted successfully.");

        await refreshDashboard();

    } catch (error) {

        console.error("Delete error:", error);

        alert("Unable to delete record: " + error.message);
    }
}

// =====================================
// SAVE RECORD TO BACKEND
// =====================================

async function saveRecord(type, record) {

    try {

        let endpoint = `/${type}`;
        let method = "POST";

        if (editingRecordType === type && editingRecordId !== null) {

            endpoint += `/${editingRecordId}`;
            method = "PUT";
        }

        await apiRequest(endpoint, {
            method: method,
            body: JSON.stringify(record)
        });

        closeForm(type);

        alert("Record saved successfully to the database.");

        await refreshDashboard();

    } catch (error) {

        console.error("Save error:", error);

        alert("Unable to save record: " + error.message);
    }
}

// =====================================
// SERIES FORM SUBMISSION
// =====================================

seriesForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const title =
        document.getElementById("seriesTitle").value.trim();

    const record = {

        title: title,

        slug: generateSlug(title),

        description:
            document.getElementById("seriesDescription").value.trim(),

        coverImage:
            document.getElementById("seriesImage").value.trim(),

        status:
            document.getElementById("seriesStatus").value
    };

    await saveRecord("series", record);
});

// =====================================
// CHAPTER FORM SUBMISSION
// =====================================

chapterForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const title =
        document.getElementById("chapterTitle").value.trim();

    const record = {

        chapterNumber:
            Number(document.getElementById("chapterNumber").value),

        title: title,

        slug: generateSlug(title),

        intro:
            document.getElementById("chapterIntro").value.trim(),

        storyContent:
            document.getElementById("chapterDescription").value.trim(),

        coverImage:
            document.getElementById("chapterImage").value.trim(),

        status:
            document.getElementById("chapterStatus").value,

        seriesId:
            Number(document.getElementById("chapterSeries").value)
    };

    if (!record.seriesId || record.seriesId <= 0) {

        alert("Please select a Series.");

        return;
    }

    await saveRecord("chapters", record);
});

// =====================================
// PRODUCT FORM SUBMISSION
// =====================================

productForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const name =
        document.getElementById("productName").value.trim();

    const sizes = document.getElementById("productSizes")
        .value
        .split(",")
        .map(function (size) {
            return size.trim().toUpperCase();
        })
        .filter(Boolean);

    const record = {

        name: name,

        slug: generateSlug(name),

        description:
            document.getElementById("productDescription").value.trim(),

        price:
            Number(document.getElementById("productPrice").value),

        image:
            document.getElementById("productImage").value.trim(),

        stock:
            Number(document.getElementById("productStock").value),

        status:
            document.getElementById("productStatus").value,

        sizes: sizes,

        chapterId:
            Number(document.getElementById("productChapter").value)
    };

    if (!record.chapterId || record.chapterId <= 0) {

        alert("Please select a Chapter.");

        return;
    }

    if (
        !Number.isFinite(record.price) ||
        record.price <= 0 ||
        !Number.isInteger(record.stock) ||
        record.stock < 0
    ) {

        alert("Please enter a valid price and stock quantity.");

        return;
    }

    if (
        sizes.length === 0 ||
        sizes.some(function (size) {
            return !["S", "M", "L", "XL"].includes(size);
        })
    ) {

        alert("Sizes must be S, M, L or XL.");

        return;
    }

    await saveRecord("products", record);
});

// =====================================
// START ADMIN DASHBOARD
// =====================================

refreshDashboard();
