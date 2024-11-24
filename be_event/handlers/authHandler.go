package handlers

import (
	"be_event/models"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

type AuthHandler struct {
	db     *mongo.Collection
	jwtKey []byte
}

func NewAuthHandler(db *mongo.Collection, jwtKey []byte) *AuthHandler {
	return &AuthHandler{
		db:     db,
		jwtKey: jwtKey,
	}
}

func (a *AuthHandler) Register(c *gin.Context) {
	var req models.User

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error hashing password"})
		return
	}
	req.Password = string(hashedPassword)

	req.ID = primitive.NewObjectID()
	_, err = a.db.InsertOne(c, req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error saving user"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User registered successfully"})
}

func (a *AuthHandler) Login(c *gin.Context) {
	var req struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// Find the user in the database
	var user models.User
	err := a.db.FindOne(c, bson.M{"username": req.Username}).Decode(&user)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Check the password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Generate JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":   user.ID.Hex(),
		"role": user.Role,
		"exp":  time.Now().Add(time.Hour * 24).Unix(),
	})
	tokenString, err := token.SignedString(a.jwtKey)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error generating token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Login successful", "token": tokenString})
}

func(a *AuthHandler) Me(c *gin.Context) {
	userId, _ := c.Get("userID")

	userIdMongo, _ := primitive.ObjectIDFromHex(userId.(string))
	var user models.User
	err := a.db.FindOne(c, bson.M{"_id": userIdMongo}).Decode(&user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "get user"})
		return
	}
	
	c.JSON(http.StatusOK, user)
}

func (a *AuthHandler) ListAllVendor(c *gin.Context) {
	cursor, err := a.db.Find(c, bson.M{"role": "Vendor"})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "error while get all data vendors",
		})
		return
	}
	var vendors []models.User
	err = cursor.All(c, &vendors)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "error while get all data vendors",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": vendors})
}
