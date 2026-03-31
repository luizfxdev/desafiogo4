package main

import (
	"github.com/gin-gonic/gin"

	"desafiog03/backend/config"
	"desafiog03/backend/middleware"
	"desafiog03/backend/routes"
)

func main() {
	cfg := config.Load()

	r := gin.Default()
	r.Use(middleware.CORS())

	routes.Register(r)

	r.Run(":" + cfg.Port)
}
