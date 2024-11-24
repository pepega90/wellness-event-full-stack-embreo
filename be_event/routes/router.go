package routes

import (
	"be_event/handlers"
	"be_event/middlewares"

	"github.com/gin-gonic/gin"
)

func SetupRouter(r *gin.Engine, eventHandler *handlers.EventHandler, authHandler *handlers.AuthHandler, secretKey []byte) {
	// auth handler
	r.POST("/register", authHandler.Register)
	r.POST("/login", authHandler.Login)
	r.GET("/vendors", authHandler.ListAllVendor)

	// event handler
	r.Use(middlewares.AuthMiddleware(secretKey))
	r.GET("/me", authHandler.Me)
	r.GET("/events", eventHandler.GetEvents)
	r.POST("/events", eventHandler.CreateEvent)
	r.PUT("/event/:id/approve", eventHandler.ApproveEvent)
	r.PUT("/event/:id/reject", eventHandler.RejectEvent)
	r.DELETE("/event/:id", eventHandler.DeleteEvent)
}
