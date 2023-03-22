import { useState } from 'react';
import { MagnifyingGlass } from 'phosphor-react';

interface AutocompleteProps {
  options: string[];
  onSelected?: (option: string) => null
}

const Autocomplete: React.FC<AutocompleteProps> = ({ options, onSelected }) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [isInputOnFocus, setIsInputOnFocus] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const filteredOptions = options.filter(
      (option) =>
        option.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
    );
    setInputValue(inputValue);
    setFilteredOptions(filteredOptions);
  };

  const handleOptionClick = (option: string) => {
    setInputValue(option);
    setFilteredOptions([]);
    if(onSelected) {
      onSelected(option);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Do something with the selected option
  };

  function handleRemoveFocus() {
    setTimeout(() => {
      setIsInputOnFocus(false);
    }, 100);
  }

  const displayOptions = isInputOnFocus && inputValue.length > 0;

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div style={{ position: 'relative' }}>
        <input
          onFocus={() => setIsInputOnFocus(true)}
          onBlur={() => handleRemoveFocus()}
          type="search"
          value={inputValue}
          onChange={handleInputChange}
          className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-lg border-none border-l-2 border border-gray-300 focus:ring-purple-500 focus:ring-2 focus:border-purple-500 dark:bg-gray-500 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-purple-500" 
          placeholder="Search" 
        />
        <button type="submit" className="absolute top-0 right-0 p-2.5 text-sm font-medium text-white bg-purple-700 rounded-r-lg border border-none hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800">
            <MagnifyingGlass className="w-5 h-5"/>
            
            {/* <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg> */}
            <span className="sr-only">Search</span>
        </button>
      </div>
      <ul className={`absolute z-10 bg-white w-full p-2 rounded-b-md ${displayOptions ? 'block':'hidden'}`}>
        {filteredOptions.map((option) => (
          <li 
            className="text-sm font-roboto text-gray-800 my-1 cursor-pointer active"
            key={option} 
            onClick={() => handleOptionClick(option)}
          >
            {option}
          </li>
        ))}
      </ul>
    </form>
  );
};

export { Autocomplete };