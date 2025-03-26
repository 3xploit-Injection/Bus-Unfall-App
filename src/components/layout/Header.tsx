import { useAppStore } from "@/lib/store";
import { useTranslation } from "@/lib/translations";
import { Button } from "../ui/button";

export function Header() {
  const { locale, setLocale } = useAppStore();
  const { t } = useTranslation(locale);

  return (
    <header className="bg-[#0066cc] text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">{t("appTitle")}</h1>
      <div className="flex space-x-2">
        <Button
          variant={locale === "de" ? "secondary" : "outline"}
          size="sm"
          onClick={() => setLocale("de")}
          className={locale === "de" ? "bg-white text-[#0066cc]" : "bg-[rgba(255,255,255,0.3)] text-white hover:text-[#0066cc]"}
        >
          DE
        </Button>
        <Button
          variant={locale === "en" ? "secondary" : "outline"}
          size="sm"
          onClick={() => setLocale("en")}
          className={locale === "en" ? "bg-white text-[#0066cc]" : "bg-[rgba(255,255,255,0.3)] text-white hover:text-[#0066cc]"}
        >
          EN
        </Button>
      </div>
    </header>
  );
}