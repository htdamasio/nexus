import { FuncCard } from "./FuncCard";

const TellStoryDescriptions = [
  <p key="TellStoryDescriptions_1" className="font-roboto font-light">
    Authors can write and upload their manuscripts on Nexus for free and writers retain 100% of their copyrights whilst writing on Nexus.
  </p>,
  <p key="TellStoryDescriptions_2" className="font-roboto font-light">
    Share your literary voice and connect with readers worldwide on Nexus. Whether you write romance, mystery, or fantasy, we provide the space to reach booklovers from all genres and build a diverse and dedicated following.
  </p>
]

const CommunityDescriptions = [
  <p key="CommunityDescriptions_1" className="font-roboto font-light">
    Readers can support their favorite authors by joining the <span className="text-united-nations-blue font-normal">Author&apos;s Club</span>, a monthly subscription program conceived to help each author live their dream.
  </p>,
  <p key="CommunityDescriptions_2" className="font-roboto font-light">In the <span className="text-united-nations-blue font-normal">Author&apos;s Club</span> each author has the opportunity to create a special environment for their readers, by making special content, Q&A lives, chapter readings and much more.</p>
]

const PublishedDescription = [
  <p key="PublishedDescription_1" className="font-roboto font-light">
    Nexus has formed partnerships with book publishers to provide valuable <span className="text-united-nations-blue font-normal">opportunities</span> for new authors. Our platform is dedicated to helping writers <span className="text-united-nations-blue font-normal">succeed</span>, and these partnerships allow us to offer additional resources and support to those looking to break into the publishing industry.
  </p>
]

export function Functionalities() {
  return ( 
    <div id="functionalities" className="flex flex-col items-center bg-[length:100%] bg-no-repeat bg-gradient-to-b from-transparent via-[#f2f6fa] to-transparent -mt-16 sm:mt-0 relative -z-20">
      <FuncCard
        title="Tell your story to the world!"
        descriptions={TellStoryDescriptions}
        imgSrc="/typewriter.png"
        imgAlt="typewriter"
      />

      <FuncCard
        id="community"
        title="Create your community"
        descriptions={CommunityDescriptions}
        imgSrc="/community.png"
        imgAlt="community"
        flipped
      />
      
      <FuncCard
        title="Get publised"
        descriptions={PublishedDescription}
        imgSrc="/book-published.png"
        imgAlt="book"
      />
    </div>
  );
}