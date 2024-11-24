package handlers

import (
	"be_event/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type EventHandler struct {
	db *mongo.Collection
}

func NewEventHandler(db *mongo.Collection) *EventHandler {
	return &EventHandler{
		db: db,
	}
}

func (e *EventHandler) CreateEvent(c *gin.Context) {
	var req models.Event
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "invalid input"})
		return
	}

	req.DateCreated = time.Now()
	req.Status = "Pending"

	res, err := e.db.InsertOne(c, &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "error create event"})
		return
	}
	c.JSON(http.StatusCreated, res)
}

func (e *EventHandler) GetEvents(c *gin.Context) {
	vendorID, _ := c.Get("userID")
	role, _ := c.Get("role")
	status := c.Query("status")

	filter := bson.M{}

	if role == "Vendor" {
		filter = bson.M{"vendor_id": vendorID}
	}

	if status != "" {
		filter = bson.M{"status": status}
	}

	cursor, err := e.db.Find(c, filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "error while get all data events",
		})
		return
	}

	var events []models.Event
	err = cursor.All(c, &events)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "error while get all data events",
		})
		return
	}
	c.JSON(http.StatusOK, events)
}

func (e *EventHandler) DeleteEvent(c *gin.Context) {
	id := c.Param("id")

	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid event ID"})
		return
	}

	res, err := e.db.DeleteOne(c, bson.M{"_id": objectID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error deleting event"})
		return
	}

	if res.DeletedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "Event not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Event deleted successfully", "data": res})
}

func (e *EventHandler) ApproveEvent(c *gin.Context) {
	id := c.Param("id")
	var request struct {
		ConfirmedDate string `json:"confirmed_date"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "id not valid"})
		return
	}

	updatedPayload := bson.M{"status": "Approved", "confirmed_date": request.ConfirmedDate}

	res, err := e.db.UpdateOne(c, bson.M{"_id": objectID}, bson.M{"$set": updatedPayload})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "error update status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Event approved successfully", "data": res})
}

func (e *EventHandler) RejectEvent(c *gin.Context) {
	id := c.Param("id")
	var request struct {
		Remarks string `json:"remarks"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "id not valid"})
		return
	}

	updatedPayload := bson.M{"status": "Rejected", "remarks": request.Remarks}

	res, err := e.db.UpdateOne(c, bson.M{"_id": objectID}, bson.M{"$set": updatedPayload})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "error update status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Event approved successfully", "data": res})
}
