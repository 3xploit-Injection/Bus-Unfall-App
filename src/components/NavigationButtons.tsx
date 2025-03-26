import { useAppStore, PhotoType } from "@/lib/store";
import { useTranslation } from "@/lib/translations";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { sendReport } from "@/lib/email";
import { saveReportLocally } from "@/lib/storage";

export function NavigationButtons() {
  const { 
    currentStep, 
    setCurrentStep, 
    photos, 
    formData, 
    locale, 
    isSending, 
    setIsSending,
    setIsSuccess,
    resetPhotos,
    resetForm
  } = useAppStore();
  const { t } = useTranslation(locale);

  const handleNext = () => {
    // Check if current step photo is taken
    if (currentStep < 4) {
      const photoTypes = ["odometer", "licensePlate", "fullView", "damage"];
      const currentPhotoType = photoTypes[currentStep] as keyof PhotoType;
      
      if (!photos[currentPhotoType]) {
        toast.error(t("missingPhotos"));
        return;
      }
    }
    
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.driverName || !formData.busId || !formData.location) {
      toast.error(t("requiredField"));
      return;
    }

    // Check if all photos are taken
    const photoTypes = ["odometer", "licensePlate", "fullView", "damage"];
    for (const type of photoTypes) {
      if (!photos[type as keyof PhotoType]) {
        toast.error(t("missingPhotos"));
        return;
      }
    }

    try {
      setIsSending(true);
      
      // Versuche, den Bericht per E-Mail zu senden
      const emailResult = await sendReport(formData, photos);
      
      // Wenn der E-Mail-Versand fehlschlägt, speichere den Bericht lokal
      if (!emailResult.success) {
        console.log("Email sending failed, saving report locally");
        const localResult = await saveReportLocally(formData, photos);
        
        if (localResult.success) {
          toast.success("Bericht lokal gespeichert. Sie können ihn später erneut senden.");
          setIsSuccess(true);
          resetPhotos();
          resetForm();
          setCurrentStep(0);
        } else {
          toast.error("Fehler beim Speichern des Berichts");
        }
      } else {
        // E-Mail-Versand erfolgreich
        toast.success(emailResult.message);
        setIsSuccess(true);
        resetPhotos();
        resetForm();
        setCurrentStep(0);
      }
    } catch (error) {
      console.error('Error in report submission process:', error);
      
      // Bei einem unerwarteten Fehler versuchen wir, lokal zu speichern
      try {
        const localResult = await saveReportLocally(formData, photos);
        if (localResult.success) {
          toast.success("Bericht lokal gespeichert. Sie können ihn später erneut senden.");
          setIsSuccess(true);
          resetPhotos();
          resetForm();
          setCurrentStep(0);
        } else {
          toast.error("Fehler beim Speichern des Berichts");
        }
      } catch (storageError) {
        toast.error("Kritischer Fehler beim Speichern des Berichts");
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex justify-between p-4 border-t border-gray-200 bg-white">
      {currentStep > 0 && (
        <Button variant="outline" onClick={handleBack}>
          {t("back")}
        </Button>
      )}
      
      {currentStep < 4 ? (
        <Button 
          onClick={handleNext} 
          className="ml-auto bg-[#0066cc]"
        >
          {t("next")}
        </Button>
      ) : (
        <Button 
          onClick={handleSubmit} 
          className="ml-auto bg-[#0066cc]"
          disabled={isSending}
        >
          {isSending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("sending")}
            </>
          ) : (
            t("send")
          )}
        </Button>
      )}
    </div>
  );
}