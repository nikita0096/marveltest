import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=8f882ea2e56328f66bb6f563279f6096';
    const _baseOffset = 210;
    const _offsetComics = 2;

    const {loading, error, request, cleareError} = useHttp();

    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}}&${_apiKey}`);
        return res.data.results.map(_tranformCharacter);
    }

    const getCharByName = async (name) => {
        const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`);
        return res.data.results.map(_tranformCharacter);
        
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _tranformCharacter(res.data.results[0]);
    }

    const getComics = async (offset = _offsetComics) => {
        const response = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`);
        return response.data.results.map(_tranformComic);
    }

    const getComic = async (id) => {
        const response = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _tranformComic(response.data.results[0]);
    }

    const _tranformComic = (comic) => {
        return {
            id: comic.id,
            src: comic.thumbnail.path + '.' + comic.thumbnail.extension,
            title: comic.title,
            price: comic.prices[0].price ? comic.prices[0].price : 'Not availeble',
            descr: comic.description ? comic.description.slice(0, 400) + '...' : 'There is no description for this comic',
            pages: comic.pageCount ? `${comic.pageCount} p.` : 'No information about a page amount',
            lang: comic.textObjects[0]?.language || "en-us"

        }
    }

    const _tranformCharacter = (char) => {
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

    return {loading, error, cleareError, getCharacter, getAllCharacters, getComic, getComics, getCharByName};
}

export default useMarvelService;