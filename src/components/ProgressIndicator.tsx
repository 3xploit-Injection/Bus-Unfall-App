import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ProgressIndicator() {
  const { currentStep, photos } = useAppStore();

  return (
    <div className="flex justify-between p-4 bg-white border-b border-gray-200">
      {[0, 1, 2, 3, 4].map((step) => (
        <div
          key={step}
          className={cn(
            "w-4 h-4 rounded-full",
            currentStep >= step ? "bg-[#0066cc]" : "bg-gray-200",
            step < 4 &&
              photos[
                ["odometer", "licensePlate", "fullView", "damage"][
                  step
                ] as keyof typeof photos
              ] &&
              "bg-[#00cc66]"
          )}
        />
      ))}
    </div>
  );
}