package gnss

type GnssData struct {
	Alt                float64   `json:"alt"`
	SatsGpsVisible     []GSVInfo `json:"satsGpsVisible"`
	SatsGlonassVisible []GSVInfo `json:"satsGlonassVisible"`
	SatsGalileoVisible []GSVInfo `json:"satsGalileoVisible"`
	SatsBeidouVisible  []GSVInfo `json:"satsBeidouVisible"`
	Fix                string    `json:"fix"`
	Hdop               float64   `json:"hdop"`
	Pdop               float64   `json:"pdop"`
	Vdop               float64   `json:"vdop"`
}

type GSVInfo struct {
	SVPRNNumber float64 `json:"prn"`       // SV PRN number, pseudo-random noise or gold code
	Elevation   float64 `json:"elevation"` // Elevation in degrees, 90 maximum
	Azimuth     float64 `json:"azimuth"`   // Azimuth, degrees from true north, 000 to 359
	SNR         float64 `json:"snr"`       // SNR, 00-99 dB (null when not tracking)
	Used        bool    `json:"used"`
}
