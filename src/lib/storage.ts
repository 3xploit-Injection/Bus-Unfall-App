import { FormDataType, PhotoType } from "./store";

// Funktion zum Speichern eines Berichts lokal
export function saveReportLocally(formData: FormDataType, photos: PhotoType) {
  try {
    // Erstelle eine eindeutige ID für den Bericht
    const reportId = `report_${Date.now()}`;
    
    // Formatiere die Daten für die Speicherung
    const reportData = {
      id: reportId,
      timestamp: new Date().toISOString(),
      formData,
      photos,
    };
    
    // Hole bestehende Berichte oder initialisiere ein leeres Array
    const existingReportsJson = localStorage.getItem('bus_accident_reports');
    const existingReports = existingReportsJson ? JSON.parse(existingReportsJson) : [];
    
    // Füge den neuen Bericht hinzu
    existingReports.push(reportData);
    
    // Speichere die aktualisierte Liste
    localStorage.setItem('bus_accident_reports', JSON.stringify(existingReports));
    
    return {
      success: true,
      reportId,
      message: "Bericht lokal gespeichert"
    };
  } catch (error) {
    console.error("Error saving report locally:", error);
    return {
      success: false,
      message: "Fehler beim lokalen Speichern des Berichts"
    };
  }
}

// Funktion zum Abrufen aller lokal gespeicherten Berichte
export function getLocalReports() {
  try {
    const reportsJson = localStorage.getItem('bus_accident_reports');
    return reportsJson ? JSON.parse(reportsJson) : [];
  } catch (error) {
    console.error("Error retrieving local reports:", error);
    return [];
  }
}