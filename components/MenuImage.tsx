import { MenuItem } from "./MenuBar";

export function MenuImage({ icon, title, setAction, isSettedActive = null, options}: MenuItem) {
  
  function selectedImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.length ? e.target.files[0] : null
    if (file) {
      setAction && setAction(URL.createObjectURL(file))
    }
  }
  
  return (
    <>
    <input 
      className="hidden w-full mb-5 text-xs text-gray-1 border border-gray-12 rounded-lg cursor-pointer bg-gray-14 dark:text-gray-10 focus:outline-none dark:bg-gray-2 dark:border-gray-5 dark:placeholder-gray-8" 
      type="file" 
      id="image"
      accept="image/*"
      onChange={selectedImage}
    />
    <label
      htmlFor="image"
    >
      {icon}
    </label>
    </>
  );
}