import './comicsList.scss';

import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useMarvelService from '../../services/MarvelService';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/errorMessage';

const ComicsList = () => {
    const [comics, setComics] = useState([]);
    const [offset, setOffset] = useState(2);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [endedOffset, setEndedOffset] = useState(false);

    const {loading, error, getComics, cleareError} = useMarvelService();

    useEffect(() => {
        onRequestComics();
    }, [])

    const onRequestComics = (offset) => {
        setNewItemLoading(true);

        cleareError();

        getComics(offset)
            .then(onComicsLoaded);
    }

    const onComicsLoaded = (newComics) => {
        let ended = false;
        if (newComics.length < 8) {
            ended = true;
        }
        
        setComics([...comics, ...newComics]);
        setOffset(offset => offset + 8);
        setNewItemLoading(false);
        setEndedOffset(ended);
    }

    const createElemets = () => {
        const elements = comics.map((item, i) => {
            const {src, title, price, id} = item;

            let imgStyle = {'objectFit': 'cover'};
            if (src === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg") {
                imgStyle = {'objectFit': 'unset'};
            }

            return (
                <li className="comics__item"
                    key={i}>
                    <Link to={`/comics/${id}`}>
                        <img src={src} alt={title} style={imgStyle} className="comics__item-img"/>
                        <div className="comics__item-name">{title}</div>
                        <div className="comics__item-price">{price}$</div>
                    </Link>
                </li>
            )
        })

        return (
            <ul className="comics__grid">
                {elements}
            </ul>
        )
    }

    const items = createElemets();

    const spinner = loading ? <Spinner/> : null;
    const errMessage = error ? <ErrorMessage/> : null;

    return (
        <div className="comics__list">
            {spinner}
            {errMessage}
            {items}
            <button className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display': endedOffset ? 'none' : 'block'}}
                    onClick={() => onRequestComics(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;