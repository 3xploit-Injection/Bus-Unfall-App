import { useAppStore } from "@/lib/store";
import { useTranslation } from "@/lib/translations";
import { Button } from "./ui/button";
import { CheckCircle, Save, Mail } from "lucide-react";
import { getLocalReports } from "@/lib/storage";

export function SuccessMessage() {
  const { setIsSuccess, locale } = useAppStore();
  const { t } = useTranslation(locale);
  
  // Prüfe, ob es lokale Berichte gibt
  const localReports = getLocalReports();
  const hasLocalReports = localReports.length > 0;
  
  // Der neueste Bericht ist der letzte in der Liste
  const latestReport = hasLocalReports ? localReports[localReports.length - 1] : null;
  
  // Bestimme, ob der Bericht per E-Mail gesendet oder lokal gespeichert wurde
  const wasEmailSent = !latestReport || latestReport.emailSent;

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
      <h2 className="text-2xl font-bold mb-4">{t("emailSuccess")}</h2>
      <p className="text-gray-600 mb-2">{t("successMessage")}</p>
      
      {wasEmailSent ? (
        <div className="flex items-center text-gray-600 mb-8">
          <Mail className="h-5 w-5 mr-2" />
          <span>Gesendet an: gangerapollo16@gmail.com</span>
        </div>
      ) : (
        <div className="flex items-center text-gray-600 mb-8">
          <Save className="h-5 w-5 mr-2" />
          <span>Bericht lokal gespeichert</span>
        </div>
      )}
      
      <Button 
        onClick={() => setIsSuccess(false)}
        className="bg-[#0066cc]"
      >
        {t("startOver")}
      </Button>
    </div>
  );
}