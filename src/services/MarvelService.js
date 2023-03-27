class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=8f882ea2e56328f66bb6f563279f6096';
    _baseOffset = 210;

    getResourse = async (url) => {
        const result = await fetch(url);
    
        if(!result.ok) {
            throw new Error(`Clould not fetch ${url}, status: ${result.status}`);
        }
    
        return await result.json();
    };

    getAllCharacters = async (offset = this._baseOffset) => {
        const res = await this.getResourse(`${this._apiBase}characters?limit=9&offset=${offset}}&${this._apiKey}`);
        return res.data.results.map(this._tranformCharacter);
    }

    getCharacter = async (id) => {
        const res = await this.getResourse(`${this._apiBase}characters/${id}?${this._apiKey}`);
        return this._tranformCharacter(res.data.results[0]);
    }

    _tranformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description ? `${char.description.slice(0, 200)}...` : 'There is no description for this character',
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items,
            }
    }
}

export default MarvelService;