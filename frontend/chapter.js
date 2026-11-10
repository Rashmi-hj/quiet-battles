
const API_BASE_URL = "https://quiet-battles-backend.onrender.com/api";

const fallbackImage =
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85";

// LOAD SELECTED CHAPTER
async function loadChapter() {

    const params = new URLSearchParams(window.location.search);
    const chapterId = params.get("id");

    const errorElement = document.getElementById("chapterError");

    if (!chapterId || !/^\d+$/.test(chapterId)) {
        showChapterError("Please select a valid Chapter from the Archive.");
        return;
    }

    try {

        const response = await fetch(
            `${API_BASE_URL}/chapters/${chapterId}`
        );

        if (!response.ok) {
            throw new Error("Chapter not found.");
        }

        const chapter = await response.json();

        // UPDATE PAGE TITLE
        document.title =
            `${chapter.title} | QUIET BATTLES™`;

        // UPDATE CHAPTER HERO
        document.getElementById("chapterHeroImage").src =
            chapter.coverImage || fallbackImage;

        document.getElementById("chapterHeroImage").alt =
            chapter.title || "Chapter image";

        document.getElementById("chapterSeries").textContent =
            `SERIES — ${chapter.seriesTitle || "QUIET BATTLES™"}`;

        // UPDATE CHAPTER TITLE SAFELY
        const titleElement =
            document.getElementById("chapterTitle");

        titleElement.textContent = chapter.title || "UNTITLED";

        document.getElementById("chapterNumber").textContent =
            `CHAPTER ${String(chapter.chapterNumber).padStart(2, "0")}`;

        // UPDATE INTRODUCTION
        document.getElementById("chapterIntroTitle").textContent =
            chapter.title || "THE STORY BEGINS";

        document.getElementById("chapterIntro").textContent =
            chapter.intro || "";

        // UPDATE STORY
        document.getElementById("chapterStoryHeading").textContent =
            chapter.title || "THE STORY";

        document.getElementById("chapterStoryContent").textContent =
            chapter.storyContent || "";

        // HIDE EMPTY STORY SECTION IF NECESSARY
        if (!chapter.storyContent) {
            document.querySelector(".story-section").style.display = "none";
        }

        // UPDATE IMAGE
        const storyImage =
            document.getElementById("chapterStoryImage");

        storyImage.src = chapter.coverImage || fallbackImage;
        storyImage.alt = chapter.title || "Chapter story";

        // LOAD RELATED PRODUCT
        await loadRelatedProduct(chapter.id);

    } catch (error) {

        console.error("Chapter loading error:", error);

        showChapterError(
            "Unable to load this Chapter. Please try again."
        );

    }
}


// LOAD PRODUCT CONNECTED TO CHAPTER
async function loadRelatedProduct(chapterId) {

    const productSection =
        document.getElementById("chapterProductSection");

    try {

        const response = await fetch(
            `${API_BASE_URL}/products`
        );

        if (!response.ok) {
            throw new Error("Unable to load products.");
        }

        const products = await response.json();

        const product = products.find(item =>
            Number(item.chapterId) === Number(chapterId) &&
            item.status === "PUBLISHED"
        );

        if (!product) {
            productSection.style.display = "none";
            return;
        }

        document.getElementById("relatedProductName").textContent =
            product.name;

        document.getElementById("relatedProductDescription").textContent =
            product.description || "";

        document.getElementById("relatedProductPrice").textContent =
            `₹${Number(product.price).toLocaleString("en-IN")}`;

        document.getElementById("relatedProductImage").src =
            product.image || fallbackImage;

        document.getElementById("relatedProductImage").alt =
            product.name;

        document.getElementById("relatedProductLink").href =
            `product.html?id=${product.id}`;

    } catch (error) {

        console.error("Related product loading error:", error);

        productSection.style.display = "none";

    }
}


// DISPLAY CHAPTER ERROR
function showChapterError(message) {

    const main = document.getElementById("chapterMain");
    const errorElement = document.getElementById("chapterError");

    errorElement.textContent = message;
    errorElement.style.display = "block";

    // Hide chapter content but keep the error visible.
    Array.from(main.children).forEach(section => {
        if (section.id !== "chapterError") {
            section.style.display = "none";
        }
    });

}


// START
loadChapter();
