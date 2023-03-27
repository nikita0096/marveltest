import { Component } from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/errorMessage';

import './charList.scss';

class CharList extends Component {
    state = {
        chars: [],
        loading: true,
        error: false,
        newCharLoading: false,
        offset: 210,
        endedOffset: false,
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.onRequest();

        window.addEventListener('scroll', this.onScrollLoading);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScrollLoading);
    }

    onScrollLoading = () => {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
            this.onRequest(this.state.offset);
        }
    }

    onRequest = (offset) => {
        this.onNewCharsLoading();

        this.marvelService
            .getAllCharacters(offset)
                .then(this.onCharsLoaded)
                .catch(this.onError);
    }

    onNewCharsLoading = () => {
        this.setState({
            newCharLoading: true
        })
    }

    onCharsLoaded = (newChars) => {
        let ended = false;
        if (newChars.length < 9) {
            ended = true;
        }

        this.setState(({chars, offset}) => ({
            chars: [...chars, ...newChars],
            loading: false,
            newCharLoading: false,
            offset: offset + 9,
            endedOffset: ended
        }));
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    itemRefs = [];

    setItemRef = (ref) => {
        this.itemRefs.push(ref)
    }

    focusOnItem = (id) => {
        this.itemRefs.forEach(ref => ref.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }

    createElements = (arr) => {
        const elements = arr.map((char, i) => {
            let imgStyle = {'objectFit' : 'cover'}
            if (char.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'}
            }

            return (
                <li 
                className="char__item"
                tabIndex={0}
                ref={this.setItemRef}
                key={char.id}
                onClick={()=> {this.props.onCharSelected(char.id);
                            this.focusOnItem(i)}}
                onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                        this.props.onCharSelected(char.id)
                        this.focusOnItem(i);
                    }
                }}>
                    <img src={char.thumbnail} alt={char.name} style={imgStyle}/>
                    <div className="char__name">{char.name}</div>
                </li>
            )
        })
        return (
            <ul className="char__grid">
                {elements}
            </ul>
        )
    }

    render () {
        const {chars, loading, error, offset, newCharLoading, endedOffset} = this.state;
        const content = this.createElements(chars);
        const spinner = loading ? <Spinner/> : null;
        const errorMessage = error ? <ErrorMessage/> : null;
        const items = !(loading || error) ? content : null;
        return (
            <div className="char__list">
                {spinner}
                {errorMessage}
                {items}
                <button className="button button__main button__long"
                                disabled={newCharLoading}
                                style={{'display' : endedOffset ? 'none' : 'block'}}
                                onClick={()=> this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;