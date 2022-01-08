package api

import (
	"embed"
	"encoding/json"
	"fmt"
	"io/fs"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"

	"github.com/Pingoin/pingoscope/internal/altazdriver"
	"github.com/Pingoin/pingoscope/pkg/position"
	"github.com/gorilla/mux"
)

var altAzDriver *altazdriver.AltAzDriver
var sensorPosition *position.Position

//go:generate cp -r ../../frontend/dist frontend
//go:embed frontend
var frontend embed.FS

type Article struct {
	Id      string `json:"Id"`
	Title   string `json:"Title"`
	Desc    string `json:"desc"`
	Content string `json:"content"`
}

var Articles []Article

func HandleRequests(port string, altazdriverNew *altazdriver.AltAzDriver, sensPosNew *position.Position) {
	altAzDriver = altazdriverNew
	sensorPosition = sensPosNew

	stripped, err := fs.Sub(frontend, "frontend/dist")
	if err != nil {
		log.Fatalln(err)
	}

	frontendFS := http.FileServer(http.FS(stripped))
	Articles = []Article{
		{Id: "1", Title: "Hello", Desc: "Article Description", Content: "Article Content"},
		{Id: "2", Title: "Hello 2", Desc: "Article Description", Content: "Article Content"},
	}
	myRouter := mux.NewRouter().StrictSlash(true)
	myRouter.PathPrefix("/").Handler(frontendFS)
	myRouter.HandleFunc("/target", setTarget).Methods("POST")
	myRouter.HandleFunc("/driver", getDriver)
	myRouter.HandleFunc("/sensor", getSensor)
	myRouter.HandleFunc("/articles", returnAllArticles)
	myRouter.HandleFunc("/article", createNewArticle).Methods("POST")
	myRouter.HandleFunc("/article/{id}", deleteArticle).Methods("DELETE")
	myRouter.HandleFunc("/article/{id}", returnSingleArticle)
	log.Fatal(http.ListenAndServe(port, myRouter))
}

func getDriver(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(altAzDriver.GetData())
}
func getSensor(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(sensorPosition)
}
func returnAllArticles(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Endpoint Hit: returnAllArticles")
	json.NewEncoder(w).Encode(Articles)
}

func returnSingleArticle(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	key := vars["id"]
	u, err := strconv.ParseFloat(key, 32)
	if err != nil {
		panic(err)
	}
	altAzDriver.Azimuth.SetMaxSpeed(u)
	for _, article := range Articles {
		if article.Id == key {
			json.NewEncoder(w).Encode(article)
		}
	}
}

func createNewArticle(w http.ResponseWriter, r *http.Request) {
	// get the body of our POST request
	// unmarshal this into a new Article struct
	// append this to our Articles array.
	reqBody, _ := ioutil.ReadAll(r.Body)
	var article Article
	json.Unmarshal(reqBody, &article)
	// update our global Articles array to include
	// our new Article
	Articles = append(Articles, article)

	json.NewEncoder(w).Encode(article)
}

func deleteArticle(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	for index, article := range Articles {
		if article.Id == id {
			Articles = append(Articles[:index], Articles[index+1:]...)
		}
	}

}

func setTarget(w http.ResponseWriter, r *http.Request) {
	// get the body of our POST request
	// unmarshal this into a new Article struct
	// append this to our Articles array.
	reqBody, _ := ioutil.ReadAll(r.Body)
	var position position.Position
	json.Unmarshal(reqBody, &position)
	altAzDriver.Azimuth.SetTarget(float64(position.Azimuth))

	fmt.Printf("bla: %v", position)
	json.NewEncoder(w).Encode(position)
}
