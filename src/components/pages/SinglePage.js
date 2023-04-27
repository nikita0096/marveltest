// import './singleComicPage.scss';
import useMarvelService from '../../services/MarvelService';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import AppBanner from "../appBanner/AppBanner";
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/errorMessage';

const SinglePage = ({Component, dataType}) => {
    const [data, setData] = useState({});
    const {loading, error, getComic, getCharacter, cleareError} = useMarvelService();

    const {id} = useParams();

    useEffect(() => {
        onRequest();
    }, [id])

    const onRequest = () => {
        cleareError();

        switch (dataType) {
            case 'comic':
                getComic(id)
                        .then(onLoadData);
            break;
            case 'character':
                getCharacter(id)
                        .then(onLoadData);
            break;
        }
    }

    const onLoadData = (newData) => {
        setData(newData);
    }

    const spinner = loading ? <Spinner/> : null;
    const errMessage = error ? <ErrorMessage/> : null;
    const item = !(loading || error || !data) ? <Component data={data}/> : null;

    return (
        <>
            <AppBanner/>
            {spinner}
            {errMessage}
            {item}
        </>
    )
}

// const View = ({comic}) => {
//     const {src, title, descr, pages, lang, price} = comic;


//     return (
//         <div className="single-comic">
//             <img src={src} alt={title} className="single-comic__img"/>
//             <div className="single-comic__info">
//                 <h2 className="single-comic__name">{title}</h2>
//             <p className="single-comic__descr">{descr}</p>
//                 <p className="single-comic__descr">{pages}</p>
//                 <p className="single-comic__descr">{lang}</p>
//                 <div className="single-comic__price">{price}$</div>
//             </div>
//             <Link to="/comics" className="single-comic__back">Back to all</Link>
//         </div>
//     )
// }

export default SinglePage;