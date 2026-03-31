package routes

import (
	"github.com/gin-gonic/gin"

	"desafiog03/backend/handlers"
)

func Register(r *gin.Engine) {
	api := r.Group("/api")
	{
		api.GET("/musics", handlers.GetAllMusics)
		api.GET("/musics/:id", handlers.GetMusicByID)
		api.GET("/audio/:filename", handlers.GetAudioFile)
	}
}
