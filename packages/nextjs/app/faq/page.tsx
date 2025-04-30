const faqContent = [
  {
    title: "What is the Arbitrum's Cohort?",
    content:
      "The Arbitrum's Cohort is an initiative by Arbitrum and BuidlGuidl aimed at funding focused, high-leverage open-source builders and projects. By providing a monthly UBI to handpicked developers, we support ongoing contributions to the Arbitrum ecosystem .",
  },
  {
    title: "How do the Arbitrum's Cohort work?",
    content:
      "The Arbitrum's Cohort is an initiative by Arbitrum and BuidlGuidl aimed at funding focused, high-leverage open-source builders and projects. By providing a monthly UBI to handpicked developers, we support ongoing contributions to the Arbitrum ecosystem .",
  },
  {
    title: "What are the core values of the Arbitrum's Cohort?",
    content:
      "The Arbitrum's Cohort is an initiative by Arbitrum and BuidlGuidl aimed at funding focused, high-leverage open-source builders and projects. By providing a monthly UBI to handpicked developers, we support ongoing contributions to the Arbitrum ecosystem .",
  },
  {
    title: "How can I join the Arbitrum's Cohort?",
    content:
      "The Arbitrum's Cohort is an initiative by Arbitrum and BuidlGuidl aimed at funding focused, high-leverage open-source builders and projects. By providing a monthly UBI to handpicked developers, we support ongoing contributions to the Arbitrum ecosystem .",
  },
  {
    title: "How do streams work?",
    content:
      "The Arbitrum's Cohort is an initiative by Arbitrum and BuidlGuidl aimed at funding focused, high-leverage open-source builders and projects. By providing a monthly UBI to handpicked developers, we support ongoing contributions to the Arbitrum ecosystem .",
  },
  {
    title: "Who is funding this initiative?",
    content:
      "The Arbitrum's Cohort is an initiative by Arbitrum and BuidlGuidl aimed at funding focused, high-leverage open-source builders and projects. By providing a monthly UBI to handpicked developers, we support ongoing contributions to the Arbitrum ecosystem .",
  },
];

export default function FaqPage() {
  return (
    <div className="container px-4 md:px-0 mx-auto">
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
