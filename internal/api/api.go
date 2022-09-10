package api

import (
	"net/http"

	"github.com/Pingoin/pingoscope/internal/store"
	"github.com/Pingoin/pingoscope/pkg/altazdriver"
	"github.com/Pingoin/pingoscope/pkg/position"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

var altAzDriver *altazdriver.AltAzDriver
var storeFiles *store.Store

func HandleRequests(port string, altazdriverNew *altazdriver.AltAzDriver, storeNew *store.Store) {
	altAzDriver = altazdriverNew
	storeFiles = storeNew

	// Echo instance
	e := echo.New()

	// Middleware
	//e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.Gzip())
	e.Use(middleware.RemoveTrailingSlash())

	// Routes
	e.Static("/", "frontend/dist")
	e.POST("/api/target", setTarget)
	e.GET("/api/driver", getDriver)
	e.GET("/api/sensor", getSensor)
	e.GET("/api/store", getStore)
	e.GET("/api/image", getImage)

	e.Logger.Fatal(e.Start(port))
}

func getDriver(c echo.Context) error {
	return c.JSON(http.StatusAccepted, altAzDriver.GetData())
}
func getSensor(c echo.Context) error {
	return c.JSON(http.StatusAccepted, storeFiles.GetData().SensorPosition)
}

func getStore(c echo.Context) error {
	altAzDriver.GetData()
	return c.JSON(http.StatusAccepted, storeFiles.GetData())
}

func getImage(c echo.Context) error {
	return c.String(http.StatusAccepted, storeFiles.Image)
}

func setTarget(c echo.Context) error {
	position := new(position.Position)
	if err := c.Bind(position); err != nil {
		return err
	}
	altAzDriver.Azimuth.SetTarget(float64(position.Azimuth))
	altAzDriver.Altitude.SetTarget(float64(position.Altitude))
	return c.JSON(http.StatusCreated, position)
}
