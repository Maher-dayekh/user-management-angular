# 🧑‍💼 Angular User Management App

This project is a simple **User Management** web application built with:

- **Angular** version `17.3.17`
- **Node.js** version `22.6.0`

It retrieves users from the public [Reqres API](https://reqres.in) and supports:
- Fetching a list of users with pagination
- Fetching a user by ID
- Caching to avoid redundant API calls

## 🔐 API Authentication Header

All HTTP requests to the Reqres API use the following custom header:

x-api-key: reqres-free-v1


This header is **required** to successfully access the following endpoints:

- `GET https://reqres.in/api/users?page={page}` – Fetch paginated user list
- `GET https://reqres.in/api/users/{id}` – Fetch user details by ID

The header is set via Angular's `HttpClient` using `HttpHeaders`.

---

## 📦 Requirements

- Node.js `22.6.0` or higher
- Angular CLI `17.3.17`
- Internet access (API is hosted remotely)

---

## 🚀 Running the Project

1. Install dependencies:

```bash
npm install
ng serve
The app will be available at http://localhost:4200.

