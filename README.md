To run the project:

1. Clone the repository
2. Run `docker build -t optix .` from the directory containing the Dockerfile.
3. Run `docker run -dp 127.0.0.1:3000:3000 optix`

Notes on submission:

- Very much enjoyed the exercise!

Assumptions:

- 100 character limit on the user submitted review means a written review is required (despite reviews from the API being numerical in nature).
- Due to this I thought it best to rename the reviews table column "Rating" instead of "Review" to make it clear that the numerical rating is separate to the user's written review.
- In practice this would have been discussed with the product owner to ensure that the API and UX are both fit for purpose.

- The UX of having a full table in portrait mode on mobile with horizontal scroll seemed very poor. I made the decision to hide the final column on mobile and only show the movie title and the average rating. A user on mobile can still see all columns by rotating to landscape.
- Again, this would be discussed with the product owner in practice. There could be a row variant for the mobile view that has the production company as a second line inthe title column with some colour/weight distinction.

- All columns are sortable and filterable. While this goes beyond the A/C, it is a nice touch that the user experience can be customised. I would want to get this approved by the product owner, and the extra functionality can be turned off easily. It seemed a good decision to include as it came out of the box in the MUIX DataGrid and was no extra work.

TODO

- Testing is not complete but felt enough to demonstrate. In practice I would include component level spec files too.
- I have included the coverage folder in the git ignore, but you can see test coverage on the App.tsx file by running npm run test --coverage. There are a couple of branches currently not covered.
- I'd very much like to remove the focus styling from the grid cells as it is very jarring when interacting with the grid.

---

Our developer was part way through developing the following feature but left the company and you are tasked with picking up where they left off.

The aim is to complete the piece of work by refactoring and improving the current code to get it to a working state that passes all A/C. Use material UI components and a form library where desirable.

Please return as a link to a public GIT store of your choice. e.g. Github

**_A/C_**
Must have(s)

- Display total number of movies.
- Table must show movie title, average review score to 1 decimal place and company that produces the film. //DONE (mobile doesn't show all...)

  - Movie company data comes from movieCompanies GET request.
  - Movies data comes from movies GET request.

- User must be able to select table row to leave a review with form appearing when there is a selected movie.

  - POST request to submitReview endpoint and display message returned on response.

  - Form must restrict message to 100 characters and show an error message if over 100 and not allow for submission in this instance.

- Highlight selected movie row when clicked.
- Handle error and loading states.

Should have(s)

- Review column should be sortable.
- Submit review form should appear in a modal on mobile devices or small breakpoints.

Could have(s)

- Add a button (or other mechanism) to refresh movies and movie companies.
- Containerise application using docker.

The three endpoints to be used are:

- GET movie companies: http://localhost:4321/movieCompanies
- GET movies: http://localhost:4321/movies
- POST review: http://localhost:4321/submitReview
  - body {review: message}

Please run server locally from https://github.com/michaelOptix1/starter-express-api
