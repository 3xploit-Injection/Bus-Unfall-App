import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PhotoType = {
  odometer: string | null;
  licensePlate: string | null;
  fullView: string | null;
  damage: string | null;
};

export type FormDataType = {
  driverName: string;
  busId: string;
  location: string;
  incidentTime: Date;
  additionalInfo: string;
};

type AppState = {
  currentStep: number;
  photos: PhotoType;
  formData: FormDataType;
  locale: string;
  isSending: boolean;
  isSuccess: boolean;
  
  // Actions
  setCurrentStep: (step: number) => void;
  setPhoto: (type: keyof PhotoType, dataUrl: string | null) => void;
  updateFormData: <K extends keyof FormDataType>(key: K, value: FormDataType[K]) => void;
  setLocale: (locale: string) => void;
  setIsSending: (isSending: boolean) => void;
  setIsSuccess: (isSuccess: boolean) => void;
  resetPhotos: () => void;
  resetForm: () => void;
};

// Helper function to ensure we have a valid date
const ensureValidDate = (date: any): Date => {
  // If it's already a valid Date object, return it
  if (date instanceof Date && !isNaN(date.getTime())) {
    return date;
  }
  
  // If it's a string that can be parsed to a date, parse it
  if (typeof date === 'string') {
    const parsedDate = new Date(date);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate;
    }
  }
  
  // If all else fails, return the current date
  return new Date();
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentStep: 0,
      photos: {
        odometer: null,
        licensePlate: null,
        fullView: null,
        damage: null,
      },
      formData: {
        driverName: '',
        busId: '',
        location: '',
        incidentTime: new Date(),
        additionalInfo: '',
      },
      locale: navigator.language.startsWith('de') ? 'de' : 'en',
      isSending: false,
      isSuccess: false,
      
      setCurrentStep: (step) => set({ currentStep: step }),
      setPhoto: (type, dataUrl) => set((state) => ({
        photos: { ...state.photos, [type]: dataUrl }
      })),
      updateFormData: (key, value) => set((state) => {
        // Special handling for the incidentTime to ensure it's a valid date
        if (key === 'incidentTime') {
          return {
            formData: { 
              ...state.formData, 
              [key]: ensureValidDate(value) 
            }
          };
        }
        
        return {
          formData: { ...state.formData, [key]: value }
        };
      }),
      setLocale: (locale) => set({ locale }),
      setIsSending: (isSending) => set({ isSending }),
      setIsSuccess: (isSuccess) => set({ isSuccess }),
      resetPhotos: () => set({
        photos: {
          odometer: null,
          licensePlate: null,
          fullView: null,
          damage: null,
        }
      }),
      resetForm: () => set((state) => ({
        formData: {
          ...state.formData,
          location: '',
          incidentTime: new Date(),
          additionalInfo: '',
        }
      })),
    }),
    {
      name: 'bus-accident-app-storage',
      partialize: (state) => ({
        locale: state.locale,
        formData: {
          driverName: state.formData.driverName,
          busId: state.formData.busId,
          // Add the missing properties with default values
          location: '',
          incidentTime: new Date(),
          additionalInfo: '',
        },
      }),
      // Fix the custom storage implementation
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          
          try {
            const parsed = JSON.parse(str);
            
            // If we have persisted form data with an incident time, make sure it's a valid date
            if (parsed?.state?.formData?.incidentTime) {
              try {
                parsed.state.formData.incidentTime = new Date(parsed.state.formData.incidentTime);
                
                // If the date is invalid, replace with current date
                if (isNaN(parsed.state.formData.incidentTime.getTime())) {
                  parsed.state.formData.incidentTime = new Date();
                }
              } catch (e) {
                parsed.state.formData.incidentTime = new Date();
              }
            }
            
            return parsed;
          } catch (e) {
            return null;
          }
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);