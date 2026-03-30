import Form from "@/app/components/form/form";
import Header from "@/app/components/header/header";

interface PageProps {
  params: { name: string };
}

const Page = async ({ params }: PageProps) => {
  const { name } = await params;
  return (
    <div>
      <Header title={String(name)} />
      <Form tableName={name} />
    </div>
  );
};

export default Page;
