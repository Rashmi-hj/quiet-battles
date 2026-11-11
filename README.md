# QUIET BATTLES™ – Website Development Demo

**Tagline:** WEAR YOUR BATTLES.

A premium fashion storytelling website developed as part of the Full-Stack Web Developer technical assessment for Pholus Globos Facility Service Pvt. Ltd.

## Live Demo

- **Website:** https://quite-battles.netlify.app/
- **GitHub Repository:** https://github.com/Rashmi-hj/quiet-battles

## Project Overview

QUIET BATTLES™ is a fashion brand website that combines storytelling with a product shopping experience. It presents the brand's identity through a cinematic homepage, a collection archive, individual story chapters and product pages.

## Features

- Premium homepage with brand identity and tagline.
- Responsive navigation and website layout.
- Archive section featuring Series 01 – THE GENTLE ARMOR™.
- Five individual storytelling chapters.
- Dynamic chapter content loaded through backend APIs.
- Product details and size selection.
- Add to Cart functionality.
- Admin dashboard for managing website content.
- Backend REST API integration.
- MySQL database integration.

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend | Java, Spring Boot |
| Database | MySQL |
| ORM | Spring Data JPA, Hibernate |
| API | REST APIs |
| Frontend Hosting | Netlify |
| Backend Hosting | Render |

## Project Structure

```text
quiet-battles/
│
├── backend/
│   └── Spring Boot application
│
├── frontend/
│   ├── index.html
│   ├── archive.html
│   ├── chapter.html
│   ├── product.html
│   ├── cart.html
│   ├── admin.html
│   ├── style.css
│   ├── home.css
│   ├── chapter.css
│   ├── product.css
│   ├── cart.css
│   ├── admin.css
│   └── JavaScript files
│
└── README.md
```

## Backend API

Base URL:

`https://quiet-battles-backend.onrender.com/api`

Main endpoints:

- `GET /chapters` – Retrieve chapters.
- `GET /chapters/{id}` – Retrieve a chapter by ID.
- `GET /series` – Retrieve series.
- `GET /products` – Retrieve products.

## Architecture

The frontend communicates with the Spring Boot backend using REST APIs. The backend processes application requests and uses Spring Data JPA and Hibernate to interact with the MySQL database.

The frontend and backend are hosted separately.

## Running the Project Locally

**Frontend**
1. Clone the repository.
2. Open the `frontend` folder in VS Code.
3. Open `index.html` using Live Server.

**Backend**
1. Open the `backend` folder in your Java IDE.
2. Configure the MySQL database connection.
3. Ensure the required database is available.
4. Run the Spring Boot application.

## Third-Party Tools and Resources

- Spring Boot
- Hibernate
- MySQL
- Netlify
- Render
- Google Fonts
- Unsplash images

## Developer

**Rashmi H J**

Full-Stack Web Developer Assessment Project

