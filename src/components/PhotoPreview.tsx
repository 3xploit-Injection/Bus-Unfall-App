import { useAppStore } from "@/lib/store";
import { useTranslation } from "@/lib/translations";

export function PhotoPreview() {
  const { photos, locale } = useAppStore();
  const { t } = useTranslation(locale);

  const photoTypes = [
    { key: "odometer", title: t("step1Title") },
    { key: "licensePlate", title: t("step2Title") },
    { key: "fullView", title: t("step3Title") },
    { key: "damage", title: t("step4Title") },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">{t("photoSummary")}</h3>
      <div className="grid grid-cols-2 gap-4">
        {photoTypes.map((photo) => (
          <div key={photo.key} className="space-y-2">
            <h4 className="font-medium text-sm">{photo.title}</h4>
            <img
              src={photos[photo.key as keyof typeof photos] as string}
              alt={photo.title}
              className="w-full h-32 object-cover rounded-md border border-gray-200"
            />
          </div>
        ))}
      </div>
    </div>
  );
}