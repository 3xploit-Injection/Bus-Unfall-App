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
      updateFormData: (key, value) => set((state) => ({
        formData: { ...state.formData, [key]: value }
      })),
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
        },
      }),
    }
  )
);