import { useAppStore, PhotoType } from "@/lib/store";
import { useTranslation } from "@/lib/translations";
import { Button } from "./ui/button";
import { useRef, useState, useEffect } from "react";
import { Camera, Upload } from "lucide-react";

type PhotoCaptureProps = {
  photoType: keyof PhotoType;
};

export function PhotoCapture({ photoType }: PhotoCaptureProps) {
  const { photos, setPhoto, locale } = useAppStore();
  const { t } = useTranslation(locale);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setCameraActive(true);
        setCameraPermission(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraPermission(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setCameraActive(false);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
        setPhoto(photoType, dataUrl);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhoto(photoType, event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (photos[photoType]) {
    return (
      <div className="flex flex-col items-center">
        <img
          src={photos[photoType] as string}
          alt={t(`step${["odometer", "licensePlate", "fullView", "damage"].indexOf(photoType) + 1}Title`)}
          className="w-full max-h-96 object-contain rounded-md mb-4"
        />
        <Button 
          variant="outline" 
          onClick={() => setPhoto(photoType, null)}
          className="w-full"
        >
          {t("retakePhoto")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {cameraActive ? (
        <div className="relative w-full">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-64 bg-black rounded-md object-cover"
          />
          <Button
            onClick={capturePhoto}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-[#0066cc]"
          >
            {t("takePhoto")}
          </Button>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      ) : (
        <div className="flex flex-col items-center w-full space-y-4">
          <Button 
            onClick={startCamera} 
            className="w-full bg-[#0066cc]"
            disabled={cameraPermission === false}
          >
            <Camera className="mr-2 h-4 w-4" />
            {t("useCamera")}
          </Button>
          
          <div className="flex items-center w-full">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-2 text-gray-500 text-sm">{t("or")}</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>
          
          <label className="w-full">
            <div className="flex items-center justify-center w-full h-12 px-4 text-sm font-medium text-white bg-[#0066cc] rounded-md cursor-pointer hover:bg-[#0055aa]">
              <Upload className="mr-2 h-4 w-4" />
              {t("uploadPhoto")}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          
          {cameraPermission === false && (
            <p className="text-red-500 text-sm mt-2">{t("permissionDenied")}</p>
          )}
        </div>
      )}
    </div>
  );
}