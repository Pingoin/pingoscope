package position

type Position struct {
	Altitude float32 `json:"alt"`
	Azimuth  float32 `json:"az"`
}

type StellarPositionData struct {
	Equatorial EqPos    `json:"equatorial"`
	Horizontal AltAzPos `json:"horizontal"`
}

type EqPos struct {
	Declination    float64 `json:"declination"`
	RightAscension float64 `json:"rightAscension"`
}

type AltAzPos struct {
	Altitude float64 `json:"altitude"`
	Azimuth  float64 `json:"azimuth"`
}
