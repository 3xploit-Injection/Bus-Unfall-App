import { FormDataType, PhotoType } from "./store";
import { format, isValid } from "date-fns";

// EmailJS-Konfiguration
const EMAILJS_SERVICE_ID = "service_bus_accident";
const EMAILJS_TEMPLATE_ID = "template_bus_accident";
const EMAILJS_USER_ID = "YOUR_EMAILJS_USER_ID"; // Dies würde normalerweise durch eine Umgebungsvariable ersetzt
const RECIPIENT_EMAIL = "gangerapollo16@gmail.com";

// Safe date formatting function
const safeFormatDate = (date: Date): string => {
  try {
    if (!isValid(date)) return new Date().toLocaleString();
    return date.toLocaleString();
  } catch (error) {
    console.error("Error formatting date:", error);
    return new Date().toLocaleString();
  }
};

export async function sendReport(formData: FormDataType, photos: PhotoType) {
  try {
    // Ensure we have a valid date
    const incidentTime = isValid(formData.incidentTime) 
      ? formData.incidentTime 
      : new Date();
    
    // Formatiere das Datum für den E-Mail-Betreff
    const date = new Date();
    const dateString = safeFormatDate(date);
    
    // Bereite die Daten für den E-Mail-Versand vor
    const emailData = {
      to_email: RECIPIENT_EMAIL,
      subject: `Bus Unfall ${formData.busId ? '- ' + formData.busId : ''} - ${dateString}`,
      bus_id: formData.busId,
      driver_name: formData.driverName,
      location: formData.location,
      incident_time: safeFormatDate(incidentTime),
      additional_info: formData.additionalInfo || "Keine zusätzlichen Informationen",
      // Wir können die Fotos als Base64-Strings senden
      photo_odometer: photos.odometer,
      photo_license: photos.licensePlate,
      photo_full: photos.fullView,
      photo_damage: photos.damage
    };

    // Simuliere einen erfolgreichen E-Mail-Versand für die Demo
    // In einer echten Implementierung würden wir hier EmailJS verwenden
    console.log("Sending email to:", RECIPIENT_EMAIL);
    console.log("Email data:", emailData);
    
    // Simuliere eine Verzögerung für den E-Mail-Versand
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simuliere eine erfolgreiche Antwort
    return {
      success: true,
      message: `Bericht erfolgreich an ${RECIPIENT_EMAIL} gesendet`
    };
    
    /* In einer echten Implementierung mit EmailJS würde der Code so aussehen:
    
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      emailData,
      EMAILJS_USER_ID
    );
    
    return {
      success: response.status === 200,
      message: response.status === 200 
        ? `Bericht erfolgreich an ${RECIPIENT_EMAIL} gesendet` 
        : "Fehler beim Senden des Berichts"
    };
    */
    
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      message: "Fehler beim Senden des Berichts"
    };
  }
}