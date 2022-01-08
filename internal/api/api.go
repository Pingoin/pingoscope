package api

import (
	"net/http"

	"github.com/Pingoin/pingoscope/internal/altazdriver"
	"github.com/Pingoin/pingoscope/pkg/position"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

var altAzDriver *altazdriver.AltAzDriver
var sensorPosition *position.Position

func HandleRequests(port string, altazdriverNew *altazdriver.AltAzDriver, sensPosNew *position.Position) {
	altAzDriver = altazdriverNew
	sensorPosition = sensPosNew

	// Echo instance
	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.Gzip())
	e.Use(middleware.RemoveTrailingSlash())

	// Routes
	e.Static("/", "frontend/dist")
	e.POST("/target", setTarget)
	e.GET("/driver", getDriver)
	e.GET("/sensor", getSensor)

	e.Logger.Fatal(e.Start(port))
}

func getDriver(c echo.Context) error {
	return c.JSON(http.StatusAccepted, altAzDriver.GetData())
}
func getSensor(c echo.Context) error {
	return c.JSON(http.StatusAccepted, sensorPosition)
}

func setTarget(c echo.Context) error {
	position := new(position.Position)
	if err := c.Bind(position); err != nil {
		return err
	}
	altAzDriver.Azimuth.SetTarget(float64(position.Azimuth))
	return c.JSON(http.StatusCreated, position)
}
