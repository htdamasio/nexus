import useSWR from 'swr'
import { Spinner } from './Spinner';
import { Genre } from '@prisma/client';

const fetcher = (url: string) => {
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

  const data = fetch(url).then((res) => res.json());
  data.then(res => {
    localStorage.setItem('nexuslit.genres', JSON.stringify(res));
    localStorage.setItem('nexuslit.genres.maxAge', new Date().toString());
  })

  return data;
}

interface BookGenresProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  alreadyChecked?: number[]
}

export function BookGenres({onChange, alreadyChecked}: BookGenresProps) {
  const { data, error } = useSWR('/api/bookgenres', fetcher)
  
  
  if (error) return <div>Error...</div>
  if (!data) return <Spinner size='sm' />

  function verifyChecked(id: number) {
    if (alreadyChecked && alreadyChecked.length) {
      const idFound = alreadyChecked.find(g => g === id)
      if (idFound) return true
    }
    return false
  }

  const genres: Genre[] = data.genres
  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-10">
        {genres?.map(genre => {
          return (
            <div key={genre.id} className="flex items-center">
              <input 
                id={genre.id.toString()} 
                type="checkbox" 
                value={genre.id}
                checked={verifyChecked(genre.id)}
                onChange={onChange}
                className="
                  w-4 h-4
                  text-nexus-8 dark:text-nexus-10 bg-gray-13 border-gray-10 rounded 
                  focus:ring-nexus-8 focus:ring-2
                  dark:focus:ring-nexus-8 dark:ring-offset-gray-800 dark:bg-gray-4 dark:border-gray-8"
                />
              <label htmlFor={genre.id.toString()} className="ml-2 text-sm font-normal text-gray-1 dark:text-gray-12">{genre.name}</label>
            </div>
          )
        })}
      </div>
    </>
  )
}