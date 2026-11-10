import React, { useState } from "react";
import { Globe, DollarSign, Languages, Search, AlertTriangle, ShieldCheck, ArrowRightLeft } from "lucide-react";
import type {
  AvailabilityStatus,
  CountryConfigRecord,
  CurrencyConfigRecord,
  LanguageConfigRecord,
  SystemSettingsRootState,
} from "../../../types/systemSettings.types";
import type { ConfirmActionRequest } from "./sharedSectionTypes";
import { getAvailabilityColors } from "../settingsUiUtils";

interface RegionalAndCurrencySectionProps {
  state: SystemSettingsRootState;
  mode: "regional" | "currency";
  canEditRegional: boolean;
  canEditCurrency: boolean;
  onUpdateCountry: (isoCode: string, nextStatus: AvailabilityStatus, reason: string) => void;
  onToggleLanguage: (code: string, reason: string) => void;
  onToggleCurrency: (code: string, reason: string) => void;
  onSetDefaultCurrency: (code: string, reason: string) => void;
  onRequestConfirm: (req: ConfirmActionRequest) => void;
}

const cardStyle: React.CSSProperties = {
  background: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: 16,
  padding: 18,
  boxShadow: "var(--shadow-sm)",
};

export const RegionalAndCurrencySection: React.FC<RegionalAndCurrencySectionProps> = ({
  state,
  mode,
  canEditRegional,
  canEditCurrency,
  onUpdateCountry,
  onToggleLanguage,
  onToggleCurrency,
  onSetDefaultCurrency,
  onRequestConfirm,
}) => {
  const [countrySearch, setCountrySearch] = useState("");
  const [langSearch, setLangSearch] = useState("");
  const [currencySearch, setCurrencySearch] = useState("");

  if (mode === "regional") {
    const filteredCountries = state.countries.filter(
      (c) =>
        c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
        c.isoCode.toLowerCase().includes(countrySearch.toLowerCase()) ||
        c.region.toLowerCase().includes(countrySearch.toLowerCase())
    );

    const filteredLangs = state.languages.filter(
      (l) =>
        l.englishName.toLowerCase().includes(langSearch.toLowerCase()) ||
        l.nativeName.toLowerCase().includes(langSearch.toLowerCase()) ||
        l.code.toLowerCase().includes(langSearch.toLowerCase())
    );

    const promptCountryAction = (country: CountryConfigRecord, nextStatus: AvailabilityStatus) => {
      onRequestConfirm({
        title: `${nextStatus === "enabled" ? "Enable" : "Restrict / Disable"} ${country.name} (${country.isoCode})`,
        description: `Change regional availability status from "${country.status}" to "${nextStatus}".`,
        impactWarning:
          "Existing member accounts and historical financial invoices in this country are NEVER deleted when availability is restricted or disabled.",
        danger: nextStatus !== "enabled",
        allowTwoPersonStage: nextStatus === "disabled",
        confirmLabel: `Apply ${nextStatus}`,
        onConfirm: ({ reason }) => onUpdateCountry(country.isoCode, nextStatus, reason),
      });
    };

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* A. Supported Countries */}
        <div style={cardStyle}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
              marginBottom: 14,
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Globe size={18} style={{ color: "var(--status-info)" }} />
                <h3 style={{ margin: 0, fontSize: 16.5, color: "var(--text-main)" }}>
                  A & D. International Supported Countries & Regional Availability
                </h3>
              </div>
              <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "var(--text-secondary)" }}>
                NobleBond is an international platform. Each market defines regional currency,
                timezone, and supported payment channels independently.
              </p>
            </div>

            <div style={{ position: "relative", minWidth: 220 }}>
              <Search
                size={14}
                style={{ position: "absolute", left: 10, top: 10, color: "var(--text-muted)" }}
              />
              <input
                type="text"
                placeholder="Search country or ISO code..."
                value={countrySearch}
                onChange={(e) => setCountrySearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "7px 10px 7px 32px",
                  borderRadius: 9,
                  border: "1px solid var(--border)",
                  background: "var(--bg-surface-elevated)",
                  color: "var(--text-main)",
                  fontSize: 12.5,
                }}
              />
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                  <th style={{ textAlign: "left", padding: "8px 10px" }}>Country (ISO)</th>
                  <th style={{ textAlign: "left", padding: "8px 10px" }}>Region</th>
                  <th style={{ textAlign: "left", padding: "8px 10px" }}>Currency / Lang</th>
                  <th style={{ textAlign: "left", padding: "8px 10px" }}>Timezone</th>
                  <th style={{ textAlign: "left", padding: "8px 10px" }}>Payment Rails</th>
                  <th style={{ textAlign: "left", padding: "8px 10px" }}>Status</th>
                  <th style={{ textAlign: "right", padding: "8px 10px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCountries.map((c) => {
                  const badge = getAvailabilityColors(c.status);
                  return (
                    <tr key={c.isoCode} style={{ borderBottom: "1px solid var(--border-light)" }}>
                      <td style={{ padding: "9px 10px", fontWeight: 700, color: "var(--text-main)" }}>
                        {c.name} ({c.isoCode})
                        {c.restrictionReason && (
                          <div style={{ fontSize: 11, fontWeight: 400, color: "var(--status-warning)", marginTop: 2 }}>
                            {c.restrictionReason}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: "9px 10px", color: "var(--text-secondary)" }}>{c.region}</td>
                      <td style={{ padding: "9px 10px" }}>
                        {c.defaultCurrencyCode} / {c.defaultLanguageCode}
                      </td>
                      <td style={{ padding: "9px 10px", color: "var(--text-muted)" }}>{c.timezone}</td>
                      <td style={{ padding: "9px 10px", fontSize: 11.5 }}>
                        {c.supportedPaymentMethods.join(", ")}
                      </td>
                      <td style={{ padding: "9px 10px" }}>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            padding: "2px 8px",
                            borderRadius: 999,
                            color: badge.color,
                            background: badge.bg,
                          }}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td style={{ padding: "9px 10px", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: 6 }}>
                          {c.status !== "enabled" && (
                            <button
                              type="button"
                              disabled={!canEditRegional}
                              onClick={() => promptCountryAction(c, "enabled")}
                              style={{
                                padding: "4px 9px",
                                borderRadius: 7,
                                border: "1px solid var(--border)",
                                background: "var(--status-success-bg)",
                                color: "var(--status-success)",
                                fontSize: 11.5,
                                fontWeight: 700,
                                cursor: canEditRegional ? "pointer" : "not-allowed",
                              }}
                            >
                              Enable
                            </button>
                          )}
                          {c.status === "enabled" && (
                            <button
                              type="button"
                              disabled={!canEditRegional}
                              onClick={() => promptCountryAction(c, "restricted")}
                              style={{
                                padding: "4px 9px",
                                borderRadius: 7,
                                border: "1px solid var(--border)",
                                background: "var(--status-warning-bg)",
                                color: "var(--status-warning)",
                                fontSize: 11.5,
                                fontWeight: 700,
                                cursor: canEditRegional ? "pointer" : "not-allowed",
                              }}
                            >
                              Restrict
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* B. Languages Table (Synced with Mobile Language Catalogue — Zero Emojis) */}
        <div style={cardStyle}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
              marginBottom: 12,
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Languages size={18} style={{ color: "var(--accent-lavender)" }} />
                <h3 style={{ margin: 0, fontSize: 16.5, color: "var(--text-main)" }}>
                  B. Supported Languages (Mobile Catalogue Sync)
                </h3>
              </div>
              <p style={{ margin: "3px 0 0", fontSize: 12, color: "var(--text-secondary)" }}>
                Synced from `NobleBond/src/features/language`. Enabling a base catalogue item exposes
                the selector only; full UI strings depend on verified i18n translation bundles.
              </p>
            </div>

            <input
              type="text"
              placeholder="Search language or code..."
              value={langSearch}
              onChange={(e) => setLangSearch(e.target.value)}
              style={{
                padding: "7px 11px",
                borderRadius: 9,
                border: "1px solid var(--border)",
                background: "var(--bg-surface-elevated)",
                color: "var(--text-main)",
                fontSize: 12.5,
              }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
              gap: 10,
            }}
          >
            {filteredLangs.map((lang: LanguageConfigRecord) => (
              <div
                key={lang.code}
                style={{
                  padding: 12,
                  borderRadius: 12,
                  background: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border-light)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main)" }}>
                    {lang.englishName} ({lang.code})
                  </div>
                  <div style={{ fontSize: 11.5, color: "var(--text-secondary)" }}>
                    Native: {lang.nativeName} • {lang.translationStatus.replace(/_/g, " ")}
                  </div>
                </div>
                <button
                  type="button"
                  disabled={!canEditRegional || lang.isDefault}
                  onClick={() =>
                    onRequestConfirm({
                      title: `${lang.isAvailable ? "Disable" : "Enable"} ${lang.englishName}?`,
                      description: `Toggle selector availability in mobile language preferences.`,
                      confirmLabel: lang.isAvailable ? "Disable Language" : "Enable Language",
                      onConfirm: ({ reason }) => onToggleLanguage(lang.code, reason),
                    })
                  }
                  style={{
                    padding: "4px 9px",
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: lang.isAvailable ? "var(--status-success-bg)" : "var(--bg-card)",
                    color: lang.isAvailable ? "var(--status-success)" : "var(--text-muted)",
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: canEditRegional && !lang.isDefault ? "pointer" : "not-allowed",
                  }}
                >
                  {lang.isDefault ? "Default" : lang.isAvailable ? "Active" : "Disabled"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // mode === "currency" (Section 5: Currency & Financial Config)
  const filteredCurrencies = state.currencies.filter(
    (c) =>
      c.code.toLowerCase().includes(currencySearch.toLowerCase()) ||
      c.name.toLowerCase().includes(currencySearch.toLowerCase())
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Financial Boundaries Notice */}
      <div
        style={{
          padding: 13,
          borderRadius: 14,
          background: "var(--status-info-bg)",
          border: "1px solid var(--border-light)",
          display: "flex",
          gap: 10,
          alignItems: "flex-start",
        }}
      >
        <ShieldCheck size={17} style={{ color: "var(--status-info)", flexShrink: 0, marginTop: 2 }} />
        <div style={{ fontSize: 12.5, color: "var(--text-main)", lineHeight: 1.5 }}>
          <strong>E. Financial Product Separation & Immutability:</strong> Changing platform display
          currencies never retroactively alters historical invoice totals. Gift Coins, Connection
          Points, and Premium USD subscriptions remain permanently isolated with zero conversion or
          cash-withdrawal routes.
        </div>
      </div>

      {/* A. Supported Currencies */}
      <div style={cardStyle}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
            marginBottom: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <DollarSign size={18} style={{ color: "var(--status-success)" }} />
            <h3 style={{ margin: 0, fontSize: 16.5, color: "var(--text-main)" }}>
              A & B. Supported Fiat Currencies
            </h3>
          </div>
          <input
            type="text"
            placeholder="Filter currencies..."
            value={currencySearch}
            onChange={(e) => setCurrencySearch(e.target.value)}
            style={{
              padding: "7px 11px",
              borderRadius: 9,
              border: "1px solid var(--border)",
              background: "var(--bg-surface-elevated)",
              color: "var(--text-main)",
              fontSize: 12.5,
            }}
          />
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                <th style={{ textAlign: "left", padding: "8px 10px" }}>ISO Code & Name</th>
                <th style={{ textAlign: "left", padding: "8px 10px" }}>Symbol</th>
                <th style={{ textAlign: "left", padding: "8px 10px" }}>Precision</th>
                <th style={{ textAlign: "left", padding: "8px 10px" }}>Supported Regions</th>
                <th style={{ textAlign: "left", padding: "8px 10px" }}>Status</th>
                <th style={{ textAlign: "right", padding: "8px 10px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCurrencies.map((cur: CurrencyConfigRecord) => (
                <tr key={cur.code} style={{ borderBottom: "1px solid var(--border-light)" }}>
                  <td style={{ padding: "9px 10px", fontWeight: 700, color: "var(--text-main)" }}>
                    {cur.code} — {cur.name}{" "}
                    {cur.isPlatformDisplayDefault && (
                      <span
                        style={{
                          marginLeft: 6,
                          fontSize: 10.5,
                          background: "var(--bg-active)",
                          color: "var(--primary)",
                          padding: "2px 7px",
                          borderRadius: 999,
                        }}
                      >
                        Display Default
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "9px 10px" }}>{cur.symbol}</td>
                  <td style={{ padding: "9px 10px" }}>{cur.decimalPrecision} decimals</td>
                  <td style={{ padding: "9px 10px", fontSize: 11.5 }}>{cur.supportedRegions.join(", ")}</td>
                  <td style={{ padding: "9px 10px" }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: cur.isAvailable ? "var(--status-success)" : "var(--status-error)",
                        background: cur.isAvailable ? "var(--status-success-bg)" : "var(--status-error-bg)",
                        padding: "2px 8px",
                        borderRadius: 999,
                      }}
                    >
                      {cur.isAvailable ? "Available" : "Disabled"}
                    </span>
                  </td>
                  <td style={{ padding: "9px 10px", textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: 6 }}>
                      {!cur.isPlatformDisplayDefault && cur.isAvailable && (
                        <button
                          type="button"
                          disabled={!canEditCurrency}
                          onClick={() =>
                            onRequestConfirm({
                              title: `Change Platform Display Default to ${cur.code}?`,
                              description: "Updates default currency formatting across unlocalized dashboards.",
                              impactWarning:
                                "Does NOT rewrite past transactions or subscription plan prices billed in native store currencies.",
                              allowTwoPersonStage: true,
                              confirmLabel: `Set ${cur.code} Default`,
                              onConfirm: ({ reason }) => onSetDefaultCurrency(cur.code, reason),
                            })
                          }
                          style={{
                            padding: "4px 9px",
                            borderRadius: 7,
                            border: "1px solid var(--border)",
                            background: "var(--bg-surface-elevated)",
                            color: "var(--primary)",
                            fontSize: 11,
                            fontWeight: 700,
                            cursor: canEditCurrency ? "pointer" : "not-allowed",
                          }}
                        >
                          Make Default
                        </button>
                      )}
                      {!cur.isPlatformDisplayDefault && (
                        <button
                          type="button"
                          disabled={!canEditCurrency}
                          onClick={() =>
                            onRequestConfirm({
                              title: `${cur.isAvailable ? "Deactivate" : "Activate"} ${cur.code}?`,
                              description: `Toggle transaction availability for ${cur.name}.`,
                              confirmLabel: cur.isAvailable ? "Deactivate" : "Activate",
                              danger: cur.isAvailable,
                              onConfirm: ({ reason }) => onToggleCurrency(cur.code, reason),
                            })
                          }
                          style={{
                            padding: "4px 9px",
                            borderRadius: 7,
                            border: "1px solid var(--border)",
                            background: "var(--bg-surface)",
                            color: "var(--text-main)",
                            fontSize: 11,
                            fontWeight: 600,
                            cursor: canEditCurrency ? "pointer" : "not-allowed",
                          }}
                        >
                          {cur.isAvailable ? "Disable" : "Enable"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* C & D. Honest Exchange Rate Visibility */}
      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <ArrowRightLeft size={18} style={{ color: "var(--accent-champagne)" }} />
          <h3 style={{ margin: 0, fontSize: 16, color: "var(--text-main)" }}>
            C & D. Exchange Rate Feed Status (No Fabricated Rates)
          </h3>
        </div>
        <p style={{ margin: "0 0 12px", fontSize: 12, color: "var(--text-secondary)" }}>
          No live FX ticker backend is connected yet; pairs below honestly disclose `Unavailable`
          rather than inventing conversion multipliers.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {state.exchangeRates.map((fx) => (
            <div
              key={fx.id}
              style={{
                padding: 12,
                borderRadius: 12,
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border-light)",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text-main)" }}>
                  {fx.baseCurrency} / {fx.quoteCurrency}
                </div>
                <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                  Provider: {fx.provider} • {fx.statusLabel}
                </div>
              </div>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "var(--status-warning)",
                  background: "var(--status-warning-bg)",
                  padding: "3px 9px",
                  borderRadius: 999,
                }}
              >
                <AlertTriangle size={11} />
                {fx.rateSource}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

