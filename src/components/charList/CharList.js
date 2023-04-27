import { useState, useEffect, useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/errorMessage';

import './charList.scss';

const CharList = (props) => {
    const [chars, setChars] = useState([]);
    const [newCharLoading, setNewCharLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [endedOffset, setEndedOffset] = useState(false);

    const {loading, error, getAllCharacters} = useMarvelService();

    useEffect(()=> {
        onRequest();

        // window.addEventListener('scroll', onScrollLoading);

        // return () => {window.removeEventListener('scroll', onScrollLoading);}
    }, [])

    const onScrollLoading = () => {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
            onRequest(offset);
        }
    }

    const onRequest = (offset) => {
        setNewCharLoading(true);

        getAllCharacters(offset)
                .then(onCharsLoaded);
    }

    const onCharsLoaded = (newChars) => {
        let ended = false;
        if (newChars.length < 9) {
            ended = true;
        }

        setChars(chars => [...chars, ...newChars]);
        setNewCharLoading(newCharLoading => false);
        setOffset(offset => offset + 9);
        setEndedOffset(ended);
    }

    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        itemRefs.current.forEach(ref => ref.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    function createElements(arr) {
        const elements = arr.map((char, i) => {
            let imgStyle = {'objectFit' : 'cover'}
            if (char.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'}
            }

            return (
                <CSSTransition key={char.id} timeout={500} classNames="char__item">
                    <li 
                    className="char__item"
                    tabIndex={0}
                    ref={el => itemRefs.current[i] = el}
                    onClick={()=> {props.onCharSelected(char.id);
                                focusOnItem(i)}}
                    onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                            props.onCharSelected(char.id)
                            focusOnItem(i);
                        }
                    }}>
                        <img src={char.thumbnail} alt={char.name} style={imgStyle}/>
                        <div className="char__name">{char.name}</div>
                    </li>
                </CSSTransition>
            )
        })
        return (
            <ul className="char__grid">
                <TransitionGroup component={null}>
                    {elements}
                </TransitionGroup>
            </ul>
        )
    }

    const items = createElements(chars);
    const spinner = loading ? <Spinner/> : null;
    const errorMessage = error ? <ErrorMessage/> : null;
    
    return (
        <div className="char__list">
            {spinner}
            {errorMessage}
            {items}
            <button className="button button__main button__long"
                            disabled={newCharLoading}
                            style={{'display' : endedOffset ? 'none' : 'block'}}
                            onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;