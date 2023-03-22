import useSWR from 'swr'
import { Spinner } from './Spinner';
import { Tag } from '@prisma/client';

const fetcher = (url: string) => {
  const tagsLocalStorage = localStorage.getItem('nexuslit.tags');
  const tagsMaxAge = localStorage.getItem('nexuslit.tags.maxAge');
  let dateAux = null;
  let date = null;
  if (tagsMaxAge) {
    dateAux = new Date(tagsMaxAge);

    const minutesToAdd = 60 * 24 // 1 Day

    date =  new Date(dateAux.getTime() + minutesToAdd*60000);
  } 
  const acctualDate = new Date();

  if (tagsLocalStorage && date && date.getTime() > acctualDate.getTime()) {
    return JSON.parse(tagsLocalStorage);
  }

  const data = fetch(url).then((res) => res.json());
  data.then(res => {
    localStorage.setItem('nexuslit.tags', JSON.stringify(res));
    localStorage.setItem('nexuslit.tags.maxAge', new Date().toString());
  })

  return data;
}

interface BookTagsProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function BookTags({onChange}: BookTagsProps) {
  const { data, error } = useSWR('/api/booktags', fetcher)
  
  
  if (error) return <div>Error...</div>
  if (!data) return <Spinner size='sm' />

  const tags: Tag[] = data.tags
  return (
    <>
        {/* Normal */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-10">
          {tags?.map(tag => {
            if (tag.type === 'NORMAL')
            return (
              <div key={tag.id} className="flex items-center">
                <input 
                  id={tag.id.toString()} 
                  type="checkbox" 
                  value={tag.id}
                  onChange={onChange}
                  className="
                    w-4 h-4
                    text-nexus-8 dark:text-nexus-10 bg-gray-13 border-gray-10 rounded 
                    focus:ring-nexus-8 focus:ring-2
                    dark:focus:ring-nexus-8 dark:ring-offset-gray-800 dark:bg-gray-4 dark:border-gray-8"
                  />
                <label htmlFor={tag.id.toString()} className="ml-2 text-sm font-normal text-gray-1 dark:text-gray-12">{tag.name}</label>
              </div>
            )
          })}
        </div>

        {/* Explicit */}
        <label className="block mt-2 mb-1 font-normal text-normal text-gray-1 dark:text-gray-14">Explicit content</label>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-10">
          {tags?.map(tag => {
            if (tag.type === 'EXPLICIT')
            return (
              <div key={tag.id} className="flex items-center">
                <input 
                  id={tag.id.toString()} 
                  type="checkbox" 
                  value={tag.id}
                  onChange={onChange}
                  className="
                    w-4 h-4
                    text-nexus-8 dark:text-nexus-10 bg-gray-13 border-gray-10 rounded 
                    focus:ring-nexus-8 focus:ring-2
                    dark:focus:ring-nexus-8 dark:ring-offset-gray-800 dark:bg-gray-4 dark:border-gray-8"
                  />
                <label htmlFor={tag.id.toString()} className="ml-2 text-sm font-normal text-gray-1 dark:text-gray-12">{tag.name}</label>
              </div>
            )
          })}
        </div>
        {/* Fanfiction */}
        <label className="block mt-2 mb-1 text-sm text-normal text-gray-1 dark:text-gray-14">Ownership content</label>
        <div className="flex items-center">
          {tags?.map(tag => {
            if (tag.type === 'FANFICTION')
            return (
              <div key={tag.id} className="flex items-center">
                <input 
                  id={tag.id.toString()} 
                  type="checkbox" 
                  value={tag.id}
                  onChange={onChange}
                  className="
                    w-4 h-4
                    text-nexus-8 dark:text-nexus-10 bg-gray-13 border-gray-10 rounded 
                    focus:ring-nexus-8 focus:ring-2
                    dark:focus:ring-nexus-8 dark:ring-offset-gray-800 dark:bg-gray-4 dark:border-gray-8"  
                />
                <label htmlFor={tag.id.toString()} className="ml-2 text-sm font-normal text-gray-1 dark:text-gray-12">{tag.name}</label>
              </div>
            )
          })}
        </div>
    </>
  )
}