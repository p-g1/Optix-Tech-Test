Our developer was part way through developing the following feature but left the company and you are tasked with picking up where they left off.

The aim is to complete the piece of work by refactoring and improving the current code to get it to a working state that passes all A/C. Use material UI components and a form library where desirable.

Please return as a link to a public GIT store of your choice. e.g. Github

**_A/C_**
Must have(s)

- Display total number of movies. //DONE
- Table must show movie title, average review score to 1 decimal place and company that produces the film. //DONE (mobile doesn't show all...)

  - Movie company data comes from movieCompanies GET request. //DONE
  - Movies data comes from movies GET request. //DONE

- User must be able to select table row to leave a review with form appearing when there is a selected movie. //DONE

  - POST request to submitReview endpoint and display message returned on response. //DONE

    //ASSUMPTION: 100 character limit means a written review is required (despite all other being numerical from the API)

  - Form must restrict message to 100 characters and show an error message if over 100 and not allow for submission in this instance. //DONE

- Highlight selected movie row when clicked. //DONE
- Handle error and loading states. //DONE

Should have(s)

- Review column should be sortable. //DONE
- Submit review form should appear in a modal on mobile devices or small breakpoints. //DONE

Could have(s)

- Add a button (or other mechanism) to refresh movies and movie companies. //DONE
- Containerise application using docker.

The three endpoints to be used are:

- GET movie companies: http://localhost:4321/movieCompanies
- GET movies: http://localhost:4321/movies
- POST review: http://localhost:4321/submitReview
  - body {review: message}

Please run server locally from https://github.com/michaelOptix1/starter-express-api

//DONE

//named the column "rating" instead of review to make it different from the review they can provide.
