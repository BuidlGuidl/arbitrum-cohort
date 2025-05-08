const faqContent = [
  {
    title: "What is the Arbitrum Cohort?",
    content:
      "The Arbitrum Cohort is a collaborative program by Arbitrum and BuidlGuidl that supports a handpicked group of high-impact builders. Its goal is to accelerate the development of dapps and tools on the Arbitrum ecosystem by providing targeted support, mentorship, and monthly on-chain funding streams.",
  },
  {
    title: "How does the Arbitrum Cohort work?",
    content:
      "Selected developers are invited to join the cohort and receive monthly funding streams for their ongoing contributions. The program is not a public task board, it is a place for builders to contribute and learn. It highlights the work of its members, tracks progress through public updates and contribution logs, and coordinates projects directly with participants.",
  },
  {
    title: "What are the core values of the Arbitrum Cohort?",
    content:
      "The cohort values quality, transparency, and collaboration. Builders are expected to focus on impactful, open-source projects, maintain accountability through regular updates, and contribute to a culture of shared learning and continuous improvement.",
  },
  {
    title: "How can I join the Arbitrum Cohort?",
    content:
      "There is no open application process. Developers are handpicked based on their skills, experience, and past contributions to the ecosystem. Referrals and direct invitations are the primary ways to join, with the core team reviewing and selecting participants.",
  },
  {
    title: "How do streams work?",
    content:
      "Each cohort member receives a monthly on-chain funding stream, representing the maximum amount they can withdraw for their contributions. Streams are topped up monthly and can be withdrawn as members make progress on their projects.",
  },
  {
    title: "Who is funding this initiative?",
    content:
      "The Arbitrum Cohort is funded by the Arbitrum Foundation, with administration and support provided by BuidlGuidl. The program is designed to maximize impact and visibility for both the builders and the broader Arbitrum ecosystem.",
  },
];

export default function FaqPage() {
  return (
    <div className="container px-4 md:px-0 mx-auto pb-8">
      <div className="rounded-2xl p-4 md:p-8 mb-8 w-full bg-[#d9d9d9] bg-[url('/bg-grid.svg')] bg-[center_top_-0.5rem]">
        <h1 className="text-4xl md:text-6xl/[1.2] text-primary-content lg:mb-28">Frequently Asked Questions</h1>
      </div>
      {faqContent.map((item, index) => (
        <div key={item.title} className="mt-6 collapse collapse-plus bg-base-300">
          <input type="radio" name="faq-accordion" defaultChecked={index === 0} />
          <div className="collapse-title pr-8 pl-16 text-xl font-normal lg:text-3xl">{item.title}</div>
          <div className="collapse-content pr-4 md:pr-8 pl-8 md:pl-16 lg:text-xl/8">
            <p className="mt-0 mb-2">{item.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
