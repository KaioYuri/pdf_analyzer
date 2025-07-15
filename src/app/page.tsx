import { PdfSummarizer } from "@/components/pdf-summarizer";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl space-y-8">
        <div className="text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-primary-dark sm:text-5xl md:text-6xl">
            PDF Analyzer & Summarizer
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-lg text-muted-foreground">
          Transforme instantaneamente seus documentos PDF em resumos concisos e fáceis de ler com o poder da IA.
          </p>
        </div>
        <PdfSummarizer />
      </div>
    </main>
  );
}
