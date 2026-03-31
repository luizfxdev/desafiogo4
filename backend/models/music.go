package models

type Producao struct {
	Produtor  string `json:"produtor"`
	Pais      string `json:"pais"`
	Gravadora string `json:"gravadora"`
}

type Music struct {
	ID                 int      `json:"id"`
	Titulo             string   `json:"titulo"`
	Artista            string   `json:"artista"`
	Genero             string   `json:"genero"`
	Duracao            string   `json:"duracao"`
	BPM                int      `json:"bpm"`
	Ano                int      `json:"ano"`
	Producao           Producao `json:"producao"`
	Instrumentos       []string `json:"instrumentos"`
	Ambiente           string   `json:"ambiente"`
	CoresPredominantes []string `json:"cores_predominantes"`
	ArquivoMP3         string   `json:"arquivo_mp3"`
}
