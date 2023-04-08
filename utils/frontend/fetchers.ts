export const bookGenresFetcher = async (url: string) => {
  const genresLocalStorage = localStorage.getItem('nexuslit.genres');
  const genresMaxAge = localStorage.getItem('nexuslit.genres.maxAge');
  let dateAux = null;
  let date = null;
  if (genresMaxAge) {
    dateAux = new Date(genresMaxAge);

    const minutesToAdd = 60 * 24 // 1 Day

    date =  new Date(dateAux.getTime() + minutesToAdd*60000);
  } 
  const acctualDate = new Date();

  if (genresLocalStorage && date && date.getTime() > acctualDate.getTime()) {
    return JSON.parse(genresLocalStorage);
  }

  const data = await fetch(url).then((res) => res.json());
  data.then(res => {
    localStorage.setItem('nexuslit.genres', JSON.stringify(res));
    localStorage.setItem('nexuslit.genres.maxAge', new Date().toString());
  })

  return data;
}