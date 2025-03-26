import { useAppStore } from "@/lib/store";
import { useTranslation } from "@/lib/translations";
import { Button } from "./ui/button";
import { CheckCircle } from "lucide-react";

export function SuccessMessage() {
  const { setIsSuccess, locale } = useAppStore();
  const { t } = useTranslation(locale);

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
      <h2 className="text-2xl font-bold mb-4">{t("emailSuccess")}</h2>
      <p className="text-gray-600 mb-8">{t("successMessage")}</p>
      <Button 
        onClick={() => setIsSuccess(false)}
        className="bg-[#0066cc]"
      >
        {t("startOver")}
      </Button>
    </div>
  );
}