package main

import (
	"be_event/handlers"
	"be_event/routes"
	"be_event/storage"
	"log"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

var port = ":3333"
var secretKey = "very_secret_key"

func main() {
	db, err := storage.ConnectDb()
	if err != nil {
		log.Fatalf("Error while connect to database: %v", err)
		panic(err)
	}

	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"}, 
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"}, 
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"}, 
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	eventCollection := db.Collection("event")
	eventHandler := handlers.NewEventHandler(eventCollection)

	authCollection := db.Collection("user")
	authHandler := handlers.NewAuthHandler(authCollection, []byte(secretKey))

	routes.SetupRouter(r, eventHandler, authHandler, []byte(secretKey))

	log.Printf("Server running on port %s\n", port)

	r.Run(port)
}
