Dynamic Smart Insurance Form
A React.js application for dynamically generating and submitting insurance forms with advanced features such as autosave drafts, conditional field visibility, and a customizable submissions table view.

Features
Dynamic Forms: Forms are fetched from APIs and rendered with conditional logic.

Autosave Drafts: Automatically saves user input in localStorage and restores drafts when revisiting.

Customizable Table View: Allows sorting, filtering, and column selection for submitted applications.

Dark Mode Support: User-friendly, responsive design with light and dark themes.

Form Validation: Real-time validation powered by Formik and Yup.

Technologies
React.js for the user interface.

Tailwind CSS for styling.

Formik and Yup for form handling and validation.

React Query for API data management.

Axios for API calls.

Getting Started
Clone the repository:

bash
git clone https://github.com/Rasool-Karami1994/Insurance-portal.git
Install dependencies:

bash
npm install
Start the development server:

bash
npm run dev
API Endpoints
GET /api/insurance/forms: Fetches form structure.

POST /api/insurance/forms/submit: Submits the form data.

GET /api/insurance/forms/submissions: Retrieves submitted applications.

## `You can see live demo from here:` https://rasool-devotel-insurance-portal.netlify.app/



