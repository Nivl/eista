package handlers_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/Nivl/eista-api/services/health/handlers"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestCheck(t *testing.T) {
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)

	handlers.Check(c)
	assert.Equal(t, http.StatusOK, w.Code)

	var resp *handlers.CheckResponse
	err := json.NewDecoder(w.Body).Decode(&resp)
	require.NoError(t, err, "the response couldn't be parsed")

	assert.Equal(t, "healthy", resp.Status, "invalid status provided")
}
