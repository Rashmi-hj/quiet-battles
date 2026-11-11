const API_BASE_URL =
    "https://quiet-battles-backend.onrender.com/api";

const fallbackImage =
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85";


// LOAD SELECTED CHAPTER
async function loadChapter() {

    const params = new URLSearchParams(window.location.search);
    const chapterId = params.get("id");

    if (!chapterId || !/^[1-9]\d*$/.test(chapterId)) {
        showChapterError(
            "Please select a valid Chapter from the Archive."
        );
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
            `${chapter.title || "Chapter"} | QUIET BATTLES™`;

        // UPDATE META DESCRIPTION
        const metaDescription =
            document.querySelector('meta[name="description"]');

        if (metaDescription) {
            metaDescription.content =
                `Discover ${chapter.title || "this chapter"} from QUIET BATTLES™.`;
        }

        // UPDATE HERO IMAGE
        const heroImage =
            document.getElementById("chapterHeroImage");

        heroImage.src = chapter.coverImage || fallbackImage;
        heroImage.alt = chapter.title || "Chapter image";

        // UPDATE SERIES
        document.getElementById("chapterSeries").textContent =
            `SERIES — ${chapter.seriesTitle || "QUIET BATTLES™"}`;

        // UPDATE CHAPTER TITLE
        document.getElementById("chapterTitle").textContent =
            chapter.title || "UNTITLED";

        // UPDATE CHAPTER NUMBER
        const number = chapter.chapterNumber || Number(chapterId);

        document.getElementById("chapterNumber").textContent =
            `CHAPTER ${String(number).padStart(2, "0")}`;

        // UPDATE INTRODUCTION
        document.getElementById("chapterIntroTitle").textContent =
            chapter.title || "THE STORY BEGINS";

        document.getElementById("chapterIntro").textContent =
            chapter.intro ||
            "The story of this chapter is being prepared.";

        // UPDATE STORY
        document.getElementById("chapterStoryHeading").textContent =
            chapter.title || "THE STORY";

        document.getElementById("chapterStoryContent").textContent =
            chapter.storyContent || "";

        // UPDATE STORY IMAGE
        const storyImage =
            document.getElementById("chapterStoryImage");

        storyImage.src = chapter.coverImage || fallbackImage;
        storyImage.alt = chapter.title || "Chapter story";

        // HIDE FIRST STORY SECTION IF NO STORY CONTENT EXISTS
        if (!chapter.storyContent) {
            document.querySelector(".story-section").style.display =
                "none";
        }

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

        // PRODUCT NAME
        document.getElementById("relatedProductName").textContent =
            product.name || "UNTITLED PRODUCT";

        // PRODUCT DESCRIPTION
        document.getElementById("relatedProductDescription").textContent =
            product.description || "";

        // PRODUCT PRICE
        const price = Number(product.price);

        document.getElementById("relatedProductPrice").textContent =
            Number.isFinite(price)
                ? `₹${price.toLocaleString("en-IN")}`
                : "";

        // PRODUCT IMAGE
        document.getElementById("relatedProductImage").src =
            product.image || fallbackImage;

        document.getElementById("relatedProductImage").alt =
            product.name || "Related product";

        // PRODUCT LINK
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

    // HIDE OTHER MAIN CONTENT
    Array.from(main.children).forEach(section => {

        if (section.id !== "chapterError") {
            section.style.display = "none";
        }

    });

}


// START
loadChapter();
