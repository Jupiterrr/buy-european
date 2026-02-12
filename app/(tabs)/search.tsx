import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react-native";
import { rootStore } from "@/lib/rootStore";

type SearchMode = "product" | "company";

const EUROPEAN_COUNTRY_CODES = new Set([
  "AL", "AD", "AM", "AT", "AZ", "BY", "BE", "BA", "BG", "HR", "CY", "CZ", "DK", "EE",
  "FI", "FR", "GE", "DE", "GR", "HU", "IS", "IE", "IT", "XK", "LV", "LI", "LT", "LU",
  "MT", "MD", "MC", "ME", "NL", "MK", "NO", "PL", "PT", "RO", "RU", "SM", "RS", "SK",
  "SI", "ES", "SE", "CH", "TR", "UA", "GB", "VA"
]);

const COUNTRY_NAMES_BY_LANGUAGE: Record<string, Record<string, string>> = {
  de: {
    DE: "Deutschland",
    GB: "Vereinigtes Konigreich",
    US: "Vereinigte Staaten",
    FR: "Frankreich",
    FI: "Finnland",
    SE: "Schweden",
    NL: "Niederlande",
    BE: "Belgien",
    IT: "Italien",
    ES: "Spanien",
    AT: "Osterreich",
    CH: "Schweiz",
    DK: "Danemark",
    NO: "Norwegen",
    PL: "Polen",
    IE: "Irland",
  },
  es: {
    DE: "Alemania",
    GB: "Reino Unido",
    US: "Estados Unidos",
    FR: "Francia",
    FI: "Finlandia",
    SE: "Suecia",
    NL: "Paises Bajos",
    BE: "Belgica",
    IT: "Italia",
    ES: "Espana",
    AT: "Austria",
    CH: "Suiza",
    DK: "Dinamarca",
    NO: "Noruega",
    PL: "Polonia",
    IE: "Irlanda",
  },
};

function countryCodeToFlag(code: string | null | undefined) {
  if (!code) return "";
  const normalized = code.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(normalized)) return "";
  return String.fromCodePoint(...[...normalized].map((char) => 127397 + char.charCodeAt(0)));
}

function getLocalizedCountryName(
  countryCode: string | null | undefined,
  fallbackName: string | null | undefined,
  locale: string
) {
  if (!countryCode) return fallbackName?.trim() || null;
  const normalized = countryCode.trim().toUpperCase();
  const baseLocale = locale.toLowerCase().split("-")[0];

  try {
    if (typeof Intl !== "undefined" && typeof (Intl as any).DisplayNames === "function") {
      const displayNames = new (Intl as any).DisplayNames([locale], { type: "region" });
      const localized = displayNames.of(normalized);
      if (localized && localized.toUpperCase() !== normalized) {
        const manualLocalized = COUNTRY_NAMES_BY_LANGUAGE[baseLocale]?.[normalized];
        if (manualLocalized && localized === fallbackName) {
          return manualLocalized;
        }
        return localized;
      }
    }
  } catch {
    // Fall back to provided country name if localization is unavailable.
  }

  const manualLocalized = COUNTRY_NAMES_BY_LANGUAGE[baseLocale]?.[normalized];
  if (manualLocalized) {
    return manualLocalized;
  }

  return fallbackName?.trim() || null;
}

function formatCountry(
  countryCode: string | null | undefined,
  countryName: string | null | undefined,
  unknownLabel: string,
  locale: string
) {
  const name = getLocalizedCountryName(countryCode, countryName, locale);
  const code = countryCode?.trim().toUpperCase();

  if (!name && !code) return unknownLabel;
  if (!code) return name || unknownLabel;

  const flag = countryCodeToFlag(code);
  const nameSuffix = name && name.toUpperCase() !== code ? ` - ${name}` : "";
  return `${flag ? `${flag} ` : ""}${code}${nameSuffix}`;
}

function hasMeaningfulValue(value: string | null | undefined) {
  const normalized = (value ?? "").trim().toLowerCase();
  return normalized !== "" && normalized !== "n/a" && normalized !== "na";
}

function isEuropeanCountry(code: string | null | undefined) {
  if (!code) return null;
  const normalized = code.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(normalized)) return null;
  return EUROPEAN_COUNTRY_CODES.has(normalized);
}

export default function SearchScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const [mode, setMode] = useState<SearchMode>("product");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);

  async function handleSearch() {
    const input = query.trim();
    if (!input) {
      setError(t("search.enterQuery"));
      setCompanyInfo(null);
      return;
    }

    setError(null);

    if (mode === "product") {
      const code = input.replace(/\s+/g, "");
      router.push({
        pathname: "/product",
        params: { code },
      });
      return;
    }

    setLoading(true);
    setCompanyInfo(null);
    const result = await rootStore.productStore.fetchCompany(input);
    setLoading(false);

    if (!result) {
      setError(t("search.noCompanyFound"));
      return;
    }

    setCompanyInfo(result);
  }

  const primaryCompanyName = companyInfo?.company?.name ?? t("common.unknown");
  const primaryCompanyCountry = formatCountry(
    companyInfo?.company?.countryCode,
    companyInfo?.company?.country,
    t("common.unknown"),
    i18n.resolvedLanguage || "en"
  );
  const isEuropean = isEuropeanCountry(companyInfo?.company?.countryCode);
  const europeanCompanyValue =
    isEuropean == null
      ? t("common.unknown")
      : isEuropean
        ? `🇪🇺 ${t("common.yes")}`
        : t("common.no");
  const resultCardStatusStyle =
    isEuropean == null
      ? styles.resultCardUnknown
      : isEuropean
        ? styles.resultCardYes
        : styles.resultCardNo;
  const hasParentCompany = hasMeaningfulValue(companyInfo?.parentCompany?.name);
  const parentCompanyName = companyInfo?.parentCompany?.name ?? "";
  const parentCompanyCountry = hasParentCompany
    ? formatCountry(
        companyInfo?.parentCompany?.countryCode,
        companyInfo?.parentCompany?.country,
        t("common.unknown"),
        i18n.resolvedLanguage || "en"
      )
    : "";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("search.title")}</Text>
      <Text style={styles.subtitle}>{t("search.description")}</Text>

      <View style={styles.modeRow}>
        <TouchableOpacity
          style={[styles.modeButton, mode === "product" && styles.modeButtonActive]}
          onPress={() => {
            setMode("product");
            setCompanyInfo(null);
            setError(null);
          }}
        >
          <Text style={[styles.modeButtonText, mode === "product" && styles.modeButtonTextActive]}>
            {t("search.modeProduct")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, mode === "company" && styles.modeButtonActive]}
          onPress={() => {
            setMode("company");
            setCompanyInfo(null);
            setError(null);
          }}
        >
          <Text style={[styles.modeButtonText, mode === "company" && styles.modeButtonTextActive]}>
            {t("search.modeCompany")}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder={
            mode === "product"
              ? t("search.inputPlaceholderProduct")
              : t("search.inputPlaceholderCompany")
          }
          keyboardType={mode === "product" ? "number-pad" : "default"}
          autoCapitalize="none"
        />
        {query.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => {
              setQuery("");
              setError(null);
            }}
            hitSlop={8}
          >
            <X size={16} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={styles.searchButton} onPress={handleSearch} disabled={loading}>
        <Text style={styles.searchButtonText}>{t("search.searchButton")}</Text>
      </TouchableOpacity>

      {loading && (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="small" color="#0052B4" />
          <Text style={styles.loadingText}>{t("search.loading")}</Text>
        </View>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}

      {mode === "company" && companyInfo && (
        <View style={[styles.resultCard, resultCardStatusStyle]}>
          <Text style={styles.resultTitle}>{t("search.companyResult")}</Text>

          <View style={styles.row}>
            <Text style={styles.label}>{t("search.company")}:</Text>
            <Text style={styles.value}>{primaryCompanyName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t("search.country")}:</Text>
            <Text style={styles.value}>{primaryCompanyCountry}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t("search.fromEuropeanCompany")}:</Text>
            <Text style={styles.value}>{europeanCompanyValue}</Text>
          </View>

          {hasParentCompany && (
            <>
              <View style={styles.divider} />

              <View style={styles.row}>
                <Text style={styles.label}>{t("search.parentCompany")}:</Text>
                <Text style={styles.value}>{parentCompanyName}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>{t("search.country")}:</Text>
                <Text style={styles.value}>{parentCompanyCountry}</Text>
              </View>
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 16,
  },
  modeRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  modeButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  modeButtonActive: {
    backgroundColor: "#0052B4",
    borderColor: "#0052B4",
  },
  modeButtonText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "600",
  },
  modeButtonTextActive: {
    color: "#FFFFFF",
  },
  inputWrapper: {
    position: "relative",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingHorizontal: 12,
    paddingVertical: 10,
    paddingRight: 40,
    fontSize: 16,
  },
  clearButton: {
    position: "absolute",
    right: 10,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  searchButton: {
    backgroundColor: "#0052B4",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  loadingBox: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  loadingText: {
    color: "#374151",
  },
  errorText: {
    marginTop: 12,
    color: "#B91C1C",
    fontWeight: "600",
  },
  resultCard: {
    marginTop: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  resultCardYes: {
    borderColor: "#16A34A",
    backgroundColor: "#F0FDF4",
  },
  resultCardNo: {
    borderColor: "#DC2626",
    backgroundColor: "#FEF2F2",
  },
  resultCardUnknown: {
    borderColor: "#9CA3AF",
    backgroundColor: "#F9FAFB",
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    color: "#111827",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 6,
  },
  label: {
    fontWeight: "700",
    color: "#374151",
  },
  value: {
    flex: 1,
    textAlign: "right",
    color: "#111827",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 8,
  },
});
