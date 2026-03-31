package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"

	"desafiog03/backend/models"
)

var musicFiles = []struct {
	file string
}{
	{"music1.json"},
	{"music2.json"},
	{"music3.json"},
	{"music4.json"},
	{"music5.json"},
}

func loadMusic(filename string) (*models.Music, error) {
	data, err := os.ReadFile("data/" + filename)
	if err != nil {
		return nil, fmt.Errorf("erro ao ler arquivo %s: %w", filename, err)
	}

	var music models.Music
	if err := json.Unmarshal(data, &music); err != nil {
		return nil, fmt.Errorf("erro ao desempacotar %s: %w", filename, err)
	}

	return &music, nil
}

func GetAllMusics(c *gin.Context) {
	var musics []models.Music

	for _, f := range musicFiles {
		m, err := loadMusic(f.file)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		musics = append(musics, *m)
	}

	c.JSON(http.StatusOK, musics)
}

func GetMusicByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	if id < 1 || id > len(musicFiles) {
		c.JSON(http.StatusNotFound, gin.H{"error": "Música não encontrada"})
		return
	}

	music, err := loadMusic(musicFiles[id-1].file)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, music)
}
