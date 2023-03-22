export default function Read({ params } :  {params: { id: string }}) {
 return (
   <div className="flex flex-col text-black">
    <h1>You will read:</h1>
    <h3>{params.id}</h3>
  </div>
 );
}