package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// CheckResponse represents the output of an healthcheck
type CheckResponse struct {
	Status string `json:"status"`
}

// Check performs a health check
func Check(c *gin.Context) {
	c.JSON(http.StatusOK, &CheckResponse{Status: "healthy"})
}
