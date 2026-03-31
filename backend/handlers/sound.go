package handlers

import (
	"net/http"
	"net/url"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

var allowedFiles = map[string]bool{
	"Alok - Jungle.mp3":                true,
	"Animals - Martin Garrix.mp3":      true,
	"Benny Benassi - Satisfaction.mp3": true,
	"Eli Brown - Be The One.mp3":       true,
	"Tiësto - Mockingbird.mp3":         true,
}

func GetAudioFile(c *gin.Context) {
	encoded := c.Param("filename")
	filename, err := url.PathUnescape(encoded)
	if err != nil || !allowedFiles[filename] {
		c.JSON(http.StatusNotFound, gin.H{"error": "Arquivo não encontrado"})
		return
	}

	path := filepath.Join("assets", filename)
	c.File(path)
}
