package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Event struct {
	ID               primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	CompanyName      string             `bson:"company_name" json:"company_name"`
	ProposedDates    []string           `bson:"proposed_dates" json:"proposed_dates"`
	ProposedLocation string             `bson:"proposed_location" json:"proposed_location"`
	EventName        string             `bson:"event_name" json:"event_name"`
	Status           string             `bson:"status" json:"status"`
	Remarks          string             `bson:"remarks" json:"remarks,omitempty"`
	ConfirmedDate    string             `bson:"confirmed_date" json:"confirmed_date,omitempty"`
	DateCreated      time.Time          `bson:"date_created" json:"date_created"`
	VendorID         string             `bson:"vendor_id" json:"vendor_id"`
}
