export type movieItem = {id: string, reviews: number[], title: string, filmCompanyId: string, cost: number, releaseYear: number};
export type formattedMovieItem = {id: string, title: string, filmCompany: string, averageReview: number};
export type movieCompanyItem = {id: string, name: string};