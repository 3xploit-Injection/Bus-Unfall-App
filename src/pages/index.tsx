import { Header } from "@/components/layout/Header";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { PhotoCapture } from "@/components/PhotoCapture";
import { FormInputs } from "@/components/FormInputs";
import { PhotoPreview } from "@/components/PhotoPreview";
import { NavigationButtons } from "@/components/NavigationButtons";
import { SuccessMessage } from "@/components/SuccessMessage";
import { useAppStore } from "@/lib/store";
import { useTranslation } from "@/lib/translations";

const Index = () => {
  const { currentStep, locale, isSuccess } = useAppStore();
  const { t } = useTranslation(locale);

  // Step titles and descriptions
  const steps = [
    {
      title: t("step1Title"),
      description: t("step1Desc"),
      photoType: "odometer",
    },
    {
      title: t("step2Title"),
      description: t("step2Desc"),
      photoType: "licensePlate",
    },
    {
      title: t("step3Title"),
      description: t("step3Desc"),
      photoType: "fullView",
    },
    {
      title: t("step4Title"),
      description: t("step4Desc"),
      photoType: "damage",
    },
    {
      title: t("step5Title"),
      description: t("step5Desc"),
    },
  ];

  const currentStepData = steps[currentStep];

  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      <Header />
      <ProgressIndicator />

      {isSuccess ? (
        <div className="flex-1 flex items-center justify-center">
          <SuccessMessage />
        </div>
      ) : (
        <>
          <main className="flex-1 p-4 md:p-6 max-w-3xl mx-auto w-full">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">{currentStepData.title}</h2>
              <p className="text-gray-500">{currentStepData.description}</p>
            </div>

            {currentStep < 4 ? (
              <PhotoCapture photoType={currentStepData.photoType as any} />
            ) : (
              <div className="space-y-8">
                <FormInputs />
                <PhotoPreview />
              </div>
            )}
          </main>

          <NavigationButtons />
        </>
      )}
    </div>
  );
};

export default Index;