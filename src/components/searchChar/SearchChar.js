import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage as FormikErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import ErrorMessage from '../errorMessage/errorMessage';
import useMarvelService from '../../services/MarvelService';

import './searchChar.scss';


const SearchChar = () => {
    const [char, setChar] = useState(null);
    const {getCharByName, loading, error, cleareError} = useMarvelService();

    const onCharLoaded = (char) => {
        setChar(char);
    }

    const updateChar = (name) => {
        cleareError();

        getCharByName(name)
            .then(onCharLoaded);
    }

    const errorMessage = error ? <div className="char__search-critical-error"><ErrorMessage /></div> : null;
    const result = !char ? null : char.length > 0 ? 
                    <div className="char__search_wrapper">
                        <div className="char__search-success">`There is! Visit ${char[0].name} page?`</div>
                        <Link to={`/characters/${char[0].id}`} className='button button__secondary'>
                            <div className="inner">TO PAGE</div>
                        </Link>
                    </div> :
                    <div className="char__search-error">
                        The character was not found. Check the name and try again
                    </div>;

    return (
        <div className="char__search">
            <Formik
                initialValues = {{
                    charName: ''
                }}
                validationSchema = {Yup.object({
                    charName: Yup.string().required('This field is required')
                })}
                onSubmit = { ({charName}) => {updateChar(charName)}}>
                <Form>
                    <label className='char__search_label' htmlFor="charName">Or find a character by name:</label>
                    <div className="char__search_wrapper">
                        <Field className='char__search_input'
                                id = "charName" 
                                type="text" 
                                name="charName"
                                placeholder="Enter name"
                                />
                        <button className='button button__main' 
                                type="submit"
                                disabled={loading}
                                >
                                <div className='inner'>FIND</div>
                        </button>
                    </div>
                    <FormikErrorMessage component="div" className="char__search-error" name="charName" />
                </Form>
            </Formik>
            {result}
            {errorMessage}
        </div>
    )
}

export default SearchChar;