import { useAppStore, FormDataType } from "@/lib/store";
import { useTranslation } from "@/lib/translations";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { format, isValid } from "date-fns";

export function FormInputs() {
  const { formData, updateFormData, locale } = useAppStore();
  const { t } = useTranslation(locale);

  // Ensure we have a valid date
  const incidentTime = isValid(formData.incidentTime) 
    ? formData.incidentTime 
    : new Date();

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const [day, month, year] = e.target.value.split('.');
      if (day && month && year) {
        const newDate = new Date(incidentTime);
        newDate.setFullYear(parseInt(year), parseInt(month) - 1, parseInt(day));
        
        // Only update if the resulting date is valid
        if (isValid(newDate)) {
          updateFormData('incidentTime', newDate);
        }
      }
    } catch (error) {
      console.error("Error parsing date:", error);
      // Don't update the date if there's an error
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const [hours, minutes] = e.target.value.split(':');
      if (hours && minutes) {
        const newDate = new Date(incidentTime);
        newDate.setHours(parseInt(hours), parseInt(minutes));
        
        // Only update if the resulting date is valid
        if (isValid(newDate)) {
          updateFormData('incidentTime', newDate);
        }
      }
    } catch (error) {
      console.error("Error parsing time:", error);
      // Don't update the time if there's an error
    }
  };

  const setCurrentTime = () => {
    updateFormData('incidentTime', new Date());
  };

  // Safe date formatting function
  const safeFormat = (date: Date, formatString: string): string => {
    try {
      if (!isValid(date)) return "";
      return format(date, formatString);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="driverName">
          {t("driverName")} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="driverName"
          value={formData.driverName}
          onChange={(e) => updateFormData("driverName", e.target.value)}
          placeholder={t("driverName")}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="busId">
          {t("busId")} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="busId"
          value={formData.busId}
          onChange={(e) => updateFormData("busId", e.target.value)}
          placeholder={t("busId")}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">
          {t("location")} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => updateFormData("location", e.target.value)}
          placeholder={t("location")}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="incidentTime">{t("incidentTime")}</Label>
        <div className="flex space-x-2">
          <div className="flex-1">
            <Input
              id="incidentDate"
              value={safeFormat(incidentTime, "dd.MM.yyyy")}
              onChange={handleDateChange}
              placeholder={t("dateFormat")}
            />
          </div>
          <div className="flex-1">
            <Input
              id="incidentTime"
              value={safeFormat(incidentTime, "HH:mm")}
              onChange={handleTimeChange}
              placeholder={t("timeFormat")}
            />
          </div>
          <Button 
            type="button" 
            onClick={setCurrentTime}
            variant="outline"
          >
            {t("setCurrentTime")}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="additionalInfo">{t("additionalInfo")}</Label>
        <Textarea
          id="additionalInfo"
          value={formData.additionalInfo}
          onChange={(e) => updateFormData("additionalInfo", e.target.value)}
          placeholder={t("additionalInfo")}
          rows={4}
        />
      </div>
    </div>
  );
}