import StudyTopicClient from "./client";

export function generateStaticParams() {
  return [
    { slug: "security-concepts" },
    { slug: "identity" },
    { slug: "azure-security" },
    { slug: "compliance" },
  ];
}

export default async function StudyTopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <StudyTopicClient slug={slug} />;
}
