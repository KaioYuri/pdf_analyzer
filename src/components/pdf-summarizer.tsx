"use client";

import * as React from "react";
import { generateSummaryAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Download, FileText, Loader2, UploadCloud } from "lucide-react";

export function PdfSummarizer() {
  const [file, setFile] = React.useState<File | null>(null);
  const [summary, setSummary] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        toast({
          variant: "destructive",
          title: "Tipo de arquivo inválido",
          description: "Por favor, faça o upload de um arquivo PDF válido",
        });
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }
      setFile(selectedFile);
      setSummary(null);
    }
  };

  const handleSummarize = async () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "Nenhum arquivo foi selecionado",
        description: "Por favor, selecione um arquivo para ser resumido.",
      });
      return;
    }
    setIsLoading(true);
    setSummary(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const pdfDataUri = reader.result as string;
      const result = await generateSummaryAction(pdfDataUri);
      if (result.success && result.summary) {
        setSummary(result.summary);
        toast({
          title: "Sucesso!",
          description: "Seu arquivo foi resumido!",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Falha ao resumir o arquivo",
          description: result.error,
        });
      }
      setIsLoading(false);
    };
    reader.onerror = () => {
      toast({
        variant: "destructive",
        title: "Falha ao ler o arquivo",
        description: "Ocorreu um erro ao ler o arquivo.",
      });
      setIsLoading(false);
    };
  };

  const downloadSummary = () => {
    if (!summary) return;
    const blob = new Blob([summary], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${file?.name.replace('.pdf', '')}_summary.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <UploadCloud className="h-6 w-6" />
            Faça upload do seu PDF
          </CardTitle>
          <CardDescription>
            Selecione um arquivo pdf do seu dispositivo e clique em "Resuma".
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              id="pdf-file"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="flex-grow"
            />
            <Button
              onClick={handleSummarize}
              disabled={isLoading || !file}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analizando...
                </>
              ) : (
                "Resuma"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {summary && (
        <Card className="shadow-lg animate-in fade-in-50 duration-500">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1.5">
              <CardTitle className="font-headline text-2xl flex items-center gap-2">
                <FileText className="h-6 w-6" />
                Resumo gerado
              </CardTitle>
              <CardDescription>
              Aqui está o resumo conciso do seu documento.
              </CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={downloadSummary}>
              <Download className="h-4 w-4" />
              <span className="sr-only">Baixar resumo</span>
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-72 w-full rounded-md border p-4">
              <p className="text-sm text-foreground/90 whitespace-pre-wrap">
                {summary}
              </p>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
